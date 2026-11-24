import React, { useMemo } from "react";
import * as THREE from "three";

import type { OrganModelProps } from "../AnatomyTypes";
import { AnatomyMaterial } from "../AnatomyMaterial";

export const Heart3D: React.FC<OrganModelProps> = ({
  color = "#b92d43",
  activity = 0,
}) => {
  const aorta = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 1.25, -0.1),
        new THREE.Vector3(-0.05, 1.85, -0.1),
        new THREE.Vector3(0.35, 2.05, -0.15),
        new THREE.Vector3(0.65, 1.8, -0.3),
      ]),
    [],
  );

  const artery = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.15, 1.5, 0.42),
        new THREE.Vector3(0.05, 1.1, 0.61),
        new THREE.Vector3(0.2, 0.65, 0.48),
        new THREE.Vector3(0.25, 0.2, 0.15),
      ]),
    [],
  );

  return (
    <group>
      {/* Main ventricular body */}
      <mesh
        position={[0.12, 0.83, 0]}
        rotation={[0, 0, 0.3]}
        scale={[0.7, 0.85, 0.58]}
        castShadow
      >
        <sphereGeometry args={[1, 40, 32]} />

        <AnatomyMaterial
          color={color}
          activity={activity}
        />
      </mesh>

      {/* Right ventricle */}
      <mesh
        position={[-0.35, 0.92, 0.12]}
        scale={[0.48, 0.63, 0.46]}
      >
        <sphereGeometry args={[1, 32, 24]} />

        <AnatomyMaterial
          color="#c93b4e"
          activity={activity}
        />
      </mesh>

      {/* Atria */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * 0.43, 1.45, -0.05]}
          scale={[0.38, 0.32, 0.4]}
        >
          <sphereGeometry args={[1, 24, 20]} />

          <AnatomyMaterial
            color="#ae3045"
            activity={activity}
          />
        </mesh>
      ))}

      {/* Aorta */}
      <mesh>
        <tubeGeometry args={[aorta, 32, 0.18, 16, false]} />
        <AnatomyMaterial color="#d34a50" />
      </mesh>

      {/* Pulmonary artery */}
      <mesh
        position={[-0.38, 1.73, -0.1]}
        rotation={[0, 0, 0.35]}
      >
        <cylinderGeometry args={[0.14, 0.18, 0.7, 24]} />
        <AnatomyMaterial color="#637bb7" />
      </mesh>

      {/* Coronary vessel */}
      <mesh>
        <tubeGeometry args={[artery, 24, 0.045, 8, false]} />
        <AnatomyMaterial color="#f4a0a0" />
      </mesh>
    </group>
  );
};