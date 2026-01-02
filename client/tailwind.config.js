/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#6366f1', // Indigo accent
                secondary: '#8b5cf6', // Purple accent
                accent: '#ec4899', // Pink accent
                bg: '#0a0a0a', // Deep black background
                'bg-secondary': '#141414', // Slightly lighter black
                'text-dark': '#ffffff', // White text
                'text-light': '#a1a1aa', // Grey text
                'glass-border': 'rgba(255, 255, 255, 0.1)',
                'glass-bg': 'rgba(255, 255, 255, 0.05)',
            },
            fontFamily: {
                sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
            },
            backdropBlur: {
                'xs': '2px',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            }
        },
    },
    plugins: [],
}
