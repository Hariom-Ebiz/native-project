const table = "faq_category";

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

exports.getMany = async (args) => {
  return new Promise((resolve, reject) => {
    let totalRecords;

    //for count
    let countQuery = DB(table);
    countQuery.count("id as count");
    if (args.category && args.category != "") {
      countQuery.whereILike("category", "%" + args.category + "%");
    }
    if (args.is_active != "" && (args.is_active == "true" || args.is_active == "false")) {
      countQuery.where("is_active",(args.is_active == "true") ? 1 : 0);
    }
    countQuery
      .then(function (record) {
        totalRecords = record[0].count;

        //for data
        let dataQuery = DB(table);
        if (args.category && args.category != "") {
          dataQuery.whereILike("category", "%" + args.category + "%");
        }

        if (args.is_active != "" && (args.is_active == "true" || args.is_active == "false")) {
            dataQuery.where("is_active",(args.is_active == "true") ? 1 : 0);
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
            resolve({ status: false, data: error });
          });
      })
      .catch(function (error) {
        console.log(error);
        resolve({ status: false, data: error });
      });
  });
};

exports.getAll = async (query = {}) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .where(query)      
      .then(function (record) {
        resolve(record);
      })
      .catch(function (error) {
        console.log(error);
        resolve(null);
      });
  });
};
