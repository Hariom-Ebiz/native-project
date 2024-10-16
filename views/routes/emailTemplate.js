const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const emailTemplateController = require("../controllers/emailTemplate");
const adminAuthMiddleware = require("../middleware/adminAuth");

router.post(
  "/",
  [
    check("name").notEmpty().withMessage("Name is required"),
    check("subject").notEmpty().withMessage("Subject are required"),
    check("action").notEmpty().withMessage("Action are required"),
    check("body").notEmpty().withMessage("Body are required"),
  ],
  adminAuthMiddleware,
  emailTemplateController.create
);

router.get("/all", adminAuthMiddleware, emailTemplateController.getAll);

// router.delete("/", adminAuthMiddleware, emailTemplateController.delete);

router.get("/:id", adminAuthMiddleware, emailTemplateController.getOne);

router.put(
  "/",
  [check("id").notEmpty().withMessage("Id is required")],
  adminAuthMiddleware,
  emailTemplateController.update
);

module.exports = router;
