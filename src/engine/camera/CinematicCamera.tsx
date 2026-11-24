import React, { useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";

import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type CameraMode =
  | "static"
  | "zoomIn"
  | "zoomOut"
  | "orbit"
  | "pan"
  | "follow"
  | "closeUp"
  | "wide";

type Props = {
  mode?: CameraMode;
  startFrame?: number;
  duration?: number;
  target?: [number, number, number];
};

export const CinematicCamera: React.FC<Props> = ({
  mode = "static",
  startFrame = 0,
  duration = 3,
  target = [0, 0, 0],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { camera, invalidate } = useThree();

  const progress = interpolate(
    frame - startFrame,
    [0, Math.max(1, duration * fps - 1)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const smooth =
    progress * progress * (3 - 2 * progress);

  const [tx, ty, tz] = target;

  useLayoutEffect(() => {
    let x = tx;
    let y = ty + 2.8;
    let z = tz + 8;

    let lookX = tx;
    let lookY = ty + 1.7;
    let lookZ = tz;

    switch (mode) {
      case "static":
        break;

      case "zoomIn":
        z = tz + 8 - smooth * 2.5;
        break;

      case "zoomOut":
        z = tz + 5.5 + smooth * 2.5;
        break;

      case "orbit": {
        const angle = -0.55 + smooth * 1.1;

        x = tx + Math.sin(angle) * 8;
        z = tz + Math.cos(angle) * 8;

        break;
      }

      case "pan":
        x = tx - 2.5 + smooth * 5;
        break;

      case "follow":
        x = tx;
        y = ty + 2.8;
        z = tz + 9.5;
        break;

      case "closeUp":
        x = tx;
        y = ty + 2.7;
        z = tz + 4;

        lookY = ty + 2.6;
        break;

      case "wide":
        y = ty + 4;
        z = tz + 13;
        break;
    }

    camera.position.set(x, y, z);

    camera.lookAt(
      lookX,
      lookY,
      lookZ,
    );

    camera.updateMatrixWorld();

    invalidate();
  }, [
    camera,
    mode,
    smooth,
    tx,
    ty,
    tz,
    invalidate,
  ]);

  return null;
};