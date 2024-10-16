const express = require("express");
const router = express.Router();

const notificationController = require("../controllers/notification");
const adminAuthMiddleware = require("../middleware/adminAuth");
const commonAuthMiddleware = require("../middleware/authMiddleware");

router.get("/all", commonAuthMiddleware, notificationController.getAll);

router.get("/read-one", commonAuthMiddleware, notificationController.readOne);

router.get("/unseen-notification-count", commonAuthMiddleware, notificationController.getUnseenMessageCount);

router.get("/settings", commonAuthMiddleware, notificationController.getNotifSettings);

router.put("/settings-update", commonAuthMiddleware, notificationController.updateNotifsSettings);

module.exports = router;