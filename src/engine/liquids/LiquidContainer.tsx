import React from "react";

import type { LiquidConfig } from "./LiquidTypes";
import { LiquidVolume } from "./LiquidVolume";

type Props = LiquidConfig & {
  glassOpacity?: number;
};

export const LiquidContainer: React.FC<Props> = ({
  position = [0, 0, 0],
  radius = 0.6,
  height = 2,
  glassOpacity = 0.2,
  ...liquid
}) => {
  return (
    <group position={position}>
      <LiquidVolume
        {...liquid}
        radius={radius - 0.035}
        height={height - 0.05}
        position={[0, 0.05, 0]}
      />

      {/* Glass wall */}
      <mesh
        position={[0, height / 2, 0]}
        renderOrder={3}
      >
        <cylinderGeometry
          args={[radius, radius, height, 48, 1, true]}
        />

        <meshStandardMaterial
          color="#d9f7ff"
          transparent
          opacity={glassOpacity}
          roughness={0.1}
          metalness={0.05}
          depthWrite={false}
        />
      </mesh>

      {/* Rim */}
      <mesh
        position={[0, height, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[radius, 0.025, 8, 48]} />

        <meshStandardMaterial
          color="#d9f7ff"
          transparent
          opacity={0.65}
          depthWrite={false}
        />
      </mesh>

      {/* Base */}
      <mesh position={[0, 0.025, 0]}>
        <cylinderGeometry
          args={[radius, radius, 0.05, 48]}
        />

        <meshStandardMaterial
          color="#d9f7ff"
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};