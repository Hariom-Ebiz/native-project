const AssessmentResult = require("../models/assessmentResult");
const LessonProgress = require("../controllers/lessonProgress");
const Common = require("../models/common");

const HttpError = require("../http-error");
const dateTimeFormat = require("../utils/dateTime.js");

exports.add = async (req, res, next) => {
  const userId = req.userId;
  let { type, result, progressId, lessonId } = req.body;

  try {
    let isAlreadyExist = await AssessmentResult.getOne({
      user_id: userId,
      type,
    });

    if (type == "personality_type") {
      let trait;
      let resultToSend = null;

      trait = await Common.getOne("personality_summaries", { id: result });

      if (!trait) {
        const error = new HttpError(
          req,
          new Error().stack.split("at ")[1].trim(),
          "Something went wrong",
          500
        );
        return next(error);
      }

      resultToSend = trait;
      req.resultToSend = resultToSend;
    }

    if (!isAlreadyExist) {
      await AssessmentResult.create({
        user_id: userId,
        type,
        result: JSON.stringify(result),
        created_at: dateTimeFormat(),
        updated_at: dateTimeFormat(),
      });

      req.body = {
        id: progressId,
        total_seconds: 1,
        lesson_id: lessonId,
      };

      LessonProgress.complete(req, res, next);
      return;
    } else {
      await AssessmentResult.update(
        { id: isAlreadyExist.id },
        {
          result: JSON.stringify(result),
          updated_at: dateTimeFormat(),
        }
      );
    }
  } catch (err) {
    console.log("err", err);
    const error = new HttpError(
      req,
      new Error().stack.split("at ")[1].trim(),
      "Could not submit result",
      500
    );
    return next(error);
  }

  res.status(200).json({
    status: true,
    message: "Result submitted successfully.",
    resultToSend: req.resultToSend,
  });
};
