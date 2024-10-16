const table = "email_actions";

exports.create = async (data) => {
  data = {
    ...data,
    options: JSON.stringify(data.options),
  };

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
        resolve({
          ...record,
          options: record?.options ? JSON.parse(record.options) : [],
        });
      })
      .catch(function (error) {
        console.log(error);
        resolve(null);
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
    countQuery
      .then(function (record) {
        totalRecords = record[0].count;

        //for data
        let dataQuery = DB(table);
        dataQuery.where(args.match);
        dataQuery
          .orderBy(args?.sort_by || "created_at", args?.sort_order || "desc")
          .limit(args?.page_size || 100)
          .offset((args?.page - 1) * args?.page_size || 0)
          .then(function (record) {
            resolve({
              status: true,
              data: record.map((val) => {
                return {
                  ...val,
                  options: JSON.parse(val.options),
                };
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
