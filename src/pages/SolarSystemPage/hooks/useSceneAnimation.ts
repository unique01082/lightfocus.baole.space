import { useEffect } from "react";
import * as THREE from "three";
import type { SceneData } from "./useThreeScene";

export function useSceneAnimation(
  sceneDataRef: React.MutableRefObject<SceneData | null>,
) {
  useEffect(() => {
    const sd = sceneDataRef.current;
    if (!sd) return;

    const animate = () => {
      const sd = sceneDataRef.current;
      if (!sd) return;
      sd.animationId = requestAnimationFrame(animate);

      if (!sd.isPaused) {
        const spd = sd.animationSpeed === 0 ? 0.0001 : sd.animationSpeed;
        sd.sun.rotation.y += 0.002 * spd;

        // Animate planets and moons
        sd.planets.forEach((p) => {
          p.pivot.rotation.y += p.speed * spd;
          p.mesh.rotation.y += 0.01 * spd;
          p.moons.forEach((m) => {
            // Rotate around the tilted orbital axis for 3D electron effect
            m.pivot.rotateOnAxis(m.tiltAxis, m.speed * spd);
            m.mesh.rotation.y += 0.02 * spd;
          });
        });

        // Animate fake asteroids orbiting in the belt
        const fakeAsteroidPivots = (sd as any).fakeAsteroidPivots;
        if (fakeAsteroidPivots) {
          fakeAsteroidPivots.forEach((asteroid: { pivot: THREE.Object3D; speed: number }) => {
            asteroid.pivot.rotation.y += asteroid.speed * spd;
          });
        }

        // Rotate distant stars
        const distantStars = sd.scene.children.find(
          (child) => child instanceof THREE.Points,
        );
        if (distantStars) {
          distantStars.rotation.y += 0.0001 * spd;
        }
      }

      // Update planet labels
      if (sd.showLabels) {
        const canvas = sd.renderer.domElement;
        const rect = canvas.getBoundingClientRect();

        sd.planets.forEach((p) => {
          if (!p.label) return;
          const vec = new THREE.Vector3();
          p.mesh.getWorldPosition(vec);
          vec.project(sd.camera);
          const x = rect.left + (vec.x * 0.5 + 0.5) * rect.width;
          const y = rect.top + (vec.y * -0.5 + 0.5) * rect.height;
          p.label.style.left = x + "px";
          p.label.style.top = y - 20 + "px";
          p.label.style.display = vec.z > 1 ? "none" : "block";
        });
      }

      // Update moon labels
      if (sd.showMoonLabels) {
        const canvas = sd.renderer.domElement;
        const rect = canvas.getBoundingClientRect();

        sd.planets.forEach((p) => {
          p.moons.forEach((m) => {
            if (!m.label) return;
            const vec = new THREE.Vector3();
            m.mesh.getWorldPosition(vec);
            vec.project(sd.camera);
            const x = rect.left + (vec.x * 0.5 + 0.5) * rect.width;
            const y = rect.top + (vec.y * -0.5 + 0.5) * rect.height;
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
          sd.camera.position.add(movement);
          sd.controls.target.add(movement);
        } else {
          sd.camera.position.copy(planetPos.clone().add(sd.followOffset));
          sd.controls.target.copy(planetPos);
        }
        sd.lastPlanetPosition.copy(planetPos);
      }

      sd.controls.update();

      // Dynamic bloom (only in auto mode)
      if (!sd.isBloomManual) {
        const distToSun = sd.camera.position.distanceTo(sd.sun.position);
        const normalized = Math.max(0, Math.min(1, (distToSun - 10) / 90));
        sd.bloomPass.strength = 0.5 + (1 - normalized) * 1.0;
        sd.bloomPass.radius = 0.6 + (1 - normalized) * 0.4;
      }

      sd.composer.render();
    };

    animate();

    return () => {
      if (sd) {
        cancelAnimationFrame(sd.animationId);
      }
    };
  }, [sceneDataRef]);
}
