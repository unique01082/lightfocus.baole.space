import { useLocalStorageState } from "ahooks";
import { useState } from "react";
import type { SceneData } from "./useThreeScene";

export function useUIControls(sceneDataRef: React.MutableRefObject<SceneData | null>) {
  const [showLabelsState, setShowLabelsState] = useLocalStorageState(
    "solarSystem.showLabels",
    { defaultValue: false },
  );
  const [showMoonLabelsState, setShowMoonLabelsState] = useLocalStorageState(
    "solarSystem.showMoonLabels",
    { defaultValue: false },
  );
  const [showOrbitsState, setShowOrbitsState] = useLocalStorageState(
    "solarSystem.showOrbits",
    { defaultValue: true },
  );
  const [showMoonsState, setShowMoonsState] = useLocalStorageState(
    "solarSystem.showMoons",
    { defaultValue: true },
  );
  const [bloomManualState, setBloomManualState] = useLocalStorageState(
    "solarSystem.bloomManual",
    { defaultValue: false },
  );

  const [isPaused, setIsPaused] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(0.4);
  const [manualBloomStrength, setManualBloomStrength] = useState(0.5);

  const handleTogglePause = () => {
    const sd = sceneDataRef.current;
    if (sd) {
      sd.isPaused = !sd.isPaused;
      setIsPaused(sd.isPaused);
    }
  };

  const handleSpeedChange = (speed: number) => {
    const sd = sceneDataRef.current;
    if (sd) {
      sd.animationSpeed = speed;
      setAnimationSpeed(speed);
    }
  };

  const handleBloomStrengthChange = (strength: number) => {
    const sd = sceneDataRef.current;
    if (!sd) return;
    sd.isBloomManual = true;
    sd.manualBloomStrength = strength;
    sd.bloomPass.strength = strength;
    setBloomManualState(true);
    setManualBloomStrength(strength);
  };

  const handleToggleLabels = () => {
    const sd = sceneDataRef.current;
    if (!sd) return;
    sd.showLabels = !sd.showLabels;
    setShowLabelsState(sd.showLabels);
    sd.planets.forEach((p) => {
      if (p.label) p.label.style.display = sd.showLabels ? "block" : "none";
    });
  };

  const handleToggleMoonLabels = () => {
    const sd = sceneDataRef.current;
    if (!sd) return;
    sd.showMoonLabels = !sd.showMoonLabels;
    setShowMoonLabelsState(sd.showMoonLabels);
    sd.planets.forEach((p) => {
      p.moons.forEach((m) => {
        if (m.label) m.label.style.display = sd.showMoonLabels ? "block" : "none";
      });
    });
  };

  const handleToggleOrbits = () => {
    const sd = sceneDataRef.current;
    if (!sd) return;
    sd.showOrbits = !sd.showOrbits;
    setShowOrbitsState(sd.showOrbits);
    sd.orbitRings.forEach((o) => (o.visible = sd.showOrbits));
    sd.planets.forEach((p) => (p.orbit.visible = sd.showOrbits));
  };

  const handleToggleMoons = () => {
    const sd = sceneDataRef.current;
    if (!sd) return;
    sd.showMoons = !sd.showMoons;
    setShowMoonsState(sd.showMoons);
    sd.planets.forEach((p) => {
      p.moons.forEach((m) => (m.mesh.visible = sd.showMoons));
    });
  };

  return {
    isPaused,
    animationSpeed,
    manualBloomStrength,
    showLabelsState,
    showMoonLabelsState,
    showOrbitsState,
    showMoonsState,
    bloomManualState,
    setIsPaused,
    setShowLabelsState,
    setShowMoonLabelsState,
    setShowOrbitsState,
    handleTogglePause,
    handleSpeedChange,
    handleBloomStrengthChange,
    handleToggleLabels,
    handleToggleMoonLabels,
    handleToggleOrbits,
    handleToggleMoons,
  };
}
