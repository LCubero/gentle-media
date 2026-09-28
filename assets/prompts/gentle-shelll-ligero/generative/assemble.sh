#!/usr/bin/env bash
# Assemble the 11 generated clips into one exact 60-second master (1,800 frames at 30 fps).
#
# Usage: assemble.sh <16x9|9x16> [en|es|none] [audio-file]
#   out/<format>/ must contain thumb.png (frame 0) and c01.mp4 ... c11.mp4.
#   Subtitles default to en. An audio file replaces all clip audio (see audio-60s.txt).
# Output: out/<format>/gentle-shell-<format>-<subs>.mp4
set -euo pipefail

format=${1:?format: 16x9 or 9x16}
subs=${2:-en}
audio=${3:-}
kit=$(cd "$(dirname "$0")" && pwd)
clips="$kit/out/$format"
if [ -n "$audio" ]; then audio=$(cd "$(dirname "$audio")" && pwd)/$(basename "$audio"); fi

case $format in
  16x9) w=1920 h=1080
        title_style="FontName=Consolas,Bold=1,FontSize=16,Alignment=6,MarginV=24,Outline=1,Shadow=0"
        sub_style="FontName=Consolas,FontSize=12,Alignment=2,MarginV=24,Outline=1,Shadow=0" ;;
  9x16) w=1080 h=1920
        title_style="FontName=Consolas,Bold=1,FontSize=9,Alignment=6,MarginV=44,MarginL=24,MarginR=24,Outline=1,Shadow=0"
        sub_style="FontName=Consolas,FontSize=8,Alignment=2,MarginV=101,MarginL=24,MarginR=24,Outline=1,Shadow=0" ;;
  *) echo "format must be 16x9 or 9x16" >&2; exit 1 ;;
esac
case $subs in en|es|none) ;; *) echo "subs must be en, es or none" >&2; exit 1 ;; esac

# Frames per clip; the clip boundaries match the subtitle cue windows.
frames=(150 150 150 150 180 180 180 180 210 150 120)

work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT
fit="scale=$w:$h:force_original_aspect_ratio=increase,crop=$w:$h,fps=30,setsar=1,format=yuv420p"

mkdir -p "$clips"
[ -f "$clips/thumb.png" ] || { echo "missing $clips/thumb.png" >&2; exit 1; }
: > "$work/list.txt"
for i in "${!frames[@]}"; do
  n=$(printf 'c%02d' $((i + 1)))
  src="$clips/$n.mp4"
  [ -f "$src" ] || { echo "missing $src" >&2; exit 1; }
  sec=$(awk "BEGIN { printf \"%.3f\", ${frames[$i]} / 30 }")
  # Clips without an audio stream get silence of the same length.
  if [ -n "$(ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$src")" ]; then amap=0:a; else amap=1:a; fi
  ffmpeg -v error -y -i "$src" -f lavfi -i anullsrc=r=48000:cl=stereo \
    -filter_complex "[0:v]$fit[v];[$amap]aresample=48000,aformat=channel_layouts=stereo,apad,atrim=0:$sec[a]" \
    -map "[v]" -map "[a]" -frames:v "${frames[$i]}" -c:v libx264 -crf 16 -preset medium -c:a pcm_s16le "$work/$n.mkv"
  echo "file '$n.mkv'" >> "$work/list.txt"
done

# Relative subtitle paths avoid the drive-letter escaping problem of the subtitles filter.
cp "$kit/titles.en.srt" "$work/titles.srt"
vf="[0:v][t]overlay=enable='eq(n,0)',subtitles=titles.srt:force_style='$title_style'"
if [ "$subs" != none ]; then
  cp "$kit/../subtitles.$subs.srt" "$work/subs.srt"
  vf="$vf,subtitles=subs.srt:force_style='$sub_style'"
fi

cd "$work"
ffmpeg -v error -y -f concat -safe 0 -i list.txt -c copy joined.mkv
inputs=(-i joined.mkv -loop 1 -i "$clips/thumb.png")
amap="0:a"
if [ -n "$audio" ]; then inputs+=(-i "$audio"); amap="2:a"; fi
out="$clips/gentle-shell-$format-$subs.mp4"
ffmpeg -v error -y "${inputs[@]}" \
  -filter_complex "[1:v]scale=$w:$h:force_original_aspect_ratio=increase,crop=$w:$h,setsar=1,format=yuv420p[t];$vf[v];[$amap]aresample=48000,aformat=channel_layouts=stereo,apad,atrim=0:60[a]" \
  -map "[v]" -map "[a]" -frames:v 1800 -r 30 \
  -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart "$out"

count=$(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames,width,height -of csv=p=0 "$out")
echo "$out -> width,height,frames: $count (expected $w,$h,1800)"
