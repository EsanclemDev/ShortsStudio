import React, { useMemo } from "react";

import type { MicroModelProps } from "../MicroTypes";
import { MicroMaterial } from "../MicroMaterial";

import { createRandom } from "../../particles/ParticleRandom";

export const Cell3D: React.FC<MicroModelProps> = ({
  color = "#a78bfa",
  activity = 0,
}) => {
  const organelles = useMemo(() => {
    const random = createRandom(42);

    return Array.from({ length: 12 }, (_, index) => {
      const angle = index * Math.PI * 2 / 12;

      return {
        position: [
          Math.cos(angle) * 0.65,
          Math.sin(angle) * 0.65,
          (random() - 0.5) * 0.7,
        ] as [number, number, number],

        rotation: random() * Math.PI,
      };
    });
  }, []);

  return (
    <group>
      {/* Cytoplasm */}
      <mesh renderOrder={2}>
        <sphereGeometry args={[0.95, 40, 32]} />

        <MicroMaterial
          color={color}
          opacity={0.1}
          activity={activity}
        />
      </mesh>

      {/* Nucleus */}
      <mesh position={[-0.12, 0.08, 0]}>
        <sphereGeometry args={[0.38, 32, 24]} />

        <MicroMaterial
          color="#7950b5"
          activity={activity}
        />
      </mesh>

      {/* Nucleolus */}
      <mesh position={[-0.2, 0.15, 0.31]}>
        <sphereGeometry args={[0.13, 20, 16]} />

        <MicroMaterial color="#d8b4fe" />
      </mesh>

      {/* Mitochondria */}
      {organelles.map((organelle, index) => (
        <mesh
          key={index}
          position={organelle.position}
          rotation={[0, 0, organelle.rotation]}
          scale={[0.16, 0.065, 0.075]}
        >
          <sphereGeometry args={[1, 16, 12]} />

          <MicroMaterial color="#f0abfc" />
        </mesh>
      ))}

      {/* Cell membrane */}
      <mesh renderOrder={3}>
        <sphereGeometry args={[1, 48, 32]} />

        <MicroMaterial
          color={color}
          opacity={0.23}
          activity={activity}
          roughness={0.18}
        />
      </mesh>
    </group>
  );
};