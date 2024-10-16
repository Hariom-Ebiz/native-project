const Faq = require("../models/faq");
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

  const { question, answer} = req.body;

  try {
    let saveRes = await Faq.create({
      question,
      answer,
            // created_at: moment().format("YYYY-MM-DD hh:mm:ss"),
      // updated_at: moment().format("YYYY-MM-DD hh:mm:ss"),

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
    message: "FAQ created Successfully",
  });
};

exports.getAll = async (req, res, next) => {
  let { page, per_page, sort_by, order, question, is_active } = req.query;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 1;
  sort_by = sort_by ?? "created_at";
  order = order ?? "desc";
  question = question ?? "";

  let faqs;

  let extras = {}; 

  if (is_active) {
    extras.is_active = is_active;
  }

  try {
    faqs = await Faq.getMany({
      match: { ...extras },
      page,
      question,
      per_page,
      sort_by,
      order,
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
    faqs: faqs?.data,
    totalDocuments: faqs?.totalDocuments,
  });
};

exports.delete = async (req, res, next) => {
  const { id } = req.body;

  try {
    let delRes = await Faq.delete({ id });
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
    faq = await Faq.getOne({ id });
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
  const { question, answer,  id } = req.body;

  try {
    let updateRes = await Faq.update(
      { id },
      {
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
    await Faq.update(
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
