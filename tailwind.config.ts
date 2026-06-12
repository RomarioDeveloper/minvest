import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Inter Tight"', "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ['"Cormorant Garamond"', "ui-serif", "Georgia", "serif"],
      },
      colors: {
        ink: {
          DEFAULT: "#08080a",
          deep: "#050506",
          panel: "#101013",
          edge: "#1a1a1f",
          line: "#26262d",
        },
        bone: {
          DEFAULT: "#f4f4f5",
          soft: "#d4d4d8",
          mute: "#a1a1aa",
          dim: "#71717a",
        },
      },
      letterSpacing: {
        tightest: "-0.055em",
        ultra: "-0.07em",
      },
      fontSize: {
        // editorial display sizes
        display: ["clamp(48px, 8vw, 132px)", { lineHeight: "0.92", letterSpacing: "-0.055em" }],
        eyebrow: ["11px", { lineHeight: "1.2", letterSpacing: "0.32em" }],
      },
      animation: {
        "fade-up": "fadeUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) both",
        "slow-zoom": "slowZoom 20s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slowZoom: {
          from: { transform: "scale(1)" },
          to: { transform: "scale(1.08)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
