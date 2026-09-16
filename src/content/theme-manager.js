const themes = require("./themes");

function getThemes(subjectId, gradeId) {
  if (!themes[subjectId]) {
    return [];
  }

  return themes[subjectId][gradeId] || [];
}

function addTheme(subjectId, gradeId, theme) {
  if (!theme || !theme.id || !theme.name) {
    throw new Error("A theme must have an id and a name.");
  }

  if (!themes[subjectId]) {
    themes[subjectId] = {};
  }

  if (!themes[subjectId][gradeId]) {
    themes[subjectId][gradeId] = [];
  }

  themes[subjectId][gradeId].push(theme);

  return theme;
}

module.exports = {
  getThemes,
  addTheme
};
