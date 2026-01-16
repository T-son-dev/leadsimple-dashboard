/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ls-blue': '#2563eb',
        'ls-green': '#10b981',
        'ls-orange': '#f59e0b',
        'ls-red': '#ef4444',
        'ls-purple': '#8b5cf6',
        'ls-gray': '#6b7280',
        'sidebar': '#1e293b',
        'sidebar-hover': '#334155',
      },
    },
  },
  plugins: [],
}
