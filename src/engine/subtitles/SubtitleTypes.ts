export type SubtitleWord = {
  text: string;
  startMs: number;
  endMs: number;
};

export type SubtitleStyle =
  | "highlight"
  | "karaoke"
  | "pop";

export type SubtitleConfig = {
  words: SubtitleWord[];
  style?: SubtitleStyle;
  wordsPerGroup?: number;
  fontSize?: number;
  color?: string;
  activeColor?: string;
  bottom?: number;
  uppercase?: boolean;
};