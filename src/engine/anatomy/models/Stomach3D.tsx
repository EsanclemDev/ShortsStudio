import React, { useMemo, useEffect } from "react";
import * as THREE from "three";

import type { OrganModelProps } from "../AnatomyTypes";
import { AnatomyMaterial } from "../AnatomyMaterial";

export const Stomach3D: React.FC<OrganModelProps> = ({
  color = "#d98d98",
  activity = 0,
}) => {
  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 48, 32);

    const positions = geo.attributes.position;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);

      const width = 0.75 + y * 0.15;

      positions.setXYZ(
        i,
        x * width + y * y * 0.18,
        y * 0.85,
        z * 0.55,
      );
    }

    geo.computeVertexNormals();
    geo.computeBoundingSphere();

    return geo;
  }, []);

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  const esophagus = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.25, 2.25, 0),
        new THREE.Vector3(-0.25, 1.85, 0),
        new THREE.Vector3(-0.1, 1.5, 0),
      ]),
    [],
  );

  const outlet = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.35, 0.55, 0),
        new THREE.Vector3(-0.65, 0.35, 0),
        new THREE.Vector3(-1, 0.5, 0),
        new THREE.Vector3(-1.15, 0.35, 0),
      ]),
    [],
  );

  return (
    <group>
      <mesh
        geometry={geometry}
        position={[0.25, 1, 0]}
        rotation={[0, 0, 0.45]}
        castShadow
      >
        <AnatomyMaterial
          color={color}
          activity={activity}
        />
      </mesh>

      {/* Esophagus */}
      <mesh>
        <tubeGeometry
          args={[esophagus, 24, 0.17, 16, false]}
        />
        <AnatomyMaterial color="#ca8492" />
      </mesh>

      {/* Pylorus and duodenum */}
      <mesh>
        <tubeGeometry
          args={[outlet, 24, 0.18, 16, false]}
        />
        <AnatomyMaterial color="#d7a09a" />
      </mesh>
    </group>
  );
};