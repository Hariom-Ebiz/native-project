const express = require("express");
const router = express.Router();

const saveApplicant = require("../controllers/employerSaveApplicant");
const AuthMiddleware = require("../middleware/authMiddleware");

router.post("/action", AuthMiddleware, saveApplicant.applicantAction);

router.get("/saved/list", AuthMiddleware, saveApplicant.getAll)

router.post("/change/status", AuthMiddleware, saveApplicant.changeStatus);

router.get("/get/status", AuthMiddleware, saveApplicant.getStatus);

router.get("/isSave", AuthMiddleware, saveApplicant.checkIsSave);

router.put("/applicant/see", AuthMiddleware, saveApplicant.seeApplicant)


router.get("/get-all-reject-reasons", AuthMiddleware, saveApplicant.getRejectReasons)


module.exports = router;
