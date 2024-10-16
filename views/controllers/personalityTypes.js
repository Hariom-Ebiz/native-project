const PersonalityTypes = require("../models/personalityType");

const HttpError = require("../http-error");
const dateTimeFormat = require("../utils/dateTime.js");

exports.create = async (req, res, next) => {
  let { word, definition } = req.body;

  try {
    let createRes = await PersonalityTypes.create({
      word,
      definition,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not create",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Type created successfully.",
  });
};

exports.getAll = async (req, res, next) => {
  let types;

  try {
    types = await PersonalityTypes.getAll();
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch types",
      500
    );
    return next(error);
  }

  const data = types?.record ?? [];

  const size = 4;
  const arrayOfArrays = [];

  for (let i = 0; i < data.length; i += size) {
    arrayOfArrays.push(data.slice(i, i + size));
  }

  res.status(200).json({
    status: true,
    message: "Types Fetched successfully.",
    types: arrayOfArrays,
  });
};
