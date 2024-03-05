import { Suspense, useRef} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Preload, useGLTF, Float, OrbitControls} from "@react-three/drei";

import { Vector3 } from 'three';

import CanvasLoader from '../Loader';

const Earth = () => {
  const earth = useGLTF('./planet/earth.glb');

  return (
    <primitive
      rotation={[-0.2, 0, -0.2]}
      object={earth.scene}
      scale={2.8}
      position={[0, -0.03, 0]}
    />
  );
};

const FollowCameraDirectionalLight = () => {
  const lightRef = useRef();

  useFrame(({ camera }) => {
    const offset = new Vector3(1, 0.5, 0).multiplyScalar(4);

    lightRef.current.position.copy(camera.position).add(offset);
  });

  return <directionalLight ref={lightRef} intensity={0.8} />;
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
        <ambientLight intensity={0.6}/>
        <FollowCameraDirectionalLight />

      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default EarthCanvas;