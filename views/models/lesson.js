const Course = require("../models/course");
const table = "lessons";

exports.create = async (data) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .insert(data)
      
      .then(function (record) {
        resolve({ status: true, data: record });
      })
      .catch(function (error) {
        console.log("err", error);
        resolve({ status: false, data: error });
      });
  });
};

exports.update = async (query, data) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .where({ ...query })
      .update(data)
      .then(function (record) {
        resolve({ status: true, data: record });
      })
      .catch(function (error) {
        resolve({ status: false, data: error });
      });
  });
};

exports.getOne = async (query, queryTwo = {}) => {
  return new Promise((resolve, reject) => {
    DB(table)
      //   .select(
      //     "lessons.*",
      //     "lesson_progress.seconds_watched",
      //     "lesson_progress.is_completed"
      //   )
      //   .leftJoin(
      //     "lesson_progress",
      //     "lesson_progress.lesson_id",
      //     "=",
      //     "lessons.id"
      //   )
      .where(query)
      .first()
      .then(function (record) {
        if (record) {
          DB("lesson_progress")
            .select(
              "seconds_watched",
              "total_seconds",
              "is_completed",
              "lesson_id",
              "id as progress_id"
            )
            .where("lesson_id", record.id)
            .where(queryTwo)
            .first()
            .then((progressData) => {
              resolve({
                ...record,
                ...(progressData ? progressData : {}),
              });
            })
            .catch((err) => {
              console.log(err);
              resolve(null);
            });
        } else {
          resolve(null);
        }
      })
      .catch(function (error) {
        console.log(error);
        resolve(null);
      });
  });
};

exports.delete = async (match) => {
  return new Promise((resolve, reject) => {
    let query = DB(table);
    query
      .where(match)
      .del()
      .then(function (record) {
        resolve({ status: true });
      })
      .catch(function (error) {
        resolve({ status: false });
      });
  });
};

exports.getMany = async (args) => {
  return new Promise((resolve, reject) => {
    let dataQuery = DB(table);

    dataQuery
      .where(args.match || {})
      .orderBy(args?.sort_by || "created_at", args?.order || "desc")
      .limit(args?.per_page || 100)
      .offset((args?.page - 1) * args?.per_page || 0)
      .then(function (record) {
        resolve({
          status: true,
          data: record,
        });
      })
      .catch(function (error) {
        console.log(error);
        resolve({ status: false, data: error });
      });
  });
};

exports.getManyClient = async (args) => {
  return new Promise((resolve, reject) => {
    let dataQuery = DB(table);

    dataQuery
      .where(args.match || {})
      //   .orWhere(args.matchTwo || {})
      //   .select(
      //     "lessons.id",
      //     "lessons.title",
      //     "lessons.image",
      //     "lessons.short_description",
      //     "lessons.total_seconds",
      //     "lesson_progress.seconds_watched",
      //     "lesson_progress.is_completed"
      //   )
      //   .leftJoin(
      //     "lesson_progress",
      //     "lesson_progress.lesson_id",
      //     "=",
      //     "lessons.id"
      //   )
      .orderBy(args?.sort_by || "created_at", args?.order || "desc")
      //   .limit(args?.per_page || 100)
      //   .offset((args?.page - 1) * args?.per_page || 0)
      .then(function (record) {
        DB("lesson_progress")
          .select(
            "seconds_watched",
            "total_seconds",
            "is_completed",
            "lesson_id"
          )
          .whereIn(
            "lesson_id",
            record.map((r) => r.id)
          )
          .where(args.matchTwo)
          .then((progressData) => {
            record = record.map((r) => {
              const pData =
                progressData.find((pd) => pd.lesson_id === r.id) || {};

              return {
                ...r,
                ...pData,
              };
            });

            resolve({
              status: true,
              data: record,
            });
          })
          .catch((err) => {
            console.log(err);
            resolve({ status: false, data: err });
          });
      })
      .catch(function (error) {
        console.log(error);
        resolve({ status: false, data: error });
      });
  });
};

exports.getOneTwo = async (query, queryTwo = {}) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .where(query)
      .first()
      .then(function (record) {
        resolve(record);
      })
      .catch(function (error) {
        console.log(error);
        resolve(null);
      });
  });
};

exports.getOneThree = async (query) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .where(query)
      .first()
      .select(
        "lessons.id as lesson_id",
        "courses.id as course_id",
        "courses.category_id as course_category_id"
      )
      .leftJoin("courses", "courses.id", "=", "lessons.course_id")
      .then(function (record) {
        resolve(record);
      })
      .catch(function (error) {
        console.log(error);
        resolve(null);
      });
  });
};

exports.checkThirdCategoryIsCompleted = async (userId = 2) => {
  return new Promise(async (resolve, reject) => {
    const { data: courses } = await Course.getMany({
      query: { category_id: 3 },
      page: 0,
    });
    const courseIds = courses.map((c) => c.id);

    let dataQuery = DB(table);

    dataQuery
      .whereIn("course_id", courseIds)
      .then(function (record) {
        DB("lesson_progress")
          .select(
            "seconds_watched",
            "total_seconds",
            "is_completed",
            "lesson_id"
          )
          .whereIn(
            "lesson_id",
            record.map((r) => r.id)
          )
          .where({ user_id: userId })
          .then((progressData) => {
            record = record.map((r) => {
              const pData =
                progressData.find((pd) => pd.lesson_id === r.id) || {};

              return {
                ...r,
                ...pData,
              };
            });

            record = record.map((r) => r.is_completed);
            record = record.every((r) => r == 1);
            resolve(record);
          })
          .catch((err) => {
            console.log(err);
            resolve(false);
          });
      })
      .catch(function (error) {
        console.log(error);
        resolve(false);
      });
  });
};

exports.raw = async (raw, values = []) => {
  return new Promise((resolve, reject) => {
    DB.raw(raw, values)
      .then(function (record) {
        resolve({ status: true, data: record[0] });
      })
      .catch(function (error) {
        console.log("err", error);
        resolve({ status: false, data: error });
      });
  });
};
