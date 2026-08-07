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
          DEFAULT: '#FBBF24', // Sophisticated Gold/Yellow
          light: '#FDE68A',
          dark: '#F59E0B',
        },
        secondary: {
          DEFAULT: '#14B8A6', // Teal for accents
        },
        lost: {
          bg: '#FFE4E6', // Muted Rose background
          text: '#E11D48', // Deep Rose text
        },
        found: {
          bg: '#D1FAE5', // Muted Emerald background
          text: '#059669', // Deep Emerald text
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 4px 12px -4px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 24px -4px rgba(0, 0, 0, 0.08), 0 8px 16px -6px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
