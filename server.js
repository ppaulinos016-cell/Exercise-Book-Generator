const path = require("path");
const express = require("express");

const {
  registerApiRoutes
} = require("./src/api-routes");

const {
  saveBookProject,
  loadBookProject
} = require("./src/book/project-storage");

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

registerApiRoutes(app);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    project: "Exercise Book Generator",
    language: "en"
  });
});

app.post("/api/project", (req, res) => {
  try {
    const projectPath = saveBookProject(req.body);

    res.json({
      success: true,
      message: "Book project saved successfully.",
      path: projectPath
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

app.get("/api/project", (req, res) => {
  try {
    const project = loadBookProject();

    res.json({
      success: true,
      project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `Exercise Book Generator running on http://localhost:${PORT}`
  );
});
