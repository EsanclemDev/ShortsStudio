import React, { useMemo, useEffect } from "react";
import * as THREE from "three";

import type { OrganModelProps } from "../AnatomyTypes";
import { AnatomyMaterial } from "../AnatomyMaterial";

const createHemisphere = (side: number) => {
  const geometry = new THREE.SphereGeometry(
    1,
    128,
    96,
  );

  const positions = geometry.attributes.position;

  const colors = new Float32Array(
    positions.count * 3,
  );

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);

    // Irregular organic surface
    const warpX =
      x +
      Math.sin(y * 5 + z * 3) * 0.14;

    const warpY =
      y +
      Math.sin(z * 6 + x * 4) * 0.13;

    const warpZ =
      z +
      Math.cos(x * 5 - y * 4) * 0.12;

    // Cortical folding patterns
    const patternA = Math.sin(
      warpX * 13 +
      warpY * 9 +
      Math.sin(warpZ * 8) * 2.5 +
      side * 0.4,
    );

    const patternB = Math.sin(
      warpY * 15 -
      warpZ * 11 +
      Math.sin(warpX * 7) * 2,
    );

    const patternC = Math.sin(
      warpZ * 12 +
      warpX * 8 +
      Math.cos(warpY * 9) * 1.8,
    );

    const foldPattern =
      patternA * 0.5 +
      patternB * 0.3 +
      patternC * 0.2;

    // Narrow grooves between rounded folds
    const groove = Math.exp(
      -Math.pow(foldPattern * 5, 2),
    );

    const foldHeight =
      0.035 - groove * 0.085;

    const organicVariation =
      Math.sin(x * 4 + z * 3) *
      Math.cos(y * 5) *
      0.025;

    const medial =
      THREE.MathUtils.smoothstep(
        x * side,
        -0.9,
        -0.15,
      );

    const displacement =
      1 +
      (foldHeight + organicVariation) *
        (0.3 + medial * 0.7);

    // Main hemisphere proportions
    let px = x * 0.57 * displacement;
    let py = y * 0.77 * displacement;
    let pz = z * 1.02 * displacement;

    // Frontal and occipital shape
    px *= 1 + z * 0.09;

    py *= 1 + z * 0.08;

    // Slightly flatter inferior surface
    if (py < -0.35) {
      py =
        -0.35 +
        (py + 0.35) * 0.65;
    }

    // Medial surface and central fissure
    px += side * 0.49;

    if (side === 1) {
      px = Math.max(0.035, px);
    } else {
      px = Math.min(-0.035, px);
    }

    py += 1.13;

    positions.setXYZ(i, px, py, pz);

    // Darker sulci, lighter gyri
    const shade =
      0.95 -
      groove * 0.26 +
      organicVariation;

    colors[i * 3] = shade;

    colors[i * 3 + 1] =
      shade * (0.95 + groove * 0.03);

    colors[i * 3 + 2] =
      shade * (0.97 + groove * 0.02);
  }

  geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(colors, 3),
  );

  positions.needsUpdate = true;

  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();

  return geometry;
};

const createCerebellum = () => {
  const geometry = new THREE.SphereGeometry(
    1,
    80,
    64,
  );

  const positions = geometry.attributes.position;

  const colors = new Float32Array(
    positions.count * 3,
  );

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);

    const pattern = Math.sin(
      y * 29 +
      Math.sin(x * 5) * 1.8 +
      Math.cos(z * 4) * 1.2,
    );

    const groove = Math.exp(
      -Math.pow(pattern * 4, 2),
    );

    const displacement =
      1.025 - groove * 0.065;

    positions.setXYZ(
      i,
      x * 0.65 * displacement,
      y * 0.35 * displacement,
      z * 0.49 * displacement,
    );

    const shade = 0.95 - groove * 0.25;

    colors[i * 3] = shade;
    colors[i * 3 + 1] = shade;
    colors[i * 3 + 2] = shade;
  }

  geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(colors, 3),
  );

  positions.needsUpdate = true;

  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();

  return geometry;
};

export const Brain3D: React.FC<OrganModelProps> = ({
  color = "#dc91aa",
  activity = 0,
}) => {
  const leftHemisphere = useMemo(
    () => createHemisphere(-1),
    [],
  );

  const rightHemisphere = useMemo(
    () => createHemisphere(1),
    [],
  );

  const cerebellum = useMemo(
    () => createCerebellum(),
    [],
  );

  const brainstemCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.12, -0.23),
      new THREE.Vector3(0, 0.28, -0.28),
      new THREE.Vector3(0, 0.46, -0.34),
      new THREE.Vector3(0, 0.65, -0.38),
      new THREE.Vector3(0, 0.82, -0.28),
    ]);
  }, []);

  useEffect(() => {
    return () => {
      leftHemisphere.dispose();
      rightHemisphere.dispose();
      cerebellum.dispose();
    };
  }, [
    leftHemisphere,
    rightHemisphere,
    cerebellum,
  ]);

  const emissiveIntensity =
    0.025 + activity * 0.18;

  return (
    <group>
      {/* Left cerebral hemisphere */}
      <mesh
        geometry={leftHemisphere}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={color}
          vertexColors
          roughness={0.48}
          metalness={0.01}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Right cerebral hemisphere */}
      <mesh
        geometry={rightHemisphere}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={color}
          vertexColors
          roughness={0.48}
          metalness={0.01}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Cerebellum */}
      <mesh
        geometry={cerebellum}
        position={[0, 0.48, -0.62]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#bd7894"
          vertexColors
          roughness={0.58}
          metalness={0.01}
          emissive="#bd7894"
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Brainstem */}
      <mesh castShadow>
        <tubeGeometry
          args={[
            brainstemCurve,
            32,
            0.135,
            16,
            false,
          ]}
        />

        <AnatomyMaterial
          color="#bb8196"
          activity={activity}
          roughness={0.6}
        />
      </mesh>

      {/* Pons */}
      <mesh
        position={[0, 0.48, -0.19]}
        scale={[0.23, 0.2, 0.22]}
      >
        <sphereGeometry args={[1, 32, 24]} />

        <AnatomyMaterial
          color="#c68b9d"
          activity={activity}
        />
      </mesh>

      {/* Medulla */}
      <mesh
        position={[0, 0.18, -0.23]}
        scale={[0.115, 0.18, 0.115]}
      >
        <sphereGeometry args={[1, 24, 16]} />

        <AnatomyMaterial
          color="#c68b9d"
          activity={activity}
        />
      </mesh>
    </group>
  );
};