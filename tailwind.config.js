/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // FitTrack design tokens — match the web app exactly
        primary: '#f97316',        // orange-500
        'primary-dark': '#ea6c10',
        surface: 'rgba(255,255,255,0.05)',
        'surface-hover': 'rgba(255,255,255,0.08)',
        border: 'rgba(255,255,255,0.10)',
        'border-strong': 'rgba(255,255,255,0.18)',
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  presets: [require("nativewind/preset")],
  plugins: [],
}
