import React, { useMemo } from "react";

import {
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { MicroObject } from "./MicroObject";

import { ParticleSystem } from "../particles/ParticleSystem";
import { createRandom } from "../particles/ParticleRandom";

export type OsmosisMode =
  | "isotonic"
  | "hypotonic"
  | "hypertonic";

type Props = {
  mode?: OsmosisMode;
  position?: [number, number, number];
  scale?: number;
  duration?: number;
  startFrame?: number;
};

export const OsmosisScene: React.FC<Props> = ({
  mode = "isotonic",
  position = [0, 1.7, 0],
  scale = 1,
  duration = 4,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const time =
    Math.max(0, frame - startFrame) / fps;

  const directions = useMemo(() => {
    const random = createRandom(128);

    return Array.from({ length: 18 }, () => {
      const angle = random() * Math.PI * 2;
      const z = random() * 2 - 1;
      const radius = Math.sqrt(1 - z * z);

      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z,
        phase: random(),
      };
    });
  }, []);

  const sodiumCount =
    mode === "hypotonic"
      ? 12
      : mode === "hypertonic"
        ? 70
        : 35;

  const animation =
    mode === "hypotonic"
      ? "swelling"
      : mode === "hypertonic"
        ? "shrink"
        : "pulse";

  if (frame < startFrame) {
    return null;
  }

  return (
    <group position={position} scale={scale}>
      <MicroObject
        type="cell"
        animation={animation}
        duration={duration}
        intensity={0.7}
        startFrame={startFrame}
      />

      {/* Extracellular solutes */}
      <ParticleSystem
        type="sodium"
        motion="float"
        count={sodiumCount}
        position={[0, 0, 0]}
        spread={[4, 4, 4]}
        size={0.055}
        speed={0.3}
        startFrame={startFrame}
      />

      {/* Water transport */}
      {directions.map((direction, index) => {
        const progress =
          (time * 0.45 + direction.phase) % 1;

        const inward =
          mode === "hypotonic" ||
          (mode === "isotonic" && index % 2 === 0);

        const radius = inward
          ? 2.2 - progress * 1.7
          : 0.5 + progress * 1.7;

        return (
          <MicroObject
            key={index}
            type="waterMolecule"
            position={[
              direction.x * radius,
              direction.y * radius,
              direction.z * radius,
            ]}
            scale={0.12}
            animation="rotate"
            speed={0.5}
            startFrame={startFrame}
          />
        );
      })}
    </group>
  );
};