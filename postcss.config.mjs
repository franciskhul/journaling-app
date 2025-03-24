const config = {
  plugins: {
    "@tailwindcss/postcss": {
      config: "./tailwind.config.js", // Explicit path to config
    },
    autoprefixer: {},
  },
};
export default config;
