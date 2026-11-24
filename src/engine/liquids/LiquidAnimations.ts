import type { LiquidAnimation } from "./LiquidTypes";

const clamp = (value: number) =>
  Math.max(0, Math.min(1, value));

export const getLiquidLevel = (
  animation: LiquidAnimation,
  time: number,
  level: number,
  duration: number,
  speed: number,
): number => {
  const progress = clamp(
    (time * speed) / Math.max(0.01, duration),
  );

  const eased =
    progress * progress * (3 - 2 * progress);

  switch (animation) {
    case "fill":
      return clamp(level * eased);

    case "drain":
      return clamp(level * (1 - eased));

    case "pulse":
      return clamp(
        level + Math.sin(time * speed * 3) * 0.08,
      );

    default:
      return clamp(level);
  }
};