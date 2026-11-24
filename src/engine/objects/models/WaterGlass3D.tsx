import React from "react";
import { ObjectMaterial } from "../../materials/ObjectMaterial";

export const WaterGlass3D: React.FC = () => {
  return (
    <group>
      {/* Water */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.29, 0.23, 0.8, 32]} />
        <ObjectMaterial
          preset="water"
          color="#38bdf8"
        />
      </mesh>

      {/* Glass wall */}
      <mesh position={[0, 0.6, 0]} renderOrder={2}>
        <cylinderGeometry
          args={[0.36, 0.26, 1.2, 32, 1, true]}
        />
        <ObjectMaterial
          preset="glass"
          color="#d9f7ff"
        />
      </mesh>

      {/* Rim */}
      <mesh
        position={[0, 1.2, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[0.35, 0.025, 12, 32]} />
        <ObjectMaterial
          preset="glass"
          color="#ffffff"
          opacity={0.65}
        />
      </mesh>

      {/* Base */}
      <mesh position={[0, 0.035, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.07, 32]} />
        <ObjectMaterial
          preset="glass"
          color="#d9f7ff"
          opacity={0.65}
        />
      </mesh>
    </group>
  );
};