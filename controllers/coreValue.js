const CoreValue = require("../models/coreValue");

const HttpError = require("../http-error");
const dateTimeFormat = require("../utils/dateTime.js");

exports.create = async (req, res, next) => {
  let { value } = req.body;

  try {
    let createRes = await CoreValue.create({
      value,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not create core value",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Core value created successfully.",
  });
};

exports.update = async (req, res, next) => {
  const { id, value } = req.body;

  try {
    let updateRes = await CoreValue.update(
      { id },
      {
        value,
        updated_at: dateTimeFormat(),
      }
    );
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not edit core value",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Core value updated successfully.",
  });
};

exports.getAll = async (req, res, next) => {
  let values;
  try {
    values = await CoreValue.getAll();
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch values",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Core Values Fetched successfully.",
    values: values?.record.map((r) => ({
      id: r.id.toString(),
      content: r.value,
      description: r.description
    })),
  });
};

exports.delete = async (req, res, next) => {
  const { id } = req.body;

  try {
    await CoreValue.delete({ id });
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not delete core value",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Core Value Deleted Successfully.",
  });
};


