Act as a senior motion designer, editor, and sound designer. Produce **one downloadable self-contained `gentle-shell.html`**, a 44-second, 30 fps motion-graphics film about Gentle Shell. Return the complete working HTML, not a storyboard, another prompt, or build instructions. Work solely from this prompt and the attached assets; do not ask for earlier HTML films. No CDN, external runtime URL, or build step. Do not invent features or claim the film has been tested when it has not.

## Assets and truth boundaries

- Attach `gentle-shell-banner-keyframe.png`: the original rose and wordmark. Embed its bytes and draw the intact image directly with normal source-over compositing on an appropriately black background. Never trace, re-letter, recolor, screen-blend, or rebuild the logo; do not crop off its wordmark or rose rule. Reveal the intact image with opacity or clipping if desired.
- Attach `gentle-shell.png`, `changes-view.png`, and `agents-view.png` as **composition references only**. Draw new abstract UI; never embed these screenshots in output frames. Optional additional private console screenshots, if supplied, are also references only: do not copy their pixels or legible content into the HTML, preview, or film.
- Gentle Shell is the protagonist: a console-integrated agent workspace with extensions and focused agent orchestration. Its session surface brings task progress, runtime status, and captured changes into view. Focused agents receive bounded work and return a result to the parent, which retains context and control. Small work can stay in the parent session. Changes depicts successful write/edit tool changes in this session and owned children, **not** every shell/editor write or complete Git history. These precise limits belong in implementation notes, not a disclaimer in the film. Do not market Pi, Gentle-AI, or Engram by name in voice or on-screen copy; technical notes may distinguish their roles without attributing all core agent capabilities to Gentle Shell. Do not imply Pi lacks capabilities. No token/context savings percentages, guaranteed savings, review/release promises, or universally bundled memory.

## Creative direction: console, not a web app

Build the visual language of a real terminal shell: charcoal/near-black, warm white monospaced transcript, rose wordmark and focused accents, muted gold activity, restrained green success. A narrow tab/runtime strip sits above the transcript; a right-hand **Status** box has runtime and changes indicators; **Todos** uses compact rows and active/done markers; a thin bordered input anchors the console. Labels should interrupt thin box borders rather than float atop rounded web-app cards. In portrait, recompose these regions into a legible stack, not a cropped desktop screenshot. All transcript, paths, model fields, counters, diff text, and task content must be variable-length **illegible word bars**; use only generic labels such as Parent session, Status, Todos, Changes, Agents, Explore, Focused agent, Next step. No private text, screenshots, fabricated metrics, model/version names, prices, or exact real-session values. No decorative particles or fake dashboard KPI tiles. Motion explains the mechanism: context is focused, bounded work is passed out and returned, successful changes are captured, and the human chooses the next step.

## Exact 44-second edit and voice

Use the following exact English spoken lines with these nine absolute start/latest-finish windows. Each row maps to `voice/01.mp3` through `voice/09.mp3`. Spoken copy is distinct from titles; no additional narration. Speak warmly at a natural pace (each line fits at approximately 150 words/minute or less). Transitions between middle scenes last 0.7 s with a visual overlap/crossfade, but never overlap headlines; each headline must be readable at least 2 s. Recompose the **console itself** every beat: no stationary repeated panel with only the heading swapped.

| Beat | Scene interval | One headline | Voice window and exact line | Visual action |
| --- | --- | --- | --- | --- |
| Poster | frame 0 only | Intact official logo | Silent | Black background, unchanged logo as thumbnail. |
| Introduce | 0–5 s | **MEET GENTLE SHELL** | 0.4–4.6: “Gentle Shell brings your coding agent into one console workspace.” | At `t=1/30` replace poster with console reveal: tab/runtime strip, transcript and input resolve in layers; no lingering logo splash. |
| Workspace | 5–10 s | **YOUR AGENT. ONE WORKSPACE.** | 5.2–9.7: “Your session, tasks, and runtime stay in view.” | Console opens wide; Status and Todos peel out from transcript edges; input remains the anchor. |
| Orient | 10–15 s | **FOCUS THE CONTEXT** | 10.2–14.7: “Gentle Shell surfaces what matters for the work at hand.” | Many abstract transcript bars dim; only relevant task and few context bars are extracted into a focused lane. No numbers or savings claim. |
| Route | 15–20 s | **SMALL WORK STAYS SMALL** | 15.2–19.7: “Explore a small task, then keep it in the parent session.” | A small Explore trace resolves directly into the parent console/input; no agent spun up for this path. |
| Delegate | 20–25 s | **FOCUSED HELP, CLEAR RETURN** | 20.2–24.7: “For bounded work, a focused agent returns a result.” | For a *different*, bounded task, isolate a small relevant context packet, send it into a distinct agent thread; show completion and compact result returning to parent. |
| Inspect | 25–30 s | **SEE CAPTURED CHANGES** | 25.2–29.7: “Successful tool edits appear as captured changes to inspect.” | Expand Changes into file-list and abstract plus/minus diff lanes; highlight a successful write/edit tool event flowing into the captured diff. No claim of complete repository history. |
| Follow | 30–35 s | **FOLLOW THE THREAD** | 30.2–34.7: “Follow agent threads, then return focus to your session.” | Agents thread view takes over; focus moves from child activity back to parent transcript, not to an unrelated card. |
| Resolve | 35–40 s | **YOU LEAD THE NEXT STEP** | 35.2–39.7: “Track substantial tasks, inspect the result, and choose the next step.” | Todos progresses, captured result remains inspectable, and input/next-step choice receives focus; do not claim automatic approval. |
| End card | 40–44 s | **YOUR CODING AGENT. YOUR WORKSPACE.** | 40.2–43.6: “Gentle Shell. Your agent, your workspace.” | At exactly 40 s crossfade previous console for 0.75 s against black and the **intact** logo; logo scales up subtly over the end card. Reveal headline from 40.35 to 41.25 s. |

At all times show just one headline; no opening “Built for Pi”, outro extra slogan, lower-third, or burned subtitles. Fit portrait key imagery and headings within x=80..1000 and y=249.6..1344 at 1080×1920; reserve a clear lower caption area. Keep title readable at least 2 s, including the ending. For 1920×1080, keep corresponding safe margins and a clear lower caption zone. Color transitions should be soft, never flashing; tiny UI status labels are allowed but should not compete with the headline. Ambient sound: low room tone, one quiet keystroke, subtle focus ticks and a capture snap; no music.

## Runtime and deliverable

Make a single offline HTML file with embedded logo and fonts (include the available typefaces as data URLs and wait for them to load), plus reliable font fallbacks. Embed no reference screenshots. Draw all frames deterministically from absolute time, format, and decoded immutable assets; reset canvas state and repaint the entire canvas on every call. Do not use randomness, wall clock, CSS animation, video, or previous-frame state inside `draw`. Preview controls may keep playback state. Expose **exactly** this global contract:

```js
window.Showreel = {
  duration: 44, fps: 30,
  formats: { '16x9': [1920, 1080], '9x16': [1080, 1920] },
  ready: Promise, // resolves after embedded images and fonts decode
  draw(ctx, t, { format, subs }) { /* full clean frame; ignore subs */ },
  audio: 'data:audio/...;base64,...' /* actual synchronized 44 s voice mix */ || null,
};
```

Embed a synchronized 44-second mix **only if it truly contains the specified voice** in the stated windows; otherwise `audio: null`. For `audio: null`, preview may play adjacent `voice/01.mp3` … `voice/09.mp3` if present, at the starts above. Missing clips mean silence: no browser speech synthesis, no fabricated narration. Cut each fallback clip at its latest finish even if its file is longer; stop/reseek/resynchronize clips on pause, seek, format changes, and tab visibility changes so stale speech cannot leak into later beats. Do not import old 60-second audio or burned captions. The page preview offers play/pause, scrub, format switch, and optionally a **DOM-only** caption preview outside the canvas. For *any* `subs` argument, `draw` must ignore captions: external `subtitles.en.srt` and `subtitles.es.srt` carry the nine cues, not video pixels. The existing exporter invokes `draw(..., {format, subs:'none'})` for its 1320 frames per format; do not require HTML changes to that exporter.

Before delivery, inspect both layouts and time boundaries (frame 0, t=1/30, 39.99, 40, 40.35, 40.75, 41.25, 44), all voice starts/stops, offline asset loading, title legibility, output purity at repeated nonadjacent times, and clean frames with either subtitle preview mode. Clearly say which browser, visual, export, or listening checks you actually performed and which remain for the recipient; do not assert tests that have not run.
