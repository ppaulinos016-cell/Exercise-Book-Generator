const exerciseContentTemplate = {
  type: "",
  title: "",
  instructions: "",
  items: [],
  choices: [],
  passages: [],
  writingLines: 0,
  illustration: {
    enabled: false,
    path: "",
    description: ""
  },
  metadata: {
    language: "en",
    grade: "",
    difficulty: "",
    theme: ""
  }
};

function createExerciseContent(options = {}) {
  return {
    ...exerciseContentTemplate,

    ...options,

    illustration: {
      ...exerciseContentTemplate.illustration,
      ...(options.illustration || {})
    },

    metadata: {
      ...exerciseContentTemplate.metadata,
      ...(options.metadata || {})
    }
  };
}

module.exports = {
  exerciseContentTemplate,
  createExerciseContent
};
