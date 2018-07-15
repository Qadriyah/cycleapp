const config = require("../config/config");
const MemberSchema = require("./Member");

// Create schema
const CycleSchema = config.sequelize.define("cycles", {
  startDate: {
    type: config.Sequelize.DATEONLY,
    required: true
  },
  endDate: {
    type: config.Sequelize.DATEONLY,
    required: true
  },
  cycleLength: {
    type: config.Sequelize.INTEGER,
    required: true
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
CycleSchema.hasMany(MemberSchema, { foreignKey: "cycleId" });

module.exports = CycleSchema;
