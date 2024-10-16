const { validationResult } = require("express-validator");
const RandExp = require("randexp");
const moment = require("moment");
const User = require("../models/user");
const HttpError = require("../http-error");
const EmailTemplate = require("../models/emailTemplate");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const JobSeekerDetail = require("../models/jobSeekerDetail");
const JobSeekerCv = require("../models/jobSeekerCv");
const Common = require("../models/common");

const {
  emailSend,
  MASTER_CURRENCY,
  ErrorMessageHandler,
  hashPass,
  generateCustomToken,
  emailSendInLoop,
} = require("../utils/helper");
const dateTimeFormat = require("../utils/dateTime.js");
const generateToken = require("../utils/generateToken");

const randexp = new RandExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/);
randexp.max = 10;
randexp.defaultRange.subtract(32, 47);
randexp.defaultRange.subtract(58, 63);
randexp.defaultRange.subtract(91, 96);
randexp.defaultRange.subtract(123, 126);

const EMAIL_VALIDATION =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

exports.create = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const Err = errors.array();
    const { Errors, message } = ErrorMessageHandler(Err);
    return res
      .status(422)
      .json({ status: false, data: {}, errors: Errors, message });
  }

  // console.log("BODY", JSON.stringify(req.body));

  let {
    // required ---
    first_name,
    last_name,
    email,
    password,
    gender,
    status,
    lives_in,
    yob,
  } = req.body;

  let profile_picture = null;
  let images = req.files;

  if (images && images.length > 0) {
    profile_picture = images[0].path;
  }

  try {
    let isExists = await User.getOne({
      email,
      is_deleted: 0,
    });


    if (isExists.isActive) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Email already exists",
        500
      );
      return next(error);
    }

    let hashed_pass = await hashPass(password);

    // user table
    let saveRes = await User.create({
      first_name,
      last_name,
      email,
      password: hashed_pass,
      user_role_id: 1,
      is_email_verified: 1,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
    console.log("user save response", saveRes);

    if (!saveRes?.status) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "User creation failed #a",
        500
      );
      return next(error);
    }

    let detailRes = await JobSeekerDetail.create({
      job_seeker_id: saveRes.data[0],
      profile_picture,
      gender,
      status,
      lives_in,
      yob,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
    console.log("detail save response", detailRes);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "User creation failed #a",
      500
    );
    return next(error);
  }

  let emailTemplate;
  try {
    emailTemplate = await EmailTemplate.getOne({ name: "User Creation" });
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
  message = message.replace(/\{LOGIN_LINK\}/g, `${process.env.FRONTEND_URL}`);
  message = message.replace(/\{USER_NAME\}/g, first_name + " " + last_name);
  message = message.replace(/\{FIRST_NAME\}/g, first_name + " " + last_name);
  message = message.replace(/\{EMAIL\}/g, email);
  message = message.replace(/\{PASSWORD\}/g, password);

  const subject = emailTemplate.subject;

  emailSend(res, next, email, subject, message, {
    mailSend: 1,
  });
};

exports.getAll = async (req, res, next) => {
  let {
    page,
    is_active,
    first_name,
    last_name,
    email,
    per_page,
    sort_by,
    order,
    dateFrom,
    dateTo,
  } = req.query;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 1;
  sort_by = sort_by ?? "id";
  order = order ?? "desc";
  first_name = first_name ?? "";
  last_name = last_name ?? "";
  email = email ?? "";
  is_active = is_active ?? "";

  let users, jobSeekerCv, list;
  let jobSeekerCvObj = {};
  if (sort_by) {
    if (sort_by == "first name") {
      sort_by = "users.first_name";
    } else if (sort_by == "last name") {
      sort_by = "users.last_name";
    } else if (sort_by == "status") {
      sort_by = "users.is_active";
    } else {
      sort_by = `users.${sort_by}`;
    }
  }

  try {
    users = await User.getMany({
      match: {
        "users.is_deleted": 0,
      },
      page,
      is_active,
      first_name,
      last_name,
      email,
      per_page,
      sort_by,
      order,
      dateFrom,
      dateTo,
    });

    jobSeekerCv = await JobSeekerCv.getAll({});
    jobSeekerCv.forEach((elem) => {
      jobSeekerCvObj[elem.job_seeker_id] = elem;
    });

    list =
      users?.data?.record?.map((elem) => {
        let step_1 = jobSeekerCvObj?.[elem.id]?.step_1;
        let step_2 = jobSeekerCvObj?.[elem.id]?.step_2;
        let step_3 = jobSeekerCvObj?.[elem.id]?.step_3;
        let step_4 = jobSeekerCvObj?.[elem.id]?.step_4;

        if (step_1 && step_2 && step_3 && step_4) {
          elem.isAvailableForDownload = true;
        } else {
          elem.isAvailableForDownload = false;
        }
        return elem;
      }) || [];
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "User fetching failed #a",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "User Fetched Successfully",
    users: list,
    totalDocuments: users?.data?.totalRecords,
  });
};

exports.changeStatus = async (req, res, next) => {
  const { id, status } = req.body;

  try {
    let updateRes = await User.update(
      { id },
      {
        is_active: +status,
        updated_at: dateTimeFormat(),
      }
    );
    // console.log(updateRes);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not change user's status",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "User's status changed successfully.",
    id,
    newStatus: status,
  });
};

exports.getOne = async (req, res, next) => {
  const { id } = req.params;

  let user, details;

  try {
    user = await User.getOne({ id });
    details = await JobSeekerDetail.getOne({ job_seeker_id: id });
    details = details || {};

    if (!user) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "User not found",
        422
      );
      return next(error);
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch user's data",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "User's data fetched successfully.",
    user,
    details,
  });
};

exports.getOneForEdit = async (req, res, next) => {
  const { id } = req.params;

  let user, details;

  try {
    user = await User.getOne({ id });
    details = await JobSeekerDetail.getOne({ job_seeker_id: id });
    details = details || {};
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch user's data",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "User's data fetched successfully.",
    user,
    details,
  });
};

exports.updateUser = async (req, res, next) => {
  let {
    id,
    // required ---
    first_name,
    last_name,
    email,
    gender,
    status,
    lives_in,
    yob,
  } = req.body;

  let extraDetails = {};
  let images = req.files;

  if (images && images.length > 0) {
    extraDetails.profile_picture = images[0].path;
  }

  try {
    // let isExists = await User.getOne(
    //   {
    //     email,
    //     is_deleted: 0,
    //   },
    //   { id }
    // );

    // if (isExists) {
    //   const error = new HttpError(
    //     req,
    //     new Error().stack.split("at ")[1].trim(),
    //     "Email already exists",
    //     500
    //   );
    //   return next(error);
    // }

    // user table
    let saveRes = await User.update(
      { id },
      {
        first_name,
        last_name,
        email,
        updated_at: dateTimeFormat(),
      }
    );

    let detailRes = await JobSeekerDetail.update(
      { job_seeker_id: id },
      {
        gender,
        status,
        lives_in,
        yob,
        ...extraDetails,
        updated_at: dateTimeFormat(),
      }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Job Seeker Updation Failed",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Job Seeker updated successfully.",
  });
};

exports.delete = async (req, res, next) => {
  const { id } = req.body;

  try {
    let user = await User.getOne({ id });
    if (!user) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "User not found",
        422
      );
      return next(error);
    }
    let delRes = await User.update(
      { id },
      {
        is_deleted: 1,
        email: `${user.email}_deleted_${moment().format(
          "YYYY-MM-DD hh:mm:ss"
        )}`,
        updated_at: dateTimeFormat(),
      }
    );
    // console.log(delRes);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not delete user's data",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "User deleted successfully.",
    id,
  });
};

exports.changePassword = async (req, res, next) => {
  const { id, password } = req.body;

  try {
    let hashedPass = await hashPass(password);
    let updateRes = await User.update(
      { id },
      {
        password: hashedPass,
        updated_at: dateTimeFormat(),
      }
    );
    // console.log(updateRes);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not update user's password",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "User's password updated successfully.",
    id,
  });
};

exports.sendCreds = async (req, res, next) => {
  const { id } = req.body;

  let user;

  try {
    user = await User.getOne({ id });
    // console.log(user);
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
    emailTemplate = await EmailTemplate.getOne({ name: "Send Credentials" });
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Something went wrong #b",
      500
    );
    return next(error);
  }

  const userName = `${user.first_name} ${user.last_name}`;
  const email = user.email;
  // const password = randomstring();
  const password = randexp.gen() + "@Aa";

  user.password = password;

  try {
    let hashedPass = await hashPass(password);
    let updateRes = await User.update(
      { id },
      {
        password: hashedPass,
        updated_at: dateTimeFormat(),
      }
    );
    // console.log(updateRes);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Something went wrong #c",
      500
    );
    return next(error);
  }

  let message = emailTemplate.body;
  message = message.replace(/\{USER_NAME\}/g, userName);
  message = message.replace(/\{EMAIL\}/g, email);
  message = message.replace(/\{PASSWORD\}/g, password);

  const subject = emailTemplate.subject;

  emailSend(res, next, user.email, subject, message, "Login Credentials");
};

// client side api ---

// Job-seeker API

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const Err = errors.array();
    const { Errors, message } = ErrorMessageHandler(Err);
    return res
      .status(422)
      .json({ status: false, data: {}, errors: Errors, message });
  }

  let { first_name, last_name, email, password } = req.body;

  let token, savedUser;

  try {
    let isExists = await User.getOne({
      email,
      is_deleted: 0,
    });

    if (isExists?.email && isExists.email === email) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Email already exists",
        500
      );
      return next(error);
    }

    let hashed_pass = await hashPass(password);
    token = generateCustomToken(
      {
        email,
        random: randexp.gen() + "@Aa",
      }
      // "300s"
    );

    // user table
    let saveRes = await User.create({
      first_name,
      last_name,
      email,
      password: hashed_pass,
      user_role_id: 1,
      email_verification_token: token,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });

    savedUser = await User.getOne({ email });
  } catch (err) {
    console.log("this is error", err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Account creation failed.",
      500
    );
    return next(error);
  }

  let emailTemplate;
  try {
    emailTemplate = await EmailTemplate.getOne({ name: "Verify Email" });
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
  message = message.replace(
    /\{LOGIN_LINK\}/g,
    `${process.env.FRONTEND_URL}/verify-email/${token}`
  );
  message = message.replace(/\{NAME\}/g, first_name + " " + last_name);

  const subject = emailTemplate.subject;

  emailSend(res, next, email, subject, message, {
    status: true,
    id: savedUser.id,
    email,
  });
};

exports.emailVerify = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    res.status(200).json({
      status: false,
    });
    return;
  }
  let user;
  try {
    user = await User.getOne({ email });
    if (user.isActive) {
     return res.status(200).json({
        status: false,
        message: "Email already exist.",
      });
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Email not fetched",
      422
    );
    return next(error);
  }


  res.status(200).json({
    status: true,
    message: "Email verified successfully."
  });
};

exports.addMoreInfo = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const Err = errors.array();
    const { Errors, message } = ErrorMessageHandler(Err);
    return res
      .status(422)
      .json({ status: false, data: {}, errors: Errors, message });
  }

  let {
    gender,
    status,
    lives_in,
    yob,
    token,
    // for user table ---
  } = req.body;
  // console.log("body", req.body)
  // console.log("file", req.files, req.file)

  let userData;

  let profile_picture = null;
  let images = req.files;

  if (images && images.length > 0) {
    profile_picture = images[0].path;
  }

  try {
    let decodedToken = await jwt.verify(token, process.env.JWT);
    const { email } = decodedToken;

    userData = await User.getOne({
      email,
      is_deleted: 0,
    });

    if (!userData) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "User do not exists.",
        422
      );
      return next(error);
    }

    let createRes = await JobSeekerDetail.create({
      job_seeker_id: userData.id,
      profile_picture,
      gender,
      status,
      lives_in,
      yob,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Account creation failed.",
      500
    );
    return next(error);
  }

  let emailTemplate;
  try {
    emailTemplate = await EmailTemplate.getOne({
      name: "Account Successfully Created",
    });
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
  message = message.replace(
    /\{LOGIN_LINK\}/g,
    `${process.env.FRONTEND_URL}/login`
  );
  message = message.replace(
    /\{USER_NAME\}/g,
    userData.first_name + " " + userData.last_name
  );

  const subject = emailTemplate.subject;

  emailSend(res, next, userData.email, subject, message, {
    status: true,
    message: "Profile created successfully.",
  });
};

exports.checkTokenExists = async (req, res, next) => {
  const { id } = req.body;

  if (!id) {
    res.status(200).json({
      status: false,
    });
    return;
  }

  try {
    isTokenExists = await User.getOne({ id });
    if (!isTokenExists || !isTokenExists.email_verification_token) {
      res.status(200).json({
        status: false,
      });
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(200).json({
      status: false,
    });
    return;
  }

  res.status(200).json({
    status: true,
  });
};

exports.resendVerificationToken = async (req, res, next) => {
  const { id } = req.body;
  let token, user;

  try {
    user = await User.getOne({ id });

    if (user?.is_email_verified === 1) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Email is already verified.",
        500
      );
      return next(error);
    }

    token = generateCustomToken(
      {
        email: user.email,
        random: randexp.gen() + "@Aa",
      }
      // "300s"
    );

    // jub hunter detail table
    let saveres = await User.update(
      { id },
      {
        email_verification_token: token,
        updated_at: dateTimeFormat(),
      }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Something went wrong.",
      500
    );
    return next(error);
  }

  let emailTemplate;
  try {
    emailTemplate = await EmailTemplate.getOne({
      name: "Resend Verification Link",
    });
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
  message = message.replace(
    /\{LOGIN_LINK\}/g,
    `${process.env.FRONTEND_URL}/verify-email/${token}`
  );
  message = message.replace(
    /\{NAME\}/g,
    user.first_name + " " + user.last_name
  );

  const subject = emailTemplate.subject;

  emailSend(res, next, user.email, subject, message, {
    status: true,
    id: user.id,
  });
};

exports.verifyToken = async (req, res, next) => {
  const { token, role } = req.body;

  console.log(token,'tokentokentokentokentokentoken')
  if (!token) {
    res.status(200).json({
      status: false,
    });
    return;
  }

  let user;

  try {
    decodedToken = jwt.verify(token, process.env.JWT);

    const { email } = decodedToken;

    user = await User.getOne({ email, user_role_id: role });

    if (
      !user ||
      !user?.email_verification_token ||
      user.email_verification_token !== token
    ) {
      res.status(200).json({
        status: false,
        linkChange:true,
        message: "Verification failed.",
      });
    
      return;
    }

    await User.update(
      { id: user.id },
      {
        email_verification_token: null,
        is_email_verified: 1,
        updated_at: dateTimeFormat(),
      }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Verification failed",
      422
    );
    return next(error);

    // res.status(200).json({
    //   status: false,
    //   message: "Verification failed.",
    // });
    // return;
  }
  if (true) {
        // Account Successfully Created email
    
        let emailTemplate;
        try {
          emailTemplate = await EmailTemplate.getOne({
            name: "Account Successfully Created",
          });
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
        message = message.replace(
          /\{LOGIN_LINK\}/g,
          `${process.env.FRONTEND_URL}/login`
        );
        message = message.replace(
          /\{USER_NAME\}/g,
          user.first_name + " " + user.last_name
        );
    
        const subject = emailTemplate.subject;
    
        emailSendInLoop(next, user.email, subject, message);
      }
      console.log("hii")
  res.status(200).json({
    status: true,
    message: "Email verified successfully.",
  });
};

// end verifytoken

exports.jobSeekerLogin = async (req, res, next) => {
  let { email, password } = req.body;

  let user, details, cvDetails;
  try {
    user = await User.getOne({ email, user_role_id: 1, is_deleted: 0 });

    if (!user) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "User doesn't exists.",
        422
      );
      return next(error);
    }

    details = await JobSeekerDetail.getOne({ job_seeker_id: user.id });
    cvDetails = await JobSeekerCv.getOne({ job_seeker_id: user.id });
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Something went wrong while logging in.",
      500
    );
    return next(error);
  }

 if (!user.is_active) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "User doesn't exists",
      422
    );
    return next(error);
  }
 

  let matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Entered password is incorrect",
      422
    );
    return next(error);
  }

  if (!user.is_active) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "User has been blocked. Please contact admin.",
      422
    );
    return next(error);
  }

  if (user.is_deleted) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "User doesn't exists.",
      422
    );
    return next(error);
  }

  //   if (!user.admin_verifying) {
  //   const error = new HttpError(
  //     req,
  //     new Error().stack.split("at ")[1].trim(),
  //     "User not verified please contact admin.",
  //     422
  //   );
  //   return next(error);
  // }

  const firstName = user?.first_name;
  const lastName = user?.last_name;

  const userId = user.id;
  const isEmailVerified = user.is_email_verified;

  let cvStep = 1;

  if (cvDetails) {
    cvStep = 1;
    for (let i = 1; i <= 4; i++) {
      cvStep = i + 1;
      if (!cvDetails[`step_${i}`]) {
        cvStep = i;
        break;
      }
    }
  }

  if (!isEmailVerified) {
    let token = generateCustomToken(
      {
        email,
        random: randexp.gen() + "@Aa",
      }
      // "300s"
    );

    try {
      await User.update(
        { email },
        { email_verification_token: token, updated_at: dateTimeFormat() }
      );

      let emailTemplate = await EmailTemplate.getOne({ name: "Verify Email" });

      let message = emailTemplate.body;
      message = message.replace(
        /\{LOGIN_LINK\}/g,
        `${process.env.FRONTEND_URL}/verify-email/${token}`
      );
      message = message.replace(/\{NAME\}/g, firstName + " " + lastName);

      const subject = emailTemplate.subject;

      emailSend(res, next, email, subject, message, {
        status: true,
        id: userId,
        email,
        isEmailVerified: isEmailVerified,
      });
    } catch (err) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Something went wrong while logging in.",
        500
      );
      return next(error);
    }
  } 
  // else if (!details) {
  //   let token = generateCustomToken(
  //     {
  //       email,
  //       random: randexp.gen() + "@Aa",
  //     }
  //     // "300s"
  //   );

  //   res.status(200).json({
  //     status: true,
  //     token,
  //     message: "Step two not completed.",
  //     stepTwoRemaining: true,
  //     isEmailVerified: user.is_email_verified,
  //   });
  //   return;
  // } 
  else {
    res.status(200).json({
      status: true,
      token: generateToken(user.id, false, user.user_role_id),
      message: "Login successfully.",
      user: {
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        userId: user.id,
        role: user.user_role_id,
        profile_picture: details?.profile_picture || null,
        cvStep: cvStep,
      },
      isEmailVerified: user.is_email_verified,
    });
  }
};

exports.jobSeekerForgotPassword = async (req, res, next) => {
  const { email } = req.body;

  let user;

  try {
    user = await User.getOne({ email, user_role_id: 1 });
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Something went wrong while sending email.",
      500
    );
    return next(error);
  }

  if (!user) {
    return res.status(403).json({
      status: false,
      message: "Your email is not registered with Native.",
    });
  }

  if (!user.is_active) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Job Seeker is not active or has been blocked.",
      422
    );
    return next(error);
  }

  if (user.is_deleted == true) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Job seeker doesn't exists",
      422
    );
    return next(error);
  }

  if (user.is_email_verified == 0) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Email has not been verified.",
      422
    );
    return next(error);
    // return res.status(200).json({
    //   status: false,
    //   message: "Email has not been verified.",
    //   id: user.id,
    // });
  }

  let token = generateCustomToken(
    {
      email: user.email,
      random: randexp.gen() + "@Aa",
    }
    // "300s"
  );

  try {
    let update = await User.update(
      { email: user.email },
      { reset_token: token, updated_at: dateTimeFormat() }
    );
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Something went wrong while sending email.",
      500
    );
    return next(error);
  }
  let emailTemplate = await EmailTemplate.getOne({ name: "Forgot Password" });

  let message = emailTemplate.body;
  message = message.replace(
    /\{FORGOT_PASSWORD_LINK\}/g,
    `${process.env.FRONTEND_URL}/reset-password?token=${token}`
  );

  const subject = emailTemplate.subject;

  emailSend(res, next, email, subject, message, {
    status: true,
    email: user.email,
  });
};

exports.jobSeekerResetPassword = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const Err = errors.array();
    const { Errors, message } = ErrorMessageHandler(Err);
    return res
      .status(422)
      .json({ status: false, data: {}, errors: Errors, message });
  }

  const { newPassword, token } = req.body;
  let hashed_pass = await hashPass(newPassword);
  let user;

  try {
    decodedToken = jwt.verify(token, process.env.JWT);
    const { email } = decodedToken;

    user = await User.getOne({ email, user_role_id: 1 });
    if (!user.reset_token || user.reset_token != token) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Your reset password verfication link has been expired.",
        422
      );
      return next(error);
    }

    await User.update(
      { email },
      { reset_token: null, password: hashed_pass, updated_at: dateTimeFormat() }
    );

    return res.status(200).json({
      status: true,
      message: "Your password has been reset successfully.",
    });
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Something went wrong while updating password.",
      500
    );
    return next(error);
  }
};

exports.verify = async (req, res, next) => {
  const { token } = req.body;

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT);
  } catch (err) {
    return res.status(200).json({
      status: false,
    });
  }

  let { id, isAdmin, role } = decodedToken;

  if (isAdmin) {
    return res.status(200).json({
      status: false,
    });
  }

  let user;

  try {
    user = await User.getOne({ id });
  } catch (err) {
    return res.status(200).json({
      status: false,
    });
  }

  if (
    !user ||
    user.is_active == 0 ||
    user.is_deleted == 1 ||
    !user.is_email_verified
  ) {
    return res.status(200).json({
      status: false,
    });
  }

  let dataToSend = {
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    userId: user.id,
    role: user.user_role_id,
  };

  let newToken;

  if (role == 1) {
    try {
      let details = await JobSeekerDetail.getOne({ job_seeker_id: id });
      dataToSend.profile_picture = details.profile_picture;
      newToken = await generateToken(id, false, 1);
      let cvDetails = await JobSeekerCv.getOne({ job_seeker_id: id });
      let cvStep = 1;

      if (cvDetails) {
        cvStep = 1;
        for (let i = 1; i <= 4; i++) {
          cvStep = i + 1;
          if (!cvDetails[`step_${i}`]) {
            cvStep = i;
            break;
          }
        }
      }

      dataToSend.cvStep = cvStep;
    } catch (err) {
      return res.status(200).json({
        status: false,
      });
    }
  }

  if (role == 2) {
    try {
      newToken = await generateToken(id, false, 2);
    } catch (err) {
      return res.status(200).json({
        status: false,
      });
    }
  }

  res.status(200).json({
    status: true,
    token: newToken,
    message: "User verified successfully.",
    user: dataToSend,
    isEmailVerified: user.is_email_verified,
  });
};

exports.userChangePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const id = req.userId;

  let user;

  try {
    user = await User.getOne({ id });
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not update password.",
      500
    );
    return next(error);
  }

  // let isPassword = await bcrypt.compare(currentPassword, user.password);

  // if (!isPassword) {
  //   const error = new HttpError(
  //     req,
  //     new Error().stack.split("at ")[1].trim(),
  //     "You have entered current password incorrectly.",
  //     422
  //   );
  //   return next(error);
  // }

  let hashed_pass = await hashPass(newPassword);

  try {
    await User.update(
      { id },
      { password: hashed_pass, updated_at: dateTimeFormat() }
    );
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not update password.",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Your password has been changed successfully.",
  });
};

exports.getJobSeekerProfile = async (req, res, next) => {
  const id = req.userId;

  let user, details;

  try {
    user = await User.getOne({ id });

    details = await JobSeekerDetail.getOne({ job_seeker_id: id });
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Something went wrong while fetching profile data.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "User does not exist.",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    data: {
      user,
      details,
    },
    message: "Profile data has been fetched successfully.",
  });
};

exports.jobSeekerUpdateProfile = async (req, res, next) => {
  const id = req.userId;

  let { first_name, last_name, gender, status, lives_in, yob, old_image } =
    req.body;

  let userUpdates = {
    first_name,
    last_name,
    updated_at: dateTimeFormat(),
  };

  let userDetailsUpdates = {
    gender,
    status,
    lives_in,
    yob,
    updated_at: dateTimeFormat(),
  };

  let image = old_image;

  let images = req.files;
  if (images && images.length > 0) {
    image = images[0].path;
  }

  userDetailsUpdates.profile_picture = image;

  let updateUser, updateUserDetails;
  try {
    updateUser = await User.update({ id }, userUpdates);

    updateUserDetails = await JobSeekerDetail.update(
      { job_seeker_id: id },
      userDetailsUpdates
    );
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Something went wrong while updating profile.",
      500
    );
    return next(error);
  }

  // let user;
  // try {
  //   user = await User.getProfileData({ "users.id": id });
  // } catch (err) {
  //   const error = new HttpError(
  //     req,
  //     new Error().stack.split("at ")[1].trim(),
  //     "Something went wrong while updating profile.",
  //     500
  //   );
  //   return next(error);
  // }

  // if (!user) {
  //   const error = new HttpError(
  //     req,
  //     new Error().stack.split("at ")[1].trim(),
  //     "Something went wrong while updating profile.",
  //     500
  //   );
  //   return next(error);
  // }

  res.status(200).json({
    status: true,
    message: "Profile has been updated successfully.",
    data: { ...userUpdates, ...userDetailsUpdates },
  });
};

exports.getJobSeekerAssessment = async (req, res, next) => {
  const user_id = req.userId;

  let results;

  try {
    results = await Common.getAll("assessment_result", { user_id });
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Something went wrong",
      500
    );
    return next(error);
  }

  results = results.record ?? [];

  let carrerValues = results.find((r) => r.type == "carrer_value");

  let careerInterests = results.find((r) => r.type == "career_interests");

  let motivatedSkills = results.find((r) => r.type == "motivated_skills");

  let personalityType = results.find((r) => r.type == "personality_type");

  let lifePurpose = results.find((r) => r.type == "life_purpose");

  if (carrerValues) {
    carrerValues = JSON.parse(carrerValues.result)[0];
    carrerValues = Common.getAll(
      "core_values",
      {},
      {
        key: "id",
        value: carrerValues,
      }
    );
  }

  if (careerInterests) {
    careerInterests = JSON.parse(careerInterests.result);

    careerInterests = Common.getAll(
      "career_interest_categories",
      {},
      {
        key: "id",
        value: careerInterests,
      }
    );
  }

  if (personalityType) {
    personalityType = JSON.parse(personalityType.result);

    personalityType = Common.getAll("personality_summaries", {
      id: personalityType,
    });
  }

  if (motivatedSkills) {
    let ids = results.find((r) => r.type == "motivated_skills");

    motivatedSkills = JSON.parse(motivatedSkills.result);

    motivatedSkills = Common.getAll(
      "motivated_skills",
      {},
      {
        key: "id",
        value: motivatedSkills,
      }
    );
  }

  if (lifePurpose) {
    lifePurpose = JSON.parse(lifePurpose.result);
  }

  [
    carrerValues,
    careerInterests,
    personalityType,
    motivatedSkills,
    lifePurpose,
  ] = await Promise.all([
    carrerValues,
    careerInterests,
    personalityType,
    motivatedSkills,
    lifePurpose,
  ]);

  if (carrerValues && carrerValues.record?.length > 0) {
    let ids = results.find((r) => r.type == "carrer_value");
    let newIds = JSON.parse(ids.result)[0];
    let sameArray = [];
    newIds.forEach((item) => {
      let findData = carrerValues.record.find((newItem) => newItem.id == item);
      sameArray.push(findData);
    });
    carrerValues = sameArray;
  } else {
    carrerValues = new Array(5)
      .fill(null)
      .map((_, idx) => ({ id: idx, value: "" }));
  }

  if (motivatedSkills && motivatedSkills.record?.length > 0) {
    let idsMoti = results.find((r) => r.type == "motivated_skills");
    let newIdsMoti = JSON.parse(idsMoti.result);
    let sameArrayMoti = [];
    newIdsMoti.forEach((item) => {
      let findDataMoti = motivatedSkills.record.find(
        (newItem) => newItem.id == item
      );
      sameArrayMoti.push(findDataMoti);
    });
    motivatedSkills = sameArrayMoti;
  } else {
    motivatedSkills = new Array(3)
      .fill(null)
      .map((_, idx) => ({ id: idx, skill: "" }));
  }

  res.status(200).json({
    status: true,
    message: "Assessment result has been fetched successfully.",
    results: {
      carrerValues,
      careerInterests:
        careerInterests?.record ??
        new Array(3).fill(null).map((_, idx) => ({ id: idx, title: "" })),
      personalityType: personalityType?.record?.[0] ?? {
        title: "",
        description: JSON.stringify([]),
      },
      motivatedSkills,
      // :
      //   motivatedSkills?.record ??
      //   new Array(3).fill(null).map((_, idx) => ({ id: idx, skill: "" })),
      lifePurpose: lifePurpose ?? null,
    },
  });
};

exports.combineSignup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const Err = errors.array();
    const { Errors, message } = ErrorMessageHandler(Err);
    return res
      .status(422)
      .json({ status: false, data: {}, errors: Errors, message });
  }

  let { first_name, last_name, email, password } = req.body;

  try {
    let isExists = await User.getOne({
      email,
      is_deleted: 0,
    });

    if (isExists?.email && isExists.email === email) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Email already exists",
        500
      );
      return next(error);
    }

    let hashed_pass = await hashPass(password);
    token = generateCustomToken(
      {
        email,
        random: randexp.gen() + "@Aa",
      }
      // "300s"
    );

    // user table
    let saveRes = await User.create({
      first_name,
      last_name,
      email,
      password: hashed_pass,
      user_role_id: 1,
      email_verification_token: token,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });

    savedUser = await User.getOne({ email });
  } catch (err) {
    console.log("this is error combineSignup 1", err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Account creation failed.",
      500
    );
    return next(error);
  }

  //addMoreInfo starts

  let { gender, status, lives_in, yob } = req.body;

  let profile_picture = null;
  let images = req.files;

  if (images && images.length > 0) {
    profile_picture = images[0].path;
  }

  try {
    await JobSeekerDetail.create({
      job_seeker_id: savedUser.id,
      profile_picture,
      gender,
      status,
      lives_in,
      yob,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Account creation failed.",
      500
    );
    return next(error);
  }

//   if (true) {
//     // Account Successfully Created email

//     let emailTemplate;
//     try {
//       emailTemplate = await EmailTemplate.getOne({
//         name: "Account Successfully Created",
//       });
//     } catch (err) {
//       const error = new HttpError(
//         req,
//         new Error().stack.split("at ")[1].trim(),
//         "Something went wrong #b",
//         500
//       );
//       return next(error);
//     }

//     let message = emailTemplate.body;
//     message = message.replace(
//       /\{LOGIN_LINK\}/g,
//       `${process.env.FRONTEND_URL}/login`
//     );
//     message = message.replace(
//       /\{USER_NAME\}/g,
//       savedUser.first_name + " " + savedUser.last_name
//     );

//     const subject = emailTemplate.subject;

//     emailSendInLoop(next, email, subject, message);
//   }

  let emailTemplate;
  try {
    emailTemplate = await EmailTemplate.getOne({ name: "Verify Email" });
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
  message = message.replace(
    /\{LOGIN_LINK\}/g,
    `${process.env.FRONTEND_URL}/verify-email/${token}`
  );
  message = message.replace(/\{NAME\}/g, first_name + " " + last_name);

  const subject = emailTemplate.subject;

  emailSend(res, next, email, subject, message, {
    status: true,
    id: savedUser.id,
    email,
    message: "Profile created successfully.",
  });
};


exports.ChangeVerifyingAdmin = async (req, res, next) => {
  const { id, status } = req.body;

  try {
    let updateRes = await User.update(
      { id },
      {
        admin_verifying: +status,
        updated_at: dateTimeFormat(),
      }
    );
    // console.log(updateRes);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not user verifying",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "User's verified successfully.",
    id,
    newStatus: status,
  });
};