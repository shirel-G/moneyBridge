/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'banking-blue': '#007AFF',
        'banking-bg': '#F5F5F7',
      },
      fontFamily: {
        sans: ['Inter', 'Heebo', 'Noto Sans Arabic', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
