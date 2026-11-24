import type {
  AudioConfig,
} from "../../engine/audio/AudioTypes";

const FPS = 30;

const at = (seconds: number) =>
  Math.round(seconds * FPS);

export const DEMO_AUDIO: AudioConfig = {
  voice: {
    src: "audio/voice/water.mp3",
    volume: 1,
    startFrame: 0,
  },
music: {
  src: "audio/music/curiosity.wav",
  volume: 0.07,
  startFrame: 0,
  fadeIn: 15,
  fadeOut: 30,
  loop: true,
},
  effects: [
    {
      src: "audio/sfx/pop.wav",
      startFrame: at(0),
      durationInFrames: at(0.18),
      volume: 0.12,
    },
    {
      src: "audio/sfx/impact.wav",
      startFrame: at(2.38),
      durationInFrames: at(0.65),
      volume: 0.20,
    },
    {
      src: "audio/sfx/whoosh.wav",
      startFrame: at(3.3),
      durationInFrames: at(0.45),
      volume: 0.15,
    },
    {
      src: "audio/sfx/water.wav",
      startFrame: at(4.1),
      durationInFrames: at(0.9),
      volume: 0.12,
    },
    {
      src: "audio/sfx/warning.wav",
      startFrame: at(7.64),
      durationInFrames: at(0.65),
      volume: 0.10,
    },
    {
      src: "audio/sfx/heartbeat.wav",
      startFrame: at(10.22),
      durationInFrames: at(0.9),
      volume: 0.18,
    },
    {
      src: "audio/sfx/whoosh.wav",
      startFrame: at(12),
      durationInFrames: at(0.45),
      volume: 0.12,
    },
    {
      src: "audio/sfx/success.wav",
      startFrame: at(15.64),
      durationInFrames: at(0.7),
      volume: 0.15,
    },
  ],
};