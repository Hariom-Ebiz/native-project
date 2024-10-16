const express = require("express");
const router = express.Router();

const SubscriberControler = require("../controllers/employerSubscriber");
const adminAuthMiddleware = require("../middleware/adminAuth");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, SubscriberControler.create);

router.get("/list", authMiddleware, SubscriberControler.getMyMemberships)

module.exports = router;
