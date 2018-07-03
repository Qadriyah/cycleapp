const config = require("../config/config");

// Create schema
const MemberSchema = config.sequelize.define("members", {
  firstName: {
    type: config.Sequelize.STRING,
    require: true
  },
  lastName: {
    type: config.Sequelize.STRING,
    require: true
  },
  gender: {
    type: config.Sequelize.STRING
  },
  dateRegistered: {
    type: config.Sequelize.DATE,
    defaultValue: config.Sequelize.NOW
  },
  statusFlag: {
    type: config.Sequelize.INTEGER,
    defaultValue: 1
  }
});

module.exports = MemberSchema;
