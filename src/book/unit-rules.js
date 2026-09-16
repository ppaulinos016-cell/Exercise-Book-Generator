const unitRules = {
  minimumExercises: 3,
  maximumExercises: 3,
  requireExercises: true,
  allowEmptyUnitBeforeContentCreation: true,
  language: "en",
  includeAnswers: false,
  includeSolutions: false,
  includeAnswerKey: false
};

function validateUnitRules(unit) {
  if (!unit || !Array.isArray(unit.exercises)) {
    return false;
  }

  const count = unit.exercises.length;

  return (
    count >= unitRules.minimumExercises &&
    count <= unitRules.maximumExercises
  );
}

module.exports = {
  unitRules,
  validateUnitRules
};

