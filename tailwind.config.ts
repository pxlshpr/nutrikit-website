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
        'card-bg': "var(--card-bg)",
        'card-bg-solid': "var(--card-bg-solid)",
        primary: "var(--primary)",    // Hot Magenta
        secondary: "var(--secondary)", // Electric Cyan
        tertiary: "var(--tertiary)",   // Sunset Orange
        'border-default': "var(--border-default)",
        'border-active': "var(--border-active)",
      },
      fontFamily: {
        heading: ['var(--font-orbitron)', 'sans-serif'],
        mono: ['var(--font-share-tech)', 'monospace'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'rotate': 'rotate 20s linear infinite',
        'holographic-shift': 'holographic-shift 3s ease infinite',
        'glitch': 'glitch 0.3s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 255, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 255, 255, 0.8)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        rotate: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        'holographic-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 255, 255, 0.4)',
        'glow-cyan-strong': '0 0 30px rgba(0, 255, 255, 0.6), 0 0 50px rgba(0, 255, 255, 0.3)',
        'glow-magenta': '0 0 20px rgba(255, 0, 255, 0.4)',
        'glow-magenta-strong': '0 0 30px rgba(255, 0, 255, 0.6), 0 0 50px rgba(255, 0, 255, 0.3)',
        'glow-orange': '0 0 20px rgba(255, 153, 0, 0.4)',
      },
    },
  },
  plugins: [],
};
export default config;
