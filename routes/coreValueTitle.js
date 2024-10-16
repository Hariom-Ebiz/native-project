const express = require("express");
const router = express.Router();

const controller = require("../controllers/coreValueTitle");
const adminAuthMiddleware = require("../middleware/adminAuth");

router.post("/", adminAuthMiddleware, controller.create);

router.put("/", adminAuthMiddleware, controller.update);

router.get("/all", controller.getAll);

router.delete("/", adminAuthMiddleware, controller.delete);

module.exports = router;
