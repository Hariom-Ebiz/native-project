const Testimonial = require("../models/testimonial");
const EmpTestimonial = require("../models/testimonial_employer");
const UserStatus = require("../models/userStatus");
const Country = require("../models/country");
const City = require("../models/city");
const Nationality = require("../models/nationality");
const Area = require("../models/areas");
const LivesIn = require("../models/livesIn");
const CarrierLevel = require("../models/carrierLevel");

const JobIndustry = require("../models/jobIndustry");
const EmployeeNumber = require("../models/employeeNumber");
const JobCategory = require("../models/jobCategory");
const JobType = require("../models/jobType");
const StudyTopic = require("../models/studyTopic");
const StudyField = require("../models/studyField");
const Grade = require("../models/grade");
const GraduationCertificate = require("../models/graduationCertificate");
const DegreeLevel = require("../models/degreeLevel");
const PostGradDegreeLevel = require("../models/postGraduationDegreeLevel");
const Skill = require("../models/skill");
const Language = require("../models/language");
const Psycometric = require("../models/psycometricWeight");

const HttpError = require("../http-error");
const dateTimeFormat = require("../utils/dateTime.js");

exports.getAllTestimonials = async (req, res, next) => {
  let list;
  let { lang } = req.query;
  try {
    list = await Testimonial.getAllForClient(lang);
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
};

exports.getAllEmpTestimonials = async (req, res, next) => {
  let { lang } = req.query;
  let list;
  try {
    list = await EmpTestimonial.getAllForClient(lang);
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
};

exports.getAllUserStatus = async (req, res, next) => {
  let list;
  try {
    list = await UserStatus.getAll();
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
};

exports.getAllCountries = async (req, res, next) => {
  let list;
  try {
    list = await Country.getAll();
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
};

exports.getAllCities = async (req, res, next) => {
  const { country } = req.query;

  let extras = {};
  if (country) {
    extras.country_id = country;
  }
  let list;
  try {
    list = await City.getAll(extras);
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
};

exports.getAllAreas = async (req, res, next) => {
  const { city } = req.query;

  let extras = {};
  if (city) {
    extras.city_id = city;
  }
  let list;
  try {
    list = await Area.getAll(extras);
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
};

exports.getAllNationality = async (req, res, next) => {

  let list;
  try {
    list = await Nationality.getAll();
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
};

exports.getAllCitiesCountries = async (req, res, next) => {
  const { key } = req.query;

  let list;
  try {
    list = await City.getAllWithCountry(key);
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
};

// JOB INDUSTRY >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.createJobIndustry = async (req, res, next) => {
  const { name } = req.body;

  try {
    let saveRes = await JobIndustry.create({
      name,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
    // console.log(saveRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not create.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Created Successfully",
  });
};

exports.updateJobIndustry = async (req, res, next) => {
  const { id, name } = req.body;

  try {
    let updateRes = await JobIndustry.update(
      { id },
      {
        name,
        updated_at: dateTimeFormat(),
      }
    );
    // console.log(updateRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not update.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Updated Successfully",
  });
};

exports.getAllJobIndustry = async (req, res, next) => {
  let { page, per_page, sort_by, order, name } = req.query;
  let list;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  sort_by = sort_by ?? "created_at";
  order = order ?? "desc";
  name = name ?? "";

  try {
    list = await JobIndustry.getMany({
      match: {},
      page,
      per_page,
      sort_by,
      order,
      name,
    });
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
    list: list?.data,
    totalDocuments: list?.totalDocuments,
  });
};

exports.getOneJobIndustry = async (req, res, next) => {
  const { id } = req.params;

  let data;
  try {
    data = await JobIndustry.getOne({ id });
    if (!data) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Could not fetch.",
        422
      );
      return next(error);
    }
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
    data,
  });
};

exports.deleteJobIndustry = async (req, res, next) => {
  const { id } = req.body;

  try {
    let delRes = await JobIndustry.delete({ id });
    // console.log(delRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not delete.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Deleted Successfully",
  });
};

exports.getMasterJobIndustry = async (req, res, next) => {
  let list;

  try {
    list = await JobIndustry.getAll({});
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
};

// JOB CATEGORY >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.createJobCategory = async (req, res, next) => {
  const { name } = req.body;

  try {
    let saveRes = await JobCategory.create({
      name,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
    // console.log(saveRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not create.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Created Successfully",
  });
};

exports.updateJobCategory = async (req, res, next) => {
  const { id, name } = req.body;

  try {
    let updateRes = await JobCategory.update(
      { id },
      {
        name,
        updated_at: dateTimeFormat(),
      }
    );
    // console.log(updateRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not update.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Updated Successfully",
  });
};

exports.getAllJobCategory = async (req, res, next) => {
  let { page, per_page, sort_by, order, name } = req.query;
  let list;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  sort_by = sort_by ?? "created_at";
  order = order ?? "desc";
  name = name ?? "";

  try {
    list = await JobCategory.getMany({
      match: {},
      page,
      per_page,
      sort_by,
      order,
      name,
    });
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
    list: list?.data,
    totalDocuments: list?.totalDocuments,
  });
};

exports.getOneJobCategory = async (req, res, next) => {
  const { id } = req.params;

  let data;
  try {
    data = await JobCategory.getOne({ id });
    if (!data) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Could not fetch.",
        422
      );
      return next(error);
    }
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
    data,
  });
};

exports.deleteJobCategory = async (req, res, next) => {
  const { id } = req.body;

  try {
    let delRes = await JobCategory.delete({ id });
    // console.log(delRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not delete.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Deleted Successfully",
  });
};

exports.getMasterJobCategory = async (req, res, next) => {
  let list;
  const currentUserId = req.userId;
  try {
    list = await JobCategory.getAll({}, {}, currentUserId);
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
};

// JOB TYPE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.createJobType = async (req, res, next) => {
  const { name } = req.body;

  try {
    let saveRes = await JobType.create({
      name,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
    // console.log(saveRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not create.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Created Successfully",
  });
};

exports.updateJobType = async (req, res, next) => {
  const { id, name } = req.body;

  try {
    let updateRes = await JobType.update(
      { id },
      {
        name,
        updated_at: dateTimeFormat(),
      }
    );
    // console.log(updateRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not update.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Updated Successfully",
  });
};

exports.getAllJobType = async (req, res, next) => {
  let { page, per_page, sort_by, order, name } = req.query;
  let list;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  sort_by = sort_by ?? "created_at";
  order = order ?? "desc";
  name = name ?? "";

  try {
    list = await JobType.getMany({
      match: {},
      page,
      per_page,
      sort_by,
      order,
      name,
    });
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
    list: list?.data,
    totalDocuments: list?.totalDocuments,
  });
};

exports.getOneJobType = async (req, res, next) => {
  const { id } = req.params;

  let data;
  try {
    data = await JobType.getOne({ id });
    if (!data) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Could not fetch.",
        422
      );
      return next(error);
    }
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
    data,
  });
};

exports.deleteJobType = async (req, res, next) => {
  const { id } = req.body;

  try {
    let delRes = await JobType.delete({ id });
    // console.log(delRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not delete.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Deleted Successfully",
  });
};

exports.getMasterJobType = async (req, res, next) => {
  let list;
  const currentUserId = req.userId;
  try {
    list = await JobType.getAll({},{},currentUserId);
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
};

// STUDY TOPC>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.createStudyTopic = async (req, res, next) => {
  const { name } = req.body;

  try {
    let saveRes = await StudyTopic.create({
      name,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
    // console.log(saveRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not create.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Created Successfully",
  });
};

exports.updateStudyTopic = async (req, res, next) => {
  const { id, name } = req.body;

  try {
    let updateRes = await StudyTopic.update(
      { id },
      {
        name,
        updated_at: dateTimeFormat(),
      }
    );
    // console.log(updateRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not update.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Updated Successfully",
  });
};

exports.getAllStudyTopic = async (req, res, next) => {
  let { page, per_page, sort_by, order, name } = req.query;
  let list;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  sort_by = sort_by ?? "created_at";
  order = order ?? "desc";
  name = name ?? "";

  try {
    list = await StudyTopic.getMany({
      match: {},
      page,
      per_page,
      sort_by,
      order,
      name,
    });
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
    list: list?.data,
    totalDocuments: list?.totalDocuments,
  });
};

exports.getOneStudyTopic = async (req, res, next) => {
  const { id } = req.params;

  let data;
  try {
    data = await StudyTopic.getOne({ id });
    if (!data) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Could not fetch.",
        422
      );
      return next(error);
    }
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
    data,
  });
};

exports.deleteStudyTopic = async (req, res, next) => {
  const { id } = req.body;

  try {
    let delRes = await StudyTopic.delete({ id });
    // console.log(delRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not delete.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Deleted Successfully",
  });
};

exports.getMasterStudyTopic = async (req, res, next) => {
  let list;

  try {
    list = await StudyTopic.getAll({});
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
};

// STUDY FIELD >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.createStudyField = async (req, res, next) => {
  const { name } = req.body;

  try {
    let saveRes = await StudyField.create({
      name,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
    // console.log(saveRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not create.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Created Successfully",
  });
};

exports.updateStudyField = async (req, res, next) => {
  const { id, name } = req.body;

  try {
    let updateRes = await StudyField.update(
      { id },
      {
        name,
        updated_at: dateTimeFormat(),
      }
    );
    // console.log(updateRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not update.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Updated Successfully",
  });
};

exports.getAllStudyField = async (req, res, next) => {
  let { page, per_page, sort_by, order, name } = req.query;
  let list;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  sort_by = sort_by ?? "created_at";
  order = order ?? "desc";
  name = name ?? "";

  try {
    list = await StudyField.getMany({
      match: {},
      page,
      per_page,
      sort_by,
      order,
      name,
    });
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
    list: list?.data,
    totalDocuments: list?.totalDocuments,
  });
};

exports.getOneStudyField = async (req, res, next) => {
  const { id } = req.params;

  let data;
  try {
    data = await StudyField.getOne({ id });
    if (!data) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Could not fetch.",
        422
      );
      return next(error);
    }
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
    data,
  });
};

exports.deleteStudyField = async (req, res, next) => {
  const { id } = req.body;

  try {
    let delRes = await StudyField.delete({ id });
    // console.log(delRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not delete.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Deleted Successfully",
  });
};

exports.getMasterStudyField = async (req, res, next) => {
  let list;

  try {
    list = await StudyField.getAll({});
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
};

// GRADE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.createGrade = async (req, res, next) => {
  const { name } = req.body;

  try {
    let saveRes = await Grade.create({
      name,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
    // console.log(saveRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not create.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Created Successfully",
  });
};

exports.updateGrade = async (req, res, next) => {
  const { id, name } = req.body;

  try {
    let updateRes = await Grade.update(
      { id },
      {
        name,
        updated_at: dateTimeFormat(),
      }
    );
    // console.log(updateRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not update.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Updated Successfully",
  });
};

exports.getAllGrade = async (req, res, next) => {
  let { page, per_page, sort_by, order, name } = req.query;
  let list;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  sort_by = sort_by ?? "created_at";
  order = order ?? "desc";
  name = name ?? "";

  try {
    list = await Grade.getMany({
      match: {},
      page,
      per_page,
      sort_by,
      order,
      name,
    });
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
    list: list?.data,
    totalDocuments: list?.totalDocuments,
  });
};

exports.getOneGrade = async (req, res, next) => {
  const { id } = req.params;

  let data;
  try {
    data = await Grade.getOne({ id });
    if (!data) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Could not fetch.",
        422
      );
      return next(error);
    }
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
    data,
  });
};

exports.deleteGrade = async (req, res, next) => {
  const { id } = req.body;

  try {
    let delRes = await Grade.delete({ id });
    // console.log(delRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not delete.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Deleted Successfully",
  });
};

exports.getMasterGrade = async (req, res, next) => {
  let list;

  try {
    list = await Grade.getAll({});
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
};

// GRADUATION CERTIFICATE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.createGraduationCertificate = async (req, res, next) => {
  const { name } = req.body;

  try {
    let saveRes = await GraduationCertificate.create({
      name,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
    // console.log(saveRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not create.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Created Successfully",
  });
};

exports.updateGraduationCertificate = async (req, res, next) => {
  const { id, name } = req.body;

  try {
    let updateRes = await GraduationCertificate.update(
      { id },
      {
        name,
        updated_at: dateTimeFormat(),
      }
    );
    // console.log(updateRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not update.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Updated Successfully",
  });
};

exports.getAllGraduationCertificate = async (req, res, next) => {
  let { page, per_page, sort_by, order, name } = req.query;
  let list;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  sort_by = sort_by ?? "created_at";
  order = order ?? "desc";
  name = name ?? "";

  try {
    list = await GraduationCertificate.getMany({
      match: {},
      page,
      per_page,
      sort_by,
      order,
      name,
    });
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
    list: list?.data,
    totalDocuments: list?.totalDocuments,
  });
};

exports.getOneGraduationCertificate = async (req, res, next) => {
  const { id } = req.params;

  let data;
  try {
    data = await GraduationCertificate.getOne({ id });
    if (!data) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Could not fetch.",
        422
      );
      return next(error);
    }
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
    data,
  });
};

exports.deleteGraduationCertificate = async (req, res, next) => {
  const { id } = req.body;

  try {
    let delRes = await GraduationCertificate.delete({ id });
    // console.log(delRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not delete.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Deleted Successfully",
  });
};

exports.getMasterGraduationCertificate = async (req, res, next) => {
  let list;

  try {
    list = await GraduationCertificate.getAll({});
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
};

// DEGREE LEVEL >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.createDegreeLevel = async (req, res, next) => {
  const { name } = req.body;

  try {
    let saveRes = await DegreeLevel.create({
      name,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
    // console.log(saveRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not create.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Created Successfully",
  });
};

exports.updateDegreeLevel = async (req, res, next) => {
  const { id, name } = req.body;

  try {
    let updateRes = await DegreeLevel.update(
      { id },
      {
        name,
        updated_at: dateTimeFormat(),
      }
    );
    // console.log(updateRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not update.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Updated Successfully",
  });
};

exports.getAllDegreeLevel = async (req, res, next) => {
  let { page, per_page, sort_by, order, name } = req.query;
  let list;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  sort_by = sort_by ?? "created_at";
  order = order ?? "desc";
  name = name ?? "";

  try {
    list = await DegreeLevel.getMany({
      match: {},
      page,
      per_page,
      sort_by,
      order,
      name,
    });
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
    list: list?.data,
    totalDocuments: list?.totalDocuments,
  });
};

exports.getOneDegreeLevel = async (req, res, next) => {
  const { id } = req.params;

  let data;
  try {
    data = await DegreeLevel.getOne({ id });
    if (!data) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Could not fetch.",
        422
      );
      return next(error);
    }
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
    data,
  });
};

exports.deleteDegreeLevel = async (req, res, next) => {
  const { id } = req.body;

  try {
    let delRes = await DegreeLevel.delete({ id });
    // console.log(delRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not delete.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Deleted Successfully",
  });
};

exports.getMasterDegreeLevel = async (req, res, next) => {
  let list;

  try {
    list = await DegreeLevel.getAll({});
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
};

// SKILL >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.createSkill = async (req, res, next) => {
  const { name } = req.body;

  try {
    let saveRes = await Skill.create({
      name,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
    // console.log(saveRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not create.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Created Successfully",
  });
};

exports.updateSkill = async (req, res, next) => {
  const { id, name } = req.body;

  try {
    let updateRes = await Skill.update(
      { id },
      {
        name,
        updated_at: dateTimeFormat(),
      }
    );
    // console.log(updateRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not update.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Updated Successfully",
  });
};

exports.getAllSkill = async (req, res, next) => {
  let { page, per_page, sort_by, order, name } = req.query;
  let list;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  sort_by = sort_by ?? "created_at";
  order = order ?? "desc";
  name = name ?? "";

  try {
    list = await Skill.getMany({
      match: {},
      page,
      per_page,
      sort_by,
      order,
      name,
    });
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
    list: list?.data,
    totalDocuments: list?.totalDocuments,
  });
};

exports.getOneSkill = async (req, res, next) => {
  const { id } = req.params;

  let data;
  try {
    data = await Skill.getOne({ id });
    if (!data) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Could not fetch.",
        422
      );
      return next(error);
    }
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
    data,
  });
};

exports.deleteSkill = async (req, res, next) => {
  const { id } = req.body;

  try {
    let delRes = await Skill.delete({ id });
    // console.log(delRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not delete.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Deleted Successfully",
  });
};

exports.getMasterSkill = async (req, res, next) => {
  let list;

  try {
    list = await Skill.getAll({});
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
};

// LANGUAGES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.createLanguage = async (req, res, next) => {
  const { name } = req.body;

  try {
    let saveRes = await Language.create({
      name,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
    // console.log(saveRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not create.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Created Successfully",
  });
};

exports.updateLanguage = async (req, res, next) => {
  const { id, name } = req.body;

  try {
    let updateRes = await Language.update(
      { id },
      {
        name,
        updated_at: dateTimeFormat(),
      }
    );
    // console.log(updateRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not update.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Updated Successfully",
  });
};

exports.getAllLanguage = async (req, res, next) => {
  let { page, per_page, sort_by, order, name } = req.query;
  let list;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  sort_by = sort_by ?? "created_at";
  order = order ?? "desc";
  name = name ?? "";

  try {
    list = await Language.getMany({
      match: {},
      page,
      per_page,
      sort_by,
      order,
      name,
    });
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
    list: list?.data,
    totalDocuments: list?.totalDocuments,
  });
};

exports.getOneLanguage = async (req, res, next) => {
  const { id } = req.params;

  let data;
  try {
    data = await Language.getOne({ id });
    if (!data) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Could not fetch.",
        422
      );
      return next(error);
    }
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
    data,
  });
};

exports.deleteLanguage = async (req, res, next) => {
  const { id } = req.body;

  try {
    let delRes = await Language.delete({ id });
    // console.log(delRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not delete.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Deleted Successfully",
  });
};

exports.getMasterLanguage = async (req, res, next) => {
  let list;

  try {
    list = await Language.getAll({});
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
};

// USER STATUS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.createUserStatus = async (req, res, next) => {
  const { name } = req.body;

  try {
    let saveRes = await UserStatus.create({
      name,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
    console.log(saveRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not create.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Created Successfully",
  });
};

exports.updateUserStatus = async (req, res, next) => {
  const { id, name } = req.body;

  try {
    let updateRes = await UserStatus.update(
      { id },
      {
        name,
        updated_at: dateTimeFormat(),
      }
    );
    // console.log(updateRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not update.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Updated Successfully",
  });
};

exports.getAllUserStatuses = async (req, res, next) => {
  let { page, per_page, sort_by, order, name } = req.query;
  let list;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  sort_by = sort_by ?? "created_at";
  order = order ?? "desc";
  name = name ?? "";

  try {
    list = await UserStatus.getMany({
      match: {},
      page,
      page_size: per_page,
      sort_by,
      sort_order: order,
      name,
    });
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
    list: list?.data,
    totalDocuments: list?.totalDocuments,
  });
};

exports.getOneUserStatus = async (req, res, next) => {
  const { id } = req.params;

  let data;
  try {
    data = await UserStatus.getOne({ id });
    if (!data) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Could not fetch.",
        422
      );
      return next(error);
    }
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
    data,
  });
};

exports.deleteUserStatus = async (req, res, next) => {
  const { id } = req.body;

  try {
    let delRes = await UserStatus.delete({ id });
    // console.log(delRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not delete.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Deleted Successfully",
  });
};

// LIVES IN >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.createLivesIn = async (req, res, next) => {
  const { name } = req.body;

  try {
    let saveRes = await LivesIn.create({
      name,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
    // console.log(saveRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not create.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Created Successfully",
  });
};

exports.updateLivesIn = async (req, res, next) => {
  const { id, name } = req.body;

  try {
    let updateRes = await LivesIn.update(
      { id },
      {
        name,
        updated_at: dateTimeFormat(),
      }
    );
    // console.log(updateRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not update.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Updated Successfully",
  });
};

exports.getAllLivesIn = async (req, res, next) => {
  let { page, per_page, sort_by, order, name } = req.query;
  let list;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  sort_by = sort_by ?? "created_at";
  order = order ?? "desc";
  name = name ?? "";

  try {
    list = await LivesIn.getMany({
      match: {},
      page,
      page_size: per_page,
      sort_by,
      sort_order: order,
      name,
    });
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
    list: list?.data,
    totalDocuments: list?.totalDocuments,
  });
};

exports.getOneLivesIn = async (req, res, next) => {
  const { id } = req.params;

  let data;
  try {
    data = await LivesIn.getOne({ id });
    if (!data) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Could not fetch.",
        422
      );
      return next(error);
    }
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
    data,
  });
};

exports.deleteLivesIn = async (req, res, next) => {
  const { id } = req.body;

  try {
    let delRes = await LivesIn.delete({ id });
    // console.log(delRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not delete.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Deleted Successfully",
  });
};

exports.getAllLivesInList = async (req, res, next) => {
  let list;
  try {
    list = await LivesIn.getAll();
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
};


// CARRIER LEVELS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.createCarrierLevel = async (req, res, next) => {
  const { name } = req.body;

  try {
    let saveRes = await CarrierLevel.create({
      name,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
    // console.log(saveRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not create.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Created Successfully",
  });
};

exports.updateCarrierLevel = async (req, res, next) => {
  const { id, name } = req.body;

  try {
    let updateRes = await CarrierLevel.update(
      { id },
      {
        name,
        updated_at: dateTimeFormat(),
      }
    );
    // console.log(updateRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not update.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Updated Successfully",
  });
};

exports.getAllCarrierLevel = async (req, res, next) => {
  let { page, per_page, sort_by, order, name } = req.query;
  let list;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  sort_by = sort_by ?? "created_at";
  order = order ?? "desc";
  name = name ?? "";

  try {
    list = await CarrierLevel.getMany({
      match: {},
      page,
      page_size: per_page,
      sort_by,
      sort_order: order,
      name,
    });
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
    list: list?.data,
    totalDocuments: list?.totalDocuments,
  });
};

exports.getOneCarrierLevel = async (req, res, next) => {
  const { id } = req.params;

  let data;
  try {
    data = await CarrierLevel.getOne({ id });
    if (!data) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Could not fetch.",
        422
      );
      return next(error);
    }
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
    data,
  });
};

exports.deleteCarrierLevel = async (req, res, next) => {
  const { id } = req.body;

  try {
    let delRes = await CarrierLevel.delete({ id });
    // console.log(delRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not delete.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Deleted Successfully",
  });
};

exports.getAllCarrierLevelList = async (req, res, next) => {
  let list;
  try {
    list = await CarrierLevel.getAll();
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
};

// CARRIER LEVELS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.createCarrierLevel = async (req, res, next) => {
  const { name } = req.body;

  try {
    let saveRes = await CarrierLevel.create({
      name,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
    // console.log(saveRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not create.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Created Successfully",
  });
};

exports.updateCarrierLevel = async (req, res, next) => {
  const { id, name } = req.body;

  try {
    let updateRes = await CarrierLevel.update(
      { id },
      {
        name,
        updated_at: dateTimeFormat(),
      }
    );
    // console.log(updateRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not update.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Updated Successfully",
  });
};

exports.getAllCarrierLevel = async (req, res, next) => {
  let { page, per_page, sort_by, order, name } = req.query;
  let list;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  sort_by = sort_by ?? "created_at";
  order = order ?? "desc";
  name = name ?? "";

  try {
    list = await CarrierLevel.getMany({
      match: {},
      page,
      page_size: per_page,
      sort_by,
      sort_order: order,
      name,
    });
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
    list: list?.data,
    totalDocuments: list?.totalDocuments,
  });
};

exports.getOneCarrierLevel = async (req, res, next) => {
  const { id } = req.params;

  let data;
  try {
    data = await CarrierLevel.getOne({ id });
    if (!data) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Could not fetch.",
        422
      );
      return next(error);
    }
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
    data,
  });
};

exports.deleteCarrierLevel = async (req, res, next) => {
  const { id } = req.body;

  try {
    let delRes = await CarrierLevel.delete({ id });
    // console.log(delRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not delete.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Deleted Successfully",
  });
};

exports.getAllCarrierLevelList = async (req, res, next) => {
  let list;
  try {

    list = await CarrierLevel.getAll();
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
};

exports.getAllCarrierLevelListAuth = async (req, res, next) => {
  let list;
  try {
    list = await CarrierLevel.getAllAuth({},{},req.userId);
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
};

// POST GRAD DEGREE LEVEL >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.createPostGradDegreeLevel = async (req, res, next) => {
  const { name } = req.body;

  try {
    let saveRes = await PostGradDegreeLevel.create({
      name,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
    // console.log(saveRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not create.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Created Successfully",
  });
};

exports.updatePostGradDegreeLevel = async (req, res, next) => {
  const { id, name } = req.body;

  try {
    let updateRes = await PostGradDegreeLevel.update(
      { id },
      {
        name,
        updated_at: dateTimeFormat(),
      }
    );
    // console.log(updateRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not update.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Updated Successfully",
  });
};

exports.getAllPostGradDegreeLevel = async (req, res, next) => {
  let { page, per_page, sort_by, order, name } = req.query;
  let list;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  sort_by = sort_by ?? "created_at";
  order = order ?? "desc";
  name = name ?? "";

  try {
    list = await PostGradDegreeLevel.getMany({
      match: {},
      page,
      per_page,
      sort_by,
      order,
      name,
    });
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
    list: list?.data,
    totalDocuments: list?.totalDocuments,
  });
};

exports.getOnePostGradDegreeLevel = async (req, res, next) => {
  const { id } = req.params;

  let data;
  try {
    data = await PostGradDegreeLevel.getOne({ id });
    if (!data) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Could not fetch.",
        422
      );
      return next(error);
    }
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
    data,
  });
};

exports.deletePostGradDegreeLevel = async (req, res, next) => {
  const { id } = req.body;

  try {
    let delRes = await PostGradDegreeLevel.delete({ id });
    // console.log(delRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not delete.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Deleted Successfully",
  });
};

exports.getMasterPostGradDegreeLevel = async (req, res, next) => {
  let list;

  try {
    list = await PostGradDegreeLevel.getAll({});
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
};

// PSYCOMETRIC LEVEL >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

exports.updatePsycometricValue = async (req, res, next) => {
  const { id, value } = req.body;

  try {
    let updateRes = await Psycometric.update(
      { id },
      {
        value,
        updated_at: dateTimeFormat(),
      }
    );
    // console.log(updateRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not update.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Updated Successfully",
  });
};

exports.getAllPsycometric = async (req, res, next) => {
  let { page, per_page, sort_by, order, name } = req.query;
  let list;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  sort_by = sort_by ?? "created_at";
  order = order ?? "desc";
  name = name ?? "";

  try {
    list = await Psycometric.getMany({
      match: {},
      page,
      per_page,
      sort_by,
      order,
      name,
    });
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
    list: list?.data,
    totalDocuments: list?.totalDocuments,
  });
};

exports.getOnePsycometric = async (req, res, next) => {
  const { id } = req.params;

  let data;
  try {
    data = await Psycometric.getOne({ id });
    if (!data) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Could not fetch.",
        422
      );
      return next(error);
    }
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
    data,
  });
};


// EMPLOYEE NUMBER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.createEmployeeNumber = async (req, res, next) => {
  const { name } = req.body;

  try {
    let saveRes = await EmployeeNumber.create({
      name,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
    // console.log(saveRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not create.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Created Successfully",
  });
};

exports.updateEmployeeNumber = async (req, res, next) => {
  const { id, name } = req.body;

  try {
    let updateRes = await EmployeeNumber.update(
      { id },
      {
        name,
        updated_at: dateTimeFormat(),
      }
    );
    // console.log(updateRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not update.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Updated Successfully",
  });
};

exports.getAllEmployeeNumber = async (req, res, next) => {
  let { page, per_page, sort_by, order, name } = req.query;
  let list;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  sort_by = sort_by ?? "created_at";
  order = order ?? "desc";
  name = name ?? "";

  try {
    list = await EmployeeNumber.getMany({
      match: {},
      page,
      per_page,
      sort_by,
      order,
      name,
    });
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
    list: list?.data,
    totalDocuments: list?.totalDocuments,
  });
};

exports.getOneEmployeeNumber = async (req, res, next) => {
  const { id } = req.params;

  let data;
  try {
    data = await EmployeeNumber.getOne({ id });
    if (!data) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Could not fetch.",
        422
      );
      return next(error);
    }
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
    data,
  });
};

exports.deleteEmployeeNumber = async (req, res, next) => {
  const { id } = req.body;

  try {
    let delRes = await EmployeeNumber.delete({ id });
    // console.log(delRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not delete.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Deleted Successfully",
  });
};

exports.getMasterEmployeeNumber = async (req, res, next) => {
  let list;

  try {
    list = await EmployeeNumber.getAll({});
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
};