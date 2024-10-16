const NewsletterSubscriber = require("../models/newsletterSubscriber");
const HttpError = require("../http-error");
const dateTimeFormat = require("../utils/dateTime.js");
const Setting = require("../models/setting");
const EmailTemplate = require("../models/emailTemplate");
const { emailSend } = require("../utils/helper");

// exports.create = async (req, res, next) => {
//   const { email } = req.body;

//   try {
//     let isAlreadyExists = await NewsletterSubscriber.getOne({ email });
//     if (isAlreadyExists) {
//       const error = new HttpError(
//         req,
//         new Error().stack.split("at ")[1].trim(),
//         "This email is already subscribed to newsletter.",
//         422
//       );
//       return next(error);
//     }
//     let saveRes = await NewsletterSubscriber.create({
//       email,
//       created_at: dateTimeFormat(),
//       updated_at: dateTimeFormat(),
//     });
//     console.log(saveRes);
//   } catch (err) {
//     const error = new HttpError(
//       req,
//       new Error().stack.split("at ")[1].trim(),
//       "Could not submit the form.",
//       500
//     );
//     return next(error);
//   }

//   res.status(201).json({
//     status: true,
//     message: "Submitted Successfully",
//   });
// };
exports.create = async (req, res, next) => {
  const { email } = req.body;

  try {
    let isAlreadyExists = await NewsletterSubscriber.getOne({ email });
    if (isAlreadyExists) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "This email is already subscribed to newsletter.",
        422
      );
      return next(error);
    }
    let saveRes = await NewsletterSubscriber.create({
      email,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
    console.log(saveRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not submit the form.",
      500
    );
    return next(error);
  }

  try {
    subAdmin = await Setting.getOne({ key: "Contact.email" });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Something went wrong #a",
      500
    );
    return next(error);
  }

  let emailTemplate;
  try {
    emailTemplate = await EmailTemplate.getOne({ name: "Newsletter" });
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
  message = message.replace(/\{EMAIL\}/g, email);

  const subject = emailTemplate.subject;

  emailSend(
    null,
    next,
    subAdmin.value,
    subject,
    message,
    "Newsletter Subscriber Information"
  );

  res.status(201).json({
    status: true,
    message: "Submitted Successfully",
  });
};

exports.getAll = async (req, res, next) => {
  let { page, per_page, sort_by, order, email, dateFrom, dateTo } = req.query;
  let nlEmails;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  sort_by = sort_by ?? "created_at";
  order = order ?? "desc";
  email = email ?? "";

  let extras = {};

  if (sort_by) {
    if (sort_by == "email") {
      sort_by = "email";
    } else if (sort_by == "Requested On") {
      sort_by = "created_at";
    }
  }

  try {
    nlEmails = await NewsletterSubscriber.getMany({
      match: { ...extras },
      page,
      per_page,
      sort_by,
      order,
      email,
      dateFrom,
      dateTo,
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch emails.",
      500
    );
    return next(error);
  }

  // console.log("nlEmails?.data",nlEmails?.data)
  res.status(201).json({
    status: true,
    message: "Emails Fetched Successfully",
    subscribers: nlEmails?.data,
    totalDocuments: nlEmails?.totalDocuments,
  });
};
