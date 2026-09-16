const bookStructure = {
  frontMatter: [
    "cover",
    "titlePage",
    "preface",
    "introduction",
    "howToUse",
    "tableOfContents"
  ],

  content: {
    units: [],
    exercisesPerUnit: {
      minimum: 4,
      maximum: 5
    }
  },

  backMatter: [
    "backCover"
  ],

  excluded: [
    "answerKey",
    "solutions",
    "answers"
  ]
};

module.exports = bookStructure;
