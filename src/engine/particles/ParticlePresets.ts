import type { ParticleType } from "./ParticleTypes";

type ParticlePreset = {
  color: string;
  size: number;
  roughness: number;
  metalness: number;
  opacity: number;
  emissiveIntensity: number;
};

export const PARTICLE_PRESETS: Record<
  ParticleType,
  ParticlePreset
> = {
  water: {
    color: "#38bdf8",
    size: 0.12,
    roughness: 0.15,
    metalness: 0.1,
    opacity: 0.85,
    emissiveIntensity: 0.05,
  },

  bubble: {
    color: "#a5e8ff",
    size: 0.16,
    roughness: 0.1,
    metalness: 0.1,
    opacity: 0.35,
    emissiveIntensity: 0.1,
  },

  sodium: {
    color: "#fbbf24",
    size: 0.13,
    roughness: 0.4,
    metalness: 0.1,
    opacity: 1,
    emissiveIntensity: 0.3,
  },

  blood: {
    color: "#dc2626",
    size: 0.2,
    roughness: 0.55,
    metalness: 0,
    opacity: 1,
    emissiveIntensity: 0,
  },

  energy: {
    color: "#a78bfa",
    size: 0.08,
    roughness: 0.3,
    metalness: 0,
    opacity: 1,
    emissiveIntensity: 1.5,
  },

  dust: {
    color: "#cbd5e1",
    size: 0.035,
    roughness: 0.9,
    metalness: 0,
    opacity: 0.6,
    emissiveIntensity: 0,
  },
};