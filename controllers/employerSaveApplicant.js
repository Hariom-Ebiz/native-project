const SaveApplicant = require("../models/employerSaveApplicant");
const Common = require("../models/common");
const HttpError = require("../http-error");
const { validationResult } = require("express-validator");
const {
  ErrorMessageHandler,
} = require("../utils/helper");
const dateTimeFormat = require("../utils/dateTime.js");
const moment = require("moment");
const Notification = require("../utils/notification.js");

exports.applicantAction = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const Err = errors.array();
    const { Errors, message } = ErrorMessageHandler(Err);
    return res
      .status(422)
      .json({ status: false, data: {}, errors: Errors, message });
  }
  const { job_seeker_id, save, unlock_profile, job_id } = req.body;


  if (!job_seeker_id) {
    return res
      .status(400)
      .json({ status: false, data: {}, errors: "Bad request", message: "Bad request" });
  }

  try {
    const checkIsExist = await SaveApplicant.isSaved({ employer_id: req.userId, job_seeker_id });
    if (checkIsExist.status) {
      if (checkIsExist.data) {
        // saving applicant
        await SaveApplicant.update({ employer_id: req.userId, job_seeker_id }, { save, unlock_profile, unlock_profile_date: (unlock_profile != "0") ? dateTimeFormat() : null, updated_at: dateTimeFormat() })
        if (unlock_profile && unlock_profile != "0") {
          await Common.raw("UPDATE company_profile SET unlock_qty = unlock_qty-1 WHERE employer_id = ?", [req.userId])
        }
      } else {
        await SaveApplicant.create({
          job_seeker_id,
          employer_id: req.userId,
          save,
          unlock_profile,
          unlock_profile_date: (unlock_profile != "0") ? dateTimeFormat() : null,
          created_at: dateTimeFormat(),
          updated_at: dateTimeFormat(),
        });
        const res = await SaveApplicant.checkAndGetCompanyName(req.userId, job_id)
        if (res.status) {
          const notification = new Notification("unlock update", job_seeker_id);
          await notification.formatTemplate({ COMPANY_NAME: res.companyName })
          await notification.sendNotification([job_seeker_id], null)
        }

        if (unlock_profile && unlock_profile != "0") {
          await Common.raw("UPDATE company_profile SET unlock_qty = unlock_qty-1 WHERE employer_id = ?", [req.userId])
        }
      }
    }
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

  res.status(201).json({
    status: true,
    message: "Applicant saved Successfully",
  });
};

exports.checkIsSave = async (req, res, next) => {
  let { job_seeker_id } = req.query;

  let data = {}
  try {
    const d = await SaveApplicant.isSaved({ employer_id: req.userId, job_seeker_id })
    if (d.status) {
      data = d.data;
    }

  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Something went wrong",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Applicant fetch Successfully",
    data
  });

}

exports.getAll = async (req, res, next) => {
  let { page, per_page, sort_by, order, question, search } = req.query;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 1;
  sort_by = sort_by ?? "created_at";
  order = order ?? "desc";
  question = question ?? "";

  let data;

  try {
    data = await SaveApplicant.getMany({
      page,
      per_page,
      sort_by,
      order,
      search: search
    }, req.userId);
    // console.log(faqs);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch faqs.",
      500
    );
    return next(error);
  }


  res.status(200).json({
    status: true,
    message: "Faqs Fetched successfully.",
    applicants: data?.data,
    totalDocuments: data?.totalDocuments,
  });
};

exports.delete = async (req, res, next) => {
  const { id } = req.body;

  try {
    let delRes = await Faq.delete({ id });
    // console.log(delRes);
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

  res.status(200).json({
    status: true,
    message: "FAQ deleted Successfully",
    id,
  });
};

exports.getOne = async (req, res, next) => {
  const { id } = req.params;

  let faq;

  try {
    faq = await Faq.getOne({ id });
    // console.log(faq);
  } catch (err) {
    onsole.log(err);
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
    message: "FAQ fetched successfully",
    faq,
  });
};

exports.update = async (req, res, next) => {
  const { category_id, question, answer, id } = req.body;

  try {
    let updateRes = await Faq.update(
      { id },
      {
        category_id,
        question,
        answer,

        // updated_at: moment().format("YYYY-MM-DD hh:mm:ss"),
        updated_at: dateTimeFormat(),
      }
    );
    // console.log(updateRes);
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

  res.status(200).json({
    status: true,
    message: "FAQ updated successfully",
    // updateRes
  });
};

const updateHiredStatus = async (args) => {
  const { job_id: jobId } = args;
  try {
    // Fetch the number of selected candidates for the given jobId
    const selectedCountResult = await DB('job_seeker_applied_jobs')
      .where('job_id', jobId)
      .andWhere('selected', '1')
      .count('* as count');

    const selectedCount = selectedCountResult[0].count;

    // Fetch the number of vacancies for the given jobId
    const vacanciesResult = await DB('employer_job_posts')
      .where('id', jobId)
      .select('vacancies');

    const vacancies = vacanciesResult[0].vacancies;

    // Update is_hired status if the selectedCount >= vacancies
    if (selectedCount >= vacancies) {
      await DB('employer_job_posts')
        .update({ is_hired: 1 })
        .where('id', jobId);

    }
    return true
  } catch (error) {
    console.log(">>>>>errorr", error);
    return false
  }
}

exports.changeStatus = async (req, res, next) => {
  const { job_seeker_id, job_id, shortlisted, interviewd, selected, rejected, is_hold, rejectReason, interview_date } = req.body;

  if (!job_seeker_id && !job_id) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Bad Request",
      400
    );
    return next(error);
  }

  let query = {};
  let notification;
  const extras = {};
  if (shortlisted) {
    query['shortlisted'] = 1;
    query['shortlist_date'] = dateTimeFormat();
    notification = new Notification("shortlist candidate", job_seeker_id);
  }
  if (interviewd) {
    query['interviewd'] = 1;
    notification = new Notification("interview schedule", job_seeker_id);
  }
  if (is_hold) {
    query['is_hold'] = 1;
    query['interview_date'] = moment(interview_date).format("YYYY-MM-DD HH:mm:ss");
    // notification = new Notification("candidate hold", job_seeker_id);
  }
  if (selected) {
    query['selected'] = 1;
    query['selected_date'] = dateTimeFormat();
    notification = new Notification("hire candidate", job_seeker_id);
  }
  if (rejected) {
    query['rejected'] = 1;
    query['declined_date'] = dateTimeFormat();
    query['reject_reason'] = rejectReason;
    extras.REJECT_REASON = rejectReason;
    notification = new Notification("reject candidate", job_seeker_id);
  }

  let response = "";

  try {
    const res = await SaveApplicant.checkAndGetCompanyName(req.userId, job_id)

    if (res.status && notification) {
      await notification.formatTemplate({ COMPANY_NAME: res.companyName, JOB_TITLE: res.job_title, ...extras })
      await notification.sendNotification([job_seeker_id], `/job-seeker/application-history?job_application=applied`)
    }

    const get = await Common.getOne("job_seeker_applied_jobs", { job_seeker_id, job_id });

    if (get) {
      response = await Common.update("job_seeker_applied_jobs", { job_seeker_id, job_id }, { ...query, updated_at: dateTimeFormat() })

    } else {
      response = await Common.create("job_seeker_applied_jobs", { job_seeker_id, job_id, ...query, created_at: dateTimeFormat(), updated_at: dateTimeFormat() })
    }

    if (!response.status) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Applicant status couldn't be changed.",
        500
      );
      return next(error);
    } else {
      if (selected) {
        updateHiredStatus({ job_id });
      }
    }
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
    message: "Applicant status changed successfully.",
  });
};

exports.getStatus = async (req, res, next) => {
  const { job_seeker_id, job_id } = req.query;

  if (!job_seeker_id && !job_id) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Bad Request",
      400
    );
    return next(error);
  }

  let response = "";
  let jobDetails;

  try {

    response = await Common.getOne("job_seeker_applied_jobs", { job_seeker_id, job_id });
    jobDetails = await Common.getOne("employer_job_posts", { id: job_id })

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
    message: "Applicant status changed successfully.",
    data: { ...response, isJobActive: jobDetails.is_active },

  });
};

exports.getCaetgoryByRole = async (req, res, next) => {
  const { page, per_page, sort_by, order, is_active, role } = req.query;

  let categories;
  try {
    categories = await Faq.getCategoryByRole({ page, per_page, sort_by, order, is_active, role });
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

  res.status(200).json({
    status: true,
    message: "FAQ category fetched successfully",
    categories: categories.data
    // updateRes
  });
}

exports.likeOrDislike = async (req, res, next) => {
  const { id, isLike, isDislike } = req.body;
  try {
    await Faq.likeOrDislike(
      {
        id,
        isLike,
        isDislike,
        updated_at: moment().format("YYYY-MM-DD hh:mm:ss"),
      }
    );
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
    message: "FAQ's status changed successfully.",
    id
  });
};


exports.seeApplicant = async (req, res, next) => {
  const { job_id, job_seeker_id } = req.body;
  try {
    await Common.update("job_seeker_applied_jobs", { job_id, job_seeker_id }, { is_read: 1 })
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not update read count",
      500
    );
    return next(error);
  }
  res.status(200).json({
    status: true,
    message: "Read count update successfully."
  });
}


exports.getRejectReasons = async (req, res, next) => {
  let data;

  try {
    data = await SaveApplicant.getManyRejectReasons();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch Rejection reasons.",
      500
    );
    return next(error);
  }


  res.status(200).json({
    status: true,
    message: "Rejection Reasons Fetched successfully.",
    reasons: data?.data,
  });
}