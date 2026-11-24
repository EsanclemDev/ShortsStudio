export type TransitionType =
  | "none"
  | "fade"
  | "flash"
  | "zoom"
  | "slide"
  | "wipe";

export type TransitionConfig = {
  type: TransitionType;
  durationInFrames?: number;
  color?: string;
};