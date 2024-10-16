const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const controller = require("../controllers/jobSeekerCv");

const adminAuthMiddleware = require("../middleware/adminAuth");
const commonAuthMiddleware = require("../middleware/authMiddleware");
const userAuthMiddleware = require("../middleware/userAuth");
const optionalAuthMiddleware = require("../middleware/optionalAuth");
const fileUpload = require("../utils/fileUpload");
const updateFile = require("../middleware/updateFile");

const cpUpload = fileUpload("cv").fields([
  { name: "profile_pic", maxCount: 1 },
  { name: "cover_pic", maxCount: 1 },
]);

//used by admin
router.post(
  "/create-step-1",
  cpUpload,
  userAuthMiddleware,
  controller.createCvStep1
);
router.post("/create-step-2", userAuthMiddleware, controller.createCvStep2);
router.post("/create-step-3", userAuthMiddleware, controller.createCvStep3);
router.post("/create-step-4", userAuthMiddleware, controller.createCvStep4);

router.get("/get-step-1", userAuthMiddleware, controller.getCvStep1);
router.get("/get-step-2", userAuthMiddleware, controller.getCvStep2);
router.get("/get-step-3", userAuthMiddleware, controller.getCvStep3);
router.get("/get-step-4", userAuthMiddleware, controller.getCvStep4);

router.get("/get-complete",userAuthMiddleware, controller.getComplete);
router.get("/get-complete/:id", controller.getCompleteForAdmin);

router.get("/get-job-seeker-questions-answers", userAuthMiddleware, controller.getJobSeekerQuestionsAnswers)

router.put(
  "/edit-step-1",
  cpUpload,
  userAuthMiddleware,
  controller.editCvStep1
);
router.put("/edit-step-2", userAuthMiddleware, controller.editCvStep2);
router.put("/edit-step-3", userAuthMiddleware, controller.editCvStep3);
router.put("/edit-step-4", userAuthMiddleware, controller.editCvStep4);
router.get("/employer/search", userAuthMiddleware, controller.getCVsListForEmployer);

router.get("/employer/get-complete/:id", userAuthMiddleware, controller.getCompleteForEmployer);

router.get("/job-types-filter", controller.getJobTypesForFilter)
router.get("/job-category-filter", controller.getJobCategoryForFilter)

router.get("/salary-range-filter", userAuthMiddleware,controller.getSalaryRangeForFiler)

router.get("/get/assesment-result/:userId", userAuthMiddleware,controller.getJobSeekerAssesment)

module.exports = router;
