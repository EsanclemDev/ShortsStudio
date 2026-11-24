import React from "react";
import { ObjectMaterial } from "../../materials/ObjectMaterial";

export const WaterBottle3D: React.FC = () => {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.32, 1.3, 32]} />
        <ObjectMaterial
          preset="plastic"
          color="#38bdf8"
        />
      </mesh>

      {/* Shoulder */}
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.13, 0.3, 0.2, 32]} />
        <ObjectMaterial
          preset="plastic"
          color="#38bdf8"
        />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.55, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.15, 24]} />
        <ObjectMaterial
          preset="plastic"
          color="#38bdf8"
        />
      </mesh>

      {/* Cap */}
      <mesh position={[0, 1.68, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.15, 24]} />
        <ObjectMaterial
          preset="plastic"
          color="#1256ba"
        />
      </mesh>

      {/* Label */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.313, 0.32, 0.42, 32]} />
        <ObjectMaterial
          preset="matte"
          color="#e0f7ff"
        />
      </mesh>

      {/* Bottle ridges */}
      {[0.15, 0.28, 1.1, 1.23].map((y) => (
        <mesh
          key={y}
          position={[0, y, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[0.306, 0.014, 8, 32]} />
          <ObjectMaterial
            preset="plastic"
            color="#209bd4"
          />
        </mesh>
      ))}
    </group>
  );
};