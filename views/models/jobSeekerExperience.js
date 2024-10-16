const table = "job_seeker_experiences";

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
      "job_seeker_experiences.*",
      "job_types.name as job_type_name",
      "job_categories.name as job_category_name",
      "job_industries.name as industry_name",  
      "countries.name as country_name",
      "cities.name as city_name"    
    )
    .leftJoin(
      "job_types",
      "job_types.id",
      "=",
      "job_seeker_experiences.job_type"
    )
    .leftJoin("job_categories", "job_categories.id", "=", "job_seeker_experiences.job_category")   
    .leftJoin(
      "job_industries",
      "job_industries.id",
      "=",
      "job_seeker_experiences.industry"
    )
    .leftJoin(
      "countries",
      "countries.id",
      "=",
      "job_seeker_experiences.country"
    )
    .leftJoin(
      "cities",
      "cities.id",
      "=",
      "job_seeker_experiences.city"
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
