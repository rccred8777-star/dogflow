/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#FFF6EF',
          100: '#FFF0E4',
          200: '#FFE0C7',
          300: '#FFC79B',
          400: '#FB9A4D',
          500: '#F26B0F',
          600: '#E25E08',
          700: '#A35408',
          800: '#7F3010',
          900: '#5f2509',
        },
        surface: '#FAFAF7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
