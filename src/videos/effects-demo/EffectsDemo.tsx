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
  MicroObject,
} from "../../engine/microscopic/MicroObject";

import {
  Object3D,
} from "../../engine/objects/Object3D";

import {
  ParticleSystem,
} from "../../engine/particles/ParticleSystem";

import {
  GlowEffect,
} from "../../engine/effects/world/GlowEffect";

import {
  ShockwaveEffect,
} from "../../engine/effects/world/ShockwaveEffect";

import {
  Arrow3D,
} from "../../engine/effects/world/Arrow3D";

import {
  AnatomyLabel,
} from "../../engine/effects/world/AnatomyLabel";

import {
  ScreenEffect,
} from "../../engine/effects/screen/ScreenEffect";

import {
  CameraShake,
} from "../../engine/effects/screen/CameraShake";

import {
  WarningIndicator,
} from "../../engine/effects/screen/WarningIndicator";

import {
  AnimatedMeter,
} from "../../engine/effects/screen/AnimatedMeter";

import type {
  EnvironmentPreset,
} from "../../engine/environments/EnvironmentTypes";

const SCENES: {
  label: string;
  environment: EnvironmentPreset;
}[] = [
  {
    label: "HALO LUMINOSO",
    environment: "dark",
  },
  {
    label: "ONDAS EXPANSIVAS",
    environment: "danger",
  },
  {
    label: "FLECHAS ANIMADAS",
    environment: "microscopic",
  },
  {
    label: "ETIQUETAS",
    environment: "microscopic",
  },
  {
    label: "ALERTA VISUAL",
    environment: "danger",
  },
  {
    label: "MEDIDOR",
    environment: "studio",
  },
  {
    label: "IMPACTO",
    environment: "dark",
  },
  {
    label: "ENFOQUE VISUAL",
    environment: "medical",
  },
];

const DURATION = 4;

export const EFFECTS_DEMO_FRAMES =
  SCENES.length * DURATION * 30;

export const EffectsDemo: React.FC = () => {
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

  const impactFrame = startFrame + fps;

  return (
    <AbsoluteFill
      style={{ backgroundColor: "#041522" }}
    >
      <CameraShake
        startFrame={impactFrame}
        intensity={index === 6 ? 28 : 0}
        duration={0.6}
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
            mode={index === 3 ? "static" : "orbit"}
            startFrame={startFrame}
            duration={DURATION}
            target={[0, 0, 0]}
          />

          {/* 1. Glow */}
          {index === 0 && (
            <>
              <GlowEffect
                position={[0, 1.6, -0.8]}
                radius={2.4}
                color="#a78bfa"
                intensity={0.9}
                startFrame={startFrame}
              />

              <AnatomyOrgan
                type="brain"
                animation="float"
                scale={1.4}
                startFrame={startFrame}
              />
            </>
          )}

          {/* 2. Shockwaves */}
          {index === 1 && (
            <>
              <AnatomyOrgan
                type="heart"
                animation="heartbeat"
                scale={1.4}
                startFrame={startFrame}
              />

              <ShockwaveEffect
                position={[0, 0.15, 0]}
                radius={2.2}
                color="#ef4444"
                speed={0.8}
                startFrame={startFrame}
              />
            </>
          )}

          {/* 3. Arrows */}
          {index === 2 && (
            <>
              <MicroObject
                type="waterMolecule"
                position={[0, 1.7, 0]}
                animation="float"
                scale={1.3}
                startFrame={startFrame}
              />

              {[-1, 1].map((side) => (
                <Arrow3D
                  key={side}
                  from={[side * 1.8, 2.8, 0]}
                  to={[side * 0.5, 2, 0]}
                  color="#38bdf8"
                  startFrame={startFrame}
                />
              ))}
            </>
          )}

          {/* 4. Anatomy labels */}
          {index === 3 && (
            <>
              <MicroObject
                type="cell"
                position={[0, 1.7, 0]}
                scale={1.1}
                startFrame={startFrame}
              />

              <AnatomyLabel
                text="NÚCLEO"
                target={[-0.12, 1.8, 0.4]}
                position={[1, 3.1, 0.6]}
                color="#c4b5fd"
                startFrame={startFrame}
              />

              <AnatomyLabel
                text="MEMBRANA"
                target={[-1.05, 1.7, 0]}
                position={[-1.1, 0.2, 0.6]}
                color="#67e8f9"
                startFrame={startFrame + 15}
              />
            </>
          )}

          {/* 5. Danger */}
          {index === 4 && (
            <>
              <AnatomyOrgan
                type="brain"
                animation="swelling"
                scale={1.3}
                duration={3}
                startFrame={startFrame}
              />

              <GlowEffect
                position={[0, 1.5, -0.8]}
                radius={2.2}
                color="#ef4444"
                startFrame={startFrame}
              />
            </>
          )}

          {/* 6. Meter */}
          {index === 5 && (
            <Object3D
              type="waterBottle"
              position={[0, 0.8, 0]}
              scale={1.5}
              animation="rotate"
              startFrame={startFrame}
            />
          )}

          {/* 7. Impact */}
          {index === 6 && (
            <>
              <MicroObject
                type="cell"
                position={[0, 1.7, 0]}
                animation="pulse"
                scale={1.2}
                startFrame={startFrame}
              />

              <ParticleSystem
                type="energy"
                motion="burst"
                count={120}
                position={[0, 1.7, 0]}
                spread={[5, 5, 3]}
                color="#fbbf24"
                speed={1.5}
                startFrame={impactFrame}
              />

              <GlowEffect
                position={[0, 1.7, 0]}
                color="#fbbf24"
                radius={2.5}
                duration={0.4}
                startFrame={impactFrame}
              />
            </>
          )}

          {/* 8. Focus */}
          {index === 7 && (
            <>
              <ParticleSystem
                type="dust"
                motion="float"
                count={150}
                position={[0, 2, -1]}
                spread={[7, 5, 5]}
                startFrame={startFrame}
              />

              <AnatomyOrgan
                type="heart"
                animation="heartbeat"
                scale={1.4}
                startFrame={startFrame}
              />
            </>
          )}
        </ThreeCanvas>
      </CameraShake>

      {/* Screen effects */}
      {index === 4 && (
        <>
          <ScreenEffect
            type="danger"
            intensity={0.7}
            startFrame={startFrame}
          />

          <WarningIndicator
            text="¡PELIGRO!"
            top={250}
            startFrame={startFrame}
          />
        </>
      )}

      {index === 5 && (
        <AnimatedMeter
          label="NIVEL DE AGUA"
          from={20}
          to={95}
          duration={3}
          startFrame={startFrame}
        />
      )}

      {index === 6 && (
        <ScreenEffect
          type="flash"
          color="#fff7d6"
          intensity={0.85}
          duration={0.4}
          startFrame={impactFrame}
        />
      )}

      {index === 7 && (
        <>
          <ScreenEffect
            type="focus"
            intensity={0.65}
            startFrame={startFrame}
          />

          <ScreenEffect
            type="vignette"
            intensity={0.35}
            startFrame={startFrame}
          />
        </>
      )}

      {/* Demo title */}
      <div
        style={{
          position: "absolute",
          top: 100,
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