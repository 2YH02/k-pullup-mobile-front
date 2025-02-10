import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/provider/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/context/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#f9b4ab",
        "primary-dark": "#f29992",
        "primary-light": "#facec8",
        white: "#fff",
        black: "#232323",
        "black-light": "#333",
        "grey-light": "#eee",
        grey: "#9e9e9e",
        "grey-dark": "#5a5a5a",
        red: "#f55656",
        blue: "#2196f3",
        green: "#62c466",
        coral: "#f9b4ab",
        "coral-dark": "#f29992",
        beige: "#fdebd3",
        "dark-teel": "#264e70",
        "grayish-teel": "#679186",
        "pale-mint": "#679186",
      },
      animation: {
        "slide-left-out": "0.2s ease-in forwards slide-left-out",
        "slide-left-in": "0.2s ease-out slide-left-in",
        "slide-right-out": "0.2s ease-in forwards slide-right-out",
        "slide-right-in": "0.2s ease-out slide-right-in",
        "slide-bottom-out": "0.2s ease-in forwards slide-bottom-out",
        "slide-bottom-in": "0.2s ease-out slide-bottom-in",
        "scale-up": "scale-up 0.5s ease-out forwards",
      },
      keyframes: {
        "slide-left-out": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
        "slide-left-in": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-right-out": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(100%)" },
        },
        "slide-right-in": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-bottom-out": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(100%)" },
        },
        "slide-bottom-in": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "scale-up": {
          "0%": { transform: "scale(0)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
