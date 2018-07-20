const config = require("../config/config");
const SemesterSchema = require("./Semester");
const ContributionSchema = require("./Contribution");

// Create schema
const CycleSchema = config.sequelize.define("cycles", {
  description: {
    type: config.Sequelize.STRING,
    required: true
  },
  startDate: {
    type: config.Sequelize.DATEONLY,
    required: true
  },
  endDate: {
    type: config.Sequelize.DATEONLY,
    required: true
  },
  capacity: {
    type: config.Sequelize.INTEGER
  },
  numOfSems: {
    type: config.Sequelize.INTEGER
  },
  amount: {
    type: config.Sequelize.INTEGER,
    required: true
  },
  current: {
    type: config.Sequelize.BOOLEAN,
    defaultValue: true
  }
});

// Create associations
CycleSchema.hasMany(SemesterSchema, { foreignKey: "cycleId" });
CycleSchema.hasMany(ContributionSchema, { foreignKey: "cycleId" });

module.exports = CycleSchema;
