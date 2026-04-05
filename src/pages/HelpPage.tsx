import { Link } from 'react-router';

export default function HelpPage() {
  return (
    <div className="page-container">
      <div className="page-content">
        <h1 className="page-title">Help & Guide</h1>
        <p className="page-subtitle">Learn how to use LightFocus — the Bullseye Task Manager</p>

        <div className="help-grid">
          <section className="glass-card">
            <h2>🎯 Bullseye Prioritization</h2>
            <p>
              Tasks are automatically ranked on a scale of 1–7 based on <strong>priority</strong>,{' '}
              <strong>complexity</strong>, and <strong>due date urgency</strong>. Lower rank = closer to the sun = more important.
            </p>
            <div className="help-rings">
              <div className="ring-item"><span className="ring-badge ring-1">1</span> Critical — innermost orbit</div>
              <div className="ring-item"><span className="ring-badge ring-2">2</span> Very High</div>
              <div className="ring-item"><span className="ring-badge ring-3">3</span> High</div>
              <div className="ring-item"><span className="ring-badge ring-4">4</span> Medium</div>
              <div className="ring-item"><span className="ring-badge ring-5">5</span> Low</div>
              <div className="ring-item"><span className="ring-badge ring-6">6</span> Very Low</div>
              <div className="ring-item"><span className="ring-badge ring-7">7</span> Minimal — outermost orbit</div>
            </div>
          </section>

          <section className="glass-card">
            <h2>🪐 Creating Tasks</h2>
            <p>
              Press <kbd>N</kbd> or click <strong>New Task</strong> to create a task. Each task becomes a planet in the solar system.
            </p>
            <ul>
              <li><strong>Title</strong> — The planet's name</li>
              <li><strong>Priority</strong> — Critical, High, Medium, Low, None</li>
              <li><strong>Complexity</strong> — 1–5 (affects planet size)</li>
              <li><strong>Due Date</strong> — Adds urgency to the ranking</li>
              <li><strong>Color</strong> — Choose your planet's color</li>
            </ul>
          </section>

          <section className="glass-card">
            <h2>🌙 Subtasks</h2>
            <p>
              Subtasks orbit their parent planet as moons. They orbit in 3D like electrons around a nucleus.
              Mark subtasks complete to turn their moons green.
            </p>
          </section>

          <section className="glass-card">
            <h2>⌨️ Keyboard Shortcuts</h2>
            <div className="shortcuts-grid">
              <div><kbd>N</kbd> New task</div>
              <div><kbd>L</kbd> Toggle planet labels</div>
              <div><kbd>M</kbd> Toggle moon labels</div>
              <div><kbd>O</kbd> Toggle orbit lines</div>
              <div><kbd>H</kbd> Hide/show UI</div>
              <div><kbd>R</kbd> Reset camera view</div>
              <div><kbd>Space</kbd> Pause/resume animation</div>
              <div><kbd>Escape</kbd> Close panels</div>
            </div>
          </section>

          <section className="glass-card">
            <h2>🎛️ Mission Control</h2>
            <p>
              The top-left panel controls animation speed, bloom effects, orbit visibility, and moon visibility.
            </p>
            <ul>
              <li><strong>Speed</strong> — Adjust orbital speed (0–10x)</li>
              <li><strong>Bloom</strong> — Control glow intensity or let it auto-adjust</li>
              <li><strong>Orbits</strong> — Show/hide orbit ring lines</li>
              <li><strong>Moons</strong> — Show/hide subtask moons</li>
            </ul>
          </section>

          <section className="glass-card">
            <h2>💾 Data Storage</h2>
            <p>
              All tasks are stored in your browser's <code>localStorage</code>.
              Data persists across sessions but is local to this browser.
            </p>
          </section>
        </div>

        <div className="help-back">
          <Link to="/" className="glass-btn">
            ← Back to Solar System
          </Link>
        </div>
      </div>
    </div>
  );
}
