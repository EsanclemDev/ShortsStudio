export type ParticleType =
  | "water"
  | "bubble"
  | "sodium"
  | "blood"
  | "energy"
  | "dust";

export type ParticleMotion =
  | "float"
  | "rise"
  | "fall"
  | "flow"
  | "orbit"
  | "burst";

export type ParticleConfig = {
  type: ParticleType;
  motion?: ParticleMotion;
  count?: number;
  position?: [number, number, number];
  spread?: [number, number, number];
  direction?: [number, number, number];
  color?: string;
  size?: number;
  speed?: number;
  seed?: number;
  startFrame?: number;
};