import type { MicroAnimation } from "./MicroTypes";

export type MicroPose = {
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  offsetX: number;
  offsetY: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  activity: number;
  division: number;
};

const clamp = (value: number) =>
  Math.max(0, Math.min(1, value));

export const getMicroPose = (
  animation: MicroAnimation,
  time: number,
  speed = 1,
  intensity = 1,
  duration = 3,
): MicroPose => {
  const t = time * speed;

  const progress = clamp(
    t / Math.max(0.01, duration),
  );

  const eased =
    progress * progress * (3 - 2 * progress);

  const pose: MicroPose = {
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    offsetX: 0,
    offsetY: 0,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    activity: 0,
    division: 0,
  };

  switch (animation) {
    case "float":
      return {
        ...pose,
        offsetY: Math.sin(t * 2) * 0.15,
        rotationZ: Math.sin(t) * 0.1,
      };

    case "rotate":
      return {
        ...pose,
        rotationY: t,
        rotationX: Math.sin(t * 0.5) * 0.25,
      };

    case "pulse": {
      const pulse = Math.sin(t * 4) * 0.08 * intensity;

      return {
        ...pose,
        scaleX: 1 + pulse,
        scaleY: 1 + pulse,
        scaleZ: 1 + pulse,
        activity: (Math.sin(t * 4) + 1) / 2,
      };
    }

    case "swelling": {
      const growth = 1 + eased * 0.45 * intensity;

      return {
        ...pose,
        scaleX: growth,
        scaleY: growth,
        scaleZ: growth,
        activity: eased,
      };
    }

    case "shrink": {
      const shrink = Math.max(
        0.15,
        1 - eased * 0.4 * intensity,
      );

      return {
        ...pose,
        scaleX: shrink,
        scaleY: shrink,
        scaleZ: shrink,
        activity: eased,
      };
    }

    case "division":
      return {
        ...pose,
        division: eased,
        activity: eased,
      };

    case "vibrate":
      return {
        ...pose,
        offsetX: Math.sin(t * 25) * 0.035,
        offsetY: Math.cos(t * 23) * 0.035,
        rotationZ: Math.sin(t * 20) * 0.06,
      };

    case "appear": {
      const scale = 1 - Math.pow(1 - progress, 3);

      return {
        ...pose,
        scaleX: scale,
        scaleY: scale,
        scaleZ: scale,
      };
    }

    default:
      return pose;
  }
};