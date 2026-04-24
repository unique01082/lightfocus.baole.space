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
  const [animationSpeed, setAnimationSpeed] = useState(0.1);
  const [manualBloomStrength, setManualBloomStrength] = useState(0.3);

  // Camera controls
  const [cameraRotateSpeed, setCameraRotateSpeed] = useLocalStorageState(
    "solarSystem.cameraRotateSpeed",
    { defaultValue: 0.3 },
  );
  const [cameraZoomSpeed, setCameraZoomSpeed] = useLocalStorageState(
    "solarSystem.cameraZoomSpeed",
    { defaultValue: 0.8 },
  );
  const [cameraPanSpeed, setCameraPanSpeed] = useLocalStorageState(
    "solarSystem.cameraPanSpeed",
    { defaultValue: 0.5 },
  );
  const [cameraAutoRotate, setCameraAutoRotate] = useLocalStorageState(
    "solarSystem.cameraAutoRotate",
    { defaultValue: false },
  );
  const [cameraFOV, setCameraFOV] = useLocalStorageState(
    "solarSystem.cameraFOV",
    { defaultValue: 75 },
  );
  const [shadowsEnabled, setShadowsEnabled] = useLocalStorageState(
    "solarSystem.shadowsEnabled",
    { defaultValue: true },
  );

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

  const handleCameraRotateSpeedChange = (speed: number) => {
    const sd = sceneDataRef.current;
    if (!sd) return;
    sd.controls.rotateSpeed = speed;
    setCameraRotateSpeed(speed);
  };

  const handleCameraZoomSpeedChange = (speed: number) => {
    const sd = sceneDataRef.current;
    if (!sd) return;
    sd.controls.zoomSpeed = speed;
    setCameraZoomSpeed(speed);
  };

  const handleCameraPanSpeedChange = (speed: number) => {
    const sd = sceneDataRef.current;
    if (!sd) return;
    sd.controls.panSpeed = speed;
    setCameraPanSpeed(speed);
  };

  const handleToggleAutoRotate = () => {
    const sd = sceneDataRef.current;
    if (!sd) return;
    sd.controls.autoRotate = !sd.controls.autoRotate;
    setCameraAutoRotate(sd.controls.autoRotate);
  };

  const handleCameraFOVChange = (fov: number) => {
    const sd = sceneDataRef.current;
    if (!sd) return;
    sd.camera.fov = fov;
    sd.camera.updateProjectionMatrix();
    setCameraFOV(fov);
  };

  const handleToggleShadows = () => {
    const sd = sceneDataRef.current;
    if (!sd) return;
    const newValue = !shadowsEnabled;
    sd.renderer.shadowMap.enabled = newValue;
    setShadowsEnabled(newValue);
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
    cameraRotateSpeed,
    cameraZoomSpeed,
    cameraPanSpeed,
    cameraAutoRotate,
    cameraFOV,
    shadowsEnabled,
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
    handleCameraRotateSpeedChange,
    handleCameraZoomSpeedChange,
    handleCameraPanSpeedChange,
    handleToggleAutoRotate,
    handleCameraFOVChange,
    handleToggleShadows,
  };
}
