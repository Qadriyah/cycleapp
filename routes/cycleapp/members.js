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
    // Create new member
    const newMember = {};
    newMember.createdBy = request.user.id;
    if (request.body.fname) newMember.firstName = request.body.fname;
    if (request.body.lname) newMember.lastName = request.body.lname;
    if (request.body.role) newMember.userRole = request.body.role;
    if (request.body.uname) newMember.userName = request.body.uname;
    if (request.body.pass) newMember.password = request.body.pass;
    if (request.body.gender) newMember.gender = request.body.gender;
    if (request.body.utitle) newMember.userTitle = request.body.utitle;

    // Check if member already exists
    MemberSchema.findOne({
      where: { userName: request.body.uname }
    }).then(member => {
      if (member) {
        // Update member
        const editMember = {};
        editMember.cycleId = request.body.cycle;
        editMember.cycleFlag = request.body.flag;
        MemberSchema.update(editMember, { where: { id: member.id } })
          .then(result => {
            response.json(result);
          })
          .catch(err => response.json(err));
      } else {
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

// @router  GET cycleapp/cycle-members
// @desc    Adds members to a cycle
// @access  Private
router.post(
  "/cycle-members",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {}
);

// @router  GET cycleapp/members/current-member
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
