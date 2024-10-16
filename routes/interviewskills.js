const express = require("express");
const router = express.Router();

const interviewSkillsController = require("../controllers/interviewskills");
const adminAuthMiddleware = require("../middleware/adminAuth");
const commonAuthMiddleware = require("../middleware/authMiddleware");
const optionalAuthMiddleware = require("../middleware/optionalAuth");
const userAuthMiddleware = require("../middleware/userAuth");
const fileUpload = require("../utils/fileUpload");
const {check} = require("express-validator")


// router.get("/all-by-categories", commonAuthMiddleware, interviewSkillsController.getAllGroupByCategories);
router.get("/all-courses", adminAuthMiddleware, interviewSkillsController.getAllStandoutCourse);
// router.get("/all-courses-front", commonAuthMiddleware, interviewSkillsController.getAllStandoutCourseFront);
// router.get("/course/:id", commonAuthMiddleware, interviewSkillsController.getOneCourse);

// router.put("/course",fileUpload("course_image").single("course_image"), commonAuthMiddleware, interviewSkillsController.updateStandoutCourse);
// router.post("/create",
//   fileUpload("course_image").single("course_image"),
//   [
//     check("title").isEmpty().withMessage("title should not be empty"),
//     check("description").isEmpty().withMessage("description should not be empty"),
//     check("category_id").isEmpty().withMessage("category_id should not be empty")
//   ],
//   adminAuthMiddleware, interviewSkillsController.addCourse);


  router.get("/all-lessons-by-course", adminAuthMiddleware, interviewSkillsController.getAllStandoutLessonsByCourses);
//   router.get("/all-lessons-by-categories", commonAuthMiddleware, interviewSkillsController.getAllLessonsGroupByCategory);
//   router.get("/lesson/:id", commonAuthMiddleware, interviewSkillsController.getOneLesson);
  router.delete("/lesson", adminAuthMiddleware, interviewSkillsController.deleteStandoutLesson);
//   router.put("/lesson",fileUpload("lesson_data").fields([{ name: 'lesson_image', maxCount: 1 }, { name: 'lesson_content', maxCount: 1 }]), commonAuthMiddleware, interviewSkillsController.updateStandoutLesson);
//   router.post("/lesson/add",
//     fileUpload("lesson_data").fields([{ name: 'lesson_image', maxCount: 1 }, { name: 'lesson_content', maxCount: 1 }]),
//     [
//       check("title").isEmpty().withMessage("title should not be empty"),
//       check("description").isEmpty().withMessage("description should not be empty"),
//     ],
//     adminAuthMiddleware, interviewSkillsController.addLesson);
  
// router.get("/lesson-full-details/:id", commonAuthMiddleware, interviewSkillsController.getLessonData)

// router.post("/standout-category", adminAuthMiddleware, interviewSkillsController.createStandoutCategory);
// router.put("/standout-category", adminAuthMiddleware, interviewSkillsController.updateStandoutCategory);

router.delete(
  "/category",
  adminAuthMiddleware,
  interviewSkillsController.deleteStandoutCategory
);


/*    CATEGORY ROUTES    */
router.post("/category/", adminAuthMiddleware, interviewSkillsController.createCategory);

router.put("/category/", adminAuthMiddleware, interviewSkillsController.updateCategory);

router.get("/category/courses", optionalAuthMiddleware, interviewSkillsController.getCategoryCourses);

router.get("/category", adminAuthMiddleware, interviewSkillsController.getAllStandoutCategory);

router.get("/category/:id",adminAuthMiddleware,interviewSkillsController.getOneStandoutCategory);

router.get("/category/third-category", userAuthMiddleware, interviewSkillsController.thirdCategory);


/*    COURSE PACKAGE ROUTES    */
router.post("/package/",fileUpload("course_image").single("course_image"), adminAuthMiddleware, interviewSkillsController.createStandoutPackage);

router.put("/package/",fileUpload("course_image").single("course_image"), adminAuthMiddleware, interviewSkillsController.updateStandoutPackage);

router.get("/package", adminAuthMiddleware, interviewSkillsController.getAllStandoutPackage);

router.get("/package/:id",adminAuthMiddleware,interviewSkillsController.getOneStandoutPackage);

router.delete("/package", commonAuthMiddleware, interviewSkillsController.deleteStandoutPackage);

/*    COURSES ROUTES    */
router.post(
  "/course/",
  fileUpload("course_image").single("course_image"),
  adminAuthMiddleware,
  interviewSkillsController.createCourse
);

router.put("/course/",fileUpload("course_image").single("course_image"),adminAuthMiddleware,interviewSkillsController.updateCourse);

router.get("/course/:id", adminAuthMiddleware, interviewSkillsController.getOneCourse);

router.get("/course/", adminAuthMiddleware, interviewSkillsController.getAllCourses);

router.delete("/course", commonAuthMiddleware, interviewSkillsController.deleteStandoutCourse);

/*    LESSON ROUTES    */
router.post("/lesson/", fileUpload("lesson_content").fields([{ name: "image", maxCount: 1 }]),adminAuthMiddleware,interviewSkillsController.createLesson);

router.put("/lesson/",fileUpload("lesson_content").fields([{ name: "image", maxCount: 1 }]),adminAuthMiddleware,interviewSkillsController.updateLesson);

router.get("/lesson/:id", commonAuthMiddleware, interviewSkillsController.getOneLesson);

router.get("/lesson/", commonAuthMiddleware, interviewSkillsController.getAllLesson);

router.get("/lesson/all/:id", optionalAuthMiddleware, interviewSkillsController.getAllLessons);

router.get("/lesson/change/id", interviewSkillsController.lessonUpdateId);

router.post("/lesson/upload-lesson-content",adminAuthMiddleware, fileUpload("lesson_content").single("content"),interviewSkillsController.uploadVideoToBunny)


/*    LESSON PROGRESS ROUTES     */
router.post("/lesson-progress/", userAuthMiddleware, interviewSkillsController.createLessonProgress);

router.put("/lesson-progress/complete", userAuthMiddleware, interviewSkillsController.completeLessonProgress);


// router.get("/download-certificate", userAuthMiddleware,interviewSkillsController.downloadCertificate)
module.exports = router;