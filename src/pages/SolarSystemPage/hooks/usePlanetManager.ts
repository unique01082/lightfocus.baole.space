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
  }, [sceneDataRef, tasks]);

  return { updatePlanets };
}
