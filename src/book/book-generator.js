const bookStructure = require("./book-structure");
const { validateBook, validateUnit } = require("./validation");

function createBook(bookInfo, units = []) {
  const errors = validateBook(bookInfo);

  if (errors.length) {
    return {
      success: false,
      errors
    };
  }

  if (units.length !== Number(bookInfo.numberOfUnits)) {
    return {
      success: false,
      errors: [
        `Expected ${bookInfo.numberOfUnits} units, but received ${units.length}.`
      ]
    };
  }

  const unitErrors = [];

  units.forEach((unit, index) => {
    const errorsForUnit = validateUnit(unit);

    if (errorsForUnit.length) {
      unitErrors.push({
        unit: index + 1,
        errors: errorsForUnit
      });
    }
  });

  if (unitErrors.length) {
    return {
      success: false,
      errors: unitErrors
    };
  }

  return {
    success: true,

    book: {
      language: "en",

      information: bookInfo,

      frontMatter: bookStructure.frontMatter,

      units,

      backMatter: bookStructure.backMatter,

      excluded: bookStructure.excluded
    }
  };
}

module.exports = {
  createBook
};
