// Export the showreel HTML to MP4, frame by frame.
//
// Usage (from any directory): node export.mjs [16x9|9x16|all]
// Input:  gentle-shell.html next to this script (must expose window.Showreel, see prompt.md)
//         optional voice/01.mp3 ... voice/09.mp3 (ElevenLabs lines), which win over embedded audio
// Output: clean out/gentle-shell-<format>-none.mp4; deliver adjacent EN/ES SRT separately
// Needs:  ffmpeg and ffprobe on PATH, puppeteer-core (local or global), Chrome or Edge.
import { spawn, execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const html = join(here, 'gentle-shell.html');
const voiceDir = join(here, 'voice');
const outDir = join(here, 'out');
// Narration start times in seconds; they match prompt.md and both adjacent SRT files.
const cueStarts = [0.4, 5.2, 10.2, 15.2, 20.2, 25.2, 30.2, 35.2, 40.2];

const [formatArg = 'all', subs = 'none', ...extra] = process.argv.slice(2);
const formats = formatArg === 'all' ? ['16x9', '9x16'] : [formatArg];
if (!formats.every(f => f === '16x9' || f === '9x16')) fail('format must be 16x9, 9x16 or all');
if (subs !== 'none' || extra.length) fail('video is always caption-free; use adjacent subtitles.en.srt or subtitles.es.srt');
if (!existsSync(html)) fail(`save the HTML as ${html}`);

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

function loadPuppeteer() {
  const local = createRequire(import.meta.url);
  try { return local('puppeteer-core'); } catch {}
  const globalRoot = execFileSync('npm root -g', { encoding: 'utf8', shell: true }).trim();
  try { return createRequire(join(globalRoot, 'noop.js'))('puppeteer-core'); } catch {}
  fail('puppeteer-core not found; install it with: npm install -g puppeteer-core');
}

function findBrowser() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ];
  return candidates.find(p => p && existsSync(p)) ?? fail('Chrome or Edge not found; set CHROME_PATH');
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'inherit'] });
    let out = '';
    child.stdout.on('data', d => { out += d; });
    child.on('close', code => (code === 0 ? resolve(out) : reject(new Error(`${cmd} exited with ${code}`))));
  });
}

// Returns ffmpeg input arguments and the filter that yields [a], a duration-matched stereo track.
function audioPlan(embedded, work, duration) {
  const lines = cueStarts.map((_, i) => join(voiceDir, `${String(i + 1).padStart(2, '0')}.mp3`));
  const found = lines.filter(existsSync);
  const tail = `aresample=48000,aformat=channel_layouts=stereo,apad,atrim=0:${duration}[a]`;
  if (found.length) {
    if (found.length < lines.length) console.warn(`warning: ${lines.length - found.length} voice lines missing`);
    const inputs = [], parts = [];
    lines.forEach((file, i) => {
      if (!existsSync(file)) return;
      inputs.push('-i', file);
      const ms = Math.round(cueStarts[i] * 1000);
      parts.push(`[${parts.length + 1}:a]aformat=channel_layouts=stereo,adelay=${ms}:all=1[v${parts.length}]`);
    });
    const mix = parts.map((_, i) => `[v${i}]`).join('');
    return { source: 'voice/ lines', inputs, filter: `${parts.join(';')};${mix}amix=inputs=${parts.length}:normalize=0,${tail}` };
  }
  if (embedded) {
    const [, ext = 'bin'] = /^data:audio\/([a-z0-9.+-]+)/i.exec(embedded) ?? [];
    const file = join(work, `embedded.${ext.replace('mpeg', 'mp3')}`);
    writeFileSync(file, Buffer.from(embedded.split(',')[1], 'base64'));
    return { source: 'embedded Showreel.audio', inputs: ['-i', file], filter: `[1:a]${tail}` };
  }
  return { source: 'silence', inputs: ['-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo'], filter: `[1:a]${tail}` };
}

async function exportFormat(browser, format) {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(html).href);
  await page.waitForFunction('window.Showreel && typeof window.Showreel.draw === "function"', { timeout: 60000 });
  const info = await page.evaluate(async format => {
    const s = window.Showreel;
    await s.ready;
    await document.fonts.ready;
    const [w, h] = s.formats[format];
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    window.__exportCtx = c.getContext('2d');
    return { w, h, duration: s.duration, fps: s.fps, audio: s.audio ?? null };
  }, format);
  if (!Number.isFinite(info.duration) || info.duration <= 0 || !Number.isInteger(info.fps) || info.fps <= 0 || !Number.isInteger(info.duration * info.fps)) fail('Showreel duration and fps must yield a positive whole frame count');
  const frames = info.duration * info.fps;

  const frame = t => page.evaluate((t, format) => {
    window.Showreel.draw(window.__exportCtx, t, { format, subs: 'none' });
    return window.__exportCtx.canvas.toDataURL('image/png');
  }, t, format);
  // Cheap purity check: the same time drawn after other times must give the same pixels.
  const probe = await frame(1);
  await frame(info.duration / 2);
  if ((await frame(1)) !== probe) console.warn('warning: draw() is not deterministic; the MP4 may differ from the preview');

  const work = mkdtempSync(join(tmpdir(), 'showreel-'));
  const audio = audioPlan(info.audio, work, info.duration);
  mkdirSync(outDir, { recursive: true });
  const out = join(outDir, `gentle-shell-${format}-none.mp4`);
  const ff = spawn('ffmpeg', [
    '-v', 'error', '-y',
    '-f', 'image2pipe', '-framerate', String(info.fps), '-c:v', 'png', '-i', '-',
    ...audio.inputs,
    '-filter_complex', audio.filter, '-map', '0:v', '-map', '[a]',
    '-frames:v', String(frames),
    '-c:v', 'libx264', '-crf', '18', '-preset', 'slow', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', out,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((resolve, reject) => ff.on('close', code => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited with ${code}`)))));

  const started = Date.now();
  for (let n = 0; n < frames; n++) {
    const png = Buffer.from((await frame(n / info.fps)).split(',')[1], 'base64');
    if (!ff.stdin.write(png)) await new Promise(r => ff.stdin.once('drain', r));
    if (n % 300 === 299) console.log(`  ${format}: ${n + 1}/${frames} frames`);
  }
  ff.stdin.end();
  await done;
  await page.close();
  rmSync(work, { recursive: true, force: true });

  const probeOut = await run('ffprobe', ['-v', 'error', '-count_frames', '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height,nb_read_frames', '-of', 'csv=p=0', out]);
  console.log(`${out}\n  audio: ${audio.source}; width,height,frames: ${probeOut.trim()} (expected ${info.w},${info.h},${frames}); ${((Date.now() - started) / 1000).toFixed(0)} s`);
}

const puppeteer = loadPuppeteer();
const browser = await puppeteer.launch({ executablePath: findBrowser(), args: ['--mute-audio', '--allow-file-access-from-files'] });
try {
  for (const format of formats) await exportFormat(browser, format);
} finally {
  await browser.close();
}
