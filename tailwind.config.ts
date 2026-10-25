import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { animation: { marquee: "marquee var(--duration, 30s) linear infinite", "marquee-reverse": "marquee-reverse var(--duration, 30s) linear infinite" }, keyframes: { marquee: { to: { transform: "translateX(-50%)" } }, "marquee-reverse": { from: { transform: "translateX(-50%)" }, to: { transform: "translateX(0)" } } } } },
  plugins: [],
} satisfies Config;
