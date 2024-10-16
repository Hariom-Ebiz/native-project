const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const RandExp = require("randexp");
const Admin = require("../models/admin");
const Setting = require("../models/setting");
const HttpError = require("../http-error");
const generateToken = require("../utils/generateToken");
const EmailTemplate = require("../models/emailTemplate");
const moment = require("moment");
const {
  emailSend,
  ErrorMessageHandler,
  hashPass,
  matchPass,
} = require("../utils/helper");
const dateTimeFormat = require("../utils/dateTime.js");
const { admin_datatransfer_v1 } = require("googleapis");

const randexp = new RandExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/);
randexp.max = 10;
randexp.defaultRange.subtract(32, 47);
randexp.defaultRange.subtract(58, 63);
randexp.defaultRange.subtract(91, 96);
randexp.defaultRange.subtract(123, 126);

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const Err = errors.array();
    const { Errors, message } = ErrorMessageHandler(Err);
    return res
      .status(422)
      .json({ status: false, data: {}, errors: Errors, message });
  }

  let { email, name, phoneNumber, password } = req.body;

  try {
    let hashed_pass = await hashPass(password);
    await Admin.create({
      name: name,
      email: email,
      phone_number: phoneNumber,
      password: hashed_pass,
      user_role_id: 1,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Signing up failed #a",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Admin Signed Up Successfully",
  });
};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const Err = errors.array();
    const { Errors, message } = ErrorMessageHandler(Err);
    return res
      .status(422)
      .json({ status: false, data: {}, errors: Errors, message });
  }

  const { email, password } = req.body;

  let existingAdmin;

  try {
    existingAdmin = await Admin.getOne({ email });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Logging in failed #a",
      500
    );
    return next(error);
  }

  if (!existingAdmin) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Your email is not registered with talent pick.",
      422
    );
    return next(error);
  }

  if (!(await matchPass(password, existingAdmin.password))) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Email or Password is incorrect",
      422
    );
    return next(error);
  }

  if (existingAdmin.isActive == false) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Admin is not active",
      422
    );
    return next(error);
  }

  let setting;

  try {
    setting = await Setting.settingsForAdmin();
    // console.log("setting", setting)
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Something went worng while fetching setting",
      500
    );
    return next(error);
  }

  // try {
  //   setting = await Setting.aggregate(SETTING_AGGREGATE());
  // } catch (err) {
  //   const error = new HttpError(
  //     req,
  //     new Error().stack.split("at ")[1].trim(),
  //     "Something went worng while fetching setting",
  //     500
  //   );
  //   return next(error);
  // }

  res.status(200).json({
    status: true,
    message: "Admin Logged In Successfully",
    token: generateToken(existingAdmin.id, true),
    id: existingAdmin.id,
    name: existingAdmin.name,
    email: existingAdmin.email,
    permissions: existingAdmin.permissions,
    user_role_id: existingAdmin.user_role_id,
    setting,
  });
};

exports.verifyToken = async (req, res, next) => {
  const { token } = req.body;

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT);
  } catch (err) {
    return res.status(200).json({
      status: false,
    });
  }

  let { id, isAdmin } = decodedToken;

  if (!isAdmin) {
    return res.status(200).json({
      status: false,
    });
  }

  let admin;

  try {
    admin = await Admin.getOne({ id });
  } catch (err) {
    return res.status(200).json({
      status: false,
    });
  }

  if (!admin) {
    return res.status(200).json({
      status: false,
    });
  } else {
    let setting;

    try {
      setting = await Setting.settingsForAdmin();
      // console.log("setting", setting)
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Something went worng while fetching setting",
        500
      );
      return next(error);
    }

    // try {
    //   setting = await Setting.aggregate(SETTING_AGGREGATE());
    // } catch (err) {
    //   const error = new HttpError(
    //     req,
    //     new Error().stack.split("at ")[1].trim(),
    //     "Something went wrong while fetching setting",
    //     500
    //   );
    //   return next(error);
    // }

    return res.status(200).json({
      status: true,
      id,
      name: admin.name,
      email: admin.email,
      permissions: admin.permissions,
      user_role_id: admin.user_role_id,
      setting,
      message: "Admin verified successfully.",
    });
  }
};

exports.updateProfile = async (req, res, next) => {
  const { name, id, email } = req.body;
  const { userId } = req;

  if (email) {
    let isEmailAlreadyExists;
    try {
      isEmailAlreadyExists = await Admin.getOne({ email });
    } catch (err) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Something went wrong",
        500
      );
      return next(error);
    }

    if (isEmailAlreadyExists) {
      return res.status(403).json({
        status: true,
        message: "Email Id already exists",
      });
    }
  }

  try {
    let updateRes = email
      ? await Admin.update(
          { id: userId },
          { name, email, updated_at: dateTimeFormat() }
        )
      : await Admin.update(
          { id: userId },
          { name, updated_at: dateTimeFormat() }
        );

    console.log("updateRes", updateRes);
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
    message: "Profile updated successfully",
    name,
    email,
  });
};

exports.changePassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const Err = errors.array();
    const { Errors, message } = ErrorMessageHandler(Err);
    return res
      .status(422)
      .json({ status: false, data: {}, errors: Errors, message });
  }

  const { id, oldPassword, newPassword } = req.body;
  const { userId } = req;

  let admin;
  try {
    admin = await Admin.getOne({ id: userId });
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Something went wrong",
      500
    );
    return next(error);
  }

  if (!admin) {
    res.status(403).json({
      status: false,
      message: "No admin exist with this particular id",
    });
    return;
  }

  if (!(await matchPass(oldPassword, admin.password))) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Old Password has been entered incorrectly.",
      403
    );
    return next(error);
  }

  try {
    const password = await hashPass(newPassword);
    let updateres = await Admin.update(
      { id: userId },
      { password, updated_at: dateTimeFormat() }
    );
    console.log(updateres);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Something went wrong while updating password",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Password Changed",
  });
};

exports.forgotPassword = async (req, res, next) => {
  console.log("here");
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const Err = errors.array();
    const { Errors, message } = ErrorMessageHandler(Err);
    return res
      .status(422)
      .json({ status: false, data: {}, errors: Errors, message });
  }

  const { email } = req.body;

  let admin;

  try {
    admin = await Admin.getOne({ email });
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

  if (!admin) {
    return res.status(403).json({
      status: false,
      message: "Your email is not registered with Native.",
    });
  }

  let emailTemplate;
  try {
    emailTemplate = await EmailTemplate.getOne({ name: "Forgot Password" });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Something went wrong #b",
      500
    );
    return next(error);
  }

  let token;

  try {
    token = jwt.sign(
      { userId: admin.id, email: admin.email },
      process.env.JWT,
      {
        expiresIn: "2h",
      }
    );
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

  let toUpdateInTable = {
    forgot_password_validate_string: token,
    updated_at: dateTimeFormat(),
  };

  try {
    await Admin.update({ id: admin.id }, toUpdateInTable);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Something went wrong #d",
      500
    );
    return next(error);
  }

  const link = `${process.env.FRONTEND_ADMIN_URL}/reset-password/${token}`;

  let message = emailTemplate.body;
  message = message.replace(/\{FORGOT_PASSWORD_LINK\}/g, link);

  const subject = emailTemplate.subject;
  emailSend(res, next, admin.email, subject, message);
};

exports.verifyForgetPassToken = async (req, res, next) => {
  const { token } = req.body;

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT);
  } catch (err) {
    return res.status(200).json({
      status: false,
    });
  }

  let { userId, email } = decodedToken;

  if (!userId || !email) {
    return res.status(200).json({
      status: false,
    });
  }

  let admin;

  try {
    admin = await Admin.getOne({ id: userId, email });
  } catch (err) {
    return res.status(200).json({
      status: false,
    });
  }

  if (!admin) {
    return res.status(200).json({
      status: false,
    });
  }

  if (admin.forgot_password_validate_string !== token) {
    return res.status(200).json({
      status: false,
    });
  }

  res.status(200).json({
    status: true,
  });
};

exports.resetPassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const Err = errors.array();
    const { Errors, message } = ErrorMessageHandler(Err);
    return res
      .status(422)
      .json({ status: false, data: {}, errors: Errors, message });
  }

  const { token, newPassword } = req.body;

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Your reset password link has been expired",
      422
    );
    return next(error);
  }

  let { email, userId } = decodedToken;

  if (!email || !userId) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Your reset password link has been expired",
      422
    );
    return next(error);
  }

  let admin;
  try {
    admin = await Admin.getOne({ id: userId, email });
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

  if (
    !admin ||
    !admin?.forgot_password_validate_string ||
    admin.forgot_password_validate_string !== token
  ) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Your reset password link has been expired",
      422
    );
    return next(error);
  }

  try {
    let dataToUpdate = {
      password: await hashPass(newPassword),
      forgot_password_validate_string: null,
      updated_at: dateTimeFormat(),
    };
    await Admin.update({ id: userId }, dataToUpdate);
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

  let emailTemplate;
  try {
    emailTemplate = await EmailTemplate.getOne({
      name: "Password reset confirmation",
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Something went wrong #b",
      500
    );
    return next(error);
  }

  let message = emailTemplate.body;
  message = message.replace(/\{USER_NAME\}/g, admin.name);

  const subject = emailTemplate.subject;
  emailSend(res, next, admin.email, subject, message);

  // res.status(200).json({
  //   status: true,
  //   message: "Password has been updated successfully.",
  // });
};

exports.getLanguages = async (req, res, next) => {
  const languages = [
    {
      name: "English",
      code: "en",
      default: true,
      image: "uploads/images/language_images/english.svg",
    },
    // { name: "French", code: "fr", default: false },
  ];

  res.status(200).json({
    status: true,
    message: "Languages fetched successfully",
    languages,
  });
};

// SUB ADMINS -------------------

exports.createSubAdmin = async (req, res, next) => {
  let { email, name, phoneNumber, permissions, admin_role } = req.body;

  let savedAdmin, token;
  const password = randexp.gen() + "@Aa";
  try {
    let hashed_pass = await hashPass(password);
    savedAdmin = await Admin.create({
      name: name,
      email: email,
      phone_number: phoneNumber,
      password: hashed_pass,
      user_role_id: 2,
      admin_role,
      permissions: JSON.stringify(permissions),
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
    token = jwt.sign(
      { userId: savedAdmin.data[0], email },
      process.env.JWT,
      {
        expiresIn: "2h",
      }
    );

    let updateRes = await Admin.update(
      { id: savedAdmin.data[0] },
      {
        forgot_password_validate_string: token,
        updated_at: dateTimeFormat(),
      }
    );
    console.log("updateRes", updateRes)
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Sub Admin creation failed.",
      500
    );
    return next(error);
  }

  // >>>>>>>>>>>>>>>>>>>
  const link = `${process.env.FRONTEND_ADMIN_URL}/set-password/${token}`;
  let emailTemplate;
  try {
    emailTemplate = await EmailTemplate.getOne({ name: "Admin Creation" });
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
  message = message.replace(/\{SET_PASSWORD_LINK\}/g, link);
  message = message.replace(/\{NAME\}/g, name);
  message = message.replace(/\{EMAIL\}/g, email);

  const subject = emailTemplate.subject;

  emailSend(res, next, email, subject, message, {
    mailSend: 1,
  });
  // >>>>>>>>>>>>>>>>>>>

  // res.status(201).json({
  //   status: true,
  //   message: "Sub Admin Created Successfully",
  // });
};

exports.getAllSubAdmins = async (req, res, next) => {
  let { page, per_page, sort_by, order, name, email, dateFrom, dateTo } =
    req.query;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 1;
  sort_by = sort_by ?? "created_at";
  order = order ?? "desc";
  name = name ?? "";
  email = email ?? "";

  let data;

  try {
    data = await Admin.getMany({
      match: {
        user_role_id: 2,
      },
      page,
      per_page,
      sort_by,
      order,
      name,
      email,
      dateFrom,
      dateTo,
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Unable to fetch data.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Data Fetched Successfully",
    data: data?.data?.record,
    totalDocuments: data?.data?.totalRecords,
  });
};

exports.getOneSubAdmins = async (req, res, next) => {
  let { id } = req.params;

  let data;
  try {
    data = await Admin.getOne({ id });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Unable to fetch data.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Data Fetched Successfully",
    data: data,
  });
};

exports.editSubAdmin = async (req, res, next) => {
  const { id, email, name, phoneNumber, permissions, admin_role } = req.body;

  if (email) {
    let isEmailAlreadyExists;
    try {
      isEmailAlreadyExists = await Admin.getOne({ email }, { id });
    } catch (err) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Something went wrong",
        500
      );
      return next(error);
    }

    if (isEmailAlreadyExists) {
      return res.status(403).json({
        status: true,
        message: "Email Id already exists",
      });
    }
  }

  try {
    let updateRes = email
      ? await Admin.update(
          { id, user_role_id: 2 },
          {
            name,
            email,
            phone_number: phoneNumber,
            permissions: JSON.stringify(permissions),
            admin_role,
            updated_at: dateTimeFormat(),
          }
        )
      : await Admin.update(
          { id, user_role_id: 2 },
          {
            name,
            phone_number: phoneNumber,
            permissions: JSON.stringify(permissions),
            admin_role,
            updated_at: dateTimeFormat(),
          }
        );

    console.log("updateRes", updateRes);
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
    message: "Updated successfully",
  });
};

exports.changeSubAdminStatus = async (req, res, next) => {
  const { id, status } = req.body;

  try {
    let updateRes = await Admin.update(
      { id, user_role_id: 2 },
      {
        is_active: +status,
        updated_at: dateTimeFormat(),
      }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not change status",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Status changed successfully.",
    id,
    newStatus: status,
  });
};

exports.changeSubAdminPassword = async (req, res, next) => {
  const { id, password } = req.body;

  try {
    let hashedPass = await hashPass(password);
    let updateRes = await Admin.update(
      { id, user_role_id: 2 },
      {
        password: hashedPass,
        updated_at: dateTimeFormat(),
      }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not update password",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Password updated successfully.",
    id,
  });
};

exports.sendSubAdminCreds = async (req, res, next) => {
  const { id } = req.body;

  let subAdmin;

  try {
    subAdmin = await Admin.getOne({ id, user_role_id: 2 });
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

  const userName = `${subAdmin.name}`;
  const email = subAdmin.email;
  const password = randexp.gen() + "@Aa";
  subAdmin.password = password;

  try {
    let hashedPass = await hashPass(password);
    let updateRes = await Admin.update(
      { id, user_role_id: 2 },
      {
        password: hashedPass,
        updated_at: dateTimeFormat(),
      }
    );
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

  emailSend(res, next, subAdmin.email, subject, message, "Login Credentials");
};

exports.deleteSubAdmin = async (req, res, next) => {
  const { id } = req.body;

  try {
    let admin = await Admin.getOne({ id });
    if (!admin) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Sub admin not found",
        422
      );
      return next(error);
    }
    let delRes = await Admin.update(
      { id, user_role_id: 2 },
      {
        is_deleted: 1,
        email: `${admin.email}_deleted_${moment().format(
          "YYYY-MM-DD hh:mm:ss"
        )}`,
        updated_at: dateTimeFormat(),
        deleted_at: dateTimeFormat(),
      }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not delete sub admin",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Sub admin deleted successfully.",
    id,
  });
};
