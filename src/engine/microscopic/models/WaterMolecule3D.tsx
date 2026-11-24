import React from "react";

import type { MicroModelProps } from "../MicroTypes";
import { MicroMaterial } from "../MicroMaterial";

const ANGLE = 104.5 * Math.PI / 180;
const DISTANCE = 0.85;

export const WaterMolecule3D: React.FC<MicroModelProps> = ({
  color = "#ef4444",
  activity = 0,
}) => {
  return (
    <group>
      {/* Oxygen */}
      <mesh>
        <sphereGeometry args={[0.48, 32, 24]} />

        <MicroMaterial
          color={color}
          activity={activity}
        />
      </mesh>

      {[-1, 1].map((side) => {
        const x =
          side * Math.sin(ANGLE / 2) * DISTANCE;

        const y =
          -Math.cos(ANGLE / 2) * DISTANCE;

        return (
          <group key={side}>
            {/* Bond */}
            <mesh
              position={[x / 2, y / 2, 0]}
              rotation={[
                0,
                0,
                Math.atan2(-x, y),
              ]}
            >
              <cylinderGeometry
                args={[0.09, 0.09, DISTANCE, 16]}
              />

              <MicroMaterial color="#94a3b8" />
            </mesh>

            {/* Hydrogen */}
            <mesh position={[x, y, 0]}>
              <sphereGeometry args={[0.3, 24, 20]} />

              <MicroMaterial color="#f1f5f9" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};