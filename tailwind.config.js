/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0D0D0D',
        surface: '#171717',
        'surface-2': '#1f1f1f',
        paper: '#FFFFFF',
        mist: '#E5E5E5',
        ember: '#CE8D00',
        customYellow: '#CE8D00',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        '8xl': '88rem',
      },
    },
  },
  plugins: [],
};
