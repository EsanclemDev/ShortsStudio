export const clamp = (value: number) =>
  Math.max(0, Math.min(1, value));

export const smoothstep = (value: number) => {
  const t = clamp(value);

  return t * t * (3 - 2 * t);
};

export const getEffectState = (
  frame: number,
  fps: number,
  startFrame = 0,
  duration?: number,
) => {
  const time = Math.max(
    0,
    frame - startFrame,
  ) / fps;

  const visible =
    frame >= startFrame &&
    (duration === undefined || time < duration);

  const progress =
    duration === undefined
      ? 0
      : clamp(time / Math.max(0.01, duration));

  return {
    time,
    visible,
    progress,
  };
};