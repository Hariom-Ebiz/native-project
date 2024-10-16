const { reduxSettingData } = require("../utils/helper");
const table = "settings";

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
        resolve({
          ...record,
          inputType: record.input_type,
          isEditable: record.editable,
          createdAt: record.created_at,
          updatedAt: record.updated_at,
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
    if (args.title && args.title != "") {
      countQuery.whereILike("title", "%" + args.title + "%");
    }
    countQuery
      .then(function (record) {
        totalRecords = record[0].count;

        //for data
        let dataQuery = DB(table);
        dataQuery.where(args.match);
        if (args.title && args.title != "") {
          dataQuery.whereILike("title", "%" + args.title + "%");
        }
        dataQuery
          .orderBy(args?.sort_by || "created_at", args?.order || "desc")
          .limit(args?.per_page || 100)
          .offset((args?.page - 1) * args?.per_page || 0)
          .then(function (record) {
            resolve({
              status: true,
              data: record.map((val) => {
                return {
                  ...val,
                  inputType: val.input_type,
                  isEditable: val.editable,
                  createdAt: val.created_at,
                  updatedAt: val.updated_at,
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

exports.getByPrifix = async (prefix = "") => {
  return new Promise((resolve, reject) => {
    DB(table)
      .whereILike("key", "%" + prefix + "%")
      .then(function (record) {
        resolve(
          record.map((val) => {
            return {
              ...val,
              inputType: val.input_type,
              isEditable: val.editable,
              createdAt: val.created_at,
              updatedAt: val.updated_at,
            };
          })
        );
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

exports.settingsForAdmin = async () => {
  // let query =
  //   "select * from settings where key == Reading.records_per_page OR Reading.date_format OR Reading.date_time_format OR Site.title";

  // let query = `select * from ${table} where "key" in (${reduxSettingData
  //   .map((_) => "?")
  //   .join(",")})`;

  //   console.log(query)
  // return new Promise((resolve, reject) => {
  //   DB.raw(query, [...reduxSettingData])
  //     .then(function (record) {
  //       resolve(record);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //       resolve(null);
  //     });
  // });

  return new Promise((resolve, reject) => {
    DB(table)
      .where({})
      .then(function (record) {
        if (record && record.length > 0) {
          record = record.filter((val) => reduxSettingData.includes(val.key));
          record = record.map((val) => {
            return {
              value : val.value,
              newKey : val.key.split(".")[1],
              selected : val.selected
            }
          })
        }
        resolve(record);
      })
      .catch(function (error) {
        console.log(error);
        resolve(null);
      });
  });
};

exports.settingsForUser = async () => { 
  return new Promise((resolve, reject) => {
    DB(table)
      .where({})
      .then(function (record) {
        if (record && record.length > 0) { 
          record = record.map((val) => {
            return {
              value : val.value,
              newKey : val.key.split(".")[1],
              selected : val.selected
            }
          })
        }
        resolve(record);
      })
      .catch(function (error) {
        console.log(error);
        resolve(null);
      });
  });
};
