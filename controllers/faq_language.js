const FAQLang = require("../models/faq_language");
const HttpError = require("../http-error");

const dateTimeFormat = require("../utils/dateTime.js");
const createSlug = (value) => value.toLowerCase().split(" ").join("-");

exports.create = async (req, res, next) => {
  const { category_id, question, answer, faq_id, language_id } = req.body;
  let extras = {
    created_at: dateTimeFormat(),
    updated_at: dateTimeFormat(),
  };

  try {
    let saveRes = await FAQLang.create({
      page,
      category_id, question, answer,
      ...extras,
      faq_id,
      language_id
    });
    // console.log(saveRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not create faq lang.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "FAQLang Created Successfully",
  });
};

exports.update = async (req, res, next) => {
  const { id, category_id, question, answer, language_id } = req.body;
  
  let extras = {
    updated_at: dateTimeFormat(),
  };

  let updateRes;
  try {

    const getISItAvail = await FAQLang.getOne({ faq_id: id, language_id });
    if (!getISItAvail) {
      updateRes = await FAQLang.create(
        {
          faq_id: id,
          language_id,
          category_id, question, answer,
          created_at: dateTimeFormat(),
          updated_at: dateTimeFormat(),
        }
      );
    } else {
      updateRes = await FAQLang.update(
        { faq_id: id, language_id },
        {
          category_id, question, answer,
          ...extras,
        }
      );
    }

  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not update faq lang.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "FAQLang Updated Successfully",
  });
};

exports.getAll = async (req, res, next) => {
  let { page, per_page, sort_by, order, question, language_id,category_id,role } = req.query;
  let faqs = [];

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  sort_by = sort_by ?? "id";
  order = order ?? "desc";
  question = question ?? "";
  language_id = language_id ?? 2;

  try {
    faqs = await FAQLang.getMany({
      match: {language_id},
      page,
      per_page,
      sort_by,
      order,
      question,
      category_id,
      role
    });
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

  res.status(201).json({
    status: true,
    message: "Faqs Fetched Successfully",
    faqs: faqs?.data,
    totalDocuments: faqs?.totalDocuments,
  });
};

exports.getOne = async (req, res, next) => {
  const { faq_id, language_id } = req.params;

  let faq_lang;
  try {
    faq_lang = await FAQLang.getOne({ faq_id, language_id });
    if (!faq_lang) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Could not fetch.",
        422
      );
      return next(error);
    }
    // console.log(faq_lang);
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
    message: "FAQ Lang Fetched Successfully",
    faq: faq_lang,
  });
};

exports.getFaqsByPage = async (req, res, next) => {
  const { page_slug } = req.params;
  let faqs;
  let faqObj = {};

  try {
    faqs = await FAQLang.getAllByPage(page_slug);
    faqs = faqs?.record || [];

    faqs.forEach((val) => {
      faqObj[val.category_id] = {
        question: val.question,
        answer: val.answer,
        category_id: val.category_id,
      };
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

  res.status(201).json({
    status: true,
    message: "Faqs Fetched Successfully",
    faqs: faqObj,
  });
};
