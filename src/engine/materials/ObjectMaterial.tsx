import React from "react";

import {
  MATERIAL_PRESETS,
  type MaterialPreset,
} from "./MaterialPresets";

type Props = {
  preset?: MaterialPreset;
  color?: string;
  opacity?: number;
};

export const ObjectMaterial: React.FC<Props> = ({
  preset = "plastic",
  color = "#ffffff",
  opacity,
}) => {
  const config = MATERIAL_PRESETS[preset];

  return (
    <meshStandardMaterial
      {...config}
      color={color}
      opacity={opacity ?? config.opacity ?? 1}
      transparent={
        config.transparent ||
        (opacity !== undefined && opacity < 1)
      }
      emissive={
        preset === "glowing"
          ? color
          : "#000000"
      }
    />
  );
};