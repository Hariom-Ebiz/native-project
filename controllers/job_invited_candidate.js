const JobInvite = require("../models/job_invited_candidate");
const jobSeeker = require("../models/user")
const HttpError = require("../http-error");
const dateTimeFormat = require("../utils/dateTime.js");
const { emailSend } = require("../utils/helper");
const { getNotifSettings } = require("../models/notification");
const Notification = require("../utils/notification");

exports.create = async (req, res, next) => {
  let { job_seeker_id, email, job_id, body, subject, from, job_title, org_name} = req.body;  
  let employer_id = req.userId;

  try {
    const getUser = await getNotifSettings(job_seeker_id);
    console.log("getUser : ", getUser);
    
    if (getUser.status) {
      console.log("here : ")
      let createRes = await JobInvite.create({
          employer_id,
          job_seeker_id,
          job_id,
          created_at: dateTimeFormat(),
          updated_at: dateTimeFormat(),
      });
      
  
      if (createRes.status) {
        if(getUser.data.invitation_notif){
          const notification = new Notification("invite", "");
          await notification.formatTemplate({ ORG: org_name, JOB_TITLE: job_title})
          await notification.sendNotification([job_seeker_id], "/job-seeker/invitations");

          emailSend(null, next, email, subject, body, {}, from);
        }
      } else {
          const error = new HttpError(
              req,
              new Error().stack.split("at ")[1].trim(),
              "Could not invite the candidate",
              500
            );
            return next(error);
      }
    }
    // console.log(createRes);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not invite the candidate",
      500
    );
    return next(error);
  }

  return res.status(200).json({
    status: true,
    message: "Candidate invited successfully.",
  });
};


// Filter Controllers
exports.getJobTypes = async (req,res,next) => {
  let list;
  const currentUserId = req.userId;
  try {
    list = await JobInvite.getAllJobType(currentUserId);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Fetched Successfully",
    list,
  });
}

exports.getJobCategory = async (req,res,next) => {
  let list;
  const currentUserId = req.userId;
  try {
    list = await JobInvite.getAllJobCategories(currentUserId);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Fetched Successfully",
    list,
  });
}

exports.getJobLevels = async (req,res,next) => {
  let list;
  const currentUserId = req.userId;
  try {
    list = await JobInvite.getAllCareerLevels(currentUserId);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Something went wrong",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Data fetched successfully",
    list: list,
  });
}

exports.getSalrayRange = async (req, res,next) => {
  const {} = req.query;
  const curretnUserId = req.userId;
  let list = [];
  try {
    const result = await JobInvite.getSalaryRange(curretnUserId);

    if (result.status) {
      list = result.data;
    }
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Salary fetching failed.",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Data fetched.",
    list,
  });
}

exports.getJobSeekerInvitationsList = async (req,res,next) => {
  let { city, country, job_type, job_category,page,per_page,sortBy,order,salary_range_from, title, career_level } = req.query;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  sortBy = sortBy || "created_at";
  order = order || "desc";
  title = title ? title : "";

  let list = [];
  try {
    let paginaton = {page, per_page, sortBy, order};
    let cvFilter = {'is_posted': "1", 'is_active': "1", 'is_delete': "0", "is_hired": "0", "is_under_review": "0"};
    let jobFilter = {job_type: [], job_category: [], salary_range_from: [],career_level: []};
    if (city) cvFilter['employer_job_posts.city'] = city;
    if (country) cvFilter['employer_job_posts.country'] = country;
    if (job_type && job_type != undefined) jobFilter['job_type'] = (Array.isArray(job_type)) ? job_type : [job_type];
    if (title && title != undefined) jobFilter['title'] = title;
    if (job_category && job_category != undefined) jobFilter['job_category'] = (Array.isArray(job_category)) ? job_category : [job_category];
    if (salary_range_from && salary_range_from != undefined) jobFilter['salary_range_from'] = (Array.isArray(salary_range_from)) ? salary_range_from : [salary_range_from];

    if (career_level && career_level != undefined) jobFilter['career_level'] = (Array.isArray(career_level)) ? career_level : [career_level];
    const data = await JobInvite.getJobSeekerInvitationsList(cvFilter, jobFilter, req.userId,paginaton);
    if (data.status) {
      list = data
    }

  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Profile fetching failed.",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Data fetched.",
    list,
  });
}

exports.getJob = async (req, res,next) => {
  const {job_id, job_seeker_id} = req.query;
  const employer_id = req.userId;
  let list = [];
  try {
    const result = await JobInvite.getOneJob({job_id, employer_id, job_seeker_id});

    if (result.status) {
      list = result.data;
    }
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Salary fetching failed.",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Data fetched.",
    data: list,
  });
}