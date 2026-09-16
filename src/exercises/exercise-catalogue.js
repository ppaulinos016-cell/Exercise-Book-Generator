const exerciseTypes = [
  {
    id: "matching",
    name: "Matching",
    suitableFor: ["CE1", "CE2"]
  },
  {
    id: "multiple-choice",
    name: "Multiple Choice",
    suitableFor: ["CE1", "CE2"]
  },
  {
    id: "fill-in-the-blanks",
    name: "Fill in the Blanks",
    suitableFor: ["CE1", "CE2"]
  },
  {
    id: "word-order",
    name: "Word Order",
    suitableFor: ["CE1", "CE2"]
  },
  {
    id: "true-false",
    name: "True or False",
    suitableFor: ["CE1", "CE2"]
  },
  {
    id: "complete-the-sentence",
    name: "Complete the Sentences",
    suitableFor: ["CE1", "CE2"]
  },
  {
    id: "writing",
    name: "Writing",
    suitableFor: ["CE1", "CE2"]
  },
  {
    id: "reading",
    name: "Reading Activity",
    suitableFor: ["CE1", "CE2"]
  }
];

function getExerciseTypesForGrade(grade) {
  return exerciseTypes.filter(type =>
    type.suitableFor.includes(grade)
  );
}

module.exports = {
  exerciseTypes,
  getExerciseTypesForGrade
};
