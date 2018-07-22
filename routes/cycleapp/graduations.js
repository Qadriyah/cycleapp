const express = require("express");
const router = express.Router();
const passport = require("passport");

const config = require("../../config/config");

// Load models
const GraduationSchema = require("../../models/Graduation");
const SemesterSchema = require("../../models/Semester");
const ContributionSchema = require("../../models/Contribution");
const CycleSchema = require("../../models/Cycle");

// @router  POST cycleapp/graduations/graduate
// @desc    Registers new graduants
// @access  Private
router.post(
  "/graduate",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    const errors = {};
    // Check validations

    // Get data fields
    const gradFields = {};
    gradFields.memberId = request.body.member;
    gradFields.amountReceived = request.body.amount;
    gradFields.dateReceived = request.body.rdate;

    // Get current semester
    SemesterSchema.findOne({ where: { current: true } }).then(semester => {
      gradFields.semesterId = semester.id;

      // Check if all members have paid for the current semester
      ContributionSchema.findAll({
        raw: true,
        attributes: [
          [config.sequelize.fn("SUM", config.sequelize.col("amount")), "total"]
        ],
        where: { cycleId: semester.cycleId }
      }).then(rows => {
        // Get the total amount for a semester
        CycleSchema.findOne({ where: { id: semester.cycleId } }).then(cycle => {
          const total = cycle.capacity * cycle.amount;
          switch (semester.semesterNum) {
            case 1: {
              if (rows[0].total < total) {
                errors.paid =
                  "Some members have not fully paid for the first semester";
                return response.status(401).json(errors);
              }
              // Check if member has already graduated
              GraduationSchema.findOne({
                where: {
                  memberId: request.body.member,
                  semesterId: semester.id
                }
              }).then(graduand => {
                if (graduand) {
                  errors.graduand = "This member has already been passed out";
                  return response.status(401).json(errors);
                } else {
                  GraduationSchema.create(gradFields)
                    .then(result => {
                      GraduationSchema.findAll({
                        raw: true,
                        attributes: [
                          [
                            config.sequelize.fn(
                              "COUNT",
                              config.sequelize.col("*")
                            ),
                            "no_rows"
                          ]
                        ],
                        where: { semesterId: semester.id }
                      })
                        .then(row => {
                          if (row[0].no_rows === "2") {
                            // Close semester
                            const thisSemester = {};
                            const currentSemester = {};
                            currentSemester.current = true;
                            thisSemester.current = false;
                            SemesterSchema.update(thisSemester, {
                              where: { id: semester.id }
                            }).then(res => {
                              SemesterSchema.update(currentSemester, {
                                where: { id: semester.id + 1 }
                              }).then(rest => {
                                response.json({
                                  msg: "Data has been submitted successfully"
                                });
                              });
                            });
                          }
                          response.json({
                            msg: "Data has been submitted successfully"
                          });
                        })
                        .catch(err => console.log(err));
                    })
                    .catch(err => response.json(err));
                }
              });
              break;
            }
            case 2: {
              if (rows[0].total < total * 2) {
                errors.paid = "Some members have not fully paid";
                return response.status(401).json(errors);
              }
              // Check if member has already graduated
              GraduationSchema.findOne({
                where: {
                  memberId: request.body.member,
                  semesterId: semester.id
                }
              }).then(graduand => {
                if (graduand) {
                  errors.graduand = "This member has already been passed out";
                  return response.status(401).json(errors);
                } else {
                  GraduationSchema.create(gradFields)
                    .then(result => {
                      GraduationSchema.findAll({
                        raw: true,
                        attributes: [
                          [
                            config.sequelize.fn(
                              "COUNT",
                              config.sequelize.col("*")
                            ),
                            "no_rows"
                          ]
                        ],
                        where: { semesterId: semester.id }
                      })
                        .then(row => {
                          if (row[0].no_rows === "2") {
                            // Close semester
                            const thisSemester = {};
                            const currentSemester = {};
                            currentSemester.current = true;
                            thisSemester.current = false;
                            SemesterSchema.update(thisSemester, {
                              where: { id: semester.id }
                            }).then(res => {
                              SemesterSchema.update(currentSemester, {
                                where: { id: semester.id + 1 }
                              }).then(rest => {
                                response.json({
                                  msg: "Data has been submitted successfully"
                                });
                              });
                            });
                          }
                          response.json({
                            msg: "Data has been submitted successfully"
                          });
                        })
                        .catch(err => console.log(err));
                    })
                    .catch(err => response.json(err));
                }
              });
              break;
            }
            case 3: {
              if (rows[0].total < total * 3) {
                errors.paid = "Some members have not fully paid";
                return response.status(401).json(errors);
              }
              // Check if member has already graduated
              GraduationSchema.findOne({
                where: {
                  memberId: request.body.member,
                  semesterId: semester.id
                }
              }).then(graduand => {
                if (graduand) {
                  errors.graduand = "This member has already been passed out";
                  return response.status(401).json(errors);
                } else {
                  GraduationSchema.create(gradFields)
                    .then(result => {
                      GraduationSchema.findAll({
                        raw: true,
                        attributes: [
                          [
                            config.sequelize.fn(
                              "COUNT",
                              config.sequelize.col("*")
                            ),
                            "no_rows"
                          ]
                        ],
                        where: { semesterId: semester.id }
                      })
                        .then(row => {
                          if (row[0].no_rows === "2") {
                            // Close semester
                            const thisSemester = {};
                            const currentSemester = {};
                            currentSemester.current = true;
                            thisSemester.current = false;
                            SemesterSchema.update(thisSemester, {
                              where: { id: semester.id }
                            }).then(res => {
                              SemesterSchema.update(currentSemester, {
                                where: { id: semester.id + 1 }
                              }).then(rest => {
                                response.json({
                                  msg: "Data has been submitted successfully"
                                });
                              });
                            });
                          }
                          response.json({
                            msg: "Data has been submitted successfully"
                          });
                        })
                        .catch(err => console.log(err));
                    })
                    .catch(err => response.json(err));
                }
              });
              break;
            }
            case 4: {
              if (rows[0].total < total * 4) {
                errors.paid = "Some members have not fully paid";
                return response.status(401).json(errors);
              }
              // Check if member has already graduated
              GraduationSchema.findOne({
                where: {
                  memberId: request.body.member,
                  semesterId: semester.id
                }
              }).then(graduand => {
                if (graduand) {
                  errors.graduand = "This member has already been passed out";
                  return response.status(401).json(errors);
                } else {
                  GraduationSchema.create(gradFields)
                    .then(result => {
                      GraduationSchema.findAll({
                        raw: true,
                        attributes: [
                          [
                            config.sequelize.fn(
                              "COUNT",
                              config.sequelize.col("*")
                            ),
                            "no_rows"
                          ]
                        ],
                        where: { semesterId: semester.id }
                      })
                        .then(row => {
                          if (row[0].no_rows === "2") {
                            // Close semester
                            const thisSemester = {};
                            const currentSemester = {};
                            currentSemester.current = true;
                            thisSemester.current = false;
                            SemesterSchema.update(thisSemester, {
                              where: { id: semester.id }
                            }).then(res => {
                              SemesterSchema.update(currentSemester, {
                                where: { id: semester.id + 1 }
                              }).then(rest => {
                                response.json({
                                  msg: "Data has been submitted successfully"
                                });
                              });
                            });
                          }
                          response.json({
                            msg: "Data has been submitted successfully"
                          });
                        })
                        .catch(err => console.log(err));
                    })
                    .catch(err => response.json(err));
                }
              });
              break;
            }
            default: {
              errors.paid = "None of the members has paid for this cycle";
              return response.status(500).json(errors);
            }
          }
        });
      });
    });
  }
);

module.exports = router;
