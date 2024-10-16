require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const moment = require("moment");

const adminRoutes = require("./routes/admin");
const adminRoutesRole = require("./routes/admin_role");
const cmsRoutes = require("./routes/cms");
const emailActionRoutes = require("./routes/emailAction");
const emailLogRoutes = require("./routes/emailLog");
const emailTemplateRoutes = require("./routes/emailTemplate");
const settingRoutes = require("./routes/setting");
const userRoutes = require("./routes/user");
const blockRoutes = require("./routes/block");
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

const PORT = process.env.PORT;

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

app.use((error, req, res, next) => {
  const status = error.code || error.status_code || 500;
  res.status(status);
  res.json({ message: error.message || "Something went wrong #MAIN" });
});

app.listen(PORT, () => {
  global.DB = require("./connection/db");
  console.log(`Server is running on : ${PORT}`);
});
