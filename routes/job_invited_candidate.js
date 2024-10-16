const express = require("express");
const router = express.Router();

const JobInviteCandiateController = require("../controllers/job_invited_candidate");
const userAuth = require("../middleware/authMiddleware");

router.post("/", userAuth, JobInviteCandiateController.create);
router.get("/job-types", userAuth, JobInviteCandiateController.getJobTypes);
router.get("/job-invites", userAuth, JobInviteCandiateController.getJobCategory);
router.get("/job-levels", userAuth, JobInviteCandiateController.getJobLevels);
router.get("/salary-range", userAuth, JobInviteCandiateController.getSalrayRange);
router.get("/invites", userAuth, JobInviteCandiateController.getJobSeekerInvitationsList);
router.get("/invite/get", userAuth, JobInviteCandiateController.getJob);
module.exports = router;