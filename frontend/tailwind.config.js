
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jiraBlue: {
          DEFAULT: '#0052CC',
          light: '#4C9AFF',
          dark: '#003366',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}