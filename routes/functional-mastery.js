const express = require("express");
const router = express.Router();

const functionalMasteryController = require("../controllers/functional-mastery");
const adminAuthMiddleware = require("../middleware/adminAuth");
const commonAuthMiddleware = require("../middleware/authMiddleware");
const optionalAuthMiddleware = require("../middleware/optionalAuth");
const userAuthMiddleware = require("../middleware/userAuth");
const fileUpload = require("../utils/fileUpload");
const {check} = require("express-validator")


router.get("/all-by-categories", commonAuthMiddleware, functionalMasteryController.getAllGroupByCategories);
router.get("/all-courses", adminAuthMiddleware, functionalMasteryController.getAllFunctionalMasteryCourse);
router.get("/all-courses-front", commonAuthMiddleware, functionalMasteryController.getAllFunctionalMasteryCourseFront);
// router.get("/course/:id", commonAuthMiddleware, functionalMasteryController.getOneCourse);

// router.put("/course",fileUpload("course_image").single("course_image"), commonAuthMiddleware, functionalMasteryController.updateFunctionalMasteryCourse);
// router.post("/create",
//   fileUpload("course_image").single("course_image"),
//   [
//     check("title").isEmpty().withMessage("title should not be empty"),
//     check("description").isEmpty().withMessage("description should not be empty"),
//     check("category_id").isEmpty().withMessage("category_id should not be empty")
//   ],
//   adminAuthMiddleware, functionalMasteryController.addCourse);


  router.get("/all-lessons-by-course", adminAuthMiddleware, functionalMasteryController.getAllFunctionalMasteryLessonsByCourses);
//   router.get("/all-lessons-by-categories", commonAuthMiddleware, functionalMasteryController.getAllLessonsGroupByCategory);
//   router.get("/lesson/:id", commonAuthMiddleware, functionalMasteryController.getOneLesson);
  router.delete("/lesson", adminAuthMiddleware, functionalMasteryController.deleteFunctionalMasteryLesson);
//   router.put("/lesson",fileUpload("lesson_data").fields([{ name: 'lesson_image', maxCount: 1 }, { name: 'lesson_content', maxCount: 1 }]), commonAuthMiddleware, functionalMasteryController.updateFunctionalMasteryLesson);
//   router.post("/lesson/add",
//     fileUpload("lesson_data").fields([{ name: 'lesson_image', maxCount: 1 }, { name: 'lesson_content', maxCount: 1 }]),
//     [
//       check("title").isEmpty().withMessage("title should not be empty"),
//       check("description").isEmpty().withMessage("description should not be empty"),
//     ],
//     adminAuthMiddleware, functionalMasteryController.addLesson);
  
// router.get("/lesson-full-details/:id", commonAuthMiddleware, functionalMasteryController.getLessonData)

// router.post("/functional-mastery-category", adminAuthMiddleware, functionalMasteryController.createFunctionalMasteryCategory);
// router.put("/functional-mastery-category", adminAuthMiddleware, functionalMasteryController.updateFunctionalMasteryCategory);

router.delete(
  "/category",
  adminAuthMiddleware,
  functionalMasteryController.deleteFunctionalMasteryCategory
);


/*    CATEGORY ROUTES    */
router.post("/category/", adminAuthMiddleware, functionalMasteryController.createCategory);

router.put("/category/", adminAuthMiddleware, functionalMasteryController.updateCategory);

router.get("/category/courses/:packageId", optionalAuthMiddleware, functionalMasteryController.getCategoryCourses);

router.get("/category", adminAuthMiddleware, functionalMasteryController.getAllFunctionalMasteryCategory);

router.get("/category/:id",adminAuthMiddleware,functionalMasteryController.getOneFunctionalMasteryCategory);

router.get("/category/third-category", userAuthMiddleware, functionalMasteryController.thirdCategory);


/*    COURSE PACKAGE ROUTES    */
router.post("/package/",fileUpload("course_image").single("course_image"), adminAuthMiddleware, functionalMasteryController.createFunctionalMasteryPackage);

router.put("/package/",fileUpload("course_image").single("course_image"), adminAuthMiddleware, functionalMasteryController.updateFunctionalMasteryPackage);

router.get("/package", commonAuthMiddleware, functionalMasteryController.getAllFunctionalMasteryPackage);

router.get("/package/:id",adminAuthMiddleware,functionalMasteryController.getOneFunctionalMasteryPackage);

router.delete("/package", commonAuthMiddleware, functionalMasteryController.deleteFunctionalMasteryPackage);

/*    COURSES ROUTES    */
router.post(
  "/course/",
  fileUpload("course_image").single("course_image"),
  adminAuthMiddleware,
  functionalMasteryController.createCourse
);

router.put("/course/",fileUpload("course_image").single("course_image"),adminAuthMiddleware,functionalMasteryController.updateCourse);

router.get("/course/:id", adminAuthMiddleware, functionalMasteryController.getOneCourse);

router.get("/course/", adminAuthMiddleware, functionalMasteryController.getAllCourses);

router.delete("/course", commonAuthMiddleware, functionalMasteryController.deleteFunctionalMasteryCourse);

/*    LESSON ROUTES    */
router.post("/lesson/", fileUpload("lesson_content").fields([{ name: "image", maxCount: 1 }]),adminAuthMiddleware,functionalMasteryController.createLesson);

router.put("/lesson/",fileUpload("lesson_content").fields([{ name: "image", maxCount: 1 }]),adminAuthMiddleware,functionalMasteryController.updateLesson);

router.get("/lesson-admin/:id", commonAuthMiddleware, functionalMasteryController.getOneLessonForAdmin);
router.get("/lesson/:id", commonAuthMiddleware, functionalMasteryController.getOneLesson);

router.get("/lesson/", commonAuthMiddleware, functionalMasteryController.getAllLesson);

router.get("/lesson/all/:id", optionalAuthMiddleware, functionalMasteryController.getAllLessons);

router.get("/lesson/change/id", functionalMasteryController.lessonUpdateId);


router.post("/lesson/upload-lesson-content",adminAuthMiddleware, fileUpload("lesson_content").single("content"),functionalMasteryController.uploadVideoToBunny)

/*    LESSON PROGRESS ROUTES     */
router.post("/lesson-progress/", userAuthMiddleware, functionalMasteryController.createLessonProgress);

router.put("/lesson-progress/complete", userAuthMiddleware, functionalMasteryController.completeLessonProgress);

module.exports = router;