import type {
  SceneConfig,
} from "../../engine/scenes/SceneController";

export const WORLD_SCENES: SceneConfig[] = [
  {
    action: "idle",
    duration: 2,
    from: [0, 0, 0],
    to: [0, 0, 0],
    camera: "static",
  },
  {
    action: "wave",
    duration: 2,
    from: [0, 0, 0],
    to: [0, 0, 0],
    camera: "zoomIn",
  },
  {
    action: "drink",
    duration: 3,
    from: [0, 0, 0],
    to: [0, 0, 0],
    camera: "zoomOut",
  },
  {
    action: "dance",
    duration: 3,
    from: [0, 0, 0],
    to: [0, 0, 0],
    camera: "orbit",
  },
  {
    action: "talk",
    duration: 2,
    from: [0, 0, 0],
    to: [0, 0, 0],
    camera: "pan",
  },
  {
    action: "walk",
    duration: 3,
    from: [0, 0, 0],
    to: [3, 0, 0],
    camera: "follow",
  },
  {
    action: "run",
    duration: 3,
    from: [3, 0, 0],
    to: [-3, 0, -2],
    camera: "follow",
  },
  {
    action: "surprised",
    duration: 2,
    from: [-3, 0, -2],
    to: [-3, 0, -2],
    camera: "closeUp",
  },
  {
    action: "point",
    duration: 2,
    from: [-3, 0, -2],
    to: [-3, 0, -2],
    camera: "follow",
  },
  {
    action: "thumbsUp",
    duration: 2,
    from: [-3, 0, -2],
    to: [-3, 0, -2],
    camera: "follow",
  },
];