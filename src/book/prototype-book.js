const prototypeBook = {
  language: "en",

  class: {
    number: 3,
    name: "Class 3",
    level: "CE1"
  },

  subject: "English",

  book: {
    title: "English Exercise Book",
    subtitle: "Primary School",
    author: "Author Name",
    edition: "First Edition",
    year: "2026"
  },

  frontMatter: [
    "cover",
    "titlePage",
    "authorInformation",
    "preface",
    "introduction",
    "howToUse",
    "tableOfContents"
  ],

  units: [
    {
      number: 1,
      title: "",
      exercises: [
        { number: 1, title: "", content: [] },
        { number: 2, title: "", content: [] },
        { number: 3, title: "", content: [] },
        { number: 4, title: "", content: [] },
        { number: 5, title: "", content: [] }
      ]
    },
    {
      number: 2,
      title: "",
      exercises: [
        { number: 1, title: "", content: [] },
        { number: 2, title: "", content: [] },
        { number: 3, title: "", content: [] },
        { number: 4, title: "", content: [] },
        { number: 5, title: "", content: [] }
      ]
    },
    {
      number: 3,
      title: "",
      exercises: [
        { number: 1, title: "", content: [] },
        { number: 2, title: "", content: [] },
        { number: 3, title: "", content: [] },
        { number: 4, title: "", content: [] },
        { number: 5, title: "", content: [] }
      ]
    },
    {
      number: 4,
      title: "",
      exercises: [
        { number: 1, title: "", content: [] },
        { number: 2, title: "", content: [] },
        { number: 3, title: "", content: [] },
        { number: 4, title: "", content: [] },
        { number: 5, title: "", content: [] }
      ]
    }
  ],

  backMatter: [
    "finalPage",
    "backCover"
  ],

  rules: {
    answers: false,
    solutions: false,
    answerKey: false
  }
};

module.exports = prototypeBook;
