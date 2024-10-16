const express = require("express");
const router = express.Router();
const controller = require("../controllers/jobSeekerJobs");

const userAuthMiddleware = require("../middleware/userAuth");

router.get("/get/description/:id", userAuthMiddleware, controller.getOne);


router.post("/apply", userAuthMiddleware, controller.applyJob);

router.get("/application/questions", userAuthMiddleware, controller.getApplicationFormQues)
router.get("/application/answers", userAuthMiddleware, controller.getApplicationFormAns)

module.exports = router;
