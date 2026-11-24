import React, {
  useMemo,
  useRef,
  useLayoutEffect,
} from "react";

import * as THREE from "three";

import { useThree } from "@react-three/fiber";

import {
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import type {
  ParticleConfig,
} from "./ParticleTypes";

import {
  PARTICLE_PRESETS,
} from "./ParticlePresets";

import {
  createRandom,
} from "./ParticleRandom";

import {
  getParticlePose,
  type ParticleData,
} from "./ParticleMotion";

export const ParticleSystem: React.FC<ParticleConfig> = ({
  type,
  motion = "float",
  count = 100,
  position = [0, 2, 0],
  spread = [4, 4, 4],
  direction = [1, 0, 0],
  color,
  size,
  speed = 1,
  seed = 42,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const invalidate = useThree(
    (state) => state.invalidate,
  );

  const meshRef = useRef<THREE.InstancedMesh>(null);

  const preset = PARTICLE_PRESETS[type];

  const particleSize = size ?? preset.size;

  const particleCount = Math.max(
    1,
    Math.floor(count),
  );

  const [sx, sy, sz] = spread;
  const [dx, dy, dz] = direction;

  const dummy = useMemo(
    () => new THREE.Object3D(),
    [],
  );

  const particles = useMemo(() => {
    const random = createRandom(seed);

    return Array.from(
      { length: particleCount },
      (): ParticleData => ({
        x: (random() - 0.5) * sx,
        y: (random() - 0.5) * sy,
        z: (random() - 0.5) * sz,
        phase: random() * Math.PI * 2,
        angle: random() * Math.PI * 2,
        speed: 0.5 + random(),
        size: 0.5 + random() * 0.8,
      }),
    );
  }, [particleCount, seed, sx, sy, sz]);

  const time = Math.max(
    0,
    frame - startFrame,
  ) / fps;

  useLayoutEffect(() => {
    const mesh = meshRef.current;

    if (!mesh) return;

    particles.forEach((particle, index) => {
      const pose = getParticlePose(
        particle,
        motion,
        time,
        speed,
        [sx, sy, sz],
        [dx, dy, dz],
      );

      const scale = Math.max(
        0,
        pose.scale * particleSize,
      );

      dummy.position.set(
        pose.x,
        pose.y,
        pose.z,
      );

      dummy.rotation.set(
        pose.rotation * 0.5,
        pose.rotation,
        pose.rotation * 0.3,
      );

      if (type === "blood") {
        dummy.scale.set(
          scale,
          scale * 0.35,
          scale,
        );
      } else if (type === "water") {
        dummy.scale.set(
          scale * 0.8,
          scale * 1.4,
          scale * 0.8,
        );
      } else {
        dummy.scale.setScalar(scale);
      }

      dummy.updateMatrix();

      mesh.setMatrixAt(
        index,
        dummy.matrix,
      );
    });

    mesh.instanceMatrix.needsUpdate = true;

    invalidate();
  }, [
    particles,
    motion,
    time,
    speed,
    sx,
    sy,
    sz,
    dx,
    dy,
    dz,
    dummy,
    type,
    particleSize,
    invalidate,
    startFrame,
  ]);

  return (
    <group
      position={position}
      visible={frame >= startFrame}
    >
      <instancedMesh
        key={particleCount}
        ref={meshRef}
        args={[undefined, undefined, particleCount]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 12, 8]} />

        <meshStandardMaterial
          color={color ?? preset.color}
          roughness={preset.roughness}
          metalness={preset.metalness}
          transparent={preset.opacity < 1}
          opacity={preset.opacity}
          depthWrite={preset.opacity === 1}
          emissive={color ?? preset.color}
          emissiveIntensity={
            preset.emissiveIntensity
          }
        />
      </instancedMesh>
    </group>
  );
};