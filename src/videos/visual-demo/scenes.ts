import type {
  SceneConfig,
} from "../../engine/scenes/SceneController";

export const VISUAL_SCENES: SceneConfig[] = [
  {
    action: "idle",
    duration: 3,
    from: [0, 0, 0],
    to: [0, 0, 0],
    camera: "orbit",
    environment: "studio",
  },
  {
    action: "talk",
    duration: 3,
    from: [0, 0, 0],
    to: [0, 0, 0],
    camera: "zoomIn",
    environment: "medical",
  },
  {
    action: "point",
    duration: 3,
    from: [0, 0, 0],
    to: [0, 0, 0],
    camera: "orbit",
    environment: "microscopic",
  },
  {
    action: "surprised",
    duration: 3,
    from: [0, 0, 0],
    to: [0, 0, 0],
    camera: "zoomIn",
    environment: "danger",
  },
  {
    action: "thumbsUp",
    duration: 3,
    from: [0, 0, 0],
    to: [0, 0, 0],
    camera: "zoomOut",
    environment: "healthy",
  },
  {
    action: "idle",
    duration: 3,
    from: [0, 0, 0],
    to: [0, 0, 0],
    camera: "orbit",
    environment: "dark",
  },
];