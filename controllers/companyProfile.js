const CompanyProfile = require("../models/companyProfile");
const User = require("../models/user");
const HttpError = require("../http-error");
const dateTimeFormat = require("../utils/dateTime.js");
const path = require("path")

exports.create = async (req, res, next) => {
  let { name, title, description } = req.body;

  try {
    let createRes = await Cms.create({
      page_name: name,
      title,
      body: description,
      slug: createSlug(name),
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
    // console.log(createRes);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not create a cms page",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "CMS page created successfully.",
  });
};

exports.update = async (req, res, next) => {
  const { id, company_name, description, website, country, city, employee, industry, other_industry, founded, phone, email, twitter, facebook, 	linkedin, area, other_area} = req.body;
  console.log(req.body);
    let updates = {}

    let logo = null;
    let cover_image = null;

    let images = req.files;

    if (images['logo']) {
      logo = images['logo'][0]
    }

    if (images['cover_image']) {
      cover_image = images['cover_image'][0]
    }

    if (company_name) updates["company_name"] = company_name;
    if (description) updates["description"] = description;
    if (website) updates["website"] = website;
    if (country) updates["country"] = country;
    if (city) updates["city"] = city;
    if (area){ 
      if (area == "other") {
        updates["area"] = area;
        updates["other_area"] = other_area;
      } else {
        updates["area"] = area;
        updates["other_area"] = null;
      }
    }
    if (employee) updates["employee"] = employee;
    if (industry) {
      if (industry == "other") {
        updates["industry"] = industry;
        updates["other_industry"] = other_industry;
      } else {
        updates["industry"] = industry;
        updates["other_industry"] = null;
      }
      
    } 
    if (founded) updates["founded"] = founded;
    if (phone) updates["phone"] = phone;
    if (email) updates["email"] = email;
    if (twitter) updates["twitter"] = twitter;
    updates["facebook"] = facebook;
    if (linkedin) updates["linkedin"] = linkedin;
    if (logo) updates["logo"] = logo.path;
    if (cover_image) updates["cover_image"] = cover_image.path;

  let updateRes = {}
  try {
    updateRes = await CompanyProfile.update(
      { id },
      updates
    );
    const allFill = await CompanyProfile.checkAllFill(id);
    if (company_name || email) {
      let obj = {};
      if(email) obj['email'] = email;
      if(company_name) obj['first_name'] = company_name;
      await User.update({id: updateRes.data.employer_id}, {...obj})
    }
    if (allFill.data[0]?.column_null == "false") {
      await CompanyProfile.update({id}, {is_complete: 1});
      updateRes.data['is_complete'] = 1;
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not edit company profile",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Company profile Updated successfully.",
    updatedData: updateRes.data
  });
};

exports.getAll = async (req, res, next) => {
  let { page, name, per_page, sortBy, order, title } = req.query;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  name = name ?? "";
  title = title ?? "";
  sortBy = sortBy ?? "created_at";
  order = order ?? "desc";

  let cms;
  try {
    cms = await Cms.getMany({
      match: {},
      page,
      per_page,
      sort_by: sortBy,
      order,
      page_name: name,
      title,
    });
    // console.log(cms);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch cms pages",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Cms Pages Fetched successfully.",
    cms: cms?.data,
    totalDocuments: cms?.totalDocuments,
  });
};

exports.getOne = async (req, res, next) => {
  const { id } = req.params;

  let profile;
  try {
    profile = await CompanyProfile.getOne({ employer_id: id });
    // console.log(cms);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch profile",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Profile Fetched successfully.",
    profile,
  });
};

exports.delete = async (req, res, next) => {
  const { id } = req.body;

  try {
    let delRes = await Cms.delete({ id });
    // console.log(delRes);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not delete cms page",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Cms Page Deleted Successfully.",
    id,
  });
};

exports.getBySlug = async (req, res, next) => {
  const { slug } = req.params;

  let cms;

  try {
    cms = await Cms.getOne({
      slug,
    });
    // console.log(cms);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch cms page",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "CMS page Fetched successfully.",
    cms,
  });
};

exports.getMyJObs = async (req, res, next) => {
  const id = req.userId;

  let jobs;

  try {
    const jobsRes = await CompanyProfile.getJobs(id);
    if (jobsRes.status) {
      jobs = jobsRes.data
    } else {
      jobs = []
    }
    // console.log(cms);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch jobs",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Jobs Fetched successfully.",
    jobs,
  });
} 