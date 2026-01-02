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
        border: {
          DEFAULT: "var(--border)",
          light: "var(--border-light)",
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'scale-in': 'scale-in 0.5s ease-out forwards',
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        'glass-lg': '0 12px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'glow-accent': '0 0 50px rgba(160, 99, 255, 0.4), 0 0 100px rgba(160, 99, 255, 0.2)',
        'glow-protein': '0 0 40px rgba(71, 172, 177, 0.4)',
        'glow-carbs': '0 0 40px rgba(255, 205, 52, 0.4)',
        'glow-fat': '0 0 40px rgba(223, 0, 255, 0.4)',
      },
    },
  },
  plugins: [],
};
export default config;
