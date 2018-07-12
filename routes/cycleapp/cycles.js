const express = require("express");
const router = express.Router();
const passport = require("passport");

// Load cycle model
const CycleSchema = require("../../models/Cycle");

// @router  POST cycleapp/cycles/new-cycle
// @desc    Registers a new cycle
// @access  Private
router.post(
  "/new-cycle",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    const errors = {};
    // Check validations

    // Create new cycle
    const newCycle = {};
    if (request.body.desc) newCycle.description = request.body.desc;
    if (request.body.amount) newCycle.amount = request.body.amount;

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
          // Create new cycle
          CycleSchema.create(newCycle)
            .then(cycle => {
              response.json(cycle);
            })
            .catch(err => response.json(err));
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
    CycleSchema.findOne({
      where: { current: true }
    }).then(cycle => {
      response.json(cycle);
    });
  }
);

module.exports = router;
