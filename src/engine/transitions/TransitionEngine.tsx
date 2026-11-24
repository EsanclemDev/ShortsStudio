import React from "react";

import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from "remotion";

import type {
  TransitionConfig,
} from "./TransitionTypes";

interface TransitionEngineProps {
  config?: TransitionConfig;
  startFrame: number;
  children: React.ReactNode;
}

export const TransitionEngine: React.FC<
  TransitionEngineProps
> = ({
  config,
  startFrame,
  children,
}) => {
  const frame = useCurrentFrame();

  const type = config?.type ?? "none";

  const duration = Math.max(
    1,
    config?.durationInFrames ?? 18,
  );

  const progress = interpolate(
    frame - startFrame,
    [0, duration],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const eased =
    progress * progress * (3 - 2 * progress);

  const style: React.CSSProperties = {
    overflow: "hidden",
  };

  let overlay: React.ReactNode = null;

  switch (type) {
    case "fade":
      style.opacity = 0.35 + eased * 0.65;
      break;

    case "flash":
      overlay = (
        <AbsoluteFill
          style={{
            backgroundColor:
              config?.color ?? "#ffffff",
            opacity:
              Math.pow(1 - eased, 3) * 0.65,
            pointerEvents: "none",
          }}
        />
      );
      break;

    case "zoom": {
      const scale = 1.06 - eased * 0.06;

      style.transform = `scale(${scale})`;
      style.opacity = 0.8 + eased * 0.2;
      break;
    }

    case "slide": {
      const offset = (1 - eased) * 45;

      style.transform =
        `translateX(${offset}px)`;

      style.opacity = 0.5 + eased * 0.5;
      break;
    }

    case "wipe":
      style.clipPath =
        `inset(0 ${(1 - eased) * 100}% 0 0)`;
      break;

    case "none":
    default:
      break;
  }

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
      }}
    >
      <AbsoluteFill style={style}>
        {children}
      </AbsoluteFill>

      {overlay}
    </AbsoluteFill>
  );
};