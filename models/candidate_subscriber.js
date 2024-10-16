const moment = require("moment");

const table = "candidate_subscriber";

exports.create = async (data) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .insert(data)

      .then(function (record) {
        resolve({ status: true, data: record });
      })
      .catch(function (error) {
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

exports.getOne = async (query) => {
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

exports.getMany = async () => {
  return new Promise((resolve, reject) => {
    let totalRecords;

    let dataQuery = DB(table);

    dataQuery
      .orderBy("created_at", "desc")
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
  });
};

exports.getAllByUsers = async () => {
  return new Promise((resolve, reject) => {
    let dataQuery = DB(table);
    dataQuery.where({ "is_active": 1 });
    dataQuery
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

exports.updateCandidateSubsExpiry = async () => {
  return new Promise((resolve, reject) => {
    let query = DB(table);
    query.where(DB.raw("DATE(`end`)"), "<", moment(new Date()).format("YYYY-MM-DD"))
    query.where("is_expire", "=", "0")
    query.update({ "is_expire": 1 })
      .then(v => {
        resolve({
          status: true,
          result: v
        })
      })
      .catch(err => {
        console.log("Auto Expire Error: ", err);
        resolve({
          status: false,
          result: {}
        })
      })
  })
}

exports.getComingExpiration = async () => {
  return new Promise((resolve, reject) => {
    let query = DB(table).select("candidate_subscriber.*", "candidate_subscriptions.title", "users.first_name", "users.email");
    query.where(function () {
      this.where(DB.raw("DATE(`end`)"), "=", moment().add(30, "days").format("YYYY-MM-DD"))
        .orWhere(DB.raw("DATE(`end`)"), "=", moment().add(15, "days").format("YYYY-MM-DD"))
        .orWhere(DB.raw("DATE(`end`)"), "=", moment().add(7, "days").format("YYYY-MM-DD"))
        .orWhere(DB.raw("DATE(`end`)"), "=", moment().add(2, "days").format("YYYY-MM-DD"))
    })
    query.where("is_expire", "=", "0")
    query.orderBy("end", "DESC")
    query.groupBy("job_seeker_id")
      .leftJoin("candidate_subscriptions", "candidate_subscriptions.id", "=", "candidate_subscriber.subscription_id")
      .leftJoin("users", "users.id", "=", "candidate_subscriber.job_seeker_id")
      .then(v => {
        resolve({
          status: true,
          result: v
        })
      })
      .catch(err => {
        console.log("Auto Expire Error: ", err);
        resolve({
          status: false,
          result: {}
        })
      })
  })
}

exports.getMyMemberships = async (userId) => {
  return new Promise((resolve, reject) => {
    let query = DB(table).select("candidate_subscriber.*", "candidate_subscriptions.title");
    query.where("job_seeker_id", userId)
    query.orderBy("end", "DESC")
      .leftJoin("candidate_subscriptions", "candidate_subscriptions.id", "=", "candidate_subscriber.subscription_id")
      .then(async v => {

        const finalResult = [];
        for await (const subscriber of v) {
          let totalLessons = [{ count: 0 }];
          let completedLessons = [{ count: 0 }];
          let packageName = { title: "" }

          if (subscriber.course_type == "career_coaching") {
            totalLessons = await DB("lessons").count("id as count");
            completedLessons = await DB(`lesson_progress`)
              .count("id as count")
              .where("user_id", "=", userId)
              .andWhere("is_completed", "=", 1)
          }
          else if (subscriber.course_type == "functional_mastery") {
            const package_id = subscriber.sub_course_type;
            if (package_id) {
              packageName = await DB("functional_mastery_courses_packages").select("title").where("id", "=", package_id).first()
              totalLessons = await DB("functional_mastery_lessons as fml").leftJoin("functional_mastery_courses as fmc", "fml.course_id", "=", "fmc.id").where("fmc.package_id", "=", package_id).count('fml.id as count');
              completedLessons = await DB("functional_mastery_lesson_progress as fmlp").leftJoin("functional_mastery_courses as fmc", "fmlp.course_id", "=", "fmc.id").where("fmc.package_id", "=", package_id).andWhere("fmlp.user_id", "=", userId).andWhere("fmlp.is_completed", "=", 1).count("fmlp.id as count")
            }
          }
          else if (subscriber.course_type == "standout") {

            totalLessons = await DB("standout_lessons").count("id as count")
            completedLessons = await DB("standout_lesson_progress").where("user_id", "=", userId).andWhere("is_completed", "=", 1)
              .count("id as count")

          }
          finalResult.push({ ...subscriber, totalLessons: totalLessons[0].count, completedLessons: completedLessons[0].count, sub_course_type_name: packageName.title })
        }

        resolve({
          status: true,
          result: finalResult
        })
      })
      .catch(err => {
        console.log("Auto Expire Error: ", err);
        resolve({
          status: false,
          result: []
        })
      })
  })
}