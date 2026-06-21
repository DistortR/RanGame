/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      colors: {
        surface: '#1E2128',
        gold: '#F2C14E',
        ember: '#EF5B5B',
        muted: '#8B8D98',
      },
    },
  },
  plugins: [],
};