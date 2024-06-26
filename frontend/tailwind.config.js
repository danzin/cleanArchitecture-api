import daisyui from 'daisyui';
/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{html, js, ts, jsx}", 
    "./src/**/*"
    ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
}