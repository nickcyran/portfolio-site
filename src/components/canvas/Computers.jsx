import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload, useGLTF, Float } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Computers = () => {
  const computer = useGLTF("./pc/pc.glb");

  return (
    <mesh>
      <hemisphereLight intensity={3} groundColor="#00a8ff" />
      <pointLight intensity={1} position={[4.8, 3, 0.01]} />

      <primitive
        rotation={[0, -0.2, 0]}
        object={computer.scene}
        scale={3.3}
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
          <Computers/>
        </Float>
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;