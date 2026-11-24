import React, { useMemo, useEffect } from "react";
import * as THREE from "three";

import type { MicroModelProps } from "../MicroTypes";
import { MicroMaterial } from "../MicroMaterial";

export const RedBloodCell3D: React.FC<MicroModelProps> = ({
  color = "#dc2626",
  activity = 0,
}) => {
  const geometry = useMemo(() => {
    const profile: THREE.Vector2[] = [];

    const segments = 40;

    const thickness = (r: number) =>
      (0.09 + 0.4 * r * r) *
      Math.sqrt(Math.max(0, 1 - r * r));

    // Lower surface
    for (let i = 0; i <= segments; i++) {
      const r = i / segments;

      profile.push(
        new THREE.Vector2(r, -thickness(r)),
      );
    }

    // Upper surface
    for (let i = segments - 1; i >= 0; i--) {
      const r = i / segments;

      profile.push(
        new THREE.Vector2(r, thickness(r)),
      );
    }

    const geo = new THREE.LatheGeometry(
      profile,
      64,
    );

    geo.computeVertexNormals();

    return geo;
  }, []);

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  return (
    <mesh
      geometry={geometry}
      rotation={[Math.PI / 3, 0, 0]}
    >
      <MicroMaterial
        color={color}
        activity={activity}
        roughness={0.4}
      />
    </mesh>
  );
};