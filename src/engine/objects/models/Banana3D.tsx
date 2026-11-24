import React, { useMemo } from "react";
import * as THREE from "three";

import { ObjectMaterial } from "../../materials/ObjectMaterial";

export const Banana3D: React.FC = () => {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.65, 0.7, 0),
        new THREE.Vector3(-0.4, 0.3, 0),
        new THREE.Vector3(0, 0.18, 0),
        new THREE.Vector3(0.4, 0.3, 0),
        new THREE.Vector3(0.65, 0.65, 0),
      ]),
    [],
  );

  return (
    <group>
      <mesh castShadow>
        <tubeGeometry args={[curve, 32, 0.16, 12, false]} />
        <ObjectMaterial
          preset="organic"
          color="#f8d62b"
        />
      </mesh>

      <mesh position={[-0.65, 0.7, 0]}>
        <sphereGeometry args={[0.12, 16, 12]} />
        <ObjectMaterial
          preset="organic"
          color="#89713a"
        />
      </mesh>

      <mesh position={[0.65, 0.65, 0]}>
        <sphereGeometry args={[0.12, 16, 12]} />
        <ObjectMaterial
          preset="organic"
          color="#89713a"
        />
      </mesh>
    </group>
  );
};