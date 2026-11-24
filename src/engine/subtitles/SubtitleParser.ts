
import type { SubtitleWord } from "./SubtitleTypes";

export type SubtitleGroup = {
  words: SubtitleWord[];
  startMs: number;
  endMs: number;
};

export const createSubtitleGroups = (
  words: SubtitleWord[],
  wordsPerGroup = 3,
): SubtitleGroup[] => {
  const groups: SubtitleGroup[] = [];

  const groupSize = Math.max(
    1,
    Math.floor(wordsPerGroup),
  );

  let current: SubtitleWord[] = [];

  const flush = () => {
    if (current.length === 0) {
      return;
    }

    groups.push({
      words: current,
      startMs: current[0].startMs,
      endMs: current[current.length - 1].endMs,
    });

    current = [];
  };

  for (const word of words) {
    current.push(word);

    const endsSentence = /[.!?]$/.test(
      word.text.trim(),
    );

    if (
      current.length >= groupSize ||
      endsSentence
    ) {
      flush();
    }
  }

  flush();

  return groups;
};

export const getActiveSubtitleGroup = (
  groups: SubtitleGroup[],
  timeMs: number,
): SubtitleGroup | undefined => {
  return groups.find(
    (group) =>
      timeMs >= group.startMs &&
      timeMs < group.endMs,
  );
};

export const getActiveWord = (
  words: SubtitleWord[],
  timeMs: number,
): number => {
  return words.findIndex(
    (word) =>
      timeMs >= word.startMs &&
      timeMs < word.endMs,
  );
};