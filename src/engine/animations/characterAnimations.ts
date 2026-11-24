import { getWorkoutState, type WorkoutConfig } from "./workout";
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
  | "surprised"
  | "bicepsCurl"
  | "bicepsCurlFatigue"
  | "exhausted"
  | "flex"
  | "celebrate";

export type CharacterPose = CharacterProps & {
  offsetY: number;
  rotation: number;
  scale: number;
};

export const getCharacterPose = (
  action: CharacterAction,
  time: number,
  workout?: WorkoutConfig
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
    case "bicepsCurl":
    case "bicepsCurlFatigue": {
      const fatigue = action === "bicepsCurlFatigue";
      const period = fatigue ? 2.8 : 1.8;
      const state = workout ? getWorkoutState(time, { ...workout, period: workout.period ?? period }) : undefined;
      const lift = state?.lift ?? (1 - Math.cos(2 * Math.PI * time / period)) / 2;
      const redness = state?.fatigue ?? (fatigue ? Math.min(1, time / 5) : 0);
      const tremor = state?.failed ? Math.sin(time * 35) * 13 * state.struggle : 0;
      return {
        ...pose,
        dumbbells: true,
        fatigue: redness,
        expression: state?.success ? "happy" : state?.done ? "tired" : state?.failed ? "effort" : lift > 0.45 ? "effort" : fatigue ? "tired" : "neutral",
        leftArm: -8 - (state?.struggle ?? 0)*12,
        rightArm: 8 + (state?.struggle ?? 0)*12,
        leftElbow: -125 * lift + tremor,
        rightElbow: 125 * lift - tremor,
        headTilt: state?.failed ? -12 * state.struggle + Math.sin(time*25)*3*state.struggle : state?.done && !state.success ? 12*redness : fatigue ? Math.sin(time * 8) * lift * 3 : 0,
        rotation: state?.failed ? Math.sin(time*19)*3*state.struggle : state?.done && !state.success ? 8*redness : 0,
        leftKnee: state?.failed ? 14*state.struggle : 0,
        rightKnee: state?.failed ? 14*state.struggle : 0,
        offsetY: state?.failed ? 14*state.struggle : state?.done && !state.success ? 10*redness : 0,
      };
    }
    case "exhausted":
      return { ...pose, expression: "tired", fatigue: Math.max(0, 1-time/3), leftArm: -8, rightArm: 8, headTilt: 8, dumbbells: true };
    case "flex":
      return { ...pose, leftArm: 105, rightArm: -105, leftElbow: 70, rightElbow: -70, mouthOpen: 1 };
    case "celebrate":
      return { ...pose, leftArm: 135, rightArm: -135, leftHand: "open", rightHand: "open", offsetY: -Math.abs(Math.sin(time * 6)) * 25, mouthOpen: 1 };
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