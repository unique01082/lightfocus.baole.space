import { useEffect } from "react";
import * as THREE from "three";
import type { RankedTask } from "../../../types/task";
import type { SceneData } from "./useThreeScene";

interface UseSceneInteractionProps {
  sceneDataRef: React.MutableRefObject<SceneData | null>;
  setSelectedTask: (task: RankedTask | null) => void;
  setShowTaskPanel: (show: boolean) => void;
  toggleUI: () => void;
  setShowCreateModal: (show: boolean) => void;
  setIsPaused: (paused: boolean) => void;
  setShowLabelsState: (show: boolean) => void;
  setShowMoonLabelsState: (show: boolean) => void;
  setShowOrbitsState: (show: boolean) => void;
  stopFollowing: () => void;
}

export function useSceneInteraction({
  sceneDataRef,
  setSelectedTask,
  setShowTaskPanel,
  toggleUI,
  setShowCreateModal,
  setIsPaused,
  setShowLabelsState,
  setShowMoonLabelsState,
  setShowOrbitsState,
  stopFollowing,
}: UseSceneInteractionProps) {
  useEffect(() => {
    const sd = sceneDataRef.current;
    if (!sd) return;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Click handler
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
      raycaster.setFromCamera(mouse, sd.camera);

      const meshes = sd.planets.map((p) => p.mesh);
      meshes.push(sd.sun);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit === sd.sun) return;
        const planetData = sd.planets.find((p) => p.mesh === hit);
        if (planetData) {
          setSelectedTask(planetData.task);
          setShowTaskPanel(true);
        }
      } else {
        setShowTaskPanel(false);
        setSelectedTask(null);
      }
    };

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
          setIsPaused(sd.isPaused);
          break;
        case "r":
          stopFollowing();
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

    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [
    sceneDataRef,
    setSelectedTask,
    setShowTaskPanel,
    toggleUI,
    setShowCreateModal,
    setIsPaused,
    setShowLabelsState,
    setShowMoonLabelsState,
    setShowOrbitsState,
    stopFollowing,
  ]);
}
