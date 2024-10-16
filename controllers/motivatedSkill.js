const MotivatedSkill = require("../models/motivatedSkill");

const HttpError = require("../http-error");
const dateTimeFormat = require("../utils/dateTime.js");

exports.create = async (req, res, next) => {
  let { skill } = req.body;

  try {
    let createRes = await MotivatedSkill.create({
      skill,
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
    message: "Skill created successfully.",
  });
};

exports.getAll = async (req, res, next) => {
  let skills;

  try {
    skills = await MotivatedSkill.getAll();
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch skills",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Skills Fetched successfully.",
    skills: skills?.record.map((s) => ({
      id: s.id.toString(),
      content: s.skill,
      description: s.description
    })),
  });
};
