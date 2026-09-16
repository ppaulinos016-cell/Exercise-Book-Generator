const fs = require("fs");
const path = require("path");

const { generateCompleteBook } = require("./complete-book-generator");

function loadBookConfig() {
  const configPath = path.join(
    __dirname,
    "..",
    "..",
    "book-config.json"
  );

  if (!fs.existsSync(configPath)) {
    throw new Error("book-config.json not found.");
  }

  return JSON.parse(fs.readFileSync(configPath, "utf8"));
}

function generateBook(bookInfo, units = [], illustration = {}) {
  const config = loadBookConfig();

  const completeBookInfo = {
    ...config.book,
    ...bookInfo,
    numberOfUnits: Number(bookInfo.numberOfUnits)
  };

  return generateCompleteBook(
    completeBookInfo,
    units,
    illustration
  );
}

module.exports = {
  loadBookConfig,
  generateBook
};
