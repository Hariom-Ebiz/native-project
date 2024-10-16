const JobSeekerHiring = require("../models/jobSeekerHiringNotes");
const HttpError = require("../http-error");
const { validationResult } = require("express-validator");
const {
  ErrorMessageHandler,
} = require("../utils/helper");
const dateTimeFormat = require("../utils/dateTime.js");
const moment = require("moment");

exports.create = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const Err = errors.array();
    const { Errors, message } = ErrorMessageHandler(Err);
    return res
      .status(422)
      .json({ status: false, data: {}, errors: Errors, message });
  }

  const { job_id, job_seeker_id, type, note} = req.body;

  if (!job_id && !req.userId && !job_seeker_id && !type && !note) {
    return res
      .status(400)
      .json({ status: false, data: {}, errors: "Bad request", message: "Bad request" });
  }

  try {
    await JobSeekerHiring.create({
        job_id, employer_id: req.userId, job_seeker_id, type, note,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
    // console.log(saveRes);
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

  res.status(201).json({
    status: true,
    message: "Hiring Notes created Successfully",
  });
};

exports.getAll = async (req, res, next) => {
    const { job_id, job_seeker_id} = req.query;

  let notes;

  try {
    notes = await JobSeekerHiring.getMany({
        job_id, job_seeker_id, employer_id: req.userId
    });
    // console.log(faqs);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch faqs.",
      500
    );
    return next(error);
  }


  res.status(200).json({
    status: true,
    message: "Faqs Fetched successfully.",
    notes: notes?.data
  });
};

exports.delete = async (req, res, next) => {
  const { id } = req.body;

  try {
    let delRes = await JobSeekerHiring.delete({ id });
    // console.log(delRes);
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
    message: "FAQ deleted Successfully",
    id,
  });
};

exports.getOne = async (req, res, next) => {
  const { id } = req.params;

  let faq;

  try {
    faq = await JobSeekerHiring.getOne({ id });
    // console.log(faq);
  } catch (err) {
    onsole.log(err);
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
    message: "FAQ fetched successfully",
    faq,
  });
};

exports.update = async (req, res, next) => {
  const { category_id, question, answer,  id } = req.body;

  try {
    let updateRes = await JobSeekerHiring.update(
      { id },
      {
        category_id,
        question,
        answer,
        
        // updated_at: moment().format("YYYY-MM-DD hh:mm:ss"),
        updated_at: dateTimeFormat(),
      }
    );
    // console.log(updateRes);
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
    message: "FAQ updated successfully",
    // updateRes
  });
};

exports.changeStatus = async (req, res, next) => {
  const { id, status } = req.body;

  try {
    await JobSeekerHiring.update(
      { id },
      {
        is_active: status,
        updated_at: moment().format("YYYY-MM-DD hh:mm:ss"),
      }
    );
  } catch (err) {
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
    message: "FAQ's status changed successfully.",
    id,
    newStatus: status,
  });
};

exports.getCaetgoryByRole = async (req, res, next) => {
  const { page, per_page, sort_by, order, is_active, role } = req.query;

  let categories;
  try {
    categories = await JobSeekerHiring.getCategoryByRole({page, per_page, sort_by, order, is_active, role});
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
    message: "FAQ category fetched successfully",
    categories: categories.data
    // updateRes
  });
}

exports.likeOrDislike = async (req, res, next) => {
  const { id, isLike, isDislike } = req.body;
  try {
    await JobSeekerHiring.likeOrDislike(
      { 
        id, 
        isLike, 
        isDislike,
        updated_at: moment().format("YYYY-MM-DD hh:mm:ss"),
      }
    );
  } catch (err) {
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
    message: "FAQ's status changed successfully.",
    id
  });
};