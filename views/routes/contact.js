const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const controller = require("../controllers/contact");
const adminAuthMiddleware = require("../middleware/adminAuth");

router.post("/", controller.create);
router.get("/all", adminAuthMiddleware, controller.getAll);
router.put("/reply", adminAuthMiddleware, controller.sendReply);
router.get("/:id", adminAuthMiddleware, controller.getOne);

module.exports = router;
