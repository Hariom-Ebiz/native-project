const express = require("express");
const router = express.Router();

const faqController = require("../controllers/faq");
const adminAuthMiddleware = require("../middleware/adminAuth");

router.post("/", adminAuthMiddleware, faqController.create);

router.get("/all", faqController.getAll);

router.delete("/", adminAuthMiddleware, faqController.delete);

router.get("/:id", faqController.getOne);

router.put("/", adminAuthMiddleware, faqController.update);

router.put("/status", adminAuthMiddleware, faqController.changeStatus);

module.exports = router;
