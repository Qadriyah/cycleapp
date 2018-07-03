const Sequelize = require("sequelize");

// Postgre Database connection string
const options = require("../config/keys").pgURI;

// DB Connection
const sequelize = new Sequelize("cycledb", "becks", "snOOkg", options);

const config = {};
config.sequelize = sequelize;
config.Sequelize = Sequelize;

module.exports = config;
