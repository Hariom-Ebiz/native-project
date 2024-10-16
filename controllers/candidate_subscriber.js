const CandidateSubscriber = require("../models/candidate_subscriber");
const CandidateSubscriptions = require("../models/candidateSubscription");
const HttpError = require("../http-error");
const Common = require("../models/common");
const EmailTemplate = require("../models/emailTemplate")

const dateTimeFormat = require("../utils/dateTime.js");
const moment = require("moment");
const createSlug = (value) => value.toLowerCase().split(" ").join("-");
const Notification = require("../utils/notification.js")

const {
  emailSend,
  ErrorMessageHandler,
  hashPass,
  matchPass,
} = require("../utils/helper");

exports.create = async (req, res, next) => {

  const { subscription_id, course_type, sub_course_type } = req.body;
  const userId = req.userId;

  try {
    const getSubscription = await CandidateSubscriptions.getOne({ id: subscription_id })
    if (getSubscription) {
      const isRenew = await CandidateSubscriber.getOne({ employer_id: userId, subscription_id: subscription_id });


      let isSuccess = true;
      if (Array.isArray(sub_course_type)) {
        for await (const sct of sub_course_type) {
          let subscriberObj = {
            job_seeker_id: userId,
            subscription_id: subscription_id,
            start: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            end: moment(new Date()).add("months", getSubscription.months).format("YYYY-MM-DD HH:mm:ss"),
            price: getSubscription.price,
            txn_id: Date.now(),
            is_renew: (isRenew) ? 1 : 0,
            course_type: course_type,
            sub_course_type: sct || null,
            created_at: dateTimeFormat(),
            updated_at: dateTimeFormat()
          }

          const subsciberCreate = await CandidateSubscriber.create(subscriberObj)
          if (!subsciberCreate.status) {
            isSuccess = false;
          }
        }
      } else {
        let subscriberObj = {
          job_seeker_id: userId,
          subscription_id: subscription_id,
          start: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          end: moment(new Date()).add("months", getSubscription.months).format("YYYY-MM-DD HH:mm:ss"),
          price: getSubscription.price,
          txn_id: Date.now(),
          is_renew: (isRenew) ? 1 : 0,
          course_type: course_type,
          sub_course_type: null,
          created_at: dateTimeFormat(),
          updated_at: dateTimeFormat()
        }

        const subsciberCreate = await CandidateSubscriber.create(subscriberObj)
        if (!subsciberCreate.status) {
          isSuccess = false;
        }
      }


      if (isSuccess) {

        const userDetails = await Common.raw("SELECT email, first_name FROM users WHERE id = '" + userId + "' LIMIT 1")

        const notification = new Notification("subscription", userId);
        await notification.formatTemplate({ SUBSCRIPTION_NAME: getSubscription.title })
        await notification.sendNotification([userId], "/job-seeker/my-membership");

        let subscribedCourseLink = (getSubscription.course_type == "career_coaching") ? "/course?query=true" : (getSubscription.course_type == "standout") ? "/standout?query=true" : (getSubscription.course_type == "functional_mastery") ? "/functional-mastery?query=true" : "";

        let emailTemplate;
        try {
          emailTemplate = await EmailTemplate.getOne({ name: "Candidate Subscription" });
        } catch (err) {
          const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Something went wrong #b",
            500
          );
          return next(error);
        }
        let message = emailTemplate.body;
        message = message.replace(/\{NAME\}/g, userDetails.data[0].first_name);
        message = message.replace(/\{CANDIDATE_CONTACT_US\}/g, process.env.FRONTEND_CANDIDATE_URL + "/contact-us");
        message = message.replace(/\{MEMBER_LIST_URL\}/g, process.env.FRONTEND_CANDIDATE_URL + "/job-seeker/my-membership");
        message = message.replace(/\{RENEW_PACKAGE_LINK\}/g, process.env.FRONTEND_CANDIDATE_URL + "/job-seeker/expansion-renewal");
        message = message.replace(/\{CANDIDATE_URL\}/g, process.env.FRONTEND_CANDIDATE_URL);
        message = message.replace(/\{LINK_SUBSCRIBED_COURSE\}/g, process.env.FRONTEND_CANDIDATE_URL + subscribedCourseLink);

        const subject = emailTemplate.subject;

        emailSend(null, next, userDetails.data[0].email, subject, message, {
          mailSend: 1,
        });
      } else {
        const error = new HttpError(
          req,
          new Error().stack.split("at ")[1].trim(),
          "Error occured during Subscription.",
          400
        );
        return next(error);
      }
    } else {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Subscription Not Found.",
        400
      );
      return next(error);
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not create subscriptions.",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Subscriptions created Successfully",
    subscriptions: subscription_id,
  });
}

exports.update = async (req, res, next) => {
  const id = req.params.id;
  const { title, description, unlock_cv_qty, months, price, is_recommanded, save, benifiets } = req.body;

  try {
    if (is_recommanded == "1") {
      await Common.update("employer_subscriptions", { "is_recommanded": 1 }, { "is_recommanded": 0 })
    }

    let saveRes = await CandidateSubscriber.update({ id }, { title, description, unlock_cv_qty, months, price, is_recommanded, save, benifiets: JSON.stringify(benifiets), updated_at: dateTimeFormat() });
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
    subscriptions = await CandidateSubscriber.getMany();
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
    subscriptions = await CandidateSubscriber.getAllByUsers();
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
    subscription = await CandidateSubscriber.getOne({ id });
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

exports.getMyMemberships = async (req, res, next) => {
  const user = req.userId;

  let memershipList = [];

  try {

    memershipList = (await CandidateSubscriber.getMyMemberships(user)).result;

    // console.log(blocks);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch membership list.",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Membership list fetched successfully.",
    memershipList,
  });
}