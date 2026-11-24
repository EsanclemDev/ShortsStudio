import type {
  EnvironmentConfig,
  EnvironmentPreset,
} from "./EnvironmentTypes.ts";

const studio: EnvironmentConfig = {
  background: "#041522",
  horizon: "#12465e",
  floor: "#062436",

  gridPrimary: "#1688b0",
  gridSecondary: "#0b4059",
  showGrid: true,

  fogNear: 8,
  fogFar: 28,

  ambientColor: "#ffffff",
  ambientIntensity: 0.7,

  keyColor: "#ffffff",
  keyIntensity: 2.2,

  fillColor: "#168cff",
  fillIntensity: 25,

  rimColor: "#00d9ff",
  rimIntensity: 35,
};

export const ENVIRONMENT_PRESETS: Record<
  EnvironmentPreset,
  EnvironmentConfig
> = {
  studio,

  medical: {
    ...studio,
    background: "#071c2b",
    horizon: "#28758c",
    floor: "#123c4d",
    gridPrimary: "#51b8ce",
    gridSecondary: "#226477",
    keyColor: "#e5faff",
    fillColor: "#38bdf8",
    rimColor: "#67e8f9",
  },

  microscopic: {
    ...studio,
    background: "#100b24",
    horizon: "#39235c",
    floor: "#17102e",
    showGrid: false,
    fogNear: 5,
    fogFar: 22,
    fillColor: "#8b5cf6",
    rimColor: "#c084fc",
  },

  danger: {
    ...studio,
    background: "#200609",
    horizon: "#651c24",
    floor: "#300c12",
    gridPrimary: "#b83b46",
    gridSecondary: "#57202a",
    ambientColor: "#ffd5d5",
    fillColor: "#ff3333",
    rimColor: "#ff7043",
  },

  healthy: {
    ...studio,
    background: "#031b16",
    horizon: "#145c45",
    floor: "#082e23",
    gridPrimary: "#20a878",
    gridSecondary: "#15533f",
    fillColor: "#22c55e",
    rimColor: "#6ee7b7",
  },

  dark: {
    ...studio,
    background: "#050509",
    horizon: "#252536",
    floor: "#101018",
    showGrid: false,
    ambientIntensity: 0.35,
    keyIntensity: 2.5,
    fillColor: "#6366f1",
    fillIntensity: 12,
    rimColor: "#a5b4fc",
    rimIntensity: 20,
  },
  gym: {
    ...studio,
    background: "#101923",
    horizon: "#26394a",
    floor: "#222a32",
    gridPrimary: "#111820",
    gridSecondary: "#303b45",
    showGrid: false,
    fogNear: 12,
    fogFar: 35,
    ambientIntensity: 0.85,
    keyIntensity: 2.4,
    fillColor: "#60a5fa",
    fillIntensity: 18,
    rimColor: "#22d3ee",
    rimIntensity: 24,
  },
};
