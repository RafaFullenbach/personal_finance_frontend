/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  //  corePlugins: {
  //   preflight: false,
  // },
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Roboto", "Helvetica Neue", "sans-serif"],
      },
    },
  },
  plugins: [],
};
