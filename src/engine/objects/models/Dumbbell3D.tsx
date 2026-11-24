import React from "react";
import { ObjectMaterial } from "../../materials/ObjectMaterial";

export const Dumbbell3D: React.FC = () => {
  return (
    <group position={[0, 0.35, 0]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.09, 0.09, 1.5, 24]} />
        <ObjectMaterial
          preset="metal"
          color="#b9c1cc"
        />
      </mesh>

      {[-1, 1].map((side) => (
        <group
          key={side}
          position={[side * 0.65, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <mesh castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.25, 6]} />
            <ObjectMaterial
              preset="rubber"
              color="#252a34"
            />
          </mesh>

          <mesh position={[0, side * 0.17, 0]}>
            <cylinderGeometry args={[0.24, 0.24, 0.1, 24]} />
            <ObjectMaterial
              preset="metal"
              color="#747e8b"
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};