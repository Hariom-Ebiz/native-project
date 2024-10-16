const table = "employer_testimonials";

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
    let countQuery = DB(table)
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
              //   data: record.map((val) => {
              //     return { ...val, isActive: val.is_active ? true : false };
              //   }),
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

exports.getAllForClient = async (lang) => {
  return new Promise((resolve, reject) => {
    let dataQuery = DB(table);
    dataQuery.select(
      "employer_testimonials.*",
      "emp_language_testimonials.designation as language_designation",
      "emp_language_testimonials.comment as language_comment",
      "emp_language_testimonials.language_id as language_id",
    )
    dataQuery.where({});
    dataQuery.leftJoin("emp_language_testimonials", function() {
      this.on("employer_testimonials.id", "=", "emp_language_testimonials.testimonial_id")
      .andOn("emp_language_testimonials.language_id", "=", DB.raw('?', [lang ?? 0]))
    })
    dataQuery
      .then(function (record) {
        resolve(record);
      })
      .catch(function (error) {
        console.log(error);
        resolve([]);
      });
  });
};
