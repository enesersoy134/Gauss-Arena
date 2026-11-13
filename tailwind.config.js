/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        isler: {
          bg: '#150A16',
          deep: '#0F0510',
          surface: '#1A0E1C',
          elevated: '#2A1A2C',
          primary: '#F14E13',
          hover: '#D6400D',
          bordo: '#4F0006',
          muted: '#B5CBC8',
          glass: 'rgba(26, 14, 28, 0.90)',
        },
        player: {
          p1: '#F14E13',
          p2: '#3B82F6',
        },
        game: {
          correct: '#22C55E',
          wrong: '#EF4444',
          combo: '#A855F7',
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        sans: ['"Source Sans 3"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'isler-glow': '0 0 60px -20px rgba(241, 78, 19, 0.55)',
        'btn-glow': '0 4px 20px 0 rgba(241, 78, 19, 0.45)',
        'correct-glow': '0 0 25px rgba(34, 197, 94, 0.55)',
        'wrong-glow': '0 0 25px rgba(239, 68, 68, 0.55)',
      },
      borderRadius: {
        'card': '24px',
        'pill': '9999px',
      }
    },
  },
  plugins: [],
};
