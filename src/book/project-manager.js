const projectTemplate = {
  status: "draft",
  language: "en",

  book: {
    title: "",
    subtitle: "",
    subject: "english",
    grade: "",
    author: "",
    edition: "",
    year: "",
    numberOfUnits: 0
  },

  units: [],

  options: {
    includeCover: true,
    includeTitlePage: true,
    includePreface: true,
    includeIntroduction: true,
    includeHowToUse: true,
    includeTableOfContents: true,
    includeBackCover: true,
    includeAnswers: false,
    includeSolutions: false,
    includeAnswerKey: false
  }
};

function createProject(bookInfo = {}) {
  return {
    ...projectTemplate,

    book: {
      ...projectTemplate.book,
      ...bookInfo
    },

    units: []
  };
}

function setProjectUnits(project, units) {
  if (!project || typeof project !== "object") {
    throw new Error("Project is required.");
  }

  if (!Array.isArray(units)) {
    throw new Error("Units must be an array.");
  }

  return {
    ...project,
    units
  };
}

function markProjectReady(project) {
  if (!project || typeof project !== "object") {
    throw new Error("Project is required.");
  }

  return {
    ...project,
    status: "ready"
  };
}

module.exports = {
  projectTemplate,
  createProject,
  setProjectUnits,
  markProjectReady
};
