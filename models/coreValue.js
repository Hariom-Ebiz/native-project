const table = "core_values";

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
      .orderBy("id", "asc")
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
