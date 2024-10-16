const JobPostScreening = require("../models/job_post_screening");
const HttpError = require("../http-error");
const dateTimeFormat = require("../utils/dateTime.js");
const createSlug = (value) => value.toLowerCase().split(" ").join("-");

exports.create = async (req, res, next) => {
  let { name, title, description } = req.body;

  try {
    let createRes = await JobPostScreening.create({
      page_name: name,
      title,
      body: description,
      slug: createSlug(name),
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
    // console.log(createRes);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not create a cms page",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "CMS page created successfully.",
  });
};

exports.update = async (req, res, next) => {
  const { id, title, description, data, name } = req.body;

  try {
    let updateRes = await JobPostScreening.update(
      { id },
      {
        title,
        body: description,
        page_name: name,
        slug: createSlug(name),
        updated_at: dateTimeFormat(),
      }
    );
    // console.log(updateRes);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not edit cms page",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Cms Page Updated successfully.",
  });
};

exports.getAll = async (req, res, next) => {
  let { page, name, per_page, sortBy, order, title } = req.query;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  name = name ?? "";
  title = title ?? "";
  sortBy = sortBy ?? "created_at";
  order = order ?? "desc";

  let cms;
  try {
    cms = await JobPostScreening.getMany({
      match: {},
      page,
      per_page,
      sort_by: sortBy,
      order,
      page_name: name,
      title,
    });
    // console.log(cms);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch cms pages",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Cms Pages Fetched successfully.",
    cms: cms?.data,
    totalDocuments: cms?.totalDocuments,
  });
};

exports.getOne = async (req, res, next) => {
  const { id } = req.params;

  let cms;
  try {
    cms = await JobPostScreening.getOne({ id });
    // console.log(cms);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch cms",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Cms Page Fetched successfully.",
    cms,
  });
};

exports.delete = async (req, res, next) => {
  const { id } = req.body;

  try {
    let delRes = await JobPostScreening.delete({ id });
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

exports.getBySlug = async (req, res, next) => {
  const { slug } = req.params;

  let cms;

  try {
    cms = await JobPostScreening.getOne({
      slug,
    });
    // console.log(cms);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch cms page",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "CMS page Fetched successfully.",
    cms,
  });
};
