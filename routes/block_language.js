const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const fileUpload = require("../utils/fileUpload");
const controller = require("../controllers/block_language");
const adminAuthMiddleware = require("../middleware/adminAuth");

router.post(
  "/",
  fileUpload("block").array("image", 5),
  adminAuthMiddleware,
  controller.create
);

router.get("/all", adminAuthMiddleware, controller.getAll);
// router.delete("/", adminAuthMiddleware, controller.delete);
router.get("/:block_id/:language_id", adminAuthMiddleware, controller.getOne);

router.put(
  "/",
  fileUpload("block").array("image", 5),
  adminAuthMiddleware,
  controller.update
);

router.get("/get-block/:page_slug", controller.getBlocksByPage);

// router.put("/status", adminAuthMiddleware, controller.changeStatus);

module.exports = router;
