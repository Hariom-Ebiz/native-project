const EmployerSubscriber = require("../models/employerSubscriber");
const EmployerSubscriptions = require("../models/employerSubscription");
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

    const { subscription_id } = req.body;
    const userId = req.userId;

    try {
        const getSubscription = await EmployerSubscriptions.getOne({id: subscription_id})
        if (getSubscription) {
            const isRenew = await EmployerSubscriber.getOne({employer_id: userId, subscription_id: subscription_id});

            let subscriberObj = {
                employer_id: userId,
                subscription_id: subscription_id,
                start: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                end: moment(new Date()).add("months", getSubscription.months).format("YYYY-MM-DD HH:mm:ss"),
                price: getSubscription.price,
                txn_id: Date.now(),
                is_renew: (isRenew) ? 1 : 0,
                unlock_cv_qty: getSubscription.unlock_cv_qty,
                created_at: dateTimeFormat(),
                updated_at: dateTimeFormat()
            }
            
            const subsciberCreate = await EmployerSubscriber.create(subscriberObj)
            if (subsciberCreate.status) {
                await Common.raw(`UPDATE company_profile SET unlock_qty = unlock_qty+${getSubscription.unlock_cv_qty} WHERE employer_id = '${userId}'`)

                const userDetails = await Common.raw("SELECT email, company_name FROM company_profile WHERE employer_id = '"+userId+"' LIMIT 1")

                const notification = new Notification("subscription", userId);
                await notification.formatTemplate({ SUBSCRIPTION_NAME: getSubscription.title})
                await notification.sendNotification([userId], "/employer/my-membership");

                let emailTemplate;
                try {
                  emailTemplate = await EmailTemplate.getOne({ name: "Subscription" });
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
                message = message.replace(/\{NAME\}/g, userDetails.data[0].company_name);
                message = message.replace(/\{POST_JOB_URL\}/g, process.env.FRONTEND_EMPLOYER_URL+"/employer/post-job");
                message = message.replace(/\{EMPLOYER_CONTACT_US\}/g, process.env.FRONTEND_EMPLOYER_URL+"/employer/contact-us");
                message = message.replace(/\{MEMBER_LIST_URL\}/g, process.env.FRONTEND_EMPLOYER_URL+"/employer/my-membership");
                message = message.replace(/\{EMPLOYER_URL\}/g, process.env.FRONTEND_EMPLOYER_URL);
                message = message.replace(/\{RENEW_PACKAGE_LINK\}/g, process.env.FRONTEND_EMPLOYER_URL+"/employer/expansion-renewal");
                message = message.replace(/\{SEARCH_CANDIDATE_URL\}/g, process.env.FRONTEND_EMPLOYER_URL+"/employer/search-cv");
          
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
      await Common.update("employer_subscriptions", {"is_recommanded": 1}, {"is_recommanded": 0})
    }

    let saveRes = await EmployerSubscriber.update({id}, {title, description, unlock_cv_qty, months, price, is_recommanded, save, benifiets: JSON.stringify(benifiets), updated_at: dateTimeFormat()});
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
    subscriptions = await EmployerSubscriber.getMany();
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
      subscriptions = await EmployerSubscriber.getAllByUsers();
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
    subscription = await EmployerSubscriber.getOne({ id });
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
  
        memershipList = (await EmployerSubscriber.getMyMemberships(user)).result;
  
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