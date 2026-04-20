/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"DM Serif Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        sage: {
          100: '#e8ede8',
          200: '#d0dbd0',
          400: '#7a9e7e',
          600: '#4a7a4e',
          700: '#3a6a3e',
        },
      },
    },
  },
  plugins: [],
}
