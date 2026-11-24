export type EnvironmentPreset =
  | "studio"
  | "medical"
  | "microscopic"
  | "danger"
  | "healthy"
  | "dark"
  | "gym";

export type EnvironmentConfig = {
  background: string;
  horizon: string;
  floor: string;

  gridPrimary: string;
  gridSecondary: string;
  showGrid: boolean;

  fogNear: number;
  fogFar: number;

  ambientColor: string;
  ambientIntensity: number;

  keyColor: string;
  keyIntensity: number;

  fillColor: string;
  fillIntensity: number;

  rimColor: string;
  rimIntensity: number;
};