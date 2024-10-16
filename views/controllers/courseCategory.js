const CourseCategory = require("../models/courseCategory");
const Lesson = require("../models/lesson");
const User = require("../models/user");
const HttpError = require("../http-error");

const dateTimeFormat = require("../utils/dateTime.js");

exports.create = async (req, res, next) => {
  const { title, order_number, sequence_mandatory } = req.body;

  const updates = {
    title,
    order_number,
    sequence_mandatory,
    created_at: dateTimeFormat(),
    updated_at: dateTimeFormat(),
  };

  try {
    await CourseCategory.create(updates);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not able to create course category.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Course Category Created Successfully",
  });
};

exports.update = async (req, res, next) => {
  const { id, title, order_number, sequence_mandatory } = req.body;

  const updates = {
    title,
    order_number,
    sequence_mandatory,
    updated_at: dateTimeFormat(),
  };

  try {
    await CourseCategory.update({ id }, updates);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not able to update course category.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Course Category Updated Successfully",
  });
};

exports.getCourses = async (req, res, next) => {
  let categories, progress, thirdCompleted;

  try {
    [categories, progress, thirdCompleted] = await Promise.all([
      CourseCategory.getCourses(req.userId ?? 0),
      User.getCourseProgress(req.userId),
      Lesson.checkThirdCategoryIsCompleted(req.userId ?? 0),
    ]);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not able to fetch courses.",
      500
    );
    return next(error);
  }

  categories = categories.data;

  categories = categories.map((category) => {
    category.courses = category.courses.map((course) => {
      const lesson_count = course.lessons.length;
      const each_lesson_percentage = +(100 / course.lessons.length).toFixed(2);

      let lesson_completed_count = course.lessons.filter(
        (lesson) => lesson.progress.is_completed == 1
      ).length;
      let completed_percentage = 0;

      if (lesson_count === lesson_completed_count) {
        completed_percentage = 100;
      } else {
        completed_percentage = course.lessons.reduce((acc, cv) => {
          if (cv.progress.is_completed == 1) {
            acc += each_lesson_percentage;
          } else if (
            cv.total_seconds != null &&
            "is_completed" in cv.progress
          ) {
            const percentage = (
              (cv.progress.seconds_watched / cv.progress.total_seconds) *
              each_lesson_percentage
            ).toFixed(2);
            acc += +percentage;
          }
          return acc;
        }, 0);
      }

      course.lessons = course.lessons.map((lesson) => lesson.id);

      return {
        ...course,
        completed_percentage: +completed_percentage.toFixed(0),
        lesson_completed_count,
      };
    });

    return category;
  });

  res.status(200).json({
    status: true,
    message: "Categories fetched successfully",
    categories,
    progress,
    thirdCompleted,
  });
};

exports.thirdCategory = async (req, res, next) => {
  let isThirdCategoryCompleted;

  try {
    isThirdCategoryCompleted = await Lesson.checkThirdCategoryIsCompleted(
      req.userId
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
    message: "Data fetched successfully",
    isThirdCategoryCompleted,
  });
};
