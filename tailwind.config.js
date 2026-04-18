/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // baole.space Gradient Theme
        'deep': '#0f0c29',
        'mid': '#302b63',
        'light': '#24243e',
        'accent': {
          1: '#667eea',
          2: '#764ba2',
          3: '#f093fb',
          4: '#f5576c',
          5: '#4facfe',
          6: '#00f2fe',
        },
        // Space Themed (for solar system)
        'space': {
          deep: '#000814',
          cosmic: '#001d3d',
          gold: '#ffd60a',
          purple: '#7209b7',
          blue: '#4cc9f0',
          orange: '#f77f00',
          green: '#2a9d8f',
        },
        // NASA themed
        'nasa': {
          white: '#ffffff',
          gray: '#e5e5e5',
          blue: '#0b3d91',
          red: '#fc3d21',
          'dark-gray': '#5a6670',
        },
      },
      fontFamily: {
        'space': ['Space Grotesk', 'sans-serif'],
      },
      backdropBlur: {
        'glass': '12px',
        'glass-heavy': '16px',
      },
      boxShadow: {
        'glow': '0 0 10px rgba(102, 126, 234, 0.3)',
        'glow-lg': '0 0 20px rgba(102, 126, 234, 0.4)',
        'glow-accent': '0 0 10px rgba(240, 147, 251, 0.4)',
        'panel': '0 4px 20px rgba(102, 126, 234, 0.2)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.2)',
      },
      borderColor: {
        'glass': 'rgba(255, 255, 255, 0.1)',
        'panel': 'rgba(102, 126, 234, 0.3)',
      },
      backgroundColor: {
        'glass': 'rgba(255, 255, 255, 0.05)',
        'glass-hover': 'rgba(255, 255, 255, 0.1)',
        'panel': 'rgba(15, 12, 41, 0.85)',
      },
      animation: {
        'orbit-float': 'orbFloat 8s infinite alternate ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        orbFloat: {
          'from': { transform: 'translate(0, 0) scale(1)' },
          'to': { transform: 'translate(30px, -30px) scale(1.1)' },
        },
        slideIn: {
          'from': { opacity: '0', transform: 'translate(-50%, -60%)' },
          'to': { opacity: '1', transform: 'translate(-50%, -50%)' },
        },
        fadeIn: {
          'from': { opacity: '0', transform: 'translateX(-50%) translateY(-8px)' },
          'to': { opacity: '1', transform: 'translateX(-50%) translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
