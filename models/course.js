const table = "courses";

exports.create = async (data) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .insert(data)
      
      .then(function (record) {
        resolve({ status: true, data: record });
      })
      .catch(function (error) {
        console.log("err", error);
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
    let dataQuery = DB(table);

    dataQuery
      .where(args.query ?? {})
      .orderBy(args?.sort_by || "created_at", args?.order || "desc")
      .limit(args?.per_page || 100)
      .offset((args?.page - 1) * args?.per_page || 0)
      .then(function (record) {
        resolve({
          status: true,
          data: record,
        });
      })
      .catch(function (error) {
        console.log(error);
        resolve({ status: false, data: error });
      });
  });
};

exports.getManyClient = async () => {
  return new Promise((resolve) => {
    // const coalesce = DB.raw(`coalesce(lessons.items, '[]') as items`);
    // const sub = DB("lessons")
    //   .select(DB.raw("json_agg(lessons.*) as items"))
    //   .whereRaw("courses.id = lessons.course_id");

    // DB(table)
    //   .select(["courses.*", coalesce])
    //   .joinRaw("left join lateral ? lessons on true", sub)
    //   .orderBy("courses.order_number", "asc")
    //   .then(function (record) {
    //     resolve({
    //       status: true,
    //       data: record,
    //     });
    //   })
    //   .catch(function (error) {
    //     resolve({ status: false, data: error });
    //   });

    DB(table)
      .select(
        "courses.id",
        "courses.title",
        "courses.time",
        "courses.image",
        // "courses.background_image",
        "courses.order_number",
        "courses.skip_lessons",
        "lessons.id as lesson_id"
        // "lessons.id"
        // DB.raw("GROUP_CONCAT(lessons.id) as idss")
        // DB.raw("ARRAY_AGG(lessons.id) as lesson_id")
      )
      .leftJoin("lessons", "lessons.course_id", "=", "courses.id")
      //   .groupBy("courses.id", "courses.title", "lesson_id")
      //   .groupBy("courses.id")
      .orderBy("courses.order_number", "asc")
      .then(function (record) {
        const resultMap = record.reduce((result, row) => {
          const lesson_id = row.lesson_id;
          delete row.lesson_id;

          result[row.id] = result[row.id] || {
            ...row,
            lessons: [],
          };

          result[row.id].lessons.push(lesson_id);

          return result;
        }, {});

        resolve({
          status: true,
          data: Object.values(resultMap),
        });
      })
      .catch(function (error) {
        resolve({ status: false, data: error });
      });
  });
};
