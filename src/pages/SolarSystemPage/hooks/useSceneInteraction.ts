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

    // Planet hover tooltip
    const tooltip = document.createElement("div");
    tooltip.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 9999;
      background: rgba(0, 5, 18, 0.88);
      border: 1px solid rgba(34, 211, 238, 0.55);
      border-radius: 5px;
      padding: 4px 10px;
      font-family: 'Space Mono', monospace;
      font-size: 11px;
      font-weight: 700;
      color: rgba(255,255,255,0.92);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      display: none;
      box-shadow: 0 0 10px rgba(34,211,238,0.25);
      backdrop-filter: blur(4px);
      white-space: nowrap;
    `;
    document.body.appendChild(tooltip);

    const hoverMouse = new THREE.Vector2();
    const onMouseMove = (event: MouseEvent) => {
      const currentSd = sceneDataRef.current;
      if (!currentSd) return;
      hoverMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      hoverMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(hoverMouse, currentSd.camera);
      const meshes = currentSd.planets.map((p) => p.mesh);
      const intersects = raycaster.intersectObjects(meshes);
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const planetData = currentSd.planets.find((p) => p.mesh === hit);
        if (planetData) {
          tooltip.innerHTML = `<span style="color:${planetData.task.color};margin-right:5px">◆</span>${planetData.task.title}`;
          tooltip.style.display = "block";
          tooltip.style.left = `${event.clientX + 16}px`;
          tooltip.style.top = `${event.clientY - 24}px`;
          return;
        }
      }
      tooltip.style.display = "none";
    };

    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousemove", onMouseMove);
      if (tooltip.parentNode) tooltip.parentNode.removeChild(tooltip);
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
