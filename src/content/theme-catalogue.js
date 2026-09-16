const themes = {
  english: {
    CE1: [],
    CE2: []
  }
};

function getThemes(subject, grade) {
  if (!themes[subject] || !themes[subject][grade]) {
    return [];
  }

  return themes[subject][grade];
}

function addTheme(subject, grade, theme) {
  if (!subject || !grade) {
    throw new Error("Subject and grade are required.");
  }

  if (!theme || !theme.id || !theme.name) {
    throw new Error("A theme must have an id and a name.");
  }

  if (!themes[subject]) {
    themes[subject] = {};
  }

  if (!themes[subject][grade]) {
    themes[subject][grade] = [];
  }

  themes[subject][grade].push(theme);

  return theme;
}

function isThemeAvailable(subject, grade, themeId) {
  return getThemes(subject, grade)
    .some(theme => theme.id === themeId);
}

module.exports = {
  getThemes,
  addTheme,
  isThemeAvailable
};
