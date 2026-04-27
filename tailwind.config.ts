import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: "#0F1923",
        amber: "#D97B2A",
        bone: "#F0EBE1",
        olive: "#1A3A2A",
        steel: "#4A5568",
        dust: "#E2DDD6",
      },
      fontFamily: {
        syne: ["var(--font-syne)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.02em",
        caps: "0.08em",
      },
      lineHeight: {
        body: "1.7",
      },
      fontSize: {
        label: ["11px", { lineHeight: "1", letterSpacing: "0.08em" }],
        "label-sm": ["12px", { lineHeight: "1", letterSpacing: "0.08em" }],
      },
      borderColor: {
        DEFAULT: "#E2DDD6",
      },
    },
  },
  plugins: [],
};

export default config;
