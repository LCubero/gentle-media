# Gentle Shell — lightweight 60-second production kit

A script-first, source-bounded brief for an editor or motion designer. **No MP4, cleared distribution rights or license grant is included.** Generated narration and soundscape WAV drafts are local and intentionally not published; rebuild them with `build_audio.py`. Source checkout: Gentle Shell revision `b27bd328b95e83967ffc23f62b76e77901b91130`.

**Recommended: showreel path.** Paste one prompt into Claude or ChatGPT to get a single HTML showreel, review it in the browser, then export exact 60-second 16:9 and 9:16 MP4s with one command. Narration comes from Claude or from ElevenLabs. See [showreel/README.md](showreel/README.md).

**Alternative: piece by piece with Claude.** Use the [piece path](generative/README.md): 11 paste-ready prompts, each producing one short HTML piece with its own title and audio. Every piece is exported to MP4 and `assemble.sh` joins them into exact 60-second 16:9 and 9:16 masters.

## Quick path

1. Read [claims and asset provenance](claims-and-assets.md) before turning reference imagery into any factual shot.
2. Block the six [storyboard](storyboard.md) beats on a 30 fps, 1,800-frame timeline; follow the standalone [production prompt](prompt.md) for format, sound, rights and export gates.
3. Choose [English](subtitles.en.srt) **or** [Spanish](subtitles.es.srt) subtitles per deliverable; adjust line breaks only after previewing both aspect ratios. English titles remain on screen in either version. Both tracks accompany the English narration; the Spanish track is subtitles, not dubbed speech.
4. Clear brand/image/audio rights and confirm release-specific product claims before publishing. Verify exported masters only after they actually exist.

## Files

| File | Purpose |
| --- | --- |
| `storyboard.md` | Exact 0–5, 5–15, 15–26, 26–38, 38–51, 51–60 second beats, frame counts and horizontal/portrait staging. |
| `prompt.md` | Standalone producer brief and required deliverables, exclusions and checks. |
| `claims-and-assets.md` | Revision-specific claim provenance, four source paths and rights caveats. |
| `subtitles.en.srt`, `subtitles.es.srt` | Alternative English and neutral Spanish timed subtitle drafts; exclusive final out-time 00:01:00,000. |
| `assets/` | Byte-identical GIF and three PNG reference images from the pinned sibling checkout; these are historical frames, **not proof of current UI**. |
| `showreel/` | One-prompt HTML showreel (recommended), ElevenLabs narration guide and frame-by-frame MP4 exporter. |
| `generative/` | Piece-by-piece path: 11 piece prompts, per-piece MP4 exporter and assembly script. |
| `assets/gentle-shell-banner-keyframe.png` | Brightest frame (108) of the banner GIF, used as thumbnail and end-card reference. |
| `build_audio.py` | Rebuild the offline, SRT-anchored English audio using Windows System.Speech **Microsoft Zira Desktop** (en-US), Python and numpy. |
| `audio/narration.en.wav`, `audio/soundscape.wav`, `audio/mix.en.wav` | Local, unpublished generated drafts (not included in this kit): voice-only, original synthetic low bed, and combined mix; each 60.000 seconds, 24 kHz mono PCM16 when rebuilt. |

Rebuild locally with `python assets/prompts/gentle-shelll-ligero/build_audio.py` from the repository root. Requires Windows PowerShell, installed System.Speech Zira and numpy; no network or downloaded voice. The generator creates disposable cue WAVs, verifies each utterance fits its English SRT window without compression or truncation, and mixes at low bed level. The last spoken cue ends around 59.799 seconds on this machine. WAV duration and sample peaks were checked programmatically; human listening, voice intelligibility and final export still require verification. The installed voice and its usage terms require separate rights review before distribution.

This kit is scoped to Gentle Shell, not the three-product v0 film. RDD and memory are optional integrations, not prerequisites or implied bundled features. No source repository was modified.
