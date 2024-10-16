const table = "lookups";

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
    countQuery.where(args.match);
    countQuery.count("id as count");
    if (args.lookup_type && args.lookup_type != "") {
      countQuery.whereILike("lookup_type", "%" + args.lookup_type + "%");
    }
    countQuery
      .then(function (record) {
        totalRecords = record[0].count;

        //for data
        let dataQuery = DB(table);
        dataQuery.where(args.match);
        if (args.lookup_type && args.lookup_type != "") {
          dataQuery.whereILike("lookup_type", "%" + args.lookup_type + "%");
        }

        dataQuery
          .orderBy(args?.sort_by || "created_at", args?.order || "desc")
          .limit(args?.per_page || 100)
          .offset((args?.page - 1) * args?.per_page || 0)
          .then(function (record) {
            resolve({
              status: true,
              data: record.map((val) => {
                return { ...val, isActive: val.is_active ? true : false };
              }),
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

exports.getAll = async (code) => {
  return new Promise((resolve, reject) => {
    let dataQuery = DB(table);
    dataQuery.where({ is_active: 1, code });
    dataQuery
      .orderBy("show_order", "asc")
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

exports.getInDescending = async (code) => {
  return new Promise((resolve, reject) => {
    let dataQuery = DB(table);
    dataQuery.where({ is_active: 1, code });
    dataQuery
      .orderBy("show_order", "desc")
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

exports.getAllJobTypes = async () => {
  return new Promise((resolve, reject) => {
    let dataQuery = DB(table);  
    dataQuery
      .whereILike("code", "%jobType%")
      .orderBy("created_at", "desc")
      .then(function (record) {
        resolve(record.map((val) => {
          return { ...val, isActive: val.is_active ? true : false };
        }));
      })
      .catch(function (error) {
        console.log(error);
        resolve([]);
      });
  });
};

exports.getAllPayTypes = async () => {
  return new Promise((resolve, reject) => {
    let dataQuery = DB(table);  
    dataQuery
      .whereILike("code", "%payType%")
      .orderBy("created_at", "desc")
      .then(function (record) {
        resolve(record.map((val) => {
          return { ...val, isActive: val.is_active ? true : false };
        }));
      })
      .catch(function (error) {
        console.log(error);
        resolve([]);
      });
  });
};
