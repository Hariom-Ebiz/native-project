const table = "blocks";

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
    let countQuery = DB(table).select("blocks.id as id","blocks.page","blocks.title","blocks.description","blocks.image", "blocks.page_slug", "blocks.title_slug",DB.raw('DATE_FORMAT(blocks.created_at, "%Y-%m-%d %H:%i:%s") as created_at'),);

    countQuery.where(args.match);
    countQuery.count("id as count");
    if (args.title && args.title != "") {
      countQuery.whereILike("title", "%" + args.title + "%");
    }
    if (args.page_slug && args.page_slug != "") {
      countQuery.whereILike("page_slug", "%" + args.page_slug + "%");
    }
    countQuery.groupBy("id")
    countQuery
      .then(function (record) {
        totalRecords = record[0].count;

        //for data
        let dataQuery = DB(table);
        dataQuery.where(args.match);
        if (args.title && args.title != "") {
          dataQuery.whereILike("title", "%" + args.title + "%");
        }
        if (args.page_slug && args.page_slug != "") {
          dataQuery.whereILike("page_slug", "%" + args.page_slug + "%");
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

exports.getAllByPage = async (page_slug, lang) => {
  return new Promise((resolve, reject) => {
    let dataQuery = DB(table);
    dataQuery.select(
      "blocks.id",
      "blocks.page",
      "blocks.title",
      "blocks.description",
      "blocks.image",
      "blocks.page_slug",
      "blocks.title_slug",
      "block_language.title as language_title",
      "block_language.description as language_description",
      "block_language.language_id as language_id"
    )
    dataQuery.where({ "blocks.page_slug": page_slug });
    dataQuery.leftJoin("block_language", function() {
      this.on("blocks.id", "=", "block_language.block_id")
      .andOn("block_language.language_id", "=", DB.raw('?', [lang ?? 0]))
    })
    // dataQuery.where({"block_language.language_id": lang})
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