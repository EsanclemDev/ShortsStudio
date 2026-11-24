import React from "react";
import { ObjectMaterial } from "../../materials/ObjectMaterial";

export const Apple3D: React.FC = () => {
  return (
    <group>
      <mesh
        position={[0, 0.48, 0]}
        scale={[1, 0.95, 1]}
        castShadow
      >
        <sphereGeometry args={[0.5, 32, 24]} />
        <ObjectMaterial
          preset="organic"
          color="#e52b35"
        />
      </mesh>

      <mesh
        position={[0, 1.02, 0]}
        rotation={[0, 0, -0.2]}
      >
        <cylinderGeometry args={[0.035, 0.045, 0.25, 12]} />
        <ObjectMaterial
          preset="organic"
          color="#69411e"
        />
      </mesh>

      <mesh
        position={[0.19, 1.06, 0]}
        rotation={[0, 0, 0.4]}
        scale={[0.25, 0.08, 0.13]}
      >
        <sphereGeometry args={[1, 20, 16]} />
        <ObjectMaterial
          preset="organic"
          color="#39a84b"
        />
      </mesh>
    </group>
  );
};