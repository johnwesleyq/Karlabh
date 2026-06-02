import type { Config } from "tailwindcss";

/**
 * Lekha — "digital ledger" design system.
 * Colors are exposed as HSL CSS variables in globals.css so we can theme
 * (and ship a dark mode later) without touching component code.
 */
const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        // Surfaces — alpha-value form so /opacity modifiers work everywhere
        paper: "hsl(var(--paper) / <alpha-value>)",
        ink: "hsl(var(--ink) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        // Brand: ledger-ink green
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
          soft: "hsl(var(--primary-soft) / <alpha-value>)",
        },
        // Accent: restrained saffron
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        // Kanban / status semantics
        status: {
          pending: "hsl(var(--status-pending) / <alpha-value>)",
          partial: "hsl(var(--status-partial) / <alpha-value>)",
          review: "hsl(var(--status-review) / <alpha-value>)",
          filed: "hsl(var(--status-filed) / <alpha-value>)",
          closed: "hsl(var(--status-closed) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 6px)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      boxShadow: {
        // Soft, neutral elevation — clean and bright
        xs: "0 1px 2px 0 hsl(220 20% 18% / 0.04)",
        sm: "0 1px 3px 0 hsl(220 20% 18% / 0.07), 0 1px 2px -1px hsl(220 20% 18% / 0.05)",
        md: "0 4px 16px -4px hsl(220 20% 18% / 0.10), 0 2px 6px -2px hsl(220 20% 18% / 0.06)",
        lg: "0 18px 44px -14px hsl(220 24% 18% / 0.16), 0 4px 12px -4px hsl(220 20% 18% / 0.08)",
        glow: "0 0 0 1px hsl(var(--primary) / 0.12), 0 12px 30px -8px hsl(var(--primary) / 0.30)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(hsl(var(--border) / 0.6) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border) / 0.6) 1px, transparent 1px)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "ticker": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
        "ticker": "ticker 30s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
