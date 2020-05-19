const friends = require("./src/_data/friends.json");

module.exports = function (eleventyConfig) {
  eleventyConfig.addShortcode("friend", (slug) => {
    const friend = friends.find((f) => f.slug === slug);
    if (!friend) {
      return `<span style='color:red'>${slug}</span>`;
    }
    return `<a href="${friend.link}" target="_blank">${friend.name}</a>`;
  });

  // Base config
  return {
    passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "dist",
    },
  };
};
