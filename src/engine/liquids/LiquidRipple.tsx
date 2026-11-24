import React from "react";

import {
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type Props = {
  position?: [number, number, number];
  color?: string;
  radius?: number;
  speed?: number;
  count?: number;
  startFrame?: number;
};

export const LiquidRipple: React.FC<Props> = ({
  position = [0, 0, 0],
  color = "#a5e8ff",
  radius = 0.5,
  speed = 1,
  count = 4,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const time =
    Math.max(0, frame - startFrame) / fps;

  if (frame < startFrame) {
    return null;
  }

  return (
    <group position={position}>
      {Array.from({ length: count }, (_, i) => {
        const progress =
          (time * speed + i / count) % 1;

        const scale = Math.max(
          0.01,
          progress * radius,
        );

        return (
          <mesh
            key={i}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={[scale, scale, scale]}
            renderOrder={4}
          >
            <ringGeometry args={[0.94, 1, 48]} />

            <meshBasicMaterial
              color={color}
              transparent
              opacity={(1 - progress) * 0.65}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </group>
  );
};