const express = require("express");
const router = express.Router();
const passport = require("passport");

const config = require("../../config/config");

// Load models
const ContributionSchema = require("../../models/Contribution");
const CycleSchema = require("../../models/Cycle");

// @router  POST cycleapp/contribution/new-contribution
// @desc    Registers member contributions
// @access  Private
router.post(
  "/new-contribution",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    const errors = {};
    // Check validations

    // Get current cycle
    CycleSchema.findOne({ where: { current: true } }).then(cycle => {
      const newContribution = {};
      newContribution.memberId = request.body.member;
      newContribution.cycleId = cycle.id;
      newContribution.amount = request.body.amount;
      newContribution.datePaid = request.body.dpaid;

      // Check if member contribution is complete
      ContributionSchema.findAll({
        raw: true,
        attributes: [
          [config.sequelize.fn("SUM", config.sequelize.col("amount")), "total"]
        ],
        where: { cycleId: cycle.id, memberId: request.body.member }
      }).then(result => {
        if (result[0].total < cycle.amount * cycle.numOfSems) {
          ContributionSchema.create(newContribution)
            .then(contribution => {
              response.json({ msg: "Data submitted successfully" });
            })
            .catch(err => response.json(err));
        } else {
          response.json({ msg: "This member has already completed" });
        }
      });
    });
  }
);

module.exports = router;
