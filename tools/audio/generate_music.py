from pathlib import Path
import wave
import numpy as np

SAMPLE_RATE = 44100
DURATION = 32
OUTPUT = Path("public/audio/music")

STYLES = {
    "curiosity": {
        "bpm": 105,
        "notes": [48, 55, 60, 63, 58, 55, 60, 67],
        "brightness": 0.35,
        "percussion": 0.15,
    },
    "tension": {
        "bpm": 90,
        "notes": [45, 52, 57, 58, 45, 51, 57, 56],
        "brightness": 0.15,
        "percussion": 0.25,
    },
    "energetic": {
        "bpm": 128,
        "notes": [48, 55, 60, 67, 53, 60, 65, 72],
        "brightness": 0.55,
        "percussion": 0.40,
    },
    "calm": {
        "bpm": 75,
        "notes": [48, 55, 60, 64, 53, 60, 65, 69],
        "brightness": 0.20,
        "percussion": 0.05,
    },
}


def frequency(note):
    return 440 * 2 ** ((note - 69) / 12)


def generate(name, config):
    total_samples = SAMPLE_RATE * DURATION

    signal = np.zeros(total_samples)

    beat = 60 / config["bpm"]
    beat_samples = int(beat * SAMPLE_RATE)

    notes = config["notes"]

    for index, start in enumerate(
        range(0, total_samples, beat_samples)
    ):
        end = min(
            start + beat_samples,
            total_samples,
        )

        t = np.arange(end - start) / SAMPLE_RATE

        f = frequency(notes[index % len(notes)])

        envelope = (
            np.minimum(t / 0.025, 1)
            * np.exp(-t * 4)
        )

        melody = (
            np.sin(2 * np.pi * f * t)
            + config["brightness"]
            * np.sin(4 * np.pi * f * t)
        ) * envelope

        bass = (
            np.sin(2 * np.pi * (f / 2) * t)
            * np.exp(-t * 3)
            * 0.35
        )

        kick = (
            np.sin(
                2 * np.pi * (
                    65 * t
                    + 3 * (1 - np.exp(-t * 25))
                )
            )
            * np.exp(-t * 18)
            * config["percussion"]
        )

        signal[start:end] += melody + bass + kick

    delay = int(SAMPLE_RATE * 0.18)

    signal[delay:] += signal[:-delay] * 0.12

    fade = int(SAMPLE_RATE * 0.5)

    signal[:fade] *= np.linspace(0, 1, fade)
    signal[-fade:] *= np.linspace(1, 0, fade)

    peak = max(np.max(np.abs(signal)), 0.00001)

    signal = signal / peak * 0.8

    pcm = (signal * 32767).astype("<i2")

    OUTPUT.mkdir(parents=True, exist_ok=True)

    path = OUTPUT / f"{name}.wav"

    with wave.open(str(path), "wb") as file:
        file.setnchannels(1)
        file.setsampwidth(2)
        file.setframerate(SAMPLE_RATE)
        file.writeframes(pcm.tobytes())

    print(f"Generated: {path}")


if __name__ == "__main__":
    for name, config in STYLES.items():
        generate(name, config)

    print("All music tracks generated")