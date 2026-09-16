const subjects = require("./subjects");
const grades = require("./grades");

function getSubjects() {
  return subjects.filter(subject => subject.active);
}

function getGrades() {
  return grades;
}

function getSubject(subjectId) {
  return subjects.find(subject => subject.id === subjectId) || null;
}

function getGrade(gradeId) {
  return grades.find(grade => grade.id === gradeId) || null;
}

function isValidCombination(subjectId, gradeId) {
  return Boolean(getSubject(subjectId) && getGrade(gradeId));
}

module.exports = {
  getSubjects,
  getGrades,
  getSubject,
  getGrade,
  isValidCombination
};
