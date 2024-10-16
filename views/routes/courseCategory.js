const express = require("express");
const router = express.Router();

const controller = require("../controllers/courseCategory");
const adminAuthMiddleware = require("../middleware/adminAuth");
const optionalAuthMiddleware = require("../middleware/optionalAuth");
const userAuthMiddleware = require("../middleware/userAuth");

router.post("/", adminAuthMiddleware, controller.create);

router.put("/", adminAuthMiddleware, controller.update);

router.get("/courses", optionalAuthMiddleware, controller.getCourses);

router.get("/third-category", userAuthMiddleware, controller.thirdCategory);

module.exports = router;
