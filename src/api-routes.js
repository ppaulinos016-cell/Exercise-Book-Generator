const express = require("express");
const path = require("path");
const fs = require("fs");

const {
  getSubjects,
  getGrades
} = require("./content/catalogue");

const exerciseTypes = require("./exercises/exercise-types");
const {
  difficultyLevels,
  gradeDifficulty
} = require("./exercises/difficulty");

const {
  saveBookProject,
  loadBookProject
} = require("./book/project-storage");

const {
  generateExerciseBookPdf
} = require("./output/exercise-book-pdf");

function registerApiRoutes(app) {
  const router = express.Router();

  router.get("/subjects", (req, res) => {
    res.json(getSubjects());
  });

  router.get("/grades", (req, res) => {
    res.json(getGrades());
  });

  router.get("/exercise-types", (req, res) => {
    res.json(exerciseTypes);
  });

  router.get("/difficulty", (req, res) => {
    res.json(difficultyLevels);
  });

  router.get("/grade-difficulty/:grade", (req, res) => {
    const progression = gradeDifficulty[req.params.grade];

    if (!progression) {
      return res.status(404).json({
        error: "Grade not found."
      });
    }

    res.json({
      grade: req.params.grade,
      progression
    });
  });

  router.post("/generate-pdf", async (req, res) => {
    try {
      const project = req.body;

      if (!project || !project.book) {
        return res.status(400).json({
          success: false,
          error: "Book project is required."
        });
      }

      const outputDirectory = path.join(
        __dirname,
        "..",
        "output"
      );

      if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory, { recursive: true });
      }

      const className =
        project.book.className || "Class 1";

      const safeClass = className
        .replace(/[^a-z0-9]+/gi, "_")
        .replace(/^_+|_+$/g, "");

      const outputPath = path.join(
        outputDirectory,
        `English_Exercise_Book_${safeClass}.pdf`
      );

      await generateExerciseBookPdf(
        project,
        outputPath
      );

      res.json({
        success: true,
        message: "PDF generated successfully.",
        file: `/output/${path.basename(outputPath)}`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  router.post("/generate-docx", async (req, res) => {
    try {
      const project = req.body;

      if (!project || !project.book) {
        return res.status(400).json({
          success: false,
          error: "Book project is required."
        });
      }

      const outputDirectory = path.join(
        __dirname,
        "..",
        "output"
      );

      if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory, { recursive: true });
      }

      const className =
        project.book.className || "Class 1";

      const safeClass = className
        .replace(/[^a-z0-9]+/gi, "_")
        .replace(/^_+|_+$/g, "");

      const outputPath = path.join(
        outputDirectory,
        `English_Exercise_Book_${safeClass}.docx`
      );

      const docxProject = {
        information: project.book,
        units: project.units || []
      };

      await createDocxDocument(
        docxProject,
        outputPath
      );

      res.json({
        success: true,
        message: "Word document generated successfully.",
        file: `/output/${path.basename(outputPath)}`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
  app.use("/api", router);

  app.use("/output", express.static(
    path.join(__dirname, "..", "output")
  ));
}

module.exports = {
  registerApiRoutes
};

