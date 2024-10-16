const Faq = require("../models/faq");
const Language = require("../models/language");
const FAQLanguage = require("../models/faq_language");
const HttpError = require("../http-error");
const { validationResult } = require("express-validator");
const {
  ErrorMessageHandler,
} = require("../utils/helper");
const dateTimeFormat = require("../utils/dateTime.js");
const moment = require("moment");

exports.create = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const Err = errors.array();
    const { Errors, message } = ErrorMessageHandler(Err);
    return res
      .status(422)
      .json({ status: false, data: {}, errors: Errors, message });
  }

  const { category_id, question, answer, role} = req.body;

  if (!category_id && !question && !answer && !role) {
    return res
      .status(400)
      .json({ status: false, data: {}, errors: "Bad request", message: "Bad request" });
  }

  try {
    await Faq.create({
      category_id,
      question,
      answer,
      role,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
    

    // creating blocks for other languages
    const languageList = await Language.getAll({});
    if (Array.isArray(languageList)) {
      for await (const lang of languageList) {
        FAQLanguage.create({
          category_id: category_id,
          question: "",
          answer: "",
          role: role,
          faq_id: saveRes.data[0],
          language_id: lang.id,
          created_at: dateTimeFormat(),
          updated_at: dateTimeFormat(),
        })
      }
    }

  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Something went wrong",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "FAQ created Successfully",
  });
};

exports.getAll = async (req, res, next) => {
  let { page, per_page, sort_by, order, question, is_active, category_id, role } = req.query;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 1;
  sort_by = sort_by ?? "created_at";
  order = order ?? "desc";
  question = question ?? "";

  let faqs;

  try {
    faqs = await Faq.getMany({
      page,
      question,
      is_active,
      per_page,
      sort_by,
      order,
      role,
      category_id
    });
    // console.log(faqs);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch faqs.",
      500
    );
    return next(error);
  }


  res.status(200).json({
    status: true,
    message: "Faqs Fetched successfully.",
    faqs: faqs?.data,
    totalDocuments: faqs?.totalDocuments,
  });
};

exports.delete = async (req, res, next) => {
  const { id } = req.body;

  try {
    let delRes = await Faq.delete({ id });
    // console.log(delRes);
  } catch (err) {
    console.log(err);
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
    message: "FAQ deleted Successfully",
    id,
  });
};

exports.getOne = async (req, res, next) => {
  const { id } = req.params;

  let faq;

  try {
    faq = await Faq.getOne({ id });
    // console.log(faq);
  } catch (err) {
    onsole.log(err);
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
    message: "FAQ fetched successfully",
    faq,
  });
};

exports.update = async (req, res, next) => {
  const { category_id, question, answer,  id } = req.body;

  try {
    let updateRes = await Faq.update(
      { id },
      {
        category_id,
        question,
        answer,
        
        // updated_at: moment().format("YYYY-MM-DD hh:mm:ss"),
        updated_at: dateTimeFormat(),
      }
    );
    // console.log(updateRes);
  } catch (err) {
    console.log(err);
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
    message: "FAQ updated successfully",
    // updateRes
  });
};

exports.changeStatus = async (req, res, next) => {
  const { id, status } = req.body;

  try {
    await Faq.update(
      { id },
      {
        is_active: status,
        updated_at: moment().format("YYYY-MM-DD hh:mm:ss"),
      }
    );
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
    message: "FAQ's status changed successfully.",
    id,
    newStatus: status,
  });
};

exports.getCaetgoryByRole = async (req, res, next) => {
  const { page, per_page, sort_by, order, is_active, role } = req.query;

  let categories;
  try {
    categories = await Faq.getCategoryByRole({page, per_page, sort_by, order, is_active, role});
  } catch (err) {
    console.log(err);
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
    message: "FAQ category fetched successfully",
    categories: categories.data
    // updateRes
  });
}

exports.likeOrDislike = async (req, res, next) => {
  const { id, isLike, isDislike } = req.body;
  try {
    await Faq.likeOrDislike(
      { 
        id, 
        isLike, 
        isDislike,
        updated_at: moment().format("YYYY-MM-DD hh:mm:ss"),
      }
    );
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
    message: "FAQ's status changed successfully.",
    id
  });
};