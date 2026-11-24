export type AudioTrack = {
  src: string;
  volume?: number;
  startFrame?: number;
  durationInFrames?: number;
  fadeIn?: number;
  fadeOut?: number;
  loop?: boolean;
};

export type AudioConfig = {
  voice?: AudioTrack;
  music?: AudioTrack;
  effects?: AudioTrack[];
};