const exerciseTypes = require("./exercise-types");
const { difficultyLevels, gradeDifficulty } = require("./difficulty");

function getExerciseType(typeId) {
  return exerciseTypes.find(type => type.id === typeId) || null;
}

function getDifficulty(levelId) {
  return difficultyLevels.find(level => level.id === levelId) || null;
}

function getGradeProgression(gradeId) {
  return gradeDifficulty[gradeId] || null;
}

function createExercise({
  number,
  type,
  difficulty = "easy",
  title = "",
  instructions = "",
  content = []
}) {
  const exerciseType = getExerciseType(type);
  const difficultyLevel = getDifficulty(difficulty);

  if (!exerciseType) {
    throw new Error(`Unknown exercise type: ${type}`);
  }

  if (!difficultyLevel) {
    throw new Error(`Unknown difficulty level: ${difficulty}`);
  }

  return {
    number,
    type: exerciseType.id,
    typeName: exerciseType.name,
    difficulty: difficultyLevel.id,
    title,
    instructions,
    content
  };
}

module.exports = {
  getExerciseType,
  getDifficulty,
  getGradeProgression,
  createExercise
};
