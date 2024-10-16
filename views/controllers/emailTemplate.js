const { validationResult } = require("express-validator");
const EmailTemplate = require("../models/emailTemplate");
const EmailAction = require("../models/emailAction");
const HttpError = require("../http-error");
const dateTimeFormat = require("../utils/dateTime.js");

const {
  ErrorMessageHandler,
} = require("../utils/helper");

exports.create = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const Err = errors.array();
    const { Errors, message } = ErrorMessageHandler(Err);
    return res
      .status(422)
      .json({ status: false, data: {}, errors: Errors, message });
  }

  const { name, subject, action, body } = req.body;

  try {
    let createRes = await EmailTemplate.create({
      name,
      subject,
      action,
      body,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
    console.log(createRes);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not create an email template",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Email Template Created Successfully",
  });
};

exports.getAll = async (req, res, next) => {
  let emailTemplates;

  let { page, perPage, sortBy, order, name, subject } = req.query;

  page = page ? +page : 1;
  let per_page = perPage ? +perPage : 10;
  let sort_by = sortBy ?? "created_at";
  order = order ?? "desc";
  name = name ?? "";
  subject = subject ?? "";

  try {
    emailTemplates = await EmailTemplate.getMany({
      match: {},
      name,
      subject,
      per_page,
      page,
      order,
    });
    // console.log(emailTemplates);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch email actions",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Email Templates Fetched Successfully",
    emailTemplates: emailTemplates?.data,
    totalDocuments: emailTemplates?.totalDocuments,
  });
};

exports.getOne = async (req, res, next) => {
  const { id } = req.params;

  let emailTemplate;
  try {
    emailTemplate = await EmailTemplate.getOne({ id });
    if (emailTemplate?.action) {
      let action = await EmailAction.getOne({ id: emailTemplate.action });
      if (action) {
        emailTemplate.options = action.options;
      }
    }
    // console.log(emailTemplate);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch email template",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Email Template Fetched successfully.",
    emailTemplate,
  });
};

// exports.delete = async (req, res, next) => {};

exports.update = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const Err = errors.array();
    const { Errors, message } = ErrorMessageHandler(Err);
    return res
      .status(422)
      .json({ status: false, data: {}, errors: Errors, message });
  }

  const { body, name, subject, id } = req.body;

  try {
    let updateRes = await EmailTemplate.update(
      { id },
      { body, name, subject, updated_at: dateTimeFormat() }
    );
    // console.log(updateRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not update email template",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Email Templates Updated successfully.",
  });
};
