const Setting = require("../models/setting");
const HttpError = require("../http-error");
const { reduxSettingData } = require("../utils/helper");
const dateTimeFormat = require("../utils/dateTime.js");
const { frontEndPublicSettings } = require("../utils/helper");

exports.create = async (req, res, next) => {
  let { title, key, value, inputType, isEditable, isRequired } = req.body;

  key = key.trim();

  try {
    let saveRes = await Setting.create({
      key,
      value,
      title,
      input_type: inputType,
      editable: isEditable,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Something went wrong while creating setting",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Setting Created",
  });
};

exports.getAll = async (req, res, next) => {
  let { page, title, per_page, sortBy, order } = req.query;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  title = title ?? "";
  sortBy = sortBy ?? "";
  order = order ?? "desc";

  let settings;

  try {
    settings = await Setting.getMany({
      match: {},
      title,
      page,
      per_page,
      sort_by: sortBy,
      order,
    });

    // console.log(settings);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Something went wrong while fetching settings",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Settings Fetched",
    settings: settings?.data,
    totalDocuments: settings?.totalDocuments,
  });
};

exports.delete = async (req, res, next) => {
  const { id } = req.body;

  try {
    let delRes = await Setting.delete({ id });
    // console.log(delRes);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Something went wrong while deleting setting",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Setting Deleted",
    id,
  });
};

exports.getOne = async (req, res, next) => {
  const { id } = req.params;

  let setting;

  try {
    setting = await Setting.getOne({ id });
    // console.log(setting);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Something went wrong while fetching setting",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Setting Fetched",
    setting,
  });
};

exports.update = async (req, res, next) => {
  const { title, key, value, inputType, isEditable, settingId, isRequired } =
    req.body;

  try {
    let updateRes = await Setting.update(
      { id: settingId },
      {
        title,
        key,
        value,
        input_type: inputType,
        editable: isEditable,
        updated_at: dateTimeFormat(),
      }
    );
    // console.log(updateRes);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Something went wrong while updating setting",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Setting Updated",
  });
};

exports.getAllPrefix = async (req, res, next) => {
  const { prefix } = req.params;

  let prefixSettings;
  try {
    prefixSettings = await Setting.getByPrifix(prefix);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Something went wrong while fetching prefix setting",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Prefix Setting Fetched",
    prefixSettings,
  });
};

exports.updatePrefix = async (req, res, next) => {
  let { data, otherData, imagesKey } = req.body;

  data = JSON.parse(data);
  otherData = JSON.parse(otherData);
  imagesKey = JSON.parse(imagesKey);

  // console.log("data", data);
  // console.log("otherData", otherData);
  // console.log("imagesKey", imagesKey);

  const images = req.files;

  // console.log("images", images);

  let imageData = [];

  if (images && images.length > 0) {
    images.forEach((image, idx) => {
      imageData.push({
        key: imagesKey[idx],
        value: image.path,
      });
    });
  }

  data = [...data, ...imageData];

  console.log("data", data);

  try {
    for (let i = 0; i < data.length; i++) {
      let toUpdate = data[i];
      await Setting.update(
        { key: toUpdate.key },
        { value: toUpdate.value, updated_at: dateTimeFormat() }
      );
    }
    for (let i = 0; i < otherData.length; i++) {
      let toUpdate = otherData[i];
      await Setting.update(
        { key: toUpdate.key },
        { selected: toUpdate.selected, updated_at: dateTimeFormat() }
      );
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Something went wrong while updating settings",
      500
    );
    return next(error);
  }

  const fullData = [...data, ...otherData];
  const dataInRedux = reduxSettingData;

  const setting = fullData.filter((data) => dataInRedux.includes(data.key));

  res.status(200).json({
    status: true,
    message: "Settings Updated",
    setting,
  });
};

exports.getByKey = async (req, res, next) => {
  const { key } = req.params;

  let setting;

  try {
    setting = await Setting.getOne({ key });
    // console.log(setting);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Something went wrong while fetching setting",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Setting Fetched",
    setting,
  });
};

exports.getSettingForClient = async (req, res, next) => {
  let settings, permissions;

  let settingObj = {};
  let permissionObj = {};

  try {
    settings = await Setting.settingsForUser();
    settings = settings || [];
    settings = settings.filter((elem) => {
      return frontEndPublicSettings.includes(elem.newKey);
    });

    settings.forEach((set) => {
      // console.log(set);
      settingObj[set.newKey] = set.selected || set.value;
    });

    // console.log("setting", settings)
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

  try {
    // permissions = await MenuSetting.getAll();
    // permissions = permissions || [];
    // permissions.forEach((set) => {
    //   // console.log(set);
    //   permissionObj[set.menu_slug] = set.is_active === 1 ? true : false;
    // });
    // console.log("setting", settings)
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

  res.status(200).json({
    status: true,
    settings: settingObj,
    permissions: permissionObj,
    // scripts: scriptObj,
    // settings,
  });
};
