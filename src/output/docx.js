const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  PageBreak,
  AlignmentType
} = require("docx");

const fs = require("fs");
const path = require("path");

function pageBreak() {
  return new Paragraph({
    children: [new PageBreak()]
  });
}

function heading(text, level = HeadingLevel.HEADING_1, size = 30) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: {
      before: 0,
      after: 180
    },
    children: [
      new TextRun({
        text: String(text || ""),
        bold: true,
        underline: {
          type: "single"
        },
        size
      })
    ]
  });
}

function addContentPreserved(children, content, options = {}) {
  if (content === undefined || content === null || content === "") {
    return;
  }

  const size = options.size || 22;
  const bold = options.bold || false;

  for (const line of String(content).split(/\r?\n/)) {
    children.push(
      new Paragraph({
        spacing: {
          before: 0,
          after: 0,
          line: 260
        },
        children: [
          new TextRun({
            text: line,
            bold,
            size
          })
        ]
      })
    );
  }
}

function addSeparator(children) {
  children.push(
    new Paragraph({
      spacing: {
        before: 100,
        after: 160
      },
      border: {
        bottom: {
          color: "CBD5E1",
          style: "single",
          size: 6,
          space: 1
        }
      },
      children: [new TextRun("")]
    })
  );
}

function addCoverPage(children, book) {
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 900, after: 250 },
      children: [
        new TextRun({
          text: "ENGLISH EXERCISE BOOK",
          bold: true,
          size: 20
        })
      ]
    })
  );

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 250 },
      children: [
        new TextRun({
          text: book.information?.title || "English Exercise Book",
          bold: true,
          size: 36
        })
      ]
    })
  );

  if (book.information?.subtitle) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 220 },
        children: [
          new TextRun({
            text: book.information.subtitle,
            size: 24
          })
        ]
      })
    );
  }

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 220 },
      children: [
        new TextRun({
          text: `${book.information?.subject || ""} — ${book.information?.grade || ""}`,
          bold: true,
          size: 24
        })
      ]
    })
  );

  if (book.information?.author) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 500, after: 120 },
        children: [
          new TextRun({
            text: `Author: ${book.information.author}`,
            size: 22
          })
        ]
      })
    );
  }

  if (book.information?.edition || book.information?.year) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `${book.information?.edition || ""} ${book.information?.year || ""}`.trim(),
            size: 18
          })
        ]
      })
    );
  }
}

function addAboutPage(children) {
  children.push(pageBreak());
  children.push(heading("About This Book", HeadingLevel.HEADING_1, 30));

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 250 },
      children: [
        new TextRun({
          text: "English Exercise Book",
          bold: true,
          size: 24
        })
      ]
    })
  );

  addContentPreserved(
    children,
    "This exercise book is designed to provide clear and practical English practice for primary school learners. It contains units, exercises and activities that help learners practise the language introduced in class.",
    { size: 22 }
  );
}

function addHowToUsePage(children) {
  children.push(pageBreak());
  children.push(heading("How to Use This Book", HeadingLevel.HEADING_1, 30));

  addContentPreserved(
    children,
    "1. Read the instructions carefully before starting an exercise.\n2. Complete each activity neatly and carefully.\n3. Use the lessons taught in class to help you answer the exercises.\n4. Check your work after completing each activity.\n5. Write clearly and keep your exercise book clean.",
    { size: 22 }
  );
}

function addTableOfContents(children, units) {
  children.push(pageBreak());
  children.push(heading("Table of Contents", HeadingLevel.HEADING_1, 30));

  for (let i = 0; i < units.length; i++) {
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: `Unit ${units[i].number || i + 1}: ${units[i].title || ""}`,
            size: 22
          })
        ]
      })
    );
  }
}

function addUnit(children, unit) {
  children.push(pageBreak());

  children.push(
    new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: `Unit ${unit.number || ""}`,
          bold: true,
          underline: { type: "single" },
          size: 32
        })
      ],
      border: {
        bottom: {
          color: "1E3A8A",
          style: "single",
          size: 10,
          space: 2
        }
      }
    })
  );

  children.push(
    new Paragraph({
      spacing: { after: 180 },
      children: [
        new TextRun({
          text: unit.title || "Untitled Unit",
          bold: true,
          underline: { type: "single" },
          size: 28
        })
      ]
    })
  );

  if (unit.description) {
    addContentPreserved(children, unit.description, { size: 20 });
  }

  for (const exercise of unit.exercises || []) {
    children.push(
      new Paragraph({
        spacing: {
          before: 220,
          after: 100
        },
        children: [
          new TextRun({
            text: `Exercise ${exercise.number}: ${exercise.title || ""}`,
            bold: true,
            underline: { type: "single" },
            size: 25
          })
        ],
        border: {
          bottom: {
            color: "64748B",
            style: "single",
            size: 6,
            space: 2
          }
        }
      })
    );

    if (exercise.instructions) {
      children.push(
        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: exercise.instructions,
              size: 21
            })
          ]
        })
      );
    }

    addContentPreserved(children, exercise.content, { size: 21 });
    addSeparator(children);
  }
}

function addFinalPage(children) {
  children.push(pageBreak());

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 2200, after: 350 },
      children: [
        new TextRun({
          text: "Well Done!",
          bold: true,
          size: 38
        })
      ]
    })
  );

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "Keep practising English and doing your best.",
          size: 24
        })
      ]
    })
  );
}

function addBackCover(children, book) {
  children.push(pageBreak());

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 1000, after: 280 },
      children: [
        new TextRun({
          text: "ENGLISH EXERCISE BOOK",
          bold: true,
          size: 20
        })
      ]
    })
  );

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 220 },
      children: [
        new TextRun({
          text: book.information?.title || "English Exercise Book",
          bold: true,
          size: 32
        })
      ]
    })
  );

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 250 },
      children: [
        new TextRun({
          text: "Practice and improve your English.",
          size: 22
        })
      ]
    })
  );

  if (book.information?.subject || book.information?.grade) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `${book.information?.subject || ""} — ${book.information?.grade || ""}`,
            bold: true,
            size: 22
          })
        ]
      })
    );
  }

  if (book.information?.author) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 500 },
        children: [
          new TextRun({
            text: `Author: ${book.information.author}`,
            size: 20
          })
        ]
      })
    );
  }
}

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

  addCoverPage(children, book);
  addAboutPage(children);
  addHowToUsePage(children);
  addTableOfContents(children, book.units || []);

  for (const unit of book.units || []) {
    addUnit(children, unit);
  }

  addFinalPage(children);
  addBackCover(children, book);

  const document = new Document({
    sections: [
      {
        properties: {},
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
