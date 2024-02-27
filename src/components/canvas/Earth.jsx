import { Suspense, useRef, useEffect, useState  } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Preload, useGLTF, Float } from "@react-three/drei";
import { useDrag } from '@use-gesture/react';

import CanvasLoader from '../Loader';

const Earth = ({isMobile}) => {
  const earth = useGLTF('./planet/earth.glb');

  return (
    <primitive
      rotation={[-0.2, 0, -0.2]}
      object={earth.scene}
      scale={isMobile ? 2.5 : 2}
    />
  );
};

const rotationFactor = 0.002;

const Looper = ({ mesh }) => {
  useFrame(() => mesh.current.rotation.y += rotationFactor);
};

const EarthCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  const meshRef = useRef();
  const previousRotation = useRef(0);

  const bind = useDrag(({ offset: [x] }) => {
    // Calculate rotation based on drag movement
    const newRotation = x * rotationFactor;
    const deltaRotation = newRotation - previousRotation.current;

    // Accumulate rotation over time to avoid sudden jumps
    meshRef.current.rotation.y += deltaRotation;

    // Update the previous rotation for the next drag event
    previousRotation.current = newRotation;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    }

    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    }
  }, [])

  return (
    <Canvas>
      <Suspense fallback={<CanvasLoader />}>
        <Looper mesh={meshRef} />

        {/* Add in the earth */}
        <Float speed={1.5} rotationIntensity={1}>
          <mesh ref={meshRef}  {...bind()}>
            <Earth isMobile={isMobile}/>
          </mesh>
        </Float>

        {/* Add in lighting */}
        <pointLight position={[0.7, 1, 1]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[1, 1, 1]} />

      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default EarthCanvas;