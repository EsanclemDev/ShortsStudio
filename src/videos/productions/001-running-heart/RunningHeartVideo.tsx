import React from "react";

import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

import { ThreeCanvas } from "@remotion/three";

import { Character3D } from "../../../engine/characters/Character3D";
import { CinematicWorld } from "../../../engine/environments/CinematicWorld";
import { CinematicLighting } from "../../../engine/lighting/CinematicLighting";
import { CinematicCamera } from "../../../engine/camera/CinematicCamera";
import { ContactShadow } from "../../../engine/lighting/ContactShadow";

import { AnatomyOrgan } from "../../../engine/anatomy/AnatomyOrgan";
import { MicroObject } from "../../../engine/microscopic/MicroObject";
import { ParticleSystem } from "../../../engine/particles/ParticleSystem";

import { GlowEffect } from "../../../engine/effects/world/GlowEffect";

import { ScreenEffect } from "../../../engine/effects/screen/ScreenEffect";
import { TransitionEngine } from "../../../engine/transitions/TransitionEngine";

import { AudioEngine } from "../../../engine/audio/AudioEngine";
import { SubtitleEngine } from "../../../engine/subtitles/SubtitleEngine";
import { getMouthOpen } from "../../../engine/audio/LipSync";

import {
  getRunningScene,
  type RunningSceneType,
} from "./scenes";

import { RUNNING_AUDIO } from "./audio";
import { RUNNING_CAPTIONS } from "./captions";
import { HeartRateMonitor } from "./HeartRateMonitor";

import lipsync from "./lipsync.json";

const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const TITLES: Record<RunningSceneType, string> = {
  hook: "¿SABÍAS QUE...?",
  muscles: "MÁS OXÍGENO",
  heart: "MÁS SANGRE",
  lungs: "MÁS RESPIRACIÓN",
  intensity: "MAYOR ESFUERZO",
  training: "MÁS SANGRE POR LATIDO",
  comparison: "MISMO RITMO",
  ending: "ENTRENA TU CORAZÓN",
};

// ======================================================
// ANATOMICAL BACKGROUND
// ======================================================

const AnatomicalBackground: React.FC<{
  healthy?: boolean;
}> = ({ healthy = false }) => (
  <AbsoluteFill
    style={{
      background: healthy
        ? "radial-gradient(ellipse at 50% 45%, #194b40 0%, #0b2928 45%, #031310 100%)"
        : "radial-gradient(ellipse at 50% 45%, #24485f 0%, #10283c 45%, #040e1c 100%)",
    }}
  />
);

// ======================================================
// BLOOD VOLUME COMPARISON
// ======================================================

const BloodVolumeComparison: React.FC<{
  localFrame: number;
}> = ({ localFrame }) => {
  const opacity = interpolate(
    localFrame,
    [12, 28],
    [0, 1],
    CLAMP,
  );

  return (
    <div
      style={{
        position: "absolute",
        bottom: 435,
        left: 120,
        right: 120,
        fontFamily: "Arial",
        opacity,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          gap: 35,
        }}
      >
        {[
          {
            label: "ANTES",
            value: 70,
            color: "#93c5fd",
          },
          {
            label: "ENTRENADO",
            value: 110,
            color: "#4ade80",
          },
        ].map((item) => {
          const fill = interpolate(
            localFrame,
            [18, 70],
            [0, item.value],
            CLAMP,
          );

          return (
            <div
              key={item.label}
              style={{
                flex: 1,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: 120,
                  height: 210,
                  margin: "0 auto",
                  border: "3px solid #94a3b8",
                  borderRadius: 22,
                  background: "#ffffff0c",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    height: `${fill / 120 * 100}%`,
                    background:
                      "linear-gradient(#ef4444, #991b1b)",
                    borderRadius: 10,
                  }}
                />

                {Array.from(
                  { length: 6 },
                  (_, index) => (
                    <div
                      key={index}
                      style={{
                        position: "absolute",
                        right: 0,
                        bottom: 30 + index * 30,
                        width: 20,
                        height: 2,
                        background: "#ffffff88",
                      }}
                    />
                  ),
                )}
              </div>

              <div
                style={{
                  color: item.color,
                  fontSize: 62,
                  fontWeight: 900,
                  marginTop: 10,
                  fontVariantNumeric:
                    "tabular-nums",
                }}
              >
                {Math.round(fill)} ml
              </div>

              <div
                style={{
                  color: "#ffffff",
                  fontSize: 32,
                  fontWeight: 800,
                }}
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 15,
          textAlign: "center",
          color: "#cbd5e1",
          fontSize: 25,
        }}
      >
        Ejemplo ilustrativo
      </div>
    </div>
  );
};

// ======================================================
// HEART RATE COMPARISON
// ======================================================

const HeartRateComparison: React.FC<{
  localFrame: number;
}> = ({ localFrame }) => {
  const opacity = interpolate(
    localFrame,
    [8, 25],
    [0, 1],
    CLAMP,
  );

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 350,
          left: 90,
          right: 90,
          display: "flex",
          gap: 25,
          fontFamily: "Arial",
          opacity,
        }}
      >
        {[
          {
            label: "MENOS ENTRENADO",
            bpm: 165,
            color: "#fb7185",
          },
          {
            label: "ENTRENADO",
            bpm: 140,
            color: "#4ade80",
          },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              flex: 1,
              padding: 20,
              textAlign: "center",
              borderRadius: 25,
              background: "#061522dd",
              border: `2px solid ${item.color}`,
            }}
          >
            <div
              style={{
                fontSize: 28,
                color: "#ffffff",
                fontWeight: 800,
              }}
            >
              {item.label}
            </div>

            <div
              style={{
                color: item.color,
                fontSize: 85,
                fontWeight: 900,
              }}
            >
              {item.bpm}
            </div>

            <div
              style={{
                color: "#ffffff",
                fontSize: 28,
              }}
            >
              PPM
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 220,
          left: 100,
          right: 100,
          color: "#cbd5e1",
          textAlign: "center",
          fontFamily: "Arial",
          fontSize: 26,
        }}
      >
        Ejemplo ilustrativo
      </div>
    </>
  );
};

// ======================================================
// MAIN VIDEO
// ======================================================

export const RunningHeartVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scene = getRunningScene(frame);

  const start = scene.startFrame;
  const localFrame = frame - start;
  const duration = scene.durationInFrames / fps;
  const time = localFrame / fps;

  const isCharacterScene =
    scene.type === "hook" ||
    scene.type === "muscles" ||
    scene.type === "ending";

  const isHealthy =
    scene.type === "training" ||
    scene.type === "ending";

  const progress = interpolate(
    localFrame,
    [0, Math.max(1, scene.durationInFrames - 1)],
    [0, 1],
    CLAMP,
  );

  const titleOpacity =
    scene.type === "hook"
      ? 1
      : interpolate(
          localFrame,
          [0, 16],
          [0, 1],
          CLAMP,
        );

  const titleOffset = interpolate(
    localFrame,
    [0, 18],
    [-15, 0],
    CLAMP,
  );

  const mouthOpen = getMouthOpen(
    lipsync,
    frame,
    fps,
  );

  const currentTitle =
    scene.type === "hook"
      ? localFrame < 36
        ? "¿SABÍAS QUE...?"
        : localFrame < 75
          ? "TU CORAZÓN"
          : "MÁS DEL DOBLE"
      : TITLES[scene.type];

  const renderScene = () => {
    switch (scene.type) {
      // ================================================
      // 1. HOOK
      // ================================================

      case "hook": {
        const heartEntrance = interpolate(
          localFrame,
          [75, 90],
          [0, 1],
          CLAMP,
        );

        return (
          <>
            <CinematicCamera
              mode="static"
              target={[0, 0.2, 0]}
              startFrame={start}
              duration={duration}
            />

            <Character3D
              action="run"
              position={[-0.15, 0, 0]}
              size={3.1}
              startFrame={0}
            />

            <ContactShadow
              position={[-0.15, 0.015, 0]}
              size={1.8}
              opacity={0.5}
            />

            {heartEntrance > 0 && (
              <AnatomyOrgan
                type="heart"
                position={[0.95, 2.15, 0]}
                scale={0.38 * heartEntrance}
                animation="heartbeat"
                speed={145 / 72}
                intensity={0.65}
                startFrame={start + 75}
              />
            )}
          </>
        );
      }

      // ================================================
      // 2. MUSCLES
      // ================================================

      case "muscles": {
        const effectEntrance = interpolate(
          localFrame,
          [5, 25],
          [0, 1],
          CLAMP,
        );

        return (
          <>
            <CinematicCamera
              mode="static"
              target={[0, 0.2, 0]}
              startFrame={start}
              duration={duration}
            />

            <Character3D
              action="run"
              position={[-0.15, 0, 0]}
              size={3.1}
              startFrame={0}
            />

            <ContactShadow
              position={[-0.15, 0.015, 0]}
              size={1.8}
              opacity={0.5}
            />

            {[-1, 1].map((side) => (
              <GlowEffect
                key={side}
                position={[
                  -0.15 + side * 0.32,
                  0.65,
                  0.15,
                ]}
                radius={0.48}
                color="#38bdf8"
                intensity={
                  0.45 * effectEntrance
                }
                speed={1}
                startFrame={start}
              />
            ))}

            <ParticleSystem
              type="energy"
              motion="rise"
              count={14}
              position={[-0.15, 0.65, 0.2]}
              spread={[1.3, 1.1, 0.5]}
              color="#38bdf8"
              size={0.025}
              speed={0.5}
              startFrame={start + 15}
            />
          </>
        );
      }

      // ================================================
      // 3. HEART
      // ================================================

      case "heart":
        return (
          <>
            <CinematicCamera
              mode="slowOrbit"
              startFrame={start}
              duration={duration}
            />

            <AnatomyOrgan
              type="heart"
              position={[0, 0.55, 0]}
              scale={1.15}
              animation="heartbeat"
              speed={145 / 72}
              intensity={0.6}
              startFrame={start}
            />

            <GlowEffect
              position={[0, 1.7, -0.8]}
              radius={1.7}
              color="#fb7185"
              intensity={0.3}
              startFrame={start}
            />

            <ParticleSystem
              type="blood"
              motion="flow"
              count={18}
              position={[0, 1.8, -0.5]}
              spread={[2.8, 3, 1.5]}
              direction={[0, 1, 0]}
              speed={0.7}
              size={0.055}
              startFrame={start}
            />
          </>
        );

      // ================================================
      // 4. LUNGS
      // ================================================

      case "lungs":
        return (
          <>
            <CinematicCamera
              mode="slowZoom"
              startFrame={start}
              duration={duration}
            />

            <AnatomyOrgan
              type="lungs"
              position={[0, 0.35, 0]}
              scale={1.15}
              animation="breathing"
              speed={1.8}
              intensity={0.9}
              startFrame={start}
            />

            <ParticleSystem
              type="bubble"
              motion="flow"
              count={20}
              position={[0, 2.2, 0.2]}
              spread={[1.8, 2.5, 0.8]}
              direction={[0, -1, 0]}
              color="#7dd3fc"
              size={0.035}
              speed={0.65}
              startFrame={start}
            />

            <GlowEffect
              position={[0, 1.7, -0.8]}
              radius={1.7}
              color="#38bdf8"
              intensity={0.3}
              startFrame={start}
            />
          </>
        );

      // ================================================
      // 5. INCREASING EFFORT
      // ================================================

      case "intensity": {
        const bpm = interpolate(
          time,
          [0, Math.max(0.01, duration)],
          [145, 175],
          CLAMP,
        );

        const averageBpm = (145 + bpm) / 2;

        return (
          <>
            <CinematicCamera
              mode="slowZoom"
              startFrame={start}
              duration={duration}
            />

            <AnatomyOrgan
              type="heart"
              position={[0, 0.5, 0]}
              scale={1.2}
              animation="heartbeat"
              speed={averageBpm / 72}
              intensity={0.65}
              startFrame={start}
            />

            <GlowEffect
              position={[0, 1.7, -0.7]}
              radius={1.8}
              color="#fb7185"
              intensity={0.3 + progress * 0.15}
              startFrame={start}
            />
          </>
        );
      }

      // ================================================
      // 6. TRAINING ADAPTATION
      // ================================================

      case "training":
        return (
          <>
            <CinematicCamera
              mode="slowOrbit"
              target={[0, 0.15, 0]}
              startFrame={start}
              duration={duration}
            />

            <AnatomyOrgan
              type="heart"
              position={[0, 1.4, 0]}
              scale={0.78}
              animation="heartbeat"
              speed={85 / 72}
              intensity={0.6}
              startFrame={start}
            />

            <GlowEffect
              position={[0, 2.1, -0.8]}
              radius={1.35}
              color="#22c55e"
              intensity={0.35}
              startFrame={start}
            />

            {Array.from(
              { length: 6 },
              (_, index) => {
                const angle =
                  index * Math.PI * 2 / 6 +
                  time * 0.35;

                return (
                  <MicroObject
                    key={index}
                    type="redBloodCell"
                    position={[
                      Math.cos(angle) * 0.95,
                      2.1 +
                        Math.sin(angle * 2) * 0.45,
                      Math.sin(angle) * 0.65,
                    ]}
                    scale={0.085}
                    animation="rotate"
                    speed={0.4}
                    startFrame={start}
                  />
                );
              },
            )}
          </>
        );

      // ================================================
      // 7. COMPARISON
      // ================================================

      case "comparison":
        return (
          <>
            <CinematicCamera
              mode="static"
              startFrame={start}
              duration={duration}
            />

            <AnatomyOrgan
              type="heart"
              position={[-0.85, 0.8, 0]}
              scale={0.75}
              animation="heartbeat"
              speed={165 / 72}
              intensity={0.6}
              startFrame={start}
            />

            <AnatomyOrgan
              type="heart"
              position={[0.85, 0.8, 0]}
              scale={0.75}
              animation="heartbeat"
              speed={140 / 72}
              intensity={0.6}
              startFrame={start}
            />

            <GlowEffect
              position={[-0.85, 1.7, -0.4]}
              radius={0.9}
              color="#ef4444"
              intensity={0.35}
              startFrame={start}
            />

            <GlowEffect
              position={[0.85, 1.7, -0.4]}
              radius={0.9}
              color="#22c55e"
              intensity={0.35}
              startFrame={start}
            />
          </>
        );

      // ================================================
      // 8. ENDING
      // ================================================

      case "ending": {
        const heartEntrance = interpolate(
          localFrame,
          [12, 32],
          [0, 1],
          CLAMP,
        );

        return (
          <>
            <CinematicCamera
              mode="slowZoom"
              target={[0, 0.2, 0]}
              startFrame={start}
              duration={duration}
            />

            <Character3D
              action={
                progress < 0.55
                  ? "talk"
                  : "thumbsUp"
              }
              position={[-0.25, 0, 0]}
              size={3}
              mouthOpen={
                progress < 0.55
                  ? mouthOpen
                  : 0.8
              }
              startFrame={start}
            />

            <ContactShadow
              position={[-0.25, 0.015, 0]}
              size={1.8}
              opacity={0.5}
            />

            {heartEntrance > 0 && (
              <>
                <AnatomyOrgan
                  type="heart"
                  position={[0.95, 2.1, 0]}
                  scale={0.4 * heartEntrance}
                  animation="heartbeat"
                  speed={1.2}
                  intensity={0.6}
                  startFrame={start + 12}
                />

                <GlowEffect
                  position={[0.95, 2.5, -0.5]}
                  radius={0.9}
                  color="#22c55e"
                  intensity={
                    0.5 * heartEntrance
                  }
                  startFrame={start + 12}
                />
              </>
            )}
          </>
        );
      }
    }
  };

  // ====================================================
  // FINAL COMPOSITION
  // ====================================================

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#041522",
        overflow: "hidden",
      }}
    >
      <TransitionEngine
        config={scene.transition}
        startFrame={start}
      >
        {!isCharacterScene && (
          <AnatomicalBackground
            healthy={isHealthy}
          />
        )}

        <ThreeCanvas
          width={1080}
          height={1920}
          gl={{
            alpha: true,
            antialias: true,
          }}
          camera={{
            position: [0, 2.8, 8],
            fov: 40,
            near: 0.1,
            far: 100,
          }}
        >
          {isCharacterScene && (
            <CinematicWorld
              preset={
                isHealthy
                  ? "healthy"
                  : "studio"
              }
            />
          )}

          <CinematicLighting
            preset={
              isHealthy
                ? "healthy"
                : isCharacterScene
                  ? "studio"
                  : "medical"
            }
          />

          {renderScene()}
        </ThreeCanvas>
      </TransitionEngine>

      {/* Subtle cinematic vignette */}

      <ScreenEffect
        type="vignette"
        intensity={0.2}
      />

      {/* Scene title */}

      <div
        style={{
          position: "absolute",
          top: 160,
          left: 85,
          right: 85,
          textAlign: "center",
          color: "#ffffff",
          fontFamily: "Arial",
          fontWeight: 900,
          fontSize:
            scene.type === "training"
              ? 62
              : 72,
          lineHeight: 1.05,
          textShadow: "0 4px 12px #000000",
          opacity: titleOpacity,
          transform:
            `translateY(${titleOffset}px)`,
        }}
      >
        {currentTitle}
      </div>

      {/* Heart rate monitors */}

      {scene.type === "hook" && (
        <HeartRateMonitor
          from={65}
          to={145}
          duration={Math.max(
            0.5,
            duration - 1.4,
          )}
          startFrame={start + 36}
          top={290}
        />
      )}

      {scene.type === "heart" && (
        <HeartRateMonitor
          from={145}
          to={145}
          duration={duration}
          startFrame={start}
          top={290}
        />
      )}

      {scene.type === "intensity" && (
        <HeartRateMonitor
          from={145}
          to={175}
          duration={duration}
          startFrame={start}
          top={290}
          color="#fb7185"
        />
      )}

      {/* Educational comparisons */}

      {scene.type === "training" && (
        <BloodVolumeComparison
          localFrame={localFrame}
        />
      )}

      {scene.type === "comparison" && (
        <HeartRateComparison
          localFrame={localFrame}
        />
      )}

      {/* Channel branding */}

      {scene.type === "ending" && (
        <div
          style={{
            position: "absolute",
            bottom: 210,
            left: 80,
            right: 80,
            textAlign: "center",
            fontFamily: "Arial",
            color: "#4ade80",
            fontSize: 42,
            fontWeight: 900,
            opacity: interpolate(
              progress,
              [0.3, 0.65],
              [0, 1],
              CLAMP,
            ),
          }}
        >
          EL CUERPO EN CLARO
        </div>
      )}

      <AudioEngine
        config={RUNNING_AUDIO}
      />

      <SubtitleEngine
        config={RUNNING_CAPTIONS}
      />
    </AbsoluteFill>
  );
};