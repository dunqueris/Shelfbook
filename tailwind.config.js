/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
      colors: {
        dark: {
          bg: '#000000',
          surface: '#0a0a0a',
          border: '#1a1a1a',
          text: '#ffffff',
          'text-muted': '#a0a0a0',
        },
      },
    },
  },
  plugins: [],
}
