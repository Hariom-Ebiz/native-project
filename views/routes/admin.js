const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const adminController = require("../controllers/admin");
const adminAuthMiddleware = require("../middleware/adminAuth");
const userAuthMiddleware = require("../middleware/userAuth");

router.post(
  "/login",
  [
    check("email")
      .normalizeEmail()
      .isEmail()
      .matches(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      )
      .withMessage("Please provide a valid email Id."),
    check("password")
      .isLength({ min: 8 })
      .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
      .withMessage("Please provide a valid password."),
  ],
  adminController.login
);

router.post(
  "/signup",
  [
    check("email")
      .normalizeEmail()
      .isEmail()
      .matches(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      )
      .withMessage("Please provid a valid email Id"),
    check("password")
      .isLength({ min: 8 })
      .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
      .withMessage("Please provid a valid password"),
  ],
  adminController.signup
);

router.post("/verify", adminController.verifyToken);

router.put("/update", adminAuthMiddleware, adminController.updateProfile);

router.post(
  "/change-password",
  [
    check("oldPassword")
      .isLength({ min: 8 })
      .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/),
    check("newPassword")
      .isLength({ min: 8 })
      .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/),
  ],
  adminAuthMiddleware,
  adminController.changePassword
);

router.post(
  "/forgot-password",
  [check("email").notEmpty().withMessage("Email is required")],
  adminController.forgotPassword
);

router.post(
  "/verify-forgot-password-token",
  adminController.verifyForgetPassToken
);

router.post(
  "/reset-password",
  [
    check("newPassword")
      .isLength({ min: 8 })
      .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
      .withMessage("Please provide a valid password."),
  ],
  adminController.resetPassword
);

router.get("/languages", adminAuthMiddleware, adminController.getLanguages);

// SUB ADMIN ROUTES --------------

router.post(
  "/sub-admin",
  [
    check("email")
      .normalizeEmail()
      .isEmail()
      .matches(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      )
      .withMessage("Please provid a valid email Id"),
    check("password")
      .isLength({ min: 8 })
      .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
      .withMessage("Please provid a valid password"),
  ],
  adminAuthMiddleware,
  adminController.createSubAdmin
);
router.get("/sub-admin", adminAuthMiddleware, adminController.getAllSubAdmins);
router.get(
  "/sub-admin/:id",
  adminAuthMiddleware,
  adminController.getOneSubAdmins
);
router.put("/sub-admin", adminAuthMiddleware, adminController.editSubAdmin);
router.put(
  "/sub-admin/status",
  adminAuthMiddleware,
  adminController.changeSubAdminStatus
);

router.put(
  "/sub-admin/change-password",
  adminAuthMiddleware,
  adminController.changeSubAdminPassword
);

router.post("/sub-admin/send-credentials", adminAuthMiddleware, adminController.sendSubAdminCreds);
router.delete("/sub-admin/delete", adminAuthMiddleware, adminController.deleteSubAdmin);

module.exports = router;
