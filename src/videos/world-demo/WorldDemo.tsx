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

import { WORLD_SCENES } from "./scenes";

export const WORLD_DEMO_FRAMES =
  getTotalFrames(WORLD_SCENES, 30);

export const WorldDemo: React.FC = () => {
  const frame = useCurrentFrame();

  const {
    width,
    height,
    fps,
  } = useVideoConfig();

  const {
    scene,
    index,
    startFrame,
    position,
  } = getSceneState(
    WORLD_SCENES,
    frame,
    fps,
  );

  return (
    <AbsoluteFill>
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
          billboard
        />
      </ThreeCanvas>

      <div
        style={{
          position: "absolute",
          top: 100,
          width: "100%",
          textAlign: "center",
          color: "#55cfff",
          fontFamily: "Arial",
          fontSize: 30,
        }}
      >
        SCENE {index + 1} / {WORLD_SCENES.length}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 150,
          width: "100%",
          textAlign: "center",
          color: "white",
          fontFamily: "Arial",
          fontWeight: 800,
          fontSize: 55,
        }}
      >
        {scene.action.toUpperCase()}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 90,
          width: "100%",
          textAlign: "center",
          color: "#55cfff",
          fontFamily: "Arial",
          fontSize: 32,
        }}
      >
        CAMERA: {scene.camera.toUpperCase()}
      </div>
    </AbsoluteFill>
  );
};