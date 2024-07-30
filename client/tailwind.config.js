
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure this path matches your project structure
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00adb5",
        secondary: "#0f5050",
      }
    },
  },
  plugins: [],
}

