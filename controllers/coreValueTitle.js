const CoreValueTitle = require("../models/coreValueTitle");
const HttpError = require("../http-error");
const dateTimeFormat = require("../utils/dateTime.js");

exports.create = async (req, res, next) => {
  let { title, background_colour, max_limit } = req.body;

  try {
    let createRes = await CoreValueTitle.create({
      title,
      background_colour,
      max_limit,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not create core value title",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Core value title created successfully.",
  });
};

exports.update = async (req, res, next) => {
  const { id, title, background_colour, max_limit } = req.body;

  try {
    let updateRes = await CoreValueTitle.update(
      { id },
      {
        title,
        background_colour,
        max_limit,
        updated_at: dateTimeFormat(),
      }
    );
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not edit core value title",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Core value title updated successfully.",
  });
};

exports.getAll = async (req, res, next) => {
  let titles;
  try {
    titles = await CoreValueTitle.getAll();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch titles",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Core Value Titles Fetched successfully.",
    titles: titles?.record,
  });
};

exports.delete = async (req, res, next) => {
  const { id } = req.body;

  try {
    await CoreValueTitle.delete({ id });
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not delete title",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Core Value Title Deleted Successfully.",
  });
};
