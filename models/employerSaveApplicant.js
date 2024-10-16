const table = "employer_applicant_actions";

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

exports.isSaved = async (query) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .where(query)
      .leftJoin("users", "employer_applicant_actions.employer_id","=","users.id")
      .first()
      .then(function (record) {
        resolve({ status: true, data: record });
      })
      .catch(function (error) {
        resolve({ status: false, data: error });
      });
  });
}

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

exports.getMany = async (args, userId) => {
  return new Promise((resolve, reject) => {
    let totalRecords;

    //for count
    let countQuery = DB(table);
    countQuery.where("employer_id", userId);

    // Add search condition to count query if provided
    if (args?.search) {
      countQuery.andWhere((qb) => {
        qb.whereRaw("(SELECT CONCAT(first_name, ' ', last_name) AS full_name  FROM job_seeker_cv WHERE job_seeker_cv.job_seeker_id = employer_applicant_actions.job_seeker_id) like ?",
        [`%${args.search}%`])
          .orWhereRaw(
            "(SELECT job_title FROM job_seeker_experiences WHERE job_seeker_experiences.job_seeker_id = employer_applicant_actions.job_seeker_id ORDER BY job_seeker_experiences.start_date DESC LIMIT 1) like ?",
            [`%${args.search}%`]
          );
      });
    }

    countQuery.count("id as count");
    countQuery
      .then(function (record) {
        totalRecords = record[0].count;
        //for data
        let dataQuery = DB(table);
        dataQuery
          .select(
            "employer_applicant_actions.*",
            "job_seeker_cv.profile_pic",
            "job_seeker_cv.first_name",
            "job_seeker_cv.last_name",
            DB.raw("CONCAT(first_name, ' ', last_name) AS full_name"),
            "job_seeker_cv.dob",
            "cities.name as city_name",
            "countries.name as country_name",
            DB.raw(
              `((SELECT job_title 
                FROM job_seeker_experiences 
                WHERE job_seeker_experiences.job_seeker_id = employer_applicant_actions.job_seeker_id 
                AND is_currently_working = 1
                ORDER BY start_date DESC 
                LIMIT 1)
               UNION ALL
               (SELECT job_title 
                FROM job_seeker_experiences 
                WHERE job_seeker_experiences.job_seeker_id = employer_applicant_actions.job_seeker_id 
                AND NOT EXISTS (
                  SELECT 1 
                  FROM job_seeker_experiences 
                  WHERE job_seeker_experiences.job_seeker_id = employer_applicant_actions.job_seeker_id 
                  AND is_currently_working = 1
                )
                ORDER BY start_date DESC 
                LIMIT 1)
               LIMIT 1) as latest_job_title` 
            )
            ,
            DB.raw(
              "(SELECT company_name FROM job_seeker_experiences WHERE job_seeker_experiences.job_seeker_id = employer_applicant_actions.job_seeker_id ORDER BY job_seeker_experiences.start_date DESC LIMIT 1) as latest_company_name"
            )
          )
          .where("employer_applicant_actions.employer_id", userId);

        // Add search condition to data query if provided
        if (args?.search) {
          dataQuery.andWhere((qb) => {
            qb.whereRaw("CONCAT(job_seeker_cv.first_name, ' ', job_seeker_cv.last_name) like ?", [`%${args.search}%`])
              .orWhereRaw(
                "(SELECT job_title FROM job_seeker_experiences WHERE job_seeker_experiences.job_seeker_id = employer_applicant_actions.job_seeker_id ORDER BY job_seeker_experiences.start_date DESC LIMIT 1) like ?",
                [`%${args.search}%`]
              );
          });
        }

        dataQuery
          .leftJoin(
            "job_seeker_cv",
            "job_seeker_cv.job_seeker_id",
            "=",
            "employer_applicant_actions.job_seeker_id"
          )
          .leftJoin("cities", "cities.id", "=", "job_seeker_cv.current_city")
          .leftJoin("countries", "countries.id", "=", "job_seeker_cv.current_country")
          .orderBy(
            args?.sort_by
              ? "employer_applicant_actions." + args?.sort_by
              : "employer_applicant_actions.created_at",
            args?.order || "desc"
          )
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


exports.checkAndGetCompanyName = async (employer_id,job_id)=>{
  try{
    const jobDetails = await DB('employer_job_posts')
    .select("employer_job_posts.is_confidential","employer_job_posts.title")
    .where("employer_job_posts.id","=",job_id)
    .first()
    
    let companyName = "Confidential";
    let title = "";
    if(!jobDetails.is_confidential){
      const companyDetails = await DB("users").select("first_name").where("id","=", employer_id).first();
      companyName = companyDetails.first_name;
    }
    console.log("job Details ; ", jobDetails);
    title = jobDetails.title;

    return {status: true, companyName, job_title: title}
  } catch(err){
    console.log("err : ", err)
    return {status: false, companyName:"",title: ""}
  }
}

exports.getManyRejectReasons = async () => {
  try{
    const reasons = await DB('rejection_reasons')
    return {status: true, data: reasons}
  } catch(err){
    return {status: false, data: []}
  }
}