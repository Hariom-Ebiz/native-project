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

    if (isAlreadyExist) {
      await Common.delete("assessment_result",{type, user_id: userId})
    }

      let savedArr = [];
      if(type == "carrer_value") {
        if (Array.isArray(result[0])) {
          result[0].map(av => {
            savedArr.push(
              {
                user_id: userId,
                type,
                career_value_type: "always_valued",
                result: av,
                created_at: dateTimeFormat(),
                updated_at: dateTimeFormat(),
              }
            )
          })
          savedArr.push({
            user_id: userId,
            type,
            result: JSON.stringify(result),
            created_at: dateTimeFormat(),
            updated_at: dateTimeFormat(),
          })
        } else {
          result.map(av => {
            savedArr.push(
              {
                user_id: userId,
                type,
                career_value_type: "always_valued",
                result: av,
                created_at: dateTimeFormat(),
                updated_at: dateTimeFormat(),
              }
            )
          })
        }
      } else {
        if (Array.isArray(result)) {
          result.map(f => {
            savedArr.push({
              user_id: userId,
              type,
              result: f,
              created_at: dateTimeFormat(),
              updated_at: dateTimeFormat(),
            })
          })
        } else {
          savedArr.push({
            user_id: userId,
            type,
            result: JSON.stringify(result),
            created_at: dateTimeFormat(),
            updated_at: dateTimeFormat(),
          })
        }
      }

      await AssessmentResult.create(savedArr);

      req.body = {
        id: progressId,
        total_seconds: 1,
        lesson_id: lessonId,
      };

      LessonProgress.complete(req, res, next);
      return;
    // } else {
    //   await AssessmentResult.update(
    //     { id: isAlreadyExist.id },
    //     {
    //       result: JSON.stringify(result),
    //       updated_at: dateTimeFormat(),
    //     }
    //   );
    // }
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
