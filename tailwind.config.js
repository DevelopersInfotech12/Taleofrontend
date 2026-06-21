/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#C9A84C",
          light: "#E8C97E",
          dark: "#A67C2E",
          50: "#FDF9EE",
          100: "#F7EDCB",
        },
        rose: {
          DEFAULT: "#C97B8A",
          light: "#E8A5B0",
          dark: "#A05568",
        },
        cream: {
          DEFAULT: "#FAF7F2",
          dark: "#F0EBE1",
        },
        charcoal: {
          DEFAULT: "#2C2C2C",
          light: "#4A4A4A",
        },
      },

      fontFamily: {
        poppins: ["Poppins", "system-ui", "sans-serif"],
        serif: ["Georgia", "Times New Roman", "serif"],
        cormorant: ["Cormorant Garamond", "serif"],
        bodoni: ["Bodoni Moda", "serif"],
        serifnew: "'Cormorant Garamond', 'Georgia', serif",
        sans: "'Outfit', 'system-ui', sans-serif",


      },

      animation: {
        marquee: "marquee 30s linear infinite",
      },

      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;