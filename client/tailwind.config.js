import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#FFB347",
          DEFAULT: "#FF7A1A",
        },
        gray: {
          dark: "#111111",
          medium: "#444444",
          light: "#555555",
          lightest: "#F3F4F6",
        },
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(to right, #FF7A1A, #FFB347)",
      },
    },
  },
  plugins: [
    typography,
  ],
};
