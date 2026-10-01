// Export one or all piece HTML files to MP4 clips, frame by frame.
//
// Usage (from any directory): node export-piece.mjs <01..11|all> [16x9|9x16|all]
// Input:  pieces/NN.html (must expose window.Piece, see prompts/)
//         optional voice/NN.mp3 (ElevenLabs line), which wins over the embedded audio
// Output: out/<format>/cNN.mp4; piece 01 also writes out/<format>/thumb.png from frame 0
// Needs:  ffmpeg and ffprobe on PATH, puppeteer-core (local or global), Chrome or Edge.
import { spawn, execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
// Narration start inside each piece, in seconds; matches prompts/NN-*.txt.
const voiceStart = { '01': 0.5, '02': 0.2, '03': 0.0, '04': 0.3, '05': 0.5, '06': 0.3, '07': 0.0, '08': 0.3, '09': 0.5, '10': 0.3, '11': 0.5 };
const duration = { '01': 5, '02': 5, '03': 5, '04': 5, '05': 6, '06': 6, '07': 6, '08': 6, '09': 7, '10': 5, '11': 4 };

const [pieceArg, formatArg = 'all'] = process.argv.slice(2);
if (!pieceArg) fail('usage: node export-piece.mjs <01..11|all> [16x9|9x16|all]');
const ids = pieceArg === 'all' ? Object.keys(duration).sort() : [pieceArg.padStart(2, '0')];
const formats = formatArg === 'all' ? ['16x9', '9x16'] : [formatArg];
if (!ids.every(id => id in duration)) fail('piece must be 01..11 or all');
if (!formats.every(f => f === '16x9' || f === '9x16')) fail('format must be 16x9, 9x16 or all');

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

// Returns ffmpeg input arguments and the filter that yields [a], a stereo track of exactly `seconds`.
function audioPlan(id, embedded, work, seconds) {
  const tail = `aresample=48000,aformat=channel_layouts=stereo,apad,atrim=0:${seconds}[a]`;
  const voice = join(here, 'voice', `${id}.mp3`);
  if (existsSync(voice)) {
    const ms = Math.round(voiceStart[id] * 1000);
    return { source: `voice/${id}.mp3`, inputs: ['-i', voice], filter: `[1:a]aformat=channel_layouts=stereo,adelay=${ms}:all=1,${tail}` };
  }
  if (embedded) {
    const [, ext = 'bin'] = /^data:audio\/([a-z0-9.+-]+)/i.exec(embedded) ?? [];
    const file = join(work, `embedded.${ext.replace('mpeg', 'mp3')}`);
    writeFileSync(file, Buffer.from(embedded.split(',')[1], 'base64'));
    return { source: 'embedded Piece.audio', inputs: ['-i', file], filter: `[1:a]${tail}` };
  }
  return { source: 'silence', inputs: ['-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo'], filter: `[1:a]${tail}` };
}

async function exportPiece(browser, id, format) {
  const html = join(here, 'pieces', `${id}.html`);
  if (!existsSync(html)) { console.warn(`skip ${id}: pieces/${id}.html not found`); return; }
  const page = await browser.newPage();
  await page.goto(pathToFileURL(html).href);
  await page.waitForFunction('window.Piece && typeof window.Piece.draw === "function"', { timeout: 60000 });
  const info = await page.evaluate(async format => {
    const p = window.Piece;
    await p.ready;
    await document.fonts.ready;
    const [w, h] = p.formats[format];
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    window.__exportCtx = c.getContext('2d');
    return { w, h, duration: p.duration, fps: p.fps, audio: p.audio ?? null };
  }, format);
  const seconds = duration[id];
  if (info.duration !== seconds || info.fps !== 30) console.warn(`warning: piece ${id} declares ${info.duration} s at ${info.fps} fps; exporting ${seconds} s at 30 fps`);
  const frames = seconds * 30;

  const frame = t => page.evaluate((t, format) => {
    window.Piece.draw(window.__exportCtx, t, { format });
    return window.__exportCtx.canvas.toDataURL('image/png');
  }, t, format);
  // Cheap purity check: the same time drawn after other times must give the same pixels.
  const probe = await frame(1);
  await frame(seconds - 1);
  if ((await frame(1)) !== probe) console.warn(`warning: piece ${id} draw() is not deterministic; the MP4 may differ from the preview`);

  const dir = join(here, 'out', format);
  mkdirSync(dir, { recursive: true });
  if (id === '01') writeFileSync(join(dir, 'thumb.png'), Buffer.from((await frame(0)).split(',')[1], 'base64'));

  const work = mkdtempSync(join(tmpdir(), 'piece-'));
  const audio = audioPlan(id, info.audio, work, seconds);
  const out = join(dir, `c${id}.mp4`);
  const ff = spawn('ffmpeg', [
    '-v', 'error', '-y',
    '-f', 'image2pipe', '-framerate', '30', '-c:v', 'png', '-i', '-',
    ...audio.inputs,
    '-filter_complex', audio.filter, '-map', '0:v', '-map', '[a]',
    '-frames:v', String(frames),
    '-c:v', 'libx264', '-crf', '16', '-preset', 'medium', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '192k', out,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((resolve, reject) => ff.on('close', code => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited with ${code}`)))));
  for (let n = 0; n < frames; n++) {
    const png = Buffer.from((await frame(n / 30)).split(',')[1], 'base64');
    if (!ff.stdin.write(png)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await done;
  await page.close();
  rmSync(work, { recursive: true, force: true });
  console.log(`out/${format}/c${id}.mp4  ${info.w}x${info.h}, ${frames} frames, audio: ${audio.source}${id === '01' ? ' (+ thumb.png)' : ''}`);
}

const puppeteer = loadPuppeteer();
const browser = await puppeteer.launch({ executablePath: findBrowser(), args: ['--mute-audio', '--allow-file-access-from-files'] });
try {
  for (const format of formats) for (const id of ids) await exportPiece(browser, id, format);
} finally {
  await browser.close();
}
