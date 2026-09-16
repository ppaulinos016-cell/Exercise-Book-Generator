const backCoverTemplate = require("../../templates/back-cover/back-cover-template");

function createBackCover(bookInfo) {
  return {
    ...backCoverTemplate,

    content: {
      ...backCoverTemplate.content,
      title: bookInfo.title || "",
      subject: bookInfo.subject || "",
      grade: bookInfo.grade || "",
      author: bookInfo.author || "",
      edition: bookInfo.edition || "",
      year: bookInfo.year || ""
    }
  };
}

module.exports = {
  createBackCover
};
