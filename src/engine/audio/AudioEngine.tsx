import React from "react";
import {
  Sequence,
  staticFile,
  useVideoConfig,
  interpolate,
} from "remotion";

import { Audio } from "@remotion/media";

import type {
  AudioConfig,
  AudioTrack,
} from "./AudioTypes";

type TrackProps = {
  track: AudioTrack;
  defaultVolume: number;
};

const AudioLayer: React.FC<TrackProps> = ({
  track,
  defaultVolume,
}) => {
  const { durationInFrames: videoDuration } =
    useVideoConfig();

  const startFrame = track.startFrame ?? 0;

  const duration = Math.min(
    track.durationInFrames ?? videoDuration,
    videoDuration - startFrame,
  );

  const baseVolume = track.volume ?? defaultVolume;

  const fadeIn = track.fadeIn ?? 0;
  const fadeOut = track.fadeOut ?? 0;

  if (duration <= 0) {
    return null;
  }

  return (
    <Sequence
      from={startFrame}
      durationInFrames={duration}
      layout="none"
    >
      <Audio
        src={staticFile(track.src)}
        loop={track.loop ?? false}
        volume={(frame) => {
          const entrance =
            fadeIn > 0
              ? interpolate(
                  frame,
                  [0, fadeIn],
                  [0, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  },
                )
              : 1;

          const exit =
            fadeOut > 0
              ? interpolate(
                  frame,
                  [duration - fadeOut, duration],
                  [1, 0],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  },
                )
              : 1;

          return baseVolume * entrance * exit;
        }}
      />
    </Sequence>
  );
};

type Props = {
  config: AudioConfig;
};

export const AudioEngine: React.FC<Props> = ({
  config,
}) => {
  return (
    <>
      {config.voice && (
        <AudioLayer
          track={config.voice}
          defaultVolume={1}
        />
      )}

      {config.music && (
        <AudioLayer
          track={config.music}
          defaultVolume={0.08}
        />
      )}

      {config.effects?.map((effect, index) => (
        <AudioLayer
          key={`${effect.src}-${index}`}
          track={effect}
          defaultVolume={0.35}
        />
      ))}
    </>
  );
};