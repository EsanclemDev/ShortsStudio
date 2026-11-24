import type { ParticleMotion } from "./ParticleTypes";

export type ParticleData = {
  x: number;
  y: number;
  z: number;
  phase: number;
  speed: number;
  size: number;
  angle: number;
};

export type ParticlePose = {
  x: number;
  y: number;
  z: number;
  scale: number;
  rotation: number;
};

const wrap = (value: number, range: number) => {
  if (range <= 0) return 0;

  return (
    ((value + range / 2) % range + range) % range
  ) - range / 2;
};

export const getParticlePose = (
  particle: ParticleData,
  motion: ParticleMotion,
  time: number,
  speed: number,
  spread: [number, number, number],
  direction: [number, number, number],
): ParticlePose => {
  const t = time * speed * particle.speed;

  const pose: ParticlePose = {
    x: particle.x,
    y: particle.y,
    z: particle.z,
    scale: particle.size,
    rotation: particle.angle + t,
  };

  switch (motion) {
    case "float":
      return {
        ...pose,
        x: pose.x + Math.sin(t + particle.phase) * 0.2,
        y: pose.y + Math.cos(t + particle.phase) * 0.3,
        z: pose.z + Math.sin(t * 0.7) * 0.15,
      };

    case "rise":
      return {
        ...pose,
        y: wrap(particle.y + t, spread[1]),
        x: pose.x + Math.sin(t * 2 + particle.phase) * 0.15,
      };

    case "fall":
      return {
        ...pose,
        y: wrap(particle.y - t, spread[1]),
      };

    case "flow":
      return {
        ...pose,
        x: wrap(particle.x + t * direction[0], spread[0]),
        y: wrap(particle.y + t * direction[1], spread[1]),
        z: wrap(particle.z + t * direction[2], spread[2]),
      };

    case "orbit": {
      const angle = particle.angle + t;

      const radius = Math.hypot(
        particle.x,
        particle.z,
      );

      return {
        ...pose,
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        y: particle.y + Math.sin(t * 2) * 0.15,
      };
    }

    case "burst": {
      const progress = Math.min(1, t);

      return {
        ...pose,
        x: particle.x * progress,
        y: particle.y * progress - progress ** 2 * 0.8,
        z: particle.z * progress,
        scale: particle.size * (1 - progress),
      };
    }

    default:
      return pose;
  }
};