const express = require("express");
const router = express.Router();

const HiringController = require("../controllers/jobSeekerHiringNotes");
const AuthMiddleware = require("../middleware/authMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuth");

router.post("/", AuthMiddleware, HiringController.create);

router.get("/all", AuthMiddleware, HiringController.getAll);

router.get("/get/category-by-role", AuthMiddleware, HiringController.getCaetgoryByRole);

router.delete("/", adminAuthMiddleware, HiringController.delete);

router.get("/:id", HiringController.getOne);

router.put("/", adminAuthMiddleware, HiringController.update);

router.put("/status", adminAuthMiddleware, HiringController.changeStatus);

router.put("/like-dislike", HiringController.likeOrDislike);


module.exports = router;
