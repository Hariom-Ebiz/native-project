const table = "company_profile";

exports.create = async (data) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .insert(data)
      
      .then(function (record) {
        resolve({ status: true, data: record });
      })
      .catch(function (error) {
        console.log(">>>>rrorrr", error);
        resolve({ status: false, data: error });
      });
  });
};

exports.update = async (query, data) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .where({ ...query })
      .update(data)
      .then(async function (record) {
        const data = await DB(table).where({ ...query })
        resolve({ status: true, data: data[0] });
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

exports.checkAllFill = async (id) => {
  return new Promise((resolve, reject) => {
    let query = DB(table)
    query
    .select(DB.raw("CASE WHEN employer_id IS NULL OR logo IS NULL OR company_name IS NULL OR website IS NULL OR country IS NULL OR city IS NULL OR employee IS NULL OR industry IS NULL OR founded IS NULL OR description IS NULL OR phone IS NULL OR email IS NULL OR linkedin IS NULL THEN 'true' ELSE 'false' END AS column_null"))
    .where("id", id)
    .then(result => {
      resolve({ status: true, data: result })
    })
    .catch(err => {
      resolve({ status: false, data: err })
    })
  })
}

exports.getJobs = async (id) => {
  return new Promise((resolve, reject) => {
    let query = DB("employer_job_posts")
    query.select(
      "employer_job_posts.title",
      "employer_job_posts.id",
      "employer_job_posts.is_posted",
      "employer_job_posts.vacancies",
      "employer_job_posts.job_description",
      "employer_job_posts.job_requirements",
      "employer_job_posts.posted_on",
      "employer_job_posts.created_at",
      "cities.name as city_name",
      "countries.name as country_name",
      "job_types.name as job_type_name",
      "job_categories.name as job_category_name",
      "job_categories.id as job_category_id",
      "employer_job_posts.other_job_category",
      DB.raw('(SELECT COUNT(*) FROM job_seeker_applied_jobs WHERE job_seeker_applied_jobs.job_id = employer_job_posts.id AND job_seeker_applied_jobs.is_applied = 1) as totalApplied')
    )
    .where({
      employer_id: id,
      is_active: 1,
      is_delete: 0,
      is_hired: 0
    })
    .leftJoin("cities", "cities.id", "=", "employer_job_posts.city")
    .leftJoin("countries", "countries.id", "=", "employer_job_posts.country")
    .leftJoin("job_types", "job_types.id", "=", "employer_job_posts.job_type")
    .leftJoin("job_categories", "job_categories.id", "=", "employer_job_posts.job_category")
    .orderBy("employer_job_posts.updated_at","DESC")
    .limit(5)
    .then(result => {
      resolve({ status: true, data: result })
    })
    .catch(err => {
      console.log(">>>.errorrr", err);
      resolve({ status: false, data: err })
    })
  })
}