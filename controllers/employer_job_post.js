const JobPost = require("../models/employer_job_post");
const JobPostType = require("../models/employer_job_post_type");
const JobPostSkills = require("../models/employer_job_post_skills");
const JobPostScreening = require("../models/job_post_screening");
const HttpError = require("../http-error");
const dateTimeFormat = require("../utils/dateTime.js");
const Common = require("../models/common")
const createSlug = (value) => value.toLowerCase().split(" ").join("-")

exports.create = async (req, res, next) => {

    const {employer_id, title,  apply_before,  is_confidential,  send_candidate_notif,  post_type,  job_category,  country,  city,  area,  career_level, salary_type, salary_range_from,  salary_range_to,  hide_salary_range,  salary_details, salary_currency, vacancies,  year_of_experience,  job_description,  job_requirements,  
  skills_qualifications,  keywords,  questions,  is_question_required, is_posted, career_weight, interest_weight, skill_weight, personality_weight, aptitude_weight, career_values, interests_values, skills_values, personality_values, logical_number, numerical_number, situational_number, verbal_number, other_job_category, other_area} = req.body;

  let jobPost;
  if (!employer_id) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Employer not found.",
      400
    );
    return next(error);
  }

  try {
    jobPost = await JobPost.create({
      employer_id, title, apply_before, area, career_level, city, country, job_type: post_type, hide_salary_range: (hide_salary_range) ? 1 : 0, is_confidential: (is_confidential) ? 1 : 0, job_category, salary_details, salary_type, salary_currency, salary_range_from, salary_range_to, send_candidate_notif, vacancies, year_of_experience, job_description,  job_requirements,  logical_number: logical_number || 0, numerical_number: numerical_number || 0, situational_number: situational_number || 0, verbal_number: verbal_number || 0, skills_qualifications, is_posted,career_weight: career_weight || 0,interest_weight: interest_weight || 0,skill_weight: skill_weight || 0,personality_weight: personality_weight || 0,aptitude_weight: aptitude_weight || 0,
      posted_on: (is_posted) ? dateTimeFormat() : null,
      other_job_category: (job_category != "0") ? null : other_job_category,
      other_area: (area == "other") ? other_area : null,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
    if (jobPost.status) {
        
        if (keywords && keywords.length) {
            let skills = keywords.map((s) => {
              return {job_post_id: jobPost.data[0], skill: s.value, created_at: dateTimeFormat(),updated_at: dateTimeFormat()} 
            })
            await JobPostSkills.create(skills)
        }

        if (questions && questions.length) {
            let qArr = [];
            questions.map((q, i) => {
              qArr.push({
                job_post_id: jobPost.data[0],	
                question: (q.other) ? q.otherVal : q.question, 
                is_required: (q.isRequired) ? 1 : 0,
                created_at: dateTimeFormat(),updated_at: dateTimeFormat()
              })
              // return {job_post_id: jobPost.data[0],	question: q, is_required: (is_question_required[i]) ? 1 : 0,created_at: dateTimeFormat(),updated_at: dateTimeFormat()}
            })
            await JobPostScreening.create(qArr)
        }

        if (career_weight && career_weight != "0") {
            let ids = career_values.map((d) => {return {job_post_id: jobPost.data[0], career_id :d, created_at: dateTimeFormat(), updated_at: dateTimeFormat()}})
            await Common.create("job_post_career_values", ids)
        }

        if (interest_weight && interest_weight != "0") {
            let ids = interests_values.map((d) => {return {job_post_id: jobPost.data[0], interest_id:d, created_at: dateTimeFormat(), updated_at: dateTimeFormat()}})
            await Common.create("job_post_interest", ids)
        }

        if (skill_weight && skill_weight != "0") {
            let ids = skills_values.map((d) => {return {job_post_id: jobPost.data[0], skill_id:d, created_at: dateTimeFormat(), updated_at: dateTimeFormat()}})
            await Common.create("job_post_skill_values", ids)
        }

        if (personality_weight && personality_weight != "0") {
            let ids = personality_values.map((d) => {return {job_post_id: jobPost.data[0], personality_id:d, created_at: dateTimeFormat(), updated_at: dateTimeFormat()}})

            await Common.create("job_post_personality", ids)
        }
        
    } else {
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Job post create failed",
            400
          );
          return next(error);
    }

  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not create a job post",
      500
    );
    return next(error);
  }

  return res.status(200).json({
    status: true,
    message: "Job is created successfully.",
    data: jobPost,
  });
};

exports.update = async (req, res, next) => {
  const {id, employer_id, title,  apply_before,  is_confidential,  send_candidate_notif,  post_type,  job_category,  country,  city,  area,  career_level, salary_type, salary_range_from,  salary_range_to,  hide_salary_range,  salary_details, salary_currency, vacancies,  year_of_experience,  job_description,  job_requirements,  
    skills_qualifications,  keywords, questions,  is_question_required, is_posted, career_weight, interest_weight, skill_weight, personality_weight, aptitude_weight, career_values, interests_values, skills_values, personality_values, logical_number, numerical_number, situational_number, verbal_number, other_job_category, other_area } = req.body;

  if (!id) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Job id not found.",
      500
    );
    return next(error);
  }

  try {
    let updateRes = await JobPost.update(
      { id },
      {
      employer_id, title, apply_before, area, career_level, city, country, job_type: post_type, hide_salary_range: (hide_salary_range) ? 1 : 0, is_confidential: (is_confidential) ? 1 : 0, job_category, salary_details, salary_type, salary_range_from, salary_range_to, send_candidate_notif, vacancies, year_of_experience, job_description,  job_requirements, salary_currency,
      skills_qualifications, is_posted,logical_number: logical_number || 0, numerical_number: numerical_number || 0, situational_number: situational_number || 0, verbal_number: verbal_number || 0, skills_qualifications, career_weight: career_weight || 0,interest_weight: interest_weight || 0,skill_weight: skill_weight || 0,personality_weight: personality_weight || 0,aptitude_weight: aptitude_weight || 0,
      posted_on: (is_posted) ? dateTimeFormat() : null,
      other_job_category: (job_category != "0") ? null : other_job_category,
      other_area: (area == "other") ? other_area : null,
      updated_at: dateTimeFormat(),
      }
    );

    if (updateRes.status) {

      await JobPostSkills.delete({job_post_id: id});
      if (keywords && keywords.length) {
        let skills = keywords.map((s) => {
          return {job_post_id: id, skill: s.value,created_at: dateTimeFormat(),updated_at: dateTimeFormat()} 
        })
        await JobPostSkills.create(skills)
      }

      await JobPostScreening.delete({job_post_id: id});
      if (questions && questions.length) {
        let qArr = [];
        questions.map((q, i) => {
          qArr.push({
            job_post_id: id,	
            question: (q.other) ? q.otherVal : q.question, 
            is_required: (q.isRequired) ? 1 : 0,
            created_at: dateTimeFormat(),
            updated_at: dateTimeFormat()
          })
          // return {job_post_id: jobPost.data[0],	question: q, is_required: (is_question_required[i]) ? 1 : 0,created_at: dateTimeFormat(),updated_at: dateTimeFormat()}
        })
        await JobPostScreening.create(qArr)
      }

      await Common.delete("job_post_career_values",{job_post_id: id});
      if (career_weight && career_weight != "0") {
        let ids = career_values.map((d) => {return {job_post_id: id, career_id :d, created_at: dateTimeFormat(), updated_at: dateTimeFormat()}})
        await Common.create("job_post_career_values", ids)
      }

      await Common.delete("job_post_interest",{job_post_id: id});
      if (interest_weight && interest_weight != "0") {
        let ids = interests_values.map((d) => {return {job_post_id: id, interest_id:d, created_at: dateTimeFormat(), updated_at: dateTimeFormat()}})
        await Common.create("job_post_interest", ids)
      }

      await Common.delete("job_post_skill_values",{job_post_id: id});
      if (skill_weight && skill_weight != "0") {
        let ids = skills_values.map((d) => {return {job_post_id: id, skill_id:d, created_at: dateTimeFormat(), updated_at: dateTimeFormat()}})
        await Common.create("job_post_skill_values", ids)
      }

      await Common.delete("job_post_personality",{job_post_id: id});
      if (personality_weight && personality_weight != "0") {
        let ids = personality_values.map((d) => {return {job_post_id: id, personality_id:d, created_at: dateTimeFormat(), updated_at: dateTimeFormat()}})

        await Common.create("job_post_personality", ids)
      }
    } else {
      const error = new HttpError(
          req,
          new Error().stack.split("at ")[1].trim(),
          "Job post create failed",
          400
        );
        return next(error);
    }
    // console.log(updateRes);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Job could not be update",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Job Updated successfully.",
  });
};

exports.updateStatus = async (req, res, next) => {
  const { id } = req.query;

  if (!id) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Post id is required.",
      400
    );
    return next(error);
  }

  const {is_posted, is_active, is_delete, is_hired, apply_before} = req.body;

  let query = {};

  if (is_posted){ 
    query['is_posted'] = is_posted;
    query['is_under_review'] = "0";
    query['posted_on'] = dateTimeFormat();
  }
  if(apply_before) {
    query['apply_before'] = apply_before;
  }
  if (is_active || is_active == 0) query['is_active'] = is_active;
  if (is_delete) query['is_delete'] = is_delete;
  if (is_hired) query['is_hired'] = is_hired;
  
  console.log("query : ", query)

  try {
    let updateRes = await JobPost.update(
      { id },
      query
    );
    // console.log(updateRes);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not change status",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Job Post status Updated successfully.",
    data: id
  });
}

exports.getAll = async (req, res, next) => {
  let { page, name, per_page, sortBy, order, title, is_posted, from, to, requestFor } = req.query;
  
  const id = req.userId;

  if (!id) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Not authorized",
      401
    );
    return next(error);
  }

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  name = name ?? "";
  title = title ?? "";
  sortBy = sortBy ?? "posted_on";
  order = order ?? "desc";
  let match = {employer_id: id, "is_delete": 0}
  let queryMatch  = {"employer_job_posts.employer_id": id, "is_delete": 0}
  if (is_posted) {
    match.is_posted = is_posted;
    queryMatch["employer_job_posts.is_posted"] = is_posted;
  }


  let postedJobs;
  let savedJobs;
  try {
    postedJobs = await JobPost.getMany({
      match: {...match, is_posted: 1},
      queryMatch: {...queryMatch, is_posted: 1},
      page,
      per_page,
      sort_by: sortBy,
      order,
      page_name: name,
      title,
      from,
      to
    });
    

    savedJobs = await JobPost.getMany({
      match: {...match, is_posted: 0},
      queryMatch: {...queryMatch, is_posted: 0},
      page,
      per_page,
      sort_by: sortBy,
      order,
      page_name: name,
      title,
      from,
      to
    });
    // console.log(postedJobs);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch jobs",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Jobs Fetched successfully.",
    posts: postedJobs?.data,
    savedPosts: savedJobs?.data,
    totalDocuments: postedJobs?.totalDocuments,
    savedJobsTotalDocuments: savedJobs?.totalDocuments,
    requestFor
  });
};

exports.getOne = async (req, res, next) => {
  const { id } = req.params;

  let job;
  try {
    job = await JobPost.getOne(id);
    
    // console.log(cms);
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
    message: "Job details Fetched successfully.",
    job: job.data,
  });
};


exports.getJobSeekerAppliedJobs = async (req,res, next) => {
  let { page,per_page,sortBy,order, isApplied } = req.query;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  sortBy = sortBy || "created_at";
  order = order || "desc";
 
  let list = [];
  let totalDocuments = 0;
  try{
    let paginaton = {page, per_page, sortBy, order};
    const filter = {};
    const applyFilter = {};

    if(isApplied != null || isApplied != undefined){
      applyFilter['isApplied'] = isApplied;
    }
    
    const data = await JobPost.getJobSeekerAppliedJobs(filter, applyFilter, req.userId,paginaton);
    if (data.status) {
      list = data.data
      totalDocuments = data.totalDocuments
    }
  } catch(err){
    console.log("error : ", err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Profile fetching failed.",
      500
    );
    return next(error);
  }

  return res.status(200).json({
    status: true,
    message: "Data fetched.",
    list,
    totalDocuments
  });
}

exports.getApplicantsList = async (req,res,next) => {;
  let { id,page,per_page,sortBy,order } = req.query;
  const userId = req.userId;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  sortBy = sortBy || "created_at";
  order = order || "desc";

  let list;
  let totalDocuments = 0;

  try {
    let paginaton = {page, per_page, sortBy, order};
    const data = await JobPost.getApplicantsList(id,paginaton, userId);
    if(data.status){
      list = data.data
      totalDocuments = data.totalDocuments
    }

  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch applicants",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "applicants details Fetched successfully.",
    list,
    totalDocuments
  });
}

exports.editOne = async (req, res, next) => {
  const { id } = req.params;

  let post;
  try {
    post = await JobPost.editJob(id);
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
    message: "Job Fetched successfully.",
    post,
  });
}

exports.delete = async (req, res, next) => {
  const { id } = req.body;

  try {
    let delRes = await JobPost.delete({ id });
    // console.log(delRes);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not delete cms page",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Cms Page Deleted Successfully.",
    id,
  });
};

exports.getMyJobs = async (req, res, next) => {
  const id = req.userId;

  let list = [];

  try {
    list = await JobPost.getMyJobs({ employer_id: id, is_delete: 0, is_active: 1, is_hired: 0, is_posted: 1, is_under_review: 0 });
    // console.log(delRes);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch job list",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Jobs fetched successfully.",
    list: list.data,
  }); 
}

exports.getJobSeekerJobList = async (req, res, next) => {
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
    const data = await JobPost.jobSeekerJobList(cvFilter, jobFilter, req.userId,paginaton);
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

exports.getSalaryRange = async (req, res, next) => {
  const curretnUserId = req.userId;
  let list = [];
  try {
    const result = await JobPost.getSalaryRange(curretnUserId);

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

exports.getJobSeekerAppliedJobs = async (req,res, next) => {
  let { page,per_page,sortBy,order, isApplied } = req.query;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  sortBy = sortBy || "created_at";
  order = order || "desc";
 
  let list = [];
  let totalDocuments = 0;
  try{
    let paginaton = {page, per_page, sortBy, order};
    const filter = {};
    const applyFilter = {};

    if(isApplied != null || isApplied != undefined){
      applyFilter['isApplied'] = isApplied;
    }
    
    const data = await JobPost.getJobSeekerAppliedJobs(filter, applyFilter, req.userId,paginaton);
    if (data.status) {
      list = data.data
      totalDocuments = data.totalDocuments
    }
  } catch(err){
    console.log("error : ", err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Profile fetching failed.",
      500
    );
    return next(error);
  }

  return res.status(200).json({
    status: true,
    message: "Data fetched.",
    list,
    totalDocuments
  });
}

exports.reOpenJob = async (req, res, next) => {
  let { id, apply_before, vacancies, is_active } = req.body;

  try {
   const update = await JobPost.reopenJob({id}, {apply_before, vacancies, is_active, is_hired: 0, is_under_review: 0}) 

   if (!update.status) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Job Reopen failed",
        500
      );
      return next(error);
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
    message: "Job reopen successfully.",
    data: id,
  });
}