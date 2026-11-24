import React from "react";
import type { HandGesture } from "./Character";

type HandProps = {
  gesture: HandGesture;
};

export const Hand: React.FC<HandProps> = ({
  gesture,
}) => {
  const shapes: Record<HandGesture, string> = {
    fist: `
      M -28 -5
      Q -32 -34 0 -34
      Q 32 -34 30 0
      Q 32 34 0 34
      Q -30 34 -28 -5 Z
    `,

    thumbsUp: `
      M -25 25
      Q -38 8 -28 -10
      L -18 -30
      L -23 -65
      Q -23 -85 -8 -85
      Q 10 -85 12 -65
      L 8 -30
      Q 38 -40 42 -18
      Q 52 -5 40 5
      Q 49 18 35 27
      Q 40 42 15 45
      Q -12 48 -25 25 Z
    `,

    open: `
      M -25 30
      L -43 -5
      Q -50 -20 -38 -25
      L -22 -8
      L -27 -55
      Q -25 -68 -15 -60
      L -7 -25
      L -5 -70
      Q 5 -82 13 -68
      L 15 -25
      L 25 -58
      Q 37 -65 40 -50
      L 32 -12
      L 45 -30
      Q 60 -32 55 -15
      L 35 30
      Q 5 55 -25 30 Z
    `,

    point: `
      M -25 25
      L -28 -10
      L -10 -30
      L -10 -85
      Q 0 -102 13 -85
      L 13 -25
      Q 40 -35 42 -12
      L 38 30
      Q 5 50 -25 25 Z
    `,
  };

  const shape = shapes[gesture];

  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <path
        d={shape}
        fill="#ffba80"
        stroke="white"
        strokeWidth={26}
        paintOrder="stroke"
      />

      <path
        d={shape}
        fill="#ffba80"
        stroke="#111111"
        strokeWidth={9}
      />

      <path
        d={shape}
        fill="url(#crayon)"
      />

      {gesture === "thumbsUp" && (
        <path
          d="
            M 12 -17 Q -5 -8 24 -3
            M 12 4 Q -5 15 24 18
            M 10 24 Q 0 32 20 34
          "
          fill="none"
          stroke="#111111"
          strokeWidth={7}
        />
      )}
    </g>
  );
};