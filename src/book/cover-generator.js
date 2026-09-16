const coverTemplate = require("../../templates/cover/cover-template");

function createCover(bookInfo, illustration = {}) {
  return {
    ...coverTemplate,

    content: {
      title: bookInfo.title || "",
      subtitle: bookInfo.subtitle || "",
      subject: bookInfo.subject || "",
      grade: bookInfo.grade || "",
      author: bookInfo.author || "",
      edition: bookInfo.edition || "",
      year: bookInfo.year || ""
    },

    visual: {
      ...coverTemplate.visual,
      illustrationPath: illustration.path || "",
      illustrationDescription: illustration.description || "",
      style: illustration.style || "primary-school"
    }
  };
}

module.exports = {
  createCover
};

