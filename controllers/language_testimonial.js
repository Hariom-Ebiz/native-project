const Testimonial = require("../models/testimonial_language");
const emp_testimonial = require("../models/emp_language_testimonial");
const HttpError = require("../http-error");

const dateTimeFormat = require("../utils/dateTime.js");
const createSlug = (value) => value.toLowerCase().split(" ").join("-");

exports.create = async (req, res, next) => {
  const { page, designation, comment, testimonial_id, language_id } = req.body;
  let extras = {
    created_at: dateTimeFormat(),
    updated_at: dateTimeFormat(),
  };
  let images = req.files;
  if (images && images.length > 0) {
    extras.image = images[0].path;
  }

//   extras.page_slug = createSlug(page);
//   extras.title_slug = createSlug(title);

  try {
    let saveRes = await Testimonial.create({
      page,
      designation,
      comment,
      ...extras,
      testimonial_id,
        language_id
    });
    // console.log(saveRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not create block.",
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
  const { id, page, designation, comment, language_id } = req.body;
  let extras = {
    updated_at: dateTimeFormat(),
  };
  let images = req.files;
  if (images && images.length > 0) {
    extras.image = images[0].path;
  }

//   extras.page_slug = createSlug(page);
//   extras.title_slug = createSlug(title);

  let updateRes;
  try {

    const getISItAvail = await Testimonial.getOne({testimonial_id: id, language_id});
    if (!getISItAvail) {
        updateRes = await Testimonial.create(
            {
                testimonial_id: id,
                language_id,
                designation, 
                comment,
                created_at: dateTimeFormat(),
                updated_at: dateTimeFormat(),
            }
        );
    } else {
        updateRes = await Testimonial.update(
            { testimonial_id: id, language_id },
            {
              designation,
              comment,
              ...extras,
            }
          );
    }

  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not update block.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Testimonial Updated Successfully",
  });
};

exports.updateEmployer = async (req, res, next) => {
    const { id, page, designation, comment, language_id } = req.body;
    let extras = {
      updated_at: dateTimeFormat(),
    };
    let images = req.files;
    if (images && images.length > 0) {
      extras.image = images[0].path;
    }
  
    // extras.page_slug = createSlug(page);
  //   extras.title_slug = createSlug(title);
  
    let updateRes;
    try {
      const getISItAvail = await emp_testimonial.getOne({testimonial_id: id, language_id});
      if (!getISItAvail) {
          updateRes = await emp_testimonial.create(
              {
                  testimonial_id: id,
                  language_id,
                  designation, 
                  comment,
                  created_at: dateTimeFormat(),
                  updated_at: dateTimeFormat(),
              }
          );
      } else {
          updateRes = await emp_testimonial.update(
              { testimonial_id: id, language_id },
              {
                designation,
                comment,
                ...extras,
              }
            );
      }
  
    } catch (err) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Could not update block.",
        500
      );
      return next(error);
    }
  
    res.status(201).json({
      status: true,
      message: "Testimonial Updated Successfully",
    });
};


exports.getOne = async (req, res, next) => {
  const { testimonial_id, language_id } = req.params;

  let testimonial;
  try {
    testimonial = await Testimonial.getOne({ testimonial_id, language_id });
    if (!testimonial) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Could not fetch.",
        422
      );
      return next(error);
    }
    // console.log(block);
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

exports.getOneEmployer = async (req, res, next) => {
    const { testimonial_id, language_id } = req.params;
  
    let testimonial;
    try {
        testimonial = await emp_testimonial.getOne({ testimonial_id, language_id });
      if (!testimonial) {
        const error = new HttpError(
          req,
          new Error().stack.split("at ")[1].trim(),
          "Could not fetch.",
          422
        );
        return next(error);
      }
      // console.log(block);
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

