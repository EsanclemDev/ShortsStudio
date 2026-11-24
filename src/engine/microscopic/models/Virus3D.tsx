import React, { useMemo } from "react";
import * as THREE from "three";

import type { MicroModelProps } from "../MicroTypes";
import { MicroMaterial } from "../MicroMaterial";

export const Virus3D: React.FC<MicroModelProps> = ({
  color = "#be123c",
  activity = 0,
}) => {
  const spikes = useMemo(() => {
    const count = 36;

    const goldenAngle =
      Math.PI * (3 - Math.sqrt(5));

    const up = new THREE.Vector3(0, 1, 0);

    return Array.from({ length: count }, (_, index) => {
      const y = 1 - 2 * index / (count - 1);
      const radius = Math.sqrt(1 - y * y);
      const angle = goldenAngle * index;

      const direction = new THREE.Vector3(
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius,
      );

      return {
        position: direction.clone().multiplyScalar(0.83),

        quaternion: new THREE.Quaternion()
          .setFromUnitVectors(up, direction),
      };
    });
  }, []);

  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.75, 32, 24]} />

        <MicroMaterial
          color={color}
          activity={activity}
        />
      </mesh>

      {spikes.map((spike, index) => (
        <group
          key={index}
          position={spike.position}
          quaternion={spike.quaternion}
        >
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry
              args={[0.035, 0.055, 0.3, 8]}
            />

            <MicroMaterial color="#fb7185" />
          </mesh>

          <mesh position={[0, 0.24, 0]}>
            <sphereGeometry args={[0.09, 12, 8]} />

            <MicroMaterial color="#fda4af" />
          </mesh>
        </group>
      ))}
    </group>
  );
};