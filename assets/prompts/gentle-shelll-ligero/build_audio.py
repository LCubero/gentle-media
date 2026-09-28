"""Build local, cue-aligned 60-second PCM audio; requires Windows Zira and numpy."""
from __future__ import annotations

import base64
import re
import subprocess
import tempfile
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent
RATE = 24000
FRAMES = RATE * 60
VOICE = "Microsoft Zira Desktop"
SRT_TIME = re.compile(r"(\d\d):(\d\d):(\d\d),(\d{3})")


def seconds(value: str) -> float:
    match = SRT_TIME.fullmatch(value)
    if not match:
        raise ValueError(f"Invalid SRT timestamp: {value}")
    h, m, s, ms = map(int, match.groups())
    return h * 3600 + m * 60 + s + ms / 1000


def cues() -> list[tuple[float, float, str]]:
    result = []
    for block in ROOT.joinpath("subtitles.en.srt").read_text(encoding="utf-8-sig").strip().split("\n\n"):
        lines = block.strip().splitlines()
        start, end = lines[1].split(" --> ")
        result.append((seconds(start), seconds(end), " ".join(lines[2:])))
    if len(result) != 11 or result[-1][1] != 60 or any(
        a >= b or (i and a < result[i - 1][1]) for i, (a, b, _) in enumerate(result)
    ):
        raise ValueError("Expected eleven ordered, non-overlapping cues ending at 60 seconds")
    return result


def synthesize(text: str, destination: Path, rate: int) -> None:
    # Only base64 data is interpolated into fixed PowerShell code; no shell invocation.
    encoded = base64.b64encode(text.encode("utf-8")).decode("ascii")
    path = base64.b64encode(str(destination).encode("utf-8")).decode("ascii")
    script = f"""
Add-Type -AssemblyName System.Speech
$s = New-Object System.Speech.Synthesis.SpeechSynthesizer
try {{
  $s.SelectVoice('{VOICE}')
  $s.Rate = {rate}
  $p = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('{path}'))
  $t = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('{encoded}'))
  $s.SetOutputToWaveFile($p)
  $s.Speak($t)
}} finally {{ $s.Dispose() }}
"""
    subprocess.run(
        ["powershell.exe", "-NoProfile", "-NonInteractive", "-Command", script],
        check=True, capture_output=True, text=True,
    )


def load(path: Path) -> tuple[np.ndarray, int]:
    with wave.open(str(path), "rb") as wav:
        if wav.getsampwidth() != 2 or wav.getnchannels() != 1 or wav.getcomptype() != "NONE":
            raise ValueError(f"Expected mono PCM16 from System.Speech: {path}")
        return np.frombuffer(wav.readframes(wav.getnframes()), dtype="<i2").astype(np.float64) / 32768, wav.getframerate()


def resample(samples: np.ndarray, source_rate: int) -> np.ndarray:
    count = int(np.ceil(len(samples) * RATE / source_rate))
    return np.interp(np.arange(count) * source_rate / RATE, np.arange(len(samples)), samples, right=0)


def save(path: Path, samples: np.ndarray) -> None:
    pcm = np.round(np.clip(samples, -1, 1) * 32767).astype("<i2")
    with wave.open(str(path), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(RATE)
        wav.writeframes(pcm.tobytes())


def main() -> None:
    narration = np.zeros(FRAMES)
    with tempfile.TemporaryDirectory(prefix="gentle-shell-audio-") as directory:
        for index, (start, end, text) in enumerate(cues(), 1):
            path = Path(directory) / f"cue-{index:02}.wav"
            for speed in (0, 1, 2):
                synthesize(text, path, speed)
                samples, source_rate = load(path)
                samples = resample(samples, source_rate)
                if len(samples) <= round((end - start) * RATE):
                    break
            else:
                raise ValueError(f"Cue {index} exceeds its subtitle window even at Rate 2")
            offset = round(start * RATE)
            narration[offset:offset + len(samples)] = samples * 0.78
            print(f"cue {index}: {start:.3f}–{start + len(samples) / RATE:.3f}s within {end:.3f}s; Rate {speed}")

    t = np.arange(FRAMES, dtype=np.float64) / RATE
    # Deterministic, original low ambient and short shaped mechanical ticks.
    bed = 0.008 * np.sin(2 * np.pi * 87 * t) + 0.004 * np.sin(2 * np.pi * 131 * t)
    for moment in (0.2, 5, 15, 20.1, 26, 38, 51):
        start = round(moment * RATE)
        length = min(round(0.09 * RATE), FRAMES - start)
        u = np.arange(length) / RATE
        bed[start:start + length] += 0.025 * np.sin(2 * np.pi * (410 - 240 * u) * u) * np.exp(-55 * u)
    # The final second fades rather than ending abruptly.
    bed[-RATE:] *= np.linspace(1, 0, RATE)
    combined = narration + bed
    if np.max(np.abs(combined)) >= 1:
        raise ValueError("Mix would clip")
    output = ROOT / "audio"
    output.mkdir(exist_ok=True)
    for name, signal in (("narration.en.wav", narration), ("soundscape.wav", bed), ("mix.en.wav", combined)):
        save(output / name, signal)
        print(f"{name}: {len(signal) / RATE:.3f}s, peak {np.max(np.abs(signal)):.4f}")


if __name__ == "__main__":
    main()
