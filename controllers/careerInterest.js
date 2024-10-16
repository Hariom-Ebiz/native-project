const CareerInterest = require("../models/careerInterest");

const HttpError = require("../http-error");
const dateTimeFormat = require("../utils/dateTime.js");

exports.create = async (req, res, next) => {
  let { statement, category_id } = req.body;

  try {
    let createRes = await CareerInterest.create({
      statement,
      category_id,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
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
    message: "Created successfully.",
  });
};

exports.getAll = async (req, res, next) => {
  let statements;
  try {
    statements = await CareerInterest.getAll();
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch statements",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Statement fetched successfully.",
    statements: statements?.record,
  });
};
