/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'mbase': '0.90rem',    // Custom size 1
        'huge': '5rem',       // Custom size 2
        'xxl': '3.5rem',      // Custom size 3
      },
    },
  },
  plugins: [],
}