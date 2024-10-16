const express = require("express");
const CompanyProfile = require("../controllers/companyProfile");
const UserController = require("../controllers/user");
const fileUpload = require("../utils/fileUpload");
const authMiddleware = require("../middleware/authMiddleware");
const adminAuth = require("../middleware/adminAuth");
const { getOne } = require("../models/companyProfile");
const router = express.Router();

router.put("/", fileUpload("company_profile").fields([{name: "logo", maxCount: 1},{name: "cover_image", maxCount: 1}]), authMiddleware, CompanyProfile.update);

router.get("/:id", adminAuth, CompanyProfile.getOne);

router.get("/user/get", authMiddleware, UserController.getCompanyProfile);

router.get("/my/jobs", authMiddleware, CompanyProfile.getMyJObs);

module.exports = router;