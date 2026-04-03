/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#F0FAF7',
          DEFAULT: '#10B981',
          dark: '#064E3B',
        },
        accent: {
          blue: '#2C598C',
          link: '#0F6EC0',
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
