import React, { useMemo, useEffect } from "react";
import * as THREE from "three";

import type { OrganModelProps } from "../AnatomyTypes";
import { AnatomyMaterial } from "../AnatomyMaterial";

export const Kidneys3D: React.FC<OrganModelProps> = ({
  color = "#a73549",
  activity = 0,
}) => {
  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 40, 32);
    const positions = geo.attributes.position;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);

      const indentation =
        Math.max(0, x) *
        Math.exp(-y * y * 8) *
        0.55;

      positions.setXYZ(
        i,
        x * 0.52 - indentation,
        y * 0.82,
        z * 0.4,
      );
    }

    geo.computeVertexNormals();
    geo.computeBoundingSphere();

    return geo;
  }, []);

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  const ureters = useMemo(
    () =>
      [-1, 1].map(
        (side) =>
          new THREE.CatmullRomCurve3([
            new THREE.Vector3(side * 0.65, 1.05, 0),
            new THREE.Vector3(side * 0.5, 0.7, 0.15),
            new THREE.Vector3(side * 0.35, 0.3, 0.1),
            new THREE.Vector3(side * 0.3, 0, 0),
          ]),
      ),
    [],
  );

  return (
    <group>
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          geometry={geometry}
          position={[side * 0.85, 1.15, 0]}
          rotation={[0, side === 1 ? Math.PI : 0, 0]}
          castShadow
        >
          <AnatomyMaterial
            color={color}
            activity={activity}
          />
        </mesh>
      ))}

      {/* Central blood vessels */}
      <mesh position={[-0.12, 1.25, -0.12]}>
        <cylinderGeometry args={[0.09, 0.09, 1.6, 20]} />
        <AnatomyMaterial color="#d94350" />
      </mesh>

      <mesh position={[0.12, 1.25, -0.12]}>
        <cylinderGeometry args={[0.1, 0.1, 1.6, 20]} />
        <AnatomyMaterial color="#527ab9" />
      </mesh>

      {/* Renal vessels */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * 0.38, 1.15, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.075, 0.075, 0.65, 16]} />
          <AnatomyMaterial color="#ce4350" />
        </mesh>
      ))}

      {/* Ureters */}
      {ureters.map((curve, index) => (
        <mesh key={index}>
          <tubeGeometry args={[curve, 24, 0.055, 10, false]} />
          <AnatomyMaterial color="#e2bd91" />
        </mesh>
      ))}
    </group>
  );
};