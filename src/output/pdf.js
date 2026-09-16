const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function createPdfDocument(outputPath) {
  if (!outputPath) {
    throw new Error("PDF output path is required.");
  }

  const directory = path.dirname(outputPath);

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  const document = new PDFDocument({
    size: "A4",
    margins: {
      top: 51,
      bottom: 51,
      left: 51,
      right: 51
    },
    info: {
      Title: "Exercise Book",
      Author: "Exercise Book Generator",
      Subject: "Primary School Exercise Book"
    }
  });

  const stream = fs.createWriteStream(outputPath);

  document.pipe(stream);

  return {
    document,
    stream,
    outputPath
  };
}

function finalizePdf(document) {
  document.end();
}

module.exports = {
  createPdfDocument,
  finalizePdf
};
