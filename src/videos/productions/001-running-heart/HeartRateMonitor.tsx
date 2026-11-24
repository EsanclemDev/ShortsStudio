import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

interface HeartRateMonitorProps {
  from?: number;
  to?: number;
  duration?: number;
  startFrame?: number;
  top?: number;
  color?: string;
  label?: string;
}

const ecgWave = (phase: number) => {
  const gaussian = (
    center: number,
    width: number,
    amplitude: number,
  ) =>
    amplitude *
    Math.exp(-Math.pow((phase - center) / width, 2));

  return (
    gaussian(0.15, 0.045, 0.12) -
    gaussian(0.32, 0.018, 0.15) +
    gaussian(0.37, 0.018, 1) -
    gaussian(0.42, 0.022, 0.45) +
    gaussian(0.65, 0.09, 0.22)
  );
};

export const HeartRateMonitor: React.FC<
  HeartRateMonitorProps
> = ({
  from = 65,
  to = 145,
  duration = 3,
  startFrame = 0,
  top = 280,
  color = "#4ade80",
  label = "PULSACIONES",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - startFrame;
  const time = Math.max(0, localFrame) / fps;
  const safeDuration = Math.max(0.01, duration);

  const bpm = Math.round(
    interpolate(
      time,
      [0, safeDuration],
      [from, to],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      },
    ),
  );

  const rampTime = Math.min(time, safeDuration);

  const cycles =
    (
      from * rampTime +
      (to - from) * rampTime * rampTime /
        (2 * safeDuration) +
      to * Math.max(0, time - safeDuration)
    ) / 60;

  const opacity = interpolate(
    localFrame,
    [0, 10],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const offsetY = interpolate(
    localFrame,
    [0, 12],
    [-20, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const points = Array.from(
    { length: 200 },
    (_, index) => {
      const x = index / 199 * 220;
      const offset = (index / 199 - 1) * 2;

      const phase =
        ((cycles + offset * bpm / 60) % 1 + 1) % 1;

      const y = 42 - ecgWave(phase) * 30;

      return `${x},${y}`;
    },
  ).join(" ");

  const pulse =
    1 + Math.exp(
      -Math.pow((cycles % 1 - 0.15) / 0.09, 2),
    ) * 0.12;

  if (localFrame < 0) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: "50%",
        width: 560,
        transform:
          `translate(-50%, ${offsetY}px)`,
        opacity,
        padding: "18px 26px",
        borderRadius: 24,
        background: "rgba(3,15,26,0.92)",
        border: `2px solid ${color}55`,
        fontFamily: "Arial",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          color: "#94a3b8",
          fontSize: 23,
          fontWeight: 800,
          letterSpacing: 2,
          marginBottom: 6,
        }}
      >
        {label}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 15,
        }}
      >
        <svg
          width={48}
          height={48}
          viewBox="0 0 100 100"
          style={{
            transform: `scale(${pulse})`,
            flexShrink: 0,
          }}
        >
          <path
            d="M50 90 C20 70 0 45 12 25
               C22 8 42 12 50 28
               C58 12 78 8 88 25
               C100 45 80 70 50 90Z"
            fill="#ef4444"
          />
        </svg>

        <span
          style={{
            color,
            fontSize: 72,
            fontWeight: 900,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {bpm}
        </span>

        <span
          style={{
            color: "#94a3b8",
            fontSize: 25,
            fontWeight: 800,
          }}
        >
          PPM
        </span>

        <svg
          width={180}
          height={65}
          viewBox="0 0 220 65"
          style={{ marginLeft: "auto" }}
        >
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth={3}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};