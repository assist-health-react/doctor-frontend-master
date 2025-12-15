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
          DEFAULT: '#E31837', // Main red
          dark: '#CE2B37',    // Italian flag red
        },
        secondary: {
          DEFAULT: '#0047AB', // Restaurant text blue
        },
        accent: {
          green: '#009246',   // Italian flag green
          white: '#FFFFFF',   // Pure white
          black: '#000000',   // Chef outline
        },
        background: {
          light: '#FFFFFF',   // White background
          cream: '#FFF8F3',   // Warm background
        }
      },
      fontFamily: {
        display: ['Oswald', 'sans-serif'],     // For "THALASSERY" text style
        cursive: ['Dancing Script', 'cursive'], // For "Restaurant" text style
        sans: ['Inter', 'sans-serif'],         // For regular text
      },
      screens: {
        'mobile': {'max': '639px'},  // Mobile devices
        'tablet': '640px',           // Tablet devices
        'laptop': '1024px',          // Laptop devices
        'desktop': '1280px',         // Desktop devices
        'wide': '1536px',           // Added for ultra-wide support
      },
      maxWidth: {
        'screen-xl': '1536px',  // For very large screens
        'screen-2xl': '1920px', // For ultra-wide screens
      },
      width: {
        'sidebar': '16rem',     // 256px sidebar
        'content': 'calc(100% - 16rem)', // Remaining space
      },
    },
  },
  plugins: [],
}