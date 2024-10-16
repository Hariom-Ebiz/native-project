const Block = require("../models/block");
const HttpError = require("../http-error");

const dateTimeFormat = require("../utils/dateTime.js");
const createSlug = (value) => value.toLowerCase().split(" ").join("-");

exports.create = async (req, res, next) => {
  const { page, title, description } = req.body;

  let extras = {
    created_at: dateTimeFormat(),
    updated_at: dateTimeFormat(),
  };
  let images = req.files;
  if (images && images.length > 0) {
    extras.image = images[0].path;
  }

  extras.page_slug = createSlug(page);
  extras.title_slug = createSlug(title);

  try {
    let saveRes = await Block.create({
      page,
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
  const { id, page, title, description } = req.body;

  let extras = {
    updated_at: dateTimeFormat(),
  };
  let images = req.files;
  if (images && images.length > 0) {
    extras.image = images[0].path;
  }

  extras.page_slug = createSlug(page);
  extras.title_slug = createSlug(title);

  try {
    let updateRes = await Block.update(
      { id },
      {
        page,
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
//     let updateRes = await Block.update(
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
  let { page, per_page, sort_by, order, title, page_slug } = req.query;
  let blocks;

  page = page ? +page : 1;
  per_page = per_page ? +per_page : 10;
  sort_by = sort_by ?? "id";
  order = order ?? "desc";
  title = title ?? "";
  page_slug = page_slug ?? "";

  try {
    blocks = await Block.getMany({
      match: {},
      page,
      per_page,
      sort_by,
      order,
      title,
      page_slug,
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
//     blocks = await Block.getMany({
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
//     let delRes = await Block.delete({ id, code: "skill" });
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
    block = await Block.getOne({ id });
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
    message: "Block Fetched Successfully",
    block,
  });
};

exports.getBlocksByPage = async (req, res, next) => {
  const { page_slug } = req.params;
  let blocks;
  let blockObj = {};

  try {
    blocks = await Block.getAllByPage(page_slug);
    blocks = blocks?.record || [];

    blocks.forEach((val) => {
      blockObj[val.title_slug] = {
        page: val.page,
        page_slug: val.page_slug,
        title: val.title,
        title_slug: val.title_slug,
        image: val.image,
        description: val.description,
      };
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
