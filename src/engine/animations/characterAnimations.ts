import type { CharacterProps } from "../characters/Character";
import {
  solveArmIK,
  rotatePoint,
} from "./inverseKinematics";
export type CharacterAction =
  | "idle"
  | "walk"
  | "run"
  | "wave"
  | "dance"
  | "thumbsUp"
  | "point"
  | "drink"
  | "talk"
  | "surprised";

export type CharacterPose = CharacterProps & {
  offsetY: number;
  rotation: number;
  scale: number;
};

export const getCharacterPose = (
  action: CharacterAction,
  time: number
): CharacterPose => {
  const pose: CharacterPose = {
    expression: "happy",
    blink: Math.max(
      0,
      1 - Math.abs((time % 3) - 1.5) / 0.1
    ),
    headTilt: Math.sin(time * 2) * 2,
    leftArm: -12,
    rightArm: 0,
    leftElbow: 0,
    rightElbow: 0,
    leftLeg: 0,
    rightLeg: 0,
    leftKnee: 0,
    rightKnee: 0,
    leftHand: "fist",
    rightHand: "fist",
    heldObject: "none",
    mouthOpen: 0,
    offsetY: 0,
    rotation: 0,
    scale: 1 + Math.sin(time * 3) * 0.008,
  };

  switch (action) {
    case "walk": {
      const cycle = Math.sin(time * 9);

      return {
        ...pose,
        leftArm: cycle * 25,
        rightArm: -cycle * 25,
        leftLeg: -cycle * 25,
        rightLeg: cycle * 25,
        leftKnee: Math.max(0, cycle) * 35,
        rightKnee: Math.max(0, -cycle) * 35,
        offsetY: -Math.abs(cycle) * 12,
      };
    }

    case "run": {
      const cycle = Math.sin(time * 15);

      return {
        ...pose,
        leftArm: cycle * 50,
        rightArm: -cycle * 50,
        leftElbow: -40,
        rightElbow: 40,
        leftLeg: -cycle * 45,
        rightLeg: cycle * 45,
        leftKnee: Math.max(0, cycle) * 65,
        rightKnee: Math.max(0, -cycle) * 65,
        offsetY: -Math.abs(cycle) * 35,
        rotation: 8,
      };
    }

    case "wave":
      return {
        ...pose,
        rightArm: -100,
        rightElbow: -35 + Math.sin(time * 12) * 25,
        rightHand: "open",
      };

    case "dance": {
      const cycle = Math.sin(time * 7);

      return {
        ...pose,
        leftArm: 65 + cycle * 40,
        rightArm: -65 + cycle * 40,
        leftElbow: cycle * 30,
        rightElbow: -cycle * 30,
        leftLeg: cycle * 20,
        rightLeg: -cycle * 20,
        leftKnee: Math.max(0, cycle) * 25,
        rightKnee: Math.max(0, -cycle) * 25,
        headTilt: cycle * 12,
        rotation: cycle * 5,
        offsetY: -Math.abs(cycle) * 25,
        leftHand: "open",
        rightHand: "open",
      };
    }

    case "thumbsUp":
      return {
        ...pose,
        rightArm: -85,
        rightElbow: -25,
        rightHand: "thumbsUp",
      };

    case "point":
      return {
        ...pose,
        rightArm: -85,
        rightElbow: -15,
        rightHand: "point",
      };

case "drink": {
  const clamp = (value: number) =>
    Math.max(0, Math.min(1, value));

  const smoothstep = (value: number) => {
    const t = clamp(value);

    return t * t * (3 - 2 * t);
  };

  const lerp = (
    from: number,
    to: number,
    progress: number,
  ) => from + (to - from) * progress;

  // Levantar, beber y bajar.
  const lift = smoothstep(time / 0.8);

  const lower = smoothstep(
    (time - 2.2) / 0.8,
  );

  const amount = lift * (1 - lower);

  const sip =
    smoothstep((time - 0.8) / 0.4) *
    (1 - smoothstep((time - 1.9) / 0.3));

  const headTilt = -8 * sip;

  // Inclinación independiente de la botella.
  const bottleRotation =
    -90 * amount - 18 * sip;

  const bottleOffset = {
    x: -5,
    y: -15,
  };

  // Coordenadas de la boca respecto
  // al punto de rotación de la cabeza.
  const rotatedMouth = rotatePoint(
    {
      x: 320 - 300,
      y: 285 - 340,
    },
    headTilt,
  );

  const mouth = {
    x: 300 + rotatedMouth.x,
    y: 340 + rotatedMouth.y,
  };

  // Posición de la boquilla dentro
  // de la botella abierta.
  const nozzle = rotatePoint(
    {
      x: 0,
      y: -75,
    },
    bottleRotation,
  );

  // Posición necesaria de la mano
  // para que la boquilla toque la boca.
  const drinkingHand = {
    x: mouth.x - nozzle.x - bottleOffset.x,
    y: mouth.y - nozzle.y - bottleOffset.y,
  };

  // Posición de reposo de la mano.
  const restingHand = {
    x: 455,
    y: 540,
  };

  const handTarget = {
    x: lerp(
      restingHand.x,
      drinkingHand.x,
      amount,
    ),
    y: lerp(
      restingHand.y,
      drinkingHand.y,
      amount,
    ),
  };

  const angles = solveArmIK(
    { x: 420, y: 390 },
    handTarget,
    { x: 65, y: 80 },
    { x: -30, y: 70 },
    -1,
  );

  return {
    ...pose,

    heldObject: "waterBottle",

    rightArm: angles.armAngle,
    rightElbow: angles.elbowAngle,

    objectRotation: bottleRotation,
    objectOffsetX: bottleOffset.x,
    objectOffsetY: bottleOffset.y,

    bottleOpen: true,

    headTilt,

    expression: "neutral",
  };
}

    case "talk":
      return {
        ...pose,
        mouthOpen: Math.abs(Math.sin(time * 17)),
        rightArm: -30 + Math.sin(time * 3) * 20,
        rightHand: "open",
      };

    case "surprised":
      return {
        ...pose,
        expression: "surprised",
        leftArm: 65,
        rightArm: -65,
        leftHand: "open",
        rightHand: "open",
        headTilt: -5,
      };

    default:
      return pose;
  }
};