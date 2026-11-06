/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pedidosya: {
          red: '#EA0038',
          darkRed: '#D00032',
          lightRed: '#FFF0F2',
          accent: '#FF4D6D',
          dark: '#1C1C1E',
          gray: '#F5F5F7',
          border: '#E5E5EA',
          pucv: '#002B49', // PUCV Navy Blue accent
          pucvGold: '#D4AF37'
        }
      }
    },
  },
  plugins: [],
}
