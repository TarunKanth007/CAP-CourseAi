/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode colors
        light: {
          bg: '#f8fafc',
          surface: '#ffffff',
          primary: '#2563eb',
          secondary: '#7c3aed',
          accent: '#059669',
          text: '#1f2937',
          'text-secondary': '#6b7280',
          border: '#e5e7eb',
        },
        // Dark mode colors
        dark: {
          bg: '#0f172a',
          surface: '#1e293b',
          primary: '#3b82f6',
          secondary: '#8b5cf6',
          accent: '#10b981',
          text: '#f1f5f9',
          'text-secondary': '#94a3b8',
          border: '#334155',
        }
      },
      backdropBlur: {
        '20': '20px',
      }
    },
  },
  plugins: [],
};
