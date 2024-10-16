const express = require("express");
const router = express.Router();

const controller = require("../controllers/miscellaneous");
const adminAuthMiddleware = require("../middleware/adminAuth");
const userAuthMiddleware = require("../middleware/userAuth");

router.get(
  "/job-seeker-chart/:by",
  adminAuthMiddleware,
  controller.jobSeekerChart
);

router.get(
  "/employer-chart/:by",
  adminAuthMiddleware,
  controller.employerChart
);

router.get("/count", adminAuthMiddleware, controller.counts);

module.exports = router;
