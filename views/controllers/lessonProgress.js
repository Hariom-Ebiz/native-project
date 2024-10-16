const LessonProgress = require("../models/lessonProgress");
const HttpError = require("../http-error");
const User = require("../models/user");
const Lesson = require("./lesson");
const LessonModel = require("../models/lesson");

const dateTimeFormat = require("../utils/dateTime.js");

exports.create = async (req, res, next) => {
  const user_id = req.userId;

  const { id, lesson_id, course_id, total_seconds, seconds_watched } = req.body;

  const updates = {
    user_id,
    lesson_id,
    course_id,
    total_seconds,
    seconds_watched,
    is_completed: 0,
    created_at: dateTimeFormat(),
    updated_at: dateTimeFormat(),
  };

  let response;

  try {
    if (id) {
      await LessonProgress.update(
        { id, is_completed: 0 },
        {
          seconds_watched,
          updated_at: dateTimeFormat(),
        }
      );
    } else {
      response = await LessonProgress.create(updates);
    }
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not able to create lesson progress.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Lesson Progress Updated Successfully",
    id: response?.data?.[0],
  });
};

exports.complete = async (req, res, next) => {
  const user_id = req.userId;
  const { id, total_seconds, lesson_id } = req.body;

  let response;
  try {
    response = await LessonProgress.update(
      { id, is_completed: 0, user_id },
      {
        total_seconds,
        seconds_watched: total_seconds,
        is_completed: 1,
        updated_at: dateTimeFormat(),
      }
    );
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not able to complete lesson progress.",
      500
    );
    return next(error);
  }

  if (response.data > 0) {
    //actually updated
    try {
      req.params = { id: lesson_id };
      req.anotherApi = true;

      let progress = User.getCourseProgress("course_categories",req.userId);
      let lesson = Lesson.getOne(req, res, next);

      [progress, lesson] = await Promise.all([progress, lesson]);

      if (lesson.id >= progress.current_lesson_id) {
        let current_category_id = progress.current_category_id;
        let current_course_id = progress.current_course_id;
        let current_lesson_id = progress.current_lesson_id;

        if (lesson.next_lesson_id && !lesson.is_another_course) {
          current_lesson_id = lesson.next_lesson_id;
        } else {
          current_lesson_id = lesson_id + 1;

          const nextLessonData = await LessonModel.getOneThree({
            "lessons.id": current_lesson_id,
          });

          if (nextLessonData) {
            current_course_id = nextLessonData.course_id;
            current_category_id = nextLessonData.course_category_id;
          } else {
            current_category_id = lesson.course_data.category_id + 1;
            current_course_id = lesson.course_data.id + 1;
          }
        }

        await User.update(
          { id: user_id },
          {
            current_category_id,
            current_course_id,
            current_lesson_id,
            updated_at: dateTimeFormat(),
          }
        );
      }
    } catch (err) {
      console.log("err", err);
      const error = new HttpError(
        req,
        new Error().stack.split("at ")[1].trim(),
        "Something went wrong",
        500
      );
      return next(error);
    }
  }

  res.status(201).json({
    status: true,
    message: "Lesson Progress Completed Successfully",
    resultToSend: req.resultToSend,
  });
};
