import React from "react";

import {
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import type {
  ShockwaveConfig,
} from "../EffectTypes";

import {
  getEffectState,
} from "../EffectAnimations";

export const ShockwaveEffect: React.FC<
  ShockwaveConfig
> = ({
  position = [0, 1.5, 0],
  radius = 2,
  color = "#38bdf8",
  intensity = 1,
  speed = 1,
  count = 3,
  startFrame = 0,
  duration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { time, visible } = getEffectState(
    frame,
    fps,
    startFrame,
    duration,
  );

  if (!visible) return null;

  return (
    <group position={position}>
      {Array.from({ length: count }, (_, index) => {
        const progress =
          (time * speed + index / count) % 1;

        const scale = Math.max(
          0.01,
          progress * radius,
        );

        return (
          <mesh
            key={index}
            scale={scale}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[0.94, 1, 64]} />

            <meshBasicMaterial
              color={color}
              transparent
              opacity={Math.min(
                1,
                (1 - progress) * intensity,
              )}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
};