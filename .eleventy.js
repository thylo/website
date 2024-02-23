const friends = require("./src/_data/friends.json");
const yaml = require("js-yaml");
const { EleventyRenderPlugin } = require("@11ty/eleventy");

module.exports = (eleventyConfig) => {
  eleventyConfig.addDataExtension("yaml, yml", (contents) =>
      yaml.load(contents)
  );

  eleventyConfig.addShortcode("friend", (slug) => {
    const friend = friends.find((f) => f.slug === slug);
    if (!friend) {
      return `<span style='color:red'>${slug}</span>`;
    }
    return `<a href="${friend.link}" target="_blank">${friend.name}</a>`;
  });


  // ignores
  eleventyConfig.ignores.add("src/assets/**/*");
  eleventyConfig.watchIgnores.add("src/assets/**/*");

  // passthrough copy
  eleventyConfig.setServerPassthroughCopyBehavior("copy");
  eleventyConfig.addPassthroughCopy({ "./src/static": "/" });
  //eleventyConfig.addPassthroughCopy("./src/assets/img");
  eleventyConfig.addPassthroughCopy("./src/assets/fonts");
  eleventyConfig.addPassthroughCopy("./src/assets/svg");

  // server config
  eleventyConfig.setServerOptions({
    watch: ["./dist/assets/css/**/*.css", "./dist/assets/js/**/*.js"],
    port: 3000,
  });



  // base config
  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["liquid", "md", "yml", "jmo"],
    htmlTemplateEngine: "liquid",
    markdownTemplateEngine: "liquid",
  };
};
