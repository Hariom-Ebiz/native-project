require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const moment = require("moment");
require("./cronJob/index")
const adminRoutes = require("./routes/admin");
const adminRoutesRole = require("./routes/admin_role");
const cmsRoutes = require("./routes/cms");
const emailActionRoutes = require("./routes/emailAction");
const emailLogRoutes = require("./routes/emailLog");
const emailTemplateRoutes = require("./routes/emailTemplate");
const settingRoutes = require("./routes/setting");
const userRoutes = require("./routes/user");
const blockRoutes = require("./routes/block");
const blockLangRoutes = require("./routes/block_language");
const faqLangRoutes = require("./routes/faq_language");
const testimonialRoutes = require("./routes/testimonial");
const masterRoutes = require("./routes/master");
const newsletterRoutes = require("./routes/newsletterSubscriber");
const contactRoutes = require("./routes/contact");
const jobSeekerCvRoute = require("./routes/jobSeekerCv");
const miscellaneousRoutes = require("./routes/miscellaneous");
const courseRoutes = require("./routes/course");
const lessonRoutes = require("./routes/lesson");
const lessonProgressRoutes = require("./routes/lessonProgress");
const courseCategoryRoutes = require("./routes/courseCategory");
const coreValueTitleRoutes = require("./routes/coreValueTitle");
const coreValueRoutes = require("./routes/coreValue");
const assessmentResultRoutes = require("./routes/assessmentResult");
const careerInterestRoutes = require("./routes/careerInterest");
const careeerInterestCategoryRoutes = require("./routes/careerInterestCategory");
const motivatedSkillRoutes = require("./routes/motivatedSkill");
const personalityTypesRoutes = require("./routes/personalityTypes");
const personalitySummaryRoutes = require("./routes/personalitySummary");
const FaqCategory = require("./routes/faqCategory");
const FAQ = require("./routes/faq");
const CompanyProfile = require("./routes/companyprofile");
const employerTestimonialRoutes = require("./routes/testimonial_employer")
const tetsimonialLanguage = require("./routes/language_testimonial")
const EmployerJobPost = require("./routes/employer_job_post")
const InviteCandidate = require("./routes/job_invited_candidate")
const jobSeekerJobHunt = require("./routes/jobSeekerJobs")
const employerSaveApplicant = require("./routes/employerSaveApplicant")

const jobSeekerHiring = require("./routes/jobSeekerHiringNotes")
const notificationRoutes = require("./routes/notification")
const standoutCoursesRoutes = require("./routes/standout")
const careerJourneyRoutes = require("./routes/careerJourney")
const interviewSkillsRoutes = require("./routes/interviewskills")
const functionalMasteryRoutes = require("./routes/functional-mastery")
const dashboardRoutes = require("./routes/dashboard")
const aptitudeRoutes = require("./routes/aptitude")
const subscriptionRoutes = require("./routes/employerSubscription")
const CandidateSubscriptionRoutes = require("./routes/candidateSubscription")
const subscriberRoutes = require("./routes/employerSubscriber")
const candidateSubscriberRoutes = require("./routes/candidateSubscriber")

const PORT = process.env.PORT || 4042;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.ACCESS,
  })
);

app.use("/uploads/images", express.static(path.join("uploads", "images")));
app.use("/assets", express.static("assets"));

app.use("/admin", adminRoutes);
app.use("/admin-role", adminRoutesRole);
app.use("/cms", cmsRoutes);
app.use("/email-action", emailActionRoutes);
app.use("/email-log", emailLogRoutes);
app.use("/email-template", emailTemplateRoutes);
app.use("/setting", settingRoutes);
app.use("/user", userRoutes);
app.use("/block", blockRoutes);
app.use("/block/language", blockLangRoutes);
app.use("/testimonial", testimonialRoutes);
app.use("/master", masterRoutes);
app.use("/newsletter", newsletterRoutes);
app.use("/contact", contactRoutes);
app.use("/job-seeker-cv", jobSeekerCvRoute);
app.use("/miscellaneous", miscellaneousRoutes);
app.use("/course", courseRoutes);
app.use("/lesson", lessonRoutes);
app.use("/lesson-progress", lessonProgressRoutes);
app.use("/course-category", courseCategoryRoutes);
app.use("/core-value-title", coreValueTitleRoutes);
app.use("/core-value", coreValueRoutes);
app.use("/assessment-result", assessmentResultRoutes);
app.use("/career-interest", careerInterestRoutes);
app.use("/career-interest-category", careeerInterestCategoryRoutes);
app.use("/motivated-skill", motivatedSkillRoutes);
app.use("/personality-type", personalityTypesRoutes);
app.use("/personality-summary", personalitySummaryRoutes);

app.use("/faq/category", FaqCategory);
app.use("/faq", FAQ);
app.use("/faq/language", faqLangRoutes);

app.use("/company/profile", CompanyProfile)
app.use("/employer/testimonial", employerTestimonialRoutes);

app.use("/testimonial/language", tetsimonialLanguage)
app.use("/employer/job-post", EmployerJobPost)

app.use("/employer/invite/candidate", InviteCandidate)

app.use("/job-seeker/job", jobSeekerJobHunt)

app.use("/employer/applicant", employerSaveApplicant)

app.use("/employer/hiring/note", jobSeekerHiring)
app.use("/notification", notificationRoutes)
app.use("/standout", standoutCoursesRoutes)
app.use("/career-journey", careerJourneyRoutes)
app.use("/interview-skills", interviewSkillsRoutes)
app.use("/functional-mastery", functionalMasteryRoutes)
app.use("/dashboard", dashboardRoutes)
app.use("/aptitude", aptitudeRoutes)
app.use("/subscription", subscriptionRoutes)

app.use("/candidate-subscription", CandidateSubscriptionRoutes)

app.use("/subscribe", subscriberRoutes)
app.use("/subscribe/candidate", candidateSubscriberRoutes)

app.use((error, req, res, next) => {
  const status = error.code || error.status_code || 500;
  res.status(status);
  res.json({ message: error.message || "Something went wrong #MAIN" });
});

app.listen(PORT, () => {
  global.DB = require("./connection/db");
  console.log(`Server is running on : ${PORT}`);
});
