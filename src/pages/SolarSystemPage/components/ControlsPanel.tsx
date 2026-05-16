import { useState } from 'react';
import { Panel } from '../../../components/ui';

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

function SectionHead({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-px flex-1 bg-cyan-500/20" />
      <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-cyan-500/50 font-space">{label}</span>
      <div className="h-px flex-1 bg-cyan-500/20" />
    </div>
  );
}

function LedBtn({
  active,
  icon,
  label,
  onClick,
  activeColor = 'cyan',
}: {
  active: boolean;
  icon: string;
  label: string;
  onClick: () => void;
  activeColor?: 'cyan' | 'amber' | 'purple' | 'green';
}) {
  const colors: Record<string, string> = {
    cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_6px_rgba(34,211,238,0.2)]',
    amber: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_6px_rgba(245,158,11,0.2)]',
    purple: 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_6px_rgba(168,85,247,0.2)]',
    green: 'bg-green-500/20 text-green-300 border-green-500/40 shadow-[0_0_6px_rgba(34,197,94,0.2)]',
  };
  const dotColors: Record<string, string> = {
    cyan: 'bg-cyan-400 shadow-[0_0_4px_rgba(34,211,238,1)]',
    amber: 'bg-amber-400 shadow-[0_0_4px_rgba(245,158,11,1)]',
    purple: 'bg-purple-400 shadow-[0_0_4px_rgba(168,85,247,1)]',
    green: 'bg-green-400 shadow-[0_0_4px_rgba(34,197,94,1)]',
  };
  return (
    <button
      onClick={onClick}
      title={label}
      className={`flex items-center gap-1.5 px-2 py-2 rounded text-[10px] font-bold tracking-wider uppercase transition-all border w-full
        ${active ? colors[activeColor] : 'bg-white/5 text-white/35 border-white/10 hover:bg-white/8 hover:text-white/55'}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all ${active ? dotColors[activeColor] : 'bg-white/20'}`} />
      <span className="text-[11px] leading-none">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );
}

function CompactSlider({
  icon,
  label,
  min,
  max,
  step,
  value,
  onChange,
  formatter,
}: {
  icon: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  formatter: (v: number) => string;
}) {
  return (
    <div className="flex items-center gap-2" title={label}>
      <span className="text-[12px] w-4 text-center flex-shrink-0 leading-none">{icon}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 h-1 bg-white/15 rounded-sm outline-none appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
          [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:shadow-[0_0_6px_rgba(34,211,238,0.8)]
          [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:bg-cyan-400
          [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
      />
      <span className="text-[10px] font-mono text-cyan-300/80 w-8 text-right flex-shrink-0 tabular-nums">{formatter(value)}</span>
    </div>
  );
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
      className={`${uiHidden ? 'ui-hidden' : ''} ${minimized ? 'w-auto' : 'w-56 md:w-64'} transition-all duration-300 shadow-[0_0_24px_rgba(34,211,238,0.2)]`}
      style={{ top: 20, left: 20 }}
    >
      {/* Header */}
      <div
        className="relative px-3 py-2.5 bg-gradient-to-r from-cyan-500/15 to-blue-700/10 border-b border-cyan-500/25 cursor-pointer hover:bg-cyan-500/20 transition-all flex items-center justify-between group"
        onClick={() => setMinimized(!minimized)}
      >
        <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isPaused ? 'bg-amber-400 shadow-[0_0_5px_rgba(245,158,11,1)]' : 'bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,1)] animate-pulse'}`} />
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-100 font-space">CTRL</span>
          <span className="text-[9px] text-white/30 font-mono hidden md:inline">SYS</span>
        </div>
        <span className="text-[10px] font-mono text-cyan-500/50 group-hover:text-cyan-300 transition-colors">
          {minimized ? '[+]' : '[−]'}
        </span>
      </div>

      {!minimized && (
        <div className="max-h-[75vh] overflow-y-auto scrollbar-thin px-2.5 py-2.5 space-y-3">

          {/* Main actions */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={onTogglePause}
              className={`flex items-center justify-center gap-1.5 py-3 rounded text-[11px] font-bold uppercase tracking-wide transition-all border
                ${isPaused
                  ? 'bg-green-500/20 text-green-300 border-green-500/40 shadow-[0_0_8px_rgba(34,197,94,0.25)]'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.25)]'
                }`}
            >
              <span>{isPaused ? '▶' : '⏸'}</span>
              <span>{isPaused ? 'RUN' : 'HALT'}</span>
            </button>
            <button
              onClick={onOpenCreateModal}
              className="flex items-center justify-center gap-1.5 py-3 rounded text-[11px] font-bold uppercase tracking-wide transition-all border bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30 shadow-[0_0_8px_rgba(168,85,247,0.2)]"
            >
              <span>⊕</span>
              <span>PLANET</span>
            </button>
          </div>

          <SectionHead label="VISUALS" />

          <div className="space-y-2.5">
            <CompactSlider
              icon="⚡"
              label="Animation Speed"
              min={0.2} max={5} step={0.1}
              value={animationSpeed}
              onChange={onSpeedChange}
              formatter={(v) => `${v.toFixed(1)}×`}
            />
            <CompactSlider
              icon="✦"
              label="Bloom / Glow"
              min={0.3} max={3} step={0.1}
              value={manualBloomStrength}
              onChange={onBloomStrengthChange}
              formatter={(v) => v.toFixed(1)}
            />
            {!isBloomManual && (
              <div className="text-[8px] text-cyan-500/40 italic text-right tracking-wider">AUTO BLOOM</div>
            )}
          </div>

          <SectionHead label="DISPLAY" />

          <div className="grid grid-cols-2 gap-1">
            <LedBtn active={showLabels} icon="🏷" label="LABEL" onClick={onToggleLabels} />
            <LedBtn active={showMoonLabels} icon="🌙" label="MOON LABEL" onClick={onToggleMoonLabels} />
            <LedBtn active={showOrbits} icon="⭕" label="ORBITS" onClick={onToggleOrbits} />
            <LedBtn active={showMoons} icon="●" label="MOONS" onClick={onToggleMoons} />
            <LedBtn active={shadowsEnabled} icon="◈" label="SHADOW" onClick={onToggleShadows} activeColor="purple" />
            <LedBtn active={cameraAutoRotate} icon="↻" label="SPIN" onClick={onToggleCameraAutoRotate} activeColor="green" />
          </div>

          <SectionHead label="CAMERA" />

          <div className="space-y-2">
            <CompactSlider
              icon="↺"
              label="Rotate Speed"
              min={0.1} max={2} step={0.1}
              value={cameraRotateSpeed}
              onChange={onCameraRotateSpeedChange}
              formatter={(v) => v.toFixed(1)}
            />
            <CompactSlider
              icon="⇲"
              label="Zoom Speed"
              min={0.1} max={2} step={0.1}
              value={cameraZoomSpeed}
              onChange={onCameraZoomSpeedChange}
              formatter={(v) => v.toFixed(1)}
            />
            <CompactSlider
              icon="✥"
              label="Pan Speed"
              min={0.1} max={2} step={0.1}
              value={cameraPanSpeed}
              onChange={onCameraPanSpeedChange}
              formatter={(v) => v.toFixed(1)}
            />
            <CompactSlider
              icon="◉"
              label="Field of View"
              min={30} max={120} step={5}
              value={cameraFOV}
              onChange={onCameraFOVChange}
              formatter={(v) => `${v}°`}
            />
          </div>

          <SectionHead label="ACTIONS" />

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={onResetCamera}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded text-[10px] font-bold uppercase tracking-wide transition-all border bg-white/5 text-white/55 border-white/12 hover:bg-cyan-500/15 hover:text-cyan-300 hover:border-cyan-500/30"
            >
              <span>⟳</span>
              <span>RESET</span>
            </button>
            <button
              onClick={onToggleUI}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded text-[10px] font-bold uppercase tracking-wide transition-all border bg-white/5 text-white/55 border-white/12 hover:bg-white/10 hover:text-white/80"
            >
              <span>{uiHidden ? '👁' : '⊗'}</span>
              <span>{uiHidden ? 'SHOW' : 'HIDE'}</span>
            </button>
          </div>

        </div>
      )}
    </Panel>
  );
}
