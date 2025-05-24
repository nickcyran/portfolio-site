import { useRef, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useThree, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import CanvasLoader from '../Loader';

extend({ EffectComposer, ShaderPass, RenderPass });

const CONFIG = {
  pixelSize: 2,
  bayerSize: 12.0,
  ambientLight: 0.19,
  directionalLight: 2.75,
  modelPath: './decahedron.glb',
  bayerPath: '/portfolio-site/bayer4x4.png',
  palette: [
    [62, 49, 162], [85, 85, 85], [155, 81, 165], [138, 123, 206],
    [104, 174, 92], [121, 193, 200], [163, 229, 153], [255, 255, 255],
  ].map(([r, g, b]) => new THREE.Vector3(r / 255, g / 255, b / 255)),
};

const Model = () => {
  const gltf = useGLTF(CONFIG.modelPath);
  useMemo(() => {
    gltf.scene.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = new THREE.MeshLambertMaterial({ color: 0xffffff });
      }
    });
  }, [gltf]);
  return <primitive object={gltf.scene} />;
};

const FollowCameraLight = () => {
  const light = useRef();
  const prevPos = useRef(new THREE.Vector3());

  useFrame(({ camera }) => {
    if (!light.current) return;
    const camPos = camera.position;
    if (!camPos.equals(prevPos.current)) {
      prevPos.current.copy(camPos);
      light.current.position.copy(camPos).add(new THREE.Vector3(1.5, 1.5, 2));
    }
  });

  return (
    <directionalLight
      ref={light}
      castShadow
      intensity={CONFIG.directionalLight}
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
      shadow-camera-near={0.5}
      shadow-camera-far={50}
      shadow-camera-left={-20}
      shadow-camera-right={20}
      shadow-camera-top={20}
      shadow-camera-bottom={-20}
    />
  );
};

const DitherEffect = ({ bayerTex }) => {
  const { gl, scene, camera, size } = useThree();
  const composer = useRef();

  const shader = useMemo(() => new ShaderPass(
    new THREE.ShaderMaterial({
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
          int i1 = int(floor(clamp(idx, 0.0, float(u_paletteSize - 1))));
          int i2 = min(i1 + 1, u_paletteSize - 1);
          float dither = texture2D(tBayer, mod(gl_FragCoord.xy, bayerTileSize) / bayerTileSize).r;
          vec3 finalColor = mix(u_palette[i1], u_palette[i2], step(dither, fract(idx)));
          gl_FragColor = vec4(finalColor, src.a);
        }
      `
    })
  ), [bayerTex]);

  useEffect(() => {
    composer.current = new EffectComposer(gl);
    composer.current.addPass(new RenderPass(scene, camera));
    composer.current.addPass(shader);
  }, [gl, scene, camera, shader]);

  useEffect(() => {
    const pixelRatio = gl.getPixelRatio();
    composer.current.setSize(size.width, size.height);
    shader.uniforms.resolution.value.set(size.width * pixelRatio, size.height * pixelRatio);
  }, [gl, size, shader]);

  useFrame(() => {
    composer.current?.render();
  }, 1);

  return null;
};

const Scene = () => {
  const group = useRef();
  const bayerTex = useTexture(CONFIG.bayerPath);

  useMemo(() => {
    bayerTex.wrapS = bayerTex.wrapT = THREE.RepeatWrapping;
    bayerTex.minFilter = bayerTex.magFilter = THREE.NearestFilter;
  }, [bayerTex]);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += 0.13 * delta;
      group.current.rotation.x -= 0.04 * delta;
    }
  });

  return (
    <>
      <group ref={group}>
        <Model />
      </group>
      {bayerTex.image && <DitherEffect bayerTex={bayerTex} />}
    </>
  );
};

export default function RetroDitheredCanvas() {
  return (
    <div className="relative w-full h-auto aspect-square">
      <Canvas shadows camera={{ position: [0, 2, 18], fov: 45 }} dpr={[1, 2]}>
        <Suspense fallback={<CanvasLoader />}>
          <ambientLight intensity={CONFIG.ambientLight} />
          <FollowCameraLight />
          <OrbitControls enablePan={false} enableZoom={false} />
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
