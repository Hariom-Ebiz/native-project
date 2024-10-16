const ObjectId = require("mongoose").Types.ObjectId;
const { validationResult } = require("express-validator");
const HowItWork = require("../models/howItWork");
const HttpError = require("../http-error");
const moment = require("moment");
const dateTimeFormat = require("../utils/dateTime.js");

const {
  decodeEntities,
  emailSend,
  reduxSettingData,
  MASTER_CURRENCY,
  ErrorMessageHandler,
  hashPass,
  matchPass,
} = require("../utils/helper");

const createSlug = (value) => value.toLowerCase().split(" ").join("-");

exports.create = async (req, res, next) => {
  const { type, title, description } = req.body;

  let extras = {
    created_at: dateTimeFormat(),
    updated_at: dateTimeFormat(),
  };
  let images = req.files;
  if (images && images.length > 0) {
    extras.image = images[0].path;
  }

  try {
    let saveRes = await HowItWork.create({
      type,
      title,
      description,
      ...extras,
    });
    // console.log(saveRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not create block.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Block Created Successfully",
  });
};

exports.update = async (req, res, next) => {
  const { id, type, title, description } = req.body;

  let extras = {    
      updated_at: dateTimeFormat(),
  };
  let images = req.files;
  if (images && images.length > 0) {
    extras.image = images[0].path;
  }

  try {
    let updateRes = await HowItWork.update(
      { id },
      {
        type,
        title,
        description,
        ...extras,
      }
    );
    console.log(updateRes);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not update block.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Block Updated Successfully",
  });
};

// exports.changeStatus = async (req, res, next) => {
//   const { id, status } = req.body;

//   try {
//     let updateRes = await HowItWork.update(
//       { id, code: "skill" },
//       {
//         is_active: +status,
//       }
//     );
//     // console.log(updateRes);
//   } catch (err) {
//     console.log(err);
//     const error = new HttpError(
//       req,
//       new Error().stack.split("at ")[1].trim(),
//       "Could not change skill's status",
//       500
//     );
//     return next(error);
//   }

//   res.status(200).json({
//     status: true,
//     message: "Skill's status changed successfully.",
//     id,
//     newStatus: status,
//   });
// };

exports.getAll = async (req, res, next) => {
  let { page, per_page, sort_by, order, title, type } = req.query;
  let blocks;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  sort_by = sort_by ?? "id";
  order = order ?? "desc";
  title = title ?? "";
  type = type ?? "";

  try {
    blocks = await HowItWork.getMany({
      match: {},
      page,
      per_page,
      sort_by,
      order,
      title,
      type,
    });
    // console.log(blocks);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch blocks.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Blocks Fetched Successfully",
    blocks: blocks?.data,
    totalDocuments: blocks?.totalDocuments,
  });
};

// exports.getAllByPage = async (req, res, next) => {
//   let { page, per_page, sort_by, order, title } = req.query;
//   let blocks;

//   page = page ? +page : 1;
//   per_page = per_page ? +per_page : 10;
//   sort_by = sort_by ?? "id";
//   order = order ?? "desc";
//   lookup_type = lookup_type ?? "";

//   try {
//     blocks = await HowItWork.getMany({
//       match: { code: "skill" },
//       page,
//       per_page,
//       sort_by,
//       order,
//       lookup_type,
//     });
//     // console.log(blocks);
//   } catch (err) {
//     console.log(err);
//     const error = new HttpError(
//       req,
//       new Error().stack.split("at ")[1].trim(),
//       "Could not fetch blocks.",
//       500
//     );
//     return next(error);
//   }

//   res.status(201).json({
//     status: true,
//     message: "Skills Fetched Successfully",
//     blocks: blocks?.data,
//     totalDocuments: blocks?.totalDocuments,
//   });
// };

// exports.delete = async (req, res, next) => {
//   const { id } = req.body;

//   try {
//     let delRes = await HowItWork.delete({ id, code: "skill" });
//     // console.log(delRes);
//   } catch (err) {
//     console.log(err);
//     const error = new HttpError(
//       req,
//       new Error().stack.split("at ")[1].trim(),
//       "Could not delete skill.",
//       500
//     );
//     return next(error);
//   }

//   res.status(201).json({
//     status: true,
//     message: "Skill Deleted Successfully",
//     id,
//   });
// };

exports.getOne = async (req, res, next) => {
  const { id } = req.params;

  let block;
  try {
    block = await HowItWork.getOne({ id });
    if (!block) {
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Could not fetch.",
        422
      );
      return next(error);
    }
    // console.log(block);
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
    message: "How It Work Fetched Successfully",
    block,
  });
};

exports.getBlocksForClient = async (req, res, next) => {
  
  let blocks;
  let blockObj = {};

  try {
    blocks = await HowItWork.getAll();
    // console.log(blocks);
    blocks = blocks?.record || [];

    blocks.forEach((val) => {
      if (blockObj[val.type] && blockObj[val.type].length > 0) {
        blockObj[val.type].push({
          type: val.type,
          title: val.title,
          image: val.image,
          description: val.description,
        });
      } else {
        blockObj[val.type] = [
          {
            type: val.type,
            title: val.title,
            image: val.image,
            description: val.description,
          },
        ];
      }
    });

    // console.log(blocks);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch blocks.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Blocks Fetched Successfully",
    blocks: blockObj,
  });
};
