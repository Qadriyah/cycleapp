const express = require("express");
const router = express.Router();

// Load Member model
const MemberSchema = require("../../models/Member");

// @router  POST cycleapp/person/new-member
// @desc    Registers a new member
// @access  Private
router.post("/new-member", (request, response) => {
  // Check if person already exists
  const newMember = {
    firstName: request.body.fname,
    lastName: request.body.lname,
    gender: request.body.gender
  };

  MemberSchema.create(newMember)
    .then(() =>
      response.json({ msg: "New mwmber has been created successfully" })
    )
    .catch(err => response.json({ msg: err }));
});

module.exports = router;
