const express = require("express");
const router = express.Router();

const fileUpload = require("../utils/fileUpload");
const controller = require("../controllers/course");
const adminAuthMiddleware = require("../middleware/adminAuth");
const userAuthMiddleware = require("../middleware/userAuth");
const optionalAuthMiddleware = require("../middleware/optionalAuth");

router.post(
  "/",
  fileUpload("course").fields([
    { name: "image", maxCount: 1 },
    // { name: "background_image", maxCount: 1 },
  ]),
  adminAuthMiddleware,
  controller.create
);

router.put(
  "/",
  fileUpload("course").fields([
    { name: "image", maxCount: 1 },
    // { name: "background_image", maxCount: 1 },
  ]),
  adminAuthMiddleware,
  controller.update
);

// router.get("/client", optionalAuthMiddleware, controller.getAllClient);

router.get("/:id", adminAuthMiddleware, controller.getOne);

router.get("/", adminAuthMiddleware, controller.getAll);

module.exports = router;
