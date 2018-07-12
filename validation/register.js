const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.fname = !isEmpty(data.fname) ? data.fname : "";
  data.lname = !isEmpty(data.lname) ? data.lname : "";
  data.uname = !isEmpty(data.uname) ? data.uname : "";

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
