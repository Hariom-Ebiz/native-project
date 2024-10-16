const express = require("express");
const router = express.Router();

const settingController = require("../controllers/setting");
const adminAuthMiddleware = require("../middleware/adminAuth");
const commonAuthMiddleware = require("../middleware/authMiddleware");
const fileUpload = require("../utils/fileUpload");
const updateFile = require("../middleware/updateFile");

router.post("/", adminAuthMiddleware, settingController.create);

router.get("/all", adminAuthMiddleware, settingController.getAll);

router.delete("/", adminAuthMiddleware, settingController.delete);



router.put("/", adminAuthMiddleware, settingController.update);

router.get(
  "/all-prefix/:prefix",
  //   commonAuthMiddleware,
  settingController.getAllPrefix
);

router.put(
  "/all-prefix",
  fileUpload("system-images").array("images", 5),
  // updateFile,
  adminAuthMiddleware,
  settingController.updatePrefix
);

router.get("/key/:key", adminAuthMiddleware, settingController.getByKey);
router.get("/client-settings", settingController.getSettingForClient);
router.get("/:id", adminAuthMiddleware, settingController.getOne);

module.exports = router;
