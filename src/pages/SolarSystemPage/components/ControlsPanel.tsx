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
    <div
      className={`celestial-panel ${uiHidden ? 'ui-hidden' : ''}`}
      style={{
        top: 20,
        left: 20,
        width: 240,
        maxHeight: 'calc(100vh - 100px)',
        overflowY: 'auto',
      }}
    >
      <div
        className="panel-header"
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: 'var(--accent-1)',
          letterSpacing: 1,
          marginBottom: 15,
        }}
      >
        🎛️ MISSION CONTROL
      </div>
      <div className="control-content">
        <div className="control-group">
          <button className="control-btn" onClick={onTogglePause}>
            {isPaused ? '▶️ Resume' : '⏸ Pause'}
          </button>
          <button className="control-btn" onClick={onOpenCreateModal}>
            ➕ New Planet
          </button>
          <label className="control-label">Animation Speed</label>
          <input
            type="range"
            min="0.2"
            max="5"
            step="0.1"
            value={animationSpeed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="control-slider"
          />
          <span className="control-value">{animationSpeed.toFixed(1)}x</span>
        </div>

        <div className="control-group">
          <label className="control-label">Bloom Strength</label>
          <input
            type="range"
            min="0.3"
            max="3"
            step="0.1"
            value={manualBloomStrength}
            onChange={(e) => onBloomStrengthChange(parseFloat(e.target.value))}
            className="control-slider"
          />
          <span className="control-value">{manualBloomStrength.toFixed(1)}</span>
          {!isBloomManual && (
            <div
              style={{
                fontSize: 9,
                color: 'var(--accent-2)',
                marginTop: 4,
                fontStyle: 'italic',
              }}
            >
              Auto-adjusted by task count
            </div>
          )}
        </div>

        <div className="control-group">
          <label className="control-label">Toggles</label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showLabels}
              onChange={onToggleLabels}
            />
            <span>Planet Labels</span>
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showMoonLabels}
              onChange={onToggleMoonLabels}
            />
            <span>Moon Labels</span>
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showOrbits}
              onChange={onToggleOrbits}
            />
            <span>Orbit Rings</span>
          </label>
          <label className="checkbox-label">
            <input type="checkbox" checked={showMoons} onChange={onToggleMoons} />
            <span>Moons</span>
          </label>
        </div>

        <div className="control-group">
          <label className="control-label">Camera</label>
          <button className="control-btn" onClick={onResetCamera}>
            🎥 Reset View
          </button>
          <button className="control-btn" onClick={onToggleUI}>
            {uiHidden ? '👁 Show UI' : '🫥 Hide UI'}
          </button>
        </div>
      </div>
    </div>
  );
}
