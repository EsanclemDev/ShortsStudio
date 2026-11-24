import React from "react";

import type { LiquidType } from "./LiquidTypes";
import { LIQUID_PRESETS } from "./LiquidPresets";

type Props = {
  type?: LiquidType;
  color?: string;
};

export const LiquidMaterial: React.FC<Props> = ({
  type = "water",
  color,
}) => {
  const preset = LIQUID_PRESETS[type];

  const liquidColor = color ?? preset.color;

  return (
    <meshStandardMaterial
      color={liquidColor}
      roughness={preset.roughness}
      metalness={preset.metalness}
      transparent={preset.opacity < 1}
      opacity={preset.opacity}
      depthWrite={preset.opacity === 1}
      emissive={liquidColor}
      emissiveIntensity={preset.emissiveIntensity}
    />
  );
};