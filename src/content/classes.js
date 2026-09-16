const classes = [
  { id: "class-1", classNumber: 1, name: "Class 1", level: "CP1" },
  { id: "class-2", classNumber: 2, name: "Class 2", level: "CP2" },
  { id: "class-3", classNumber: 3, name: "Class 3", level: "CE1" },
  { id: "class-4", classNumber: 4, name: "Class 4", level: "CE2" },
  { id: "class-5", classNumber: 5, name: "Class 5", level: "CM1" },
  { id: "class-6", classNumber: 6, name: "Class 6", level: "CM2" }
];

function getClasses() {
  return classes;
}

function getClass(classId) {
  return classes.find(item => item.id === classId) || null;
}

module.exports = {
  classes,
  getClasses,
  getClass
};
