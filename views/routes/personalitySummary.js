const express = require("express");
const router = express.Router();

const controller = require("../controllers/personalitySummary");
const adminAuthMiddleware = require("../middleware/adminAuth");

router.post("/", adminAuthMiddleware, controller.create);

module.exports = router;
