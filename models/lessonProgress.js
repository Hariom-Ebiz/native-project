const table = "lesson_progress";

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

exports.getBasedOnLesson = async (ids, userId) => {
  return new Promise((resolve, reject) => {
    DB("lesson_progress")
      .select("seconds_watched", "total_seconds", "is_completed", "lesson_id")
      .whereIn("lesson_id", ids)
      .where("user_id", userId)
      .then(function (record) {
        resolve(record);
      })
      .catch(function (error) {
        console.log("err", error);
        resolve(null);
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

exports.getOne = async (query, notQuery = {}) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .where(query)
      .whereNot(notQuery)
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

// exports.upsert = async (data) => {
//   return new Promise((resolve, reject) => {
//     DB(table)
//       .insert(data)
//       .onConflict(["user_id", "lesson_id", "course_id"])
//       .merge()
//       .returning("*")
//       .then(function (record) {
//         resolve({ status: true, data: record });
//       })
//       .catch(function (error) {
//         console.log("err", error);
//         resolve({ status: false, data: error });
//       });
//   });
// };
