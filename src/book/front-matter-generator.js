const frontMatterTemplate = require("../../templates/front-matter/front-matter");

function createFrontMatter(bookInfo, units = []) {
  return {
    language: "en",

    titlePage: {
      ...frontMatterTemplate.titlePage,
      title: bookInfo.title || "",
      subtitle: bookInfo.subtitle || "",
      subject: bookInfo.subject || "",
      grade: bookInfo.grade || "",
      author: bookInfo.author || "",
      edition: bookInfo.edition || "",
      year: bookInfo.year || ""
    },

    preface: {
      ...frontMatterTemplate.preface
    },

    introduction: {
      ...frontMatterTemplate.introduction
    },

    howToUse: {
      ...frontMatterTemplate.howToUse
    },

    tableOfContents: {
      ...frontMatterTemplate.tableOfContents,
      units: units.map(unit => ({
        number: unit.number,
        title: unit.title || ""
      }))
    }
  };
}

module.exports = {
  createFrontMatter
};
