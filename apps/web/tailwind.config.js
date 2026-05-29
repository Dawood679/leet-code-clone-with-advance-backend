/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#f5a623',
          dark: '#d4891e'
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};
