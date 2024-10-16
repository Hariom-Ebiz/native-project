const moment = require("moment");

const table = "employer_job_posts";

exports.create = async (data) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .insert(data)
      .then(function (record) {
        resolve({ status: true, data: record });
      })
      .catch(function (error) {
        console.log(">>>>Ertr", error)
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

exports.editJob = async (id) => {
  try {
    const getPost = await DB(table)
      .select("employer_job_posts.*", "countries.name as country_name", "cities.name as city_name", "areas.name as area_name")
      .where("employer_job_posts.id", id)
      .leftJoin("countries", "countries.id", "=", "employer_job_posts.country")
      .leftJoin("cities", "cities.id", "=", "employer_job_posts.city")
      .leftJoin("areas", "areas.id", "=", "employer_job_posts.area");

    const getkeys = await DB("employer_job_post_skills").select("skill")
      .where("job_post_id", id);

    const getScreening = await DB("job_post_screening_questions").select("question", "is_required")
      .where("job_post_id", id);

    const getCareer = await DB("job_post_career_values").select("career_id")
      .where("job_post_id", id);

    const getInterest = await DB("job_post_interest").select("interest_id")
      .where("job_post_id", id);

    const getPersonality = await DB("job_post_personality").select("personality_id")
      .where("job_post_id", id);

    const getSkills = await DB("job_post_skill_values").select("skill_id")
      .where("job_post_id", id);

    if (getPost[0]) {
      let data = getPost[0];
      data['keywords'] = await Promise.all(getkeys?.map((m) => m.skill))
      data['questions'] = await Promise.all(getScreening?.map((m) => { return { question: m.question, is_required: m.is_required } }))
      data["career_values"] = await Promise.all(getCareer?.map((m) => String(m.career_id)));
      data["interests_values"] = await Promise.all(getInterest?.map((m) => String(m.interest_id)));
      data["personality_values"] = await Promise.all(getPersonality?.map((m) => String(m.personality_id)));
      data["skills_values"] = await Promise.all(getSkills?.map((m) => String(m.skill_id)));

      return { data: data, status: true, message: "Data fetched." }
    } else {
      return { data: {}, status: false, message: "Data not found." }
    }

  } catch (err) {
    console.log(">>>>>errr", err)
    return { data: err, status: false, message: "Data can't fetched." }
  }
};

exports.getOne = async (id) => {
  try {
    const getPost = await DB(table)
      .select("employer_job_posts.*", "countries.name as country_name", "cities.name as city_name", "job_types.name as job_type_name", "job_categories.name as job_category_name", "job_categories.id as job_category_id", "company_profile.company_name", "company_profile.logo", "company_profile.description",

        DB.raw("(SELECT COUNT(*) FROM job_post_career_values WHERE job_post_id = employer_job_posts.id) as career_value_count"),

        DB.raw("(SELECT COUNT(*) FROM job_post_personality WHERE job_post_id = employer_job_posts.id) as personality_value_count"),

        DB.raw("(SELECT COUNT(*) FROM job_post_skill_values WHERE job_post_id = employer_job_posts.id) as motilvated_skill_count"),

        DB.raw("(SELECT COUNT(*) FROM job_post_interest WHERE job_post_id = employer_job_posts.id) as career_interest_count"),

      )
      .where("employer_job_posts.id", id)
      .leftJoin("company_profile", "company_profile.employer_id", "=", "employer_job_posts.employer_id")
      .leftJoin("countries", "countries.id", "=", "employer_job_posts.country")
      .leftJoin("cities", "cities.id", "=", "employer_job_posts.city")
      .leftJoin("job_types", "job_types.id", "=", "employer_job_posts.job_type")
      .leftJoin("job_categories", "job_categories.id", "=", "employer_job_posts.job_category");

    const getkeys = await DB("employer_job_post_skills").select("skill")
      .where("job_post_id", id);

    if (getPost[0]) {
      let data = getPost[0];
      data['keywords'] = getkeys;
      return { data: data, status: true, message: "Data fetched." }
    } else {
      return { data: {}, status: false, message: "Data not found." }
    }

  } catch (err) {
    console.log(">>>>>errr", err)
    return { data: err, status: false, message: "Data can't fetched." }
  }
};

exports.getApplicantsList = async (id, pagination, userId) => {
  try {

    const aptitudeMatchSubquery = DB('aptitude_test_result')
      .select('user_id')
      .select(DB.raw(`
      CONCAT(
          '[', 
          GROUP_CONCAT(
              JSON_OBJECT(
                  'aptitude_type', aptitude_test_result.aptitude_type,
                  'name', aptitudes.name,
                  'percentage', CEIL((right_questions / total_questions) * 100)
              )
          ), 
          ']'
      ) AS aptitude_match
  `))
      .leftJoin('aptitudes', 'aptitudes.id', 'aptitude_test_result.aptitude_type')
      .groupBy('user_id')
      .as('aggregated_aptitude');

    const applicatants = DB("job_seeker_applied_jobs")
      .select("job_seeker_applied_jobs.*",
        "job_seeker_cv.first_name",
        "job_seeker_cv.last_name",
        "job_seeker_cv.profile_pic as profile_picture",
        DB.raw("(SELECT COUNT(*) FROM assessment_result WHERE user_id = job_seeker_applied_jobs.job_seeker_id AND career_value_type = 'always_valued' AND result IN (SELECT career_id FROM job_post_career_values WHERE job_post_id = job_seeker_applied_jobs.job_id)) as career_value_match"),

        DB.raw("(SELECT COUNT(*) FROM assessment_result WHERE user_id = job_seeker_applied_jobs.job_seeker_id AND type = 'career_interests' AND result IN (SELECT interest_id FROM job_post_interest WHERE job_post_id = job_seeker_applied_jobs.job_id)) as career_interest_match"),

        DB.raw("(SELECT COUNT(*) FROM assessment_result WHERE user_id = job_seeker_applied_jobs.job_seeker_id AND type = 'motivated_skills' AND result IN (SELECT skill_id FROM job_post_skill_values WHERE job_post_id = job_seeker_applied_jobs.job_id)) as motivated_skill_match"),

        DB.raw("(SELECT COUNT(*) FROM assessment_result WHERE user_id = job_seeker_applied_jobs.job_seeker_id AND type = 'personality_type' AND result IN (SELECT personality_id FROM job_post_personality WHERE job_post_id = job_seeker_applied_jobs.job_id)) as personality_skill_match"),

        DB.raw("(SELECT COUNT(*) FROM job_seeker_skills WHERE job_seeker_id = job_seeker_applied_jobs.job_seeker_id AND skill_name IN (SELECT skill FROM employer_job_post_skills WHERE job_post_id = job_seeker_applied_jobs.job_id)) as skill_match"),


        DB.raw("(SELECT COUNT(*) FROM certificates WHERE user_id = job_seeker_applied_jobs.job_seeker_id) as total_certificates"),

        DB.raw(`
            (SELECT aptitude_match FROM (${aptitudeMatchSubquery.toSQL().toNative().sql}) AS aggregated_aptitude 
             WHERE aggregated_aptitude.user_id = job_seeker_applied_jobs.job_seeker_id
            ) AS aptitude_match
        `),

        DB.raw("(SELECT unlock_profile FROM employer_applicant_actions WHERE job_seeker_id = job_seeker_applied_jobs.job_seeker_id AND employer_id = '" + userId + "') as is_unlock")
      )
      .where("job_seeker_applied_jobs.job_id", id)
      .where("job_seeker_applied_jobs.is_applied", 1)
      .leftJoin("users", "job_seeker_applied_jobs.job_seeker_id", "users.id")
      .leftJoin("job_seeker_cv", "job_seeker_applied_jobs.job_seeker_id", "job_seeker_cv.job_seeker_id")

    const totalDocuments = await applicatants;

    if (pagination?.sortBy == "created_at") {
      applicatants.orderBy("job_seeker_applied_jobs.id", pagination.order)
    } else if (pagination?.sortBy == "first_name") {
      applicatants.orderBy("job_seeker_cv.first_name", pagination.order)
    } else {
      applicatants.orderBy("job_seeker_applied_jobs." + pagination?.sortBy, pagination.order)
    }

    // applicatants
    // .limit(pagination?.per_page || 100)
    // .offset((pagination?.page - 1) * pagination?.per_page || 0);
    const data = await applicatants;

    return { status: true, data: data, totalDocuments: totalDocuments.length }

  } catch (err) {
    console.log(">>>>>errr", err);
    return { data: err, status: false, message: "Data can't fetched." }
  }
}

exports.getMany = async (args) => {

  return new Promise((resolve, reject) => {
    let totalRecords;
    //for count
    let countQuery = DB(table);
    countQuery.where(args.match);
    countQuery.count("id as count");

    if (args.from) {
      countQuery.where(function () {
        this.where("is_posted", 1)
          .andWhere("posted_on", ">=", args.from)
          .orWhere(function () {
            this.where("is_posted", 0).andWhere("created_at", ">=", args.from);
          });
      });
    }

    if (args.to) {
      let toValue = args.to;
      toValue = moment(args.to).add(1, "day").format("YYYY-MM-DD")
      countQuery.where(function () {
        this.where("is_posted", 1)
          .andWhere("posted_on", "<", toValue)
          .orWhere(function () {
            this.where("is_posted", 0).andWhere("created_at", "<=", toValue);
          });
      });
    }

    countQuery
      .then(function (record) {
        totalRecords = record[0].count;

        // for data
        let dataQuery = DB(table);
        dataQuery
          .select(
            "employer_job_posts.id",
            "employer_job_posts.is_hired",
            "employer_job_posts.is_under_review",
            "employer_job_posts.title",
            "employer_job_posts.employer_id",
            "job_categories.name as job_category",
            "employer_job_posts.other_job_category",
            "employer_job_posts.created_at",
            "employer_job_posts.apply_before",
            "employer_job_posts.is_posted",
            "employer_job_posts.is_active",
            "job_types.name as job_type",
            "employer_job_posts.posted_on",
            "employer_job_posts.vacancies",
            DB.raw("COUNT(job_seeker_applied_jobs.id) as totalAppliedCandidates"),
            DB.raw(`CASE 
              WHEN employer_job_posts.is_active != 1 THEN 'Canceled'
        WHEN employer_job_posts.is_hired = 1 THEN 'Hired'
        WHEN employer_job_posts.is_under_review = 1 THEN 'Under Review'
          WHEN employer_job_posts.is_active = 1 THEN 'Open'
          END AS job_status
        `),
            DB.raw(
              "SUM(CASE WHEN job_seeker_applied_jobs.shortlisted = '1' THEN 1 ELSE 0 END) as total_shortlisted"
            ),
            DB.raw(
              "SUM(CASE WHEN job_seeker_applied_jobs.interviewd = '1' THEN 1 ELSE 0 END) as total_interviewed"
            ),
            DB.raw(
              "SUM(CASE WHEN job_seeker_applied_jobs.selected = '1' THEN 1 ELSE 0 END) as total_selected"
            ),
            DB.raw(
              "SUM(CASE WHEN job_seeker_applied_jobs.rejected = '1' THEN 1 ELSE 0 END) as total_rejected"
            ),
            DB.raw(
              "SUM(CASE WHEN job_seeker_applied_jobs.is_read = '0' THEN 1 ELSE 0 END) as total_unseen"
            ),
            DB.raw(
              "SUM(CASE WHEN employer_applicant_actions.unlock_profile = 1 THEN 1 ELSE 0 END) as total_unlocked_profiles"
            )
          )
          .leftJoin(
            "job_seeker_applied_jobs",
            function () {
              this.on("employer_job_posts.id", "=", "job_seeker_applied_jobs.job_id")
                .andOn("job_seeker_applied_jobs.is_applied", "=", 1);
            }
          )
          .leftJoin(
            "employer_applicant_actions",
            function () {
              this.on("employer_job_posts.employer_id", "=", "employer_applicant_actions.employer_id")
                .andOn("job_seeker_applied_jobs.job_seeker_id", "=", "employer_applicant_actions.job_seeker_id");
            }
          )
          .groupBy("employer_job_posts.id");

        dataQuery.where(args.queryMatch);

        if (args.from) {
          dataQuery.where(function () {
            this.where("is_posted", 1)
              .andWhere("employer_job_posts.posted_on", ">=", args.from)
              .orWhere(function () {
                this.where("is_posted", 0).andWhere("employer_job_posts.created_at", ">=", args.from);
              });
          });
        }

        if (args.to) {
          let toValue = args.to;
          toValue = moment(args.to).add(1, "day").format("YYYY-MM-DD")
          dataQuery.where(function () {
            this.where("is_posted", 1)
              .andWhere("employer_job_posts.posted_on", "<=", toValue)
              .orWhere(function () {
                this.where("is_posted", 0).andWhere("employer_job_posts.created_at", "<=", toValue);
              });
          });
        }

        dataQuery
          .leftJoin("job_categories", "employer_job_posts.job_category", "=", "job_categories.id")
          .leftJoin("job_types", "employer_job_posts.job_type", "=", "job_types.id")
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

exports.jobSeekerJobList = async (filter, jobFilter, user_id, pagination) => {
  try {
    const query = DB(table)
      .select("employer_job_posts.id", "employer_job_posts.posted_on", "employer_job_posts.area", "job_seeker_skills.skill_name", "employer_job_posts.created_at", "employer_job_posts.vacancies", "employer_job_posts.salary_range_from", "employer_job_posts.salary_range_to", "employer_job_posts.salary_currency", "employer_job_posts.hide_salary_range", "employer_job_posts.is_confidential", "employer_job_posts.title", "company_profile.company_name", "company_profile.logo", "job_types.name as job_type_name", "job_types.id as job_type_id", "job_categories.name as job_category_name", "job_categories.id as job_category_id", "employer_job_posts.other_job_category", "cities.name as city_name", "countries.name as country_name", "employer_job_posts.other_area", "areas.name as area_name",
        "carrier_levels.name as career_level_name",
        "carrier_levels.id as career_level_id",
        // DB.raw("COUNT(DISTINCT CASE WHEN job_seeker_applied_jobs.is_applied IS NOT NULL AND job_seeker_applied_jobs.is_applied = 1  THEN job_seeker_applied_jobs.id ELSE 0 END) as totalApplied"),
        DB.raw(`SUM(CASE WHEN job_seeker_applied_jobs.job_seeker_id = ${user_id} THEN 1 ELSE 0 END) as isApplied`),
        DB.raw("COUNT(DISTINCT job_post_screening_questions.job_post_id) as totalAskedQuestions"),
        DB.raw("COUNT(DISTINCT job_seeker_skills.id) as totalMatchedSkills")
      )
      .where(filter)
      .leftJoin("carrier_levels", "employer_job_posts.career_level", "carrier_levels.id")
      .leftJoin("company_profile", "company_profile.employer_id", "=", "employer_job_posts.employer_id")
      .leftJoin("job_categories", "job_categories.id", "=", "employer_job_posts.job_category")
      .leftJoin("job_types", "job_types.id", "=", "employer_job_posts.job_type")
      .leftJoin("cities", "cities.id", "=", "employer_job_posts.city")
      .leftJoin("countries", "countries.id", "=", "employer_job_posts.country")
      .leftJoin("areas", "areas.id", "=", "employer_job_posts.area")
      .leftJoin("job_seeker_applied_jobs", "employer_job_posts.id", "=", "job_seeker_applied_jobs.job_id")
      .leftJoin("job_post_screening_questions", "employer_job_posts.id", "=", "job_post_screening_questions.job_post_id")
      .leftJoin("employer_job_post_skills", "employer_job_posts.id", "=", "employer_job_post_skills.job_post_id")
      .leftJoin("job_seeker_skills", function () {
        this.on("employer_job_post_skills.skill", "=", DB.raw("job_seeker_skills.skill_name"))
          .andOn("job_seeker_skills.job_seeker_id", "=", user_id)
      })
      .groupBy(
        "employer_job_posts.id"
      )
      .having(DB.raw('isApplied'), '=', 0)
    if (jobFilter.job_type.length) {
      query.whereIn("job_type", jobFilter.job_type)
    }

    if (jobFilter.job_category.length) {
      query.whereIn("job_category", jobFilter.job_category)
    }

    if (jobFilter.career_level.length) {
      query.whereIn("career_level", jobFilter.career_level)
    }

    if (jobFilter?.salary_range_from?.length) {
      query.where(qb => {
        jobFilter.salary_range_from.forEach((range, i) => {
          if (range.includes('or below')) {
            const value = Number(range.replace(' or below', '').replace(",",""));
            qb.orWhere('employer_job_posts.salary_range_from', '<=', value);
          } else if (range.includes('or above')) {
            const value = Number(range.replace(' or above', '').replace(",",""));
            qb.orWhere('employer_job_posts.salary_range_from', '>', value);
          } else {
            const [min, max] = range.split(' - ').map((s) => Number(s.replace(",", "")));
            qb.orWhere(function () {
              this.where('employer_job_posts.salary_range_from', '>', min)
                .andWhere('employer_job_posts.salary_range_from', '<=', max);
            });
          }
        });
        // qb.andWhere("employer_job_posts.hide_salary_range", "=", "0")
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

    if (Array.isArray(totalDocuments)) {
      for await (const d of totalDocuments) {
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

exports.getSalaryRange = async (user_id = "") => {
  return new Promise((resolve, reject) => {
    DB(table)
      .leftJoin('job_seeker_applied_jobs', function () {
        this.on('job_seeker_applied_jobs.job_id', '=', 'employer_job_posts.id')
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
        DB.raw('COUNT(CASE WHEN job_seeker_applied_jobs.job_id IS NULL THEN 1 END) AS count')
      )
      .where("is_posted", "1")
      .andWhere("is_active", "1")
      .andWhere("is_hired", "0")
      .andWhere("is_delete", "0")
      .andWhere("is_under_review", "0")
      .andWhere("hide_salary_range", "0")
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
        console.log("err", err)
        resolve({ status: true, data: err });
      });
  });
}

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

exports.getMyJobs = async (match) => {
  return new Promise((resolve, reject) => {
    let query = DB(table).select("id", "title").where(match)
      .then(function (record) {
        resolve({ status: true, data: record });
      })
      .catch(function (error) {
        resolve({ status: false, data: [] });
      });
  })
}

exports.jobSeekerJobDescription = async (jobId, userId) => {
  try {
    const data = await DB(table)
      .select("employer_job_posts.*", "employer_job_posts.posted_on", "job_types.name as job_type_name", "job_categories.name as job_category_name", "job_categories.id as job_category_id", "employer_job_posts.other_job_category", "cities.name as city_name", "countries.name as country_name", "company_profile.company_name", "company_profile.logo", "company_profile.description", "areas.name as area_name",
        DB.raw("COUNT(job_post_screening_questions.job_post_id) as totalAskedQuestions")
      )
      .where("employer_job_posts.id", jobId)
      .leftJoin("company_profile", "company_profile.employer_id", "=", "employer_job_posts.employer_id")
      .leftJoin("job_categories", "job_categories.id", "=", "employer_job_posts.job_category")
      .leftJoin("job_types", "job_types.id", "=", "employer_job_posts.job_type")
      .leftJoin("cities", "cities.id", "=", "employer_job_posts.city")
      .leftJoin("countries", "countries.id", "=", "employer_job_posts.country")
      .leftJoin("areas", "areas.id", "=", "employer_job_posts.area")
      .leftJoin("job_post_screening_questions", "employer_job_posts.id", "=", "job_post_screening_questions.job_post_id")
      .first();

    if (data) {
      const keyElem = await DB("employer_job_post_skills")
        .select("id", "skill as name")
        .where("job_post_id", jobId)
      data['skills'] = keyElem;

      const totalApplied = await DB("job_seeker_applied_jobs").where({ "job_id": jobId, "is_applied": 1 }).count("id as total");
      data['totalApplied'] = totalApplied[0].total;

      const isApplied = await DB("job_seeker_applied_jobs").select("id", "is_applied").where({ "job_id": jobId, "job_seeker_id": userId }).first();
      data['isApplied'] = (isApplied && isApplied.is_applied) ? 1 : 0;
      data['isSaved'] = (isApplied && !isApplied.is_applied) ? 1 : 0;
    }
    return { status: true, data: data }
  } catch (error) {
    console.log(">><<<<", error);
    return { status: false, data: error }
  }
}

exports.getJobSeekerAppliedJobs = async (filter, applyFilter, user_id, pagination) => {
  try {
    const query = DB('job_seeker_applied_jobs')
      .select("job_seeker_applied_jobs.created_at", "job_seeker_applied_jobs.applied_on", "job_seeker_applied_jobs.reject_reason", "job_seeker_applied_jobs.job_id", "job_seeker_applied_jobs.is_applied", "job_seeker_applied_jobs.interviewd", "job_seeker_applied_jobs.rejected", "job_seeker_applied_jobs.shortlisted", "job_seeker_applied_jobs.is_hold", "job_seeker_applied_jobs.selected", "employer_job_posts.employer_id", "employer_job_posts.is_confidential", "employer_job_posts.title", "employer_job_posts.is_active", "employer_job_posts.is_hired", "employer_job_posts.is_under_review",
        DB.raw(`CASE  WHEN job_seeker_applied_jobs.is_applied = 1 THEN job_seeker_applied_jobs.applied_on ELSE job_seeker_applied_jobs.created_at END AS action_on_date`),
        DB.raw(`CASE 
          WHEN employer_job_posts.is_confidential = 1 
          THEN 'Confidential' 
          ELSE company_profile.company_name 
        END AS company_name`),
        DB.raw(`CASE 
          WHEN job_seeker_applied_jobs.is_applied = 1 
          THEN 'Applied' 
          ELSE 'Saved' 
        END AS hiring_status`),

        DB.raw(`
          CASE
            WHEN job_seeker_applied_jobs.rejected = 1 THEN 'Declined'
            WHEN job_seeker_applied_jobs.selected = 1 THEN 'Hired'
            WHEN job_seeker_applied_jobs.interviewd = 1 THEN 'Final Interview'
            WHEN job_seeker_applied_jobs.shortlisted = 1 THEN 'Shortlisted'
            WHEN (SELECT unlock_profile 
              FROM employer_applicant_actions 
              WHERE employer_id = employer_job_posts.employer_id 
                AND job_seeker_id = ${user_id} 
              LIMIT 1) = 1 THEN 'Unlocked'
            ELSE 'Locked'
          END AS my_hiring_status
        `),

        DB.raw(`
          CASE
          WHEN employer_job_posts.is_active = 0 THEN 'Canceled'
          WHEN employer_job_posts.is_hired = 1 THEN 'Hired'
          WHEN employer_job_posts.is_under_review = 1 THEN 'Under Review'
            ELSE 'Open'
          END AS job_status
        `),


        "company_profile.logo",
        DB.raw("(SELECT unlock_profile FROM employer_applicant_actions WHERE job_seeker_id = '" + user_id + "' AND employer_id = employer_job_posts.employer_id LIMIT 1) as is_unlock")
      )
      .where("job_seeker_applied_jobs.job_seeker_id", "=", user_id)
      .leftJoin("employer_job_posts", "job_seeker_applied_jobs.job_id", "=", "employer_job_posts.id")
      .leftJoin("company_profile", "employer_job_posts.employer_id", "=", "company_profile.employer_id")

    if (applyFilter.isApplied) {
      query.andWhere("job_seeker_applied_jobs.is_applied", applyFilter.isApplied)
    }

    console.log("pagination", pagination)
    if (pagination?.sortBy == "created_at") {
      query.orderBy("job_seeker_applied_jobs.id", pagination.order)
    }
    else if (pagination?.sortBy == "company_name") {
      query.orderBy(`company_name`, pagination.order)
    }
    else if (pagination?.sortBy == "title") {
      query.orderBy(`title`, pagination.order)
    }
    else if (pagination?.sortBy == "hiring_status") {
      query.orderBy("hiring_status", pagination.order)
    }
    else if (pagination?.sortBy == "my_hiring_status") {
      query.orderBy("my_hiring_status", pagination.order)
    }
    else if (pagination?.sortBy == "job_status") {
      query.orderBy("job_status", pagination.order)
    }
    else if (pagination?.sortBy == "action_on_date") {
      query.orderBy("action_on_date", pagination.order)
    }

    const totalDocuments = await query;

    query
      .limit(pagination?.per_page || 100)
      .offset((pagination?.page - 1) * pagination?.per_page || 0);
    const data = await query;

    return { status: true, data: data, totalDocuments: totalDocuments.length }
  } catch (error) {
    console.log("error >>>> ", error);
    return { status: false, data: error }
  }
}

exports.getExpiredJobs = async () => {
  return new Promise((resolve, reject) => {
    let query = DB(table).select("id", "apply_before");
    query.where("is_active", "=", 1)
    query.where("is_active", "=", 1)
    query.where("apply_before", "<", moment(new Date()).format("YYYY-MM-DD"));
    query.then(function (record) {
      resolve({ status: true, data: record });
    })
      .catch(function (error) {
        resolve({ status: false, data: error });
      });
  });
}

exports.updateMany = async (ids, data) => {
  return new Promise((resolve, reject) => {
    let query = DB(table)
    query.whereIn("id", ids)
      .update(data)
      .then(function (record) {
        resolve({ status: true, data: {} });
      })
      .catch(function (error) {
        console.log(">>>>>>", error);
        resolve({ status: false, data: error });
      });
  });
}

exports.reopenJob = async (match, data) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .where(match)
      .update(data)
      .then(function (record) {
        resolve({ status: true, data: {} });
      })
      .catch(function (error) {
        console.log(">>>>>asaas", error);
        resolve({ status: false, data: error });
      });
  });
}