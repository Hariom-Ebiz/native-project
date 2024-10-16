const table = "job_seeker_applied_jobs";

exports.create = async (data) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .insert(data)
      .then(async function (record) {

        const user = await DB("users").select("first_name","last_name").where("id", "=",data.job_seeker_id)
        const employer = await DB("employer_job_posts").select("users.id","users.first_name", "users.last_name","users.email", "employer_job_posts.title").where('employer_job_posts.id', "=", data.job_id).leftJoin("users", "employer_job_posts.employer_id","=", "users.id").groupBy("employer_job_posts.id")

        resolve({ status: true, data: record, jobSeekerDetails: user.length > 0 ? user[0] : {}, employerDetails: employer.length > 0 ? employer[0] : {} });
      })
      .catch(function (error) {
        console.log("error : ", error);
        
        resolve({ status: false, data: error });
      });
  });
};

exports.getApplicationQuestions = async (id) => {
  try {
    const record = await DB("job_post_screening_questions")
      .select("job_post_screening_questions.*", "employer_job_posts.is_confidential")
        .leftJoin("employer_job_posts", "job_post_screening_questions.job_post_id","=", "employer_job_posts.id")
          .where("job_post_id", id)

    const company_details = await DB("employer_job_posts").select("employer_job_posts.id","company_profile.company_name as companyName", "company_profile.logo")
            .leftJoin("company_profile", "company_profile.employer_id", "=", "employer_job_posts.employer_id")
            .where("employer_job_posts.id", id)

    return { status: true, data: record, companyDetails: company_details}    
  } catch (error) {
    return { status: false, data: error}
  }
          
}

exports.update = async (query, data) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .where({ ...query })
      .update(data)
      .then(async function (record) {
        const user = await DB("users").select("users.first_name","users.last_name").where("users.id", "=",data.job_seeker_id)
        const employer = await DB("employer_job_posts").select("users.id","users.first_name", "users.last_name","users.email", "employer_job_posts.title").where('employer_job_posts.id', "=", data.job_id).leftJoin("users", "employer_job_posts.employer_id","=", "users.id").groupBy("employer_job_posts.id")

        resolve({ status: true, data: record, jobSeekerDetails: user.length > 0 ? user[0] : {}, employerDetails: employer.length > 0 ? employer[0] : {} });
        // resolve({ status: true, data: record });
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
        resolve(record);
      })
      .catch(function (error) {
        console.log(error);
        resolve(null);
      });
  });
};

exports.getAll = async (query = {}, notQuery = {}) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .where(query)
      .whereNot(notQuery)
      .then(function (record) {
        resolve(record);
      })
      .catch(function (error) {
        console.log(error);
        resolve([]);
      });
  });
};

exports.getAllDetailed = async (query = {}, notQuery = {}) => {
  return new Promise((resolve, reject) => {
    DB(table)
      // .select("job_seeker_languages.*", "languages.name as skill_name")
      // .leftJoin(
      //   "languages",
      //   "languages.id",
      //   "=",
      //   "job_seeker_languages.language_id"
      // )
      .where(query)
      .whereNot(notQuery)
      .then(function (record) {
        resolve(record);
      })
      .catch(function (error) {
        console.log(error);
        resolve([]);
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


exports.getDefaultAnswers = async (userId, jobId)=> {
  return new Promise((resolve, reject) => {
    let query = DB("job_seeker_applied_jobs");
    query
      .where("job_seeker_id", "=", userId)
      .andWhere("job_id", "=", jobId)
      .then(function (record) {
        resolve({ status: true, record });
      })
      .catch(function (error) {
        resolve({ status: false, record: [] });
      });
  });
}

exports.getScreeningAns = async (appliedId, jobId) => {
  return new Promise((resolve, reject) => {
    let query = DB("job_seeker_screening_answer");
    query
      .where("applied_id", "=", appliedId)
      .andWhere("job_id", "=", jobId)
      .then(function (record) {
        resolve({ status: true, record });
      })
      .catch(function (error) {
        resolve({ status: false, record: [] });
      });
  });
}