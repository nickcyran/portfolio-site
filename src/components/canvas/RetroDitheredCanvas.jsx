import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

const CONFIG = {
  blur: 1.0,
  pixelSize: 1.0,
  bayerSize: 12.0,
  roughness: 0.75,
  metalness: 0.05,
  ambientLight: 0.2,
  directionalLight: 2.7,
  modelPath: "./decahedron.glb", // Ensure this path is correct
  bayerPath: "./bayer4x4.png",   // Ensure this path is correct
  palette: [
    [62, 49, 162], [85, 85, 85], [155, 81, 165], [138, 123, 206],
    [104, 174, 92], [121, 193, 200], [163, 229, 153], [255, 255, 255],
  ].map(([r, g, b]) => new THREE.Vector3(r / 255, g / 255, b / 255)),
};

const CombinedShader = {
  uniforms: {
    tDiffuse: { value: null }, tBayer: { value: null },
    resolution: { value: new THREE.Vector2() },
    pixelSize: { value: CONFIG.pixelSize }, bayerTileSize: { value: CONFIG.bayerSize },
    u_palette: { value: CONFIG.palette }, u_paletteSize: { value: CONFIG.palette.length },
    blurAmount: { value: CONFIG.blur }
  },
  vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D tDiffuse, tBayer;
    uniform vec2 resolution;
    uniform float pixelSize, bayerTileSize, blurAmount;
    uniform vec3 u_palette[8];
    uniform int u_paletteSize;

    void main() {
      vec4 src = texture2D(tDiffuse, vUv);
      if (src.a < 0.01) discard;

      vec2 pUv = vUv;
      if (pixelSize > 1.0) {
        vec2 d = pixelSize / resolution;
        pUv = floor(vUv / d) * d + 0.5 * d;
      }

      vec3 col = vec3(0.0);
      float w[9] = float[](0.0625,0.125,0.0625,0.125,0.25,0.125,0.0625,0.125,0.0625);
      if (blurAmount > 0.0) {
        int i = 0;
        for (int x = -1; x <= 1; ++x)
          for (int y = -1; y <= 1; ++y)
            col += texture2D(tDiffuse, pUv + vec2(x, y) * blurAmount / resolution).rgb * w[i++];
      } else {
        col = texture2D(tDiffuse, pUv).rgb;
      }

      float lum = dot(col, vec3(0.299, 0.587, 0.114));
      float idx = lum * float(u_paletteSize - 1);
      int i1 = clamp(int(floor(idx)), 0, u_paletteSize - 1);
      int i2 = clamp(i1 + 1, 0, u_paletteSize - 1);
      float d = texture2D(tBayer, mod(gl_FragCoord.xy, bayerTileSize) / bayerTileSize).r;
      vec3 finalColor = mix(u_palette[i1], u_palette[i2], step(d, fract(idx)));
      gl_FragColor = vec4(finalColor, src.a);
    }`
};

export default function RetroDitheredCanvas() {
  const mountRef = useRef();

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 2, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const size = el.clientWidth || 300;
    renderer.setSize(size, size);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;


    renderer.shadowMap.enabled = true;
    el.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.target.set(0, 0.5, 0);

    scene.add(new THREE.AmbientLight(0xffffff, CONFIG.ambientLight));
    const dirLight = new THREE.DirectionalLight(0xffffff, CONFIG.directionalLight);
    dirLight.position.set(1.5, 1.5, 2);

    // 2. Enable shadow casting for the directional light
    dirLight.castShadow = true;

    // Optional: Configure shadow properties for the light
    dirLight.shadow.mapSize.width = 1024; // default is 512
    dirLight.shadow.mapSize.height = 1024; // default is 512
    dirLight.shadow.camera.near = 0.5; // default
    dirLight.shadow.camera.far = 50; // default

    const shadowCamSize = 60;
    dirLight.shadow.camera.left = -shadowCamSize;
    dirLight.shadow.camera.right = shadowCamSize;
    dirLight.shadow.camera.top = shadowCamSize;
    dirLight.shadow.camera.bottom = -shadowCamSize;

    camera.add(dirLight); // Light moves with the camera
    scene.add(camera); // Add camera to scene (which now contains the light)


    const pivot = new THREE.Group();
    pivot.position.set(0, 0.5, 0);
    scene.add(pivot);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const shaderPass = new ShaderPass(CombinedShader);
    const res = size * window.devicePixelRatio;
    shaderPass.uniforms.resolution.value.set(res, res);
    composer.addPass(shaderPass);

    new THREE.TextureLoader().load(CONFIG.bayerPath, (tex) => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.minFilter = tex.magFilter = THREE.NearestFilter;
      shaderPass.uniforms.tBayer.value = tex;
    });

    new GLTFLoader().load(CONFIG.modelPath, (gltf) => {
      gltf.scene.traverse(child => {
        if (child.isMesh) {
          // 3. Enable shadow casting and receiving for each mesh
          child.castShadow = true;
          child.receiveShadow = true;

          child.material = new THREE.MeshStandardMaterial({
            color: 0xffffff, // Ensure the material can show shadows
            roughness: CONFIG.roughness,
            metalness: CONFIG.metalness
          });
        }
      });
      pivot.add(gltf.scene);
    });

    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      pivot.rotation.y = t * 0.2;
      pivot.rotation.x = t * -0.05;
      controls.update();
      composer.render();
    };
    animate();

    const onResize = () => {
      const s = el.clientWidth;
      renderer.setSize(s, s);
      camera.aspect = 1; // Assuming square canvas, update if not
      camera.updateProjectionMatrix();
      const r = s * window.devicePixelRatio;
      shaderPass.uniforms.resolution.value.set(r, r);
      composer.setSize(r, r); // composer also needs to be resized
    };
    window.addEventListener("resize", onResize);
    // Initial call to set size correctly
    onResize();

    return () => {
      window.removeEventListener("resize", onResize);
      if (el && renderer.domElement) { // Check if el and domElement exist
        el.removeChild(renderer.domElement);
      }
      // Dispose of Three.js objects to free up resources
      scene.traverse(object => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      renderer.dispose();
      composer.dispose(); // If composer has a dispose method
    };
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  return <div ref={mountRef} style={{ width: "100%", height: "100%", cursor: "grab" }} />;
}