import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "simmpy-green": "#6AB04C",
        "simmpy-yellow": "#F9CA24",
        "simmpy-red": "#c13f0b",
        "simmpy-gray-100": "#E1E1E6",
        "simmpy-gray-200": "#5E5E5E",
        "simmpy-gray-600": "#444444",
        "simmpy-gray-800": "#2B2B2B",
        "simmpy-gray-900": "#121214",
      },
      fontFamily: {
        montserrat: ["var(--font-montserrant)"],
        lato: ["var(--font-lato)"],
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
} satisfies Config;
