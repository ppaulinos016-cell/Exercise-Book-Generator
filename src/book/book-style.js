const bookStyle = {
  page: {
    size: "A4",
    orientation: "portrait",
    margins: {
      top: 18,
      bottom: 18,
      left: 18,
      right: 18
    }
  },

  typography: {
    headingFont: "Arial",
    bodyFont: "Arial",
    exerciseFont: "Arial",
    minimumBodySize: 12
  },

  cover: {
    enabled: true,
    illustration: true,
    illustrationStyle: "primary-school",
    title: true,
    subtitle: true,
    grade: true,
    subject: true,
    author: true,
    edition: true,
    year: true
  },

  interior: {
    illustrations: true,
    pageNumbers: true,
    headers: true,
    footers: true,
    exerciseSpacing: true,
    writingSpace: true
  },

  language: {
    bookLanguage: "en",
    instructionsLanguage: "en",
    interfaceLanguage: "en"
  }
};

module.exports = bookStyle;
