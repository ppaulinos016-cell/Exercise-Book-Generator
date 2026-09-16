const difficultyLevels = [
  {
    id: "easy",
    name: "Easy",
    description: "Simple vocabulary, short instructions and basic activities."
  },
  {
    id: "medium",
    name: "Medium",
    description: "More varied vocabulary, sentences and activities."
  },
  {
    id: "challenging",
    name: "Challenging",
    description: "More independent thinking, reading and writing."
  }
];

const gradeDifficulty = {
  CE1: {
    startingLevel: "easy",
    progression: ["easy", "medium"]
  },

  CE2: {
    startingLevel: "easy",
    progression: ["easy", "medium", "challenging"]
  }
};

module.exports = {
  difficultyLevels,
  gradeDifficulty
};
