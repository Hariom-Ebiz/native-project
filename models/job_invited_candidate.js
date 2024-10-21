const table = "job_invited_candidate";

exports.create = async (data) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .insert(data)
      .then(function (record) {
        resolve({ status: true, data: record });
      })
      .catch((error) => {
        console.log("errrr", error)
        resolve({ status: false, data: error });
      });
  });
};

exports.getAllJobType = async (user_id) => {
  console.log("userid", user_id)
  return new Promise((resolve, reject) => {
    DB("job_types")
      .select("job_types.id", "job_types.name")
      .leftJoin("employer_job_posts as ejp", function () {
        this.on("job_types.id", "ejp.job_type")
          .andOn('ejp.is_posted', '=', 1)
          .andOn('ejp.is_delete', '=', 0)
          .andOn('ejp.is_active', '=', 1)
          .andOn('ejp.is_hired', '=', 0)
          .andOn('ejp.is_under_review', '=', 0);
      })
      .leftJoin("job_invited_candidate as jic", function () {
        this.on("ejp.id", "jic.job_id")
          .andOn("jic.job_seeker_id", "=", user_id)
      })
      .leftJoin("job_seeker_applied_jobs", function () {
        this.on("job_seeker_applied_jobs.job_id", "=", "jic.job_id")
          .andOn("job_seeker_applied_jobs.job_seeker_id", "=", user_id);
      })

      .select(DB.raw('COUNT(jic.id) - COUNT(job_seeker_applied_jobs.id) as count'))
      .groupBy('job_types.id', 'job_types.name')
      .then(function (record) {
        resolve(record);
      })
      .catch(function (error) {
        console.log(error);
        resolve([]);
      });
  });
}

exports.getAllJobCategories = async (user_id) => {
  return new Promise((resolve, reject) => {
    DB("job_categories")
      .select("job_categories.id", "job_categories.name")
      .leftJoin("employer_job_posts as ejp", function () {
        this.on("job_categories.id", "ejp.job_category")
          .andOn('ejp.is_posted', '=', 1)
          .andOn('ejp.is_delete', '=', 0)
          .andOn('ejp.is_active', '=', 1)
          .andOn('ejp.is_hired', '=', 0)
          .andOn('ejp.is_under_review', '=', 0);
      })
      .leftJoin("job_invited_candidate as jic", function () {
        this.on("ejp.id", "jic.job_id")
          .andOn("jic.job_seeker_id", "=", user_id)
      })
      .leftJoin("job_seeker_applied_jobs", function () {
        this.on("job_seeker_applied_jobs.job_id", "=", "jic.job_id")
          .andOn("job_seeker_applied_jobs.job_seeker_id", "=", user_id);
      })

      .select(DB.raw('COUNT(jic.id) - COUNT(job_seeker_applied_jobs.id) as count'))
      .groupBy('job_categories.id', 'job_categories.name')
      .then(async function (record) {
        await DB("job_categories")
          .select("job_categories.id", "job_categories.name", "ejp.title")
          .leftJoin("employer_job_posts as ejp", function () {
            this.on("job_categories.id", "ejp.job_category")
              .andOn('ejp.is_posted', '=', 1)
              .andOn('ejp.is_delete', '=', 0)
              .andOn('ejp.is_active', '=', 1);
          })
        resolve(record);
      })
      .catch(function (error) {
        console.log(error);
        resolve([]);
      });
  });
}

exports.getAllCareerLevels = async (user_id) => {
  return new Promise((resolve, reject) => {
    DB("carrier_levels")
      .select("carrier_levels.id", "carrier_levels.name",
        DB.raw(`SUM(CASE WHEN job_seeker_applied_jobs.job_seeker_id = ${user_id} THEN 1 ELSE 0 END) as isApplied`),
        DB.raw('COUNT(jic.id) - COUNT(job_seeker_applied_jobs.id) as count')
      )
      .leftJoin("employer_job_posts as ejp", function () {
        this.on("carrier_levels.id", "ejp.career_level")
          .andOn('ejp.is_posted', '=', 1)
          .andOn('ejp.is_delete', '=', 0)
          .andOn('ejp.is_active', '=', 1)
          .andOn('ejp.is_hired', '=', 0)
          .andOn('ejp.is_under_review', '=', 0);
      })
      .leftJoin("job_invited_candidate as jic", function () {
        this.on("ejp.id", "jic.job_id")
          .andOn("jic.job_seeker_id", "=", user_id)
      })
      .leftJoin("job_seeker_applied_jobs", function () {
        this.on("job_seeker_applied_jobs.job_id", "=", "jic.job_id")
          .andOn("job_seeker_applied_jobs.job_seeker_id", "=", user_id);
      })
      // .count('jic.id as count')
      .groupBy('carrier_levels.id', 'carrier_levels.name')
      .then(function (record) {
        resolve(record);
      })
      .catch(function (error) {
        console.log(error);
        resolve([]);
      });
  });
}

exports.getSalaryRange = async (user_id) => {
  return new Promise((resolve, reject) => {
    DB("employer_job_posts")
      .leftJoin("job_invited_candidate as jic", function () {
        this.on("employer_job_posts.id", "jic.job_id")
          .andOn("jic.job_seeker_id", "=", user_id)
      })
      .leftJoin('job_seeker_applied_jobs', function () {
        this.on('job_seeker_applied_jobs.job_id', '=', 'jic.job_id')
          .andOn('job_seeker_applied_jobs.job_seeker_id', '=', DB.raw('?', [user_id]));
      })
      .select(
        DB.raw(`CASE 
              WHEN min_expected_salary BETWEEN 5 AND 10000 THEN '5 - 10,000'
              WHEN min_expected_salary BETWEEN 10001 AND 15000 THEN '10,000 - 15,000'
              WHEN min_expected_salary BETWEEN 15001 AND 20000 THEN '15,000 - 20,000'
              WHEN min_expected_salary BETWEEN 20001 AND 25000 THEN '20,000 - 25,000'
              WHEN min_expected_salary BETWEEN 25001 AND 30000 THEN '25,000 - 30,000'
              WHEN min_expected_salary BETWEEN 30001 AND 40000 THEN '30,000 - 40,000'
              WHEN min_expected_salary BETWEEN 40001 AND 50000 THEN '40,000 - 50,000'
              WHEN min_expected_salary >= 50001 THEN '50,000 or above'
            END AS salary_range`),
        // DB.raw('COUNT(*) AS count')
        DB.raw('COUNT(CASE WHEN job_seeker_applied_jobs.job_id IS NULL AND jic.id IS NOT NULL THEN 1 END) AS count')
      )
      .where("employer_job_posts.is_posted", "1")
      .andWhere("employer_job_posts.is_active", "1")
      .andWhere("employer_job_posts.is_delete", "0")
      .andWhere("employer_job_posts.is_hired", "0")
      .andWhere("employer_job_posts.is_under_review", "0")
      .whereNotNull('salary_range_from')
      .groupBy('salary_range')
      .orderByRaw(`CASE 
                WHEN salary_range = '5 - 10,000' THEN 1
                WHEN salary_range = '10,000 - 15,000' THEN 2
                WHEN salary_range = '15,000 - 20,000' THEN 3
                WHEN salary_range = '20,000 - 25,000' THEN 4
                WHEN salary_range = '25,000 - 30,000' THEN 5
                WHEN salary_range = '30,000 - 40,000' THEN 6
                WHEN salary_range = '40,000 - 50,000' THEN 7
                WHEN salary_range = '50,000 or above' THEN 8
              END`)
      .then(data => {
        // List of all possible ranges
        const salaryRanges = {
          '5 - 10,000': 0,
          '10,000 - 15,000': 0,
          '15,000 - 20,000': 0,
          '20,000 - 25,000': 0,
          '25,000 - 30,000': 0,
          '30,000 - 40,000': 0,
          '40,000 - 50,000': 0,
          '50,000 or above': 0,
        }

        // Convert the result to an object for easier lookup
        const resultObj = {};
        data.forEach(row => {
          resultObj[row.salary_range] = row.count;
        });

        // Ensure all salary ranges are included in the final result
        const finalResult = salaryRanges.map(range => ({
          salary_range: range,
          count: resultObj[range] || 0
        }));

        resolve({ status: true, data: finalResult });
      })
      .catch(err => {
        console.log("err >> ", err)
        resolve({ status: true, data: err });
      });
  });
}

exports.getJobSeekerInvitationsList = async (filter, jobFilter, user_id, pagination) => {
  console.log("user_id", user_id);

  try {

    query = DB("job_invited_candidate")
      .leftJoin("employer_job_posts", "job_invited_candidate.job_id", "=", "employer_job_posts.id")
      .select("job_invited_candidate.created_at as invitation_date", "employer_job_posts.id", "employer_job_posts.posted_on", "employer_job_posts.apply_before", "employer_job_posts.area", "job_seeker_skills.skill_name", "employer_job_posts.created_at", "employer_job_posts.vacancies", "employer_job_posts.salary_range_from", "employer_job_posts.salary_range_to", "employer_job_posts.salary_currency", "employer_job_posts.hide_salary_range", "employer_job_posts.is_confidential", "employer_job_posts.title", "company_profile.company_name", "company_profile.logo", "job_types.name as job_type_name", "employer_job_posts.other_job_category", "job_categories.name as job_category_name", "job_categories.id as job_category_id", "cities.name as city_name", "countries.name as country_name", "areas.name as area_name", "carrier_levels.name as career_level_name",
        "carrier_levels.id as career_level_id", "employer_job_posts.other_area", "job_types.id as job_type_id",
        // DB.raw("COUNT(job_seeker_applied_jobs.job_id) as totalApplied"),
        DB.raw(`SUM(CASE WHEN job_seeker_applied_jobs.job_seeker_id = ${user_id} THEN 1 ELSE 0 END) as isApplied`),
        DB.raw("COUNT(job_post_screening_questions.job_post_id) as totalAskedQuestions"),
        DB.raw("COUNT(job_seeker_skills.id) as totalMatchedSkills")
      )
      .where(filter)
      .andWhere("job_invited_candidate.job_seeker_id", "=", user_id)
      .leftJoin("carrier_levels", "employer_job_posts.career_level", "carrier_levels.id")
      .leftJoin("company_profile", "company_profile.employer_id", "=", "employer_job_posts.employer_id")
      .leftJoin("job_categories", "job_categories.id", "=", "employer_job_posts.job_category")
      .leftJoin("job_types", "job_types.id", "=", "employer_job_posts.job_type")
      .leftJoin("cities", "cities.id", "=", "employer_job_posts.city")
      .leftJoin("countries", "countries.id", "=", "employer_job_posts.country")
      .leftJoin("areas", "areas.id", "=", "employer_job_posts.area")
      .leftJoin("job_seeker_applied_jobs", "job_seeker_applied_jobs.job_id", "=", "employer_job_posts.id")
      .leftJoin("job_post_screening_questions", "employer_job_posts.id", "=", "job_post_screening_questions.job_post_id")
      .leftJoin("employer_job_post_skills", "employer_job_posts.id", "=", "employer_job_post_skills.job_post_id")
      .leftJoin("job_seeker_skills", function () {
        this.on("employer_job_post_skills.skill", "=", DB.raw("job_seeker_skills.skill_name"))
          .andOn("job_seeker_skills.job_seeker_id", "=", user_id)
      })
      .groupBy(
        "job_invited_candidate.id",
      )
      .having(DB.raw('isApplied'), '=', 0)
    if (jobFilter.job_type.length) {
      query.whereIn("employer_job_posts.job_type", jobFilter.job_type)
    }

    if (jobFilter.job_category.length) {
      query.whereIn("employer_job_posts.job_category", jobFilter.job_category)
    }

    if (jobFilter.career_level.length) {
      query.whereIn("employer_job_posts.career_level", jobFilter.career_level)
    }


    if (jobFilter?.salary_range_from?.length) {
      query.where(qb => {
        jobFilter.salary_range_from.forEach((range, i) => {
          if (range.includes('or below')) {
            const value = Number(range.replace(' or below', '').replace(",", ""));
            qb.orWhere('employer_job_posts.salary_range_from', '<=', value);
          } else if (range.includes('or above')) {
            const value = Number(range.replace(' or above', '').replace(",", ""));
            qb.orWhere('employer_job_posts.salary_range_from', '>=', value);
          } else {
            const [min, max] = range.split(' - ').map((s) => Number(s.replace(",", "")));
            qb.orWhere(function () {
              this.where('employer_job_posts.salary_range_from', '>=', min)
                .andWhere('employer_job_posts.salary_range_from', '<', max);
            });
          }
        });
      })
    }

    if (jobFilter?.salary_range_from?.length) {
      query.andWhere("employer_job_posts.hide_salary_range", "=", "0")
    }

    if (jobFilter.title) {
      query.andWhere("title", "like", `%${jobFilter.title}%`)
    }


    if (pagination?.sortBy == "created_at") {
      query.orderBy("employer_job_posts.posted_on", pagination.order)
    }
    else if (pagination?.sortBy == "recommended") {
      query.orderBy("totalMatchedSkills", pagination.order)
      query.orderBy("employer_job_posts.posted_on", pagination.order)
    }

    const totalDocuments = await query;

    const jobTypes = {
      "Full Time": { count: 0, id: -1 },
      "Part Time": { count: 0, id: -2 },
      "Internship": { count: 0, id: -3 },
      "Volunteering": { count: 0, id: -4 },
      "Freelance / Project": { count: 0, id: -5 }
    };

    const jobCategories = {
      "Project Management": { count: 0, id: -1 },
      "Supply Chain": { count: 0, id: -2 },
      "HR": { count: 0, id: -3 },
      "IT": { count: 0, id: -4 },
      "Data Science": { count: 0, id: -5 },
      "Finance": { count: 0, id: -6 },
      "Accounting": { count: 0, id: -7 },
      "Marketing": { count: 0, id: -8 },
      "Sales": { count: 0, id: -9 },
      'Business Development': { count: 0, id: -10 },
      "Engineering": { count: 0, id: -11 },
      "Others": { count: 0, id: -12 }
    };

    const jobLevels = {
      "Student": { count: 0, text: "Student", id: -1 },
      "EntryLevel": { count: 0, text: "Entry Level", id: -2 },
      "1-3YearsExperience": { count: 0, text: "1-3 Years Experience", id: -3 },
      "3-5YearsExperience": { count: 0, text: "3-5 Years Experience", id: -4 },
      "5-10YearsExperience": { count: 0, text: "5-10 Years Experience", id: -5 },
      "10+YearsExperience": { count: 0, text: "10+ Years Experience", id: -6 },
    }

    const salaryRanges = {
      '5 - 10,000': 0,
      '10,000 - 15,000': 0,
      '15,000 - 20,000': 0,
      '20,000 - 25,000': 0,
      '25,000 - 30,000': 0,
      '30,000 - 40,000': 0,
      '40,000 - 50,000': 0,
      '50,000 or above': 0,
    }

    const defaultCategories = ["Project Management", "Supply Chain", "HR", "IT", "Data Science", "Finance", "Accounting", "Marketing", "Sales", 'Business Development', "Engineering"]

    console.log("totalDocuments", totalDocuments);

    if (Array.isArray(totalDocuments)) {
      for await (const d of totalDocuments) {
        console.log(">>>>>>>> ", d);

        if (d.job_type_name) {
          jobTypes[d.job_type_name] = { count: jobTypes[d.job_type_name].count + 1, id: d.job_type_id };
        }

        if (d.job_category_name) {
          if (!defaultCategories.includes(d.job_category_name)) {
            jobCategories['Others'] = { count: jobCategories['Others'].count + 1, id: 0 };
          } else {
            jobCategories[d.job_category_name] = { count: jobCategories[d.job_category_name].count + 1, id: d.job_category_id };
          }
        }

        if (d.career_level_id) {
          if (!jobLevels.hasOwnProperty(String(d.career_level_name).replace(/ /g, ""))) {
            jobLevels[String(d.career_level_name).replace(/ /g, "")] = { count: 1, text: d.career_level_name, id: d.career_level_id }
          } else {
            jobLevels[String(d.career_level_name).replace(/ /g, "")] = { count: jobLevels[String(d.career_level_name).replace(/ /g, "")].count + 1, id: d.career_level_id, text: d.career_level_name }
          }
        }

        if (d.salary_range_from) {
          if (!d.hide_salary_range) {
            if (d.salary_range_from >= 5 && d.salary_range_from <= 10000) {
              salaryRanges['5 - 10,000'] += 1;
            } else if (d.salary_range_from > 10000 && d.salary_range_from <= 15000) {
              salaryRanges['10,000 - 15,000'] += 1;
            } else if (d.salary_range_from > 15000 && d.salary_range_from <= 20000) {
              salaryRanges['15,000 - 20,000'] += 1;
            } else if (d.salary_range_from > 20000 && d.salary_range_from <= 25000) {
              salaryRanges['20,000 - 25,000'] += 1;
            } else if (d.salary_range_from > 25000 && d.salary_range_from <= 30000) {
              salaryRanges['25,000 - 30,000'] += 1;
            } else if (d.salary_range_from > 30000 && d.salary_range_from <= 40000) {
              salaryRanges['30,000 - 40,000'] += 1;
            } else if (d.salary_range_from > 40000 && d.salary_range_from <= 50000) {
              salaryRanges['40,000 - 50,000'] += 1;
            } else if (d.salary_range_from >= 50000) {
              salaryRanges['50,000 or above'] += 1;
            }
          }
        }
      }
    }


    query.limit(pagination?.per_page || 100)
      .offset((pagination?.page - 1) * pagination?.per_page || 0);

    let data = await query;

    if (Array.isArray(data)) {
      for await (const d of data) {
        const totalApplied = await DB("job_seeker_applied_jobs").where({ "job_id": d.id, "is_applied": 1 }).count("id as total");
        d['totalApplied'] = totalApplied[0].total;
      }
    }

    return { status: true, data: data, totalDocuments: totalDocuments.length, jobTypes: jobTypes, jobCategories: jobCategories, jobLevels: jobLevels, salaryRanges: salaryRanges }
  } catch (error) {
    console.log("error : ", error)
    return { status: false, data: error }
  }
}

exports.getOneJob = async (query) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .where(query)
      .first()
      .then(function (record) {
        resolve({ status: true, data: record });
      })
      .catch(function (error) {
        console.log("errrr", error)
        resolve({ status: false, data: error });
      });
  });
}