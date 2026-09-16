const coverTemplate = {
  type: "front-cover",

  language: "en",

  content: {
    title: "",
    subtitle: "",
    subject: "",
    grade: "",
    author: "",`r`n    email: "",`r`n    contact: "",`r`n    edition: "",
    year: ""
  },

  visual: {
    illustrationEnabled: true,
    illustrationPath: "",
    illustrationDescription: "",
    style: "primary-school",
    position: "center"
  },

  layout: {
    titlePosition: "top",
    gradePosition: "below-title",
    authorPosition: "bottom",
    illustrationPosition: "center",
    balancedComposition: true
  }
};

module.exports = coverTemplate;

