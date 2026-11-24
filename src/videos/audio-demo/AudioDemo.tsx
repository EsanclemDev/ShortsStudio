import React from "react";

import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { ThreeCanvas } from "@remotion/three";

import {
  GridWorld,
} from "../../engine/environments/GridWorld";

import {
  StudioLighting,
} from "../../engine/lighting/StudioLighting";

import {
  ContactShadow,
} from "../../engine/lighting/ContactShadow";

import {
  Character3D,
} from "../../engine/characters/Character3D";

import {
  CinematicCamera,
} from "../../engine/camera/CinematicCamera";

import {
  getSceneState,
  getTotalFrames,
} from "../../engine/scenes/SceneController";

import {
  AudioEngine,
} from "../../engine/audio/AudioEngine";
import {
  getMouthOpen,
} from "../../engine/audio/LipSync";

import lipSyncData from "./lipsync.json";
import {
  SubtitleEngine,
} from "../../engine/subtitles/SubtitleEngine";

import {
  TransitionEngine,
} from "../../engine/transitions/TransitionEngine";

import { AUDIO_SCENES } from "./scenes";
import { DEMO_AUDIO } from "./audio";
import { DEMO_CAPTIONS } from "./captions";

export const AUDIO_DEMO_FRAMES =
  getTotalFrames(AUDIO_SCENES, 30);
export const AudioDemo: React.FC = () => {
  const frame = useCurrentFrame();

  const {
    width,
    height,
    fps,
  } = useVideoConfig();

  const mouthOpen = getMouthOpen(
    lipSyncData,
    frame,
    fps,
  );

  const {
    scene,
    startFrame,
    position,
  } = getSceneState(
    AUDIO_SCENES,
    frame,
    fps,
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#041522",
      }}
    >
      <TransitionEngine
  config={scene.transition}
  startFrame={startFrame}
>
  <ThreeCanvas
    width={width}
    height={height}
    shadows
    camera={{
      position: [0, 2.8, 8],
      fov: 40,
      near: 0.1,
      far: 100,
    }}
  >
    <GridWorld />

    <StudioLighting />

    <CinematicCamera
      mode={scene.camera}
      startFrame={startFrame}
      duration={scene.duration}
      target={position}
    />

    <ContactShadow
      position={[
        position[0],
        0.015,
        position[2],
      ]}
      size={2.2}
      opacity={0.7}
    />

    <Character3D
      action={scene.action}
      position={position}
      size={scene.size ?? 4}
      startFrame={startFrame}
      mouthOpen={
        scene.action === "talk"
          ? mouthOpen
          : undefined
      }
      billboard
    />
  </ThreeCanvas>
</TransitionEngine>

<AudioEngine config={DEMO_AUDIO} />

<SubtitleEngine config={DEMO_CAPTIONS} />

      <SubtitleEngine config={DEMO_CAPTIONS} />
    </AbsoluteFill>
  );
};