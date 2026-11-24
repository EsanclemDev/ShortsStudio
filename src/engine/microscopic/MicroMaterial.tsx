import React from "react";

type Props = {
  color: string;
  opacity?: number;
  activity?: number;
  roughness?: number;
};

export const MicroMaterial: React.FC<Props> = ({
  color,
  opacity = 1,
  activity = 0,
  roughness = 0.35,
}) => {
  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      metalness={0.02}
      transparent={opacity < 1}
      opacity={opacity}
      depthWrite={opacity >= 1}
      emissive={color}
      emissiveIntensity={0.08 + activity * 0.3}
    />
  );
};