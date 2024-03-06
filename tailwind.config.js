/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    preflight: false,
  },
  mode: 'jit',
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3eff5',
          100: '#dad0e1',
          200: '#c1b1cd',
          300: '#9c83af',
          400: '#765a8c',
          500: '#5a446b',
          600: '#271e2f',
          700: '#1a141f',
        },
        secondary: {
          50: '#edf7ee',
          100: '#c9e8cd',
          200: '#81ca8b',
          300: '#4bb459',
          400: '#357e3e',
          500: '#225228',
          600: '#0f2412',
          700: '#0f2412',
        },
        tertiary: {
          50: '#fff0e6',
          100: '#ffe0cc',
          200: '#ffc299',
          300: '#ffa366',
          400: '#ff8533',
          500: '#ff6600',
          600: '#b34700',
          700: '#662900',
        },
      },
    },
    screens: {
      xs: '400px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  plugins: [],
};
