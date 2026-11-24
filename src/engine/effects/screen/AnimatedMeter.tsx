import React from "react";

import {
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import type { MeterConfig } from "../EffectTypes";

import {
  clamp,
  smoothstep,
} from "../EffectAnimations";

export const AnimatedMeter: React.FC<MeterConfig> = ({
  label = "NIVEL",
  from = 0,
  to = 100,
  duration = 3,
  startFrame = 0,
  color = "#38bdf8",
  bottom = 250,
  suffix = "%",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const time =
    Math.max(0, frame - startFrame) / fps;

  const progress = smoothstep(
    time / Math.max(0.01, duration),
  );

  const value =
    from + (to - from) * progress;

  if (frame < startFrame) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        bottom,
        left: 120,
        right: 120,
        padding: 35,
        backgroundColor: "rgba(4,15,25,0.85)",
        border: `2px solid ${color}`,
        borderRadius: 28,
        textAlign: "center",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          color,
          fontSize: 38,
          fontWeight: 700,
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: "#ffffff",
          fontSize: 95,
          fontWeight: 900,
          margin: "10px 0 25px",
        }}
      >
        {Math.round(value)}{suffix}
      </div>

      <div
        style={{
          height: 28,
          backgroundColor: "#334155",
          borderRadius: 30,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${clamp(value / 100) * 100}%`,
            backgroundColor: color,
            borderRadius: 30,
            boxShadow: `0 0 20px ${color}`,
          }}
        />
      </div>
    </div>
  );
};