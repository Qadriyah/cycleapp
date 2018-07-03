const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

// Load the User model
const UserSchema = require("../../models/User");

// Load the member schema
const MemberSchema = require("../../models/Member");

// @router  POST cycleapp/person/new-user
// @desc    Registers a new user
// @access  Private
router.post("/new-user", (request, response) => {
  MemberSchema.findOne({ uname: request.body.uname }).then(user => {
    if (user) {
      return response.status(400).json({ msg: "Username already exists" });
    } else {
      // Create new user
      const newUser = {
        memberId: request.body.mid,
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

module.exports = router;
