/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",   // ← This line is the fix
    "./public/index.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}