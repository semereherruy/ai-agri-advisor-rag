/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'agri-green': {
          50: '#F6FBF7',
          100: '#E6F8ED',
          500: '#60A664',
          600: '#2F9E44',
          700: '#278A3A',
          900: '#0B2B17',
        },
        'agri-gray': {
          500: '#65746B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.6s ease-out',
      },
    },
  },
  plugins: [],
}