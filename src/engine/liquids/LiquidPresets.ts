import type { LiquidType } from "./LiquidTypes";

type LiquidPreset = {
  color: string;
  opacity: number;
  roughness: number;
  metalness: number;
  emissiveIntensity: number;
};

export const LIQUID_PRESETS: Record<
  LiquidType,
  LiquidPreset
> = {
  water: {
    color: "#38bdf8",
    opacity: 0.75,
    roughness: 0.12,
    metalness: 0.1,
    emissiveIntensity: 0.05,
  },

  blood: {
    color: "#b91c1c",
    opacity: 0.95,
    roughness: 0.35,
    metalness: 0.05,
    emissiveIntensity: 0,
  },

  gastric: {
    color: "#b5c934",
    opacity: 0.85,
    roughness: 0.3,
    metalness: 0,
    emissiveIntensity: 0.1,
  },

  generic: {
    color: "#a78bfa",
    opacity: 0.8,
    roughness: 0.2,
    metalness: 0.05,
    emissiveIntensity: 0.1,
  },
};