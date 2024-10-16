const EmailLog = require("../models/emailLog");
const HttpError = require("../http-error");

exports.getAll = async (req, res, next) => {
  let {
    page,
    email_to,
    email_from,
    subject,
    per_page,
    sort_by,
    order,
    // dateFrom,
    // dateTo,
  } = req.query;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 1;
  sort_by = sort_by ?? "created_at";
  order = order ?? "desc";
  email_to = email_to ?? "";
  email_from = email_from ?? "";
  subject = subject ?? "";

  let emailLogs;

  try {
    emailLogs = await EmailLog.getMany({
      match: {},
      page,
      // is_active,
      email_to,
      email_from,
      subject,
      per_page,
      sort_by,
      order,
      // date_from,
      // date_to,
    });
    // console.log(emailLogs)
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch email logs",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Email Logs Fetched successfully.",
    emailLogs : emailLogs?.data,
    totalDocuments : emailLogs?.totalDocuments,
  });
};
