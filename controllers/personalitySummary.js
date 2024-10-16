const Common = require("../models/common");
const HttpError = require("../http-error");
const dateTimeFormat = require("../utils/dateTime.js");

exports.create = async (req, res, next) => {
  const { id, title, description } = req.body;

  try {
    await Common.create("personality_summaries", {
      id,
      title,
      description: JSON.stringify(description),
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
  } catch (err) {
    console.log("err", err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not save",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Saved successfully.",
  });
};

exports.getAll = async (req, res, next) => {
  const { id, title, description } = req.body;
  let data = [];
  try {
    data = await Common.getAll("personality_summaries", {});
  } catch (err) {
    console.log("err", err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not save",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Fetched successfully.",
    data
  });
};
