const express = require("express");
const router = express.Router();

const controller = require("../controllers/assessmentResult");
const userAuthMiddleware = require("../middleware/userAuth");

router.post("/", userAuthMiddleware, controller.add);

module.exports = router;
