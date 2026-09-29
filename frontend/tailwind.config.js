/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: "#00fff7",
          pink: "#ff00e5",
          purple: "#a855f7",
          green: "#22ff88",
        },
        ink: {
          900: "#07070d",
          800: "#0d0d17",
          700: "#14142a",
          600: "#1c1c38",
        },
      },
      boxShadow: {
        "neon-cyan": "0 0 10px #00fff7, 0 0 20px rgba(0,255,247,.4)",
        "neon-pink": "0 0 10px #ff00e5, 0 0 20px rgba(255,0,229,.4)",
        "neon-purple": "0 0 10px #a855f7, 0 0 20px rgba(168,85,247,.4)",
        "neon-inset": "inset 0 0 20px rgba(0,255,247,.15)",
      },
      dropShadow: {
        "neon-cyan": "0 0 6px #00fff7",
        "neon-pink": "0 0 6px #ff00e5",
      },
      backgroundImage: {
        "grid-dark":
          "linear-gradient(rgba(0,255,247,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,247,.06) 1px, transparent 1px)",
        "grid-light":
          "linear-gradient(rgba(30,41,59,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(30,41,59,.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
      keyframes: {
        neonPulse: {
          "0%, 100%": {
            textShadow:
              "0 0 8px rgba(0,255,247,.7), 0 0 16px rgba(0,255,247,.5)",
          },
          "50%": {
            textShadow:
              "0 0 4px rgba(0,255,247,.5), 0 0 30px rgba(0,255,247,.9)",
          },
        },
      },
      animation: {
        "neon-pulse": "neonPulse 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};