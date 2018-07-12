const config = require("../config/config");
const MemberSchema = require("./Member");

// Create schema
const CycleSchema = config.sequelize.define("cycles", {
  description: {
    type: config.Sequelize.STRING,
    require: true
  },
  amount: {
    type: config.Sequelize.INTEGER,
    require: true
  },
  current: {
    type: config.Sequelize.BOOLEAN,
    defaultValue: true
  }
});

// Create associations
CycleSchema.hasMany(MemberSchema, { foreignKey: "cycleId" });

module.exports = CycleSchema;
