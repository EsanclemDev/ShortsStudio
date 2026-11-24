import captions from "./captions.json";

import type {
  TransitionConfig,
} from "../../../engine/transitions/TransitionTypes";

export const FPS = 30;
export const RUNNING_HEART_FRAMES = 983;

export type RunningSceneType =
  | "hook"
  | "muscles"
  | "heart"
  | "lungs"
  | "intensity"
  | "training"
  | "comparison"
  | "ending";

interface RunningSceneDefinition {
  type: RunningSceneType;
  startFrame: number;
  transition: TransitionConfig;
}

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .trim();

const words = captions.map((word) =>
  normalize(word.text),
);

const findFrame = (
  phrases: string[],
  fallbackSeconds: number,
  minimumFrame = 0,
) => {
  for (const phrase of phrases) {
    const target = normalize(phrase).split(/\s+/);

    for (let i = 0; i < words.length; i++) {
      const currentFrame = Math.round(
        captions[i].startMs * FPS / 1000,
      );

      if (currentFrame < minimumFrame) {
        continue;
      }

      const matches = target.every(
        (word, offset) =>
          words[i + offset] === word,
      );

      if (matches) {
        return currentFrame;
      }
    }
  }

  console.warn(
    "RunningHeart: timing de respaldo",
    phrases,
    fallbackSeconds,
  );

  return Math.max(
    minimumFrame,
    Math.round(fallbackSeconds * FPS),
  );
};

const definitions: RunningSceneDefinition[] = [
  {
    type: "hook",
    startFrame: 0,
    transition: {
      type: "none",
    },
  },
  {
    type: "muscles",
    startFrame: findFrame(
      [
        "al empezar a correr",
        "tus músculos necesitan",
      ],
      5,
    ),
    transition: {
      type: "none",
    },
  },
  {
    type: "heart",
    startFrame: findFrame(
      [
        "tu corazón acelera",
        "para enviarles más sangre",
      ],
      9,
      150,
    ),
    transition: {
      type: "zoom",
      durationInFrames: 18,
    },
  },
  {
    type: "lungs",
    startFrame: findFrame(
      [
        "mientras tu respiración",
        "tu respiración aumenta",
      ],
      12,
      240,
    ),
    transition: {
      type: "fade",
      durationInFrames: 15,
    },
  },
  {
    type: "intensity",
    startFrame: findFrame(
      [
        "cuanto mayor es el esfuerzo",
        "mayor es el esfuerzo",
      ],
      14,
      330,
    ),
    transition: {
      type: "fade",
      durationInFrames: 15,
    },
  },
  {
    type: "training",
    startFrame: findFrame(
      [
        "con el entrenamiento",
        "tu corazón puede bombear",
      ],
      19,
      450,
    ),
    transition: {
      type: "fade",
      durationInFrames: 20,
    },
  },
  {
    type: "comparison",
    startFrame: findFrame(
      [
        "por eso a la misma velocidad",
        "a la misma velocidad",
      ],
      24,
      600,
    ),
    transition: {
      type: "slide",
      durationInFrames: 18,
    },
  },
  {
    type: "ending",
    startFrame: findFrame(
      [
        "no solo estás entrenando",
        "no solo",
      ],
      29,
      750,
    ),
    transition: {
      type: "fade",
      durationInFrames: 20,
    },
  },
];

export const RUNNING_SCENES = definitions
  .sort((a, b) => a.startFrame - b.startFrame)
  .map((scene, index, all) => ({
    ...scene,

    durationInFrames: Math.max(
      1,
      (all[index + 1]?.startFrame ??
        RUNNING_HEART_FRAMES) -
        scene.startFrame,
    ),
  }));

export const getRunningScene = (frame: number) =>
  [...RUNNING_SCENES]
    .reverse()
    .find((scene) =>
      frame >= scene.startFrame,
    ) ?? RUNNING_SCENES[0];

console.table(
  RUNNING_SCENES.map((scene) => ({
    scene: scene.type,
    start: (scene.startFrame / FPS).toFixed(2),
    duration: (
      scene.durationInFrames / FPS
    ).toFixed(2),
    transition: scene.transition.type,
  })),
);