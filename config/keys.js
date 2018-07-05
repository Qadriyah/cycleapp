module.exports = {
  pgURI: {
    host: "localhost",
    dialect: "postgres",
    operatorAliases: false,

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idel: 10000
    }
  },
  port: process.env.PORT || 5000,
  secretKey: "mukungu"
};
