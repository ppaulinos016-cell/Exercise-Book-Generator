const {
  Document,
  Packer,
  Paragraph,
  HeadingLevel
} = require("docx");

const fs = require("fs");
const path = require("path");

async function createDocxDocument(book, outputPath) {
  if (!book) {
    throw new Error("Book data is required.");
  }

  if (!outputPath) {
    throw new Error("DOCX output path is required.");
  }

  const directory = path.dirname(outputPath);

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  const children = [];

  children.push(
    new Paragraph({
      text: book.information?.title || "Exercise Book",
      heading: HeadingLevel.TITLE
    })
  );

  children.push(
    new Paragraph({
      text: book.information?.subtitle || ""
    })
  );

  children.push(
    new Paragraph({
      text: `${book.information?.subject || ""} — ${book.information?.grade || ""}`
    })
  );

  for (const unit of book.units || []) {
    children.push(
      new Paragraph({
        text: `Unit ${unit.number}: ${unit.title || ""}`,
        heading: HeadingLevel.HEADING_1
      })
    );

    for (const exercise of unit.exercises || []) {
      children.push(
        new Paragraph({
          text: `Exercise ${exercise.number}: ${exercise.title || ""}`,
          heading: HeadingLevel.HEADING_2
        })
      );

      if (exercise.instructions) {
        children.push(
          new Paragraph({
            text: exercise.instructions
          })
        );
      }
    }
  }

  const document = new Document({
    sections: [
      {
        children
      }
    ]
  });

  const buffer = await Packer.toBuffer(document);
  fs.writeFileSync(outputPath, buffer);

  return outputPath;
}

module.exports = {
  createDocxDocument
};
