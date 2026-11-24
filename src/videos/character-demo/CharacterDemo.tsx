import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { AnimatedCharacter } from "../../engine/characters/AnimatedCharacter";

import type {
  CharacterAction,
} from "../../engine/animations/characterAnimations";

export const CHARACTER_DEMO_FRAMES = 600;

const ACTIONS: CharacterAction[] = [
  "idle",
  "walk",
  "run",
  "wave",
  "dance",
  "thumbsUp",
  "point",
  "drink",
  "talk",
  "surprised",
];

export const CharacterDemo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const actionDuration = fps * 2;

  const index = Math.min(
    ACTIONS.length - 1,
    Math.floor(frame / actionDuration)
  );

  const action = ACTIONS[index];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#041522",
        backgroundImage: `
          radial-gradient(
            ellipse at center,
            #075078 0%,
            transparent 70%
          ),
          linear-gradient(
            rgba(0,180,255,0.16) 1px,
            transparent 1px
          ),
          linear-gradient(
            90deg,
            rgba(0,180,255,0.16) 1px,
            transparent 1px
          )
        `,
        backgroundSize:
          "100% 100%, 60px 60px, 60px 60px",
      }}
    >
      <AnimatedCharacter
        action={action}
        startFrame={index * actionDuration}
        size={1.0}
      />

      <div
        style={{
          position: "absolute",
          bottom: 150,
          width: "100%",
          textAlign: "center",
          color: "white",
          fontFamily: "Arial",
          fontWeight: 800,
          fontSize: 65,
        }}
      >
        {action.toUpperCase()}
      </div>
    </AbsoluteFill>
  );
};