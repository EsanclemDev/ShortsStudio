import type { OrganAnimation } from "./AnatomyTypes";

export type OrganPose = {
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  rotationY: number;
  offsetY: number;
  activity: number;
};

const clamp = (value: number) =>
  Math.max(0, Math.min(1, value));

export const getOrganPose = (
  animation: OrganAnimation,
  time: number,
  speed = 1,
  intensity = 1,
  duration = 3,
): OrganPose => {
  const t = time * speed;

  const pose: OrganPose = {
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    rotationY: 0,
    offsetY: 0,
    activity: 0,
  };

  switch (animation) {
    case "float":
      return {
        ...pose,
        offsetY: Math.sin(t * 2) * 0.15,
      };

    case "rotate":
      return {
        ...pose,
        rotationY: t * 0.8,
      };

    case "heartbeat": {
      const phase = (t * 1.2) % 1;

      const firstBeat =
        Math.exp(-Math.pow((phase - 0.15) / 0.065, 2));

      const secondBeat =
        Math.exp(-Math.pow((phase - 0.35) / 0.09, 2))
        * 0.55;

      const beat = firstBeat + secondBeat;

      return {
        ...pose,
        scaleX: 1 + beat * 0.12 * intensity,
        scaleY: 1 - beat * 0.07 * intensity,
        scaleZ: 1 + beat * 0.12 * intensity,
        activity: clamp(beat),
      };
    }

    case "breathing": {
      const breath =
        (Math.sin(t * Math.PI * 0.5 - Math.PI / 2) + 1) / 2;

      return {
        ...pose,
        scaleX: 1 + breath * 0.15 * intensity,
        scaleY: 1 + breath * 0.08 * intensity,
        scaleZ: 1 + breath * 0.2 * intensity,
        activity: breath,
      };
    }

    case "swelling": {
      const progress = clamp(
        t / Math.max(0.01, duration),
      );

      const eased =
        progress * progress * (3 - 2 * progress);

      const growth = 1 + eased * 0.3 * intensity;

      return {
        ...pose,
        scaleX: growth,
        scaleY: growth,
        scaleZ: growth,
        activity: eased,
      };
    }

    case "contract": {
      const wave = Math.sin(t * 3);

      return {
        ...pose,
        scaleX: 1 + wave * 0.08 * intensity,
        scaleY: 1 - wave * 0.06 * intensity,
        scaleZ: 1 + wave * 0.08 * intensity,
        activity: (wave + 1) / 2,
      };
    }

    case "appear": {
      const progress = clamp(t * 2.5);
      const scale = 1 - Math.pow(1 - progress, 3);

      return {
        ...pose,
        scaleX: scale,
        scaleY: scale,
        scaleZ: scale,
      };
    }

    case "warning":
      return {
        ...pose,
        activity: (Math.sin(t * 7) + 1) / 2,
      };

    default:
      return pose;
  }
};