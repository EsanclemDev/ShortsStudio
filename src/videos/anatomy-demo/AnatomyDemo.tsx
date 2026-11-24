import React from "react";

import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { ThreeCanvas } from "@remotion/three";

import {
  CinematicWorld,
} from "../../engine/environments/CinematicWorld";

import {
  CinematicLighting,
} from "../../engine/lighting/CinematicLighting";

import {
  CinematicCamera,
} from "../../engine/camera/CinematicCamera";

import {
  AnatomyOrgan,
} from "../../engine/anatomy/AnatomyOrgan";

import {
  ParticleSystem,
} from "../../engine/particles/ParticleSystem";

import type {
  AnatomyConfig,
} from "../../engine/anatomy/AnatomyTypes";

import type {
  EnvironmentPreset,
} from "../../engine/environments/EnvironmentTypes";

import type {
  ParticleConfig,
} from "../../engine/particles/ParticleTypes";

type DemoScene = {
  label: string;
  description: string;
  environment: EnvironmentPreset;
  organ: AnatomyConfig;
  particles?: ParticleConfig;
};

const SCENES: DemoScene[] = [
  {
    label: "CEREBRO",
    description: "HINCHAZÓN",
    environment: "microscopic",

    organ: {
      type: "brain",
      animation: "swelling",
      duration: 3,
      scale: 1.3,
      intensity: 0.8,
    },

    particles: {
      type: "water",
      motion: "float",
      count: 45,
      spread: [3.5, 3, 2.5],
      size: 0.06,
      speed: 0.6,
    },
  },

  {
    label: "CORAZÓN",
    description: "LATIDO CARDÍACO",
    environment: "danger",

    organ: {
      type: "heart",
      animation: "heartbeat",
      scale: 1.45,
    },
  },

  {
    label: "PULMONES",
    description: "RESPIRACIÓN",
    environment: "medical",

    organ: {
      type: "lungs",
      animation: "breathing",
      scale: 1.25,
    },

    particles: {
      type: "bubble",
      motion: "rise",
      count: 35,
      spread: [3, 3, 2],
      size: 0.06,
      speed: 0.6,
    },
  },

  {
    label: "ESTÓMAGO",
    description: "CONTRACCIONES",
    environment: "studio",

    organ: {
      type: "stomach",
      animation: "contract",
      scale: 1.5,
    },
  },

  {
    label: "RIÑONES",
    description: "FILTRACIÓN",
    environment: "medical",

    organ: {
      type: "kidneys",
      animation: "float",
      scale: 1.3,
    },

    particles: {
      type: "sodium",
      motion: "flow",
      count: 40,
      spread: [3, 2, 2],
      direction: [0, -1, 0],
      size: 0.055,
      speed: 0.6,
    },
  },

  {
    label: "INTESTINOS",
    description: "MOVIMIENTO DIGESTIVO",
    environment: "healthy",

    organ: {
      type: "intestines",
      animation: "contract",
      scale: 1.35,
      speed: 0.6,
    },
  },
];

const DURATION = 4;

export const ANATOMY_DEMO_FRAMES =
  SCENES.length * DURATION * 30;

export const AnatomyDemo: React.FC = () => {
  const frame = useCurrentFrame();

  const {
    width,
    height,
    fps,
  } = useVideoConfig();

  const sceneFrames = DURATION * fps;

  const index = Math.min(
    SCENES.length - 1,
    Math.floor(frame / sceneFrames),
  );

  const scene = SCENES[index];

  const startFrame = index * sceneFrames;

  return (
    <AbsoluteFill
      style={{ backgroundColor: "#041522" }}
    >
      <ThreeCanvas
        width={width}
        height={height}
        camera={{
          position: [0, 2.8, 8],
          fov: 40,
          near: 0.1,
          far: 100,
        }}
      >
        <CinematicWorld
          preset={scene.environment}
        />

        <CinematicLighting
          preset={scene.environment}
        />

        <CinematicCamera
          mode="orbit"
          startFrame={startFrame}
          duration={DURATION}
          target={[0, 0, 0]}
        />

        <AnatomyOrgan
          {...scene.organ}
          position={[0, 0.2, 0]}
          startFrame={startFrame}
        />

        {scene.particles && (
          <ParticleSystem
            {...scene.particles}
            position={[0, 1.8, 0]}
            startFrame={startFrame}
            seed={42 + index}
          />
        )}
      </ThreeCanvas>

      <div
        style={{
          position: "absolute",
          top: 120,
          width: "100%",
          textAlign: "center",
          fontFamily: "Arial",
          fontWeight: 900,
          fontSize: 72,
          color: "#ffffff",
        }}
      >
        {scene.label}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 200,
          width: "100%",
          textAlign: "center",
          fontFamily: "Arial",
          fontWeight: 700,
          fontSize: 42,
          color: "#67e8f9",
        }}
      >
        {scene.description}
      </div>
    </AbsoluteFill>
  );
};