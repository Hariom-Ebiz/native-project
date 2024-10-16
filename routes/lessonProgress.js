const express = require("express");
const router = express.Router();

const userAuthMiddleware = require("../middleware/userAuth");
const controller = require("../controllers/lessonProgress");
const careerJourneyController = require("../controllers/careerJourney");

router.post("/", userAuthMiddleware, controller.create);

router.put("/complete", userAuthMiddleware, careerJourneyController.completeLessonProgress);

module.exports = router;
