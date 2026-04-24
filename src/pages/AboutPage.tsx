import { Link } from 'react-router';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 animate-in slide-in-from-top duration-700">
          <span className="text-7xl mb-6 block">🪐</span>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent mb-4">
            About LightFocus
          </h1>
          <p className="text-purple-200 text-xl max-w-2xl mx-auto leading-relaxed">
            A task manager built around how your brain actually works — prioritizing what matters most, visually.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 text-center animate-in slide-in-from-bottom duration-700">
            <div className="text-4xl mb-3">🎯</div>
            <h2 className="text-lg font-bold text-purple-200 mb-2">Priority-First</h2>
            <p className="text-purple-100/70 text-sm leading-relaxed">
              Tasks rank 1–7 automatically. Critical tasks orbit closest to the sun.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 text-center animate-in slide-in-from-bottom duration-700" style={{ animationDelay: '100ms' }}>
            <div className="text-4xl mb-3">🌌</div>
            <h2 className="text-lg font-bold text-purple-200 mb-2">Visual Solar System</h2>
            <p className="text-purple-100/70 text-sm leading-relaxed">
              Every task becomes a planet. Subtasks orbit as moons in 3D space.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 text-center animate-in slide-in-from-bottom duration-700" style={{ animationDelay: '200ms' }}>
            <div className="text-4xl mb-3">🤖</div>
            <h2 className="text-lg font-bold text-purple-200 mb-2">AI-Powered</h2>
            <p className="text-purple-100/70 text-sm leading-relaxed">
              Space Captain AI learns your productivity DNA and surfaces the right tasks at the right time.
            </p>
          </div>
        </div>

        <div className="text-center space-x-4 animate-in fade-in duration-700" style={{ animationDelay: '300ms' }}>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
          >
            Get Started →
          </Link>
          <Link
            to="/help"
            className="inline-flex items-center gap-2 border border-purple-400/50 text-purple-200 hover:text-white hover:border-purple-300 font-bold py-3 px-8 rounded-xl transition-all duration-300"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
