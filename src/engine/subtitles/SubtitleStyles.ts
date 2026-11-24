import type { CSSProperties } from "react";

export const subtitleContainer: CSSProperties = {
  position: "absolute",
  left: 70,
  right: 130,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  pointerEvents: "none",
  zIndex: 100,
};

export const subtitleText: CSSProperties = {
  fontFamily: "Arial, sans-serif",
  fontWeight: 900,
  lineHeight: 1.15,
  letterSpacing: -1,
  textShadow: `
    0px 4px 0px #000000,
    3px 0px 0px #000000,
    -3px 0px 0px #000000,
    0px -3px 0px #000000,
    0px 6px 12px rgba(0,0,0,0.8)
  `,
  WebkitTextStroke: "2px black",
  paintOrder: "stroke fill",
};