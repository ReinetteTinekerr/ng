/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  purge: [
    './public/**/*.html',
     './app/**/*.{js,jsx,ts,tsx}',
  ],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./app/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'wave-pattern': "url(/public/wave.svg)"
      }
    },
  },
  plugins: [],
}
