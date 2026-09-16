const unitTemplate = require("./unit-template");

function createUnit({
  number,
  title = "",
  description = "",
  exercises = []
}) {
  if (!Number.isInteger(number) || number < 1) {
    throw new Error("Unit number must be a positive integer.");
  }

  if (!Array.isArray(exercises)) {
    throw new Error("Exercises must be an array.");
  }

  if (exercises.length !== 3) {
    throw new Error("Each unit must contain exactly 3 exercises.");
  }

  return {
    number,
    title,
    description,
    exercises
  };
}

function createEmptyUnit(number) {
  return {
    number,
    title: "",
    description: "",
    exercises: unitTemplate.exercises.map(exercise => ({
      ...exercise,
      content: []
    }))
  };
}

module.exports = {
  createUnit,
  createEmptyUnit
};

