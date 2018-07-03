const express = require("express");
const router = express.Router();

// Load Person model
const MemberSchema = require("../../models/Member");

// @router  POST cycleapp/person/new-person
// @desc    Registers a new person
// @access  Public
router.post("/new-person", (request, response) => {
  // Check if person already exists
  const newMember = {
    firstName: request.body.fname,
    lastName: request.body.lname,
    gender: request.body.gender
  };

  MemberSchema.create(newMember)
    .then(() => response.json({ msg: "Person created successfully" }))
    .catch(err => response.json({ msg: err }));
});

module.exports = router;
