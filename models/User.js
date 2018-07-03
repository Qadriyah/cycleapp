const config = require("../config/config");

// Create schema
const UserSchema = config.sequelize.define("users", {
  memberId: {
    type: config.Sequelize.INTEGER,
    references: {
      model: "members",
      key: "id"
    }
  },
  userName: {
    type: config.Sequelize.STRING,
    require: true
  },
  password: {
    type: config.Sequelize.STRING,
    require: true
  },
  statusFlag: {
    type: config.Sequelize.INTEGER,
    defaultValue: 1
  },
  dateCreated: {
    type: config.Sequelize.DATE,
    defaultValue: config.Sequelize.NOW
  }
});

module.exports = UserSchema;
