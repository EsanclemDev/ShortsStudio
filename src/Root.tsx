import { Composition, staticFile } from "remotion";
import { Scene, myCompSchema } from "./Scene";
import { getMediaMetadata } from "./helpers/get-media-metadata";

import {
  BridgeShort,
  BRIDGE_FRAMES,
} from "./videos/bridge/Bridge";
import {
  CharacterDemo,
  CHARACTER_DEMO_FRAMES,
} from "./videos/character-demo/CharacterDemo";
import {
  WorldDemo,
  WORLD_DEMO_FRAMES,
} from "./videos/world-demo/WorldDemo";
import {
  AudioDemo,
  AUDIO_DEMO_FRAMES,
} from "./videos/audio-demo/AudioDemo";
import { FPS } from "./videos/bridge/story";

import {
  CreatineVideo,
  CREATINE_DURATION,
} from "./videos/productions/002-creatine/CreatineVideo";
import {
  VisualDemo,
  VISUAL_DEMO_FRAMES,
} from "./videos/visual-demo/VisualDemo";
import {
  GymDemo ,
} from "./videos/gym-demo/GymDemo";
import {
  ParticlesDemo,
  PARTICLES_DEMO_FRAMES,
} from "./videos/particles-demo/ParticlesDemo";
import {
  AnatomyDemo,
  ANATOMY_DEMO_FRAMES,
} from "./videos/anatomy-demo/AnatomyDemo";
import {
  LiquidsDemo,
  LIQUIDS_DEMO_FRAMES,
} from "./videos/liquids-demo/LiquidsDemo";
import {
  MicroscopicDemo,
  MICROSCOPIC_DEMO_FRAMES,
} from "./videos/microscopic-demo/MicroscopicDemo";
import {
  EffectsDemo,
  EFFECTS_DEMO_FRAMES,
} from "./videos/effects-demo/EffectsDemo";
import {
  RunningHeartVideo,
} from "./videos/productions/001-running-heart/RunningHeartVideo";

import {
  RUNNING_HEART_FRAMES,
} from "./videos/productions/001-running-heart/scenes";
export const RemotionRoot: React.FC = () => {
  return (
    <>
    <Composition
  id="002-Creatine"
  component={CreatineVideo}
  durationInFrames={CREATINE_DURATION}
  fps={30}
  width={1080}
  height={1920}
/>
    <Composition
  id="RunningHeartVideo"
  component={RunningHeartVideo}
  durationInFrames={RUNNING_HEART_FRAMES}
  fps={30}
  width={1080}
  height={1920}
/>
    <Composition
  id="EffectsDemo"
  component={EffectsDemo}
  durationInFrames={EFFECTS_DEMO_FRAMES}
  fps={30}
  width={1080}
  height={1920}
/>
    <Composition
  id="MicroscopicDemo"
  component={MicroscopicDemo}
  durationInFrames={MICROSCOPIC_DEMO_FRAMES}
  fps={30}
  width={1080}
  height={1920}
/>
    <Composition
  id="AnatomyDemo"
  component={AnatomyDemo}
  durationInFrames={ANATOMY_DEMO_FRAMES}
  fps={30}
  width={1080}
  height={1920}
/>
    <Composition
  id="LiquidsDemo"
  component={LiquidsDemo}
  durationInFrames={LIQUIDS_DEMO_FRAMES}
  fps={30}
  width={1080}
  height={1920}
/>
    <Composition
  id="ParticlesDemo"
  component={ParticlesDemo}
  durationInFrames={PARTICLES_DEMO_FRAMES}
  fps={30}
  width={1080}
  height={1920}
/><Composition
  id="GymDemo"
  component={GymDemo}
  durationInFrames={1080}
  fps={30}
  width={1080}
  height={1920}
/>
    <Composition
  id="VisualDemo"
  component={VisualDemo}
  durationInFrames={VISUAL_DEMO_FRAMES}
  fps={30}
  width={1080}
  height={1920}
/>
      <Composition
        id="Scene"
        component={Scene}
        fps={30}
        durationInFrames={300}
        width={1280}
        height={720}
        schema={myCompSchema}
        defaultProps={{
          deviceType: "phone",
          phoneColor: "rgb(110, 152, 191)" as const,
          baseScale: 1,
          mediaMetadata: null,
          videoSrc: null,
        }}
        calculateMetadata={async ({ props }) => {
          const videoSrc =
            props.deviceType === "phone"
              ? staticFile("phone.mp4")
              : staticFile("tablet.mp4");

          const mediaMetadata =
            await getMediaMetadata(videoSrc);

          return {
            props: {
              ...props,
              mediaMetadata,
              videoSrc,
            },
          };
        }}
      />
<Composition
  id="CharacterDemo"
  component={CharacterDemo}
  fps={30}
  durationInFrames={CHARACTER_DEMO_FRAMES}
  width={1080}
  height={1920}
/>
<Composition
  id="AudioDemo"
  component={AudioDemo}
  durationInFrames={AUDIO_DEMO_FRAMES}
  fps={30}
  width={1080}
  height={1920}
/>
<Composition
  id="WorldDemo"
  component={WorldDemo}
  durationInFrames={WORLD_DEMO_FRAMES}
  fps={30}
  width={1080}
  height={1920}
/>
      <Composition
        id="BridgeShort"
        component={BridgeShort}
        fps={FPS}
        durationInFrames={BRIDGE_FRAMES}
        width={1080}
        height={1920}
      />
    </>
  );
};