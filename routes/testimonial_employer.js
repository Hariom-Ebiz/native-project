const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const fileUpload = require("../utils/fileUpload");
const controller = require("../controllers/testimonial_employer");
const adminAuthMiddleware = require("../middleware/adminAuth");

router.post(
  "/",
  fileUpload("testimonial").array("image", 5),
  adminAuthMiddleware,
  controller.create
);

router.get("/all", adminAuthMiddleware, controller.getAll);
router.get("/:id", adminAuthMiddleware, controller.getOne);

router.delete("/", adminAuthMiddleware, controller.delete);

router.put(
  "/",
  fileUpload("testimonial").array("image", 5),
  adminAuthMiddleware,
  controller.update
);

module.exports = router;
