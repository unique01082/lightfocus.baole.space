import { useState } from 'react';
import { Button, Checkbox, Panel, Slider } from '../../../components/ui';

interface ControlsPanelProps {
  uiHidden: boolean;
  isPaused: boolean;
  onTogglePause: () => void;
  animationSpeed: number;
  onSpeedChange: (speed: number) => void;
  isBloomManual: boolean;
  manualBloomStrength: number;
  onBloomStrengthChange: (strength: number) => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  showMoonLabels: boolean;
  onToggleMoonLabels: () => void;
  showOrbits: boolean;
  onToggleOrbits: () => void;
  showMoons: boolean;
  onToggleMoons: () => void;
  cameraRotateSpeed: number;
  onCameraRotateSpeedChange: (speed: number) => void;
  cameraZoomSpeed: number;
  onCameraZoomSpeedChange: (speed: number) => void;
  cameraPanSpeed: number;
  onCameraPanSpeedChange: (speed: number) => void;
  cameraAutoRotate: boolean;
  onToggleCameraAutoRotate: () => void;
  cameraFOV: number;
  onCameraFOVChange: (fov: number) => void;
  shadowsEnabled: boolean;
  onToggleShadows: () => void;
  onResetCamera: () => void;
  onToggleUI: () => void;
  onOpenCreateModal: () => void;
}

export default function ControlsPanel({
  uiHidden,
  isPaused,
  onTogglePause,
  animationSpeed,
  onSpeedChange,
  isBloomManual,
  manualBloomStrength,
  onBloomStrengthChange,
  showLabels,
  onToggleLabels,
  showMoonLabels,
  onToggleMoonLabels,
  showOrbits,
  onToggleOrbits,
  showMoons,
  onToggleMoons,
  cameraRotateSpeed,
  onCameraRotateSpeedChange,
  cameraZoomSpeed,
  onCameraZoomSpeedChange,
  cameraPanSpeed,
  onCameraPanSpeedChange,
  cameraAutoRotate,
  onToggleCameraAutoRotate,
  cameraFOV,
  onCameraFOVChange,
  shadowsEnabled,
  onToggleShadows,
  onResetCamera,
  onToggleUI,
  onOpenCreateModal,
}: ControlsPanelProps) {
  const [minimized, setMinimized] = useState(false);

  return (
    <Panel
      className={`${uiHidden ? 'ui-hidden' : ''} ${minimized ? 'w-auto' : 'w-60'} ${minimized ? 'max-h-auto' : 'max-h-[80vh]'} transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.3)]`}
      style={{ top: 20, left: 20 }}
    >
      <div
        className={`px-3 py-2 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-b border-cyan-400/40 -m-0 ${minimized ? '' : 'mb-4'} rounded-t-lg cursor-pointer hover:bg-cyan-500/30 transition-all flex items-center justify-between relative group`}
        onClick={() => setMinimized(!minimized)}
      >
        {/* Glowing line effect */}
        <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 text-sm animate-pulse">◆</span>
          <h3 className="m-0 font-space font-bold text-[11px] text-cyan-100 uppercase tracking-[0.2em] drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
            MISSION CONTROL
          </h3>
        </div>
        <span className="text-cyan-300 text-xs group-hover:text-cyan-100 transition-colors">{minimized ? '▼' : '▲'}</span>
      </div>

      {!minimized && (
        <div className="px-2 pb-2 space-y-4">
        <div className="control-group">
          <div className="flex gap-2">
            <Button size="sm" variant="control" onClick={onTogglePause} fullWidth>
              {isPaused ? '▶️ Resume' : '⏸ Pause'}
            </Button>
            <Button size="sm" variant="control" onClick={onOpenCreateModal} fullWidth>
              🪐 New Planet
            </Button>
          </div>

          <Slider
            label="Animation Speed"
            min={0.2}
            max={5}
            step={0.1}
            value={animationSpeed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            valueFormatter={(v) => `${v.toFixed(1)}x`}
            className="mt-3"
          />
        </div>

        <div className="control-group">
          <Slider
            label="Bloom Strength"
            min={0.3}
            max={3}
            step={0.1}
            value={manualBloomStrength}
            onChange={(e) => onBloomStrengthChange(parseFloat(e.target.value))}
            valueFormatter={(v) => v.toFixed(1)}
          />
          {!isBloomManual && (
            <div className="text-[9px] text-accent-2 mt-1 italic">
              Auto-adjusted by task count
            </div>
          )}
        </div>

        <div className="control-group">
          <label className="control-label">Toggles</label>
          <div className="space-y-2">
            <Checkbox
              label="Planet Labels"
              checked={showLabels}
              onChange={() => onToggleLabels()}
            />
            <Checkbox
              label="Moon Labels"
              checked={showMoonLabels}
              onChange={() => onToggleMoonLabels()}
            />
            <Checkbox
              label="Orbit Rings"
              checked={showOrbits}
              onChange={() => onToggleOrbits()}
            />
            <Checkbox
              label="Moons"
              checked={showMoons}
              onChange={() => onToggleMoons()}
            />
          </div>
        </div>

        <div className="control-group">
          <label className="control-label">Camera</label>
          <div className="flex flex-col gap-2">
            <Button size="sm" variant="control" onClick={onResetCamera} fullWidth>
              🎥 Reset View
            </Button>
            <Button size="sm" variant="control" onClick={onToggleUI} fullWidth>
              {uiHidden ? '👁 Show UI' : '🫥 Hide UI'}
            </Button>
          </div>
        </div>

        <div className="control-group">
          <label className="control-label">Camera Controls</label>
          <Slider
            label="Rotate Speed"
            min={0.1}
            max={2}
            step={0.1}
            value={cameraRotateSpeed}
            onChange={(e) => onCameraRotateSpeedChange(parseFloat(e.target.value))}
            valueFormatter={(v) => v.toFixed(1)}
            className="mb-2"
          />
          <Slider
            label="Zoom Speed"
            min={0.1}
            max={2}
            step={0.1}
            value={cameraZoomSpeed}
            onChange={(e) => onCameraZoomSpeedChange(parseFloat(e.target.value))}
            valueFormatter={(v) => v.toFixed(1)}
            className="mb-2"
          />
          <Slider
            label="Pan Speed"
            min={0.1}
            max={2}
            step={0.1}
            value={cameraPanSpeed}
            onChange={(e) => onCameraPanSpeedChange(parseFloat(e.target.value))}
            valueFormatter={(v) => v.toFixed(1)}
            className="mb-2"
          />
          <Slider
            label="Field of View"
            min={30}
            max={120}
            step={5}
            value={cameraFOV}
            onChange={(e) => onCameraFOVChange(parseFloat(e.target.value))}
            valueFormatter={(v) => `${v}°`}
            className="mb-3"
          />
          <div className="space-y-2">
            <Checkbox
              label="Auto Rotate"
              checked={cameraAutoRotate}
              onChange={onToggleCameraAutoRotate}
            />
            <Checkbox
              label="Shadows"
              checked={shadowsEnabled}
              onChange={onToggleShadows}
            />
          </div>
        </div>
      </div>
      )}
    </Panel>
  );
}
