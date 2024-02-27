import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload, useGLTF, Float } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Computers = ({ isMobile }) => {
  const computer = useGLTF("./pc/pc.glb");

  return (
    <mesh>
      <hemisphereLight intensity={3} groundColor="#00a8ff" />
      <pointLight intensity={1} position={[4.8, 3, 0.01]} />

      <primitive
        rotation={[0, -0.3, 0]}
        object={computer.scene}
        scale={isMobile ? 2.3 : 3.2}
        position={isMobile ? [0.6, -1, -2.2] : [4, -2.5, -2]}
      />
    </mesh>
  )
}

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 500px)');

    // Set the isMobile variable to match the device
    setIsMobile(mediaQuery.matches);

    // Callback function if there are changes made (say screen size)
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    }

    // Add the callback fn and listen for changes in the media query
    mediaQuery.addEventListener('change', handleMediaQueryChange);

    // Remove the listener when the componenent isnt mounted
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    }
  }, [])

  return (
    <Canvas
      shadows
      camera={{ position: [3, 0, 20], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <Float speed={3} rotationIntensity={0.01} floatIntensity={0.6}>
          <Computers isMobile={isMobile} />
        </Float>
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;