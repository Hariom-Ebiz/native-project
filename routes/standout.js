const express = require("express");
const router = express.Router();

const standOutController = require("../controllers/standout");
const adminAuthMiddleware = require("../middleware/adminAuth");
const commonAuthMiddleware = require("../middleware/authMiddleware");
const optionalAuthMiddleware = require("../middleware/optionalAuth");
const userAuthMiddleware = require("../middleware/userAuth");
const fileUpload = require("../utils/fileUpload");
const {check} = require("express-validator")


router.get("/all-by-categories", commonAuthMiddleware, standOutController.getAllGroupByCategories);
router.get("/all-courses", adminAuthMiddleware, standOutController.getAllStandoutCourse);
router.get("/all-courses-front", commonAuthMiddleware, standOutController.getAllStandoutCourseFront);
// router.get("/course/:id", commonAuthMiddleware, standOutController.getOneCourse);

// router.put("/course",fileUpload("course_image").single("course_image"), commonAuthMiddleware, standOutController.updateStandoutCourse);
// router.post("/create",
//   fileUpload("course_image").single("course_image"),
//   [
//     check("title").isEmpty().withMessage("title should not be empty"),
//     check("description").isEmpty().withMessage("description should not be empty"),
//     check("category_id").isEmpty().withMessage("category_id should not be empty")
//   ],
//   adminAuthMiddleware, standOutController.addCourse);


  router.get("/all-lessons-by-course", adminAuthMiddleware, standOutController.getAllStandoutLessonsByCourses);
//   router.get("/all-lessons-by-categories", commonAuthMiddleware, standOutController.getAllLessonsGroupByCategory);
//   router.get("/lesson/:id", commonAuthMiddleware, standOutController.getOneLesson);
  router.delete("/lesson", adminAuthMiddleware, standOutController.deleteStandoutLesson);
//   router.put("/lesson",fileUpload("lesson_data").fields([{ name: 'lesson_image', maxCount: 1 }, { name: 'lesson_content', maxCount: 1 }]), commonAuthMiddleware, standOutController.updateStandoutLesson);
//   router.post("/lesson/add",
//     fileUpload("lesson_data").fields([{ name: 'lesson_image', maxCount: 1 }, { name: 'lesson_content', maxCount: 1 }]),
//     [
//       check("title").isEmpty().withMessage("title should not be empty"),
//       check("description").isEmpty().withMessage("description should not be empty"),
//     ],
//     adminAuthMiddleware, standOutController.addLesson);
  
// router.get("/lesson-full-details/:id", commonAuthMiddleware, standOutController.getLessonData)

// router.post("/standout-category", adminAuthMiddleware, standOutController.createStandoutCategory);
// router.put("/standout-category", adminAuthMiddleware, standOutController.updateStandoutCategory);

router.delete(
  "/category",
  adminAuthMiddleware,
  standOutController.deleteStandoutCategory
);


/*    CATEGORY ROUTES    */
router.post("/category/", adminAuthMiddleware, standOutController.createCategory);

router.put("/category/", adminAuthMiddleware, standOutController.updateCategory);

router.get("/category/courses/:packageId", optionalAuthMiddleware, standOutController.getCategoryCourses);

router.get("/category", adminAuthMiddleware, standOutController.getAllStandoutCategory);

router.get("/category/:id",adminAuthMiddleware,standOutController.getOneStandoutCategory);

router.get("/category/third-category", userAuthMiddleware, standOutController.thirdCategory);


/*    COURSE PACKAGE ROUTES    */
router.post("/package/",fileUpload("course_image").single("course_image"), adminAuthMiddleware, standOutController.createStandoutPackage);

router.put("/package/",fileUpload("course_image").single("course_image"), adminAuthMiddleware, standOutController.updateStandoutPackage);

router.get("/package", adminAuthMiddleware, standOutController.getAllStandoutPackage);

router.get("/package/:id",adminAuthMiddleware,standOutController.getOneStandoutPackage);

router.delete("/package", commonAuthMiddleware, standOutController.deleteStandoutPackage);

/*    COURSES ROUTES    */
router.post(
  "/course/",
  fileUpload("course_image").single("course_image"),
  adminAuthMiddleware,
  standOutController.createCourse
);

router.put("/course/",fileUpload("course_image").single("course_image"),adminAuthMiddleware,standOutController.updateCourse);

router.get("/course/:id", adminAuthMiddleware, standOutController.getOneCourse);

router.get("/course/", adminAuthMiddleware, standOutController.getAllCourses);

router.delete("/course", commonAuthMiddleware, standOutController.deleteStandoutCourse);

/*    LESSON ROUTES    */
router.post("/lesson/", fileUpload("lesson_content").fields([{ name: "image", maxCount: 1 }]),adminAuthMiddleware,standOutController.createLesson);

router.put("/lesson/",fileUpload("lesson_content").fields([{ name: "image", maxCount: 1 }]),adminAuthMiddleware,standOutController.updateLesson);

router.get("/lesson-admin/:id", commonAuthMiddleware, standOutController.getOneLessonForAdmin);
router.get("/lesson/:id", commonAuthMiddleware, standOutController.getOneLesson);

router.get("/lesson/", commonAuthMiddleware, standOutController.getAllLesson);

router.get("/lesson/all/:id", optionalAuthMiddleware, standOutController.getAllLessons);

router.get("/lesson/change/id", standOutController.lessonUpdateId);


router.post("/lesson/upload-lesson-content",adminAuthMiddleware, fileUpload("lesson_content").single("content"),standOutController.uploadVideoToBunny)

/*    LESSON PROGRESS ROUTES     */
router.post("/lesson-progress/", userAuthMiddleware, standOutController.createLessonProgress);

router.put("/lesson-progress/complete", userAuthMiddleware, standOutController.completeLessonProgress);

module.exports = router;