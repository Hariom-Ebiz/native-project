const express = require("express");
const router = express.Router();

const faqController = require("../controllers/faq");
const AuthMiddleware = require("../middleware/authMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuth");

router.post("/", adminAuthMiddleware, faqController.create);

router.get("/all", faqController.getAll);

router.get("/get/category-by-role", AuthMiddleware, faqController.getCaetgoryByRole);

router.delete("/", adminAuthMiddleware, faqController.delete);

router.get("/:id", faqController.getOne);

router.put("/", adminAuthMiddleware, faqController.update);

router.put("/status", adminAuthMiddleware, faqController.changeStatus);

router.put("/like-dislike", faqController.likeOrDislike);


module.exports = router;
