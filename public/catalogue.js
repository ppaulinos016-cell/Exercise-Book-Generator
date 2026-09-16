async function loadCatalogues() {
  try {
    const [subjects, grades, exerciseTypes, difficulty] = await Promise.all([
      fetch("/api/subjects").then(response => response.json()),
      fetch("/api/grades").then(response => response.json()),
      fetch("/api/exercise-types").then(response => response.json()),
      fetch("/api/difficulty").then(response => response.json())
    ]);

    console.log("Subjects:", subjects);
    console.log("Grades:", grades);
    console.log("Exercise types:", exerciseTypes);
    console.log("Difficulty levels:", difficulty);

    return {
      subjects,
      grades,
      exerciseTypes,
      difficulty
    };
  } catch (error) {
    console.error("Unable to load catalogues:", error);
    return null;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadCatalogues();
});
