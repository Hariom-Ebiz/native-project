const CareerInterestCategory = require("../models/careerInterestCategory");

const HttpError = require("../http-error");
const dateTimeFormat = require("../utils/dateTime.js");

exports.create = async (req, res, next) => {
  let { title } = req.body;

  try {
    let createRes = await CareerInterestCategory.create({
      title,
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
  let categories;
  try {
    categories = await CareerInterestCategory.getAll();
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch categories",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Categories fetched successfully.",
    categories: categories?.record,
  });
};
