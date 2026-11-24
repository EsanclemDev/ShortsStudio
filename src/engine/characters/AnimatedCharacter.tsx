import { useCurrentFrame, useVideoConfig } from "remotion";
import { Character } from "./Character";

import {
  getCharacterPose,
  type CharacterAction,
} from "../animations/characterAnimations";

type AnimatedCharacterProps = {
  action?: CharacterAction;
  x?: number;
  y?: number;
  size?: number;
  startFrame?: number;
};

export const AnimatedCharacter = ({
  action = "idle",
  x = 0,
  y = 0,
  size = 1,
  startFrame = 0,
}: AnimatedCharacterProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const time = Math.max(0, frame - startFrame) / fps;

  const {
    offsetY,
    rotation,
    scale,
    ...characterProps
  } = getCharacterPose(action, time);

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 780,
        height: 1300,
        transform: `
          translate(-50%, -50%)
          translate(${x}px, ${y + offsetY}px)
          rotate(${rotation}deg)
          scale(${size * scale})
        `,
      }}
    >
      <Character {...characterProps} />
    </div>
  );
};