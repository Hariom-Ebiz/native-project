const Course = require("../models/course");
const LessonProgress = require("../models/lessonProgress");
const HttpError = require("../http-error");

const dateTimeFormat = require("../utils/dateTime.js");

exports.create = async (req, res, next) => {
  const { category_id, title, time, order_number, skip_lessons } = req.body;

  const image = req.files.image[0].path;
  // const background_image = req.files.background_image[0].path;

  try {
    await Course.create({
      category_id,
      title,
      time,
      order_number,
      skip_lessons,
      image,
      // background_image,
      created_at: dateTimeFormat(),
      updated_at: dateTimeFormat(),
    });
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not able to create course.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Course Created Successfully",
  });
};

exports.update = async (req, res, next) => {
  const { id, category_id, title, time, order_number, skip_lessons } = req.body;

  const extras = {
    updated_at: dateTimeFormat(),
    category_id,
    title,
    time,
    order_number,
    skip_lessons,
  };

  const files = req.files;

  if (files.image && files.image.length > 0) {
    extras.image = files.image[0].path;
  }

  // if (files.background_image && files.background_image.length > 0) {
  //   extras.background_image = files.background_image[0].path;
  // }

  try {
    await Course.update({ id }, extras);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not able to update course.",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Course Updated Successfully",
  });
};

exports.getOne = async (req, res, next) => {
  const { id } = req.params;

  let course;

  try {
    course = await Course.getOne({ id });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not able to fetch.",
      500
    );
    return next(error);
  }

  if (!course) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Course not found",
      404
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Course Fetched Successfully",
    course,
  });
};

exports.getAll = async (req, res, next) => {
  let courses;

  try {
    courses = await Course.getMany({
      page: 1,
      per_page: 100,
      sort_by: "order_number",
      order: "asc",
    });
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch courses.",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Courses Fetched Successfully",
    courses: courses?.data,
  });
};

exports.getAllClient = async (req, res, next) => {
  let courses;

  try {
    courses = await Course.getManyClient();
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch courses.",
      500
    );
    return next(error);
  }

  courses = courses?.data ?? [];

  const lessonIds = courses.reduce((acc, cv) => {
    acc = acc.concat(cv.lessons);
    return acc;
  }, []);

  let progress;

  try {
    progress = await LessonProgress.getBasedOnLesson(
      lessonIds,
      req.userId ?? 0
    );
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch courses.",
      500
    );
    return next(error);
  }

  courses = courses.map((course) => {
    const allLessons = progress.filter((p) =>
      course.lessons.includes(p.lesson_id)
    );

    const lessonProgress = allLessons.reduce(
      (acc, cv) => {
        acc.seconds_watched += cv.seconds_watched;
        acc.total_seconds += cv.total_seconds;

        if (cv.is_completed == 1) {
          acc.completed_count++;
        }
        return acc;
      },
      { seconds_watched: 0, total_seconds: 0, completed_count: 0 }
    );

    let completed_percentage =
      (lessonProgress.seconds_watched / lessonProgress.total_seconds) * 100;

    completed_percentage = +completed_percentage.toFixed(0);

    if (isNaN(completed_percentage)) {
      completed_percentage = 0;
    }

    if (allLessons.length == lessonProgress.completed_count) {
      completed_percentage = 100;
    }

    course.completed_percentage = completed_percentage;
    course.lesson_completed_count = lessonProgress.completed_count;

    return course;
  });

  res.status(200).json({
    status: true,
    message: "Courses Fetched Successfully",
    courses,
  });
};
