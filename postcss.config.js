const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

module.exports = {
  plugins: [
    autoprefixer,
    cssnano({ preset: "default" }), // set default minification settings
  ],
};
