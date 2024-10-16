const Notification = require("../models/notification.js");
const HttpError = require("../http-error");
const { reduxSettingData } = require("../utils/helper");
const dateTimeFormat = require("../utils/dateTime.js");
const { frontEndPublicSettings } = require("../utils/helper");


exports.getAll = async (req, res, next) => {
  let { page,  per_page, sortBy, order,is_mark_all_seen } = req.query;
  const userId = req.userId;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  sortBy = sortBy ?? "";
  order = order ?? "desc";
    const pagination = {page, per_page, order, sortBy}

  let notificationsData;

  try {
    notificationsData = await Notification.getMany(userId,pagination);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Something went wrong while fetching notifications",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Notifications Data Fetched",
    notificationsData: notificationsData?.data,
    totalDocuments: notificationsData?.totalDocuments,
  });
};

exports.readOne = async (req, res, next) => {
  let { notifId, is_mark_all_seen } = req.query;
  const userId = req.userId;
  let notificationsData;

  try {
    notificationsData = await Notification.readOne(notifId,is_mark_all_seen=true);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Something went wrong while fetching notifications",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Notifications Data Fetched",
    notificationsData: notificationsData?.data,
  });
}

exports.getUnseenMessageCount = async (req,res,next) => {
  try{
    const userId = req.userId;
    const result = await Notification.getUnseenNotificationCount(userId);
    if(result.status){
      return res.status(200).json({
        status: true,
        message: "Notification Count Fetched Successfully",
        count: result.count
      })
    } else{
      return res.status(200).json({
        status: false,
        message: "Something went wrong",
        count: 0
      })
    }
  } catch(err){
    console.log("erro : ", err)
    return res.status(200).json({
      status: false,
      message: "Something went wrong",
      count: 0
    })
  }
}

exports.getNotifSettings = async (req, res, next) => {
  try{
    const userId = req.userId;
    const result = await Notification.getNotifSettings(userId);
    if(result.status){
      return res.status(200).json({
        status: true,
        message: "Notification Count Fetched Successfully",
        data: result.data
      })
    } else{
      return res.status(200).json({
        status: false,
        message: "Something went wrong",
        count: 0
      })
    }
  } catch(err){
    console.log("erro : ", err)
    return res.status(200).json({
      status: false,
      message: "Something went wrong",
      count: 0
    })
  }
}

exports.updateNotifsSettings = async (req, res, next) => {
  try{
    const userId = req.userId;
    const { invitation_notif, job_update_notif } = req.body;
    const result = await Notification.updateNotifSettings({id: userId},{invitation_notif, job_update_notif});
    if(result.status){
      return res.status(200).json({
        status: true,
        message: "Notification Count Fetched Successfully",
        data: result.data
      })
    } else{
      return res.status(200).json({
        status: false,
        message: "Something went wrong",
        count: 0
      })
    }
  } catch(err){
    console.log("erro : ", err)
    return res.status(200).json({
      status: false,
      message: "Something went wrong",
      count: 0
    })
  }
}