import { useEffect, useRef, useCallback, useState } from "react";
import { useToggle, useLocalStorageState, useRequest } from "ahooks";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import {
  Lensflare,
  LensflareElement,
} from "three/examples/jsm/objects/Lensflare.js";
import type {
  Task,
  RankedTask,
  BullseyeRank,
  Priority,
  Complexity,
  Subtask,
} from "../types/task";
import { rankTasks, groupByOrbit } from "../utils/ranking";
import {
  tasks as tasksApi,
  subtasks as subtasksApi,
  type LF,
} from "../services/lf";
import { getRandomColor } from "../utils/colors";

/* ───────────── orbit distances (1-7) ───────────── */
const ORBIT_DISTANCES: Record<BullseyeRank, number> = {
  1: 25,
  2: 35,
  3: 45,
  4: 55,
  5: 65,
  6: 75,
  7: 85,
};

const ORBIT_LABELS: Record<BullseyeRank, string> = {
  1: "Critical",
  2: "Very High",
  3: "High",
  4: "Medium",
  5: "Low",
  6: "Very Low",
  7: "Minimal",
};

/* planet size based on complexity */
function planetSize(complexity: Complexity): number {
  return 0.6 + complexity * 0.3;
}

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

export default function SolarSystem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneDataRef = useRef<{
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
  } | null>(null);

  const { data: { data: tasks = [] } = {}, mutate: setTasks } = useRequest(
    tasksApi.tasksControllerFindAll,
    {
      defaultParams: [{ limit: 1000, offset: 0 }],
      onSuccess: ({data}) => {
        console.log("Tasks loaded:", data.length);
      },
    },
  );

  const [selectedTask, setSelectedTask] = useState<RankedTask | null>(null);

  // UI toggles with ahooks - keeping setters for backward compatibility
  const [showCreateModal, { set: setShowCreateModal }] = useToggle(false);
  const [showTaskPanel, { set: setShowTaskPanel }] = useToggle(false);
  const [controlsCollapsed, { set: setControlsCollapsed }] = useToggle(true);
  const [taskListCollapsed, { set: setTaskListCollapsed }] = useToggle(true);
  const [uiHidden, { toggle: toggleUI, set: setUiHidden }] = useToggle(false);
  const [editMode, { set: setEditMode }] = useToggle(false);

  // Persistent UI preferences with localStorage
  const [showLabelsState, setShowLabelsState] = useLocalStorageState(
    "solarSystem.showLabels",
    {
      defaultValue: false,
    },
  );
  const [showMoonLabelsState, setShowMoonLabelsState] = useLocalStorageState(
    "solarSystem.showMoonLabels",
    {
      defaultValue: false,
    },
  );
  const [showOrbitsState, setShowOrbitsState] = useLocalStorageState(
    "solarSystem.showOrbits",
    {
      defaultValue: true,
    },
  );
  const [showMoonsState, setShowMoonsState] = useLocalStorageState(
    "solarSystem.showMoons",
    {
      defaultValue: true,
    },
  );
  const [bloomManualState, setBloomManualState] = useLocalStorageState(
    "solarSystem.bloomManual",
    {
      defaultValue: false,
    },
  );

  const [speedDisplay, setSpeedDisplay] = useState("0.4x Slow");

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPriority, setFormPriority] = useState<Priority>("medium");
  const [formComplexity, setFormComplexity] = useState<Complexity>(3);
  const [formDueDate, setFormDueDate] = useState("");
  const [formColor, setFormColor] = useState(() => getRandomColor());
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  // Rebuild planets whenever tasks change
  useEffect(() => {
    rebuildPlanets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);

  /* ───────── build / rebuild planets from tasks ───────── */
  const rebuildPlanets = useCallback(() => {
    const sd = sceneDataRef.current;
    if (!sd) return;

    // Remove existing planets
    sd.planets.forEach((p) => {
      sd.scene.remove(p.pivot);
      if (p.label) p.label.remove();
      p.moons.forEach((m) => {
        if (m.label) m.label.remove();
      });
    });
    sd.orbitRings.forEach((o) => sd.scene.remove(o));
    sd.planets = [];
    sd.orbitRings = [];

    // Create orbit rings for all 7 levels
    for (let rank = 1; rank <= 7; rank++) {
      const dist = ORBIT_DISTANCES[rank as BullseyeRank];
      const orbitGeo = new THREE.RingGeometry(dist - 0.05, dist + 0.05, 128);
      const orbitMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0.3, 0.5, 0.7),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.06,
      });
      const orbit = new THREE.Mesh(orbitGeo, orbitMat);
      orbit.rotation.x = Math.PI / 2;
      orbit.position.y = -0.01;
      sd.scene.add(orbit);
      sd.orbitRings.push(orbit);
    }

    const ranked = rankTasks(tasks.filter((t) => !t.completed));
    const groups = groupByOrbit(ranked);

    groups.forEach((tasksInOrbit, rank) => {
      const dist = ORBIT_DISTANCES[rank];
      tasksInOrbit.forEach((task, idx) => {
        const angleOffset =
          tasksInOrbit.length > 1
            ? (idx / tasksInOrbit.length) * Math.PI * 2
            : Math.random() * Math.PI * 2;

        const size = planetSize(task.complexity);
        const color = new THREE.Color(task.color);

        const geo = new THREE.SphereGeometry(size, 64, 64);
        const mat = new THREE.MeshStandardMaterial({
          color,
          metalness: 0.15,
          roughness: 0.7,
          emissive: color.clone().multiplyScalar(0.15),
          emissiveIntensity: 0.3,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const pivot = new THREE.Object3D();
        pivot.add(mesh);
        mesh.position.x = dist;
        pivot.rotation.y = angleOffset;
        sd.scene.add(pivot);

        // Orbit line for this planet
        const planetOrbitGeo = new THREE.RingGeometry(
          dist - 0.04,
          dist + 0.04,
          128,
        );
        const planetOrbitMat = new THREE.MeshBasicMaterial({
          color: color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.12,
        });
        const planetOrbit = new THREE.Mesh(planetOrbitGeo, planetOrbitMat);
        planetOrbit.rotation.x = Math.PI / 2;
        sd.scene.add(planetOrbit);

        // Create label
        const labelDiv = document.createElement("div");
        labelDiv.className = "planet-label";
        labelDiv.textContent = task.title;
        labelDiv.style.display = sd.showLabels ? "block" : "none";
        document.body.appendChild(labelDiv);

        // Create moons (subtasks) — 3D electron-style orbits
        const moons: MoonMeshData[] = [];
        task.subtasks.forEach((sub, mi) => {
          // Seed-based pseudo-random per subtask for deterministic variation
          const seed = sub.id
            .split("")
            .reduce((a, c) => a + c.charCodeAt(0), 0);
          const seededRand = (offset: number) => {
            const x = Math.sin(seed * 9301 + offset * 49297) * 49297;
            return x - Math.floor(x);
          };

          // Varied moon sizes: 0.12 – 0.30
          const moonSize = 0.12 + seededRand(1) * 0.18;
          // Varied distances from planet
          const moonDist = 1.8 + mi * 0.9 + seededRand(2) * 0.4;
          const moonColor = sub.completed
            ? new THREE.Color(0.3, 0.8, 0.3)
            : new THREE.Color(
                0.5 + seededRand(3) * 0.3,
                0.5 + seededRand(4) * 0.3,
                0.5 + seededRand(5) * 0.3,
              );

          const moonGeo = new THREE.SphereGeometry(moonSize, 32, 32);
          const moonMat = new THREE.MeshStandardMaterial({
            color: moonColor,
            roughness: 0.7 + seededRand(6) * 0.25,
            metalness: 0.05 + seededRand(7) * 0.15,
          });
          const moonMesh = new THREE.Mesh(moonGeo, moonMat);

          // 3D orbital tilt — like electrons around a nucleus
          const moonPivot = new THREE.Object3D();
          moonPivot.add(moonMesh);
          moonMesh.position.x = moonDist;

          // Each moon gets a random orbital inclination (different plane)
          const inclination = seededRand(8) * Math.PI; // 0 to π
          const azimuth = seededRand(9) * Math.PI * 2; // 0 to 2π
          moonPivot.rotation.x = inclination * Math.cos(azimuth);
          moonPivot.rotation.z = inclination * Math.sin(azimuth);
          // Spread initial phase so moons don't overlap
          moonPivot.rotation.y =
            (mi / Math.max(task.subtasks.length, 1)) * Math.PI * 2;
          mesh.add(moonPivot);

          // Tilt axis for continuous 3D precession-like rotation
          const tiltAxis = new THREE.Vector3(
            Math.sin(azimuth) * Math.sin(inclination),
            Math.cos(inclination),
            Math.cos(azimuth) * Math.sin(inclination),
          ).normalize();

          const moonLabel = document.createElement("div");
          moonLabel.className = "moon-label";
          moonLabel.textContent = sub.title;
          moonLabel.style.display = "none";
          document.body.appendChild(moonLabel);

          // Varied speed: 0.015 – 0.045
          const moonSpeed = 0.015 + seededRand(10) * 0.03;

          moons.push({
            subtask: sub,
            mesh: moonMesh,
            pivot: moonPivot,
            speed: moonSpeed,
            tiltAxis,
            tiltSpeed: 0.003 + seededRand(11) * 0.007,
            label: moonLabel,
          });
        });

        // Speed: closer orbits move faster
        const speed = 0.0005 + (8 - rank) * 0.00015;

        sd.planets.push({
          task,
          mesh,
          pivot,
          speed,
          moons,
          orbit: planetOrbit,
          label: labelDiv,
        });
      });
    });
  }, [tasks]);

  /* ───────── init Three.js scene ───────── */
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000814);
    scene.fog = new THREE.Fog(0x000814, 180, 250);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

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

    // Post-processing
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

    camera.position.set(0, 30, 70);

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

    // Build initial planets
    rebuildPlanets();

    // Raycaster for clicking
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.closest(".controls") ||
        target.closest(".celestial-panel") ||
        target.closest(".info") ||
        target.closest(".planet-info-card") ||
        target.closest(".modal-overlay") ||
        target.closest(".task-panel")
      ) {
        return;
      }

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const sd = sceneDataRef.current;
      if (!sd) return;

      const meshes = sd.planets.map((p) => p.mesh);
      meshes.push(sun);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit === sun) return;
        const planetData = sd.planets.find((p) => p.mesh === hit);
        if (planetData) {
          setSelectedTask(planetData.task);
          setShowTaskPanel(true);
          setEditMode(false);
        }
      } else {
        setShowTaskPanel(false);
        setSelectedTask(null);
      }
    };

    window.addEventListener("click", onClick);

    // Animation loop
    // frame counter for animations
    const animate = () => {
      const sd = sceneDataRef.current;
      if (!sd) return;
      sd.animationId = requestAnimationFrame(animate);

      if (!sd.isPaused) {
        const spd = sd.animationSpeed === 0 ? 0.0001 : sd.animationSpeed;
        sun.rotation.y += 0.002 * spd;

        sd.planets.forEach((p) => {
          p.pivot.rotation.y += p.speed * spd;
          p.mesh.rotation.y += 0.01 * spd;
          p.moons.forEach((m) => {
            // Rotate around the tilted orbital axis for 3D electron effect
            m.pivot.rotateOnAxis(m.tiltAxis, m.speed * spd);
            m.mesh.rotation.y += 0.02 * spd;
          });
        });

        distantStars.rotation.y += 0.0001 * spd;
      }

      // Update planet labels
      if (sd.showLabels) {
        sd.planets.forEach((p) => {
          if (!p.label) return;
          const vec = new THREE.Vector3();
          p.mesh.getWorldPosition(vec);
          vec.project(camera);
          const x = (vec.x * 0.5 + 0.5) * window.innerWidth;
          const y = (vec.y * -0.5 + 0.5) * window.innerHeight;
          p.label.style.left = x + "px";
          p.label.style.top = y - 20 + "px";
          p.label.style.display = vec.z > 1 ? "none" : "block";
        });
      }

      // Update moon labels
      if (sd.showMoonLabels) {
        sd.planets.forEach((p) => {
          p.moons.forEach((m) => {
            if (!m.label) return;
            const vec = new THREE.Vector3();
            m.mesh.getWorldPosition(vec);
            vec.project(camera);
            const x = (vec.x * 0.5 + 0.5) * window.innerWidth;
            const y = (vec.y * -0.5 + 0.5) * window.innerHeight;
            m.label.style.left = x + "px";
            m.label.style.top = y - 12 + "px";
            m.label.style.display = vec.z > 1 ? "none" : "block";
          });
        });
      }

      // Follow planet
      if (sd.followingPlanet) {
        const planetPos = new THREE.Vector3();
        sd.followingPlanet.mesh.getWorldPosition(planetPos);
        const movement = planetPos.clone().sub(sd.lastPlanetPosition);
        if (!sd.lastPlanetPosition.equals(new THREE.Vector3(0, 0, 0))) {
          camera.position.add(movement);
          controls.target.add(movement);
        } else {
          camera.position.copy(planetPos.clone().add(sd.followOffset));
          controls.target.copy(planetPos);
        }
        sd.lastPlanetPosition.copy(planetPos);
      }

      controls.update();

      // Dynamic bloom (only in auto mode)
      if (!sd.isBloomManual) {
        const distToSun = camera.position.distanceTo(sun.position);
        const normalized = Math.max(0, Math.min(1, (distToSun - 10) / 90));
        bloomPass.strength = 0.5 + (1 - normalized) * 1.0;
        bloomPass.radius = 0.6 + (1 - normalized) * 0.4;
      }

      composer.render();
    };

    animate();

    // Resize handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // Keyboard shortcuts
    const onKeyDown = (e: KeyboardEvent) => {
      const sd = sceneDataRef.current;
      if (!sd) return;
      if (
        (e.target as HTMLElement).tagName === "INPUT" ||
        (e.target as HTMLElement).tagName === "TEXTAREA"
      )
        return;

      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          sd.isPaused = !sd.isPaused;
          break;
        case "r":
          sd.followingPlanet = null;
          sd.lastPlanetPosition.set(0, 0, 0);
          camera.position.set(0, 30, 70);
          controls.target.set(0, 0, 0);
          controls.update();
          break;
        case "l":
          sd.showLabels = !sd.showLabels;
          setShowLabelsState(sd.showLabels);
          sd.planets.forEach((p) => {
            if (p.label)
              p.label.style.display = sd.showLabels ? "block" : "none";
          });
          break;
        case "m":
          sd.showMoonLabels = !sd.showMoonLabels;
          setShowMoonLabelsState(sd.showMoonLabels);
          sd.planets.forEach((p) => {
            p.moons.forEach((m) => {
              if (m.label)
                m.label.style.display = sd.showMoonLabels ? "block" : "none";
            });
          });
          break;
        case "h":
          toggleUI();
          break;
        case "o":
          sd.showOrbits = !sd.showOrbits;
          setShowOrbitsState(sd.showOrbits);
          sd.orbitRings.forEach((o) => {
            o.visible = sd.showOrbits;
          });
          sd.planets.forEach((p) => {
            p.orbit.visible = sd.showOrbits;
          });
          break;
        case "n":
          setShowCreateModal(true);
          break;
        case "escape":
          setShowCreateModal(false);
          setShowTaskPanel(false);
          setSelectedTask(null);
          break;
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ───────── Task CRUD handlers with useRequest ───────── */
  const { run: createTask } = useRequest(
    async () => {
      if (!formTitle.trim()) return null;

      const taskData: LF.CreateTaskDto = {
        title: formTitle.trim(),
        description: formDesc,
        priority: formPriority,
        complexity: formComplexity,
        dueDate: formDueDate || undefined,
        color: formColor,
      };
      const newTask = (await tasksApi.tasksControllerCreate(
        taskData,
      )) as unknown as Task;

      if (newTask) {
        setTasks([...tasks, newTask]);
        resetForm();
        setShowCreateModal(false);
      }
      return newTask;
    },
    { manual: true },
  );

  const handleCreateTask = () => {
    createTask();
  };

  const { run: updateTask } = useRequest(
    async () => {
      if (!selectedTask || !formTitle.trim()) return null;

      const updateData: LF.UpdateTaskDto = {
        title: formTitle.trim(),
        description: formDesc,
        priority: formPriority,
        complexity: formComplexity,
        dueDate: formDueDate || undefined,
        color: formColor,
      };
      const updated = (await tasksApi.tasksControllerUpdate(
        { id: selectedTask.id },
        updateData,
      )) as unknown as Task;

      if (updated) {
        setTasks(tasks.map((t) => (t.id === selectedTask.id ? updated : t)));
        setEditMode(false);
        // Update selectedTask to reflect changes
        const ranked = rankTasks([updated]);
        setSelectedTask(ranked[0]);
      }
      return updated;
    },
    { manual: true },
  );

  const handleUpdateTask = () => {
    updateTask();
  };

  const { run: deleteTask } = useRequest(
    async (id: string) => {
      await tasksApi.tasksControllerRemove({ id });
      const success = true;
      if (success) {
        setTasks(tasks.filter((t) => t.id !== id));
        setShowTaskPanel(false);
        setSelectedTask(null);
      }
      return success;
    },
    { manual: true },
  );

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
  };

  const { run: toggleComplete } = useRequest(
    async (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return null;

      const updated = (await tasksApi.tasksControllerUpdate(
        { id },
        { completed: !task.completed },
      )) as unknown as Task;

      if (updated) {
        setTasks(tasks.map((t) => (t.id === id ? updated : t)));
        setShowTaskPanel(false);
        setSelectedTask(null);
      }
      return updated;
    },
    { manual: true },
  );

  const handleToggleComplete = (id: string) => {
    toggleComplete(id);
  };

  const { run: addSubtask } = useRequest(
    async (taskId: string, title: string) => {
      if (!title.trim()) return null;

      const newSubtask = (await subtasksApi.subtasksControllerCreate(
        { taskId },
        { title: title.trim() },
      )) as unknown as Subtask;

      if (newSubtask) {
        setTasks(
          tasks.map((t) =>
            t.id === taskId
              ? { ...t, subtasks: [...t.subtasks, newSubtask] }
              : t,
          ),
        );
        setNewSubtaskTitle("");
      }
      return newSubtask;
    },
    { manual: true },
  );

  const handleAddSubtask = (taskId: string, title: string) => {
    addSubtask(taskId, title);
  };

  const { run: toggleSubtask } = useRequest(
    async (taskId: string, subtaskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return null;

      const subtask = task.subtasks.find((s) => s.id === subtaskId);
      if (!subtask) return null;

      const updatedSubtask = (await subtasksApi.subtasksControllerUpdate(
        { id: subtaskId, taskId },
        { completed: !subtask.completed },
      )) as unknown as Subtask;

      if (updatedSubtask) {
        setTasks(
          tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: t.subtasks.map((s) =>
                    s.id === subtaskId ? updatedSubtask : s,
                  ),
                }
              : t,
          ),
        );
      }
      return updatedSubtask;
    },
    { manual: true },
  );

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    toggleSubtask(taskId, subtaskId);
  };

  // Note: No API endpoint for deleting subtasks yet, keeping local for now
  const handleDeleteSubtask = (taskId: string, subtaskId: string) => {
    // TODO: Implement deleteSubtaskFromServer when API endpoint is available
    setTasks(
      tasks.map((t) =>
        t.id === taskId
          ? { ...t, subtasks: t.subtasks.filter((s) => s.id !== subtaskId) }
          : t,
      ),
    );
  };

  const handleFollowPlanet = (task: RankedTask) => {
    const sd = sceneDataRef.current;
    if (!sd) return;
    const planetData = sd.planets.find((p) => p.task.id === task.id);
    if (!planetData) return;
    const size = planetSize(task.complexity);
    const distance = Math.max(size * 8, 15);
    sd.followOffset.set(distance, distance * 0.5, distance);
    sd.lastPlanetPosition.set(0, 0, 0);
    sd.followingPlanet = planetData;
  };

  const stopFollowing = () => {
    const sd = sceneDataRef.current;
    if (!sd) return;
    sd.followingPlanet = null;
    sd.lastPlanetPosition.set(0, 0, 0);
    sd.camera.position.set(0, 30, 70);
    sd.controls.target.set(0, 0, 0);
    sd.controls.update();
  };

  const resetForm = () => {
    setFormTitle("");
    setFormDesc("");
    setFormPriority("medium");
    setFormComplexity(3);
    setFormDueDate("");
    setFormColor(getRandomColor());
    setNewSubtaskTitle("");
  };

  const startEdit = () => {
    if (!selectedTask) return;
    setFormTitle(selectedTask.title);
    setFormDesc(selectedTask.description);
    setFormPriority(selectedTask.priority);
    setFormComplexity(selectedTask.complexity);
    setFormDueDate(selectedTask.dueDate || "");
    setFormColor(selectedTask.color);
    setEditMode(true);
  };

  const rankedTasks = rankTasks(tasks);
  const completedTasks = tasks.filter((t) => t.completed);
  const activeTasks = rankedTasks.filter((t) => !t.completed);

  return (
    <>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      />

      {/* ─── Show UI Button (only visible when UI is hidden) ─── */}
      {uiHidden && (
        <button className="show-ui-btn" onClick={() => setUiHidden(false)}>
          Show UI (H)
        </button>
      )}

      {/* ─── Info panel (bottom-left) ─── */}
      <div className={`info ${uiHidden ? "ui-hidden" : ""}`}>
        <strong
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: "var(--accent-1)",
          }}
        >
          LIGHT FOCUS
        </strong>
        <br />
        🎯 Bullseye Task Manager
        <br />
        🪐 {activeTasks.length} Active Task{activeTasks.length !== 1 ? "s" : ""}
        <br />✅ {completedTasks.length} Completed
        <br />
        🌙 {tasks.reduce((s, t) => s + t.subtasks.length, 0)} Subtasks
        <br />
        <button
          className="follow-sun-btn"
          onClick={() => {
            setShowCreateModal(true);
            resetForm();
          }}
          style={{ marginTop: 8 }}
        >
          ➕ New Task (N)
        </button>
        <button
          className="follow-sun-btn"
          onClick={stopFollowing}
          style={{ marginTop: 6 }}
        >
          🔄 Reset View (R)
        </button>
      </div>

      {/* ─── Mission Control (top-left) ─── */}
      <div
        className={`controls ${controlsCollapsed ? "collapsed" : ""} ${uiHidden ? "ui-hidden" : ""}`}
        id="uiControls"
      >
        <div
          className="control-header"
          onClick={() => setControlsCollapsed(!controlsCollapsed)}
        >
          <h3>
            Mission Control{" "}
            <span className="control-toggle-icon">
              {controlsCollapsed ? "►" : "▼"}
            </span>
          </h3>
        </div>
        <div className="control-content">
          <div className="control-group">
            <label>Speed (Earth Time)</label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              defaultValue="0.4"
              onChange={(e) => {
                const sd = sceneDataRef.current;
                const val = parseFloat(e.target.value);
                if (sd) sd.animationSpeed = val;
                if (val === 0) setSpeedDisplay("0x Real Earth Time");
                else if (val < 1) setSpeedDisplay(val.toFixed(1) + "x Slow");
                else setSpeedDisplay(val.toFixed(1) + "x Fast");
              }}
            />
            <span className="value-display">{speedDisplay}</span>
          </div>

          <div className="control-group">
            <label>Bloom</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              defaultValue="0.5"
              onChange={(e) => {
                const sd = sceneDataRef.current;
                if (!sd) return;
                const strength = parseFloat(e.target.value);
                sd.isBloomManual = true;
                sd.manualBloomStrength = strength;
                sd.bloomPass.strength = strength;
                setBloomManualState(true);
              }}
            />
            <button
              className={bloomManualState ? "" : "active"}
              onClick={() => {
                const sd = sceneDataRef.current;
                if (!sd) return;
                sd.isBloomManual = !sd.isBloomManual;
                setBloomManualState(sd.isBloomManual);
                if (sd.isBloomManual) {
                  sd.bloomPass.strength = sd.manualBloomStrength;
                }
              }}
            >
              {bloomManualState ? "🔄 Auto Bloom" : "✋ Manual Bloom"}
            </button>
          </div>

          <div className="control-group">
            <button
              onClick={() => {
                const sd = sceneDataRef.current;
                if (sd) sd.isPaused = !sd.isPaused;
              }}
            >
              ⏯ Pause/Play
            </button>
            <button onClick={stopFollowing}>Reset</button>
            <button onClick={() => setUiHidden(true)}>Hide UI (H)</button>
          </div>

          <div className="control-group">
            <label>Toggle</label>
            <button
              className={showOrbitsState ? "active" : ""}
              onClick={() => {
                const sd = sceneDataRef.current;
                if (!sd) return;
                sd.showOrbits = !sd.showOrbits;
                setShowOrbitsState(sd.showOrbits);
                sd.orbitRings.forEach((o) => {
                  o.visible = sd.showOrbits;
                });
                sd.planets.forEach((p) => {
                  p.orbit.visible = sd.showOrbits;
                });
              }}
            >
              Orbits (O)
            </button>
            <button
              className={showMoonsState ? "active" : ""}
              onClick={() => {
                const sd = sceneDataRef.current;
                if (!sd) return;
                sd.showMoons = !sd.showMoons;
                setShowMoonsState(sd.showMoons);
                sd.planets.forEach((p) => {
                  p.moons.forEach((m) => {
                    m.mesh.visible = sd.showMoons;
                  });
                });
              }}
            >
              Moons
            </button>
          </div>
        </div>
      </div>

      {/* ─── Task List (top-right) ─── */}
      <div
        className={`celestial-panel ${taskListCollapsed ? "collapsed" : ""} ${uiHidden ? "ui-hidden" : ""}`}
      >
        <div
          className="celestial-header"
          onClick={() => setTaskListCollapsed(!taskListCollapsed)}
        >
          <h4>
            Tasks{" "}
            <span className="toggle-icon">{taskListCollapsed ? "►" : "▼"}</span>
          </h4>
        </div>
        <div className="celestial-content">
          <div className="celestial-controls">
            <button
              className={`label-toggle ${showLabelsState ? "active" : ""}`}
              onClick={() => {
                const sd = sceneDataRef.current;
                if (!sd) return;
                sd.showLabels = !sd.showLabels;
                setShowLabelsState(sd.showLabels);
                sd.planets.forEach((p) => {
                  if (p.label)
                    p.label.style.display = sd.showLabels ? "block" : "none";
                });
              }}
            >
              {showLabelsState
                ? "🏷 Hide Planet Names (L)"
                : "🏷 Show Planet Names (L)"}
            </button>
            <button
              className={`label-toggle ${showMoonLabelsState ? "active" : ""}`}
              onClick={() => {
                const sd = sceneDataRef.current;
                if (!sd) return;
                sd.showMoonLabels = !sd.showMoonLabels;
                setShowMoonLabelsState(sd.showMoonLabels);
                sd.planets.forEach((p) => {
                  p.moons.forEach((m) => {
                    if (m.label)
                      m.label.style.display = sd.showMoonLabels
                        ? "block"
                        : "none";
                  });
                });
              }}
            >
              {showMoonLabelsState
                ? "🌙 Hide Moon Names (M)"
                : "🌙 Show Moon Names (M)"}
            </button>
          </div>
          {([1, 2, 3, 4, 5, 6, 7] as BullseyeRank[]).map((rank) => {
            const tasksInOrbit = activeTasks.filter((t) => t.rank === rank);
            if (tasksInOrbit.length === 0) return null;
            return (
              <div key={rank}>
                <div className="category-header">
                  <strong>
                    Ring {rank} — {ORBIT_LABELS[rank]}
                  </strong>
                </div>
                {tasksInOrbit.map((task) => (
                  <div
                    key={task.id}
                    className="planet-item planet"
                    onClick={() => {
                      setSelectedTask(task);
                      setShowTaskPanel(true);
                      setEditMode(false);
                      handleFollowPlanet(task);
                    }}
                  >
                    <strong>
                      <span
                        style={{
                          display: "inline-block",
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor: task.color,
                          marginRight: 6,
                        }}
                      />
                      {task.title}
                    </strong>
                    <br />
                    <small>
                      ⚡ {task.priority} | 🧩 C{task.complexity} | 🌙{" "}
                      {task.subtasks.length} subtask
                      {task.subtasks.length !== 1 ? "s" : ""}
                    </small>
                    {task.dueDate && (
                      <>
                        <br />
                        <small>
                          📅 {new Date(task.dueDate).toLocaleDateString()}
                        </small>
                      </>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
          {completedTasks.length > 0 && (
            <div>
              <div className="category-header">
                <strong>✅ COMPLETED ({completedTasks.length})</strong>
              </div>
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="planet-item"
                  style={{ opacity: 0.5 }}
                  onClick={() => {
                    const ranked = rankTasks([task]);
                    setSelectedTask(ranked[0]);
                    setShowTaskPanel(true);
                    setEditMode(false);
                  }}
                >
                  <strong style={{ textDecoration: "line-through" }}>
                    {task.title}
                  </strong>
                </div>
              ))}
            </div>
          )}
          {tasks.length === 0 && (
            <div style={{ padding: "15px", textAlign: "center", opacity: 0.6 }}>
              <p>No tasks yet.</p>
              <p>
                Press <strong>N</strong> or click <strong>New Task</strong> to
                create your first planet!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ─── Task Detail Panel ─── */}
      {showTaskPanel && selectedTask && (
        <div className="planet-info-card" style={{ display: "block" }}>
          <div className="planet-info-header">
            <h2 className="planet-info-title">
              <span
                style={{
                  display: "inline-block",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: selectedTask.color,
                }}
              />
              <span>{selectedTask.title}</span>
              <span className="planet-type-badge">
                Ring {selectedTask.rank}
              </span>
            </h2>
            <button
              className="close-btn"
              onClick={() => {
                setShowTaskPanel(false);
                setSelectedTask(null);
              }}
            >
              ×
            </button>
          </div>
          <div className="planet-info-content">
            {!editMode ? (
              <>
                <div className="info-section">
                  <div className="info-grid">
                    <div className="info-item">
                      <div className="info-item-label">Priority</div>
                      <div className="info-item-value">
                        {selectedTask.priority.toUpperCase()}
                      </div>
                    </div>
                    <div className="info-item">
                      <div className="info-item-label">Complexity</div>
                      <div className="info-item-value">
                        {selectedTask.complexity}/5
                      </div>
                    </div>
                    <div className="info-item">
                      <div className="info-item-label">Due Date</div>
                      <div className="info-item-value">
                        {selectedTask.dueDate
                          ? new Date(selectedTask.dueDate).toLocaleDateString()
                          : "None"}
                      </div>
                    </div>
                    <div className="info-item">
                      <div className="info-item-label">Bullseye Rank</div>
                      <div className="info-item-value">
                        Ring {selectedTask.rank} —{" "}
                        {ORBIT_LABELS[selectedTask.rank]}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedTask.description && (
                  <div className="info-section">
                    <div className="planet-description">
                      {selectedTask.description}
                    </div>
                  </div>
                )}

                {/* Subtasks */}
                <div className="info-section">
                  <h4>🌙 Subtasks ({selectedTask.subtasks.length})</h4>
                  <div className="moons-section">
                    {selectedTask.subtasks.map((sub) => (
                      <div key={sub.id} className="moon-item">
                        <div className="moon-info-section">
                          <div
                            className="moon-name"
                            style={{
                              textDecoration: sub.completed
                                ? "line-through"
                                : "none",
                              opacity: sub.completed ? 0.5 : 1,
                            }}
                          >
                            {sub.completed ? "✅" : "🌙"} {sub.title}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button
                            className="follow-moon-btn"
                            onClick={() =>
                              handleToggleSubtask(selectedTask.id, sub.id)
                            }
                          >
                            {sub.completed ? "↩️" : "✓"}
                          </button>
                          <button
                            className="follow-moon-btn"
                            style={{
                              background:
                                "linear-gradient(135deg, #e63946, #c0392b)",
                            }}
                            onClick={() =>
                              handleDeleteSubtask(selectedTask.id, sub.id)
                            }
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add subtask */}
                    <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                      <input
                        type="text"
                        value={newSubtaskTitle}
                        onChange={(e) => setNewSubtaskTitle(e.target.value)}
                        placeholder="New subtask..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAddSubtask(selectedTask.id, newSubtaskTitle);
                          }
                        }}
                        style={{
                          flex: 1,
                          background: "rgba(0,0,0,0.3)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          borderRadius: 4,
                          padding: "6px 10px",
                          color: "var(--text-primary)",
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: 12,
                        }}
                      />
                      <button
                        className="follow-moon-btn"
                        onClick={() =>
                          handleAddSubtask(selectedTask.id, newSubtaskTitle)
                        }
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div
                  className="info-section"
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <button
                    className="follow-planet-btn"
                    onClick={() => handleFollowPlanet(selectedTask)}
                  >
                    🎯 FOLLOW PLANET
                  </button>
                  <button
                    className="follow-planet-btn"
                    style={{
                      background: "linear-gradient(135deg, #2a9d8f, #264653)",
                    }}
                    onClick={startEdit}
                  >
                    ✏️ EDIT TASK
                  </button>
                  <button
                    className="follow-planet-btn"
                    style={{
                      background: selectedTask.completed
                        ? "linear-gradient(135deg, #f77f00, #e63946)"
                        : "linear-gradient(135deg, #2a9d8f, #48bfe3)",
                    }}
                    onClick={() => handleToggleComplete(selectedTask.id)}
                  >
                    {selectedTask.completed
                      ? "↩️ REOPEN TASK"
                      : "✅ MARK COMPLETE"}
                  </button>
                  <button
                    className="follow-planet-btn"
                    style={{
                      background: "linear-gradient(135deg, #e63946, #c0392b)",
                    }}
                    onClick={() => handleDeleteTask(selectedTask.id)}
                  >
                    🗑️ DELETE TASK
                  </button>
                </div>
              </>
            ) : (
              /* ─── Edit Form ─── */
              <TaskForm
                title={formTitle}
                desc={formDesc}
                priority={formPriority}
                complexity={formComplexity}
                dueDate={formDueDate}
                color={formColor}
                onTitleChange={setFormTitle}
                onDescChange={setFormDesc}
                onPriorityChange={setFormPriority}
                onComplexityChange={setFormComplexity}
                onDueDateChange={setFormDueDate}
                onColorChange={setFormColor}
                onSubmit={handleUpdateTask}
                onCancel={() => setEditMode(false)}
                submitLabel="💾 SAVE CHANGES"
              />
            )}
          </div>
        </div>
      )}

      {/* ─── Create Task Modal ─── */}
      {showCreateModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 3000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCreateModal(false);
          }}
        >
          <div
            className="planet-info-card"
            style={{
              display: "block",
              position: "relative",
              transform: "none",
              top: "auto",
              left: "auto",
            }}
          >
            <div className="planet-info-header">
              <h2 className="planet-info-title">
                <span>🪐</span>
                <span>CREATE NEW TASK</span>
              </h2>
              <button
                className="close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>
            <div className="planet-info-content">
              <TaskForm
                title={formTitle}
                desc={formDesc}
                priority={formPriority}
                complexity={formComplexity}
                dueDate={formDueDate}
                color={formColor}
                onTitleChange={setFormTitle}
                onDescChange={setFormDesc}
                onPriorityChange={setFormPriority}
                onComplexityChange={setFormComplexity}
                onDueDateChange={setFormDueDate}
                onColorChange={setFormColor}
                onSubmit={handleCreateTask}
                onCancel={() => setShowCreateModal(false)}
                submitLabel="🚀 CREATE PLANET"
              />
            </div>
          </div>
        </div>
      )}

      {/* ─── Footer ─── */}
      <footer className={`nasa-footer ${uiHidden ? "ui-hidden" : ""}`}>
        <div className="footer-content">
          <strong style={{ color: "var(--accent-1)" }}>LIGHT FOCUS</strong> —
          Bullseye Task Manager
        </div>
      </footer>
    </>
  );
}

/* ─────────── Task Form Component ─────────── */
function TaskForm({
  title,
  desc,
  priority,
  complexity,
  dueDate,
  color,
  onTitleChange,
  onDescChange,
  onPriorityChange,
  onComplexityChange,
  onDueDateChange,
  onColorChange,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  title: string;
  desc: string;
  priority: Priority;
  complexity: Complexity;
  dueDate: string;
  color: string;
  onTitleChange: (v: string) => void;
  onDescChange: (v: string) => void;
  onPriorityChange: (v: Priority) => void;
  onComplexityChange: (v: Complexity) => void;
  onDueDateChange: (v: string) => void;
  onColorChange: (v: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(0,0,0,0.3)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 6,
    padding: "8px 12px",
    color: "var(--text-primary)",
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 13,
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: 4,
    fontSize: 11,
    color: "var(--accent-1)",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: "'Space Grotesk', sans-serif",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <label style={labelStyle}>Task Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter task title..."
          style={inputStyle}
          autoFocus
        />
      </div>

      <div>
        <label style={labelStyle}>Description</label>
        <textarea
          value={desc}
          onChange={(e) => onDescChange(e.target.value)}
          placeholder="Describe the task..."
          style={{ ...inputStyle, minHeight: 60, resize: "vertical" }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>Priority</label>
          <select
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value as Priority)}
            style={inputStyle}
          >
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="none">None</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Complexity (1-5)</label>
          <select
            value={complexity}
            onChange={(e) =>
              onComplexityChange(parseInt(e.target.value) as Complexity)
            }
            style={inputStyle}
          >
            <option value={1}>1 — Simple</option>
            <option value={2}>2 — Easy</option>
            <option value={3}>3 — Medium</option>
            <option value={4}>4 — Complex</option>
            <option value={5}>5 — Very Complex</option>
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => onDueDateChange(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Planet Color</label>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              type="color"
              value={color}
              onChange={(e) => onColorChange(e.target.value)}
              style={{
                width: 40,
                height: 34,
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            />
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {color}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
        <button
          className="follow-planet-btn"
          style={{ flex: 1 }}
          onClick={onSubmit}
        >
          {submitLabel}
        </button>
        <button
          className="follow-planet-btn"
          style={{ flex: 0.5, background: "var(--button-secondary)" }}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
