const express = require("express");
const router = express.Router();

const careerJourneyController = require("../controllers/careerJourney");
const adminAuthMiddleware = require("../middleware/adminAuth");
const commonAuthMiddleware = require("../middleware/authMiddleware");
const optionalAuthMiddleware = require("../middleware/optionalAuth");
const userAuthMiddleware = require("../middleware/userAuth");
const fileUpload = require("../utils/fileUpload");
const {check} = require("express-validator")


// router.get("/all-by-categories", commonAuthMiddleware, careerJourneyController.getAllGroupByCategories);
router.get("/all-courses", adminAuthMiddleware, careerJourneyController.getAllStandoutCourse);
// router.get("/all-courses-front", commonAuthMiddleware, careerJourneyController.getAllStandoutCourseFront);
// router.get("/course/:id", commonAuthMiddleware, careerJourneyController.getOneCourse);

// router.put("/course",fileUpload("course_image").single("course_image"), commonAuthMiddleware, careerJourneyController.updateStandoutCourse);
// router.post("/create",
//   fileUpload("course_image").single("course_image"),
//   [
//     check("title").isEmpty().withMessage("title should not be empty"),
//     check("description").isEmpty().withMessage("description should not be empty"),
//     check("category_id").isEmpty().withMessage("category_id should not be empty")
//   ],
//   adminAuthMiddleware, careerJourneyController.addCourse);


  router.get("/all-lessons-by-course", adminAuthMiddleware, careerJourneyController.getAllStandoutLessonsByCourses);
//   router.get("/all-lessons-by-categories", commonAuthMiddleware, careerJourneyController.getAllLessonsGroupByCategory);
//   router.get("/lesson/:id", commonAuthMiddleware, careerJourneyController.getOneLesson);
  router.delete("/lesson", adminAuthMiddleware, careerJourneyController.deleteStandoutLesson);
//   router.put("/lesson",fileUpload("lesson_data").fields([{ name: 'lesson_image', maxCount: 1 }, { name: 'lesson_content', maxCount: 1 }]), commonAuthMiddleware, careerJourneyController.updateStandoutLesson);
//   router.post("/lesson/add",
//     fileUpload("lesson_data").fields([{ name: 'lesson_image', maxCount: 1 }, { name: 'lesson_content', maxCount: 1 }]),
//     [
//       check("title").isEmpty().withMessage("title should not be empty"),
//       check("description").isEmpty().withMessage("description should not be empty"),
//     ],
//     adminAuthMiddleware, careerJourneyController.addLesson);
  
// router.get("/lesson-full-details/:id", commonAuthMiddleware, careerJourneyController.getLessonData)

// router.post("/standout-category", adminAuthMiddleware, careerJourneyController.createStandoutCategory);
// router.put("/standout-category", adminAuthMiddleware, careerJourneyController.updateStandoutCategory);

router.delete(
  "/category",
  adminAuthMiddleware,
  careerJourneyController.deleteStandoutCategory
);


/*    CATEGORY ROUTES    */
router.post("/category/", adminAuthMiddleware, careerJourneyController.createCategory);

router.put("/category/", adminAuthMiddleware, careerJourneyController.updateCategory);

router.get("/category/courses", optionalAuthMiddleware, careerJourneyController.getCategoryCourses);

router.get("/category", adminAuthMiddleware, careerJourneyController.getAllStandoutCategory);

router.get("/category/:id",adminAuthMiddleware,careerJourneyController.getOneStandoutCategory);

router.get("/category/third-category", userAuthMiddleware, careerJourneyController.thirdCategory);


/*    COURSE PACKAGE ROUTES    */
router.post("/package/",fileUpload("course_image").single("course_image"), adminAuthMiddleware, careerJourneyController.createStandoutPackage);

router.put("/package/",fileUpload("course_image").single("course_image"), adminAuthMiddleware, careerJourneyController.updateStandoutPackage);

router.get("/package", adminAuthMiddleware, careerJourneyController.getAllStandoutPackage);

router.get("/package/:id",adminAuthMiddleware,careerJourneyController.getOneStandoutPackage);

router.delete("/package", commonAuthMiddleware, careerJourneyController.deleteStandoutPackage);

/*    COURSES ROUTES    */
router.post(
  "/course/",
  fileUpload("course_image").single("course_image"),
  adminAuthMiddleware,
  careerJourneyController.createCourse
);

router.put("/course/",fileUpload("course_image").single("course_image"),adminAuthMiddleware,careerJourneyController.updateCourse);

router.get("/course/:id", adminAuthMiddleware, careerJourneyController.getOneCourse);

router.get("/course/", adminAuthMiddleware, careerJourneyController.getAllCourses);

router.delete("/course", commonAuthMiddleware, careerJourneyController.deleteStandoutCourse);

/*    LESSON ROUTES    */
router.post("/lesson/", fileUpload("lesson_content").fields([{ name: "image", maxCount: 1 }]),adminAuthMiddleware,careerJourneyController.createLesson);

router.put("/lesson/",fileUpload("lesson_content").fields([{ name: "image", maxCount: 1 }]),adminAuthMiddleware,careerJourneyController.updateLesson);

router.get("/lesson/:id", adminAuthMiddleware, careerJourneyController.getOneLesson);

router.get("/lesson/", adminAuthMiddleware, careerJourneyController.getAllLesson);

router.get("/lesson/all/:id", optionalAuthMiddleware, careerJourneyController.getAllLessons);

router.get("/lesson/change/id", careerJourneyController.lessonUpdateId);

router.post("/lesson/upload-lesson-content",adminAuthMiddleware, fileUpload("lesson_content").single("content"),careerJourneyController.uploadVideoToBunny)

/*    LESSON PROGRESS ROUTES     */
router.post("/lesson-progress/", userAuthMiddleware, careerJourneyController.createLessonProgress);

router.put("/lesson-progress/complete", userAuthMiddleware, careerJourneyController.completeLessonProgress);

module.exports = router;