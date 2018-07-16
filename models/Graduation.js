const config = require("../config/config");

// Create model
const GraduationSchema = config.sequelize.define("graduations", {
  memberId: {
    type: config.Sequelize.INTEGER,
    references: {
      model: "members",
      key: "id"
    },
    onDelete: "cascade",
    onUpdate: "cascade"
  },
  semesterId: {
    type: config.Sequelize.INTEGER,
    references: {
      model: "semesters",
      key: "id"
    },
    onDelete: "cascade",
    onUpdate: "cascade"
  },
  amountReceived: {
    type: config.Sequelize.INTEGER
  },
  dateReceived: {
    type: config.Sequelize.DATEONLY
  }
});

module.exports = GraduationSchema;
