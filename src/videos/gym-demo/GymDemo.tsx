import React from "react";

import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { ThreeCanvas } from "@remotion/three";
import { MuscleDemo } from "../muscle-demo/MuscleDemo";
import { Character3D } from "../../engine/characters/Character3D";
import { CinematicWorld } from "../../engine/environments/CinematicWorld";
import { CinematicLighting } from "../../engine/lighting/CinematicLighting";
import { CinematicCamera } from "../../engine/camera/CinematicCamera";
import { ContactShadow } from "../../engine/lighting/ContactShadow";

import { SupplementDemo } from "../supplement-demo/SupplementDemo";

const GymTraining: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const time = frame / fps;

  const phase =
    time < 5 ? 0 :
    time < 10 ? 1 :
    time < 15 ? 2 : 3;

  const startFrame = phase * 5 * fps;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#071421",
        overflow: "hidden",
      }}
    >
      <ThreeCanvas
        width={1080}
        height={1920}
        camera={{
          position: [0, 2.8, 8],
          fov: 40,
          near: 0.1,
          far: 100,
        }}
      >
        <CinematicWorld preset="gym" />

        <CinematicLighting preset="gym" />

        <CinematicCamera
          mode={
            phase === 0
              ? "static"
              : phase === 1
                ? "slowZoom"
                : phase === 2
                  ? "slowOrbit"
                  : "slowZoomOut"
          }
          target={[0, 0, 0]}
          startFrame={startFrame}
          duration={5}
        />

        {/* Personaje sin creatina */}

       <Character3D
  action="bicepsCurl"
  position={[-1.05, 0, 0]}
  size={2.7}
  workout={{
    reps: 8,
    period: 1.8,
    fail: true,
  }}
/>

<Character3D
  action="bicepsCurl"
  position={[1.05, 0, 0]}
  size={2.7}
  workout={{
    reps: 9,
    period: 1.8,
    fail: true,
  }}
  appearance={{
    shirtColor: "#22c55e",
    shortsColor: "#334155",
    shoeColor: "#ffffff",
    hairColor: "#75452c",
    hairStyle: "short",
  }}
/>
        <ContactShadow
          position={[1.05, 0.015, 0]}
          size={1.5}
          opacity={0.6}
        />
      </ThreeCanvas>

      {/* Título */}

      <div
        style={{
          position: "absolute",
          top: 160,
          left: 60,
          right: 60,
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
          fontWeight: 900,
          fontSize: 76,
          color: "#ffffff",
          textShadow: "0 5px 15px #000000",
        }}
      >
        {[
          "MISMO ENTRENAMIENTO",
          "LEVANTANDO PESAS",
          "DIFERENCIA DE RENDIMIENTO",
          "FIN DE LA SERIE",
        ][phase]}
      </div>

      {/* Identificadores */}

      <div
        style={{
          position: "absolute",
          bottom: 280,
          left: 70,
          right: 70,
          display: "flex",
          justifyContent: "space-around",
          gap: 30,
        }}
      >
        {[
          {
            text: "SIN CREATINA",
            color: "#ef4444",
          },
          {
            text: "CON CREATINA",
            color: "#22c55e",
          },
        ].map(({ text, color }) => (
          <div
            key={text}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "20px 12px",
              border: `3px solid ${color}`,
              borderRadius: 20,
              backgroundColor: "rgba(5,15,25,0.85)",
              color,
              fontFamily: "Arial, sans-serif",
              fontSize: 40,
              fontWeight: 900,
            }}
          >
            {text}
          </div>
        ))}
      </div>

      {/* Indicador de prueba */}

      <div
        style={{
          position: "absolute",
          bottom: 180,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
          fontSize: 30,
          color: "#94a3b8",
        }}
      >
        GYM ENGINE DEMO · FASE {phase + 1}/4
      </div>
    </AbsoluteFill>
  );
};

/* Composición principal */

export const GymDemo: React.FC = () => {
  const { fps } = useVideoConfig();

  const supplementDuration = 8 * fps;
  const trainingDuration = 20 * fps;
  const muscleDuration = 8 * fps;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#071421",
        overflow: "hidden",
      }}
    >
      <Sequence
        from={0}
        durationInFrames={supplementDuration}
        name="Supplement Test"
      >
        <SupplementDemo />
      </Sequence>

      <Sequence
        from={supplementDuration}
        durationInFrames={trainingDuration}
        name="Gym Training"
      >
        <GymTraining />
      </Sequence>

      <Sequence
        from={supplementDuration + trainingDuration}
        durationInFrames={muscleDuration}
        name="Muscle Energy"
      >
        <MuscleDemo />
      </Sequence>
    </AbsoluteFill>
  );
};