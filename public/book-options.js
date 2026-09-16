const form = document.getElementById("bookForm");

if (form) {
  const subjectField = document.getElementById("subject");
  const gradeField = document.getElementById("grade");
  const unitsField = document.getElementById("units");

  async function populateBookOptions() {
    try {
      const [subjects, grades] = await Promise.all([
        fetch("/api/subjects").then(response => response.json()),
        fetch("/api/grades").then(response => response.json())
      ]);

      if (subjectField) {
        subjectField.innerHTML = '<option value="">Select a subject</option>';

        subjects.forEach(subject => {
          const option = document.createElement("option");
          option.value = subject.name;
          option.textContent = subject.name;
          subjectField.appendChild(option);
        });
      }

      if (gradeField) {
        gradeField.innerHTML = '<option value="">Select a grade / class</option>';

        grades.forEach(grade => {
          const option = document.createElement("option");
          option.value = grade.id;
          option.textContent = grade.name;
          gradeField.appendChild(option);
        });
      }
    } catch (error) {
      console.error("Unable to load book options:", error);
    }
  }

  populateBookOptions();
}
