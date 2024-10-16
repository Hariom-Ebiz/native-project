const HttpError = require("../http-error.js");
const dateTimeFormat = require("../utils/dateTime.js");
const dashboardModal = require("../models/dashboard.js")


exports.getAllCandidateDashboardData = async (req,res,next) => {
    const currentUserId = req.userId;
    
    try{
        const data = await dashboardModal.getCandidateDashboardDetails(currentUserId);
        return res.status(200).json({
            message: "Data Fetched",
            status: true,
            data: data,
        })
    } catch(err){
        console.log("err", err);
        return res.status(200).json({
            status: false,
            message: "Something went wrong"
        })
    }
}

exports.getAllCandidateDashboardCourseData = async (req,res,next) => {
    const currentUserId = req.userId;
    const {page, per_page, sortBy, order} = req.query;

    const pagination = {};

    pagination.page = page ?? 1;
    pagination.per_page = per_page ?? 10;
    pagination.sortBy = sortBy ?? "created_at";
    pagination.order = order ?? "desc";
    
    try{
        const data = await dashboardModal.getAllCandidateDashboardCourseData(currentUserId,pagination);
        return res.status(200).json({
            message: "Data Fetched",
            status: true,
            data: data,
        })
    } catch(err){
        console.log("err", err);
        return res.status(200).json({
            status: false,
            message: "Something went wrong"
        })
    }
}

exports.getAllCandidateDashboardJobData = async (req,res,next) => {
    const currentUserId = req.userId;
    const {page, per_page, sortBy, order} = req.query;

    const pagination = {};

    pagination.page = page ?? 1;
    pagination.per_page = per_page ?? 10;
    pagination.sortBy = sortBy ?? "created_at";
    pagination.order = order ?? "desc";
    
    try{
        const data = await dashboardModal.getAllCandidateDashboardJobData(currentUserId,pagination);
        return res.status(200).json({
            message: "Data Fetched",
            status: true,
            data: data,
        })
    } catch(err){
        console.log("err", err);
        return res.status(200).json({
            status: false,
            message: "Something went wrong"
        })
    }
}


exports.getAllEmployerDashboardData = async (req,res, next) => {
    const currentUserId = req.userId;
    const {from, to} = req.query;
    
    try{
        const data = await dashboardModal.getEmployerDashboardDetails(currentUserId,from,to);
        return res.status(200).json({
            message: "Data Fetched",
            status: true,
            data: data.data,
        })
    } catch(err){
        console.log("err", err);
        return res.status(200).json({
            status: false,
            message: "Something went wrong"
        })
    }
}