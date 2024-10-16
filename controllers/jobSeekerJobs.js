const JobPost = require("../models/employer_job_post");
const jobApplied = require("../models/jobSeekerJob");
const Common = require("../models/common");
const HttpError = require("../http-error");
const dateTimeFormat = require("../utils/dateTime.js");
const EmailTemplate = require("../models/emailTemplate");
const { emailSend } = require("../utils/helper.js")
const Notification = require("../utils/notification.js")

exports.getOne = async (req, res, next) => {
  const { id } = req.params;

  let job;
  try {
    job = await JobPost.jobSeekerJobDescription(id, req.userId);

    if (job.status == false) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Could not fetch job",
        400
      );
      return next(error);
    }

  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch job",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Job Description Fetched successfully.",
    data: job.data,
  });
};

exports.applyJob = async (req, res, next) => {
  const user = req.userId;
  console.log("user : ", user);
  
  let { id, salary_expectation, start_immediate,notice_period, team_manage_exp, eng_level, why_you, screening_answer, is_applied } = req.body;
  try {
    notice_period = notice_period ?? 0;
    let isUpdated = false;
    // check is job Application already Exists
    const alreadyExistJobApplication = await jobApplied.getOne({ job_id: id, job_seeker_id: user })
    let data;
    if (alreadyExistJobApplication) {
      isUpdated = true;
      // job application already exist
      data = await jobApplied.update({ id: alreadyExistJobApplication.id }, {
        job_id: id,
        job_seeker_id: user,
        salary_expectation,
        start_immediate,
        notice_period: start_immediate == 1 ? 0 : notice_period,
        team_manage_exp,
        eng_level,
        why_you,
        is_applied,
        applied_on: (is_applied == 1) ? dateTimeFormat() : null,
        updated_at: dateTimeFormat()
      })
  
      if (screening_answer) {
        
        await Common.delete("job_seeker_screening_answer", { job_id: id, applied_id: alreadyExistJobApplication.id })
        let tt = await Promise.all(screening_answer.map(d => {
          return {
            ...d,
            job_id: id,
            applied_id: alreadyExistJobApplication.id,
            created_at: dateTimeFormat(),
            updated_at: dateTimeFormat(),
          }
        }))
        
        await Common.create("job_seeker_screening_answer", tt)
      }
    }
    else{
      data = await jobApplied.create({
        job_id: id,
        job_seeker_id: user,
        salary_expectation,
        start_immediate,
        notice_period: start_immediate == 1 ? 0 : notice_period,
        team_manage_exp,
        eng_level,
        why_you,
        is_applied,
        applied_on: (is_applied == 1) ? dateTimeFormat() : null,
        created_at: dateTimeFormat(),
        updated_at: dateTimeFormat()
      })

      console.log("data",data);
      

      if(data.status){
        if (screening_answer) {
          let tt = await Promise.all(screening_answer.map(d => {
            return {
              ...d,
              job_id: id,
              applied_id: data.data[0],
              created_at: dateTimeFormat(),
              updated_at: dateTimeFormat(),
            }
          }))
  
          await Common.create("job_seeker_screening_answer", tt)
        }
      }
    }

    console.log("data : ", data);
    

    if(is_applied){
      const notification = new Notification("new applicant", user);
      await notification.formatTemplate({ JOB_TITLE: data.employerDetails.title, CANDIDATE_NAME: data.jobSeekerDetails.first_name + " " + data.jobSeekerDetails.last_name })
      await notification.sendNotification([data.employerDetails.id],`/employer/job-detail/application/${id}/${data.data[0]}?seekerId=${user}`);


      let emailTemplate;
      try {
        emailTemplate = await EmailTemplate.getOne({ name: "Job Apply Mail" });
      } catch (err) {
        const error = new HttpError(
          req,
          new Error().stack.split("at ")[1].trim(),
          "Something went wrong #b",
          500
        );
        return next(error);
      }
      let message = emailTemplate.body;
      message = message.replace(/\{JOB_TITLE\}/g, data.employerDetails.title);
      message = message.replace(/\{EMPLOYER_NAME\}/g, data.employerDetails.first_name);
      message = message.replace(/\{APPLICANT_NAME\}/g, data.jobSeekerDetails.first_name + " " + data.jobSeekerDetails.last_name[0]);
      message = message.replace(/\{PROFILE_LINK\}/g, process.env.FRONTEND_EMPLOYER_URL+`/employer/job-detail/application/${id}/${data.data[0]}?seekerId=${user}`);
      message = message.replace(/\{CONTACT_US_URL\}/g, process.env.FRONTEND_EMPLOYER_URL+"/employer/contact-us");
      
      let subject = emailTemplate.subject;

      subject = subject.replace(/\{JOB_TITLE\}/g, data.employerDetails.title);
      subject = subject.replace(/\{APPLICANT_NAME\}/g, data.jobSeekerDetails.first_name + " " + data.jobSeekerDetails.last_name[0]);


      emailSend(null, next, data.employerDetails.email, subject, message, {
        mailSend: 1,
      });
    }

    res.status(200).json({
      status: true,
      message: isUpdated ? "Application Updated!" : is_applied ? "Job Applied successfully." : "Job Saved successfully",
      jobId: id
    });

  } catch (error) {
    console.log("error : ", error);
    return res.status(200).json({
      message: "Something went wrong",
      status: false
    })
  }
}

exports.getApplicationFormQues = async (req, res, next) => {
  const { id } = req.query;
  let list = []
  try {
    const createData = await jobApplied.getApplicationQuestions(id)
    if (!createData.status) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Could not fetch question",
        400
      );
      return next(error);
    } else {
      list = { data: createData.data, companyDetails: createData.companyDetails }
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch question",
      500
    );
    return next(error);
  }
  res.status(200).json({
    status: true,
    message: "Fetched successfully.",
    list
  });
}

exports.getApplicationFormAns = async (req,res,next) => {
  const { id } = req.query;
  const userId = req.userId;

  const list = [];
  try {
    const defaultAns = await jobApplied.getDefaultAnswers(userId, id)

    const finalData = {};
    if(defaultAns.status){
      if(defaultAns.record.length > 0){
        finalData.defaultAns = defaultAns.record[0];
        const screenAnswers = await jobApplied.getScreeningAns(defaultAns.record[0].id, id)
        if(screenAnswers.status){
          finalData.screenAnswers = screenAnswers.record;
        }

        return res.status(200).json({
          message: "Answers Found Successfully",
          data: finalData,
          status: true
        })
      } else {
        return res.status(200).json({
          data: {},
          status: true
        })
      }
    }
    console.log("default Ans : ", defaultAns);
    return res.status(200).json({
      message: "done",
      status: true
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch question",
      500
    );
    return next(error);
  }
}