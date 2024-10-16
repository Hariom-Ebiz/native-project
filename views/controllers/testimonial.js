const Testimonial = require("../models/testimonial");
const HttpError = require("../http-error");

const dateTimeFormat = require("../utils/dateTime.js");

exports.create = async (req, res, next) => {
  const { name, designation, comment } = req.body;

  let extras = {
    created_at: dateTimeFormat(),
    updated_at: dateTimeFormat(),
  };
  let images = req.files;
  console.log(images);
  if (images && images.length > 0) {
    extras.image = images[0].path;
  }

  try {
    let saveRes = await Testimonial.create({
      name,
      designation,
      comment,
      ...extras,
    });
    console.log(saveRes);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not create testimonial.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Testimonial Created Successfully",
  });
};

exports.update = async (req, res, next) => {
  const { id, name, designation, comment } = req.body;

  let extras = {
    updated_at: dateTimeFormat(),
  };
  let images = req.files;
  if (images && images.length > 0) {
    extras.image = images[0].path;
  }

  try {
    let updateRes = await Testimonial.update(
      { id },
      {
        name,
        designation,
        comment,
        ...extras,
      }
    );
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not update testimonial.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Testimonial Updated Successfully",
  });
};

exports.delete = async (req, res, next) => {
  const { id } = req.body;

  try {
    let updateRes = await Testimonial.delete({ id });
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not deleted testimonial.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Testimonial Deleted Successfully",
    id
  });
};

exports.getAll = async (req, res, next) => {
  let { page, per_page, sort_by, order, name } = req.query;
  let testimonials;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  sort_by = sort_by ?? "id";
  order = order ?? "desc";
  name = name ?? "";

  try {
    testimonials = await Testimonial.getMany({
      match: {},
      page,
      per_page,
      sort_by,
      order,
      name,
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch testimonials.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Testimonials Fetched Successfully",
    testimonials: testimonials?.data,
    totalDocuments: testimonials?.totalDocuments,
  });
};

exports.getOne = async (req, res, next) => {
  const { id } = req.params;

  let testimonial;
  try {
    testimonial = await Testimonial.getOne({ id });
    if (!testimonial) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Could not fetch.",
        422
      );
      return next(error);
    }
    // console.log(testimonial);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Testimonial Fetched Successfully",
    testimonial,
  });
};
