const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const fileUpload = require("../utils/fileUpload");
const controller = require("../controllers/faq_language");
const adminAuthMiddleware = require("../middleware/adminAuth");

router.post(
  "/",
  adminAuthMiddleware,
  controller.create
);

router.get("/all", controller.getAll);
// router.delete("/", adminAuthMiddleware, controller.delete);
router.get("/:faq_id/:language_id", adminAuthMiddleware, controller.getOne);

router.put(
  "/",
  adminAuthMiddleware,
  controller.update
);

router.get("/get-faq/:page_slug", controller.getFaqsByPage);


module.exports = router;
