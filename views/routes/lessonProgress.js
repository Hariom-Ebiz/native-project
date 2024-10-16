const express = require("express");
const router = express.Router();

const userAuthMiddleware = require("../middleware/userAuth");
const controller = require("../controllers/lessonProgress");

router.post("/", userAuthMiddleware, controller.create);

router.put("/complete", userAuthMiddleware, controller.complete);

module.exports = router;
