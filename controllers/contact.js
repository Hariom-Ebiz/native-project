const Contact = require("../models/contact");
const HttpError = require("../http-error");
const dateTimeFormat = require("../utils/dateTime.js");
const EmailTemplate = require("../models/emailTemplate");
const Setting = require("../models/setting");

const { emailSend } = require("../utils/helper");

// exports.create = async (req, res, next) => {
//   const { name, email, company_name, company_size, question } = req.body;

//   try {
//     let saveRes = await Contact.create({
//       name,
//       email,
//       company_name,
//       company_size,
//       question,
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
//     message: "Request submitted successfully.",
//   });
// };

exports.create = async (req, res, next) => {
  const { name, email, company_name, company_size, question } = req.body;

  try {
    let saveRes = await Contact.create({
      name,
      email,
      company_name,
      company_size,
      question,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
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
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Something went wrong #a",
      500
    );
    return next(error);
  }
  //

  let emailTemplate;
  try {
    emailTemplate = await EmailTemplate.getOne({ name: "Contact Us" });
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
  message = message.replace(/\{NAME\}/g, name);
  message = message.replace(/\{EMAIL\}/g, email);
  message = message.replace(/\{COMPANY_NAME\}/g, company_name);
  message = message.replace(/\{COMPANY_SIZE\}/g, company_size);
  message = message.replace(/\{QUESTION\}/g, question);

  const subject = emailTemplate.subject;

  emailSend(
    "",
    next,
    subAdmin.value,
    subject,
    message,
    "Contact Us Information"
  );

  return res.status(201).json({
    status: true,
    message: "Request submitted successfully.",
  });
};

exports.getAll = async (req, res, next) => {
  let {
    page,
    per_page,
    sort_by,
    order,
    name,
    email,
    question,
    dateFrom,
    dateTo,
  } = req.query;
  let contacts;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  sort_by = sort_by ?? "created_at";
  order = order ?? "desc";
  name = name ?? "";
  email = email ?? "";
  question = question ?? "";

  let extras = {};

  if (sort_by) {
    if (sort_by == "name") {
      sort_by = "name";
    } else if (sort_by == "email") {
      sort_by = "email";
    } else if (sort_by == "question") {
      sort_by = "question";
    } else if (sort_by == "Requested On") {
      sort_by = "created_at";
    }
  }

  try {
    contacts = await Contact.getMany({
      match: { ...extras },
      page,
      per_page,
      sort_by,
      order,
      name,
      email,
      question,
      dateFrom,
      dateTo,
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch contacts.",
      500
    );
    return next(error);
  }

  // console.log("contacts?.data",contacts?.data)
  res.status(201).json({
    status: true,
    message: "Contacts Fetched Successfully",
    contacts: contacts?.data,
    totalDocuments: contacts?.totalDocuments,
  });
};

exports.getOne = async (req, res, next) => {
  const { id } = req.params;

  let contact;
  try {
    contact = await Contact.getOne({ id });
    if (!contact) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Could not fetch.",
        422
      );
      return next(error);
    }
    // console.log(contact);
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
    message: "Contact Fetched Successfully",
    contact,
  });
};

exports.sendReply = async (req, res, next) => {
  const { id, reply } = req.body;

  let replyRes, email;
  try {
    replyRes = await Contact.update({ id }, { reply, is_replied: 1 });
    email = await Contact.getOne({ id });
    email = email.email || null;

    if (!replyRes || !replyRes.status || !email) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Could not send the reply.",
        500
      );
      return next(error);
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not send the reply.",
      500
    );
    return next(error);
  }

  let emailTemplate;
  try {
    emailTemplate = await EmailTemplate.getOne({ name: "Contact Us Reply" });
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
  message = message.replace(/\{REPLY\}/g, reply);
  const subject = emailTemplate.subject;

  emailSend(res, next, email, subject, message, {
    mailSend: 1,
  });
};
