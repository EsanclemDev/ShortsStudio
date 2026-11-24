import type {
  CharacterAction,
} from "../animations/characterAnimations";

import type {
  CameraMode,
} from "../camera/CinematicCamera";

import type {
  TransitionConfig,
} from "../transitions/TransitionTypes";

import type {
  EnvironmentPreset,
} from "../environments/EnvironmentTypes";

export type Position3D = [number, number, number];

export type SceneConfig = {
  action: CharacterAction;
  duration: number;
  from: Position3D;
  to: Position3D;
  camera: CameraMode;
  size?: number;
  transition?: TransitionConfig;
  environment?: EnvironmentPreset;
};

export const getTotalFrames = (
  scenes: SceneConfig[],
  fps: number,
): number => {
  return scenes.reduce(
    (total, scene) =>
      total + Math.max(1, Math.round(scene.duration * fps)),
    0,
  );
};

export const getSceneState = (
  scenes: SceneConfig[],
  frame: number,
  fps: number,
) => {
  if (scenes.length === 0) {
    throw new Error("At least one scene is required");
  }

  let startFrame = 0;

  for (let index = 0; index < scenes.length; index++) {
    const scene = scenes[index];

    const durationFrames = Math.max(
      1,
      Math.round(scene.duration * fps),
    );

    const endFrame = startFrame + durationFrames;

    if (
      frame < endFrame ||
      index === scenes.length - 1
    ) {
      const localFrame = Math.max(
        0,
        frame - startFrame,
      );

      const progress = Math.min(
        1,
        localFrame / Math.max(1, durationFrames - 1),
      );

      const position = scene.from.map(
        (value, axis) =>
          value +
          (scene.to[axis] - value) * progress,
      ) as Position3D;

      return {
        scene,
        index,
        startFrame,
        localFrame,
        progress,
        position,
      };
    }

    startFrame = endFrame;
  }

  throw new Error("Unable to resolve scene");
};