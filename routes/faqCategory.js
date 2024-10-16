const express = require("express");
const router = express.Router();

const faqCateController = require("../controllers/faqCategory");
const adminAuthMiddleware = require("../middleware/adminAuth");

router.post("/", adminAuthMiddleware, faqCateController.create);

router.get("/all", faqCateController.getAll);

router.delete("/", adminAuthMiddleware, faqCateController.delete);

router.get("/:id", faqCateController.getOne);

router.put("/", adminAuthMiddleware, faqCateController.update);

router.put("/status", adminAuthMiddleware, faqCateController.changeStatus);

module.exports = router;
