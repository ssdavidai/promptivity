/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        'press-start': ['"Press Start 2P"', 'cursive'],
      },
      colors: {
        'custom-bg': 'rgb(15, 33, 53)',
      },
    },
  },
  plugins: [],
}

