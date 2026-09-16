const { createCover } = require("./cover-generator");
const { createFrontMatter } = require("./front-matter-generator");
const { createBackCover } = require("./back-cover-generator");
const { createBook } = require("./book-generator");

function generateCompleteBook(bookInfo, units = [], illustration = {}) {
  const result = createBook(bookInfo, units);

  if (!result.success) {
    return result;
  }

  const cover = createCover(bookInfo, illustration);
  const frontMatter = createFrontMatter(bookInfo, units);
  const backCover = createBackCover(bookInfo);

  return {
    success: true,

    book: {
      ...result.book,

      cover,
      frontMatter,
      units,
      backCover
    }
  };
}

module.exports = {
  generateCompleteBook
};
