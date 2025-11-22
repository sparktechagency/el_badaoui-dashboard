/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3F51B5",
        secondary: "#fce7c9",
        base: "#4E4E4E",
      },
    },
  },
  plugins: [],
};
