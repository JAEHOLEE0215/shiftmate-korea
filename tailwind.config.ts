import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        mist: "#eef3f6",
        leaf: "#2f7d57",
        amber: "#f2b84b",
        coral: "#e06b5f",
      },
      boxShadow: {
        soft: "0 12px 30px rgba(23, 32, 51, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
