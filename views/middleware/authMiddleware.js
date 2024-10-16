const jwt = require("jsonwebtoken");
const HttpError = require("../http-error");

const Admin = require("../models/admin");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Request Failed!",
      401
    );
    return next(error);
  }

  const token = authHeader.split(" ")[1];

  if (!token || token === "null" || token === null) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Request Failed!",
      401
    );
    return next(error);
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT);
  } catch (err) {
    if (err.message === "invalid token") {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Not authenticated, Login again to perform actions.",
        401
      );
      return next(error);
    } else if (err.message === "jwt malformed") {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        `Something went wrong #a. Please Login Again`,
        401
      );
      return next(error);
    }
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      `Something went wrong #b. Please Login Again`,
      500
    );
    return next(error);
  }

  if (!decodedToken) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Not authenticated, Login again to perform actions.",
      401
    );
    return next(error);
  }

  req.userId = decodedToken.id;
  req.token = token;
  req.isAdmin = decodedToken.isAdmin;

  if (req.isAdmin) {
    const admin = await Admin.getOne({ id: decodedToken.id });

    if (!admin || admin.is_active == 0) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Login again to perform actions.",
        401
      );
      return next(error);
    }
  } else {
    const user = await User.getOne({ id: decodedToken.id });
    if (!user || user.is_active == 0 || user.is_deleted) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Login again to perform actions.",
        401
      );
      return next(error);
    }
  }

  next();
};
