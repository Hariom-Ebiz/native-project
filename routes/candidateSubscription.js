const express = require("express");
const router = express.Router();

const SubscriptionController = require("../controllers/candidateSubscription");
const adminAuthMiddleware = require("../middleware/adminAuth");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/all", adminAuthMiddleware, SubscriptionController.getAll);

router.get("/users/list", authMiddleware, SubscriptionController.getAllByUser);

router.get("/:id", adminAuthMiddleware, SubscriptionController.getOne);

router.put("/:id", adminAuthMiddleware, SubscriptionController.update);


module.exports = router;
