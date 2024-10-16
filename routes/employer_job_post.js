const express = require("express");
const router = express.Router();

const jobPostController = require("../controllers/employer_job_post");
const AuthMiddleware = require("../middleware/authMiddleware");

router.post("/", AuthMiddleware, jobPostController.create);

router.get("/all", AuthMiddleware, jobPostController.getAll);

router.delete("/", AuthMiddleware, jobPostController.delete);

router.get("/get/job-seeker/jobs", AuthMiddleware, jobPostController.getJobSeekerJobList);

router.get("/get/applicants-list/", AuthMiddleware, jobPostController.getApplicantsList)

router.get("/edit/:id", AuthMiddleware, jobPostController.editOne);

router.get("/get/job-seeker/applied-jobs", AuthMiddleware, jobPostController.getJobSeekerAppliedJobs)

router.get("/my-jobs", AuthMiddleware, jobPostController.getMyJobs);

router.get("/salary-range-filter",AuthMiddleware,jobPostController.getSalaryRange)

router.put("/", AuthMiddleware, jobPostController.update);

router.put("/status", AuthMiddleware, jobPostController.updateStatus);

router.get("/:id", AuthMiddleware, jobPostController.getOne);

router.post("/reopen/job", AuthMiddleware, jobPostController.reOpenJob);



module.exports = router;
