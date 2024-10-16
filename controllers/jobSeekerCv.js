const moment = require("moment");
const User = require("../models/user");
const HttpError = require("../http-error");

const JobSeekerDetail = require("../models/jobSeekerDetail");
const JobSeekerCv = require("../models/jobSeekerCv");

const JobSeekerEducation = require("../models/jobSeekerEducation");
const JobSeekerUniversity = require("../models/jobSeekerUniversity");
const JobSeekerPostGraduation = require("../models/jobSeekerPostGraduation");
const JobSeekerCertification = require("../models/jobSeekerCertification");
const JobSeekerExperience = require("../models/jobSeekerExperience");
const JobSeekerCareerPrefrence = require("../models/jobSeekerCareerPreference");
const JobSeekerSkill = require("../models/jobSeekerSkill");
const JobSeekerLanguage = require("../models/jobSeekerLanguage");

const Country = require("../models/country");
const City = require("../models/city");
const Area = require("../models/areas");
const JobType = require("../models/jobType");
const JobCategory = require("../models/jobCategory");
const Common = require("../models/common");

const dateTimeFormat = require("../utils/dateTime.js");

exports.createCvStep1 = async (req, res, next) => {
  const id = req.userId;

  let {
    first_name,
    last_name,
    middle_name,
    dob,
    nationality,
    martial_status,
    have_driving_licence,
    current_country,
    current_city,
    current_area,
    current_other_area,
    want_to_relocate,
    contact_mobile,
    contact_alt_mobile,
    contact_email,
    about,
  } = req.body;

  let dataToSave = {
    job_seeker_id: id,
    first_name,
    last_name,
    middle_name,
    dob,
    nationality,
    martial_status,
    have_driving_licence,
    current_country,
    current_city,
    current_area,
    current_other_area: (current_area == "other") ? current_other_area : null,
    want_to_relocate,
    contact_mobile,
    contact_alt_mobile,
    contact_email,
    about,
    step_1: 1,
    created_at: dateTimeFormat(),
    updated_at: dateTimeFormat(),
  };

  // let profile_pic = null;
  // let cover_pic = null;
  let profileImage = req?.files?.profile_pic;
  let coverImage = req?.files?.cover_pic;

  if (profileImage && profileImage.length > 0) {
    dataToSave.profile_pic = profileImage[0].path;
  }
  if (coverImage && coverImage.length > 0) {
    dataToSave.cover_pic = coverImage[0].path;
  }

  try {
    let createUser = await JobSeekerCv.create(dataToSave);
    console.log("createUser>>>>>", createUser);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Profile creation failed.",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Data saved in your cv.",
    data: dataToSave,
  });
};

exports.createCvStep2 = async (req, res, next) => {
  const id = req.userId;

  let { education, university, postGraduation, certification } = req.body;

  const errArray = [];

  // Saving education >>>>>>>>
  try {
    if (education) {
      // for (let i = 0; i < education.length; i++) {
      let elem = education;
      let pr = await JobSeekerEducation.create({
        job_seeker_id: id,
        high_school_name: elem.high_school_name,
        country: elem.country,
        graduation_certificate: elem.graduation_certificate,
        graduation_other_certificate: elem.graduation_other_certificate,
        graduation_year: elem.graduation_year,
        grade: elem.grade,
        graduation_other_grade: elem.graduation_other_grade,
        created_at: dateTimeFormat(),
        updated_at: dateTimeFormat(),
      });
      // }
    }
  } catch (err) {
    console.log(err);
    errArray.push("Error in saving education");
  }

  // Saving university >>>>>>>>
  try {
    if (university && university.length > 0) {
      for (let i = 0; i < university.length; i++) {
        let elem = university[i];
        let pr = await JobSeekerUniversity.create({
          job_seeker_id: id,
          university_name: elem.university_name,
          country: elem.country,
          grade: elem.grade,
          other_grade: elem.other_grade,
          degree_level: elem.degree_level,
          other_degree_level: elem.other_degree_level,
          field_of_study: elem.field_of_study,
          other_field_of_study: elem.other_field_of_study,
          start_year: elem.start_year,
          end_year: elem.end_year,
          created_at: dateTimeFormat(),
          updated_at: dateTimeFormat(),
        });
        console.log("university", pr);
      }
    }
  } catch (err) {
    console.log(err);
    errArray.push("Error in saving university");
  }

  // Saving postGraduation >>>>>>>>
  try {
    if (postGraduation && postGraduation.length > 0) {
      for (let i = 0; i < postGraduation.length; i++) {
        let elem = postGraduation[i];
        let pr = await JobSeekerPostGraduation.create({
          job_seeker_id: id,
          university_name: elem.university_name,
          country: elem.country,
          grade: elem.grade,
          other_grade: elem.other_grade,
          degree_level: elem.degree_level,
          other_degree_level: elem.other_degree_level,
          field_of_study: elem.field_of_study,
          other_field_of_study: elem.other_field_of_study,
          start_year: elem.start_year,
          end_year: elem.end_year,
          created_at: dateTimeFormat(),
          updated_at: dateTimeFormat(),
        });
        console.log("postGraduation", pr);
      }
    }
  } catch (err) {
    console.log(err);
    errArray.push("Error in saving postGraduation");
  }

  // Saving certification >>>>>>>>
  try {
    if (certification && certification.length > 0) {
      for (let i = 0; i < certification.length; i++) {
        let elem = certification[i];
        let pr = await JobSeekerCertification.create({
          job_seeker_id: id,
          organisation_name: elem.organisation_name,
          country: elem.country,
          field_of_study: elem.field_of_study,
          other_field_of_study: elem.other_field_of_study,
          topic: elem.topic,
          other_topic: elem.other_topic,
          graduation_year: elem.graduation_year,
          created_at: dateTimeFormat(),
          updated_at: dateTimeFormat(),
        });
        console.log("certification", pr);
      }
    }
  } catch (err) {
    console.log(err);
    errArray.push("Error in saving certification");
  }

  try {
    let saveRes = await JobSeekerCv.update(
      { job_seeker_id: id },
      { step_2: 1 }
    );
    console.log("step_2 mark", saveRes);
  } catch (err) {
    console.log(err);
  }

  res.status(200).json({
    status: true,
    message: "Your profile has been updated successfully.",
    errors: errArray,
  });
};

exports.createCvStep3 = async (req, res, next) => {
  const id = req.userId;

  let { workExperience, careerPrefrence } = req.body;

  console.log(
    "workExperience && careerPrefrence",
    workExperience,
    careerPrefrence
  );

  const errArray = [];

  // Saving workExperience >>>>>>>>
  try {
    if (workExperience && workExperience.length > 0) {
      for (let i = 0; i < workExperience.length; i++) {
        let elem = workExperience[i];
        let pr = await JobSeekerExperience.create({
          job_seeker_id: id,
          job_type: elem.job_type,
          other_job_type: elem.other_job_type,
          job_title: elem.job_title,
          job_category: elem.job_category,
          other_job_category: elem.other_job_category,
          industry: elem.industry,
          other_industry: elem.other_industry,
          company_name: elem.company_name,
          country: elem.country,
          city: elem.city,
          start_date: elem.start_date,
          end_date: elem?.end_date ? elem.end_date : null,
          is_currently_working: elem.is_currently_working,
          responsibilities: elem.responsibilities,
          achievements: elem.achievements,
          created_at: dateTimeFormat(),
          updated_at: dateTimeFormat(),
        });
        console.log("workExperience", pr);
      }
    }
  } catch (err) {
    console.log(err);
    errArray.push("Error in saving workExperience");
  }

  // Saving careerPrefrence >>>>>>>>
  try {
    // if (careerPrefrence && careerPrefrence.length > 0) {
    //   for (let i = 0; i < careerPrefrence.length; i++) {
    //     let elem = careerPrefrence[i];
    //     let pr = await JobSeekerExperience.create({
    //       job_seeker_id: id,
    //       career_level: elem.career_level,
    //       job_type: elem.job_type,
    //       job_category: elem.job_category,
    //       country: elem.country,
    //       city: elem.city,
    //       min_expected_salary: elem.min_expected_salary,
    //       make_profile_public: elem.make_profile_public,
    //       created_at: dateTimeFormat(),
    //       updated_at: dateTimeFormat(),
    //     });
    //     console.log("careerPrefrence", pr);
    //   }
    // }
    if (careerPrefrence) {
      let locations = careerPrefrence.locations || [];
      let job_category = careerPrefrence.job_category || [];
      let job_type = careerPrefrence.job_type || [];
      locations = locations.map((elem) => {
        return {
          country: elem.country,
          city: elem.city,
        };
      });

      locations = JSON.stringify(locations);
      job_category = JSON.stringify(job_category);
      job_type = JSON.stringify(job_type);

      let pr = await JobSeekerCareerPrefrence.create({
        job_seeker_id: id,
        career_level: careerPrefrence.career_level,
        other_career_level: careerPrefrence.other_career_level,
        job_type: job_type,
        job_category: job_category,
        locations: locations,
        // country: careerPrefrence.country,
        // city: careerPrefrence.city,
        min_expected_salary: careerPrefrence.min_expected_salary,
        make_profile_public: careerPrefrence.make_profile_public,
        created_at: dateTimeFormat(),
        updated_at: dateTimeFormat(),
      });
      console.log("careerPrefrence", pr);
    }
  } catch (err) {
    console.log(err);
    errArray.push("Error in saving careerPrefrence");
  }

  try {
    let saveRes = await JobSeekerCv.update(
      { job_seeker_id: id },
      { step_3: 1 }
    );
    console.log("step_3 mark", saveRes);
  } catch (err) {
    console.log(err);
  }

  res.status(200).json({
    status: true,
    message: "Your profile has been updated successfully.",
    errors: errArray,
  });
};

exports.createCvStep4 = async (req, res, next) => {
  const id = req.userId;

  let { skills, languages } = req.body;

  const errArray = [];

  // Saving skills >>>>>>>>
  try {
    if (skills && skills.length > 0) {
      for (let i = 0; i < skills.length; i++) {
        let elem = skills[i];
        let pr = await JobSeekerSkill.create({
          job_seeker_id: id,
          skill_name: elem.skill_name,
          level: elem.level,
          created_at: dateTimeFormat(),
          updated_at: dateTimeFormat(),
        });
        console.log("skills", pr);
      }
    }
  } catch (err) {
    console.log(err);
    errArray.push("Error in saving skills");
  }

  // Saving languages >>>>>>>>
  try {
    if (languages && languages.length > 0) {
      for (let i = 0; i < languages.length; i++) {
        let elem = languages[i];
        let pr = await JobSeekerLanguage.create({
          job_seeker_id: id,
          language_name: elem.language_name,
          level: elem.level,
          created_at: dateTimeFormat(),
          updated_at: dateTimeFormat(),
        });
        console.log("languges", pr);
      }
    }
  } catch (err) {
    console.log(err);
    errArray.push("Error in saving languges");
  }

  try {
    let saveRes = await JobSeekerCv.update(
      { job_seeker_id: id },
      { step_4: 1 }
    );
    console.log("step_4 mark", saveRes);
  } catch (err) {
    console.log(err);
  }

  res.status(200).json({
    status: true,
    message: "Your profile has been updated successfully.",
    errors: errArray,
  });
};

exports.getCvStep1 = async (req, res, next) => {
  const id = req.userId;

  let data, cities, areas;

  try {
    data = await JobSeekerCv.getOne({ job_seeker_id: id });
    if (data) {
      cities = await City.getAll({ country_id: data.current_country });
      data.cityList = cities;

      areas = await Area.getAll({ city_id: data.current_city });
      data.areaList = areas;
    }
  } catch (err) {
    console.log(err);
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
    data,
  });
};

exports.getCvStep2 = async (req, res, next) => {
  const id = req.userId;

  let education, university, postGraduation, certification;

  try {
    education = await JobSeekerEducation.getOne({ job_seeker_id: id });
    university = await JobSeekerUniversity.getAll({ job_seeker_id: id });
    postGraduation = await JobSeekerPostGraduation.getAll({
      job_seeker_id: id,
    });
    certification = await JobSeekerCertification.getAll({ job_seeker_id: id });
  } catch (err) {
    console.log(err);
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
    data: {
      education,
      university,
      postGraduation,
      certification,
    },
  });
};

exports.getCvStep3 = async (req, res, next) => {
  const id = req.userId;

  let workExperience, careerPrefrence;

  try {
    workExperience = await JobSeekerExperience.getAll({ job_seeker_id: id });
    careerPrefrence = await JobSeekerCareerPrefrence.getOne({
      job_seeker_id: id,
    });

    if (workExperience) {
      for (let i = 0; i < workExperience.length; i++) {
        let elem = workExperience[i];
        let cityList = await City.getAll({ country_id: elem.country });
        elem.cityList = cityList;
      }
    }

    if (careerPrefrence) {
      let locations = JSON.parse(careerPrefrence.locations);
      let job_type = JSON.parse(careerPrefrence.job_type);
      let job_category = JSON.parse(careerPrefrence.job_category);

      let locationArray = [];
      let jobTypeArray = [];
      let jobCategoryArray = [];

      for (let i = 0; locations.length > i; i++) {
        let elem = locations[i];
        let cityList = [];
        cityList = await City.getAll({ country_id: elem.country });
        locationArray.push({
          country: elem.country,
          city: elem.city,
          cityList,
        });
      }

      for (let i = 0; job_type.length > i; i++) {
        let elem = job_type[i];
        let jobTypeName = await JobType.getOne({ id: elem });
        jobTypeArray.push({
          value: elem,
          label: jobTypeName.name || "",
        });
      }

      for (let i = 0; job_category.length > i; i++) {
        let elem = job_category[i];
        let jobCategoryName = await JobCategory.getOne({ id: elem });
        jobCategoryArray.push({
          value: elem,
          label: jobCategoryName.name || "",
        });
      }

      careerPrefrence.locations = locationArray;
      careerPrefrence.job_type = jobTypeArray;
      careerPrefrence.job_category = jobCategoryArray;
    }
  } catch (err) {
    console.log(err);
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
    data: {
      workExperience,
      careerPrefrence,
    },
  });
};

exports.getCvStep4 = async (req, res, next) => {
  const id = req.userId;

  let skills, languages;

  try {
    skills = await JobSeekerSkill.getAll({ job_seeker_id: id });
    languages = await JobSeekerLanguage.getAll({
      job_seeker_id: id,
    });
  } catch (err) {
    console.log(err);
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
    data: {
      skills,
      languages,
    },
  });
};

exports.editCvStep1 = async (req, res, next) => {
  const id = req.userId;

  let {
    first_name,
    last_name,
    middle_name,
    dob,
    nationality,
    martial_status,
    have_driving_licence,
    current_country,
    current_city,
    current_area,
    current_other_area,
    want_to_relocate,
    contact_mobile,
    contact_alt_mobile,
    contact_email,
    is_profile,
    is_cover_profile,
    about,
    linked_in,
    to_remove_profile_pic,
    to_remove_cover_pic,
  } = req.body;

  let dataToUpdate = {
    first_name,
    last_name,
    middle_name,
    dob,
    nationality,
    martial_status,
    have_driving_licence,
    current_country,
    current_city,
    current_area,
    current_other_area: (current_area == "other") ? current_other_area : null,
    want_to_relocate,
    contact_mobile,
    contact_alt_mobile,
    contact_email,
    about,
    linked_in,
    is_profile,
    is_cover_profile,
    step_1: 1,
    updated_at: dateTimeFormat(),
  };

  let profileImage = req?.files?.profile_pic;
  let coverImage = req?.files?.cover_pic;

  if (profileImage && profileImage.length > 0) {
    dataToUpdate.profile_pic = profileImage[0].path;
  }
  if (coverImage && coverImage.length > 0) {
    dataToUpdate.cover_pic = coverImage[0].path;
  }

  if (to_remove_profile_pic) {
    dataToUpdate.profile_pic = null;
  }

  if (to_remove_cover_pic) {
    dataToUpdate.cover_pic = null;
  }

  // let extras = {};
  // let images = req.files;

  // if (images && images.length > 0) {
  //   extras.profile_pic = images[0].path;
  // }

  try {
    let updateRes = await JobSeekerCv.update(
      { job_seeker_id: id },
      dataToUpdate
    );
    // console.log("updateRes>>>>>", updateRes);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Profile creation failed.",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Data updated in your cv.",
    data: dataToUpdate,
  });
};

exports.editCvStep2 = async (req, res, next) => {
  const id = req.userId;

  let { education, university, postGraduation, certification } = req.body;

  const errArray = [];

  // Saving education >>>>>>>>
  try {
    if (education) {
      // deleting previous ----
      await JobSeekerEducation.delete({ job_seeker_id: id });
      // creating new ----
      // for (let i = 0; i < education.length; i++) {
      let elem = education;
      let pr = await JobSeekerEducation.create({
        job_seeker_id: id,
        high_school_name: elem.high_school_name,
        country: elem.country,
        graduation_certificate: elem.graduation_certificate,
        graduation_other_certificate: elem.graduation_other_certificate,
        graduation_year: elem.graduation_year,
        grade: elem.grade,
        graduation_other_grade: elem.graduation_other_grade,
        created_at: dateTimeFormat(),
        updated_at: dateTimeFormat(),
      });
      console.log("education", pr);
      // }
    }
  } catch (err) {
    console.log(err);
    errArray.push("Error in saving education");
  }

  // Saving university >>>>>>>>
  try {
    if (university && university.length > 0) {
      // deleting previous ----
      await JobSeekerUniversity.delete({ job_seeker_id: id });
      // creating new ----
      for (let i = 0; i < university.length; i++) {
        let elem = university[i];
        let pr = await JobSeekerUniversity.create({
          job_seeker_id: id,
          university_name: elem.university_name,
          country: elem.country,
          grade: elem.grade,
          other_grade: elem.other_grade,
          degree_level: elem.degree_level,
          other_degree_level: elem.other_degree_level,
          field_of_study: elem.field_of_study,
          other_field_of_study: elem.other_field_of_study,
          start_year: elem.start_year,
          end_year: elem.end_year,
          created_at: dateTimeFormat(),
          updated_at: dateTimeFormat(),
        });
        console.log("university", pr);
      }
    }
  } catch (err) {
    console.log(err);
    errArray.push("Error in saving university");
  }

  // Saving postGraduation >>>>>>>>
  try {
    if (postGraduation && postGraduation.length > 0) {
      // deleting previous ----
      await JobSeekerPostGraduation.delete({ job_seeker_id: id });
      // creating new ----
      for (let i = 0; i < postGraduation.length; i++) {
        let elem = postGraduation[i];
        let pr = await JobSeekerPostGraduation.create({
          job_seeker_id: id,
          university_name: elem.university_name,
          country: elem.country,
          grade: elem.grade,
          other_grade: elem.other_grade,
          degree_level: elem.degree_level,
          other_degree_level: elem.other_degree_level,
          field_of_study: elem.field_of_study,
          other_field_of_study: elem.other_field_of_study,
          start_year: elem.start_year,
          end_year: elem.end_year,
          created_at: dateTimeFormat(),
          updated_at: dateTimeFormat(),
        });
        console.log("postGraduation", pr);
      }
    }
  } catch (err) {
    console.log(err);
    errArray.push("Error in saving postGraduation");
  }

  // Saving certification >>>>>>>>
  try {
    if (certification && certification.length > 0) {
      // deleting previous ----
      await JobSeekerCertification.delete({ job_seeker_id: id });
      // creating new ----
      for (let i = 0; i < certification.length; i++) {
        let elem = certification[i];
        let pr = await JobSeekerCertification.create({
          job_seeker_id: id,
          organisation_name: elem.organisation_name,
          country: elem.country,
          field_of_study: elem.field_of_study,
          other_field_of_study: elem.other_field_of_study,
          topic: elem.topic,
          other_topic: elem.other_topic,
          graduation_year: elem.graduation_year,
          created_at: dateTimeFormat(),
          updated_at: dateTimeFormat(),
        });
        console.log("certification", pr);
      }
    }
  } catch (err) {
    console.log(err);
    errArray.push("Error in saving certification");
  }

  try {
    let saveRes = await JobSeekerCv.update(
      { job_seeker_id: id },
      { step_2: 1 }
    );
    console.log("step_2 mark", saveRes);
  } catch (err) {
    console.log(err);
  }

  res.status(200).json({
    status: true,
    message: "Your profile has been updated successfully.",
    errors: errArray,
  });
};

exports.editCvStep3 = async (req, res, next) => {
  const id = req.userId;

  let { workExperience, careerPrefrence } = req.body;

  const errArray = [];

  // Saving workExperience >>>>>>>>
  try {
    if (workExperience && workExperience.length > 0) {
      // deleting previous ----
      await JobSeekerExperience.delete({ job_seeker_id: id });
      // creating new ----
      for (let i = 0; i < workExperience.length; i++) {
        let elem = workExperience[i];
        let pr = await JobSeekerExperience.create({
          job_seeker_id: id,
          job_type: elem.job_type,
          other_job_type: elem.other_job_type,
          job_title: elem.job_title,
          job_category: elem.job_category,
          other_job_category: elem.other_job_category,
          industry: elem.industry,
          other_industry: elem.other_industry,
          company_name: elem.company_name,
          country: elem.country,
          city: elem.city,
          start_date: elem.start_date,
          end_date: elem?.end_date ? elem.end_date : null,
          is_currently_working: elem.is_currently_working,
          responsibilities: elem.responsibilities,
          achievements: elem.achievements,
          created_at: dateTimeFormat(),
          updated_at: dateTimeFormat(),
        });
        console.log("workExperience", elem.start_date);
      }
    }
  } catch (err) {
    console.log(err);
    errArray.push("Error in saving workExperience");
  }

  // Saving careerPrefrence >>>>>>>>
  try {
    if (careerPrefrence) {
      // deleting previous ----
      await JobSeekerCareerPrefrence.delete({ job_seeker_id: id });
      // creating new ----
      // for (let i = 0; i < careerPrefrence.length; i++) {
      let elem = careerPrefrence;

      let locations = elem.locations || [];
      let job_category = elem.job_category || [];
      let job_type = elem.job_type || [];
      locations = locations.map((val) => {
        return {
          country: val.country,
          city: val.city,
        };
      });

      locations = JSON.stringify(locations);
      job_category = JSON.stringify(job_category);
      job_type = JSON.stringify(job_type);

      let pr = await JobSeekerCareerPrefrence.create({
        job_seeker_id: id,
        career_level: elem.career_level,
        other_career_level: elem.other_career_level,
        job_type: job_type,
        job_category: job_category,
        // country: elem.country,
        // city: elem.city,
        locations: locations,
        min_expected_salary: elem.min_expected_salary,
        make_profile_public: elem.make_profile_public,
        created_at: dateTimeFormat(),
        updated_at: dateTimeFormat(),
      });
      console.log("careerPrefrence", pr);
      // }
    }
  } catch (err) {
    console.log(err);
    errArray.push("Error in saving careerPrefrence");
  }

  try {
    let saveRes = await JobSeekerCv.update(
      { job_seeker_id: id },
      { step_3: 1 }
    );
    console.log("step_3 mark", saveRes);
  } catch (err) {
    console.log(err);
  }

  res.status(200).json({
    status: true,
    message: "Your profile has been updated successfully.",
    errors: errArray,
  });
};

exports.editCvStep4 = async (req, res, next) => {
  const id = req.userId;

  let { skills, languages } = req.body;

  const errArray = [];

  // Saving skills >>>>>>>>
  try {
    if (skills && skills.length > 0) {
      // deleting previous ----
      await JobSeekerSkill.delete({ job_seeker_id: id });
      // creating new ----
      for (let i = 0; i < skills.length; i++) {
        let elem = skills[i];
        let pr = await JobSeekerSkill.create({
          job_seeker_id: id,
          skill_name: elem.skill_name,
          level: elem.level,
          created_at: dateTimeFormat(),
          updated_at: dateTimeFormat(),
        });
        console.log("skills", pr);
      }
    }
  } catch (err) {
    console.log(err);
    errArray.push("Error in saving skills");
  }

  // Saving languages >>>>>>>>
  try {
    if (languages && languages.length > 0) {
      // deleting previous ----
      await JobSeekerLanguage.delete({ job_seeker_id: id });
      // creating new ----
      for (let i = 0; i < languages.length; i++) {
        let elem = languages[i];
        let pr = await JobSeekerLanguage.create({
          job_seeker_id: id,
          language_name: elem.language_name,
          level: elem.level,
          created_at: dateTimeFormat(),
          updated_at: dateTimeFormat(),
        });
        console.log("languages", pr);
      }
    }
  } catch (err) {
    console.log(err);
    errArray.push("Error in saving languages");
  }

  try {
    let saveRes = await JobSeekerCv.update(
      { job_seeker_id: id },
      { step_4: 1 }
    );
    console.log("step_4 mark", saveRes);
  } catch (err) {
    console.log(err);
  }

  res.status(200).json({
    status: true,
    message: "Your profile has been updated successfully.",
    errors: errArray,
  });
};

exports.getComplete = async (req, res, next) => {
  
  const id = req.userId;

  let general;
  let education, university, postGraduation, certification;
  let workExperience, careerPrefrence;
  let skills, languages;

  try {
    general = await JobSeekerCv.getOneDetailed({ job_seeker_id: id });
    education = await JobSeekerEducation.getOneDetailed({ job_seeker_id: id });
    university = await JobSeekerUniversity.getAllDetailed({
      job_seeker_id: id,
    });
    postGraduation = await JobSeekerPostGraduation.getAllDetailed({
      job_seeker_id: id,
    });
    certification = await JobSeekerCertification.getAllDetailed({
      job_seeker_id: id,
    });
    workExperience = await JobSeekerExperience.getAllDetailed({
      job_seeker_id: id,
    });
    careerPrefrence = await JobSeekerCareerPrefrence.getOneDetailed({
      job_seeker_id: id,
    });
    if (careerPrefrence) {
      let locations = JSON.parse(careerPrefrence.locations);
      let job_type = JSON.parse(careerPrefrence.job_type);
      let job_category = JSON.parse(careerPrefrence.job_category);

      let locationArray = [];
      let jobTypeArray = [];
      let jobCategoryArray = [];

      for (let i = 0; locations.length > i; i++) {
        let elem = locations[i];
        let countryName = await Country.getOne({ id: elem.country });
        let cityName = await City.getOne({ id: elem.city });
        locationArray.push({
          country: elem.country,
          city: elem.city,
          country_name: countryName.name || "",
          city_name: cityName.name || "",
        });
      }

      for (let i = 0; job_type.length > i; i++) {
        let elem = job_type[i];
        let jobTypeName = await JobType.getOne({ id: elem });
        jobTypeArray.push({
          job_type: elem,
          job_type_name: jobTypeName.name || "",
        });
      }

      for (let i = 0; job_category.length > i; i++) {
        let elem = job_category[i];
        let jobCategoryName = await JobCategory.getOne({ id: elem });
        jobCategoryArray.push({
          job_category: elem,
          job_category_name: jobCategoryName.name || "",
        });
      }

      careerPrefrence.locations = locationArray;
      careerPrefrence.job_type = jobTypeArray;
      careerPrefrence.job_category = jobCategoryArray;
    }
    skills = await JobSeekerSkill.getAllDetailed({ job_seeker_id: id });
    languages = await JobSeekerLanguage.getAllDetailed({
      job_seeker_id: id,
    });
  } catch (err) {
    console.log(err);
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
    data: {
      general,
      education,
      university,
      postGraduation,
      certification,
      workExperience,
      careerPrefrence,
      skills,
      languages,
    },
  });
};

exports.getCVsListForEmployer = async (req, res, next) => {
  let { city, 
    country, 
    job_type, 
    job_category, 
    min_expected_salary, 
    job_title,
    page,
    per_page,
    sortBy,
    order
  } = req.query;
  const id = req.userId;
  
  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  sortBy = sortBy || "created_at";
  order = order || "desc";

  let list = [];
  try {
    let paginaton = {page, per_page, sortBy, order};
    let cvFilter = {step_1: 1, step_2: 1, step_3: 1, step_4: 1};
    let jobFilter = {job_type: [], job_category: [], min_expected_salary: [], job_title};
    if (city) cvFilter['current_city'] = city;
    if (country) cvFilter['current_country'] = country;
    if (job_type && job_type != undefined) jobFilter['job_type'] = (Array.isArray(job_type)) ? job_type : [job_type];
    if (job_category && job_category != undefined) jobFilter['job_category'] = (Array.isArray(job_category)) ? job_category : [job_category];
    if (min_expected_salary && min_expected_salary != undefined) jobFilter['min_expected_salary'] = (Array.isArray(min_expected_salary)) ? min_expected_salary : [min_expected_salary];

    list = await JobSeekerCv.getSerachCvJobSeeker(cvFilter, jobFilter, paginaton, id);

  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Search CV fetching failed.",
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

exports.getCompleteForAdmin = async (req, res, next) => {
  const { id } = req.params;
  // const id = req.params.id

  let general;
  let education, university, postGraduation, certification;
  let workExperience, careerPrefrence;
  let skills, languages;

  try {
    general = await JobSeekerCv.getOneDetailed({ job_seeker_id: id });
    education = await JobSeekerEducation.getOneDetailed({ job_seeker_id: id });
    university = await JobSeekerUniversity.getAllDetailed({
      job_seeker_id: id,
    });
    postGraduation = await JobSeekerPostGraduation.getAllDetailed({
      job_seeker_id: id,
    });
    certification = await JobSeekerCertification.getAllDetailed({
      job_seeker_id: id,
    });
    workExperience = await JobSeekerExperience.getAllDetailed({
      job_seeker_id: id,
    });
    careerPrefrence = await JobSeekerCareerPrefrence.getOneDetailed({
      job_seeker_id: id,
    });
    if (careerPrefrence) {
      let locations = JSON.parse(careerPrefrence.locations);
      let job_type = JSON.parse(careerPrefrence.job_type);
      let job_category = JSON.parse(careerPrefrence.job_category);

      console.log("dddddddddddddddddddddd", locations, job_type, job_category);

      let locationArray = [];
      let jobTypeArray = [];
      let jobCategoryArray = [];

      for (let i = 0; locations.length > i; i++) {
        let elem = locations[i];
        let countryName = await Country.getOne({ id: elem.country });
        let cityName = await City.getOne({ id: elem.city });
        locationArray.push({
          country: elem.country,
          city: elem.city,
          country_name: countryName.name || "",
          city_name: cityName.name || "",
        });
      }

      for (let i = 0; job_type.length > i; i++) {
        let elem = job_type[i];
        let jobTypeName = await JobType.getOne({ id: elem });
        jobTypeArray.push({
          job_type: elem,
          job_type_name: jobTypeName.name || "",
        });
      }

      for (let i = 0; job_category.length > i; i++) {
        let elem = job_category[i];
        let jobCategoryName = await JobCategory.getOne({ id: elem });
        jobCategoryArray.push({
          job_category: elem,
          job_category_name: jobCategoryName.name || "",
        });
      }

      careerPrefrence.locations = locationArray;
      careerPrefrence.job_type = jobTypeArray;
      careerPrefrence.job_category = jobCategoryArray;
    }
    skills = await JobSeekerSkill.getAllDetailed({ job_seeker_id: id });
    languages = await JobSeekerLanguage.getAllDetailed({
      job_seeker_id: id,
    });
  } catch (err) {
    console.log(err);
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
    data: {
      general,
      education,
      university,
      postGraduation,
      certification,
      workExperience,
      careerPrefrence,
      skills,
      languages,
    },
  });
};

exports.getCompleteForEmployer = async (req, res, next) => {
  const { id } = req.params;
  const {job_id} = req.query;
  const employerId = req.userId;
  let general;
  let education, university, postGraduation, certification;
  let workExperience, careerPrefrence;
  let skills, languages;
  let invites;
  let otherAppliedJob;

  try {
    general = await JobSeekerCv.getOneDetailed({ job_seeker_id: id });
    education = await JobSeekerEducation.getOneDetailed({ job_seeker_id: id });
    university = await JobSeekerUniversity.getAllDetailed({
      job_seeker_id: id,
    });
    postGraduation = await JobSeekerPostGraduation.getAllDetailed({
      job_seeker_id: id,
    });
    certification = await JobSeekerCertification.getAllDetailed({
      job_seeker_id: id,
    });
    workExperience = await JobSeekerExperience.getAllDetailed({
      job_seeker_id: id,
    });
    careerPrefrence = await JobSeekerCareerPrefrence.getOneDetailed({
      job_seeker_id: id,
    });
    invites = await Common.raw(`SELECT jic.created_at, employer_job_posts.title FROM job_invited_candidate as jic
    LEFT JOIN employer_job_posts ON employer_job_posts.id = jic.job_id
    WHERE jic.employer_id = '${employerId}' AND jic.job_seeker_id = '${id}' ORDER BY jic.created_at DESC LIMIT 1`);
    if (invites.status) {
      invites = (invites.data.length) ? invites.data[0] : {};
    }

    otherAppliedJob = await Common.raw(`SELECT jsap.created_at, employer_job_posts.title, job_types.name as job_type_name, job_categories.name as job_category_name, employer_job_posts.other_job_category FROM job_seeker_applied_jobs as jsap
      LEFT JOIN employer_job_posts ON employer_job_posts.id = jsap.job_id
      LEFT JOIN job_types ON employer_job_posts.job_type = job_types.id
      LEFT JOIN job_categories ON employer_job_posts.job_category = job_categories.id
      WHERE employer_job_posts.employer_id = ${employerId} AND jsap.job_seeker_id = ${id} AND jsap.job_id != ${job_id} ORDER BY jsap.id DESC LIMIT 1`);

    if(otherAppliedJob.status){
      otherAppliedJob = (otherAppliedJob.data.length) ? otherAppliedJob.data[0] : {}
    }
//
    if (careerPrefrence) {
      let locations = JSON.parse(careerPrefrence.locations);
      let job_type = JSON.parse(careerPrefrence.job_type);
      let job_category = JSON.parse(careerPrefrence.job_category);

      let locationArray = [];
      let jobTypeArray = [];
      let jobCategoryArray = [];

      for (let i = 0; locations.length > i; i++) {
        let elem = locations[i];
        let countryName = await Country.getOne({ id: elem.country });
        let cityName = await City.getOne({ id: elem.city });
        locationArray.push({
          country: elem.country,
          city: elem.city,
          country_name: countryName.name || "",
          city_name: cityName.name || "",
        });
      }

      for (let i = 0; job_type.length > i; i++) {
        let elem = job_type[i];
        let jobTypeName = await JobType.getOne({ id: elem });
        jobTypeArray.push({
          job_type: elem,
          job_type_name: jobTypeName.name || "",
        });
      }

      for (let i = 0; job_category.length > i; i++) {
        let elem = job_category[i];
        let jobCategoryName = await JobCategory.getOne({ id: elem });
        jobCategoryArray.push({
          job_category: elem,
          job_category_name: jobCategoryName.name || "",
        });
      }

      careerPrefrence.locations = locationArray;
      careerPrefrence.job_type = jobTypeArray;
      careerPrefrence.job_category = jobCategoryArray;
    }
    skills = await JobSeekerSkill.getAllDetailed({ job_seeker_id: id });
    languages = await JobSeekerLanguage.getAllDetailed({
      job_seeker_id: id,
    });
  } catch (err) {
    console.log(err);
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
    message: "Candidate profile fetched.",
    data: {
      general,
      education,
      university,
      postGraduation,
      certification,
      workExperience,
      careerPrefrence,
      skills,
      languages,
      invites,
      otherAppliedJob
    },
  });
};

exports.getJobTypesForFilter = async (req, res, next) => {
  const {} = req.query;

  let list = [];
  try {
    const result = await JobSeekerCv.getJobTypeWithNumber();

    if (result.status) {
      list = result.data;
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

exports.getJobCategoryForFilter = async (req, res, next) => {
  const {} = req.query;

  let list = [];
  try {
    const result = await JobSeekerCv.getJobCategoryWithNumber();

    if (result.status) {
      list = result.data;
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

exports.getSalaryRangeForFiler = async (req, res, next) => {
  const {} = req.query;
  const currentUserId = req.userId;
  let list = [];
  try {
    const result = await JobSeekerCv.getSalaryRangeForFiler(currentUserId);

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

exports.getJobSeekerQuestionsAnswers = async (req,res,next) => {
  const {id,user_id} = req.query;
  let list = [];
  try{
    const data = await JobSeekerDetail.getJobSeekerAnswers(id, user_id);
    if(data.status){
      list = data.data;
    }
  } catch(err){
    list = [];
  }

  res.status(200).json({
    status: true,
    message: "Data fetched.",
    list,
  });
}

exports.getJobSeekerDetails = async (req,res,next) => {
  const {job_id,user_id} = req.query;
  let list = [];
  try{
    const data = await JobSeekerDetail.getJobSeekerDetails(job_id, user_id);
    if(data.status){
      list = data.data;
    }
  } catch(err){
    list = [];
  }

  res.status(200).json({
    status: true,
    message: "Data fetched.",
    list,
  });
}

exports.getJobSeekerAssesment = async (req, res, next) => {
  const user_id = req.params.userId;

  if(!user_id) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Bad Request",
      400
    );
    return next(error);
  }
  let results;

  try {
    results = await Common.getAll("assessment_result", { user_id });
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Something went wrong",
      500
    );
    return next(error);
  }

  results = results.record ?? [];

  let carrerValues = results.filter((r) => r.career_value_type == "always_valued");

  let careerInterests = results.filter((r) => r.type == "career_interests");

  let motivatedSkills = results.filter((r) => r.type == "motivated_skills");

  let personalityType = results.find((r) => r.type == "personality_type");

  let lifePurpose = results.find((r) => r.type == "life_purpose");

  if (carrerValues) {
    carrerValues = carrerValues.map(m => m.result);
    carrerValues = Common.getAll(
      "core_values",
      {},
      {
        key: "id",
        value: carrerValues,
      }
    );
  }

  if (careerInterests) {
    careerInterests = careerInterests.map(m => m.result);

    careerInterests = Common.getAll(
      "career_interest_categories",
      {},
      {
        key: "id",
        value: careerInterests,
      }
    );
  }

  if (personalityType) {
    personalityType = JSON.parse(personalityType.result);

    personalityType = Common.getAll("personality_summaries", {
      id: personalityType,
    });
  }

  if (motivatedSkills) {

    motivatedSkills = motivatedSkills.map(m => m.result);

    motivatedSkills = Common.getAll(
      "motivated_skills",
      {},
      {
        key: "id",
        value: motivatedSkills,
      }
    );
  }

  if (lifePurpose) {
    lifePurpose = JSON.parse(lifePurpose.result);
  }

  [
    carrerValues,
    careerInterests,
    personalityType,
    motivatedSkills,
    lifePurpose,
  ] = await Promise.all([
    carrerValues,
    careerInterests,
    personalityType,
    motivatedSkills,
    lifePurpose,
  ]);

  if (carrerValues && carrerValues.record?.length > 0) {
    let ids = results.filter((r) => r.career_value_type == "always_valued");
    let newIds = ids.map(m => m.result);
    let sameArray = [];
    newIds.forEach((item) => {
      let findData = carrerValues.record.find((newItem) => newItem.id == item);
      sameArray.push(findData);
    });
    carrerValues = sameArray;
  } else {
    carrerValues = new Array(5)
      .fill(null)
      .map((_, idx) => ({ id: idx, value: "" }));
  }

  if (motivatedSkills && motivatedSkills.record?.length > 0) {
    let idsMoti = results.filter((r) => r.type == "motivated_skills");
    let newIdsMoti = idsMoti.map(m => m.result);
    let sameArrayMoti = [];
    newIdsMoti.forEach((item) => {
      let findDataMoti = motivatedSkills.record.find(
        (newItem) => newItem.id == item
      );
      sameArrayMoti.push(findDataMoti);
    });
    motivatedSkills = sameArrayMoti;
  } else {
    motivatedSkills = new Array(5)
      .fill(null)
      .map((_, idx) => ({ id: idx, skill: "" }));
  }

  res.status(200).json({
    status: true,
    message: "Assessment result has been fetched successfully.",
    results: {
      carrerValues,
      careerInterests:
        careerInterests?.record ??
        new Array(3).fill(null).map((_, idx) => ({ id: idx, title: "" })),
      personalityType: personalityType?.record?.[0] ?? {
        title: "",
        description: JSON.stringify([]),
      },
      motivatedSkills,
      // :
      //   motivatedSkills?.record ??
      //   new Array(3).fill(null).map((_, idx) => ({ id: idx, skill: "" })),
      lifePurpose: lifePurpose ?? null,
    },
  });
}