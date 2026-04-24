import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 flex flex-col items-center justify-center px-4 text-center">
      <div className="animate-in zoom-in duration-500">
        <div className="text-9xl mb-4 select-none" style={{ filter: 'grayscale(0.3)' }}>🌑</div>
        <h1 className="text-8xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-purple-200 mb-4">
          Lost in Space
        </h2>
        <p className="text-purple-300/70 text-lg mb-10 max-w-sm mx-auto leading-relaxed">
          This orbit doesn't exist. The planet you're looking for has drifted out of range.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
        >
          ← Return to Solar System
        </Link>
      </div>
    </div>
  );
}
