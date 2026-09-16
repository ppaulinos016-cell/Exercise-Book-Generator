const fs = require("fs");
const path = require("path");

const projectPath = path.join(
  __dirname,
  "..",
  "output",
  "book-project.json"
);

function saveBookProject(book) {
  if (!book || typeof book !== "object") {
    throw new Error("Book project data is required.");
  }

  const outputDirectory = path.dirname(projectPath);

  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
  }

  fs.writeFileSync(
    projectPath,
    JSON.stringify(book, null, 2),
    "utf8"
  );

  return projectPath;
}

function loadBookProject() {
  if (!fs.existsSync(projectPath)) {
    return null;
  }

  return JSON.parse(
    fs.readFileSync(projectPath, "utf8")
  );
}

module.exports = {
  saveBookProject,
  loadBookProject,
  projectPath
};
