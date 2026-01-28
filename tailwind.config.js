module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class",
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Roboto", "Helvetica Neue", "sans-serif"],
      },
    },
  },
  plugins: [],
};
