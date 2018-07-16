const config = require("../config/config");

// Create Model
ContributionSchema = config.sequelize.define("contributions", {
  memberId: {
    type: config.Sequelize.INTEGER,
    references: {
      model: "members",
      key: "id"
    },
    onDelete: "cascade",
    onUpdate: "cascade"
  },
  cycleId: {
    type: config.Sequelize.INTEGER,
    references: {
      model: "cycles",
      key: "id"
    },
    onDelete: "cascade",
    onUpdate: "cascade"
  },
  amount: {
    type: config.Sequelize.INTEGER
  },
  datePaid: {
    type: config.Sequelize.DATEONLY
  }
});

module.exports = ContributionSchema;
