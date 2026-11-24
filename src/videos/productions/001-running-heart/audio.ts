import type {
  AudioConfig,
} from "../../../engine/audio/AudioTypes";

import {
  RUNNING_SCENES,
  type RunningSceneType,
} from "./scenes";

const getStart = (type: RunningSceneType) =>
  RUNNING_SCENES.find(
    (scene) => scene.type === type,
  )?.startFrame ?? 0;

export const RUNNING_AUDIO: AudioConfig = {
  voice: {
    src: "audio/voice/running-heart.mp3",
    volume: 1,
  },

  music: {
    src: "audio/music/energetic.wav",
    volume: 0.055,
    fadeIn: 25,
    fadeOut: 45,
    loop: true,
  },

  effects: [
    {
      src: "audio/sfx/impact.wav",
      startFrame: 0,
      volume: 0.1,
    },
    {
      src: "audio/sfx/whoosh.wav",
      startFrame: getStart("heart"),
      volume: 0.09,
    },
    {
      src: "audio/sfx/heartbeat.wav",
      startFrame: getStart("heart") + 5,
      volume: 0.12,
    },
    {
      src: "audio/sfx/pop.wav",
      startFrame: getStart("comparison") + 10,
      volume: 0.08,
    },
    {
      src: "audio/sfx/success.wav",
      startFrame: getStart("ending") + 15,
      volume: 0.1,
    },
  ],
};