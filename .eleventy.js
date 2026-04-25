module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });

  eleventyConfig.addFilter("formatDate", (date, locale = "tr") => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
      year: "numeric", month: "long", day: "numeric"
    });
  });

  eleventyConfig.addFilter("limit", (arr, n) => arr.slice(0, n));

  eleventyConfig.addCollection("postsTr", (api) =>
    api.getFilteredByGlob("src/tr/blog/posts/*.md").reverse()
  );
  eleventyConfig.addCollection("postsEn", (api) =>
    api.getFilteredByGlob("src/en/blog/posts/*.md").reverse()
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html", "11ty.js"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
