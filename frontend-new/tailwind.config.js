/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a', // Deep dark blue-black
        card: '1e293b',        // Card background
        primary: '#8b5cf6',    // Purple (main accent) 
        accent: '#06b6d4',     // Cyan  
        neon: '#c084fc',       // Light purple for highlights
        danger: '#ef4444',     // Red for logout/errors
        success: '#10b981',    // Green if needed later
      },
    },
  },
  plugins: [],
};

