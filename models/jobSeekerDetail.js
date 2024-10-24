const table = "job_seeker_details";

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

exports.getOne = async (query, notQuery = {}) => {
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

    if (args.is_active && args.is_active != "") {
      if (args.is_active == "true") {
        countQuery.where("users.is_active", 1);
      } else if (args.is_active == "false") {
        countQuery.where("users.is_active", 0);
      }
    } 
    if (args.first_name && args.first_name != "") {
      countQuery.whereILike("users.first_name", "%" + args.first_name + "%");
    }
    if (args.last_name && args.last_name != "") {
      countQuery.whereILike("users.last_name", "%" + args.last_name + "%");
    }
    if (args.email && args.email != "") {
      countQuery.whereILike("users.email", "%" + args.email + "%");
    }

    if (args.dateFrom) {
      countQuery.where("users.created_at", ">=", args.dateFrom);
    }

    if (args.dateTo) {
      countQuery.where("users.created_at", "<", args.dateTo);
    }
    countQuery.count("users.id as count");
    countQuery
      .then(function (record) {
        totalRecords = record[0].count;

        //for data
        let dataQuery = DB(table);
      

        dataQuery.where(args.match);
        if (args.is_active && args.is_active != "") {
          if (args.is_active == "true") {
            dataQuery.where("users.is_active", 1);
          } else if (args.is_active == "false") {
            dataQuery.where("users.is_active", 0);
          }
        }
        if (args.first_name && args.first_name != "") {
          dataQuery.whereILike("users.first_name", "%" + args.first_name + "%");
        }
        if (args.last_name && args.last_name != "") {
          dataQuery.whereILike("users.last_name", "%" + args.last_name + "%");
        }
        if (args.email && args.email != "") {
          dataQuery.whereILike("users.email", "%" + args.email + "%");
        }        

        

        if (args.dateFrom) {
          dataQuery.where("users.created_at", ">=", args.dateFrom);
        }

        if (args.dateTo) {
          dataQuery.where("users.created_at", "<", args.dateTo);
        }

        dataQuery
          .orderBy(args.sort_by || "users.created_at", args.order || "desc")
          .limit(args.per_page)
          .offset((args.page - 1) * args.per_page)
          .then(function (record) {
            resolve({
              status: true,
              data: {
                totalRecords,
                record: record.map((val) => {
                  return { ...val, isActive: val.is_active ? true : false };
                }),
              },
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

exports.getProfileData = async (query, notQuery = {}) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .select(
        "employer_details.legal_name",
        "users.email",
        "users.phone_number",
        "users.is_paused",
        "employer_details.entity_type_id",
        "employer_details.trading_name",
        "employer_details.no_and_street",
        "employer_details.city_id",
        "employer_details.post_code",
        "employer_details.region_id",
        "employer_details.district_id",
        "employer_details.are_you_a_recruitment_agency",
        "employer_details.company_profile",
        "employer_details.company_logo",
        "employer_details.number_of_employee_in_company",
        "employer_details.contact_person_full_name",
        "employer_details.employer_number"
      )
      .leftJoin(
        "employer_details",
        "employer_details.employer_id",
        "=",
        "users.id"
      )
      .where(query)
      .whereNot(notQuery)
      .first()
      .then(function (record) {
        resolve({
          ...record,
          isActive: record.is_active ? true : false,
        });
      })
      .catch(function (error) {
        console.log(error);
        resolve(null);
      });
  });
};

exports.getJobHunterProfileData = async (query, notQuery = {}) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .select(
        "job_hunter_preferred_cagory.category_id",
        "job_hunter_preferred_cagory.sub_category_id",
        "job_hunter_preferred_locations.region_id",
        "job_hunter_preferred_locations.district_id"
      )
      .leftJoin(
        "job_hunter_preferred_cagory",
        "job_hunter_preferred_cagory.job_hunter_id",
        "=",
        "users.id"
      )
      .leftJoin(
        "job_hunter_preferred_locations",
        "job_hunter_preferred_locations.job_hunter_id",
        "=",
        "users.id"
      )
      .where(query)
      .whereNot(notQuery)
      .groupBy(
        "job_hunter_preferred_cagory.category_id",
        "job_hunter_preferred_cagory.sub_category_id",
        "job_hunter_preferred_locations.region_id",
        "job_hunter_preferred_locations.district_id"
      )
      .then(function (record) {
        resolve({
          ...record,
          isActive: record.is_active ? true : false,
        });
      })
      .catch(function (error) {
        console.log(error);
        resolve(null);
      });
  });
};

exports.getJobHunterList = async (args) => {
  return new Promise((resolve, reject) => {
    let totalRecords;

    //for count
    let countQuery = DB(table);

    countQuery
      .select(
        "users.id as id",
        "users.first_name",
        "users.last_name",
        "users.email",
        "users.phone_number",
        "users.is_active",
        "users.created_at",

        "districts.name as districtName",
        "districts.id as district_id",

        "regions.name as regionName",
        "regions.id as region_id",

        "job_hunter_details.job_hunter_number as job_hunter_number",
        "job_hunter_details.job_type as job_type",
        "job_hunter_details.pay_type as pay_type",
        "job_hunter_details.available_from as available_from",
        "job_hunter_details.pay_expexctation_range_from as pay_expexctation_range_from",
        "job_hunter_details.pay_expexctation_range_to as pay_expexctation_range_to",
        "job_hunter_details.profile_description as profile_description",
        "job_hunter_details.step1 as step1",
        "job_hunter_details.step2 as step2",
        "job_hunter_details.step3 as step3",
        "job_hunter_details.step4 as step4",

        "lookups.lookup_type as job_type_name",
        DB.raw("GROUP_CONCAT(job_hunter_skills.skill) as skillName"),
        DB.raw(
          "GROUP_CONCAT(job_hunter_preferred_cagory.category_id) as categories"
        )
      )
      .leftJoin(
        "job_hunter_details",
        "job_hunter_details.job_hunter_id",
        "=",
        "users.id"
      )
      .leftJoin("regions", "job_hunter_details.region_id", "=", "regions.id")
      .leftJoin(
        "districts",
        "job_hunter_details.district_id",
        "=",
        "districts.id"
      )
      .leftJoin(
        "job_hunter_skills",
        "users.id",
        "=",
        "job_hunter_skills.job_hunter_id"
      )
      .leftJoin(
        "job_hunter_preferred_cagory",
        "users.id",
        "=",
        "job_hunter_preferred_cagory.job_hunter_id"
      )
      .leftJoin("lookups", "job_hunter_details.job_type", "=", "lookups.id")
      .groupBy("job_hunter_skills.job_hunter_id")
      .groupBy("job_hunter_preferred_cagory.job_hunter_id");

    countQuery.where({
      ...args.match,
      step1: 1,
      step2: 1,
      step3: 1,
      step4: 1,
      is_paused: 0,
    });
    // countQuery.whereNot({ pay_type: null });

    if (args.skill && args.skill != "") {
      countQuery.whereILike("job_hunter_skills.skill", "%" + args.skill + "%");
    }
    if (args.job_hunter_number && args.job_hunter_number != "") {
      countQuery.whereILike(
        "job_hunter_details.job_hunter_number",
        "%" + args.job_hunter_number + "%"
      );
    }
    if (args.category && args.category != "") {
      countQuery.whereILike(
        "job_hunter_preferred_cagory.category_id",
        "%" + args.category + "%"
      );
    }
    // if (args.job_type && args.job_type != "") {
    //   countQuery.whereILike(
    //     "job_hunter_details.job_type",
    //     "%" + args.job_type + "%"
    //   );
    // }
    // if (args.pay_type && args.pay_type != "") {
    //   countQuery.whereILike(
    //     "job_hunter_details.pay_type",
    //     "%" + args.pay_type + "%"
    //   );
    // }
    if (args.available_from && args.available_from != "") {
      countQuery.whereILike(
        "job_hunter_details.available_from",
        "%" + args.available_from + "%"
      );
    }
    // if (
    //   args.pay_expexctation_range_from &&
    //   args.pay_expexctation_range_from != ""
    // ) {
    //   countQuery.where(
    //     "job_hunter_details.pay_expexctation_range_from",
    //     "<=",
    //     args.pay_expexctation_range_to
    //   );
    // }
    // if (
    //   args.pay_expexctation_range_to &&
    //   args.pay_expexctation_range_to != ""
    // ) {
    //   countQuery.where(
    //     "job_hunter_details.pay_expexctation_range_to",
    //     ">=",
    //     args.pay_expexctation_range_from
    //   );
    // }

    countQuery
      .then(function (record) {
        resolve(record);
      })
      .catch(function (error) {
        console.log(error);
        resolve({ status: false, data: error });
      });
  });
};

exports.getEmployerDashboardData = async (id) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .select(
        "users.id",
        "users.email",
        "users.phone_number",
        "employer_details.legal_name",
        "employer_details.trading_name",
        "employer_details.employer_number",
        "employer_details.no_and_street",
        "employer_details.city_id",
        "employer_details.post_code",
        "employer_details.region_id",
        "employer_details.district_id",
        "employer_details.company_profile",
        "employer_details.company_logo",
        "employer_details.contact_person_full_name",
        "cities.name as city_name",
        "regions.name as region_name",
        "districts.name as district_name"
      )
      .leftJoin(
        "employer_details",
        "employer_details.employer_id",
        "=",
        "users.id"
      )
      .leftJoin("cities", "employer_details.city_id", "=", "cities.id")
      .leftJoin("regions", "employer_details.region_id", "=", "regions.id")
      .leftJoin(
        "districts",
        "employer_details.district_id",
        "=",
        "districts.id"
      )
      .where(`users.id`, id)
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

exports.getJobHunterDashboardData = async (id) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .select(
        "users.id",
        "users.first_name",
        "users.last_name",
        "users.email",
        "users.phone_number",
        "job_hunter_details.job_hunter_number",
        "job_hunter_details.linkedin_profile",
        "job_hunter_details.region_id",
        "job_hunter_details.district_id",
        "job_hunter_details.profile_description",
        "job_hunter_details.profile_picture",
        "regions.name as region_name",
        "districts.name as district_name"
      )
      .leftJoin(
        "job_hunter_details",
        "job_hunter_details.job_hunter_id",
        "=",
        "users.id"
      )
      .leftJoin("regions", "job_hunter_details.region_id", "=", "regions.id")
      .leftJoin(
        "districts",
        "job_hunter_details.district_id",
        "=",
        "districts.id"
      )
      .where(`users.id`, id)
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

exports.getUncompletedProfiles = async () => {
  return new Promise((resolve, reject) => {
    //for count
    let countQuery = DB(table);

    countQuery
      .select(
        "users.id as id",
        "users.first_name",
        "users.last_name",
        "users.email",
        "users.phone_number",
        "users.is_active",
        "users.created_at",
        "job_hunter_details.job_hunter_number as job_hunter_number",
        "job_hunter_details.step1 as step1",
        "job_hunter_details.step2 as step2",
        "job_hunter_details.step3 as step3",
        "job_hunter_details.step4 as step4",
      )
      .leftJoin(
        "job_hunter_details",
        "job_hunter_details.job_hunter_id",
        "=",
        "users.id"
      )     

    countQuery.where({
      step4: 0,
      is_paused: 0,
    });
    countQuery
      .then(function (record) {
        resolve(record);
      })
      .catch(function (error) {
        console.log(error);
        resolve([]);
      });
  });
};


exports.getJobSeekerAnswers = async (job_id, user_id) => {
  try {
    const query = DB("job_seeker_screening_answer")
    .where("job_seeker_screening_answer.job_id","=", job_id)
    .andWhere("job_seeker_screening_answer.applied_id", user_id)
    .leftJoin("job_post_screening_questions", "job_seeker_screening_answer.question_id","=","job_post_screening_questions.id")

    const hasQuestions = await DB("job_post_screening_questions").where("job_post_id", job_id).count("id as count").first();
    const data = await query

    const query2 = DB("job_seeker_applied_jobs")
    .where("id", "=", user_id)

    const data2 = await query2
    let finalData = [];
    if(hasQuestions.count > 0){
      const extras = [];      
      if(data2[0]['start_immediate'] == 0){
        extras.push({question: "What is your Notice Period? (In Days)", answer: data2[0]['notice_period']});
      }

      finalData = [
        {question: "What are your salary expectation?", answer: data2[0]['salary_expectation']},
        {question: "Are you willing to start immediately?", answer: data2[0]['start_immediate'] ? "Yes" : "No"},
        ...extras,
        {question: "How many years of experience do you have?", answer: data2[0]['team_manage_exp']},
        {question: "What your English Level? (C2-A2)?", answer: data2[0]['eng_level']},
        {question: "What makes you the ideal candidate for this position?", answer: data2[0]['why_you']},
        ...data,
      ]
    }
    return {status: true, data: data}
  } catch (error) {
    console.log(">>>>>erorrr", error);
    return {status: false, data: error}
  }
}

exports.getJobSeekerDetails = async (job_id, user_id) => {
  try {
    const query = DB("job_seeker_applied_jobs")
    .where("id", "=", user_id)
    .leftJoin("users", "job_seeker_applied_jobs.job_seeker_id", "=", "users.id")

  } catch (error) {
    
  }
}