const User = require("../models/user");
const moment = require("moment");
const HttpError = require("../http-error");



exports.counts = async (req, res) => {
  let jobSeekers = {
    active: 0,
    deactive: 0,
  };
  let employers = {
    active: 0,
    deactive: 0,
  };
//Job-Seeker
  try {
    total = await User.getMany({
      match: { user_role_id: 1, is_deleted: 0, is_active: 1 },
    });
    if (total?.data?.record) {
      jobSeekers.active = total.data.record.length;
    }
  } catch (err) {}

  try {
    total = await User.getMany({
      match: { user_role_id: 1, is_deleted: 0, is_active: 0 },
    });
    if (total?.data?.record) {
      jobSeekers.deactive = total.data.record.length;
    }
  } catch (err) {}
//Employer
try {
  total = await User.getMany({
    match: { user_role_id: 2, is_deleted: 0, is_active: 1 },
  });
  if (total?.data?.record) {
    employers.active = total.data.record.length;
  }
} catch (err) {}

try {
  total = await User.getMany({
    match: { user_role_id: 2, is_deleted: 0, is_active: 0 },
  });
  if (total?.data?.record) {
    employers.deactive = total.data.record.length;
  }
} catch (err) {}

  res.status(200).json({
    status: true,
    counts: {
      jobSeekers,
      employers
    },
  });
};

exports.jobSeekerChart = async (req, res, next) => {
  const { by } = req.params;

  let data;
  let timeline = [];

  if (by === "date") {
    let timelineObj = {};
    for (let i = 0; i < 7; i++) {
      timelineObj[moment().subtract(i, "day").format("YYYYMMDD DD MMMM")] = 0;
    }
    let total;
    try {
      total = await User.getMany({ match: { user_role_id: 1, is_deleted: 0 } });
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

    if (total.status) {
      total.data.record.forEach((val) => {
        let currentKey = moment(val.created_at).format("YYYYMMDD DD MMMM");
        // console.log(currentKey);
        if (!isNaN(timelineObj[currentKey])) {
          timelineObj[currentKey] = +timelineObj[currentKey] + 1;
        }
      });
    }

    for (let key in timelineObj) {
      timeline.push({ option: key, count: timelineObj[key] });
    }

    timeline = timeline.sort((a, b) => {
      return +a.option.split(" ")[0] - +b.option.split(" ")[0];
    });

    timeline = timeline.map((val) => {
      let name = val.option.split(" ");
      name = `${name[1]} ${name[2]}`;
      return {
        option: name,
        count: val.count,
      };
    });

    // console.log(total)
    data = total;
  } else if (by === "month") {
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    let timelineObj = {};
    for (let i = 0; i < months.length; i++) {
      timelineObj[`${months[i]}_${moment().format("YYYY")}`] = 0;
    }

    let total;
    try {
      total = await User.getMany({ match: { user_role_id: 1, is_deleted: 0 } });
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
    if (total.status) {
      total.data.record.forEach((val) => {
        let currentKey = moment(val.created_at).format("MMMM_YYYY");
        // console.log(currentKey);
        if (!isNaN(timelineObj[currentKey])) {
          timelineObj[currentKey] = +timelineObj[currentKey] + 1;
        }
      });
    }

    for (let key in timelineObj) {
      timeline.push({ option: key.split("_")[0], count: timelineObj[key] });
    }

    // console.log(total)
    data = total;
  } else if (by === "year") {
    let timelineObj = {};

    let total;
    try {
      total = await User.getMany({ match: { user_role_id: 1, is_deleted: 0 } });
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
    if (total.status) {
      total.data.record.forEach((val) => {
        let currentKey = moment(val.created_at).format("YYYY");
        // console.log(currentKey);
        if (!isNaN(timelineObj[currentKey])) {
          timelineObj[currentKey] = +timelineObj[currentKey] + 1;
        } else {
          timelineObj[currentKey] = 1;
        }
      });
    }

    for (let key in timelineObj) {
      timeline.push({ option: key, count: timelineObj[key] });
    }

    // console.log(total)
    data = total;
  }
  res.status(200).json({
    status: true,
    timeline,
  });
};

exports.employerChart = async (req, res, next) => {
  const { by } = req.params;

  let data;
  let timeline = [];

  if (by === "date") {
    let timelineObj = {};
    for (let i = 0; i < 7; i++) {
      timelineObj[moment().subtract(i, "day").format("YYYYMMDD DD MMMM")] = 0;
    }
    let total;
    try {
      total = await User.getMany({ match: { user_role_id: 2, is_deleted: 0 } });
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

    if (total.status) {
      total.data.record.forEach((val) => {
        let currentKey = moment(val.created_at).format("YYYYMMDD DD MMMM");
        // console.log(currentKey);
        if (!isNaN(timelineObj[currentKey])) {
          timelineObj[currentKey] = +timelineObj[currentKey] + 1;
        }
      });
    }

    for (let key in timelineObj) {
      timeline.push({ option: key, count: timelineObj[key] });
    }

    timeline = timeline.sort((a, b) => {
      return +a.option.split(" ")[0] - +b.option.split(" ")[0];
    });

    timeline = timeline.map((val) => {
      let name = val.option.split(" ");
      name = `${name[1]} ${name[2]}`;
      return {
        option: name,
        count: val.count,
      };
    });

    // console.log(total)
    data = total;
  } else if (by === "month") {
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    let timelineObj = {};
    for (let i = 0; i < months.length; i++) {
      timelineObj[`${months[i]}_${moment().format("YYYY")}`] = 0;
    }

    let total;
    try {
      total = await User.getMany({ match: { user_role_id: 2, is_deleted: 0 } });
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
    if (total.status) {
      total.data.record.forEach((val) => {
        let currentKey = moment(val.created_at).format("MMMM_YYYY");
        // console.log(currentKey);
        if (!isNaN(timelineObj[currentKey])) {
          timelineObj[currentKey] = +timelineObj[currentKey] + 1;
        }
      });
    }

    for (let key in timelineObj) {
      timeline.push({ option: key.split("_")[0], count: timelineObj[key] });
    }

    // console.log(total)
    data = total;
  } else if (by === "year") {
    let timelineObj = {};

    let total;
    try {
      total = await User.getMany({ match: { user_role_id: 2, is_deleted: 0 } });
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
    if (total.status) {
      total.data.record.forEach((val) => {
        let currentKey = moment(val.created_at).format("YYYY");
        // console.log(currentKey);
        if (!isNaN(timelineObj[currentKey])) {
          timelineObj[currentKey] = +timelineObj[currentKey] + 1;
        } else {
          timelineObj[currentKey] = 1;
        }
      });
    }

    for (let key in timelineObj) {
      timeline.push({ option: key, count: timelineObj[key] });
    }

    // console.log(total)
    data = total;
  }
  res.status(200).json({
    status: true,
    timeline,
  });
};
