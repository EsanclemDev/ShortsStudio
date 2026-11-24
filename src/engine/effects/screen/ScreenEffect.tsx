import React from "react";

import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import type {
  ScreenEffectConfig,
} from "../EffectTypes";

import {
  getEffectState,
  clamp,
} from "../EffectAnimations";

export const ScreenEffect: React.FC<
  ScreenEffectConfig
> = ({
  type,
  color,
  intensity = 0.7,
  speed = 1,
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

  let background = "transparent";
  let opacity = clamp(intensity);

  switch (type) {
    case "flash":
      background = color ?? "#ffffff";

      opacity *= Math.exp(
        -time * speed * 10,
      );

      break;

    case "vignette":
      background = `
        radial-gradient(
          ellipse at center,
          transparent 30%,
          ${color ?? "#000000"} 100%
        )
      `;

      break;

    case "danger": {
      const pulse =
        (Math.sin(time * speed * 3) + 1) / 2;

      background = `
        radial-gradient(
          ellipse at center,
          transparent 35%,
          ${color ?? "#ef0000"} 100%
        )
      `;

      opacity *= 0.35 + pulse * 0.65;

      break;
    }

    case "focus":
      background = `
        radial-gradient(
          ellipse at center,
          transparent 22%,
          rgba(0,0,0,0.5) 55%,
          ${color ?? "#000000"} 100%
        )
      `;

      break;
  }

  return (
    <AbsoluteFill
      style={{
        background,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};