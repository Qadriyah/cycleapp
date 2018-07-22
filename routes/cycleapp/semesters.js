const express = require("express");
const router = express.Router();
const passport = require("passport");
const config = require("../../config/config");

// Load Semester model
const SemesterSchema = require("../../models/Semester");

// Load Cycle model
const CycleSchema = require("../../models/Cycle");

// @router  POST cycleapp/semester/new-semester
// @desc    Registers a new semester
// @access  Private
router.post(
  "/new-semester",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    errors = {};
    // Check validations

    // Get form fields
    newSemester = {};
    if (request.body.desc) newSemester.description = request.body.desc;
    if (request.body.capacity) newSemester.capacity = request.body.capacity;

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    // Get current cycle
    CycleSchema.findOne({ where: { current: true } }).then(cycle => {
      const startDate = new Date(cycle.startDate);
      const endDate = new Date(cycle.endDate);
      newSemester.cycleId = cycle.id;

      // Check if semester already exists
      SemesterSchema.findAll({
        raw: true,
        attributes: [
          [config.sequelize.fn("COUNT", config.sequelize.col("*")), "no_rows"]
        ],
        where: { cycleId: cycle.id }
      }).then(rows => {
        switch (rows[0].no_rows) {
          case "0": {
            if (request.body.desc !== "Advance") {
              errors.semester = "First semester should be Advance";
              return response.status(401).json(errors);
            }
            newSemester.description =
              months[startDate.getMonth()] +
              ", " +
              startDate.getFullYear() +
              " " +
              request.body.desc;
            newSemester.current = true;
            newSemester.semesterNum = 1;
            SemesterSchema.create(newSemester)
              .then(semester => {
                response.json(semester);
              })
              .catch(err => response.status(500).json(err));
            break;
          }
          case "1": {
            if (request.body.desc === "Advance") {
              errors.semester = "Second semester should be Final";
              return response.status(401).json(errors);
            }
            newSemester.description =
              months[startDate.getMonth()] +
              ", " +
              startDate.getFullYear() +
              " " +
              request.body.desc;
            newSemester.semesterNum = 2;
            SemesterSchema.create(newSemester)
              .then(semester => {
                response.json(semester);
              })
              .catch(err => response.status(500).json(err));
            break;
          }
          case "2": {
            if (request.body.desc !== "Advance") {
              errors.semester = "Third semester should be Advance";
              return response.status(401).json(errors);
            }
            newSemester.description =
              months[endDate.getMonth()] +
              ", " +
              endDate.getFullYear() +
              " " +
              request.body.desc;
            newSemester.semesterNum = 3;
            SemesterSchema.create(newSemester)
              .then(semester => {
                response.json(semester);
              })
              .catch(err => response.status(500).json(err));
            break;
          }
          case "3": {
            if (request.body.desc === "Advance") {
              errors.semester = "Last semester should be Final";
              return response.status(401).json(errors);
            }
            newSemester.description =
              months[endDate.getMonth()] +
              ", " +
              endDate.getFullYear() +
              " " +
              request.body.desc;
            newSemester.semesterNum = 4;
            SemesterSchema.create(newSemester)
              .then(semester => {
                response.json(semester);
              })
              .catch(err => response.status(500).json(err));
            break;
          }
          default: {
            errors.semester = "No semesters identified by the server";
            response.status(500).json(errors);
            break;
          }
        }
      });
    });
  }
);

module.exports = router;
