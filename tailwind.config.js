/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          // Adds the 'font-display' class
          // You can change 'Inter' to 'Poppins', 'Lato', or your preferred font
          display: ['Inter', 'system-ui', 'sans-serif'],
          body: ['Inter', 'system-ui', 'sans-serif'],
        },
        colors: {
          // Optional: You can alias the hex codes here if you want cleaner code later
          adhyaksa: {
            light: '#a62529',
            DEFAULT: '#8b1f23', // The main red used
            dark: '#5c1416',
            gold: '#d4af37',
          }
        },
        animation: {
          'fade-in': 'fadeIn 0.5s ease-out forwards',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0', transform: 'translateY(10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
        },
      },
    },
    plugins: [],
  }