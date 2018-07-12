const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load the User model
const MemberSchema = require("../../models/Member");

// @router  POST cycleapp/users/new-user
// @desc    Registers a new user
// @access  Private
router.post(
  "/new-member",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    const { errors, isTrue } = validateRegisterInput(request.body);

    // Check validations
    if (!isTrue) {
      return response.status(400).json(errors);
    }

    // Check if member already exists
    MemberSchema.findOne({
      where: { userName: request.body.uname }
    }).then(member => {
      if (member) {
        // Member already exists
        errors.msg = "Username already exists";
        return response.status(400).json(errors);
      } else {
        // Create new member
        const newMember = {
          createdBy: request.user.id,
          firstName: request.body.fname,
          lastName: request.body.lname,
          userRole: request.body.role,
          userName: request.body.uname,
          password: request.body.pass,
          gender: request.body.gender,
          userTitle: request.body.utitle
        };

        // Generate a password hash
        bcrypt.genSalt(15, (err, salt) => {
          if (err) {
            return response.status(400).json(err);
          }

          bcrypt.hash(newMember.password, salt, (err, hash) => {
            if (err) throw err;
            newMember.password = hash;
            MemberSchema.create(newMember)
              .then(() => {
                response.json({ msg: "Member created successfully" });
              })
              .catch(err => {
                response.json({ msg: err });
              });
          });
        });
      }
    });
  }
);

// @router  POST cycleapp/users/login
// @desc    Login user
// @access  Public
router.post("/login", (request, response) => {
  const { errors, isTrue } = validateLoginInput(request.body);

  // Check for validation
  if (!isTrue) {
    return response.status(400).json(errors);
  }
  const password = request.body.pass;
  const username = request.body.uname;

  // Check if user exists
  MemberSchema.findOne({ where: { userName: username } }).then(member => {
    if (!member) {
      errors.username = "Username does not exist";
      return response.status(404).json(errors);
    }

    // Check if password match
    bcrypt.compare(password, member.password).then(isMatch => {
      if (isMatch) {
        // Create jwt payload
        const payload = {
          uid: member.id,
          mid: member.memberId,
          uname: member.userName
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretKey,
          { expiresIn: 86400 }, // Token expires after 24 hours
          (err, token) => {
            response.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return response.status(400).json({ password: "Wrong password" });
      }
    });
  });
});

// @router  GET cycleapp/users/current-user
// @desc    Returns the current user
// @access  Private
router.get(
  "/current-user",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    response.json({
      uid: request.member.id,
      title: request.member.userTitle,
      fullName: request.member.lastName + " " + request.member.firstName,
      uname: request.member.userName,
      statusFlag: request.member.statusFlag,
      role: request.member.userRole
    });
  }
);

module.exports = router;
