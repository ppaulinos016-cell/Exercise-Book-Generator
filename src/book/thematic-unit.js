const thematicUnitTemplate = {
  number: 0,
  title: "",
  description: "",

  theme: {
    id: "",
    name: ""
  },

  grade: "CE1",
  subject: "english",
  language: "en",

  exercises: []
};

function createThematicUnit({
  number,
  title = "",
  description = "",
  theme = {},
  grade = "CE1",
  subject = "english",
  exercises = []
}) {
  if (!Number.isInteger(number) || number < 1) {
    throw new Error("Unit number must be a positive integer.");
  }

  if (!theme.id || !theme.name) {
    throw new Error("A unit theme must have an id and a name.");
  }

  if (!Array.isArray(exercises)) {
    throw new Error("Unit exercises must be an array.");
  }

  if (exercises.length < 4 || exercises.length > 5) {
    throw new Error("Each unit must contain between 4 and 5 exercises.");
  }

  return {
    number,
    title,
    description,
    theme: {
      id: theme.id,
      name: theme.name
    },
    grade,
    subject,
    language: "en",
    exercises
  };
}

module.exports = {
  thematicUnitTemplate,
  createThematicUnit
};
