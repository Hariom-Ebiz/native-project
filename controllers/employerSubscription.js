const EmployerSubscription = require("../models/employerSubscription");
const HttpError = require("../http-error");
const Common = require("../models/common");

const dateTimeFormat = require("../utils/dateTime.js");
const createSlug = (value) => value.toLowerCase().split(" ").join("-");

exports.update = async (req, res, next) => {
    const id = req.params.id;
  const { title, description, unlock_cv_qty, months, price, is_recommanded, save, benifiets, renew_discount } = req.body;

  try {
    if (is_recommanded == "1") {
      await Common.update("employer_subscriptions", {"is_recommanded": 1}, {"is_recommanded": 0})
    }

    let saveRes = await EmployerSubscription.update({id}, {title, description, unlock_cv_qty, months, price, is_recommanded, save, benifiets: JSON.stringify(benifiets), renew_discount, updated_at: dateTimeFormat()});
    // console.log(saveRes);
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
    message: "Subscription Updated Successfully",
  });
};

exports.getAll = async (req, res, next) => {
  let subscriptions = [];

  try {
    subscriptions = await EmployerSubscription.getMany();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch subscriptions.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Subscriptions Fetched Successfully",
    subscriptions: subscriptions?.data,
    totalDocuments: subscriptions?.totalDocuments,
  });
};

exports.getAllByUser = async (req, res, next) => {
    const id = req.userId;

    let subscriptions;
    try {
      subscriptions = await EmployerSubscription.getAllByUsers();
      if (!subscriptions) {
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
      message: "Subscriptions Fetched Successfully",
      subscriptions: subscriptions.data,
    });
}

exports.getOne = async (req, res, next) => {
  const { id } = req.params;

  let subscription;
  try {
    subscription = await EmployerSubscription.getOne({ id });
    if (!subscription) {
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
    message: "Subscription Fetched Successfully",
    subscription,
  });
};

exports.getBlocksByPage = async (req, res, next) => {
  const { page_slug } = req.params;
  const { lang } = req.query; 
  let blocks;
  let blockObj = {};

  try {
    blocks = await Block.getAllByPage(page_slug, lang);
    blocks = blocks?.record || [];

    blocks.forEach((val) => {
      blockObj[val.title_slug] = {
        page: val.page,
        page_slug: val.page_slug,
        title: val.language_title || val.title,
        title_slug: val.title_slug,
        image: val.image,
        description: val.language_description || val.description,
        // language_title: val.language_title,
        // language_description: val.language_description,
        language_id: val.language_id,
      };
    });

    // console.log(blocks);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch blocks.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Blocks Fetched Successfully",
    blocks: blockObj,
  });
};
