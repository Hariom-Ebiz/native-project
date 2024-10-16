const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const fileUpload = require("../utils/fileUpload");
const controller = require("../controllers/admin_role");
const adminAuthMiddleware = require("../middleware/adminAuth");

router.post(
  "/", 
  adminAuthMiddleware,
  controller.create
);

router.get("/all", adminAuthMiddleware, controller.getAll);
router.delete("/", adminAuthMiddleware, controller.delete);
router.get("/active-roles", adminAuthMiddleware, controller.getActiveRoles);
router.get("/:id", adminAuthMiddleware, controller.getOne);

router.put(
  "/",
  fileUpload("block").array("image", 5),
  adminAuthMiddleware,
  controller.update
);
router.put("/status", adminAuthMiddleware, controller.changeStatus);


module.exports = router;
