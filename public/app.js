const unitsContainer = document.getElementById("unitsContainer");
const createUnitsButton = document.getElementById("createUnitsButton");
const saveProjectButton = document.getElementById("saveProjectButton");
const generatePdfButton = document.getElementById("generatePdfButton");

const titleField = document.getElementById("title");
const subtitleField = document.getElementById("subtitle");
const classField = document.getElementById("classSelect");
const subjectField = document.getElementById("subject");
const authorField = document.getElementById("author");
const emailField = document.getElementById("email");
const contactField = document.getElementById("contact");
const editionField = document.getElementById("edition");
const yearField = document.getElementById("year");
const unitCountField = document.getElementById("unitCount");

const previewTitle = document.getElementById("previewTitle");
const previewClass = document.getElementById("previewClass");
const previewSubject = document.getElementById("previewSubject");
const previewAuthor = document.getElementById("previewAuthor");
const previewYear = document.getElementById("previewYear");

function updateCoverPreview() {
  previewTitle.textContent =
    titleField.value.trim() || "English Exercise Book";

  previewClass.textContent =
    classField.options[classField.selectedIndex]?.text || "Class 1";

  previewSubject.textContent =
    subjectField.value.trim() || "English";

  previewAuthor.textContent =
    authorField.value.trim() || "Author";

  previewYear.textContent =
    yearField.value.trim() || "2026";
}

[
  titleField,
  subtitleField,
  classField,
  subjectField,
  authorField, emailField, contactField, editionField,
  yearField
].forEach(field => {
  field.addEventListener("input", updateCoverPreview);
  field.addEventListener("change", updateCoverPreview);
});

function createExercise(number) {
  const exercise = document.createElement("div");
  exercise.className = "exercise-editor";

  exercise.innerHTML = `
    <div class="exercise-header">
      <h4>Exercise ${number}</h4>
    </div>

    <div class="field">
      <label>Exercise Title</label>
      <input type="text" class="exercise-title"
        placeholder="e.g. Match the words">
    </div>

    <div class="field">
      <label>Instructions</label>
      <input type="text" class="exercise-instructions"
        placeholder="Write the instructions for the learner">
    </div>

    <div class="field">
      <label>Exercise Content</label>
      <textarea class="exercise-content" rows="5"
        placeholder="Enter the exercise content here..."></textarea>
    </div>
  `;

  return exercise;
}

function createUnit(number) {
  const unit = document.createElement("section");
  unit.className = "unit-editor";

  unit.innerHTML = `
    <div class="unit-header">
      <div>
        <span class="unit-number">UNIT ${number}</span>
        <h3>Unit ${number}</h3>
      </div>
    </div>

    <div class="field">
      <label>Unit Title</label>
      <input type="text" class="unit-title"
        placeholder="Enter the unit title">
    </div>

    <div class="field">
      <label>Unit Introduction</label>
      <textarea class="unit-description" rows="3"
        placeholder="Optional short introduction to this unit"></textarea>
    </div>

    <div class="exercises-container"></div>
  `;

  const exercisesContainer =
    unit.querySelector(".exercises-container");

  for (let i = 1; i <= 3; i++) {
    exercisesContainer.appendChild(createExercise(i));
  }

  return unit;
}

function createUnits() {
  const count = Number(unitCountField.value);

  if (!Number.isInteger(count) || count < 1) {
    unitsContainer.innerHTML = `
      <div class="empty-state error-state">
        Please enter at least 1 unit.
      </div>
    `;
    return;
  }

  unitsContainer.innerHTML = "";

  for (let i = 1; i <= count; i++) {
    unitsContainer.appendChild(createUnit(i));
  }

  document.getElementById("bookMessage").textContent =
    `${count} unit${count > 1 ? "s" : ""} created successfully.`;

  document.getElementById("bookMessage").className =
    "message success";

  generatePdfButton.disabled = false;
}

createUnitsButton.addEventListener("click", createUnits);

function collectProject() {
  const units = [];

  document.querySelectorAll(".unit-editor").forEach(
    (unitElement, unitIndex) => {

      const exercises = [];

      unitElement
        .querySelectorAll(".exercise-editor")
        .forEach((exerciseElement, exerciseIndex) => {

          const title =
            exerciseElement
              .querySelector(".exercise-title")
              .value.trim();

          const instructions =
            exerciseElement
              .querySelector(".exercise-instructions")
              .value.trim();

          const content =
            exerciseElement
              .querySelector(".exercise-content")
              .value.trim();

          exercises.push({
            number: exerciseIndex + 1,
            title,
            instructions,
            content
          });
        });

      units.push({
        number: unitIndex + 1,
        title:
          unitElement
            .querySelector(".unit-title")
            .value.trim(),
        description:
          unitElement
            .querySelector(".unit-description")
            .value.trim(),
        exercises
      });
    }
  );

  return {
    status: "draft",
    language: "en",

    book: {
      title: titleField.value.trim(),
      subtitle: subtitleField.value.trim(),
      subject: "english",
      grade: classField.value,
      className:
        classField.options[classField.selectedIndex]?.text || "Class 1",
      author: authorField.value.trim(),
      email: emailField.value.trim(),
      contact: contactField.value.trim(),
      edition: editionField.value.trim(),
      year: yearField.value.trim(),
      numberOfUnits: units.length
    },

    units,

    options: {
      includeCover: true,
      includeAboutBook: true,
      includeHowToUse: true,
      includeTableOfContents: true,
      includeFinalPage: true,
      includeBackCover: true,
      includeAnswers: false,
      includeSolutions: false,
      includeAnswerKey: false
    }
  };
}

saveProjectButton.addEventListener("click", async () => {
  const project = collectProject();
  const finalMessage = document.getElementById("finalMessage");

  try {
    const response = await fetch("/api/project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(project)
    });

    const result = await response.json();

    if (result.success) {
      finalMessage.textContent =
        "Book project saved successfully.";

      finalMessage.className =
        "message success";
    } else {
      finalMessage.textContent =
        result.error || "Unable to save the project.";

      finalMessage.className =
        "message error-state";
    }
  } catch (error) {
    finalMessage.textContent =
      "Unable to connect to the local server.";

    finalMessage.className =
      "message error-state";
  }
});

generatePdfButton.addEventListener("click", async () => {
  const project = collectProject();
  const finalMessage = document.getElementById("finalMessage");

  generatePdfButton.disabled = true;
  generatePdfButton.textContent = "Generating PDF...";

  try {
    const response = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(project)
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.error || "PDF generation failed."
      );
    }

    finalMessage.innerHTML = `
      PDF generated successfully.
      <br>
      <a href="${result.file}" target="_blank">
        Open the generated PDF
      </a>
    `;

    finalMessage.className =
      "message success";

  } catch (error) {
    finalMessage.textContent =
      error.message || "PDF generation failed.";

    finalMessage.className =
      "message error-state";
  } finally {
    generatePdfButton.disabled = false;
    generatePdfButton.textContent = "Generate PDF";
  }
});

updateCoverPreview();



