import React, { useMemo } from "react";
import * as THREE from "three";

import type { MicroModelProps } from "../MicroTypes";
import { MicroMaterial } from "../MicroMaterial";

export const Bacteria3D: React.FC<MicroModelProps> = ({
  color = "#22c55e",
  activity = 0,
}) => {
  const flagellum = useMemo(() => {
    const points = Array.from(
      { length: 40 },
      (_, index) => {
        const t = index / 39;

        return new THREE.Vector3(
          1 + t * 1.4,
          Math.sin(t * Math.PI * 4) * 0.2 * t,
          Math.cos(t * Math.PI * 4) * 0.15 * t,
        );
      },
    );

    return new THREE.CatmullRomCurve3(points);
  }, []);

  return (
    <group>
      {/* Body */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.4, 1.2, 12, 24]} />

        <MicroMaterial
          color={color}
          activity={activity}
        />
      </mesh>

      {/* Pili */}
      {Array.from({ length: 24 }, (_, index) => {
        const angle = index * Math.PI * 2 / 8;
        const x = (Math.floor(index / 8) - 1) * 0.4;

        return (
          <mesh
            key={index}
            position={[
              x,
              Math.cos(angle) * 0.47,
              Math.sin(angle) * 0.47,
            ]}
            rotation={[angle, 0, 0]}
          >
            <cylinderGeometry
              args={[0.012, 0.02, 0.18, 6]}
            />

            <MicroMaterial color="#86efac" />
          </mesh>
        );
      })}

      {/* Flagellum */}
      <mesh>
        <tubeGeometry
          args={[flagellum, 40, 0.025, 8, false]}
        />

        <MicroMaterial color="#86efac" />
      </mesh>
    </group>
  );
};