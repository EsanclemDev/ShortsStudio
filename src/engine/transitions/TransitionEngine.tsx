import React from "react";

import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Easing,
} from "remotion";

import type {
  TransitionConfig,
} from "./TransitionTypes";

type Props = {
  config?: TransitionConfig;
  startFrame: number;
  children: React.ReactNode;
};

export const TransitionEngine: React.FC<Props> = ({
  config,
  startFrame,
  children,
}) => {
  const frame = useCurrentFrame();

  const type = config?.type ?? "none";

  const duration = Math.max(
    1,
    config?.durationInFrames ?? 12,
  );

  const localFrame = frame - startFrame;

  const progress = interpolate(
    localFrame,
    [0, duration],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );

  let transform = "none";
  let opacity = 1;

  let overlayOpacity = 0;
  let overlayColor = "transparent";

  let clipPath: string | undefined;

  switch (type) {
    case "fade":
      overlayColor = config?.color ?? "#000000";
      overlayOpacity = 1 - progress;
      break;

    case "flash":
      overlayColor = config?.color ?? "#ffffff";
      overlayOpacity = (1 - progress) * 0.85;
      break;

    case "zoom":
      transform = `scale(${1.25 - progress * 0.25})`;
      break;

    case "slide":
      transform = `translateX(${(1 - progress) * 100}%)`;
      opacity = progress;
      break;

    case "wipe":
      clipPath = `inset(0 ${(1 - progress) * 100}% 0 0)`;
      break;

    default:
      break;
  }

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          transform,
          opacity,
          clipPath,
          transformOrigin: "center center",
        }}
      >
        {children}
      </AbsoluteFill>

      {overlayOpacity > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: overlayColor,
            opacity: overlayOpacity,
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};