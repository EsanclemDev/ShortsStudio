import argparse
import json
import subprocess
from pathlib import Path

import numpy as np


SAMPLE_RATE = 16000


def generate_lipsync(
    audio_path: Path,
    output_path: Path,
    fps: int,
):
    if not audio_path.is_file():
        raise FileNotFoundError(audio_path)

    command = [
        "ffmpeg",
        "-v", "error",
        "-i", str(audio_path),
        "-ac", "1",
        "-ar", str(SAMPLE_RATE),
        "-f", "f32le",
        "pipe:1",
    ]

    result = subprocess.run(
        command,
        capture_output=True,
        check=True,
    )

    samples = np.frombuffer(
        result.stdout,
        dtype=np.float32,
    )

    if samples.size == 0:
        raise RuntimeError("Empty audio")

    total_frames = int(
        np.ceil(len(samples) * fps / SAMPLE_RATE)
    )

    amplitudes = []

    for frame in range(total_frames):
        start = int(frame * SAMPLE_RATE / fps)
        end = int((frame + 1) * SAMPLE_RATE / fps)

        chunk = samples[start:end]

        rms = (
            float(np.sqrt(np.mean(chunk ** 2)))
            if chunk.size
            else 0.0
        )

        amplitudes.append(rms)

    reference = max(
        float(np.percentile(amplitudes, 95)),
        0.000001,
    )

    noise_gate = reference * 0.06

    values = []
    previous = 0.0

    for amplitude in amplitudes:
        if amplitude < noise_gate:
            target = 0.0
        else:
            target = min(
                1.0,
                amplitude / reference,
            )

            target = target ** 0.65

        smoothing = (
            0.65 if target > previous else 0.45
        )

        current = (
            previous
            + (target - previous) * smoothing
        )

        if current < 0.025:
            current = 0.0

        values.append(round(current, 4))

        previous = current

    output = {
        "fps": fps,
        "durationMs": round(
            len(samples) / SAMPLE_RATE * 1000
        ),
        "frames": values,
    }

    output_path.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    output_path.write_text(
        json.dumps(output, indent=2),
        encoding="utf-8",
    )

    print("Lip-sync generated")
    print(f"Audio: {audio_path}")
    print(f"FPS: {fps}")
    print(f"Frames: {total_frames}")
    print(f"Duration: {output['durationMs']} ms")
    print(f"Output: {output_path}")


def main():
    parser = argparse.ArgumentParser()

    parser.add_argument("audio")

    parser.add_argument(
        "--output",
        "-o",
        required=True,
    )

    parser.add_argument(
        "--fps",
        type=int,
        default=30,
    )

    args = parser.parse_args()

    if args.fps <= 0:
        parser.error("FPS must be positive")

    generate_lipsync(
        Path(args.audio),
        Path(args.output),
        args.fps,
    )


if __name__ == "__main__":
    main()