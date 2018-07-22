const express = require("express");
const router = express.Router();
const passport = require("passport");
const config = require("../../config/config");
const dateFormat = require("dateformat");

// Load models
const CycleSchema = require("../../models/Cycle");
const SemesterSchema = require("../../models/Semester");
const MemberSchema = require("../../models/Member");
const ContributionSchema = require("../../models/Contribution");

// @router  POST cycleapp/cycles/new-cycle
// @desc    Registers a new cycle
// @access  Private
router.post(
  "/new-cycle",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    require("datejs");
    const errors = {};
    // Check validations

    // Create new cycle
    const newCycle = {};
    if (request.body.desc) newCycle.description = request.body.desc;
    if (request.body.sdate) newCycle.startDate = request.body.sdate;
    if (request.body.capacity) newCycle.capacity = request.body.capacity;
    if (request.body.sems) newCycle.monthlySemesters = request.body.sems;
    if (request.body.amount) newCycle.amount = request.body.amount;

    // Caculate the end date of the cycle
    const startDate = new Date(request.body.sdate);
    const endDate = new Date(startDate)
      .add(Number(request.body.clength))
      .months();
    newCycle.endDate = new Date(endDate).addDays(-1);

    // Check if cycle already exists
    CycleSchema.findOne({ where: { description: request.body.desc } }).then(
      cycle => {
        if (cycle) {
          // Update cycle
          CycleSchema.update(newCycle, { where: { id: cycle.id } })
            .then(cycle => {
              response.json(cycle);
            })
            .catch(err => {
              response.json(err);
            });
        } else {
          CycleSchema.findOne({ where: { current: true } }).then(ncycle => {
            if (ncycle) {
              if (
                startDate.isBefore(new Date(ncycle.endDate)) ||
                startDate.equals(new Date(ncycle.endDate))
              ) {
                return response.status(401).json({ msg: "Wrong date" });
              }
              // Make current false for the previous cycle
              bcycle = {};
              bcycle.current = false;
              CycleSchema.update(bcycle, { where: { id: ncycle.id } })
                .then(result => {
                  if (result) {
                    CycleSchema.create(newCycle)
                      .then(cycle => {
                        response.json(cycle);
                      })
                      .catch(err => response.json(err));
                  }
                })
                .catch(err => response.json(err));
            } else {
              CycleSchema.create(newCycle)
                .then(cycle => {
                  response.json(cycle);
                })
                .catch(err => response.json(err));
            }
          });
        }
      }
    );
  }
);

// @router  GET cycleapp/cycles/currentcycle
// @desc    Gets the current cycle
// @access  Private
router.get(
  "/currentcycle",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    CycleSchema.findOne({ where: { current: true } }).then(cycle => {
      CycleSchema.findOne({
        where: { id: cycle.id },
        include: [
          {
            model: SemesterSchema,
            required: true,
            attributes: ["id", "description", "capacity"],
            include: [
              {
                model: MemberSchema,
                attributes: ["id", "firstName", "lastName", "userTitle"],
                include: [
                  {
                    model: ContributionSchema,
                    attributes: ["cycleId", "amount", "datePaid"],
                    where: { cycleId: cycle.id }
                  }
                ]
              }
            ]
          }
        ]
      }).then(cycle => {
        response.json(cycle);
      });
    });
  }
);

module.exports = router;
