import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
    Lensflare,
    LensflareElement,
} from "three/examples/jsm/objects/Lensflare.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import type { RankedTask, Subtask } from "../../../types/task";

interface PlanetMeshData {
  task: RankedTask;
  mesh: THREE.Mesh;
  pivot: THREE.Object3D;
  speed: number;
  moons: MoonMeshData[];
  orbit: THREE.Mesh;
  label: HTMLDivElement | null;
}

interface MoonMeshData {
  subtask: Subtask;
  mesh: THREE.Mesh;
  pivot: THREE.Object3D;
  speed: number;
  tiltAxis: THREE.Vector3;
  tiltSpeed: number;
  label: HTMLDivElement | null;
}

export interface SceneData {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  composer: EffectComposer;
  controls: OrbitControls;
  sun: THREE.Mesh;
  planets: PlanetMeshData[];
  orbitRings: THREE.Mesh[];
  bloomPass: UnrealBloomPass;
  animationId: number;
  isPaused: boolean;
  animationSpeed: number;
  showLabels: boolean;
  showMoonLabels: boolean;
  showOrbits: boolean;
  showMoons: boolean;
  isBloomManual: boolean;
  manualBloomStrength: number;
  followingPlanet: PlanetMeshData | null;
  followOffset: THREE.Vector3;
  lastPlanetPosition: THREE.Vector3;
}

export function useThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneDataRef = useRef<SceneData | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000814);
    scene.fog = new THREE.Fog(0x000814, 200, 350);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 30, 70);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.3;
    controls.zoomSpeed = 0.8;
    controls.panSpeed = 0.5;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.enableRotate = true;
    controls.minDistance = 8;
    controls.maxDistance = 200;
    controls.target.set(0, 0, 0);

    const loader = new THREE.TextureLoader();

    // Lighting
    const ambientLight = new THREE.AmbientLight(
      new THREE.Color(0.13, 0.13, 0.13),
      0.5,
    );
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(
      new THREE.Color(1.0, 1.0, 1.0),
      10.0,
      1000,
      0.5,
    );
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    const fillLight = new THREE.PointLight(
      new THREE.Color(0.2, 0.4, 1.0),
      2.0,
      100,
      1,
    );
    fillLight.position.set(50, 50, -100);
    scene.add(fillLight);

    // Starfield
    const starTexture = loader.load("/textures/8k_stars.jpg");
    const skyTexture = loader.load("/textures/stars.jpg");
    const starGeo = new THREE.SphereGeometry(200, 64, 64);
    const starMat = new THREE.MeshBasicMaterial({
      map: starTexture,
      side: THREE.BackSide,
      toneMapped: false,
      color: new THREE.Color(1.2, 1.2, 1.2),
    });
    const starfield = new THREE.Mesh(starGeo, starMat);
    scene.add(starfield);

    const skyGeo = new THREE.SphereGeometry(190, 64, 64);
    const skyMat = new THREE.MeshBasicMaterial({
      map: skyTexture,
      side: THREE.BackSide,
      toneMapped: false,
      transparent: true,
      opacity: 0.3,
      color: new THREE.Color(0.8, 0.9, 1.0),
    });
    const skyfield = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skyfield);

    // Sun
    const sunMaterial = new THREE.MeshBasicMaterial({
      map: loader.load("/textures/sun.jpg"),
      toneMapped: false,
      color: new THREE.Color(1.2, 1.1, 0.9),
    });
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(5, 64, 64),
      sunMaterial,
    );
    scene.add(sun);

    // Lens flare
    const textureFlare0 = loader.load("/textures/lensflare0.png");
    const textureFlare2 = loader.load("/textures/lensflare2.png");
    const lensflare = new Lensflare();
    lensflare.addElement(
      new LensflareElement(textureFlare0, 512, 0, new THREE.Color(1, 0.9, 0.8)),
    );
    lensflare.addElement(
      new LensflareElement(textureFlare2, 128, 0.2, new THREE.Color(1, 1, 0.6)),
    );
    lensflare.addElement(
      new LensflareElement(
        textureFlare2,
        64,
        0.4,
        new THREE.Color(0.8, 0.8, 1),
      ),
    );
    lensflare.addElement(
      new LensflareElement(
        textureFlare2,
        32,
        0.6,
        new THREE.Color(1, 0.8, 0.6),
      ),
    );
    sun.add(lensflare);

    // Distant stars (particles)
    const starCount = 1500;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      const radius = 150 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i + 2] = radius * Math.cos(phi);
    }
    const starParticleGeo = new THREE.BufferGeometry();
    starParticleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3),
    );
    const starParticleMat = new THREE.PointsMaterial({
      color: new THREE.Color(1.0, 1.0, 1.0),
      size: 0.7,
      transparent: true,
      opacity: 0.9,
    });
    const distantStars = new THREE.Points(starParticleGeo, starParticleMat);
    scene.add(distantStars);

    // Post-processing (Bloom)
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.5,
      0.6,
      0.05,
    );
    bloomPass.strength = 0.5;
    bloomPass.radius = 0.6;
    bloomPass.threshold = 0.05;
    composer.addPass(bloomPass);
    composer.addPass(new OutputPass());

    // Store scene data
    sceneDataRef.current = {
      scene,
      camera,
      renderer,
      composer,
      controls,
      sun,
      planets: [],
      orbitRings: [],
      bloomPass,
      animationId: 0,
      isPaused: false,
      animationSpeed: 0.4,
      showLabels: false,
      showMoonLabels: false,
      showOrbits: true,
      showMoons: true,
      isBloomManual: false,
      manualBloomStrength: 0.5,
      followingPlanet: null,
      followOffset: new THREE.Vector3(10, 5, 10),
      lastPlanetPosition: new THREE.Vector3(),
    };

    // Resize handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", onResize);
      const sd = sceneDataRef.current;
      if (sd) {
        cancelAnimationFrame(sd.animationId);
        sd.planets.forEach((p) => {
          if (p.label) p.label.remove();
          p.moons.forEach((m) => {
            if (m.label) m.label.remove();
          });
        });
        renderer.dispose();
        container?.removeChild(renderer.domElement);
      }
    };
  }, []);

  return { sceneDataRef, containerRef };
}
