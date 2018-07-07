const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  if (Validator.isEmpty(data.uname)) {
    errors.uname = "The UserName cannot be empty";
  }

  if (!Validator.isLength(data.pass, { min: 7, max: 255 })) {
    errors.pass = "Wrong password";
  }

  if (Validator.isEmpty(data.pass)) {
    errors.pass = "Password cannot be empty";
  }

  return {
    errors,
    isTrue: isEmpty(errors)
  };
};
