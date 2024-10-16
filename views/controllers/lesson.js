const fs = require("fs").promises;
const path = require("path");
const { getVideoDurationInSeconds } = require("get-video-duration");

const buff = Buffer.alloc(100);
const header = Buffer.from("mvhd");

const Lesson = require("../models/lesson");
const Common = require("../models/common");
const HttpError = require("../http-error");
const Course = require("../models/course");
const User = require("../models/user");
const LessonProgress = require("../models/lessonProgress");

const dateTimeFormat = require("../utils/dateTime.js");

const getVideoLength = async (filename) => {
  const directoryPath = path.resolve(
    __dirname,
    "..",
    "uploads",
    "images",
    "lesson",
    filename
  );

  const duration = await getVideoDurationInSeconds(directoryPath);
  return duration;

  // const file = await fs.open(directoryPath, "r");
  // const { buffer } = await file.read(buff, 0, 100, 0);

  // await file.close();

  // const start = buffer.indexOf(header) + 17;
  // const timeScale = buffer.readUInt32BE(start);
  // const duration = buffer.readUInt32BE(start + 4);

  // const audioLength = Math.floor((duration / timeScale) * 1000) / 1000;

  // return audioLength;
};

exports.create = async (req, res, next) => {
  const {
    title,
    short_description,
    long_description,
    course_id,
    order_number,
    id,
    is_assessment,
    is_excel,
    assessment,
  } = req.body;

  const files = req.files;

  const image = files.image[0].path;

  const updates = {
    title,
    short_description,
    long_description,
    course_id,
    order_number,
    image,
    created_at: dateTimeFormat(),
    updated_at: dateTimeFormat(),
    id,
    is_assessment,
    is_excel,
    assessment,
  };

  if (files.video && files.video.length > 0) {
    updates.video = files.video[0].path;

    updates.total_seconds = await getVideoLength(files.video[0].filename);
  }

  if (files.document && files.document.length > 0) {
    updates.document = files.document[0].path;
  }

  if (updates.video && updates.document) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "You cannot upload both video and pdf.",
      422
    );
    return next(error);
  }

  try {
    await Lesson.create(updates);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not able to create lesson.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    status: true,
    message: "Lesson Created Successfully",
  });
};

exports.update = async (req, res, next) => {
  const {
    id,
    title,
    short_description,
    long_description,
    course_id,
    order_number,
  } = req.body;

  const extras = {
    updated_at: dateTimeFormat(),
    title,
    short_description,
    long_description,
    course_id,
    order_number,
  };

  const files = req.files;

  if (files.image && files.image.length > 0) {
    extras.image = files.image[0].path;
  }

  if (files.video && files.video.length > 0) {
    extras.video = files.video[0].path;

    extras.total_seconds = await getVideoLength(files.video[0].filename);
  }

  if (files.document && files.document.length > 0) {
    extras.document = files.document[0].path;
  }

  try {
    await Lesson.update({ id }, extras);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not able to update lesson.",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Lesson Updated Successfully",
  });
};

exports.getOne = async (req, res, next) => {
  const { id } = req.params;

  let lesson;

  try {
    lesson = await Lesson.getOne(
      { "lessons.id": id },
      { "lesson_progress.user_id": req.userId }
    );
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not able to fetch.",
      500
    );
    return next(error);
  }

  if (!lesson) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Lesson not found",
      404
    );
    return next(error);
  }

  let nextLesson, course, progress, nextCourse, nextCourseLesson;

  try {
    nextLesson = Lesson.getOneTwo({
      "lessons.course_id": lesson.course_id,
      "lessons.order_number": lesson.order_number + 1,
    });

    course = Course.getOne({ id: lesson.course_id });

    progress = User.getCourseProgress("course_categories",req.userId);

    [nextLesson, course, progress] = await Promise.all([
      nextLesson,
      course,
      progress,
    ]);

    nextCourse = await Course.getOne({
      category_id: course.category_id,
      order_number: course.order_number + 1,
    });

    if (!nextCourse) {
      nextCourse = await Course.getOne({
        category_id: course.category_id + 1,
        order_number: 1,
      });
    }

    lesson.is_different_category = false;

    if (nextCourse) {
      nextCourseLesson = await Lesson.getOneTwo({
        "lessons.course_id": nextCourse.id,
        "lessons.order_number": 1,
      });

      if (course.category_id !== nextCourse.category_id) {
        lesson.is_different_category = true;
      }
    }
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not able to fetch.",
      500
    );
    return next(error);
  }

  let previousLesson;

  try {
    //can be id - 1;
    lesson.prev_lesson_id = null;

    previousLesson = await Lesson.getOneTwo({
      "lessons.course_id": lesson.course_id,
      "lessons.order_number": lesson.order_number - 1,
    });

    if (!previousLesson) {
      previousLesson = await Lesson.raw(
        "SELECT * FROM lessons WHERE `course_id` = ? ORDER BY order_number DESC LIMIT 1",
        [lesson.course_id - 1]
      );

      if (previousLesson.status && previousLesson.data.length > 0) {
        lesson.prev_lesson_id = previousLesson.data[0].id;
      }
    } else {
      lesson.prev_lesson_id = previousLesson.id;
    }
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not able to fetch.",
      500
    );
    return next(error);
  }

  let isError = false;

  if ("current_course_id" in progress) {
    if (progress.current_category_id < course.category_id) {
      isError = true;
    } else if (
      progress.current_category_id === course.category_id &&
      progress.current_sequence_mandatory == 1 &&
      progress.current_course_id < lesson.course_id
    ) {
      isError = true;
    } else if (
      progress.current_category_id === course.category_id &&
      progress.current_sequence_mandatory == 1 &&
      progress.current_lesson_id < id
    ) {
      isError = true;
    }
  }

  if (!req.anotherApi && isError) {
    return res.status(200).json({
      status: true,
      message: "Lesson Fetched Successfully",
      lesson: {},
    });
  }

  lesson.course_data = course;

  if (nextLesson) {
    lesson.next_lesson_id = nextLesson.id;
    lesson.is_another_course = false;
  } else if (nextCourseLesson) {
    lesson.next_lesson_id = nextCourseLesson.id;
    lesson.is_another_course = true;
  } else {
    lesson.next_lesson_id = null;
  }

  if (
    "current_course_id" in progress &&
    (lesson.document || lesson.is_assessment == 1)
  ) {
    // await LessonProgress.upsert({
    //   user_id: req.userId,
    //   lesson_id: lesson.id,
    //   course_id: lesson.course_id,
    //   total_seconds: 1,
    //   seconds_watched: 1,
    //   is_completed: 1,
    //   created_at: dateTimeFormat(),
    //   updated_at: dateTimeFormat(),
    // });

    const isExits = await LessonProgress.getOne({
      user_id: req.userId,
      lesson_id: lesson.id,
      course_id: lesson.course_id,
    });

    if (!isExits) {
      if (lesson.is_assessment == 1) {
        const response = await LessonProgress.create({
          user_id: req.userId,
          lesson_id: lesson.id,
          course_id: lesson.course_id,
          total_seconds: 1,
          seconds_watched: 1,
          is_completed: 0,
          created_at: dateTimeFormat(),
          updated_at: dateTimeFormat(),
        });

        lesson.assessment_progress_id = response?.data?.[0];
      } else {
        lesson.is_completed = 1;
        await LessonProgress.create({
          user_id: req.userId,
          lesson_id: lesson.id,
          course_id: lesson.course_id,
          total_seconds: 1,
          seconds_watched: 1,
          is_completed: 1,
          created_at: dateTimeFormat(),
          updated_at: dateTimeFormat(),
        });
      }
    } else {
      if (lesson.is_assessment == 1) {
        lesson.assessment_progress_id = isExits.id;
      }
    }
  }

  if (
    "current_course_id" in progress &&
    lesson.document &&
    lesson.id >= progress.current_lesson_id
  ) {
    let current_category_id = progress.current_category_id;
    let current_course_id = progress.current_course_id;
    let current_lesson_id = progress.current_lesson_id;

    if (lesson.next_lesson_id && !lesson.is_another_course) {
      current_lesson_id = lesson.next_lesson_id;
    } else {
      current_lesson_id = lesson.id + 1;

      const nextLessonData = await Lesson.getOneThree({
        "lessons.id": current_lesson_id,
      });

      if (nextLessonData) {
        current_course_id = nextLessonData.course_id;
        current_category_id = nextLessonData.course_category_id;
      } else {
        current_course_id = lesson.course_data.id + 1;
        current_category_id = lesson.course_data.category_id + 1;
      }
    }

    await Promise.all([
      User.update(
        { id: req.userId },
        {
          current_category_id,
          current_course_id,
          current_lesson_id,
          updated_at: dateTimeFormat(),
        }
      ),
      // LessonProgress.create({
      //   user_id: req.userId,
      //   lesson_id: lesson.id,
      //   course_id: lesson.course_id,
      //   total_seconds: 1,
      //   seconds_watched: 1,
      //   is_completed: 1,
      //   created_at: dateTimeFormat(),
      //   updated_at: dateTimeFormat(),
      // }),
    ]);
  }

  try {
    if (course.category_id == 3) {
      const isThirdCategoryCompleted =
        await Lesson.checkThirdCategoryIsCompleted(req.userId ?? 0);

      lesson.is_third_category_completed = isThirdCategoryCompleted;
    } else {
      lesson.is_third_category_completed = false;
    }
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not able to fetch.",
      500
    );
    return next(error);
  }

  let completed_percentage = 0;
  if (lesson.seconds_watched != null) {
    completed_percentage =
      (lesson.seconds_watched / lesson.total_seconds) * 100;
    completed_percentage = +completed_percentage.toFixed(0);
  }

  lesson.is_completed = lesson.is_completed === 1;

  if (lesson.is_completed === 1) {
    completed_percentage = 100;
  }

  lesson.completed_percentage = completed_percentage;

  // delete lesson.total_seconds;
  // delete lesson.seconds_watched;

  if (lesson.is_assessment == 1) {
    switch (lesson.assessment) {
      case "career_values":
        {
          let [values, titles] = await Promise.all([
            Common.getAll("core_values"),
            Common.getAll("core_value_titles"),
          ]);

          values = values?.record.map((r) => ({
            id: r.id.toString(),
            content: r.value,
            description: r.description,
          }));

          const titlesArr = ["Choose Values"],
            bgColours = [null],
            maxLimit = [1000];

          titles.record.forEach((t) => {
            titlesArr.push(t.title);
            bgColours.push(t.background_colour);
            maxLimit.push(t.max_limit);
          });

          lesson.assessmentData = {
            values,
            titles: titlesArr,
            bgColours,
            maxLimit,
          };
        }
        break;
      case "career_interests": {
        let [statements, categories] = await Promise.all([
          Common.getAll("career_interests"),
          Common.getAll("career_interest_categories"),
        ]);

        lesson.assessmentData = {
          statements: statements.record,
          categories: categories.record,
        };

        break;
      }
      case "motivated_skills": {
        const motivatedSkills = await Common.getAll("motivated_skills");
        lesson.assessmentData = {
          motivatedSkills: motivatedSkills?.record.map((s) => ({
            id: s.id.toString(),
            content: s.skill,
            description: s.description,
          })),
        };
        break;
      }
      case "personality_type": {
        const types = await Common.getAll("personality_types");

        const data = types?.record ?? [];

        const size = 4;
        const arrayOfArrays = [];

        for (let i = 0; i < data.length; i += size) {
          arrayOfArrays.push(data.slice(i, i + size));
        }

        lesson.assessmentData = {
          types: arrayOfArrays,
        };
        break;
      }
      default: {
      }
    }
  }

  if (req.anotherApi) {
    return lesson;
  }

  res.status(200).json({
    status: true,
    message: "Lesson Fetched Successfully",
    lesson,
  });
};

exports.getAll = async (req, res, next) => {
  let lessons;

  try {
    lessons = await Lesson.getMany({
      page: 1,
      per_page: 100,
      sort_by: "order_number",
      order: "asc",
    });
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not fetch lessons.",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Lessons Fetched Successfully",
    lessons: lessons?.data,
  });
};

exports.getAllLessons = async (req, res, next) => {
  let lessons, course, progress;
  const courseId = +req.params.id;

  try {
    lessons = Lesson.getManyClient({
      page: 1,
      per_page: 100,
      sort_by: "order_number",
      order: "asc",
      match: {
        "lessons.course_id": courseId,
      },
      matchTwo: {
        // "lesson_progress.user_id": 2,
        user_id: req.userId ?? 0,
      },
    });

    course = Course.getOne({ id: courseId });

    progress = User.getCourseProgress("course_categories",req.userId);

    [lessons, course, progress] = await Promise.all([
      lessons,
      course,
      progress,
    ]);
  } catch (err) {
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not able to fetch lessons.",
      500
    );
    return next(error);
  }

  let isError = false;
  //user logged in
  if ("current_course_id" in progress) {
    if (progress.current_category_id < course.category_id) {
      isError = true;
    } else if (
      progress.current_category_id === course.category_id &&
      progress.current_sequence_mandatory == 1 &&
      progress.current_course_id < courseId
    ) {
      isError = true;
    }
  }

  if (isError) {
    return res.status(200).json({
      status: true,
      message: "Lessons Fetched Successfully",
      lessons: [],
      course: {},
    });
  }

  const data = lessons?.data.map((lesson) => {
    let completed_percentage = 0;
    if (lesson.seconds_watched != null) {
      completed_percentage =
        (lesson.seconds_watched / lesson.total_seconds) * 100;
      completed_percentage = +completed_percentage.toFixed(0);
    }

    if (lesson.is_completed === 1) {
      completed_percentage = 100;
    }

    delete lesson.total_seconds;
    delete lesson.seconds_watched;

    return {
      ...lesson,
      is_completed: lesson.is_completed === 1,
      completed_percentage,
    };
  });

  res.status(200).json({
    status: true,
    message: "Lessons Fetched Successfully",
    lessons: data,
    course,
    progress,
  });
};

exports.updateId = async (req, res, next) => {
  const lastId = 74;
  const firstId = 27;

  for (let i = lastId; i >= firstId; i--) {
    await LessonProgress.update(
      {
        lesson_id: i,
      },
      {
        lesson_id: i + 1,
      }
    );
  }

  res.status(200).json({
    status: true,
    message: "DONE",
  });
};
