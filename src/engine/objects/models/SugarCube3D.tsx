import React from "react";
import { ObjectMaterial } from "../../materials/ObjectMaterial";

export const SugarCube3D: React.FC = () => {
  return (
    <group>
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <ObjectMaterial
          preset="matte"
          color="#fffdf5"
        />
      </mesh>
    </group>
  );
};