import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      screens: {
        // Two-column layout (board left, found words right): any screen at
        // least 1024px wide, plus tablets and small windows in landscape.
        wide: { raw: "(min-width: 1024px), (min-width: 768px) and (orientation: landscape)" },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        // Botanical Minimal (Dark) — refined near-neutral dark stage.
        bg: "#131512",
        surface: "#1D211B",
        ink: "#F0EFE6",
        muted: "#9CA596",
        // The letter grid is a flower: gold center (sun), purple/lilac petals.
        gold: { DEFAULT: "#E6B45A", ink: "#3B2704", soft: "#695329" },
        petal: { idle: "#4E3E62", found: "#B48CE0", ink: "#241433" },
        // Foliage accent used for incidental UI icons (menu, rank badges, button icons).
        leaf: "#8FD19F",
        rose: { DEFAULT: "#D98FA3", ink: "#3A1420" },
        // "Garden of blooms" found-words palette — longer words, richer blooms.
        bloom4: { DEFAULT: "#4A6B3E", ink: "#F0EFE6" },
        bloom5: { DEFAULT: "#C9875A", ink: "#3A2210" },
        bloom6: { DEFAULT: "#A47FD1", ink: "#241433" },
        bloom7: { DEFAULT: "#E6B655", ink: "#3B2704" },
        bloom8: { DEFAULT: "#D9668C", ink: "#3A1420" },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "sans-serif"],
        body: ["var(--font-body)", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
