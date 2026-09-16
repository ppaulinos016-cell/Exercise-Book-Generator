const path = require("path");
const fs = require("fs");

const illustrationsDirectory = path.join(
  __dirname,
  "..",
  "..",
  "assets",
  "illustrations"
);

function ensureIllustrationsDirectory() {
  if (!fs.existsSync(illustrationsDirectory)) {
    fs.mkdirSync(illustrationsDirectory, { recursive: true });
  }

  return illustrationsDirectory;
}

function listIllustrations() {
  ensureIllustrationsDirectory();

  return fs
    .readdirSync(illustrationsDirectory)
    .filter(file => /\.(png|jpg|jpeg|webp|svg)$/i.test(file));
}

function getIllustrationPath(fileName) {
  if (!fileName) {
    return null;
  }

  ensureIllustrationsDirectory();

  const filePath = path.join(illustrationsDirectory, fileName);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return filePath;
}

module.exports = {
  illustrationsDirectory,
  ensureIllustrationsDirectory,
  listIllustrations,
  getIllustrationPath
};
