import React, {
  useMemo,
  useLayoutEffect,
  useEffect,
} from "react";

import * as THREE from "three";

import { useThree } from "@react-three/fiber";

import {
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import type { LiquidConfig } from "./LiquidTypes";
import { LiquidMaterial } from "./LiquidMaterial";
import { getLiquidLevel } from "./LiquidAnimations";

export const LiquidVolume: React.FC<LiquidConfig> = ({
  type = "water",
  position = [0, 0, 0],
  radius = 0.5,
  height = 2,
  level = 0.8,
  animation = "wave",
  duration = 3,
  speed = 1,
  color,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const invalidate = useThree(
    (state) => state.invalidate,
  );

  const time =
    Math.max(0, frame - startFrame) / fps;

  const currentLevel = getLiquidLevel(
    animation,
    time,
    level,
    duration,
    speed,
  );

  const liquidHeight = height * currentLevel;

  const geometry = useMemo(
    () => new THREE.CircleGeometry(radius, 64),
    [radius],
  );

  const originalPositions = useMemo(
    () =>
      Float32Array.from(
        geometry.attributes.position.array,
      ),
    [geometry],
  );

  useLayoutEffect(() => {
    const positions = geometry.attributes.position;

    for (let i = 0; i < positions.count; i++) {
      const x = originalPositions[i * 3];
      const y = originalPositions[i * 3 + 1];

      const distance = Math.hypot(x, y);

      const edgeFade = Math.max(
        0,
        1 - distance / Math.max(radius, 0.001),
      );

      const wave =
        Math.sin(x * 7 + time * speed * 4) *
        Math.cos(y * 5 + time * speed * 3) *
        0.045 *
        edgeFade *
        currentLevel;

      positions.setZ(i, wave);
    }

    positions.needsUpdate = true;

    geometry.computeVertexNormals();

    invalidate();
  }, [
    geometry,
    originalPositions,
    time,
    speed,
    radius,
    currentLevel,
    invalidate,
  ]);

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  if (frame < startFrame || liquidHeight <= 0.001) {
    return null;
  }

  return (
    <group position={position}>
      {/* Liquid body */}
      <mesh
        position={[0, liquidHeight / 2, 0]}
        scale={[1, liquidHeight, 1]}
      >
        <cylinderGeometry
          args={[radius, radius, 1, 48, 1, true]}
        />

        <LiquidMaterial
          type={type}
          color={color}
        />
      </mesh>

      {/* Bottom */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[radius, 48]} />

        <LiquidMaterial
          type={type}
          color={color}
        />
      </mesh>

      {/* Animated surface */}
      <mesh
        geometry={geometry}
        position={[0, liquidHeight, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={1}
      >
        <LiquidMaterial
          type={type}
          color={color}
        />
      </mesh>
    </group>
  );
};