import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

const CONFIG = {
  pixelSize: 3.0,
  bayerSize: 12.0,
  ambientLight: 0.2,
  directionalLight: 2.7,
  modelPath: "./decahedron.glb",
  bayerPath: "/portfolio-site/bayer4x4.png",
  palette: [
    [62, 49, 162], [85, 85, 85], [155, 81, 165], [138, 123, 206],
    [104, 174, 92], [121, 193, 200], [163, 229, 153], [255, 255, 255],
  ].map(([r, g, b]) => new THREE.Vector3(r / 255, g / 255, b / 255)),
};

const CombinedShader = {
  uniforms: {
    tDiffuse: { value: null },
    tBayer: { value: null },
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
    }`,
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
    }`,
};

export default function RetroDitheredCanvas() {
  const mountRef = useRef();

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 2, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    const size = el.clientWidth;
    const dpr = window.devicePixelRatio;
    renderer.setSize(size, size);
    renderer.setPixelRatio(dpr);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    el.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = controls.enablePan = false;
    controls.target.set(0, 0.5, 0);

    scene.add(new THREE.AmbientLight(0xffffff, CONFIG.ambientLight));
    const dirLight = new THREE.DirectionalLight(0xffffff, CONFIG.directionalLight);
    dirLight.position.set(1.5, 1.5, 2);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(1024, 1024);
    Object.assign(dirLight.shadow.camera, {
      near: 0.5, far: 50,
      left: -20, right: 20, top: 20, bottom: -20,
    });
    camera.add(dirLight);
    scene.add(camera);

    const pivot = new THREE.Group();
    pivot.position.set(0, 0.5, 0);
    scene.add(pivot);

    const composer = new EffectComposer(renderer);
    const shaderPass = new ShaderPass(CombinedShader);
    const resolution = size * dpr;
    shaderPass.uniforms.resolution.value.set(resolution, resolution);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(shaderPass);

    new THREE.TextureLoader().load(CONFIG.bayerPath, tex => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.minFilter = tex.magFilter = THREE.NearestFilter;
      shaderPass.uniforms.tBayer.value = tex;
    });

    new GLTFLoader().load(CONFIG.modelPath, gltf => {
      gltf.scene.traverse(child => {
        if (child.isMesh) {
          child.castShadow = child.receiveShadow = true;
          child.material = new THREE.MeshLambertMaterial({ color: 0xffffff });
        }
      });
      pivot.add(gltf.scene);
    });

    const clock = new THREE.Clock();
    let id;
    const animate = () => {
      id = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      pivot.rotation.y = t * 0.2;
      pivot.rotation.x = t * -0.05;
      controls.update();
      composer.render();
    };
    animate();

    const onResize = () => {
      const s = el.clientWidth;
      const res = s * dpr;
      renderer.setSize(s, s);
      composer.setSize(s, s);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
      shaderPass.uniforms.resolution.value.set(res, res);
    };
    window.addEventListener("resize", onResize);
    onResize();

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", onResize);
      scene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) Array.isArray(obj.material)
          ? obj.material.forEach(m => m.dispose())
          : obj.material.dispose();
      });
      shaderPass.uniforms.tBayer.value?.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100%", cursor: "grab" }} />;
}
