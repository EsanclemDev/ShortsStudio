import React, { useMemo } from "react";

import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

import type {
  SubtitleConfig,
} from "./SubtitleTypes";

import {
  createSubtitleGroups,
  getActiveSubtitleGroup,
  getActiveWord,
} from "./SubtitleParser";

import {
  subtitleContainer,
  subtitleText,
} from "./SubtitleStyles";

type Props = {
  config: SubtitleConfig;
};

export const SubtitleEngine: React.FC<Props> = ({
  config,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const timeMs = (frame / fps) * 1000;

  const {
    words,
    style = "highlight",
    wordsPerGroup = 3,
    fontSize = 78,
    color = "#ffffff",
    activeColor = "#ffe600",
    bottom = 350,
    uppercase = true,
  } = config;

  const groups = useMemo(
    () => createSubtitleGroups(words, wordsPerGroup),
    [words, wordsPerGroup],
  );

  const group = getActiveSubtitleGroup(
    groups,
    timeMs,
  );

  if (!group) {
    return null;
  }

  const activeIndex = getActiveWord(
    group.words,
    timeMs,
  );

  const activeWord = group.words[activeIndex];

  const formatWord = (word: string) =>
    uppercase ? word.toUpperCase() : word;

  const popScale = activeWord
    ? interpolate(
        timeMs - activeWord.startMs,
        [0, 70, 150],
        [0.85, 1.12, 1],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        },
      )
    : 1;

  if (style === "pop") {
    if (!activeWord) {
      return null;
    }

    return (
      <div
        style={{
          ...subtitleContainer,
          bottom,
        }}
      >
        <div
          style={{
            ...subtitleText,
            fontSize: fontSize * 1.15,
            color: "#111111",
            backgroundColor: activeColor,
            padding: "12px 26px",
            borderRadius: 18,
            textShadow: "none",
            WebkitTextStroke: "0px",
            transform: `scale(${popScale})`,
          }}
        >
          {formatWord(activeWord.text)}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        ...subtitleContainer,
        bottom,
      }}
    >
      <div
        style={{
          ...subtitleText,
          fontSize,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 18,
        }}
      >
        {group.words.map((word, index) => {
          const isActive = index === activeIndex;
          const hasPlayed = timeMs >= word.startMs;

          let wordColor = color;

          if (style === "highlight" && isActive) {
            wordColor = activeColor;
          }

          if (style === "karaoke" && hasPlayed) {
            wordColor = activeColor;
          }

          return (
            <span
              key={`${word.startMs}-${index}`}
              style={{
                color: wordColor,
                display: "inline-block",
                transform: isActive
                  ? `scale(${popScale})`
                  : "scale(1)",
              }}
            >
              {formatWord(word.text)}
            </span>
          );
        })}
      </div>
    </div>
  );
};