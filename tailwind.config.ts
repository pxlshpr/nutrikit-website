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
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        accent: {
          DEFAULT: "var(--accent)",
          light: "var(--accent-light)",
          soft: "var(--accent-soft)",
        },
        protein: {
          DEFAULT: "var(--protein)",
          light: "var(--protein-light)",
          soft: "var(--protein-soft)",
        },
        carbs: {
          DEFAULT: "var(--carbs)",
          light: "var(--carbs-light)",
          soft: "var(--carbs-soft)",
        },
        fat: {
          DEFAULT: "var(--fat)",
          light: "var(--fat-light)",
          soft: "var(--fat-soft)",
        },
        success: {
          DEFAULT: "var(--success)",
          light: "var(--success-light)",
        },
        "section-alt": "var(--section-alt)",
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
