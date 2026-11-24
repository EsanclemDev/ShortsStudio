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
  LiquidContainer,
} from "../../engine/liquids/LiquidContainer";

import {
  LiquidStream,
} from "../../engine/liquids/LiquidStream";

import {
  LiquidRipple,
} from "../../engine/liquids/LiquidRipple";

import {
  ParticleSystem,
} from "../../engine/particles/ParticleSystem";

import type {
  EnvironmentPreset,
} from "../../engine/environments/EnvironmentTypes";

const SCENES: {
  label: string;
  environment: EnvironmentPreset;
}[] = [
  {
    label: "LLENADO",
    environment: "studio",
  },
  {
    label: "VACIADO",
    environment: "medical",
  },
  {
    label: "CHORRO DE AGUA",
    environment: "studio",
  },
  {
    label: "FLUJO SANGUÍNEO",
    environment: "danger",
  },
  {
    label: "LÍQUIDO GÁSTRICO",
    environment: "microscopic",
  },
];

const DURATION = 4;

export const LIQUIDS_DEMO_FRAMES =
  SCENES.length * DURATION * 30;

export const LiquidsDemo: React.FC = () => {
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

  const startFrame = index * sceneFrames;

  const scene = SCENES[index];

  const time = (frame - startFrame) / fps;

  const progress = Math.min(1, time / 3);

  const eased =
    progress * progress * (3 - 2 * progress);

  const waterSurface =
    0.05 + 2.45 * 0.85 * eased;

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

        {index === 0 && (
          <>
            <LiquidContainer
              radius={0.8}
              height={2.5}
              level={0.85}
              animation="fill"
              duration={3}
              startFrame={startFrame}
            />

            <LiquidStream
              from={[-1.2, 3.5, 0]}
              to={[0, waterSurface, 0]}
              radius={0.065}
              curvature={0.2}
              startFrame={startFrame}
              duration={3}
            />

            {time > 0.2 && time < 3 && (
              <LiquidRipple
                position={[0, waterSurface + 0.05, 0]}
                radius={0.65}
                startFrame={startFrame}
              />
            )}
          </>
        )}

        {index === 1 && (
          <LiquidContainer
            radius={0.8}
            height={2.5}
            level={0.9}
            animation="drain"
            duration={3.5}
            startFrame={startFrame}
          />
        )}

        {index === 2 && (
          <>
            <LiquidStream
              from={[-1.2, 3.2, 0]}
              to={[1.2, 0.6, 0]}
              radius={0.09}
              curvature={0.8}
              startFrame={startFrame}
            />

            <ParticleSystem
              type="water"
              motion="float"
              count={35}
              position={[1.2, 0.6, 0]}
              spread={[0.6, 0.4, 0.6]}
              startFrame={startFrame}
            />
          </>
        )}

        {index === 3 && (
          <>
            <LiquidStream
              type="blood"
              from={[-1.6, 1.5, 0]}
              to={[1.6, 1.5, 0]}
              radius={0.3}
              curvature={0}
              speed={0.8}
              startFrame={startFrame}
            />

            <ParticleSystem
              type="blood"
              motion="flow"
              count={35}
              position={[0, 1.5, 0]}
              spread={[3.2, 0.3, 0.3]}
              direction={[1, 0, 0]}
              size={0.12}
              speed={2}
              startFrame={startFrame}
            />
          </>
        )}

        {index === 4 && (
          <>
            <LiquidContainer
              type="gastric"
              radius={0.9}
              height={2.2}
              level={0.7}
              animation="pulse"
              startFrame={startFrame}
            />

            <ParticleSystem
              type="bubble"
              motion="rise"
              count={40}
              color="#d9f99d"
              position={[0, 0.75, 0]}
              spread={[0.9, 1.2, 0.9]}
              size={0.08}
              speed={0.5}
              startFrame={startFrame}
            />
          </>
        )}
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
    </AbsoluteFill>
  );
};