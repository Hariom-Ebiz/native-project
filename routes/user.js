const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const userController = require("../controllers/user");

const adminAuthMiddleware = require("../middleware/adminAuth");
const commonAuthMiddleware = require("../middleware/authMiddleware");
const userAuthMiddleware = require("../middleware/userAuth");
const optionalAuthMiddleware = require("../middleware/optionalAuth");
const fileUpload = require("../utils/fileUpload");
const updateFile = require("../middleware/updateFile");
const multer = require("multer");
const upload = multer({ dest: "uploads/images/" });

//used by admin
router.post(
  "/create",
  fileUpload("profile_picture").array("profile_picture", 5),
  [
    check("email")
      .normalizeEmail()
      .isEmail()
      .matches(
        // /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/
      )
      .withMessage("Please provide a valid email Id."),
    check("password")
      .isLength({ min: 8 })
      .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
      .withMessage("Please provide a valid Password."),
  ],
  adminAuthMiddleware,
  userController.create
);


router.post(
  "/employer/create",
  fileUpload("company_profile").array("logo", 1),
  [
    check("email")
      .normalizeEmail()
      .isEmail()
      .matches(
        // /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/
      )
      .withMessage("Please provide a valid email Id."),
    check("password")
      .isLength({ min: 8 })
      .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
      .withMessage("Please provide a valid Password."),
  ],
  adminAuthMiddleware,
  userController.employerCreate
);


router.get("/all", commonAuthMiddleware, userController.getAll);

router.put("/status", adminAuthMiddleware, userController.changeStatus);

router.put(
  "/",
  fileUpload("profile_picture").array("profile_picture", 5),
  [
    check("email")
      .normalizeEmail()
      .isEmail()
      .matches(
        // /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/
      )
      .withMessage("Please provide a valid email Id."),
  ],
  adminAuthMiddleware,
  userController.updateUser
);

router.delete("/", adminAuthMiddleware, userController.delete);
//--------------------------------

//for admin
router.put(
  "/change-password",
  adminAuthMiddleware,
  userController.changePassword
);

//for admin
router.post("/send-credentials", adminAuthMiddleware, userController.sendCreds);
router.get("/edit/:id", adminAuthMiddleware, userController.getOneForEdit);

// ------------------------------ CLIENT ROUTES

router.post(
  "/job-seeker/signup",
  [
    check("email")
      .normalizeEmail()
      .isEmail()
      .matches(
        // /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/
      )
      .withMessage("Please provide a valid email Id."),
    check("password")
      .isLength({ min: 8 })
      .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
      .withMessage("Please provide a valid Password."),
    check("first_name").notEmpty().withMessage("Please provide first name."),
    check("last_name").notEmpty().withMessage("Please provide last name."),
    // check("username").notEmpty(),
  ],
  userController.signup
);
router.post("/email-verify", userController.emailVerify);

router.post(
  "/job-seeker/add-more-info",
  fileUpload("profile_picture").array("profile_picture", 5),
  userController.addMoreInfo
);

router.post("/ckeck-token-exists", userController.checkTokenExists);
router.post("/resend-token", userController.resendVerificationToken);
router.post("/verify-token", userController.verifyToken);
router.post(
  "/job-seeker/login",
  [
    check("email")
      .normalizeEmail()
      .isEmail()
      .matches(
        // /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/
      )
      .withMessage("Please provide a valid email Id."),
    check("password")
      .isLength({ min: 8 })
      .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
      .withMessage("Please provide a valid Password."),
  ],
  userController.jobSeekerLogin
);
router.post(
  "/job-seeker/forgot-password",
  [
    check("email")
      .normalizeEmail()
      .isEmail()
      .matches(
        // /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/
      )
      .withMessage("Please provide a valid email Id."),
      check("user_role_id")
      .isNumeric()
      .not()
      .isEmpty()
      .withMessage("Please provide a valid role id.")
  ],
  userController.jobSeekerForgotPassword
);
router.post(
  "/job-seeker/reset-password",
  [
    check("newPassword")
      .isLength({ min: 8 })
      .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
      .withMessage("Please provide a valid Password."),
    check("token").notEmpty(),
    check("user_role_id").notEmpty().isNumeric().withMessage("Please provide a valid role id.")
  ],
  userController.jobSeekerResetPassword
);
router.post("/verify", userController.verify);

router.post("/verify/employer", userController.verify);

router.post(
  "/job-seeker/change-password",
  userAuthMiddleware,
  userController.userChangePassword
);

router.get(
  "/job-seeker/profile",
  userAuthMiddleware,
  userController.getJobSeekerProfile
);

router.get(
  "/job-seeker/assessment",
  userAuthMiddleware,
  userController.getJobSeekerAssessment
);

router.put(
  "/job-seeker/update-profile",
  fileUpload("profile_picture").array("file", 5),
  userAuthMiddleware,
  userController.jobSeekerUpdateProfile
);

// const cpUpload = fileUpload("cv").fields([
//   { name: "profile_pic", maxCount: 1 },
//   { name: "cover_pic", maxCount: 1 },
// ]);

// router.post(
//   "/job-seeker/create-cv-step1",
//   cpUpload,
//   userAuthMiddleware,
//   userController.jobSeekerCreateCv
// );

router.post(
  "/job-seeker/signup-combined",
  fileUpload("profile_picture").array("profile_picture", 5),
  [
    check("email")
      .normalizeEmail()
      .isEmail()
      .matches(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/)
      .withMessage("Please provide a valid email Id."),
    check("password")
      .isLength({ min: 8 })
      .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
      .withMessage("Please provide a valid Password."),
    check("first_name").notEmpty().withMessage("Please provide first name."),
    check("last_name").notEmpty().withMessage("Please provide last name."),
  ],
  userController.combineSignup
);

router.get("/certificates", userAuthMiddleware, userController.getUserCertificates)

// to avoid mis-matching of route
router.get("/:id", adminAuthMiddleware, userController.getOne);

router.post(
  "/verify-admin",
  adminAuthMiddleware,
  userController.ChangeVerifyingAdmin
);

//*********************** EMPLOYER ROUTES ********************/

router.post(
  "/employer/signup",
  fileUpload("company_profile").array("logo", 1),
  [
    check("email")
      .normalizeEmail()
      .isEmail()
      .matches(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/)
      .withMessage("Please provide a valid email Id."),
    check("password")
      .isLength({ min: 8 })
      .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
      .withMessage("Please provide a valid Password."),
    check("first_name").notEmpty().withMessage("Please provide Company name.")
  ],
  userController.employerSignup
);

router.post(
  "/employer/login",
  [
    check("email")
      .normalizeEmail()
      .isEmail()
      .matches(
        // /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/
      )
      .withMessage("Please provide a valid email Id."),
    check("password")
      .isLength({ min: 8 })
      .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
      .withMessage("Please provide a valid Password."),
  ],
  userController.EmployerLogin
);

router.get("/employer/:id", adminAuthMiddleware, userController.getCompanyProfile);

module.exports = router;
