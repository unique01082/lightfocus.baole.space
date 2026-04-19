import { useCallback } from "react";
import * as THREE from "three";
import type {
  BullseyeRank,
  Complexity
} from "../../../types/task";
import { groupByOrbit, rankTasks } from "../../../utils/ranking";
import type { SceneData } from "./useThreeScene";

const ORBIT_DISTANCES: Record<BullseyeRank, number> = {
  1: 25,
  2: 35,
  3: 45,
  4: 55,
  5: 65,
  6: 75,
  7: 85,
};

function planetSize(complexity: Complexity): number {
  return 0.6 + complexity * 0.3;
}

export function usePlanetManager(
  sceneDataRef: React.MutableRefObject<SceneData | null>,
  tasks: any[],
) {
  const updatePlanets = useCallback(() => {
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

    const ranked = rankTasks(tasks.filter((t) => !t.completed) as any);
    const groups = groupByOrbit(ranked);

    groups.forEach((tasksInOrbit, rank) => {
      const dist = ORBIT_DISTANCES[rank];
      tasksInOrbit.forEach((task, idx) => {
        const angleOffset =
          tasksInOrbit.length > 1
            ? (idx / tasksInOrbit.length) * Math.PI * 2
            : Math.random() * Math.PI * 2;

        const size = planetSize(task.complexity as Complexity);
        const color = new THREE.Color(task.color);

        // Create planet mesh
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
        const moons: any[] = [];
        (task.subtasks || []).forEach((sub: any, mi: number) => {
          // Seed-based pseudo-random per subtask for deterministic variation
          const seed = sub.id
            .split("")
            .reduce((a: number, c: string) => a + c.charCodeAt(0), 0);
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
            (mi / Math.max((task.subtasks || []).length, 1)) * Math.PI * 2;
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

          // Varied speed: 0.005 – 0.015 (slower than before)
          const moonSpeed = (0.005 + seededRand(10) * 0.01) / 5;

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

    // Create asteroid belt for completed tasks
    const completedTasks = tasks.filter((t) => t.completed);
    const asteroidBeltDistance = 120; // Slightly closer so they're visible
    const asteroidBeltWidth = 18; // Spread of the belt

    // Add fake/decorative asteroids to the belt (small, rocky grey) - they orbit!
    const numFakeAsteroids = 120; // Significantly more for visibility
    const fakeAsteroidPivots: { pivot: THREE.Object3D; speed: number }[] = [];

    for (let i = 0; i < numFakeAsteroids; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = asteroidBeltDistance + (Math.random() - 0.5) * asteroidBeltWidth;

      // Varied sizes for more natural look
      const asteroidSize = 0.25 + Math.random() * 0.45; // 0.25-0.7 (more visible)
      // Varied rock colors: grey, brown-grey, blue-grey
      const grayVal = 0.35 + Math.random() * 0.2;
      const asteroidColor = new THREE.Color(
        grayVal + (Math.random() - 0.5) * 0.08,
        grayVal + (Math.random() - 0.5) * 0.05,
        grayVal + (Math.random() - 0.5) * 0.1,
      );

      // Mix of geometry types for visual variety
      let geo: THREE.BufferGeometry;
      const shape = Math.floor(Math.random() * 3);
      if (shape === 0) {
        geo = new THREE.DodecahedronGeometry(asteroidSize, 0);
      } else if (shape === 1) {
        geo = new THREE.OctahedronGeometry(asteroidSize, 0);
      } else {
        geo = new THREE.IcosahedronGeometry(asteroidSize, 0);
      }

      const mat = new THREE.MeshStandardMaterial({
        color: asteroidColor,
        metalness: 0.15,
        roughness: 0.85,
        emissive: asteroidColor.clone().multiplyScalar(0.15), // Slightly emissive
        emissiveIntensity: 0.3,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;

      const pivot = new THREE.Object3D();
      pivot.add(mesh);
      mesh.position.x = distance;
      // Slight vertical scatter for 3D depth
      mesh.position.y = (Math.random() - 0.5) * 3;
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      pivot.rotation.y = angle;
      sd.scene.add(pivot);

      // Store fake asteroids so they can orbit too
      const speed = 0.0001 + Math.random() * 0.0002; // Slow orbit
      fakeAsteroidPivots.push({ pivot, speed });
    }

    // Store fake asteroids in scene data for animation
    (sd as any).fakeAsteroidPivots = fakeAsteroidPivots;

    // Add completed tasks as larger, distinctive asteroids
    if (completedTasks.length > 0) {
      completedTasks.forEach((task) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = asteroidBeltDistance + (Math.random() - 0.5) * asteroidBeltWidth;

        // Larger, more visible asteroids with greenish tint
        const asteroidSize = 0.8 + Math.random() * 0.5; // Noticeably bigger (0.8-1.3)
        const asteroidColor = new THREE.Color(0.3, 0.6, 0.45); // Greenish (completed)

        const geo = new THREE.DodecahedronGeometry(asteroidSize, 0);
        const mat = new THREE.MeshStandardMaterial({
          color: asteroidColor,
          metalness: 0.2,
          roughness: 0.75,
          emissive: new THREE.Color(0.1, 0.35, 0.2),
          emissiveIntensity: 0.6,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;

        const pivot = new THREE.Object3D();
        pivot.add(mesh);
        mesh.position.x = distance;
        mesh.position.y = (Math.random() - 0.5) * 3;
        mesh.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );
        pivot.rotation.y = angle;
        sd.scene.add(pivot);

        const speed = 0.0002 + Math.random() * 0.0002;

        sd.planets.push({
          task,
          mesh,
          pivot,
          speed,
          moons: [],
          orbit: null as any,
          label: null as any,
        });
      });
    }
  }, [sceneDataRef, tasks]);

  return { updatePlanets };
}
