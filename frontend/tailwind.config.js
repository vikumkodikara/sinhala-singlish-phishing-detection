/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0B0F19',
          card: '#111827',
          elevated: '#1E293B',
          cyan: '#06B6D4',
          blue: '#3B82F6',
          danger: '#EF4444',
          safe: '#10B981',
          warning: '#F59E0B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Sinhala', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
