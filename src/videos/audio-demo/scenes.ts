import type {
  SceneConfig,
} from "../../engine/scenes/SceneController";

export const AUDIO_SCENES: SceneConfig[] = [
  {
    action: "talk",
    duration: 3.3,
    from: [0, 0, 0],
    to: [0, 0, 0],
    camera: "zoomIn",
    transition: {
      type: "none",
    },
  },
  {
    action: "drink",
    duration: 4.2,
    from: [0, 0, 0],
    to: [0, 0, 0],
    camera: "static",
    transition: {
      type: "zoom",
      durationInFrames: 10,
    },
  },
  {
    action: "surprised",
    duration: 4.5,
    from: [0, 0, 0],
    to: [0, 0, 0],
    camera: "zoomIn",
    transition: {
      type: "flash",
      durationInFrames: 8,
      color: "#ff5555",
    },
  },
  {
    action: "talk",
    duration: 4.5,
    from: [0, 0, 0],
    to: [0, 0, 0],
    camera: "static",
    transition: {
      type: "fade",
      durationInFrames: 10,
    },
  },
];