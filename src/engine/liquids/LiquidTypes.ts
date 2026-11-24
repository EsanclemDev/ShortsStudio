export type LiquidType =
  | "water"
  | "blood"
  | "gastric"
  | "generic";

export type LiquidAnimation =
  | "static"
  | "fill"
  | "drain"
  | "wave"
  | "pulse";

export type LiquidPosition = [
  number,
  number,
  number,
];

export type LiquidConfig = {
  type?: LiquidType;
  position?: LiquidPosition;
  radius?: number;
  height?: number;
  level?: number;
  animation?: LiquidAnimation;
  duration?: number;
  speed?: number;
  color?: string;
  startFrame?: number;
};

export type LiquidStreamConfig = {
  type?: LiquidType;
  from: LiquidPosition;
  to: LiquidPosition;
  radius?: number;
  speed?: number;
  curvature?: number;
  startFrame?: number;
  duration?: number;
  color?: string;
};