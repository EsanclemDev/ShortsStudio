import type {
  ObjectAnimation,
} from "../objects/ObjectTypes";

export type ObjectPose = {
  offsetY: number;
  offsetX: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  scale: number;
};

export const getObjectPose = (
  animation: ObjectAnimation,
  time: number,
  speed = 1,
): ObjectPose => {
  const t = time * speed;

  const pose: ObjectPose = {
    offsetY: 0,
    offsetX: 0,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    scale: 1,
  };

  switch (animation) {
    case "float":
      return {
        ...pose,
        offsetY: Math.sin(t * 2) * 0.18,
        rotationZ: Math.sin(t * 1.5) * 0.08,
      };

    case "rotate":
      return {
        ...pose,
        rotationY: t * 1.5,
      };

    case "bounce":
      return {
        ...pose,
        offsetY: Math.abs(Math.sin(t * 3)) * 0.5,
      };

    case "pulse":
      return {
        ...pose,
        scale: 1 + Math.sin(t * 4) * 0.12,
      };

    case "appear": {
      const progress = Math.min(1, Math.max(0, t * 2.5));

      const eased =
        1 - Math.pow(1 - progress, 3);

      return {
        ...pose,
        scale: eased,
        offsetY: (1 - eased) * 0.5,
      };
    }

    case "shake":
      return {
        ...pose,
        offsetX: Math.sin(t * 24) * 0.06,
        rotationZ: Math.sin(t * 20) * 0.12,
      };

    default:
      return pose;
  }
};