const ejs = require("ejs");
const nodemailer = require("nodemailer");
const fetch = require("node-fetch");
const moment = require("moment");

const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const fs = require("fs");
const { promises: promiseFS } = require("fs");
const path = require("path");
const mongoose = require("mongoose");
// const pdf = require("html-pdf");
const Promise = require("bluebird");
const NodeGeocoder = require("node-geocoder");
const bcrypt = require("bcryptjs");

const EmailLog = require("../models/emailLog");
const HttpError = require("../http-error");

const PORT = process.env.PORT;

let MONGODB_URI;

if (process.env.ENABLE_PAID_FEATURES == "false") {
  const DB_NAME =
    PORT === "3063" ? process.env.DB_NAME_PROD : process.env.DB_NAME_DEV;

  MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hrdxm.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&&serverSelectionTimeoutMS=30000`;
} else {
  const DB_NAME =
    PORT === "3000" ? process.env.DB_NAME_PROD : process.env.DB_NAME_DEV;

  MONGODB_URI = `mongodb://${process.env.DB_USER_LIVE}:${process.env.DB_PASS_LIVE}@10.129.95.152:27017/${DB_NAME}?directConnection=true&serverSelectionTimeoutMS=2000&authSource=yogmitraDb`;
}

const geoOptions = {
  provider: "google",

  // Optional depending on the providers
  apiKey: "AIzaSyB72Nrng-_q3STWQuss1Lj7hLnNEmC6350", // for Mapquest, OpenCage, Google Premier
  formatter: null, // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(geoOptions);

const decodeEntities = (encodedString) => {
  var translate_re = /&(nbsp|amp|quot|lt|gt);/g;
  var translate = {
    nbsp: " ",
    amp: "&",
    quot: '"',
    lt: "<",
    gt: ">",
  };
  return encodedString
    .replace(translate_re, function (match, entity) {
      return translate[entity];
    })
    .replace(/&#(\d+);/gi, function (match, numStr) {
      var num = parseInt(numStr, 10);
      return String.fromCharCode(num);
    });
};

const emailSend = (
  res,
  next,
  to,
  subject,
  html,
  dataToSend,
  mailDataObj = {},
  from = null
) => {
  html = html.replace(/\{BACKEND_URL\}/g, process.env.BACKEND_URL);
  html = decodeEntities(html);
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: from || `Native <${process.env.MAIL_FROM}>`,
    // from: "noreply@obdemo.com",
    to,
    subject,
    html,
    attachDataUrls: true,
    ...mailDataObj,
  };

  transporter.sendMail(mailOptions, async (err, info) => {
    let isError = false;
    if (err) {
      console.log(err);
      isError = true;
      const error = new HttpError(
        { get: () => {} },
        new Error().stack.split("at ")[1].trim(),
        "Something went wrong while sending email #a",
        500
      );
      return next(error);
    }
    // console.log("Info: ", info);

    try {
      let logSaveRes = await EmailLog.create({
        email_to: to,
        email_from: process.env.MAIL_FROM,
        subject,
        message: html,
      });
      // console.log(logSaveRes);
    } catch (err) {
      const error = new HttpError(
        { get: () => {} },
        new Error().stack.split("at ")[1].trim(),
        "Something went wrong #b",
        500
      );
      return next(error);
    }

    if (mailDataObj && Object.keys(mailDataObj).length > 0) {
      // removePdf(mailDataObj.attachments[0].path);
    }

    if(res) {
      return res.status(200).json({
        status: true,
        message: "Email successfully sent.",
        ...dataToSend,
      });
    }
    
  });
};

const emailSendIndividually = (
  to,
  subject,
  html,
  dataToSend,
  mailDataObj = {},
  from = null
) => {
  html = html.replace(/\{BACKEND_URL\}/g, process.env.BACKEND_URL);
  html = decodeEntities(html);
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: from || `Native <${process.env.MAIL_FROM}>`,
    // from: "noreply@obdemo.com",
    to,
    subject,
    html,
    attachDataUrls: true,
    ...mailDataObj,
  };

  transporter.sendMail(mailOptions, async (err, info) => {
    let isError = false;
    if (err) {
      console.log(err);
      isError = true;
      const error = new HttpError(
        { get: () => {} },
        new Error().stack.split("at ")[1].trim(),
        "Something went wrong while sending email #a",
        500
      );
      return {message: new Error(err).message, status: false};
    }
    // console.log("Info: ", info);

    try {
      let logSaveRes = await EmailLog.create({
        email_to: to,
        email_from: process.env.MAIL_FROM,
        subject,
        message: html,
      });
      // console.log(logSaveRes);
    } catch (err) {
      const error = new HttpError(
        { get: () => {} },
        new Error().stack.split("at ")[1].trim(),
        "Something went wrong #b",
        500
      );
      return {message: new Error(err).message, status: false};
    }


    return {message: "Email Send", status: true};
    
  });
};

const emailSendInLoop = async (next, to, subject, html) => {
  html = html.replace(/\{BACKEND_URL\}/g, process.env.BACKEND_URL);
  html = decodeEntities(html);

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `Native <${process.env.MAIL_FROM}>`,
    to,
    subject,
    html,
    attachDataUrls: true,
  };

  transporter.sendMail(mailOptions, async (err, info) => {
    let isError = false;
    if (err) {
      isError = true;
      console.log("1", err);
    }

    if (isError) {
      return;
    }

    try {
      await EmailLog.create({
        email_to: to,
        email_from: process.env.MAIL_FROM,
        subject,
        message: html,
      });
    } catch (err) {
      console.log("2", err);
    }
  });
};

const fileUpload = (file, folderName) => {
  if (file == undefined) {
    return "";
  } else {
    var img = file;
    var fileName = img.name.split(".");
    var ext = fileName.pop();
    var splitName = fileName.join("");
    var uniqueName = (splitName + "-" + Date.now() + "." + ext)
      .split(" ")
      .join("_");
    var filePath = "uploads/images/" + folderName + "/" + uniqueName;

    img.mv(filePath, (err) => {
      if (err) {
        console.log("err", err);
        return false;
      }
    });
    return filePath;
  }
};

const reduxSettingData = [
  "Reading.records_per_page",
  "Reading.date_format",
  "Reading.date_time_format",
  "Site.title",
  "Site.copyright",
];

const hashPass = async (password) => {
  const salt = await bcrypt.genSalt(12);
  const hashedPass = await bcrypt.hash(password, salt);
  return hashedPass;
};

const matchPass = async (password, passwordInDb) => {
  let bool = await bcrypt.compare(password, passwordInDb);
  return bool;
};

const ErrorMessageHandler = (Err = []) => {
  const Errors = {};
  let message = "";
  Err.forEach((el, index) => {
    if (!Errors[el.param]) {
      Errors[el.param] = [el.msg];
      message += `${el.msg} ${Err.length - 1 !== index ? ", " : ""}`;
    }
  });
  return { Errors, message };
};

const defaultProfileImage = "uploads/images/profile-pictures/no.jpeg";

const uniqueIdMaker = (num, code) => {
  let d = new Date();
  let milli = d.getMilliseconds();
  let uniqueNumber = "" + Math.ceil(Math.random() * 100) + num + milli;

  let len = uniqueNumber.toString().length;
  let str = "";
  for (let i = 1; i <= 10 - len; i++) {
    str += "0";
  }
  str += uniqueNumber;
  id = `${code}${str}`;
  return id;
};

const generateCustomToken = (data, expiresIn) => {
  return jwt.sign(data, process.env.JWT, {
    expiresIn: expiresIn ? expiresIn : "360d",
  });
};

const getDateAfterXMonth = (fromDate, numberOfMonths) => {
  let currentDate = moment(fromDate, "YYYY-MM-DD hh:mm:ss");
  let futureMonth = moment(currentDate).add(numberOfMonths, "M");
  let futureMonthEnd = moment(futureMonth).endOf("month");

  if (
    currentDate.date() != futureMonth.date() &&
    futureMonth.isSame(futureMonthEnd.format("YYYY-MM-DD"))
  ) {
    futureMonth = futureMonth.add(1, "d");
  }

  return moment(futureMonth).format("YYYY-MM-DD hh:mm:ss");
};

// const getHeighestQualification = async (qualificationsArray, dataArray) => {
//   let top = null;
//   let qualifications = qualificationsArray.map((v) => v.id);
//   let qualificationTypes;
//   if (dataArray && dataArray.length > 0) {
//     qualificationTypes = dataArray;
//   } else {
//     try {
//       qualificationTypes = await Lookup.getInDescending("qualificationType");
//       qualificationTypes = qualificationTypes.record || [];
//     } catch (err) {
//       return top;
//     }
//   }

//   for (let i = 0; i < qualificationTypes.length; i++) {
//     if (qualifications.includes(qualificationTypes[i].id)) {
//       top = qualificationTypes[i];
//       break;
//     }
//   }

//   return top;
// };

// const getTotalExperience = (experiences) => {
//   let expInDays = 0;
//   let expInMonths = 0;
//   let expInYears = 0;

//   experiences.forEach((val) => {
//     if (val.i_currently_work_here === "yes") {
//       let diff = moment().diff(moment(val.start_date), "days");
//       expInDays += Math.abs(diff);
//     } else {
//       let diff = moment(val.end_date).diff(moment(val.start_date), "days");
//       expInDays += Math.abs(diff);
//     }
//   });

//   expInMonths = Math.floor(expInDays / 30);
//   expInDays = expInDays % 30;
//   expInYears = Math.floor(expInMonths / 12);
//   expInMonths = expInMonths % 12;

//   return {
//     year: expInYears || 0,
//     month: expInMonths || 0,
//     day: expInDays || 0,
//   };
// };

// const emailNotification = async (
//   to,
//   subject,
//   html,
//   dataToSend,
//   mailDataObj = {}
// ) => {
//   html = html.replace(/\{BACKEND_URL\}/g, process.env.BACKEND_URL);
//   html = decodeEntities(html);

//   const transporter = nodemailer.createTransport({
//     host: process.env.MAIL_HOST,
//     port: process.env.MAIL_PORT,
//     auth: {
//       user: process.env.MAIL_USER,
//       pass: process.env.MAIL_PASSWORD,
//     },
//   });

//   const mailOptions = {
//     from: process.env.MAIL_FROM,
//     // from: "noreply@obdemo.com",
//     to,
//     subject,
//     html,
//     attachDataUrls: true,
//     ...mailDataObj,
//   };

//   transporter.sendMail(mailOptions, async (err, info) => {
//     let isError = false;
//     if (err) {
//       console.log(err);
//       isError = true;
//       const error = new HttpError(
//         { get: () => {} },
//         new Error().stack.split("at ")[1].trim(),
//         "Something went wrong while sending email #a",
//         500
//       );
//       return next(error);
//     }
//     // console.log("Info: ", info);

//     if (isError) {
//       return;
//     }

//     try {
//       let logSaveRes = await EmailLog.create({
//         email_to: to,
//         email_from: process.env.MAIL_FROM,
//         subject,
//         message: html,
//       });
//       // console.log(logSaveRes);
//     } catch (err) {
//       console.log(err);
//       const error = new HttpError(
//         { get: () => {} },
//         new Error().stack.split("at ")[1].trim(),
//         "Something went wrong #b",
//         500
//       );
//       return next(error);
//     }
//   });
// };

// const textNotification = async ({
//   title,
//   description,
//   user_id,
//   redirect_link,
//   sender_id,
//   type,
// }) => {
//   try {
//     await Notification.create({
//       title,
//       description,
//       user_id,
//       redirect_link,
//       sender_id,
//       type,
//     });
//   } catch (err) {
//     return false;
//   }
// };

// const sendNotification = async (templateName, data, actions) => {
//   let emailTemplate, notificationTemplate;

//   try {
//     // fetching email template -------
//     emailTemplate = await EmailTemplate.getOne({ name: templateName });
//     if (emailTemplate) {
//       let message = emailTemplate.body;
//       for (let i = 0; i < actions.length; i++) {
//         message = message.replace(`{${actions[i]}}`, data[actions[i]]);
//       }
//       const subject = emailTemplate.subject;
//       await emailNotification(data.to, subject, message);
//     }

//     // fetching notification template -------
//     notificationTemplate = await NotificationTemplate.getOne({
//       name: templateName,
//     });
//     if (notificationTemplate) {
//       let description = notificationTemplate.description;
//       for (let i = 0; i < actions.length; i++) {
//         description = description.replace(`{${actions[i]}}`, data[actions[i]]);
//       }
//       await textNotification({
//         title: notificationTemplate.title,
//         description,
//         user_id: data.user_id,
//         redirect_link: data.redirect_link,
//         sender_id : data.sender_id,
//         type : data.type
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     return false;
//   }
// };

const frontEndPublicSettings = [
  "title",
  "date_time_format",
  "records_per_page",
  "date_format",
  "copyright",
  "from_email",
  "twitter",
  "instagram",
  "facebook",
  "linkedin",
  "phone",
  "email",
  "address",
  "google_map_iframe_src",
];

module.exports = {
  emailSend,
  decodeEntities,
  reduxSettingData,
  fileUpload,
  // MONGODB_URI,
  hashPass,
  matchPass,
  ErrorMessageHandler,
  uniqueIdMaker,
  generateCustomToken,
  getDateAfterXMonth,
  frontEndPublicSettings,
  // getHeighestQualification,
  // getTotalExperience,
  // sendNotification,
  emailSendInLoop,
  emailSendIndividually
};
