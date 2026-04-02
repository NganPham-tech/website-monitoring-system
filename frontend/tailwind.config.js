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
        Grays: {
          'Gray-4': '#D1D1D6'
        },
        Accents: {
          Blue: '#0F6EC0'
        },
        accent: {
          link: '#10B981',
          blue: '#3B82F6'
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
