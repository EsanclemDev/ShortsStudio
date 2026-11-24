import argparse
import json
import time
from pathlib import Path

from faster_whisper import WhisperModel


def transcribe(
    audio_path: Path,
    output_path: Path,
    model_size: str,
    device: str,
    language: str,
):
    if not audio_path.is_file():
        raise FileNotFoundError(
            f"Audio not found: {audio_path}"
        )

    start_time = time.perf_counter()

    compute_type = (
        "float32" if device == "cuda" else "int8"
    )

    print(f"Audio: {audio_path}")
    print(f"Model: {model_size}")
    print(f"Device: {device}")
    print(f"Compute type: {compute_type}")

    model = WhisperModel(
        model_size,
        device=device,
        compute_type=compute_type,
    )

    segments, info = model.transcribe(
        str(audio_path),
        language=language,
        beam_size=5,
        word_timestamps=True,
        condition_on_previous_text=False,
        vad_filter=False,
    )

    words = []

    for segment in segments:
        print(segment.text.strip())

        for word in segment.words or []:
            text = word.word.strip()

            if not text:
                continue

            start_ms = max(
                0,
                round(word.start * 1000),
            )

            end_ms = max(
                start_ms + 1,
                round(word.end * 1000),
            )

            words.append({
                "text": text,
                "startMs": start_ms,
                "endMs": end_ms,
            })

    if not words:
        raise RuntimeError(
            "No words detected in the audio"
        )

    output_path.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    output_path.write_text(
        json.dumps(
            words,
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    elapsed = time.perf_counter() - start_time

    print()
    print("Transcription completed")
    print(f"Language: {info.language}")
    print(f"Audio duration: {info.duration:.2f}s")
    print(f"Words: {len(words)}")
    print(f"Processing time: {elapsed:.2f}s")
    print(f"Output: {output_path}")


def main():
    parser = argparse.ArgumentParser(
        description="ShortsStudio transcription engine"
    )

    parser.add_argument("audio")

    parser.add_argument(
        "--output",
        "-o",
        default=None,
    )

    parser.add_argument(
        "--model",
        default="small",
    )

    parser.add_argument(
        "--device",
        choices=["cpu", "cuda"],
        default="cpu",
    )

    parser.add_argument(
        "--language",
        default="es",
    )

    args = parser.parse_args()

    audio_path = Path(args.audio)

    output_path = (
        Path(args.output)
        if args.output
        else audio_path.with_suffix(".json")
    )

    transcribe(
        audio_path=audio_path,
        output_path=output_path,
        model_size=args.model,
        device=args.device,
        language=args.language,
    )


if __name__ == "__main__":
    main()