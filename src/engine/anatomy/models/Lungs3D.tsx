import React, { useMemo } from "react";
import * as THREE from "three";

import type { OrganModelProps } from "../AnatomyTypes";
import { AnatomyMaterial } from "../AnatomyMaterial";

export const Lungs3D: React.FC<OrganModelProps> = ({
  color = "#e5a1ad",
  activity = 0,
}) => {
  const bronchi = useMemo(
    () =>
      [-1, 1].map(
        (side) =>
          new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 1.75, 0.25),
            new THREE.Vector3(side * 0.3, 1.5, 0.4),
            new THREE.Vector3(side * 0.65, 1.1, 0.45),
            new THREE.Vector3(side * 0.8, 0.65, 0.4),
          ]),
      ),
    [],
  );

  return (
    <group>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh
            position={[side * 0.65, 0.95, 0]}
            rotation={[0, 0, side * 0.15]}
            scale={[0.58, 0.95, 0.48]}
            castShadow
          >
            <sphereGeometry args={[1, 40, 32]} />

            <AnatomyMaterial
              color={color}
              activity={activity}
            />
          </mesh>

          <mesh
            position={[side * 0.7, 0.45, 0.05]}
            scale={[0.55, 0.45, 0.47]}
          >
            <sphereGeometry args={[1, 32, 24]} />

            <AnatomyMaterial
              color={color}
              activity={activity}
            />
          </mesh>
        </group>
      ))}

      {/* Trachea */}
      <mesh position={[0, 2, 0.25]}>
        <cylinderGeometry args={[0.13, 0.15, 0.75, 24]} />
        <AnatomyMaterial color="#d6b6a8" />
      </mesh>

      {/* Tracheal rings */}
      {Array.from({ length: 8 }, (_, index) => (
        <mesh
          key={index}
          position={[0, 1.67 + index * 0.09, 0.25]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[0.145, 0.018, 8, 24]} />
          <AnatomyMaterial color="#b88d85" />
        </mesh>
      ))}

      {/* Bronchi */}
      {bronchi.map((curve, index) => (
        <mesh key={index}>
          <tubeGeometry args={[curve, 24, 0.09, 12, false]} />
          <AnatomyMaterial color="#bf7f88" />
        </mesh>
      ))}
    </group>
  );
};