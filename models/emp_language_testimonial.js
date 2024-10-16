let table = "emp_language_testimonials";


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
      let countQuery = DB(table);
      if (args.is_active != "" && (args.is_active == "true" || args.is_active == "false")) {
        countQuery.where("faqs.is_active",(args.is_active == "true") ? 1 : 0);
      }
  
      if (args.category_id) {
        countQuery.where("faqs.category_id",args.category_id);
      }
  
      if (args.role) {
        countQuery.where("faqs.role",args.role);
      }
      
      countQuery.count("id as count");
      if (args.question && args.question != "") {
        countQuery.whereILike("question", "%" + args.question + "%");
      }
      countQuery
        .then(function (record) {
          totalRecords = record[0].count;
          //for data
          let dataQuery = DB(table);
          dataQuery.select("faqs.*", "faq_category.category")
          if (args.is_active != "" && (args.is_active == "true" || args.is_active == "false")) {
            dataQuery.where("faqs.is_active",(args.is_active == "true") ? 1 : 0);
          }
          if (args.category_id) {
            dataQuery.where("faqs.category_id",args.category_id);
          }
          if (args.role) {
            dataQuery.where("faqs.role",args.role);
          }
          if (args.question && args.question != "") {
            dataQuery.whereILike("question", "%" + args.question + "%");
          }
  
          dataQuery
            .leftJoin("faq_category", "faq_category.id", "=", "faqs.category_id")
            .orderBy((args?.sort_by) ? "faqs."+args?.sort_by : "faqs.created_at", args?.order || "desc")
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
  