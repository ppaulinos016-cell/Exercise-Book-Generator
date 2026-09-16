const { getExerciseTypesForGrade } = require("./exercise-catalogue");
const { gradeDifficulty } = require("./difficulty");

function getExerciseProgression(grade, exerciseCount = 5) {
  const types = getExerciseTypesForGrade(grade);
  const difficulty = gradeDifficulty[grade];

  if (!types.length || !difficulty) {
    throw new Error(`Unsupported grade: ${grade}`);
  }

  const count = Number(exerciseCount);

  if (!Number.isInteger(count) || count !== 3) {
    throw new Error("Each unit must contain exactly 3 exercises.");
  }

  const selectedTypes = types.slice(0, count);

  const levels = difficulty.progression;

  return selectedTypes.map((type, index) => ({
    number: index + 1,
    type: type.id,
    typeName: type.name,
    difficulty: levels[Math.min(index, levels.length - 1)]
  }));
}

module.exports = {
  getExerciseProgression
};

