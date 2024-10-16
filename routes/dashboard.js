const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const dashboardController = require("../controllers/dashboard");
const adminAuthMiddleware = require("../middleware/adminAuth");
const userAuthMiddleware = require("../middleware/userAuth");

router.get("/get-candidate-dashboard-data", userAuthMiddleware, dashboardController.getAllCandidateDashboardData)

router.get("/get-candidate-dashboard-course-data", userAuthMiddleware, dashboardController.getAllCandidateDashboardCourseData)
router.get("/get-candidate-dashboard-job-data", userAuthMiddleware, dashboardController.getAllCandidateDashboardJobData)

router.get("/get-employer-dashboard-data", userAuthMiddleware, dashboardController.getAllEmployerDashboardData)


module.exports = router;
