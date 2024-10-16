const table = "admins";

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
        resolve({ ...record, isActive: record.is_active ? true : false });
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
    countQuery.where({...args.match, is_deleted : 0});

    if (args.name && args.name != "") {
      countQuery.whereILike("name", "%" + args.name + "%");
    }
    if (args.email && args.email != "") {
      countQuery.whereILike("email", "%" + args.email + "%");
    }
    if (args.dateFrom) {
      countQuery.where("created_at", ">=", args.dateFrom);
    }

    if (args.dateTo) {
      countQuery.where("created_at", "<", args.dateTo);
    }
    countQuery.count("id as count");
    countQuery
      .then(function (record) {
        totalRecords = record[0].count;

        //for data
        let dataQuery = DB(table);

        dataQuery.where({...args.match, is_deleted : 0});

        if (args.name && args.name != "") {
          dataQuery.whereILike("name", "%" + args.name + "%");
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
          .orderBy(args.sort_by || "created_at", args.order || "desc")
          .limit(args.per_page)
          .offset((args.page - 1) * args.per_page)
          .then(function (record) {
            resolve({
              status: true,
              data: {
                totalRecords,
                record: record.map((val) => {
                  return { ...val, isActive: val.is_active ? true : false };
                }),
              },
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
