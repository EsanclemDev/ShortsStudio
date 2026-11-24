export type LipSyncData = {
  fps: number;
  durationMs: number;
  frames: number[];
};

export const getMouthOpen = (
  data: LipSyncData,
  frame: number,
  fps: number,
): number => {
  const time = frame / fps;

  const audioFrame = Math.floor(
    time * data.fps,
  );

  return Math.max(
    0,
    Math.min(
      1,
      data.frames[audioFrame] ?? 0,
    ),
  );
};