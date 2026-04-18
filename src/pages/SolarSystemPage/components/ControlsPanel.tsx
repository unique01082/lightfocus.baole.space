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
  onResetCamera,
  onToggleUI,
  onOpenCreateModal,
}: ControlsPanelProps) {
  return (
    <Panel
      className={`${uiHidden ? 'ui-hidden' : ''} w-60 max-h-[calc(100vh-100px)] overflow-y-auto`}
      style={{ top: 20, left: 20 }}
    >
      <div className="px-2 py-2 bg-gradient-to-br from-accent-1 to-accent-2 border-b border-panel -m-0 mb-4 rounded-t-lg">
        <h3 className="m-0 font-space font-bold text-[11px] text-white uppercase tracking-widest">
          MISSION CONTROL
        </h3>
      </div>

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
              onChange={onToggleLabels}
            />
            <Checkbox
              label="Moon Labels"
              checked={showMoonLabels}
              onChange={onToggleMoonLabels}
            />
            <Checkbox
              label="Orbit Rings"
              checked={showOrbits}
              onChange={onToggleOrbits}
            />
            <Checkbox
              label="Moons"
              checked={showMoons}
              onChange={onToggleMoons}
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
      </div>
    </Panel>
  );
}
