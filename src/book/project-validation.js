const { validateUnitRules } = require("./unit-rules");

function validateProject(project) {
  const errors = [];

  if (!project || typeof project !== "object") {
    return ["Project is required."];
  }

  if (project.language !== "en") {
    errors.push("Book language must be English.");
  }

  if (!project.book || typeof project.book !== "object") {
    errors.push("Book information is required.");
    return errors;
  }

  if (!project.book.title || !project.book.title.trim()) {
    errors.push("Book title is required.");
  }

  if (!project.book.subject || project.book.subject !== "english") {
    errors.push("Book subject must be English.");
  }

  if (!project.book.grade || !["CE1", "CE2"].includes(project.book.grade)) {
    errors.push("Book grade must be CE1 or CE2.");
  }

  if (!Number.isInteger(Number(project.book.numberOfUnits)) ||
      Number(project.book.numberOfUnits) < 1) {
    errors.push("Number of units must be at least 1.");
  }

  if (!Array.isArray(project.units)) {
    errors.push("Units must be an array.");
    return errors;
  }

  if (project.units.length !== Number(project.book.numberOfUnits)) {
    errors.push(
      `Expected ${project.book.numberOfUnits} units, but received ${project.units.length}.`
    );
  }

  project.units.forEach((unit, index) => {
    if (!validateUnitRules(unit)) {
      errors.push(
        `Unit ${index + 1} must contain between 4 and 5 exercises.`
      );
    }
  });

  if (project.options) {
    if (project.options.includeAnswers !== false) {
      errors.push("Answers must remain disabled.");
    }

    if (project.options.includeSolutions !== false) {
      errors.push("Solutions must remain disabled.");
    }

    if (project.options.includeAnswerKey !== false) {
      errors.push("Answer key must remain disabled.");
    }
  }

  return errors;
}

function isProjectValid(project) {
  return validateProject(project).length === 0;
}

module.exports = {
  validateProject,
  isProjectValid
};
