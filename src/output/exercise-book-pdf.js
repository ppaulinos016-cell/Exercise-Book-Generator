const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const LEFT = 60;
const RIGHT = 535;
const CONTENT_WIDTH = RIGHT - LEFT;
const BOTTOM_LIMIT = 755;

function safe(value, fallback = "") {
  return String(value ?? fallback).trim();
}

function cleanPdfText(value) {
  let text = safe(value);

  // Remove known legacy corruption sequences.
  text = text.replace(/Ø[=<>][^\s,.;:!?)]*/g, "");
  text = text.replace(/%ï/g, "");

  // Normalize Unicode punctuation/symbol variants.
  text = text.replace(/\u00A0/g, " ");
  text = text.replace(/[\u2013\u2014]/g, "-");
  text = text.replace(/[\u2212]/g, "-");
  text = text.replace(/[\u2192\u27A1]/g, "->");
  text = text.replace(/[\u201C\u201D\u201E\u201F]/g, '"');
  text = text.replace(/[\u2018\u2019\u201A\u201B]/g, "'");
  text = text.replace(/\u2026/g, "...");
  text = text.replace(/\u00B7/g, ".");
  text = text.replace(/\u25EF/g, "( )");
  text = text.replace(/[\u25FB\u25FC\u25FD\u25FE]/g, "[ ]");

  // Remove invisible Unicode formatting/variation characters.
  text = text.replace(/[\u200B-\u200F\u202A-\u202E\u2060\uFE0E\uFE0F\uFEFF]/g, "");

  // Emoji handled by the illustration engine.
  const supportedEmoji = new Set([
    "✏","📖","📏","🖊","🔴","🔵","🟢","🟡","🟠","🟣","🟤","⚫","⚪","🩷",
    "👨","👩","👦","👧","👴","👵","🏫","🏥","🏪","🏦","⛪","⚽",
    "🍎","🍞","🥚","🍚","🍌","🥛","🐟","🍗","🍅","🧀","🍊","🥗","🥖","🍲",
    "🕐","🕒","🕕","🕘","🕛","🌅","☀","🌙","🏊","🚲","🎨","🎵","📚","🌳"
  ]);

  // Keep printable Latin/WinAnsi characters and supported emoji.
  // Everything else is replaced by a normal space.
  text = Array.from(text).map(ch => {
    const code = ch.codePointAt(0);
    if (supportedEmoji.has(ch)) return ch;
    if (code >= 0x20 && code <= 0xFF) return ch;
    return " ";
  }).join("");

  return text.trim();
}

function drawMiniIllustration(doc, emoji, x, y, size = 18) {
  const e = String(emoji || "");

  doc.save();
  doc.lineWidth(Math.max(1, size / 12));
  doc.strokeColor("#334155");
  doc.fillColor("#ffffff");

  const cx = x + size / 2;
  const cy = y + size / 2;

  if (e === "✏️" || e === "✏") {
    doc.fillColor("#facc15").roundedRect(x + 3, y + 5, size - 7, 8, 2).fillAndStroke();
    doc.fillColor("#f8fafc").rect(x + 1, y + 7, 4, 4).fillAndStroke();
    doc.fillColor("#334155").circle(x + 2, y + 9, 1.5).fill();
    doc.restore();
    return;
  }

  if (e === "📖") {
    doc.moveTo(cx, y + 3).lineTo(cx, y + size - 3).stroke();
    doc.roundedRect(x + 2, y + 3, size / 2 - 2, size - 6, 2).fillAndStroke();
    doc.roundedRect(cx, y + 3, size / 2 - 2, size - 6, 2).fillAndStroke();
    doc.restore();
    return;
  }

  if (e === "📏") {
    doc.fillColor("#fef08a").roundedRect(x + 2, y + 5, size - 4, 9, 2).fillAndStroke();
    for (let i = 0; i < 5; i++) {
      const tx = x + 5 + i * ((size - 10) / 4);
      doc.moveTo(tx, y + 5).lineTo(tx, y + (i % 2 === 0 ? 11 : 9)).stroke();
    }
    doc.restore();
    return;
  }

  if (e === "🖊️" || e === "🖊") {
    doc.fillColor("#2563eb").roundedRect(x + 4, y + 4, 10, size - 7, 2).fillAndStroke();
    doc.fillColor("#94a3b8").rect(x + 4, y + 4, 10, 3).fillAndStroke();
    doc.fillColor("#334155").rect(x + 7, y + size - 4, 4, 3).fillAndStroke();
    doc.restore();
    return;
  }

  if (e === "🔴" || e === "🔵" || e === "🟢" || e === "🟡" || e === "🟠" || e === "🟣" || e === "🟤" || e === "⚫" || e === "⚪" || e === "🩷") {
    const colours = {
      "🔴": "#ef4444",
      "🔵": "#3b82f6",
      "🟢": "#22c55e",
      "🟡": "#eab308",
      "🟠": "#f97316",
      "🟣": "#a855f7",
      "🟤": "#92400e",
      "⚫": "#111827",
      "⚪": "#ffffff",
      "🩷": "#f472b6"
    };
    doc.fillColor(colours[e]).circle(cx, cy, size / 2 - 2).fillAndStroke();
    doc.restore();
    return;
  }

  if (["👨","👩","👦","👧","👴","👵"].includes(e)) {
    const hair = ["👨","👦","👴"].includes(e);
    doc.fillColor("#f5cfa0").circle(cx, y + 6, size / 4).fillAndStroke();
    if (hair) {
      doc.fillColor("#334155").circle(cx, y + 4, size / 4 + 1).fill();
    }
    doc.fillColor("#60a5fa").roundedRect(x + 4, y + 9, size - 8, size - 10, 3).fillAndStroke();
    doc.restore();
    return;
  }

  if (["🏫","🏥","🏪","🏦","⛪"].includes(e)) {
    doc.fillColor("#f8fafc").rect(x + 3, y + 7, size - 6, size - 9).fillAndStroke();
    doc.fillColor("#64748b");
    doc.rect(x + 2, y + 3, size - 4, 5).fillAndStroke();
    doc.fillColor("#ffffff").rect(cx - 2, y + size - 8, 4, 7).fillAndStroke();
    doc.restore();
    return;
  }

  if (e === "⚽") {
    doc.fillColor("#ffffff").circle(cx, cy, size / 2 - 2).fillAndStroke();
    doc.fillColor("#334155").circle(cx, cy, 3).fill();
    doc.restore();
    return;
  }

  if (["🍎","🍞","🥚","🍚","🍌","🥛","🐟","🍗","🍅","🧀","🍊","🥗","🥖","🍲"].includes(e)) {
    const foodShapes = {
      "🍎": "#ef4444",
      "🍞": "#d6a15c",
      "🥚": "#f8fafc",
      "🍚": "#f8fafc",
      "🍌": "#facc15",
      "🥛": "#f8fafc",
      "🐟": "#60a5fa",
      "🍗": "#d97706",
      "🍅": "#ef4444",
      "🧀": "#facc15",
      "🍊": "#f97316",
      "🥗": "#22c55e",
      "🥖": "#d6a15c",
      "🍲": "#d6a15c"
    };
    doc.fillColor(foodShapes[e]).ellipse(x + 3, y + 4, size - 6, size - 7).fillAndStroke();
    doc.restore();
    return;
  }

  if (e === "🕐" || e === "🕒" || e === "🕕" || e === "🕘" || e === "🕛") {
    doc.fillColor("#ffffff").circle(cx, cy, size / 2 - 2).fillAndStroke();
    doc.moveTo(cx, cy).lineTo(cx, y + 5).stroke();
    doc.moveTo(cx, cy).lineTo(cx + size / 4, cy).stroke();
    doc.restore();
    return;
  }

  if (["🌅","☀️","🌙"].includes(e)) {
    doc.fillColor(e === "🌙" ? "#334155" : "#facc15").circle(cx, cy, size / 2 - 3).fillAndStroke();
    doc.restore();
    return;
  }

  if (["🏊","🚲","🎨","🎵","📚"].includes(e)) {
    doc.fillColor("#60a5fa").circle(cx, cy, size / 2 - 2).fillAndStroke();
    doc.restore();
    return;
  }

  if (e === "🌳") {
    doc.fillColor("#22c55e").circle(cx, y + 7, size / 3).fillAndStroke();
    doc.fillColor("#92400e").rect(cx - 2, y + 9, 4, 7).fillAndStroke();
    doc.restore();
    return;
  }

  doc.fillColor("#e2e8f0").roundedRect(x + 2, y + 2, size - 4, size - 4, 3).fillAndStroke();
  doc.restore();
}

function drawTextWithIllustrations(doc, text, x, y, width, options = {}) {
  const value = cleanPdfText(text);
  const tokens = value.split(/(✏️|✏|📖|📏|🖊️|🖊|🔴|🔵|🟢|🟡|🟠|🟣|🟤|⚫|⚪|🩷|👨|👩|👦|👧|👴|👵|🏫|🏥|🏪|🏦|⛪|⚽|🍎|🍞|🥚|🍚|🍌|🥛|🐟|🍗|🍅|🧀|🍊|🥗|🥖|🍲|🕐|🕒|🕕|🕘|🕛|🌅|☀️|🌙|🏊|🚲|🎨|🎵|📚|🌳)/g);
  let cursor = x;
  const lineHeight = options.lineHeight || 18;
  const size = options.imageSize || 16;

  for (const token of tokens) {
    if (!token) continue;

    if (/^(✏️|✏|📖|📏|🖊️|🖊|🔴|🔵|🟢|🟡|🟠|🟣|🟤|⚫|⚪|🩷|👨|👩|👦|👧|👴|👵|🏫|🏥|🏪|🏦|⛪|⚽|🍎|🍞|🥚|🍚|🍌|🥛|🐟|🍗|🍅|🧀|🍊|🥗|🥖|🍲|🕐|🕒|🕕|🕘|🕛|🌅|☀️|🌙|🏊|🚲|🎨|🎵|📚|🌳)$/.test(token)) {
      drawMiniIllustration(doc, token, cursor, y + 1, size);
      cursor += size + 4;
    } else {
      doc.font(options.font || "Helvetica")
        .fontSize(options.fontSize || 11)
        .fillColor(options.color || "#111827")
        .text(token, cursor, y, {
          lineBreak: false
        });
      cursor += doc.widthOfString(token);
    }
  }

  return y + lineHeight;
}
function addPageNumber(doc, number) {
  doc.font("Helvetica")
    .fontSize(9)
    .fillColor("#64748b")
    .text(String(number), 0, 765, {
      align: "center",
      width: PAGE_WIDTH
    });
}

function drawBookIcon(doc) {
  const x = 235;
  const y = 395;

  doc.save();

  doc.lineWidth(3);
  doc.strokeColor("#2563eb");
  doc.fillColor("#ffffff");

  doc.roundedRect(x, y, 58, 78, 5).fillAndStroke();
  doc.roundedRect(x + 67, y, 58, 78, 5).fillAndStroke();

  doc.moveTo(x + 61, y + 5)
    .lineTo(x + 61, y + 73)
    .stroke();

  doc.strokeColor("#93c5fd");
  doc.lineWidth(2);

  doc.moveTo(x + 12, y + 18).lineTo(x + 47, y + 18).stroke();
  doc.moveTo(x + 12, y + 31).lineTo(x + 47, y + 31).stroke();
  doc.moveTo(x + 12, y + 44).lineTo(x + 47, y + 44).stroke();

  doc.moveTo(x + 79, y + 18).lineTo(x + 114, y + 18).stroke();
  doc.moveTo(x + 79, y + 31).lineTo(x + 114, y + 31).stroke();
  doc.moveTo(x + 79, y + 44).lineTo(x + 114, y + 44).stroke();

  doc.restore();
}

function addCover(doc, book) {
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT).fill("#eff6ff");

  doc.fillColor("#1e3a8a")
    .font("Helvetica-Bold")
    .fontSize(17)
    .text("ENGLISH EXERCISE BOOK", 60, 80, {
      align: "center",
      width: CONTENT_WIDTH
    });

  doc.fillColor("#111827")
    .font("Helvetica-Bold")
    .fontSize(32)
    .text(
      cleanPdfText(book.title) || "English Exercise Book",
      55,
      170,
      {
        align: "center",
        width: 485
      }
    );

  doc.fillColor("#2563eb")
    .font("Helvetica-Bold")
    .fontSize(25)
    .text(
      cleanPdfText(book.className) || "Class 5 & 6",
      55,
      270,
      {
        align: "center",
        width: 485
      }
    );

  doc.fillColor("#111827")
    .font("Helvetica")
    .fontSize(19)
    .text("English", 55, 320, {
      align: "center",
      width: 485
    });

  drawBookIcon(doc);

  doc.fillColor("#374151")
    .font("Helvetica")
    .fontSize(15)
    .text(
      cleanPdfText(book.subtitle) || "Practice and Activities",
      55,
      515,
      {
        align: "center",
        width: 485
      }
    );

  doc.fontSize(14)
    .text(
      `Author: ${cleanPdfText(book.author) || "Author"}`,
      55,
      650,
      {
        align: "center",
        width: 485
      }
    );

  doc.fontSize(12)
    .text(
      `${cleanPdfText(book.edition) || "First Edition"} • ${cleanPdfText(book.year) || "2026"}`,
      55,
      690,
      {
        align: "center",
        width: 485
      }
    );

  if (cleanPdfText(book.email)) {
    doc.fontSize(10)
      .text(`Email: ${cleanPdfText(book.email)}`, 55, 720, {
        align: "center",
        width: 485
      });
  }

  if (cleanPdfText(book.contact)) {
    doc.fontSize(10)
      .text(`Contact: ${cleanPdfText(book.contact)}`, 55, 738, {
        align: "center",
        width: 485
      });
  }
}

function addAboutPage(doc, book) {
  doc.addPage();

  doc.fillColor("#111827")
    .font("Helvetica-Bold")
    .fontSize(27)
    .text("About This Book", 60, 70);

  doc.moveTo(60, 110)
    .lineTo(535, 110)
    .stroke("#2563eb");

  doc.font("Helvetica")
    .fontSize(13)
    .fillColor("#374151")
    .text(
      `This English Exercise Book has been designed for ${cleanPdfText(book.className) || "primary school learners"}.`,
      60,
      145,
      {
        width: CONTENT_WIDTH,
        lineGap: 7
      }
    );

  doc.moveDown(1);

  doc.text(
    "The book provides practical activities that help learners practise the English lessons they have already studied in class.",
    {
      width: CONTENT_WIDTH,
      lineGap: 7
    }
  );

  doc.moveDown(1);

  doc.text(`Author: ${cleanPdfText(book.author) || "Author"}`, {
    width: CONTENT_WIDTH,
    lineGap: 7
  });

  doc.text(`Edition: ${cleanPdfText(book.edition) || "First Edition"}`, {
    width: CONTENT_WIDTH,
    lineGap: 7
  });

  doc.text(`Year: ${cleanPdfText(book.year) || "2026"}`, {
    width: CONTENT_WIDTH,
    lineGap: 7
  });
}

function addHowToUsePage(doc) {
  doc.addPage();

  doc.fillColor("#111827")
    .font("Helvetica-Bold")
    .fontSize(27)
    .text("How to Use This Book", 60, 70);

  doc.moveTo(60, 110)
    .lineTo(535, 110)
    .stroke("#2563eb");

  const guidance = [
    "1. Follow the lesson carefully in class.",
    "2. Listen to your teacher and understand the lesson before using this exercise book.",
    "3. After the lesson, open the corresponding unit in this book.",
    "4. Read the instructions carefully before completing each exercise.",
    "5. Work independently and write your answers clearly.",
    "6. Ask your teacher for help when you do not understand an activity."
  ];

  let y = 150;

  guidance.forEach(item => {
    doc.font("Helvetica")
      .fontSize(14)
      .fillColor("#374151")
      .text(item, 65, y, {
        width: 465,
        lineGap: 7
      });

    y += 62;
  });

  doc.fontSize(14)
    .fillColor("#1e3a8a")
    .text(
      "Remember: this exercise book is for practice. The lesson should come first.",
      65,
      y + 15,
      {
        width: 465,
        lineGap: 7
      }
    );
}

function addTableOfContents(doc, units) {
  doc.addPage();

  doc.fillColor("#111827")
    .font("Helvetica-Bold")
    .fontSize(27)
    .text("Table of Contents", 60, 70);

  doc.moveTo(60, 110)
    .lineTo(535, 110)
    .stroke("#2563eb");

  doc.strokeColor("#1e3a8a")
    .lineWidth(1.5)
    .moveTo(60, 132)
    .lineTo(535, 132)
    .stroke();

  let y = 145;

  units.forEach((unit, index) => {
    const title = cleanPdfText(unit.title) || "Untitled Unit";

    doc.font("Helvetica")
      .fontSize(14)
      .fillColor("#374151")
      .text(`Unit ${index + 1}: ${title}`, 70, y, {
        width: 450
      });

    y += 30;

    if (y > 740 && index < units.length - 1) {
      doc.addPage();
      y = 70;
    }
  });
}

function startNewContentPage(doc) {
  doc.addPage();
  return 65;
}

function renderTextBlock(doc, text, x, y, width, options = {}) {
  const value = cleanPdfText(text);

  if (!value) {
    return y;
  }

  const fontSize = options.fontSize || 12;
  const lineGap = options.lineGap ?? 6;
  const hasIllustrations = /✏️|✏|📖|📏|🖊️|🖊|🔴|🔵|🟢|🟡|🟠|🟣|🟤|⚫|⚪|🩷|👨|👩|👦|👧|👴|👵|🏫|🏥|🏪|🏦|⛪|⚽|🍎|🍞|🥚|🍚|🍌|🥛|🐟|🍗|🍅|🧀|🍊|🥗|🥖|🍲|🕐|🕒|🕕|🕘|🕛|🌅|☀️|🌙|🏊|🚲|🎨|🎵|📚|🌳/.test(value);

  doc.font(options.font || "Helvetica")
    .fontSize(fontSize)
    .fillColor(options.color || "#111827");

  const height = doc.heightOfString(value, {
    width,
    lineGap
  });

  if (y + height > BOTTOM_LIMIT) {
    doc.addPage();
    y = 65;
  }

  if (!hasIllustrations) {
    doc.text(value, x, y, {
      width,
      lineGap
    });
    return y + height;
  }

  const lines = value.split(/\r?\n/);
  let currentY = y;
  const lineHeight = fontSize + lineGap + 2;

  for (const line of lines) {
    if (!line.trim()) {
      currentY += lineHeight;
      continue;
    }

    drawTextWithIllustrations(doc, line, x, currentY, width, {
      font: options.font || "Helvetica",
      fontSize,
      color: options.color || "#111827",
      lineHeight,
      imageSize: Math.min(18, fontSize + 4)
    });

    currentY += lineHeight;
  }

  return Math.max(currentY, y + height);
}

function drawUnit4MatchExercise(doc, y) {
  const leftX = 65;
  const imageX = 100;
  const rightX = 345;
  const rowStep = 25;

  doc.font("Helvetica-Bold")
    .fontSize(13)
    .fillColor("#111827")
    .text("A", leftX, y, { width: 180 })
    .text("B", rightX, y, { width: 180 });

  let rowY = y + 25;

  const items = [
    { number: "1.", image: "✏️", letter: "a.", word: "Book" },
    { number: "2.", image: "📖", letter: "b.", word: "Ruler" },
    { number: "3.", image: "📏", letter: "c.", word: "Pencil" },
    { number: "4.", image: "🖊️", letter: "d.", word: "Eraser" },
    { number: "5.", image: "eraser", letter: "e.", word: "Pen" }
  ];

  for (const item of items) {
    doc.font("Helvetica")
      .fontSize(12)
      .fillColor("#111827")
      .text(item.number, leftX, rowY + 2, { width: 25 });

    if (item.image === "eraser") {
      doc.save();
      doc.lineWidth(1);
      doc.strokeColor("#334155");
      doc.fillColor("#cbd5e1");
      doc.roundedRect(imageX, rowY + 2, 22, 12, 3).fillAndStroke();
      doc.fillColor("#f8fafc");
      doc.rect(imageX + 14, rowY + 2, 8, 12).fill();
      doc.strokeColor("#334155");
      doc.moveTo(imageX + 14, rowY + 2)
        .lineTo(imageX + 14, rowY + 14)
        .stroke();
      doc.restore();
    } else {
      drawMiniIllustration(doc, item.image, imageX, rowY, 18);
    }

    doc.font("Helvetica")
      .fontSize(12)
      .fillColor("#111827")
      .text(item.letter, rightX, rowY + 2, { width: 25 })
      .text(item.word, rightX + 25, rowY + 2, { width: 130 });

    rowY += rowStep;
  }

  return rowY + 2;
}
function drawUnit8BodyExercise(doc, y) {
  const cx = 300;
  const top = y + 8;

  const arrow = (x1, y1, x2, y2) => {
    doc.moveTo(x1, y1).lineTo(x2, y2).stroke();
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const px = -uy;
    const py = ux;
    const ax = x2 - ux * 7;
    const ay = y2 - uy * 7;

    doc.moveTo(x2, y2)
      .lineTo(ax + px * 3, ay + py * 3)
      .stroke();

    doc.moveTo(x2, y2)
      .lineTo(ax - px * 3, ay - py * 3)
      .stroke();
  };

  doc.save();
  doc.lineWidth(1.3);
  doc.strokeColor("#334155");
  doc.fillColor("#ffffff");

  // Head
  doc.circle(cx, top + 30, 24).fillAndStroke();

  // Eyes
  doc.circle(cx - 8, top + 24, 2).fill("#334155");
  doc.circle(cx + 8, top + 24, 2).fill("#334155");

  // Nose
  doc.moveTo(cx, top + 27)
    .lineTo(cx - 2, top + 35)
    .lineTo(cx + 3, top + 35)
    .stroke();

  // Mouth
  doc.moveTo(cx - 7, top + 42)
    .lineTo(cx + 7, top + 42)
    .stroke();

  // Neck
  doc.moveTo(cx - 7, top + 54).lineTo(cx - 7, top + 65).stroke();
  doc.moveTo(cx + 7, top + 54).lineTo(cx + 7, top + 65).stroke();

  // Body
  doc.moveTo(cx, top + 64).lineTo(cx, top + 145).stroke();

  // Arms
  doc.moveTo(cx - 5, top + 70).lineTo(cx - 45, top + 112).stroke();
  doc.moveTo(cx + 5, top + 70).lineTo(cx + 45, top + 112).stroke();

  // Hands
  doc.circle(cx - 48, top + 116, 7).fillAndStroke();
  doc.circle(cx + 48, top + 116, 7).fillAndStroke();

  // Legs
  doc.moveTo(cx, top + 145).lineTo(cx - 35, top + 205).stroke();
  doc.moveTo(cx, top + 145).lineTo(cx + 35, top + 205).stroke();

  // Feet
  doc.ellipse(cx - 45, top + 205, 24, 9).fillAndStroke();
  doc.ellipse(cx + 33, top + 205, 24, 9).fillAndStroke();

  // Numbered arrows
  doc.font("Helvetica-Bold").fontSize(11).fillColor("#2563eb");

  doc.text("(1)", 235, top + 4, { width: 35 });
  arrow(270, top + 13, cx - 15, top + 12);

  doc.text("(2)", 205, top + 20, { width: 35 });
  arrow(240, top + 27, cx - 8, top + 24);

  doc.text("(3)", 345, top + 28, { width: 35 });
  arrow(342, top + 35, cx + 2, top + 34);

  doc.text("(4)", 190, top + 88, { width: 35 });
  arrow(225, top + 98, cx - 35, top + 102);

  doc.text("(5)", 365, top + 105, { width: 35 });
  arrow(365, top + 112, cx + 48, top + 116);

  doc.text("(6)", 350, top + 55, { width: 35 });
  arrow(350, top + 63, cx + 7, top + 42);

  doc.text("(7)", 210, top + 180, { width: 35 });
  arrow(245, top + 187, cx - 25, top + 186);

  doc.text("(8)", 350, top + 190, { width: 35 });
  arrow(350, top + 197, cx + 42, top + 207);

  doc.restore();

  let nextY = top + 225;

  nextY = renderTextBlock(
    doc,
    "Words:\na. Head\nb. Hand\nc. Arm\nd. Foot\ne. Leg\nf. Eye\ng. Nose\nh. Mouth",
    65,
    nextY,
    CONTENT_WIDTH - 5,
    {
      fontSize: 12,
      lineGap: 5,
      color: "#111827"
    }
  );

  nextY += 18;

  nextY = renderTextBlock(
    doc,
    "Complete the answers:\n\n1. ______________________________\n2. ______________________________\n3. ______________________________\n4. ______________________________\n5. ______________________________\n6. ______________________________\n7. ______________________________\n8. ______________________________",
    65,
    nextY,
    CONTENT_WIDTH - 5,
    {
      fontSize: 12,
      lineGap: 5,
      color: "#111827"
    }
  );

  return nextY;
}
function drawUnit1Exercise1Content(doc, content, x, y, width, options = {}) {
  const value = cleanPdfText(content);
  if (!value) return y;

  const fontSize = options.fontSize || 12;
  const lineGap = options.lineGap ?? 6;
  const lineHeight = fontSize + lineGap + 2;

  const lines = value.split(/\r?\n/);
  const items = [];
  let currentItem = null;

  for (const rawLine of lines) {
    const match = rawLine.match(/^\s*(\d+)\.\s*(.*)$/);

    if (match) {
      if (currentItem) {
        items.push(currentItem);
      }

      currentItem = {
        number: match[1] + ".",
        lines: [match[2]]
      };
    } else if (currentItem) {
      currentItem.lines.push(rawLine);
    } else {
      items.push({
        number: "",
        lines: [rawLine]
      });
    }
  }

  if (currentItem) {
    items.push(currentItem);
  }

  for (const item of items) {
    if (!item.number && item.lines.every(line => !line.trim())) {
      y += lineHeight;
      continue;
    }

    const continuation = item.lines.slice(1).join("\n");
    const body = item.lines[0] + (continuation ? "\n" + continuation : "");
    const fullText = item.number ? item.number + " " + body : body;

    const height = doc.heightOfString(fullText, {
      width,
      lineGap
    });

    if (y + height > BOTTOM_LIMIT && y > 100) {
      doc.addPage();
      y = 65;
    }

    doc.font("Helvetica")
      .fontSize(fontSize)
      .fillColor(options.color || "#111827")
      .text(fullText, x, y, {
        width,
        lineGap,
        continued: false
      });

    y += height;

    if (item.number) {
      y += lineHeight;
    }
  }

  return y;
}
function addUnit(doc, unit) {
  doc.addPage();

  doc.fillColor("#1e3a8a")
    .font("Helvetica-Bold")
    .fontSize(28)
    .text(`Unit ${cleanPdfText(unit.number)}`, 60, 65);

  doc.fillColor("#111827")
    .font("Helvetica-Bold")
    .fontSize(22)
    .text(
      cleanPdfText(unit.title) || "Untitled Unit",
      60,
      105,
      {
        width: CONTENT_WIDTH
      }
    );

  doc.strokeColor("#1e3a8a")
    .lineWidth(1.5)
    .moveTo(60, 132)
    .lineTo(535, 132)
    .stroke();

  let y = 145;

  if (cleanPdfText(unit.description)) {
    y = renderTextBlock(
      doc,
      unit.description,
      60,
      y,
      CONTENT_WIDTH,
      {
        fontSize: 12,
        lineGap: 5,
        color: "#64748b"
      }
    );
    y += 25;
  }

  const exercises = Array.isArray(unit.exercises)
    ? unit.exercises.slice(0, 3)
    : [];

  exercises.forEach((exercise, index) => {
    const title = `Exercise ${index + 1} — ${cleanPdfText(exercise.title) || "Untitled Exercise"}`;
    const instructions = cleanPdfText(exercise.instructions);
    const content = cleanPdfText(exercise.content);

    const titleFontSize = 17;
    const titleLineGap = 4;
    const instructionFontSize = 11;
    const instructionLineGap = 4;
    const contentFontSize = 12;
    const contentLineGap = 6;

    doc.font("Helvetica-Bold").fontSize(titleFontSize);
    const titleHeight = doc.heightOfString(title, {
      width: CONTENT_WIDTH,
      lineGap: titleLineGap
    });

    let instructionHeight = 0;
    if (instructions) {
      doc.font("Helvetica").fontSize(instructionFontSize);
      instructionHeight = doc.heightOfString(instructions, {
        width: CONTENT_WIDTH - 5,
        lineGap: instructionLineGap
      });
    }

    let contentHeight = 0;
    if (content) {
      if (Number(unit.number) === 1 && Number(exercise.number) === 1) {
        doc.font("Helvetica").fontSize(contentFontSize);
        contentHeight = doc.heightOfString(content, {
          width: CONTENT_WIDTH - 35,
          lineGap: contentLineGap
        });
      } else {
        doc.font("Helvetica").fontSize(contentFontSize);
        contentHeight = doc.heightOfString(content, {
          width: CONTENT_WIDTH - 5,
          lineGap: contentLineGap
        });
      }
    }

    const exerciseHeight =
      titleHeight +
      10 +
      (instructions ? instructionHeight + 15 : 0) +
      (content ? contentHeight + 20 : 0) +
      25;

    // Never allow an exercise to start if the complete exercise
    // does not fit in the remaining space.
    if (y + exerciseHeight > BOTTOM_LIMIT && y > 100) {
      y = startNewContentPage(doc);
    }

    doc.fillColor("#2563eb")
      .font("Helvetica-Bold")
      .fontSize(titleFontSize)
      .text(title, 60, y, {
        width: CONTENT_WIDTH,
        lineGap: titleLineGap
      });

    doc.strokeColor("#2563eb")
      .lineWidth(1)
      .moveTo(60, y + titleHeight + 3)
      .lineTo(535, y + titleHeight + 3)
      .stroke();

    y += titleHeight + 10;

    if (instructions) {
      y = renderTextBlock(
        doc,
        instructions,
        65,
        y,
        CONTENT_WIDTH - 5,
        {
          fontSize: instructionFontSize,
          lineGap: instructionLineGap,
          color: "#374151"
        }
      );
      y += 15;
    }

    if (content) {
      if (Number(unit.number) === 4 && Number(exercise.number) === 1) {
        y = drawUnit4MatchExercise(doc, y);
      } else if (Number(unit.number) === 8 && Number(exercise.number) === 1) {
        y = drawUnit8BodyExercise(doc, y);
      } else if (Number(unit.number) === 1 && Number(exercise.number) === 1) {
        y = drawUnit1Exercise1Content(
          doc,
          content,
          65,
          y,
          CONTENT_WIDTH - 5,
          {
            fontSize: contentFontSize,
            lineGap: contentLineGap,
            color: "#111827"
          }
        );
      } else {
        y = renderTextBlock(
          doc,
          content,
          65,
          y,
          CONTENT_WIDTH - 5,
          {
            fontSize: contentFontSize,
            lineGap: contentLineGap,
            color: "#111827"
          }
        );
      }
      y += 20;
    }

    // Separator is drawn only when it remains safely inside the page.
    if (y + 12 <= BOTTOM_LIMIT) {
      doc.moveTo(65, y)
        .lineTo(530, y)
        .stroke("#e2e8f0");
      y += 25;
    } else if (index < exercises.length - 1) {
      y = startNewContentPage(doc);
    }
  });
}
function addFinalPage(doc) {
  doc.addPage();

  doc.fillColor("#1e3a8a")
    .font("Helvetica-Bold")
    .fontSize(28)
    .text("Well Done!", 60, 250, {
      align: "center",
      width: CONTENT_WIDTH
    });

  doc.fillColor("#374151")
    .font("Helvetica")
    .fontSize(15)
    .text(
      "Keep practising, keep learning and keep improving your English.",
      70,
      310,
      {
        align: "center",
        width: 455,
        lineGap: 7
      }
    );
}

function addBackCover(doc, book) {
  doc.addPage();

  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT).fill("#eff6ff");

  doc.fillColor("#1e3a8a")
    .font("Helvetica-Bold")
    .fontSize(24)
    .text(
      cleanPdfText(book.title) || "English Exercise Book",
      60,
      120,
      {
        align: "center",
        width: CONTENT_WIDTH
      }
    );

  doc.fillColor("#374151")
    .font("Helvetica")
    .fontSize(14)
    .text(
      `An English exercise book for ${cleanPdfText(book.className) || "primary school learners"}.`,
      70,
      220,
      {
        align: "center",
        width: 455,
        lineGap: 7
      }
    );

  doc.fontSize(14)
    .text(
      "Designed to help learners practise English after classroom lessons.",
      70,
      290,
      {
        align: "center",
        width: 455,
        lineGap: 7
      }
    );

  doc.fontSize(12)
    .text(
      `Author: ${cleanPdfText(book.author) || "Author"}`,
      70,
      650,
      {
        align: "center",
        width: 455
      }
    );

  doc.fontSize(11)
    .text(
      `${cleanPdfText(book.edition) || "First Edition"} • ${cleanPdfText(book.year) || "2026"}`,
      70,
      680,
      {
        align: "center",
        width: 455
      }
    );
}

async function generateExerciseBookPdf(project, outputPath) {
  if (!project || !project.book) {
    throw new Error("Book project is required.");
  }

  const directory = path.dirname(outputPath);

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  const doc = new PDFDocument({
    size: "A4",
    bufferPages: true,
    margins: {
      top: 55,
      bottom: 55,
      left: 60,
      right: 60
    },
    info: {
      Title: cleanPdfText(project.book.title) || "English Exercise Book",
      Author: cleanPdfText(project.book.author) || "Exercise Book Generator",
      Subject: "English"
    }
  });

  const stream = fs.createWriteStream(outputPath);

  doc.pipe(stream);

  addCover(doc, project.book);
  addAboutPage(doc, project.book);
  addHowToUsePage(doc);
  addTableOfContents(doc, project.units || []);

  for (const unit of project.units || []) {
    addUnit(doc, unit);
  }

  addFinalPage(doc);
  addBackCover(doc, project.book);

  const pageRange = doc.bufferedPageRange();
  for (let i = 0; i < pageRange.count; i++) {
    doc.switchToPage(pageRange.start + i);
    addPageNumber(doc, i + 1);
  }

  doc.end();

  await new Promise((resolve, reject) => {
    stream.on("finish", resolve);
    stream.on("error", reject);
  });

  return outputPath;
}

module.exports = {
  generateExerciseBookPdf
};


















