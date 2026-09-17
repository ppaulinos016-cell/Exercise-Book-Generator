const unitsContainer = document.getElementById("unitsContainer");
const createUnitsButton = document.getElementById("createUnitsButton");
const saveProjectButton = document.getElementById("saveProjectButton");
const loadProjectButton = document.getElementById("loadProjectButton");
const generatePdfButton = document.getElementById("generatePdfButton");
const generateDocxButton = document.getElementById("generateDocxButton");

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

function createExercise(number, data = {}, showNumber = true) {
  const exercise = document.createElement("div");
  exercise.className = "exercise-editor";

  exercise.innerHTML = `
    <div class="exercise-header">
      <h4>${showNumber ? `Exercise ${number}` : "Exercise"}</h4>
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
      <div class="content-toolbar">
        <button type="button" class="format-bold" title="Bold"><strong>B</strong></button>
        <button type="button" class="format-underline" title="Underline"><u>U</u></button>
        <button type="button" class="format-image" title="Insert image">+</button>
      </div>
      <div class="exercise-content"
        contenteditable="true"
        role="textbox"
        aria-multiline="true"
        data-placeholder="Enter the exercise content here..."></div>
    </div>
  `;

  const contentEditor = exercise.querySelector(".exercise-content");

  const imageInput = document.createElement("input");
  imageInput.type = "file";
  imageInput.accept = "image/*";
  imageInput.style.display = "none";
  exercise.appendChild(imageInput);

  function applyFormat(command) {
    contentEditor.focus();
    document.execCommand(command, false, null);
  }

  exercise.querySelector(".format-bold").addEventListener("mousedown", (event) => {
    event.preventDefault();
    applyFormat("bold");
  });

  exercise.querySelector(".format-underline").addEventListener("mousedown", (event) => {
    event.preventDefault();
    applyFormat("underline");
  });
  exercise.querySelector(".format-image").addEventListener("click", () => {
    imageInput.click();
  });

  imageInput.addEventListener("change", () => {
    const file = imageInput.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      contentEditor.focus();

      const image = document.createElement("img");
      image.src = reader.result;
      image.alt = "Exercise image";
      image.style.maxWidth = "100%";
      image.style.height = "auto";
      image.style.display = "block";
      image.style.margin = "10px 0";

      const selection = window.getSelection();

      if (
        selection &&
        selection.rangeCount > 0 &&
        contentEditor.contains(selection.anchorNode)
      ) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(image);
        range.setStartAfter(image);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        contentEditor.appendChild(image);
      }
    };

    reader.readAsDataURL(file);
    imageInput.value = "";
  });
  exercise.querySelector(".exercise-title").value =
    data.title ?? "";

  exercise.querySelector(".exercise-instructions").value =
    data.instructions ?? "";

  exercise.querySelector(".exercise-content").innerHTML =
    data.content ?? "";

  return exercise;
}

function rebuildExercises(container, count) {
  const existing = Array.from(
    container.querySelectorAll(".exercise-editor")
  ).map((exerciseElement) => ({
    title: exerciseElement.querySelector(".exercise-title").value,
    instructions: exerciseElement.querySelector(".exercise-instructions").value,
    content: exerciseElement.querySelector(".exercise-content").innerHTML
  }));

  container.innerHTML = "";

  for (let i = 1; i <= count; i++) {
    container.appendChild(
      createExercise(i, existing[i - 1] || {}, count > 1)
    );
  }
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

      <div class="unit-controls">
        <label for="exercise-count-${number}">Exercises</label>
        <select id="exercise-count-${number}" class="exercise-count">
          ${Array.from({ length: 10 }, (_, i) =>
            `<option value="${i + 1}" ${i + 1 === 3 ? "selected" : ""}>${i + 1}</option>`
          ).join("")}
        </select>
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

  const exerciseCount =
    unit.querySelector(".exercise-count");

  rebuildExercises(
    exercisesContainer,
    Number(exerciseCount.value)
  );

  exerciseCount.addEventListener("change", () => {
    rebuildExercises(
      exercisesContainer,
      Number(exerciseCount.value)
    );
  });

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
  generateDocxButton.disabled = false;
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
              .value;

          const instructions =
            exerciseElement
              .querySelector(".exercise-instructions")
              .value;

          const content =
            exerciseElement
              .querySelector(".exercise-content")
              .innerHTML;

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
            .value,
        description:
          unitElement
            .querySelector(".unit-description")
            .value,
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

async function loadSavedProject() {
  const finalMessage = document.getElementById("finalMessage");

  try {
    const response = await fetch("/api/project");

    if (!response.ok) {
      throw new Error("Unable to load the saved project.");
    }

    const result = await response.json();

    if (!result.success || !result.project) {
      finalMessage.textContent =
        "No saved project was found.";

      finalMessage.className =
        "message error-state";

      return;
    }

    const project = result.project;

    titleField.value = project.book?.title ?? "";
    subtitleField.value = project.book?.subtitle ?? "";
    authorField.value = project.book?.author ?? "";
    emailField.value = project.book?.email ?? "";
    contactField.value = project.book?.contact ?? "";
    editionField.value = project.book?.edition ?? "";
    yearField.value = project.book?.year ?? "";

    if (project.book?.grade) {
      classField.value = project.book.grade;
    }

    const units = Array.isArray(project.units)
      ? project.units
      : [];

    unitsContainer.innerHTML = "";

    unitCountField.value = units.length || 1;

    units.forEach((unitData, unitIndex) => {
      const unit = createUnit(unitIndex + 1);

      unit.querySelector(".unit-title").value =
        unitData.title ?? "";

      unit.querySelector(".unit-description").value =
        unitData.description ?? "";

      const exercises = Array.isArray(unitData.exercises)
        ? unitData.exercises
        : [];

      const exerciseCount =
        unit.querySelector(".exercise-count");

      exerciseCount.value =
        String(Math.max(1, Math.min(10, exercises.length || 1)));

      const exercisesContainer =
        unit.querySelector(".exercises-container");

      rebuildExercises(
        exercisesContainer,
        Number(exerciseCount.value)
      );

      const exerciseElements =
        exercisesContainer.querySelectorAll(".exercise-editor");

      exercises.forEach((exerciseData, exerciseIndex) => {
        const exerciseElement = exerciseElements[exerciseIndex];

        if (!exerciseElement) {
          return;
        }

        exerciseElement.querySelector(".exercise-title").value =
          exerciseData.title ?? "";

        exerciseElement.querySelector(".exercise-instructions").value =
          exerciseData.instructions ?? "";

        exerciseElement.querySelector(".exercise-content").innerHTML =
          exerciseData.content ?? "";
      });

      unitsContainer.appendChild(unit);
    });

    if (units.length > 0) {
      generatePdfButton.disabled = false;
      generateDocxButton.disabled = false;
    }

    updateCoverPreview();

    finalMessage.textContent =
      "Saved project loaded successfully. You can continue where you stopped.";

    finalMessage.className =
      "message success";
  } catch (error) {
    finalMessage.textContent =
      error.message || "Unable to load the saved project.";

    finalMessage.className =
      "message error-state";
  }
}
loadProjectButton.addEventListener("click", loadSavedProject);

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
  generateDocxButton.disabled = false;
    generatePdfButton.textContent = "Generate PDF";
  }
});

generateDocxButton.addEventListener("click", async () => {
  const project = collectProject();
  const finalMessage = document.getElementById("finalMessage");

  generateDocxButton.disabled = true;
  generateDocxButton.textContent = "Generating Word...";

  try {
    const response = await fetch("/api/generate-docx", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(project)
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.error || "Word generation failed."
      );
    }

    finalMessage.innerHTML = `
      Word document generated successfully.
      <br>
      <a href="${result.file}" download>
        Download the Word document
      </a>
    `;

    finalMessage.className =
      "message success";

  } catch (error) {
    finalMessage.textContent =
      error.message || "Word generation failed.";

    finalMessage.className =
      "message error-state";
  } finally {
    generateDocxButton.disabled = false;
    generateDocxButton.textContent = "Download Word (.docx)";
  }
});
updateCoverPreview();























