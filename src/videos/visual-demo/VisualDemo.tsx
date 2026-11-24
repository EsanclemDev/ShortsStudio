import React from "react";

import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import {
  ThreeCanvas,
} from "@remotion/three";

import {
  CinematicWorld,
} from "../../engine/environments/CinematicWorld";

import {
  CinematicLighting,
} from "../../engine/lighting/CinematicLighting";

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

import { VISUAL_SCENES } from "./scenes";

export const VISUAL_DEMO_FRAMES =
  getTotalFrames(VISUAL_SCENES, 30);

export const VisualDemo: React.FC = () => {
  const frame = useCurrentFrame();

  const {
    width,
    height,
    fps,
  } = useVideoConfig();

  const {
    scene,
    startFrame,
    position,
  } = getSceneState(
    VISUAL_SCENES,
    frame,
    fps,
  );

  const environment =
    scene.environment ?? "studio";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#041522",
      }}
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
        <CinematicWorld
          preset={environment}
        />

        <CinematicLighting
          preset={environment}
        />

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
          billboard
        />
      </ThreeCanvas>

      <div
        style={{
          position: "absolute",
          top: 100,
          width: "100%",
          textAlign: "center",
          fontFamily: "Arial",
          fontSize: 45,
          fontWeight: 800,
          color: "#ffffff",
          letterSpacing: 4,
        }}
      >
        {environment.toUpperCase()}
      </div>
    </AbsoluteFill>
  );
};