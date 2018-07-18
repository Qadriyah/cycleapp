const config = require("../config/config");
const MemberSchema = require("./Member");
const GraduationSchema = require("./Graduation");

// Create Schema
const SemesterSchema = config.sequelize.define("semesters", {
  cycleId: {
    type: config.Sequelize.INTEGER,
    references: {
      model: "cycles",
      key: "id"
    },
    onDelete: "cascade",
    onUpdate: "cascade"
  },
  description: {
    type: config.Sequelize.STRING,
    required: true
  },
  capacity: {
    type: config.Sequelize.INTEGER
  }
});

// Create associations
SemesterSchema.hasMany(MemberSchema, { foreignKey: "semesterId" });
SemesterSchema.hasMany(GraduationSchema, { foreignKey: "semesterId" });

module.exports = SemesterSchema;
