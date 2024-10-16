const express = require("express");
const router = express.Router();

const controller = require("../controllers/careerInterestCategory");
const adminAuthMiddleware = require("../middleware/adminAuth");

router.post("/", adminAuthMiddleware, controller.create);

router.get("/all", controller.getAll);

module.exports = router;
