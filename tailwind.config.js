/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F9FAFB',
        primary: {
          DEFAULT: '#F59E0B', // Orange/Amber
          dark: '#D97706',
        },
        secondary: {
          DEFAULT: '#48C9B0', // Teal
          dark: '#1ABC9C',
        },
        lost: {
          bg: '#FEF3C7',
          text: '#D97706',
        },
        found: {
          bg: '#E6FFFA',
          text: '#0D9488',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
