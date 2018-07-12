const config = require("../config/config");

// Create schema
const MemberSchema = config.sequelize.define("members", {
  createdBy: {
    type: config.Sequelize.INTEGER,
    references: {
      model: "members",
      key: "id"
    }
  },
  cycleId: {
    type: config.Sequelize.INTEGER,
    references: {
      model: "cycles",
      key: "id"
    }
  },
  cycleFlag: {
    type: config.Sequelize.INTEGER,
    defaultValue: 0
  },
  firstName: {
    type: config.Sequelize.STRING,
    require: true
  },
  lastName: {
    type: config.Sequelize.STRING,
    require: true
  },
  gender: {
    type: config.Sequelize.STRING,
    require: true
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
  userRole: {
    type: config.Sequelize.INTEGER,
    defaultValue: 0
  },
  userTitle: {
    type: config.Sequelize.STRING,
    require: true
  },
  dateCreated: {
    type: config.Sequelize.DATE,
    defaultValue: config.Sequelize.NOW
  }
});

// Create associations
MemberSchema.hasMany(MemberSchema, { foreignKey: "createdBy" });

module.exports = MemberSchema;
