const express = require("express");
const router = express.Router();

const cmsController = require("../controllers/cms");
const adminAuthMiddleware = require("../middleware/adminAuth");

router.post("/", adminAuthMiddleware, cmsController.create);

router.get("/all", cmsController.getAll);

router.delete("/", adminAuthMiddleware, cmsController.delete);

router.get("/:id", cmsController.getOne);

router.put("/", adminAuthMiddleware, cmsController.update);

router.get("/slug/:slug", cmsController.getBySlug);

module.exports = router;
