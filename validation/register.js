const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  if (Validator.isEmpty(data.fname)) {
    errors.fname = "The FirstName cannot be empty";
  }

  if (Validator.isEmpty(data.lname)) {
    errors.fname = "The LastName cannot be empty";
  }

  if (Validator.equals(data.gender, "selected")) {
    errors.gender = "Please select the Gender";
  }

  if (Validator.isEmpty(data.uname)) {
    errors.uname = "The UserName cannot be empty";
  }

  if (!Validator.isLength(data.pass, { min: 8, max: 255 })) {
    errors.pass = "The password must be atleast 8 characters loong";
  }

  return {
    errors,
    isTrue: isEmpty(errors)
  };
};
