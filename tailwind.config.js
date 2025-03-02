module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Ensure Tailwind scans all files
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "Helvetica Neue", "sans-serif"], // Set as default sans-serif
      },
    },
  },
  plugins: [],
};
