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
import { FPS } from "./videos/bridge/story";

export const RemotionRoot: React.FC = () => {
  return (
    <>
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