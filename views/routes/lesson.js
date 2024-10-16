const express = require("express");
const router = express.Router();

const fileUpload = require("../utils/fileUpload");
const controller = require("../controllers/lesson");
const adminAuthMiddleware = require("../middleware/adminAuth");
const userAuthMiddleware = require("../middleware/userAuth");
const optionalAuthMiddleware = require("../middleware/optionalAuth");

router.post(
  "/",
  fileUpload("lesson").fields([
    { name: "image", maxCount: 1 },
    { name: "document", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  adminAuthMiddleware,
  controller.create
);

router.put(
  "/",
  fileUpload("lesson").fields([
    { name: "image", maxCount: 1 },
    { name: "document", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  adminAuthMiddleware,
  controller.update
);

router.get("/:id", userAuthMiddleware, controller.getOne);

router.get("/", adminAuthMiddleware, controller.getAll);

router.get("/all/:id", optionalAuthMiddleware, controller.getAllLessons);

router.get("/change/id", controller.updateId);

module.exports = router;
