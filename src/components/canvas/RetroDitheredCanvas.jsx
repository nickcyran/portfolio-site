import { useRef, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

import CanvasLoader from "../Loader";

const CONFIG = {
  pixelSize: 3.0,
  bayerSize: 12.0,
  ambientLight: 0.19,
  directionalLight: 2.7,
  modelPath: './decahedron.glb',
  bayerPath: '/portfolio-site/bayer4x4.png',
  palette: [
    [62, 49, 162], [85, 85, 85], [155, 81, 165], [138, 123, 206],
    [104, 174, 92], [121, 193, 200], [163, 229, 153], [255, 255, 255],
  ].map(([r, g, b]) => new THREE.Vector3(r / 255, g / 255, b / 255)),
};

const useCombinedShaderMaterial = (bayerTex) => useMemo(() => ({
  uniforms: {
    tDiffuse: { value: null },
    tBayer: { value: bayerTex },
    resolution: { value: new THREE.Vector2() },
    pixelSize: { value: CONFIG.pixelSize },
    bayerTileSize: { value: CONFIG.bayerSize },
    u_palette: { value: CONFIG.palette },
    u_paletteSize: { value: CONFIG.palette.length },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D tDiffuse, tBayer;
    uniform vec2 resolution;
    uniform float pixelSize, bayerTileSize;
    uniform vec3 u_palette[8];
    uniform int u_paletteSize;

    void main() {
      vec2 d = pixelSize / resolution;
      vec2 pUv = floor(vUv / d) * d + 0.5 * d;
      vec4 src = texture2D(tDiffuse, pUv);
      if (src.a < 0.01) discard;
      vec3 col = src.rgb;
      float lum = dot(col, vec3(0.299, 0.587, 0.114));
      float idx = lum * float(u_paletteSize - 1);
      int i1 = int(clamp(floor(idx), 0.0, float(u_paletteSize - 1)));
      int i2 = min(i1 + 1, u_paletteSize - 1);
      float dither = texture2D(tBayer, mod(gl_FragCoord.xy, bayerTileSize) / bayerTileSize).r;
      vec3 finalColor = mix(u_palette[i1], u_palette[i2], step(dither, fract(idx)));
      gl_FragColor = vec4(finalColor, src.a);
    }
  `,
}), [bayerTex]);

const FollowCameraDirectionalLight = () => {
  const lightRef = useRef();
  useFrame(({ camera }) => {
    lightRef.current.position.copy(camera.position).add(new THREE.Vector3(1.5, 1.5, 2));
  });

  useEffect(() => {
    const light = lightRef.current;
    light.castShadow = true;
    light.shadow.mapSize.set(512, 512);
    Object.assign(light.shadow.camera, {
      near: 0.5, far: 50, left: -20, right: 20, top: 20, bottom: -20,
    });
  }, []);

  return <directionalLight ref={lightRef} castShadow intensity={CONFIG.directionalLight} />;
};


function Model() {
  const { scene } = useGLTF(CONFIG.modelPath);
  useEffect(() => {
    scene.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = new THREE.MeshLambertMaterial({ color: 0xffffff });
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
}

function Scene() {
  const group = useRef();
  const { gl, scene, camera } = useThree();
  const bayerTex = useTexture(CONFIG.bayerPath);
  const shader = useCombinedShaderMaterial(bayerTex);
  const clock = useRef(new THREE.Clock()); 

  useEffect(() => {
    bayerTex.wrapS = bayerTex.wrapT = THREE.RepeatWrapping;
    bayerTex.minFilter = bayerTex.magFilter = THREE.NearestFilter;

    const composer = new EffectComposer(gl);
    const renderPass = new RenderPass(scene, camera);
    const shaderPass = new ShaderPass(shader);

    const updateResolution = () => {
      const width = gl.domElement.clientWidth;
      const height = gl.domElement.clientHeight;
      const dpr = window.devicePixelRatio;
      gl.setSize(width, height);
      composer.setSize(width, height);
      shaderPass.uniforms.resolution.value.set(width * dpr, height * dpr);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    updateResolution();
    window.addEventListener("resize", updateResolution);

    composer.addPass(renderPass);
    composer.addPass(shaderPass);

    const animate = () => {
      const delta = clock.current.getDelta();

      if (group.current) {
        group.current.rotation.y += 0.13 * delta;
        group.current.rotation.x -= 0.04 * delta;
      }
      composer.render(delta);
    };
    gl.setAnimationLoop(animate);

    return () => {
      window.removeEventListener("resize", updateResolution);
      gl.setAnimationLoop(null); 
    };

  }, [gl, scene, camera, shader, bayerTex]);

  return <group ref={group}><Model /></group>;
}


export default function RetroDitheredCanvas() {
  return (
    <div className='relative w-[100%] h-auto aspect-square'>
      <Canvas
        frameloop="demand"
        camera={{ position: [0, 2, 18], fov: 45 }}
        dpr={window.devicePixelRatio}
        shadows
      >
        <Suspense fallback={<CanvasLoader />}>
          <ambientLight intensity={CONFIG.ambientLight} />
          <FollowCameraDirectionalLight />
          <OrbitControls enablePan={false} enableZoom={false} />
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}