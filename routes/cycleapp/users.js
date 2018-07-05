const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const password = require("passport");

// Load the User model
const UserSchema = require("../../models/User");

// @router  POST cycleapp/users/new-user
// @desc    Registers a new user
// @access  Private
router.post("/new-user", (request, response) => {
  UserSchema.findOne({
    where: { userName: request.body.uname, statusFlag: 0 }
  }).then(user => {
    if (user) {
      return response.status(400).json({ msg: "Username already exists" });
    } else {
      // Create new user
      const newUser = {
        firstName: request.body.fname,
        lastName: request.body.lname,
        userRole: request.body.role,
        userName: request.body.uname,
        password: request.body.pass
      };

      // Generate a password hash
      bcrypt.genSalt(15, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          UserSchema.create(newUser)
            .then(() => {
              response.json({ msg: "User created successfully" });
            })
            .catch(err => {
              response.json({ msg: err });
            });
        });
      });
    }
  });
});

// @router  POST cycleapp/users/login
// @desc    Login user
// @access  Public
router.post("/login", (request, response) => {
  const password = request.body.pass;
  const username = request.body.uname;

  // Check if user exists
  UserSchema.findOne({ where: { userName: username } }).then(user => {
    if (!user) {
      return response.status(404).json({ username: "Username does not exist" });
    }

    // Check if password match
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // Create jwt payload
        const payload = {
          uid: user.id,
          mid: user.memberId,
          uname: user.userName
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
  password.authenticate("jwt", { session: false }),
  (request, response) => {
    response.json({
      uid: request.user.id,
      uname: request.user.userName,
      statusFlag: request.user.statusFlag
    });
  }
);

module.exports = router;
