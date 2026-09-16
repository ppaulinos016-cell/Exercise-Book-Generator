const { createUnit, createEmptyUnit } = require("./unit-generator");

function createUnitList(numberOfUnits) {
  const total = Number(numberOfUnits);

  if (!Number.isInteger(total) || total < 1) {
    throw new Error("Number of units must be at least 1.");
  }

  return Array.from(
    { length: total },
    (_, index) => createEmptyUnit(index + 1)
  );
}

function validateUnitList(units, numberOfUnits) {
  if (!Array.isArray(units)) {
    return false;
  }

  if (units.length !== Number(numberOfUnits)) {
    return false;
  }

  return units.every(unit => {
    return (
      Number.isInteger(unit.number) &&
      unit.number >= 1 &&
      Array.isArray(unit.exercises) &&
      unit.exercises.length >= 4 &&
      unit.exercises.length <= 5
    );
  });
}

module.exports = {
  createUnit,
  createEmptyUnit,
  createUnitList,
  validateUnitList
};
