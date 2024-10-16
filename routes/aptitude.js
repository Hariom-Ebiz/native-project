const express = require("express");
const router = express.Router();

const fileUpload = require("../utils/fileUpload");
const aptitudeController = require("../controllers/aptitude");
const adminAuthMiddleware = require("../middleware/adminAuth");
const userAuthMiddleware = require("../middleware/userAuth");

router.get("/user/details", userAuthMiddleware, aptitudeController.getUserAptitudeDetails)
router.get("/user/questions/:typeId", userAuthMiddleware, aptitudeController.getAptitudeQuestions)
router.post("/user/submit/:typeId", userAuthMiddleware, aptitudeController.submitAptitudeTest)
router.get("/user/aptitudes", userAuthMiddleware, aptitudeController.getUserAptitudeTests)

// QUESTIONS ROUTES
router.get("/questions", adminAuthMiddleware, aptitudeController.getAllQuestions)
router.delete("/question",adminAuthMiddleware, aptitudeController.deleteQuestion)
router.get("/question/:id",adminAuthMiddleware, aptitudeController.getOneQuestion)
router.put("/question/:id",fileUpload("aptitude-images").any(),adminAuthMiddleware, aptitudeController.updateQuestion)

// PART ROUTES
router.post("/question-part",fileUpload("aptitude-images").any(),adminAuthMiddleware,aptitudeController.addQuestionsPart);
router.delete("/part",adminAuthMiddleware, aptitudeController.deletePart)
router.get("/part/:id",adminAuthMiddleware, aptitudeController.getOnePart)
router.get("/user/parts/:typeId",userAuthMiddleware, aptitudeController.getAptitudeParts)
router.put("/question-part/:id",fileUpload("aptitude-images").any(),adminAuthMiddleware, aptitudeController.updateQuestionsPart)

module.exports = router;

