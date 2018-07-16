const config = require("../config/config");
const ContributionSchema = require("./Contribution");
const GraduationSchema = require("./Graduation");

// Create schema
const MemberSchema = config.sequelize.define("members", {
  createdBy: {
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
  firstName: {
    type: config.Sequelize.STRING,
    required: true
  },
  lastName: {
    type: config.Sequelize.STRING,
    required: true
  },
  gender: {
    type: config.Sequelize.STRING,
    required: true
  },
  userName: {
    type: config.Sequelize.STRING,
    required: true
  },
  password: {
    type: config.Sequelize.STRING,
    required: true
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
    required: true
  },
  dateCreated: {
    type: config.Sequelize.DATE,
    defaultValue: config.Sequelize.NOW
  }
});

// Create associations
MemberSchema.hasMany(MemberSchema, { foreignKey: "createdBy" });
MemberSchema.hasMany(ContributionSchema, { foreignKey: "memberId" });
MemberSchema.hasMany(GraduationSchema, { foreignKey: "memberId" });

module.exports = MemberSchema;
