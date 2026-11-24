export type EffectPosition = [
  number,
  number,
  number,
];

export type BaseEffectConfig = {
  color?: string;
  intensity?: number;
  speed?: number;
  startFrame?: number;
  duration?: number;
};

export type GlowConfig = BaseEffectConfig & {
  position?: EffectPosition;
  radius?: number;
};

export type ShockwaveConfig = BaseEffectConfig & {
  position?: EffectPosition;
  radius?: number;
  count?: number;
};

export type ArrowConfig = BaseEffectConfig & {
  from: EffectPosition;
  to: EffectPosition;
  thickness?: number;
  animated?: boolean;
};

export type LabelConfig = BaseEffectConfig & {
  text: string;
  position: EffectPosition;
  target: EffectPosition;
  fontSize?: number;
};

export type ScreenEffectConfig = BaseEffectConfig & {
  type: "flash" | "vignette" | "danger" | "focus";
};

export type MeterConfig = {
  label?: string;
  from?: number;
  to?: number;
  duration?: number;
  startFrame?: number;
  color?: string;
  bottom?: number;
  suffix?: string;
};