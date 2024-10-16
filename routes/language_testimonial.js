const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const fileUpload = require("../utils/fileUpload");
const controller = require("../controllers/language_testimonial");
const adminAuthMiddleware = require("../middleware/adminAuth");

router.get("/:testimonial_id/:language_id", adminAuthMiddleware, controller.getOne);
router.get("/employer/:testimonial_id/:language_id", adminAuthMiddleware, controller.getOneEmployer);
router.put(
  "/",
  fileUpload().array("testimonial", 5),
  adminAuthMiddleware,
  controller.update
);

router.put(
  "/employer",
  fileUpload().array("testimonial", 5),
  adminAuthMiddleware,
  controller.updateEmployer
);

module.exports = router;
