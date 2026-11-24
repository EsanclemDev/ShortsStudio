import React, { useMemo } from "react";
import * as THREE from "three";

import type { OrganModelProps } from "../AnatomyTypes";
import { AnatomyMaterial } from "../AnatomyMaterial";

export const Intestines3D: React.FC<OrganModelProps> = ({
  color = "#e2a09b",
  activity = 0,
}) => {
  const smallIntestine = useMemo(() => {
    const points = Array.from(
      { length: 120 },
      (_, index) => {
        const t = index / 119;

        return new THREE.Vector3(
          Math.sin(t * Math.PI * 10) * 0.53,
          1.7 - t * 1.35,
          Math.cos(t * Math.PI * 10) * 0.12,
        );
      },
    );

    return new THREE.CatmullRomCurve3(points);
  }, []);

  const colon = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.85, 0.35, 0.05),
        new THREE.Vector3(-0.9, 1.15, 0.05),
        new THREE.Vector3(-0.85, 1.95, 0.05),
        new THREE.Vector3(0, 2.05, 0.05),
        new THREE.Vector3(0.85, 1.95, 0.05),
        new THREE.Vector3(0.9, 1.15, 0.05),
        new THREE.Vector3(0.85, 0.4, 0.05),
        new THREE.Vector3(0.2, 0.3, 0.05),
        new THREE.Vector3(0.1, 0, 0.05),
      ]),
    [],
  );

  return (
    <group>
      {/* Small intestine */}
      <mesh castShadow>
        <tubeGeometry
          args={[smallIntestine, 160, 0.115, 12, false]}
        />

        <AnatomyMaterial
          color={color}
          activity={activity}
        />
      </mesh>

      {/* Large intestine */}
      <mesh castShadow>
        <tubeGeometry
          args={[colon, 80, 0.19, 16, false]}
        />

        <AnatomyMaterial
          color="#b97882"
          activity={activity}
        />
      </mesh>

      {/* Colon segmentation */}
      {Array.from({ length: 28 }, (_, index) => {
        const point = colon.getPointAt(index / 28);

        return (
          <mesh
            key={index}
            position={[point.x, point.y, point.z]}
          >
            <sphereGeometry args={[0.205, 16, 12]} />

            <AnatomyMaterial
              color="#c1848b"
              activity={activity}
            />
          </mesh>
        );
      })}
    </group>
  );
};