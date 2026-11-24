import React from "react";

import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import {
  getEffectState,
} from "../EffectAnimations";

type Props = {
  children: React.ReactNode;
  intensity?: number;
  frequency?: number;
  startFrame?: number;
  duration?: number;
};

export const CameraShake: React.FC<Props> = ({
  children,
  intensity = 20,
  frequency = 25,
  startFrame = 0,
  duration = 0.6,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const {
    time,
    progress,
    visible,
  } = getEffectState(
    frame,
    fps,
    startFrame,
    duration,
  );

  const strength = visible
    ? intensity * Math.pow(1 - progress, 2)
    : 0;

  const x =
    Math.sin(time * frequency * 2) * strength;

  const y =
    Math.cos(time * frequency * 2.3) * strength;

  const rotation =
    Math.sin(time * frequency) *
    strength * 0.025;

  const scale = 1 + strength / 300;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `
            translate(${x}px, ${y}px)
            rotate(${rotation}deg)
            scale(${scale})
          `,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};