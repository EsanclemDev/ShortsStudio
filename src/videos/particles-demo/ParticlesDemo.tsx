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
  ParticleSystem,
} from "../../engine/particles/ParticleSystem";

import type {
  ParticleConfig,
} from "../../engine/particles/ParticleTypes";

import type {
  EnvironmentPreset,
} from "../../engine/environments/EnvironmentTypes";

type DemoScene = {
  label: string;
  environment: EnvironmentPreset;
  particles: ParticleConfig;
};

const SCENES: DemoScene[] = [
  {
    label: "GOTAS DE AGUA",
    environment: "studio",
    particles: {
      type: "water",
      motion: "fall",
      count: 150,
      speed: 2,
      spread: [3, 4, 2],
    },
  },
  {
    label: "BURBUJAS",
    environment: "medical",
    particles: {
      type: "bubble",
      motion: "rise",
      count: 100,
      speed: 1,
      spread: [3, 4, 2],
    },
  },
  {
    label: "SODIO",
    environment: "microscopic",
    particles: {
      type: "sodium",
      motion: "float",
      count: 80,
      speed: 0.8,
      spread: [3, 3, 2],
    },
  },
  {
    label: "FLUJO SANGUÍNEO",
    environment: "danger",
    particles: {
      type: "blood",
      motion: "flow",
      count: 100,
      speed: 2,
      direction: [1, 0, 0],
      spread: [4, 2, 2],
    },
  },
  {
    label: "ENERGÍA",
    environment: "dark",
    particles: {
      type: "energy",
      motion: "orbit",
      count: 200,
      speed: 1.5,
      spread: [3, 3, 3],
    },
  },
  {
    label: "SALPICADURA",
    environment: "studio",
    particles: {
      type: "water",
      motion: "burst",
      count: 180,
      speed: 0.4,
      spread: [4, 4, 3],
    },
  },
];

const DURATION = 3;

export const PARTICLES_DEMO_FRAMES =
  SCENES.length * DURATION * 30;

export const ParticlesDemo: React.FC = () => {
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
      style={{
        backgroundColor: "#041522",
      }}
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

        <ParticleSystem
          {...scene.particles}
          position={[0, 2.2, 0]}
          startFrame={startFrame}
          seed={42 + index}
        />
      </ThreeCanvas>

      <div
        style={{
          position: "absolute",
          top: 120,
          width: "100%",
          textAlign: "center",
          fontFamily: "Arial",
          fontSize: 58,
          fontWeight: 900,
          color: "#ffffff",
        }}
      >
        {scene.label}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 180,
          width: "100%",
          textAlign: "center",
          fontFamily: "Arial",
          fontSize: 38,
          color: "#67e8f9",
        }}
      >
        {scene.particles.count} PARTÍCULAS
      </div>
    </AbsoluteFill>
  );
};