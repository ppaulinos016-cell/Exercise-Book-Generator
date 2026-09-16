function validateBook(book) {
  const errors = [];

  if (!book) {
    errors.push("Book configuration is missing.");
    return errors;
  }

  if (!book.title || !book.title.trim()) {
    errors.push("Book title is required.");
  }

  if (!book.subject || !book.subject.trim()) {
    errors.push("Subject is required.");
  }

  if (!book.grade || !book.grade.trim()) {
    errors.push("Grade / Class is required.");
  }

  if (!book.author || !book.author.trim()) {
    errors.push("Author is required.");
  }

  const units = Number(book.numberOfUnits);

  if (!Number.isInteger(units) || units < 1) {
    errors.push("Number of units must be at least 1.");
  }

  return errors;
}

function validateUnit(unit) {
  const errors = [];

  if (!unit || !unit.title || !unit.title.trim()) {
    errors.push("Unit title is required.");
  }

  if (!Array.isArray(unit?.exercises)) {
    errors.push("Unit exercises must be an array.");
    return errors;
  }

  if (unit.exercises.length < 4 || unit.exercises.length > 5) {
    errors.push("Each unit must contain exactly 3 exercises.");
  }

  return errors;
}

module.exports = {
  validateBook,
  validateUnit
};

