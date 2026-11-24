import words from "./captions.json";

import type {
  SubtitleConfig,
} from "../../../engine/subtitles/SubtitleTypes";

export const RUNNING_CAPTIONS: SubtitleConfig = {
  words,
  style: "highlight",
  wordsPerGroup: 3,
  fontSize: 78,
  color: "#ffffff",
  activeColor: "#ffe600",
  bottom: 350,
  uppercase: true,
};