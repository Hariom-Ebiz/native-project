const AdminRole = require("../models/admin_role");
const HttpError = require("../http-error");

const dateTimeFormat = require("../utils/dateTime.js");
const createSlug = (value) => value.toLowerCase().split(" ").join("-");

exports.create = async (req, res, next) => {
  let { role, permissions } = req.body;

  try {
    let saveRes = await AdminRole.create({
      role,
      permissions: JSON.stringify(permissions),
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not create role.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Admin Role Created Successfully",
  });
};

exports.update = async (req, res, next) => {
  const { id, role, permissions } = req.body;

  try {
    let updateRes = await AdminRole.update(
      { id },
      {
        role,
        permissions: JSON.stringify(permissions),
        updated_at: dateTimeFormat(),
      }
    );
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not update.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Admin Role Updated Successfully",
  });
};

exports.changeStatus = async (req, res, next) => {
  const { id, status } = req.body;

  try {
    let updateRes = await AdminRole.update(
      { id },
      {
        is_active: +status,
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

exports.getAll = async (req, res, next) => {
  let { page, per_page, sort_by, order, role } = req.query;
  let roles;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  sort_by = sort_by ?? "id";
  order = order ?? "desc";
  role = role ?? "";

  try {
    roles = await AdminRole.getMany({
      match: {},
      page,
      per_page,
      sort_by,
      order,
      role,
    });
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
    message: "Fetched Successfully",
    roles: roles?.data,
    totalDocuments: roles?.totalDocuments,
  });
};

exports.getOne = async (req, res, next) => {
  const { id } = req.params;

  let data;
  try {
    data = await AdminRole.getOne({ id });
    if (!data) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Could not fetch.",
        422
      );
      return next(error);
    }
    // console.log(data);
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
    message: "Fetched Successfully",
    data,
  });
};

exports.delete = async (req, res, next) => {
  const { id } = req.body;

  try {
    let updateRes = await AdminRole.delete({ id });
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not delete.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Admin Role Deleted Successfully",
    id
  });
};

exports.getActiveRoles = async (req, res, next) => {
  let roles;
  try {
    roles = await AdminRole.getActive({is_active : 1});
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
    message: "Fetched Successfully",
    roles: roles,
  });
};