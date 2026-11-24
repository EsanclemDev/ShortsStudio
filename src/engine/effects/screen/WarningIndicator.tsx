import React from "react";

import {
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import {
  getEffectState,
  smoothstep,
} from "../EffectAnimations";

type Props = {
  text?: string;
  color?: string;
  top?: number;
  startFrame?: number;
  duration?: number;
};

export const WarningIndicator: React.FC<Props> = ({
  text = "¡ATENCIÓN!",
  color = "#ef4444",
  top = 260,
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

  const entrance = smoothstep(time * 5);

  const pulse =
    1 + Math.sin(time * 5) * 0.035;

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 100,
        right: 100,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 25,
        padding: "24px 30px",
        backgroundColor: "rgba(30,0,0,0.85)",
        border: `5px solid ${color}`,
        borderRadius: 24,
        boxShadow: `0 0 35px ${color}66`,
        color,
        fontFamily: "Arial",
        fontWeight: 900,
        fontSize: 58,
        opacity: entrance,
        transform: `scale(${entrance * pulse})`,
      }}
    >
      <svg width="80" height="80" viewBox="0 0 100 100">
        <path
          d="M50 8 L95 90 H5 Z"
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinejoin="round"
        />

        <text
          x="50"
          y="76"
          fontSize="58"
          fontWeight="bold"
          textAnchor="middle"
          fill={color}
        >
          !
        </text>
      </svg>

      {text}
    </div>
  );
};