/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sage: {
          50:  '#f3f6ef',
          100: '#e3ecdb',
          200: '#c6d9b8',
          300: '#a0be8d',
          400: '#8aae72',
          500: '#6d9455',
          600: '#557643',
          700: '#435e35',
          800: '#364c2c',
          900: '#2c3f24',
        },
      },
      fontFamily: {
        script: ['"Dancing Script"', 'cursive'],
      },
    },
  },
  plugins: [],
}
