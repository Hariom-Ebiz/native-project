const table = "faq_language";

exports.create = async (data) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .insert(data)
      .then(function (record) {
        resolve({ status: true, data: record });
      })
      .catch(function (error) {
        console.log(">>>>>err", error);
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
    if (args.question && args.question != "") {
      countQuery.whereILike("question", "%" + args.question + "%");
    }
    if (args.category_id && args.category_id != "") {
      countQuery.whereILike("faq_language.category_id", args.category_id );
    }
    if (args.role) {
      countQuery.where("faq_language.role",args.role);
    }
    countQuery.groupBy("id")
    countQuery
      .then(function (record) {
        totalRecords = record.length > 0 ? record[0].count : 0; 

        //for data
        let dataQuery = DB(table)
        .select("faq_language.*","faq_language.faq_id as id", "faqs.likes")
        .leftJoin("faqs", "faq_language.faq_id", "=", "faqs.id")
        .groupBy("faq_language.id");
        dataQuery.where(args.match);
        if (args.question && args.question != "") {
          dataQuery.whereILike("faq_language.question", "%" + args.question + "%");
        }
        if (args.category_id && args.category_id != "") {
          dataQuery.whereILike("faq_language.category_id", args.category_id );
        }
        if (args.role) {
          dataQuery.where("faq_language.role",args.role);
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

exports.getAllByPage = async (page_slug) => {
  return new Promise((resolve, reject) => {
    let dataQuery = DB(table);
    dataQuery.where({ page_slug: page_slug });
    dataQuery
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