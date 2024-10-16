const table = "job_types";

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

exports.getAll = async (query = {}, notQuery = {}, user_id="") => {
  return new Promise((resolve, reject) => {
    DB(table)
      .where(query)
      .select("job_types.id", "job_types.name")
      .whereNot(notQuery)
      
      .leftJoin("employer_job_posts as ejp", function (){
        this.on("job_types.id", "ejp.job_type")
        .andOn('ejp.is_posted', '=', 1)
        .andOn('ejp.is_delete', '=', 0)
        .andOn('ejp.is_active', '=', 1)
        .andOn('ejp.is_hired', '=', 0)
        .andOn('ejp.is_under_review', '=', 0);
      })
      // .leftJoin("job_seeker_applied_jobs", "job_seeker_applied_jobs.job_id", "=", "ejp.id")
      .leftJoin("job_seeker_applied_jobs", function () {
        this.on("job_seeker_applied_jobs.job_id", "=", "ejp.id")
          .andOn("job_seeker_applied_jobs.job_seeker_id", "=", user_id);
      })
      
      // .count('ejp.id as count')
      .select(DB.raw('COUNT(ejp.id) - COUNT(job_seeker_applied_jobs.id) as count'))
      .groupBy('job_types.id', 'job_types.name')
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

exports.getMany = async (args) => {
  return new Promise((resolve, reject) => {
    let totalRecords;

    //for count
    let countQuery = DB(table);
    countQuery.where(args.match);
    countQuery.count("id as count");
    if (args.name && args.name != "") {
      countQuery.whereILike("name", "%" + args.name + "%");
    }
    countQuery
      .then(function (record) {
        totalRecords = record[0].count;

        //for data
        let dataQuery = DB(table);
        dataQuery.where(args.match);
        if (args.name && args.name != "") {
          dataQuery.whereILike("name", "%" + args.name + "%");
        }

        dataQuery
          .orderBy(args?.sort_by || "created_at", args?.order || "desc")
          .limit(args?.per_page || 100)
          .offset((args?.page - 1) * args?.per_page || 0)
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
};
