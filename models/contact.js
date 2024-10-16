const table = "contacts";

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

exports.getAll = async () => {
  return new Promise((resolve, reject) => {
    let dataQuery = DB(table);
    dataQuery.where({});
    dataQuery
      .orderBy("created_at", "desc")
      .then(function (record) {
        resolve({
          status: true,
          record,
        });
      })
      .catch(function (error) {
        console.log(error);
        resolve({ status: false, data: error });
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
    if (args.email && args.email != "") {
      countQuery.whereILike("email", "%" + args.email + "%");
    }
    if (args.question && args.question != "") {
      countQuery.whereILike("question", "%" + args.question + "%");
    }

    if (args.dateFrom) {
      countQuery.where("created_at", ">=", args.dateFrom);
    }

    if (args.dateTo) {
      countQuery.where("created_at", "<", args.dateTo);
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
        if (args.question && args.question != "") {
          dataQuery.whereILike("question", "%" + args.question + "%");
        }
        if (args.email && args.email != "") {
          dataQuery.whereILike("email", "%" + args.email + "%");
        }

        if (args.dateFrom) {
          dataQuery.where("created_at", ">=", args.dateFrom);
        }

        if (args.dateTo) {
          dataQuery.where("created_at", "<", args.dateTo);
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
