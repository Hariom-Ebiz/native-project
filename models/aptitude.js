const aptitudeQuestionTable = "aptitude_questions";
const aptitudeQuestionOptionsTable = "aptitude_questions_options";

exports.addQuestion = async (insertData) => {
  try {
    const resp = await DB(aptitudeQuestionTable)
      .insert(insertData)
    return { status: true, data: resp }
  } catch (err) {
    console.log("err", err);
    return { status: false, data: err }
  }
}

exports.addQuestionsPart = async (insertData) => {
  try {
    const resp = await DB("aptitude_questions_part")
      .insert(insertData)
    return { status: true, data: resp }
  } catch (err) {
    console.log("err", err);
    return { status: false, data: err }
  }
}

exports.totalQuestionsInPart = async (part_id) => {
  try {
    const resp = await DB("aptitude_questions")
      .select(DB.raw("COUNT(*) as count"))
      .where("part_id", "=", part_id)
    return { status: true, data: resp }
  } catch (err) {
    console.log("err", err);
    return { status: false, data: err }
  }
}

exports.deletePartOnlyWithId = async (part_id) => {
  try {
    await DB("aptitude_questions_part")
    .where("id", "=", part_id)
    .del()

    return {status: true}
  } catch (error) {
      return {status: false}
  }
}


exports.deletePart = async (part_id) => {
  try {
    await DB.transaction(async (trx) => {
      // await trx('aptitude_questions_options')
      //   .whereIn('question_id', function () {
      //     this.select('question_id')
      //       .from('aptitude_questions')
      //       .where('part_id', part_id);
      //   })
      //   .del();

      await trx('aptitude_questions')
        .where('part_id', part_id)
        .del();

      await trx('aptitude_questions_part')
        .where('id', part_id)
        .del();
    });

    return { status: true }
  } catch (error) {
    return { status: false }
  }
}

exports.addOptions = async (insertData) => {
  try {
    await DB(aptitudeQuestionOptionsTable)
      .insert(insertData)
    return { status: true }
  } catch (err) {
    console.log("err", err);
    return { status: false }
  }
}

exports.deleteQuestionsByPart = async (part_id) => {
  try {
    await DB.transaction(async (trx) => {
      // await trx('aptitude_questions_options')
      //   .whereIn('question_id', function () {
      //     this.select('question_id')
      //       .from('aptitude_questions')
      //       .where('part_id', part_id);
      //   })
      //   .del();

      await trx('aptitude_questions')
        .where('part_id', part_id)
        .del();
    })
    return { status: true }
  } catch (err) {
    console.log("err", err);
    
    return { status: false }
  }
}

exports.getAllQuestions = async (args) => {
  return new Promise((resolve, reject) => {
    let totalRecords;

    //for count
    let countQuery = DB(aptitudeQuestionTable);

    countQuery.where(args.match);
    countQuery.count("id as count");
    if (args.question && args.question != "") {
      countQuery.whereILike("text", "%" + args.question + "%");
    }

    countQuery
      .then(function (record) {
        totalRecords = record[0].count;

        //for data
        let dataQuery = DB(aptitudeQuestionTable);
        dataQuery.where(args.match);
        if (args.question && args.question != "") {
          dataQuery.whereILike("text", "%" + args.question + "%");
        }

        dataQuery
          .select("aptitude_questions.*")
          .orderBy(args?.sort_by || "created_at", args?.order || "desc")
          .limit(args?.per_page || 100)
          .offset((args?.page - 1) * args?.per_page || 0)

        dataQuery
          .then(function (record) {
            resolve({
              status: true,
              data: record,
              totalDocuments: totalRecords,
            });
          })
          .catch(function (error) {
            console.log(error);
            resolve({ status: false, data: error });
          });
      })
      .catch(function (error) {
        console.log(error);
        resolve({ status: false, data: error });
      });
  });
}

exports.updateQuestion = async (query, data) => {
  return new Promise((resolve, reject) => {
    DB(aptitudeQuestionTable)
      .where({ ...query })
      .update(data)
      .then(function (record) {
        resolve({ status: true, data: record });
      })
      .catch(function (error) {
        console.log("error : ", error);
        resolve({ status: false, data: error });
      });
  });
}

exports.updateQuestionPart = async (query, data) => {
  return new Promise((resolve, reject) => {
    DB("aptitude_questions_part")
      .where({ ...query })
      .update(data)
      .then(function (record) {
        resolve({ status: true, data: record });
      })
      .catch(function (error) {
        console.log("error : ", error);
        resolve({ status: false, data: error });
      });
  });
}

exports.updateOptions = async (options) => {
  try {
    for await (const { query, data } of options) {
      await DB(aptitudeQuestionTable)
        .where({ ...query })
        .update(data)
    }
    return { status: true }
  } catch (error) {
    return { status: false, data: error }
  }
}

exports.deleteQuestion = async (args) => {
  return new Promise((resolve, reject) => {
    let query = DB(aptitudeQuestionTable);
    query
      .where(args)
      .del()
      .then(function (record) {
        resolve({ status: true });
      })
      .catch(function (error) {
        resolve({ status: false });
      });
  });
}


exports.getOnePart = async (query, notQuery = {}) => {
  return new Promise((resolve, reject) => {
    DB("aptitude_questions_part as aqp")
      .select("aqp.text as part_text", "aqp.id as part_id", "aqp.image as part_image", "aq.text as question_text", "aq.id as question_id", "aq.image as question_image", "aqo.id as option_id", "aqo.text as option_text", "aqo.image as option_image", "aqo.is_answer")
      .leftJoin("aptitude_questions as aq", "aqp.id", "=", "aq.part_id")
      .leftJoin("aptitude_questions_options as aqo", "aq.id", "=", "aqo.question_id")
      .where(query)
      .whereNot(notQuery)
      // .first()
      .then(function (record) {
        resolve(record);
      })
      .catch(function (error) {
        console.log("error : ", error);
        console.log(error);
        resolve(null);
      });
  });
}


exports.deleteOptions = async (matchQuery) => {
  return new Promise((resolve, reject) => {
    let query = DB(aptitudeQuestionOptionsTable);
    query
      .where(matchQuery)
      .del()
      .then(function (record) {
        resolve({ status: true });
      })
      .catch(function (error) {
        resolve({ status: false });
      });
  });
}

exports.getOneQuestion = async (query = {}, notQuery = {}) => {
  return new Promise((resolve, reject) => {
    DB(aptitudeQuestionTable)
      .where(query)
      .whereNot(notQuery)
      .first()
      .then(function (record) {
        resolve(record);
      })
      .catch(function (error) {
        console.log("error : ", error);
        console.log(error);
        resolve(null);
      });
  });
}

// exports.calculateScore = async({ aptitude_type, right_answer, wrong_answer }) => {
//   return new Promise((resolve, reject) => {
//     DB("aptitude_test_result")
//       .where({ aptitude_type })
//       .update({ right_answer, wrong_answer })
//       .then(function (record) {
//         resolve(record);
//       })
//       .catch(function (error) {
//         console.log("error : ", error);
//         console.log(error);
//         resolve(null);
//       });
//   });
// }


exports.calculateScore = async ({ question_id, option_id, type_id }) => {
  return new Promise((resolve, reject) => {
    DB("aptitude_test_result")
      .where({ question_id, option_id, type_id }) 
      .select("correct_option_id") 
      .then(function (record) {
        if (record) {
          const isCorrect = record.correct_option_id === option_id; // Check if the user's answer is correct
          resolve({
            correct: isCorrect
          });
        } else {
          resolve(null);
        }
      })
      .catch(function (error) {
        console.log("error : ", error);
        resolve(null);
      });
  });
};


exports.getOneQuestionOptions = async (question_id) => {
  return new Promise((resolve, reject) => {
    DB(aptitudeQuestionOptionsTable)
      .where("question_id", question_id)
      .then(function (record) {
        resolve(record);
      })
      .catch(function (error) {
        console.log("error : ", error);
        console.log(error);
        resolve(null);
      });
  });
}

exports.getUserAptitudeDetails = async (user_id) => {
  return new Promise((resolve, reject) => {
    DB("aptitudes")
      .select("aptitudes.id as aptitude_type_id", "aptitudes.name as aptitude_type_name", "atr.right_questions", "atr.total_questions", "atr.created_at as last_test_date")
      .leftJoin("aptitude_test_result as atr", function () {
        this.on("aptitudes.id", "=", "atr.aptitude_type")
          .andOn("atr.user_id", "=", user_id)
          .andOn("atr.created_at", "=", function () {
            this.select(DB.raw("MAX(atr2.created_at)"))
              .from("aptitude_test_result as atr2")
              .whereRaw("atr2.aptitude_type = atr.aptitude_type")
              .andWhere("atr2.user_id", user_id);
          });
      })
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        console.log("err", err);
        resolve(null);
      })
  })
}

exports.getAptitudeQuestions = async (user_id, type_id) => {
  return new Promise((resolve, reject) => {
    DB("aptitude_questions")
      .select("aptitude_questions.id", "aptitude_questions.text as question_text", "aptitude_questions.image as question_image", "aptitude_questions_options.text as option_text", "aptitude_questions_options.image as option_image", "aptitude_questions_options.id as option_id", "aptitudes.name as aptitude_type_name",
        DB.raw(`(
          SELECT created_at 
          FROM aptitude_test_result 
          WHERE aptitude_type = ? AND user_id = ? 
          ORDER BY id DESC 
          LIMIT 1
        ) as last_test_date`, [type_id, user_id])
      )
      .leftJoin("aptitude_questions_options", "aptitude_questions.id", "=", "aptitude_questions_options.question_id")
      .leftJoin("aptitudes", "aptitude_questions.aptitude_id", "=", "aptitudes.id")
      .where("aptitude_id", "=", type_id)
      .then((result) => {
        resolve(result)
      }).catch(err => {
        console.log("err ", err);

        resolve(null);
      })
  })
}

exports.getAptitudePart = async (user_id, type_id) => {
  return new Promise((resolve, reject) => {
    DB("aptitude_questions_part")
      .select("aptitude_questions_part.id as part_id","aptitude_questions_part.text as part_text", "aptitude_questions_part.image as part_image", "aptitude_questions.id as question_id", "aptitude_questions.text as question_text", "aptitude_questions.image as question_image", "aptitude_questions_options.text as option_text", "aptitude_questions_options.image as option_image", "aptitude_questions_options.id as option_id", "aptitudes.name as aptitude_type_name", "aptitudes.time as aptitude_type_time",
        DB.raw(`(
        SELECT created_at 
        FROM aptitude_test_result 
        WHERE aptitude_type = ? AND user_id = ? 
        ORDER BY id DESC 
        LIMIT 1
      ) as last_test_date`, [type_id, user_id])
      )
      .leftJoin("aptitude_questions", "aptitude_questions_part.id", "=", "aptitude_questions.part_id")
      .leftJoin("aptitude_questions_options", "aptitude_questions.id", "=", "aptitude_questions_options.question_id")
      .leftJoin("aptitudes", "aptitude_questions.aptitude_id", "=", "aptitudes.id")
      .where("aptitude_questions_part.aptitude_id", "=", type_id)
      .then((result) => {
        resolve(result)
      }).catch(err => {
        console.log("err ", err);
        resolve(null);
      })
  })
}

exports.submitAptitudeTest = async (answers) => {
  return new Promise((resolve, reject) => {
    DB("aptitude_questions_options")
      .select(DB.raw("COUNT(*) AS totalRightQuestions"))
      .where(function () {
        answers.forEach((ans, index) => {
          console.log("ans", ans);
          if (!ans) return;

          if (index === 0) {
            this.where(function () {
              this.where('id', ans.option_id)
                .andWhere('question_id', ans.question_id)
                .andWhere('is_answer', 1);
            });
          } else {
            this.orWhere(function () {
              this.where('id', ans.option_id)
                .andWhere('question_id', ans.question_id)
                .andWhere('is_answer', 1);
            });
          }
        })
      })
      .then((result) => {
        resolve(result[0])
      })
      .catch((err) => {
        console.log("err", err);

        resolve(null)
      })
  })
}

exports.addTestResult = async (insertData) => {
  try {
    await DB("aptitude_test_result")
      .insert(insertData)
    return { status: true }
  } catch (err) {
    console.log("err", err);
    return { status: false }
  }
}

exports.getUserAptitudeTests = async (args) => {
  return new Promise((resolve, reject) => {
    let totalRecords;

    //for count
    let countQuery = DB("aptitude_test_result");

    countQuery.where(args.match);
    countQuery.count("id as count");

    countQuery
      .then(function (record) {
        totalRecords = record[0].count;

        //for data
        let dataQuery = DB("aptitude_test_result");
        dataQuery.where(args.match);

        dataQuery
          .leftJoin("aptitudes", "aptitude_test_result.aptitude_type", "=", "aptitudes.id")
          .orderBy(args?.sort_by || "created_at", args?.order || "desc")
          // .sort({ "aptitude_type_id": 1 })
          .limit(args?.per_page || 100)
          .offset((args?.page - 1) * args?.per_page || 0)

        dataQuery
          .then(function (record) {
            resolve({
              status: true,
              data: record,
              totalDocuments: totalRecords,
            });
          })
          .catch(function (error) {
            console.log(error);
            resolve({ status: false, data: error });
          });
      })
      .catch(function (error) {
        console.log(error);
        resolve({ status: false, data: error });
      });
  });
}