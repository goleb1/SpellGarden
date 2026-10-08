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
        // Pangram pink — shared by the pangram chips and the pangram icons in the header.
        rose: { DEFAULT: "#F0569A", deep: "#E11D6A", ink: "#FFF4F8" },
        // "Garden of blooms" found-words palette. One ramp from quiet to vivid so a
        // longer word always looks better than a shorter one: soil (4) → sprout (5)
        // → leaf (6) → lilac bloom (7) → golden bloom (8+). Short words are most of
        // a puzzle (4s and 5s are ~58%), so they stay quiet and the blooms stay rare.
        bloom4: { DEFAULT: "#2B2721", ink: "#BDB4A4" },
        bloom5: { DEFAULT: "#24402D", ink: "#A9DDB6" },
        bloom6: { DEFAULT: "#3F7A52", ink: "#E6F6EA" },
        bloom7: { DEFAULT: "#B48CE0", ink: "#241433" },
        bloom8: { DEFAULT: "#E6B45A", ink: "#3B2704" },
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
