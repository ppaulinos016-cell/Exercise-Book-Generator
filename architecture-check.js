const checks = [
  "./src/book/book-structure.js",
  "./src/book/validation.js",
  "./src/book/book-generator.js",
  "./src/book/book-style.js",
  "./src/book/unit-template.js",
  "./src/book/unit-generator.js",
  "./src/book/illustration-manager.js",
  "./src/book/cover-generator.js",
  "./src/book/front-matter-generator.js",
  "./src/book/back-cover-generator.js",
  "./src/book/complete-book-generator.js",
  "./src/book/generator.js",
  "./src/exercises/exercise-types.js",
  "./src/exercises/exercise-generator.js",
  "./src/exercises/difficulty.js",
  "./src/content/subjects.js",
  "./src/content/grades.js",
  "./src/content/themes.js",
  "./src/content/catalogue.js",
  "./src/content/theme-manager.js",
  "./src/output/pdf.js",
  "./src/output/docx.js",
  "./src/api-routes.js"
];

let failed = 0;

for (const file of checks) {
  try {
    require(file);
    console.log(`OK  ${file}`);
  } catch (error) {
    failed++;
    console.log(`FAIL ${file}`);
    console.log(`     ${error.message}`);
  }
}

console.log("");

if (failed === 0) {
  console.log(`ARCHITECTURE CHECK: PASSED`);
  console.log(`Modules checked: ${checks.length}`);
} else {
  console.log(`ARCHITECTURE CHECK: FAILED`);
  console.log(`Failed modules: ${failed}`);
  process.exitCode = 1;
}
