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
  MicroObject,
} from "../../engine/microscopic/MicroObject";

import {
  OsmosisScene,
  type OsmosisMode,
} from "../../engine/microscopic/OsmosisScene";

import {
  ParticleSystem,
} from "../../engine/particles/ParticleSystem";

import type {
  MicroConfig,
} from "../../engine/microscopic/MicroTypes";

type DemoScene = {
  label: string;
  description: string;
  object?: MicroConfig;
  osmosis?: OsmosisMode;
};

const SCENES: DemoScene[] = [
  {
    label: "CÉLULA",
    description: "ESTRUCTURA CELULAR",
    object: {
      type: "cell",
      animation: "rotate",
      scale: 1.3,
    },
  },
  {
    label: "GLÓBULO ROJO",
    description: "FORMA BICÓNCAVA",
    object: {
      type: "redBloodCell",
      animation: "rotate",
      scale: 1.4,
    },
  },
  {
    label: "AGUA",
    description: "H₂O",
    object: {
      type: "waterMolecule",
      animation: "rotate",
      scale: 1.5,
    },
  },
  {
    label: "SODIO",
    description: "Na⁺",
    object: {
      type: "sodiumIon",
      animation: "pulse",
      scale: 1.5,
    },
  },
  {
    label: "BACTERIA",
    description: "MICROORGANISMO",
    object: {
      type: "bacteria",
      animation: "rotate",
      scale: 1,
    },
  },
  {
    label: "VIRUS",
    description: "ESTRUCTURA VIRAL",
    object: {
      type: "virus",
      animation: "rotate",
      scale: 1.3,
    },
  },
  {
    label: "ÓSMOSIS",
    description: "MEDIO ISOTÓNICO",
    osmosis: "isotonic",
  },
  {
    label: "ÓSMOSIS",
    description: "MEDIO HIPOTÓNICO",
    osmosis: "hypotonic",
  },
  {
    label: "ÓSMOSIS",
    description: "MEDIO HIPERTÓNICO",
    osmosis: "hypertonic",
  },
  {
    label: "DIVISIÓN CELULAR",
    description: "SEPARACIÓN CELULAR",
    object: {
      type: "cell",
      animation: "division",
      scale: 1,
      duration: 4,
    },
  },
];

const DURATION = 4;

export const MICROSCOPIC_DEMO_FRAMES =
  SCENES.length * DURATION * 30;

export const MicroscopicDemo: React.FC = () => {
  const frame = useCurrentFrame();

  const { width, height, fps } = useVideoConfig();

  const sceneFrames = DURATION * fps;

  const index = Math.min(
    SCENES.length - 1,
    Math.floor(frame / sceneFrames),
  );

  const scene = SCENES[index];

  const startFrame = index * sceneFrames;

  return (
    <AbsoluteFill
      style={{ backgroundColor: "#100b24" }}
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
        <CinematicWorld preset="microscopic" />

        <CinematicLighting preset="microscopic" />

        <CinematicCamera
          mode="orbit"
          startFrame={startFrame}
          duration={DURATION}
          target={[0, 0, 0]}
        />

        {/* Background particles */}
        <ParticleSystem
          type="dust"
          motion="float"
          count={70}
          position={[0, 2, -1]}
          spread={[7, 5, 5]}
          speed={0.3}
          startFrame={startFrame}
        />

        {scene.object && (
          <MicroObject
            {...scene.object}
            position={[0, 1.7, 0]}
            startFrame={startFrame}
          />
        )}

        {scene.osmosis && (
          <OsmosisScene
            mode={scene.osmosis}
            duration={DURATION}
            startFrame={startFrame}
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
          fontSize: 64,
          fontWeight: 900,
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
          fontSize: 40,
          fontWeight: 700,
          color: "#c4b5fd",
        }}
      >
        {scene.description}
      </div>
    </AbsoluteFill>
  );
};