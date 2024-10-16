const table = "job_seeker_post_graduations";

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

exports.getOne = async (query = {}, notQuery = {}) => {
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

exports.getAll = async (query = {}, notQuery = {}) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .where(query)
      .whereNot(notQuery)
      .then(function (record) {
        resolve(record);
      })
      .catch(function (error) {
        console.log(error);
        resolve([]);
      });
  });
};

exports.getAllDetailed = async (query = {}, notQuery = {}) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .select(
        "job_seeker_post_graduations.*",
        "countries.name as country_name",
        "grades.name as grade_name",
        "post_graduation_degree_levels.name as degree_level_name",
        "study_fields.name as field_of_study_name"
      )
      .leftJoin(
        "countries",
        "countries.id",
        "=",
        "job_seeker_post_graduations.country"
      )
      .leftJoin("grades", "grades.id", "=", "job_seeker_post_graduations.grade")
      .leftJoin(
        "post_graduation_degree_levels",
        "post_graduation_degree_levels.id",
        "=",
        "job_seeker_post_graduations.degree_level"
      )
      .leftJoin(
        "study_fields",
        "study_fields.id",
        "=",
        "job_seeker_post_graduations.field_of_study"
      )
      .where(query)
      .whereNot(notQuery)
      .then(function (record) {
        resolve(record);
      })
      .catch(function (error) {
        console.log(error);
        resolve([]);
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
