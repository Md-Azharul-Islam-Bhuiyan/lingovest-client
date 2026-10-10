/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    extend: {
      fontFamily: {
        'display': ['"Baloo 2"', 'Nunito', 'cursive'],
        'body': ['Nunito', '"Segoe UI"', 'sans-serif'],
      },
      colors: {
        candy: {
          pink: '#FF6B9D',
          purple: '#C084FC',
          blue: '#60A5FA',
          teal: '#2DD4BF',
          green: '#4ADE80',
          yellow: '#FBBF24',
          orange: '#FB923C',
          red: '#F87171',
        },
        primary: {
          DEFAULT: '#7C3AED',
          light: '#A78BFA',
          dark: '#5B21B6',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#7C3AED',
          600: '#6D28D9',
          700: '#5B21B6',
        },
      },
      borderRadius: {
        'playful': '20px',
        'bubble': '28px',
        'pill': '9999px',
      },
      boxShadow: {
        'playful': '0 8px 30px rgba(124, 58, 237, 0.15), 0 2px 8px rgba(0,0,0,0.06)',
        'playful-lg': '0 20px 60px rgba(124, 58, 237, 0.2), 0 4px 16px rgba(0,0,0,0.08)',
        'candy': '0 8px 30px rgba(255, 107, 157, 0.2)',
        'glow-purple': '0 0 20px rgba(124, 58, 237, 0.3)',
        'glow-blue': '0 0 20px rgba(96, 165, 250, 0.3)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "wiggle": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-3deg)" },
          "75%": { transform: "rotate(3deg)" },
        },
        "scale-up": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "bounce-gentle": "bounce-gentle 2s ease-in-out infinite",
        "wiggle": "wiggle 1s ease-in-out infinite",
        "scale-up": "scale-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
}
