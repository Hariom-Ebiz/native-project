const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const controller = require("../controllers/newsletterSubscriber");
const adminAuthMiddleware = require("../middleware/adminAuth");

router.post("/", controller.create);
router.get("/all", adminAuthMiddleware, controller.getAll);


module.exports = router;
