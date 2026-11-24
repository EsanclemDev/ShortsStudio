import type { MeshStandardMaterialParameters } from "three";

export type MaterialPreset =
  | "plastic"
  | "metal"
  | "rubber"
  | "glass"
  | "water"
  | "organic"
  | "matte"
  | "glowing";

export const MATERIAL_PRESETS: Record<
  MaterialPreset,
  MeshStandardMaterialParameters
> = {
  plastic: {
    roughness: 0.35,
    metalness: 0.05,
  },

  metal: {
    roughness: 0.3,
    metalness: 0.85,
  },

  rubber: {
    roughness: 0.95,
    metalness: 0,
  },

  glass: {
    roughness: 0.08,
    metalness: 0.05,
    transparent: true,
    opacity: 0.25,
    depthWrite: false,
  },

  water: {
    roughness: 0.12,
    metalness: 0.1,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
  },

  organic: {
    roughness: 0.65,
    metalness: 0,
  },

  matte: {
    roughness: 0.85,
    metalness: 0,
  },

  glowing: {
    roughness: 0.4,
    metalness: 0.1,
    emissiveIntensity: 0.8,
  },
};