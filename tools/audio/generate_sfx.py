from pathlib import Path
import wave
import numpy as np

SAMPLE_RATE = 44100
OUTPUT = Path("public/audio/sfx")

rng = np.random.default_rng(42)


def timeline(duration):
    return np.arange(
        int(SAMPLE_RATE * duration)
    ) / SAMPLE_RATE


def tone(frequency, t):
    return np.sin(2 * np.pi * frequency * t)


def sweep(start, end, t):
    duration = len(t) / SAMPLE_RATE
    rate = (end - start) / duration

    return np.sin(
        2 * np.pi * (
            start * t + 0.5 * rate * t ** 2
        )
    )


def save(name, signal):
    signal = np.asarray(signal).copy()

    fade = min(
        int(SAMPLE_RATE * 0.005),
        len(signal) // 2,
    )

    if fade > 0:
        signal[:fade] *= np.linspace(0, 1, fade)
        signal[-fade:] *= np.linspace(1, 0, fade)

    peak = max(np.max(np.abs(signal)), 0.00001)

    signal = signal / peak * 0.85

    pcm = (signal * 32767).astype("<i2")

    OUTPUT.mkdir(parents=True, exist_ok=True)

    path = OUTPUT / f"{name}.wav"

    with wave.open(str(path), "wb") as file:
        file.setnchannels(1)
        file.setsampwidth(2)
        file.setframerate(SAMPLE_RATE)
        file.writeframes(pcm.tobytes())

    print(f"Generated: {path}")


def whoosh():
    t = timeline(0.45)

    noise = rng.normal(0, 1, len(t))

    envelope = np.sin(
        np.pi * t / 0.45
    ) ** 2

    signal = (
        noise * 0.25
        + sweep(200, 1800, t) * 0.5
    ) * envelope

    save("whoosh", signal)


def pop():
    t = timeline(0.18)

    signal = (
        sweep(900, 180, t)
        * np.exp(-t * 28)
    )

    save("pop", signal)


def impact():
    t = timeline(0.65)

    signal = (
        sweep(120, 35, t)
        * np.exp(-t * 8)
        + rng.normal(0, 0.15, len(t))
        * np.exp(-t * 35)
    )

    save("impact", signal)


def warning():
    t = timeline(0.65)

    pulse = (
        np.sin(2 * np.pi * 4 * t) > 0
    ).astype(float)

    signal = (
        tone(440, t)
        + tone(660, t) * 0.4
    ) * pulse * np.exp(-t * 2)

    save("warning", signal)


def success():
    t = timeline(0.7)

    signal = np.zeros_like(t)

    notes = [523.25, 659.25, 783.99]

    for index, frequency in enumerate(notes):
        offset = index * 0.12

        local = np.maximum(0, t - offset)

        signal += (
            tone(frequency, local)
            * np.exp(-local * 7)
            * (t >= offset)
        )

    save("success", signal)


def water():
    t = timeline(0.9)

    signal = np.zeros_like(t)

    for _ in range(14):
        offset = rng.uniform(0, 0.65)
        frequency = rng.uniform(350, 1200)

        local = np.maximum(0, t - offset)

        signal += (
            tone(frequency, local)
            * np.exp(-local * 35)
            * (t >= offset)
        )

    save("water", signal)


def click():
    t = timeline(0.08)

    signal = (
        rng.normal(0, 1, len(t))
        * np.exp(-t * 100)
    )

    save("click", signal)


def heartbeat():
    t = timeline(0.9)

    signal = np.zeros_like(t)

    for offset in [0, 0.22]:
        local = np.maximum(0, t - offset)

        signal += (
            tone(65, local)
            * np.exp(-local * 20)
            * (t >= offset)
        )

    save("heartbeat", signal)


if __name__ == "__main__":
    whoosh()
    pop()
    impact()
    warning()
    success()
    water()
    click()
    heartbeat()

    print("All sound effects generated")