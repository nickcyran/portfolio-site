import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload, useGLTF, Float } from "@react-three/drei";
import { useMediaQuery } from 'react-responsive';

import CanvasLoader from "../Loader";

const Computers = () => {
  const computer = useGLTF("./pc/pc.glb");
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <mesh>
      <hemisphereLight intensity={3} groundColor="#00a8ff" />
      <pointLight intensity={1} position={[4.8, 3, 0.01]} />

      <primitive
        rotation={isMobile ? [0, -0.05, 0] : [0, -0.2, 0]}
        object={computer.scene}
        scale={isMobile ? 3.1 : 3.3}
        position={[0.2, -2.8, -5]}
      />
    </mesh>
  )
}

const ComputersCanvas = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [3, 0, 20], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <Float speed={3} rotationIntensity={0.01} floatIntensity={0.9}>
          <Computers />
        </Float>
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;