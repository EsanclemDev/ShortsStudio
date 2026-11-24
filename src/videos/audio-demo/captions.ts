import type {
  SubtitleConfig,
} from "../../engine/subtitles/SubtitleTypes";

import words from "./captions.json";

export const DEMO_CAPTIONS: SubtitleConfig = {
  style: "highlight",
  wordsPerGroup: 3,
  fontSize: 78,
  activeColor: "#ffe600",
  color: "#ffffff",
  bottom: 280,
  uppercase: true,
  words,
};