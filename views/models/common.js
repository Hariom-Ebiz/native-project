exports.getAll = async (table, query = {}, whereIn) => {
  return new Promise((resolve, reject) => {
    let dataQuery = DB(table);
    dataQuery.where(query);

    if (whereIn) {
      dataQuery.whereIn(whereIn.key, whereIn.value);
    }

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

exports.create = async (table, data) => {
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

exports.getOne = async (table, query) => {
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

exports.raw = async (raw, values = []) => {
  return new Promise((resolve, reject) => {
    DB.raw(raw, values)
      .then(function (record) {
        resolve({ status: true, data: record[0] });
      })
      .catch(function (error) {
        console.log("err", error);
        resolve({ status: false, data: error });
      });
  });
};
