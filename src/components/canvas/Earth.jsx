import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload, useGLTF, Float, OrbitControls } from "@react-three/drei";



import CanvasLoader from '../Loader';

const Earth = () => {
  const earth = useGLTF('./planet/earth.glb');


  return (
    <primitive
      rotation={[-0.2, 0, -0.2]}
      object={earth.scene}
      scale={2.7}
    />
  );
};

const EarthCanvas = () => {
  return (
    <Canvas frameloop="demand">
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          autoRotate
          autoRotateSpeed={1}
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2} 
        />

        {/* Add in the earth */}
        <Float speed={1.5} rotationIntensity={1}>
          <Earth />
        </Float>

        {/* Add in lighting */}
        <pointLight position={[0.7, 1, 1]} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[1, 1, 1]} />

      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default EarthCanvas;