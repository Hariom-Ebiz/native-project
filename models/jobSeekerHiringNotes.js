const table = "job_seeker_hiring_notes";

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
    
    let dataQuery = DB(table)
        .where(args)
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

exports.getAll = async (query = {}) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .where(query)      
      .then(function (record) {
        resolve(record);
      })
      .catch(function (error) {
        console.log(error);
        resolve(null);
      });
  });
};

exports.getCategoryByRole = async (args) => {
  return new Promise((resolve, reject) => {
    try {
      let dataQuery = DB(table);
          dataQuery.select("faqs.category_id", "faqs.role", "faq_category.category")
      
          if (args.role) {
            dataQuery.where("faqs.role",args.role);
          }
          dataQuery.where("faqs.is_active","1")
          dataQuery
            .leftJoin("faq_category", "faq_category.id", "=", "faqs.category_id")
            .orderBy((args?.sort_by) ? "faq_category."+args.sort_by : "faqs.created_at", args?.order || "desc")
            .limit(args?.per_page || 100)
            .offset((args?.page - 1) * args?.per_page || 0)
            .groupBy("faqs.category_id")
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
      
    } catch (error) {
      reject(error)
    }
  });
};

exports.likeOrDislike = async (args) => {
  return new Promise((resolve, reject) => {
    try {
      let dataQuery = DB(table);
  
          if (args.isLike != "") {
              if (args.isLike) {
                dataQuery.increment('likes', 1)
              } else {
                dataQuery.increment('likes', -1)
              }
          }

          if (args.isDislike != "") {
            if (args.isDislike) {
              dataQuery.increment('dislikes', 1)
            } else {
              dataQuery.increment('dislikes', -1)
            }
        }
          dataQuery.where("id",args.id)
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
      
    } catch (error) {
      reject(error)
    }
  });
};
