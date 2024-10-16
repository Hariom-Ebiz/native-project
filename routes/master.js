const express = require("express");
const router = express.Router();

const controller = require("../controllers/master");
const adminAuthMiddleware = require("../middleware/adminAuth");
const AuthMiddleware = require("../middleware/authMiddleware");
const userAuthMiddleware = require("../middleware/userAuth");

router.get("/testimonials", controller.getAllTestimonials);
router.get("/employer/testimonials", controller.getAllEmpTestimonials);
router.get("/user-status", controller.getAllUserStatus);
router.get("/countries", controller.getAllCountries);
router.get("/cities", controller.getAllCities);
router.get("/areas", controller.getAllAreas);
router.get("/nationality", controller.getAllNationality);

router.get("/cities-country", controller.getAllCitiesCountries);
router.get("/lives-in-list", controller.getAllLivesInList);

// JOB INDUSTRY >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.post("/job-industry", adminAuthMiddleware, controller.createJobIndustry);
router.put("/job-industry", adminAuthMiddleware, controller.updateJobIndustry);
router.get("/job-industry", adminAuthMiddleware, controller.getAllJobIndustry);
router.get("/job-industry-list", controller.getMasterJobIndustry);
router.get(
  "/job-industry/:id",
  adminAuthMiddleware,
  controller.getOneJobIndustry
);
router.delete(
  "/job-industry",
  adminAuthMiddleware,
  controller.deleteJobIndustry
);

// JOB CATEGORY >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.post("/job-category", adminAuthMiddleware, controller.createJobCategory);
router.put("/job-category", adminAuthMiddleware, controller.updateJobCategory);
router.get("/job-category", adminAuthMiddleware, controller.getAllJobCategory);
router.get("/job-category-list",AuthMiddleware, controller.getMasterJobCategory);
router.get(
  "/job-category/:id",
  adminAuthMiddleware,
  controller.getOneJobCategory
);
router.delete(
  "/job-category",
  adminAuthMiddleware,
  controller.deleteJobCategory
);

// JOB TYPE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.post("/job-type", adminAuthMiddleware, controller.createJobType);
router.put("/job-type", adminAuthMiddleware, controller.updateJobType);
router.get("/job-type", adminAuthMiddleware, controller.getAllJobType);
router.get("/job-type-list",AuthMiddleware, controller.getMasterJobType);
router.get("/job-type/:id", adminAuthMiddleware, controller.getOneJobType);
router.delete("/job-type", adminAuthMiddleware, controller.deleteJobType);

// STUDY TOPC>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.post("/study-topic", adminAuthMiddleware, controller.createStudyTopic);
router.put("/study-topic", adminAuthMiddleware, controller.updateStudyTopic);
router.get("/study-topic", adminAuthMiddleware, controller.getAllStudyTopic);
router.get("/study-topic-list", controller.getMasterStudyTopic);
router.get(
  "/study-topic/:id",
  adminAuthMiddleware,
  controller.getOneStudyTopic
);
router.delete("/study-topic", adminAuthMiddleware, controller.deleteStudyTopic);

// STUDY FIELD >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.post("/study-field", adminAuthMiddleware, controller.createStudyField);
router.put("/study-field", adminAuthMiddleware, controller.updateStudyField);
router.get("/study-field", adminAuthMiddleware, controller.getAllStudyField);
router.get("/study-field-list", controller.getMasterStudyField);
router.get(
  "/study-field/:id",
  adminAuthMiddleware,
  controller.getOneStudyField
);
router.delete("/study-field", adminAuthMiddleware, controller.deleteStudyField);

// GRADE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.post("/grade", adminAuthMiddleware, controller.createGrade);
router.put("/grade", adminAuthMiddleware, controller.updateGrade);
router.get("/grade", adminAuthMiddleware, controller.getAllGrade);
router.get("/grade-list", controller.getMasterGrade);
router.get("/grade/:id", adminAuthMiddleware, controller.getOneGrade);
router.delete("/grade", adminAuthMiddleware, controller.deleteGrade);

// GRADUATION CERTIFICATE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.post(
  "/graduation-certificate",
  adminAuthMiddleware,
  controller.createGraduationCertificate
);
router.put(
  "/graduation-certificate",
  adminAuthMiddleware,
  controller.updateGraduationCertificate
);
router.get(
  "/graduation-certificate",
  adminAuthMiddleware,
  controller.getAllGraduationCertificate
);
router.get(
  "/graduation-certificate-list",
  controller.getMasterGraduationCertificate
);
router.get(
  "/graduation-certificate/:id",
  adminAuthMiddleware,
  controller.getOneGraduationCertificate
);
router.delete(
  "/graduation-certificate",
  adminAuthMiddleware,
  controller.deleteGraduationCertificate
);

// DEGREE LEVEL >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.post("/degree-level", adminAuthMiddleware, controller.createDegreeLevel);
router.put("/degree-level", adminAuthMiddleware, controller.updateDegreeLevel);
router.get("/degree-level", adminAuthMiddleware, controller.getAllDegreeLevel);
router.get("/degree-level-list", controller.getMasterDegreeLevel);
router.get(
  "/degree-level/:id",
  adminAuthMiddleware,
  controller.getOneDegreeLevel
);
router.delete(
  "/degree-level",
  adminAuthMiddleware,
  controller.deleteDegreeLevel
);

// SKILL >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.post("/skill", adminAuthMiddleware, controller.createSkill);
router.put("/skill", adminAuthMiddleware, controller.updateSkill);
router.get("/skill", adminAuthMiddleware, controller.getAllSkill);
router.get("/skill-list", controller.getMasterSkill);
router.get("/skill/:id", adminAuthMiddleware, controller.getOneSkill);
router.delete("/skill", adminAuthMiddleware, controller.deleteSkill);

// LANGUAGE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.post("/language", adminAuthMiddleware, controller.createLanguage);
router.put("/language", adminAuthMiddleware, controller.updateLanguage);
router.get("/language", adminAuthMiddleware, controller.getAllLanguage);
router.get("/language-list", controller.getMasterLanguage);
router.get("/language/:id", adminAuthMiddleware, controller.getOneLanguage);
router.delete("/language", adminAuthMiddleware, controller.deleteLanguage);

// USER STATUS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.post("/user-status", adminAuthMiddleware, controller.createUserStatus);
router.put("/user-status", adminAuthMiddleware, controller.updateUserStatus);
router.get(
  "/user-statuses",
  adminAuthMiddleware,
  controller.getAllUserStatuses
);
router.get(
  "/user-status/:id",
  adminAuthMiddleware,
  controller.getOneUserStatus
);
router.delete("/user-status", adminAuthMiddleware, controller.deleteUserStatus);

// LIVES IN >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.post("/lives-in", adminAuthMiddleware, controller.createLivesIn);
router.put("/lives-in", adminAuthMiddleware, controller.updateLivesIn);
router.get("/lives-in", adminAuthMiddleware, controller.getAllLivesIn);
router.get("/lives-in/:id", adminAuthMiddleware, controller.getOneLivesIn);
router.delete("/lives-in", adminAuthMiddleware, controller.deleteLivesIn);
router.get("/lives-in-list", controller.getAllLivesInList);

// CARRIER LEVEL >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.post(
  "/carrier-level",
  adminAuthMiddleware,
  controller.createCarrierLevel
);
router.put(
  "/carrier-level",
  adminAuthMiddleware,
  controller.updateCarrierLevel
);
router.get(
  "/carrier-level",
  adminAuthMiddleware,
  controller.getAllCarrierLevel
);
router.get(
  "/carrier-level/:id",
  adminAuthMiddleware,
  controller.getOneCarrierLevel
);
router.delete(
  "/carrier-level",
  adminAuthMiddleware,
  controller.deleteCarrierLevel
);
router.get("/carrier-level-list", controller.getAllCarrierLevelList);
router.get("/carrier-level-list-auth",userAuthMiddleware, controller.getAllCarrierLevelListAuth);

// CARRIER LEVEL >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.post("/post-grad-degree-level", adminAuthMiddleware, controller.createPostGradDegreeLevel);
router.put("/post-grad-degree-level", adminAuthMiddleware, controller.updatePostGradDegreeLevel);
router.get("/post-grad-degree-level", adminAuthMiddleware, controller.getAllPostGradDegreeLevel);
router.get("/post-grad-degree-level-list", controller.getMasterPostGradDegreeLevel);
router.get(
  "/post-grad-degree-level/:id",
  adminAuthMiddleware,
  controller.getOnePostGradDegreeLevel
);
router.delete(
  "/post-grad-degree-level",
  adminAuthMiddleware,
  controller.deletePostGradDegreeLevel
);

// psycometric values >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

router.put("/psycometric", adminAuthMiddleware, controller.updatePsycometricValue);
router.get("/psycometric/edit/:id", adminAuthMiddleware, controller.getOnePsycometric);
router.get("/psycometric-list", controller.getAllPsycometric);

// JOB INDUSTRY >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.post("/employee-number", adminAuthMiddleware, controller.createEmployeeNumber);
router.put("/employee-number", adminAuthMiddleware, controller.updateEmployeeNumber);
router.get("/employee-number", adminAuthMiddleware, controller.getAllEmployeeNumber);
router.get("/employee-number-list", controller.getMasterEmployeeNumber);
router.get(
  "/employee-number/:id",
  adminAuthMiddleware,
  controller.getOneEmployeeNumber
);
router.delete(
  "/employee-number",
  adminAuthMiddleware,
  controller.deleteEmployeeNumber
);

module.exports = router;
