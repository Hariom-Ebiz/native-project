const { validationResult } = require("express-validator");
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

  const { action, options } = req.body;

  try {
    let saveRes = await EmailAction.create({
      action,
      options,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
    console.log(saveRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not create an email's action",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Email's Action Created Successfully",
  });
};

exports.getAll = async (req, res, next) => {
  let emailActions;

  try {
    emailActions = await EmailAction.getMany({ match: {} });
    // console.log(emailActions);
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
    message: "Email Actions Fetched Successfully",
    emailActions: emailActions?.data,
    totalDocuments: emailActions?.totalDocuments,
  });
};

// exports.delete = async (req, res, next) => {
//   const { id } = req.body;

//   try {
//     await EmailAction.findByIdAndDelete(id);
//   } catch (err) {
//     const error = new HttpError(
//       req,
//       new Error().stack.split("at ")[1].trim(),
//       "Could not delete an email's action",
//       500
//     );
//     return next(error);
//   }

//   res.status(201).json({
//     status: true,
//     message: "Email's Action Deleted Successfully",
//     id,
//   });
// };

exports.getOne = async (req, res, next) => {
  const { id } = req.params;

  let emailAction;
  try {
    emailAction = await EmailAction.getOne({ id });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch an email's action",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Email's Action Fetched Successfully",
    emailAction,
  });
};
