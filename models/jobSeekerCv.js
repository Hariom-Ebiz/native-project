const table = "job_seeker_cv";

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

exports.getAll = async (query, notQuery = {}) => {
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

exports.getOneDetailed = async (query, notQuery = {}) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .select(
        "job_seeker_cv.*",
        "countries.name as current_country_name",
        "cities.name as current_city_name",
        "areas.name as current_area_name",
        "job_seeker_details.gender",
        "nationality.name as nationality_name"
      )
      .leftJoin(
        "countries",
        "countries.id",
        "=",
        "job_seeker_cv.current_country"
      )
      .leftJoin(
        "nationality",
        "nationality.id",
        "=",
        "job_seeker_cv.nationality"
      )
      .leftJoin(
        "cities",
        "cities.id",
        "=",
        "job_seeker_cv.current_city"
      )
      .leftJoin(
        "areas",
        "areas.id",
        "=",
        "job_seeker_cv.current_area"
      )
      .leftJoin(
        "job_seeker_details",
        "job_seeker_details.job_seeker_id",
        "=",
        "job_seeker_cv.job_seeker_id"
      )
      .where("job_seeker_cv.job_seeker_id", query.job_seeker_id)
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

exports.getSerachCvJobSeeker = async (cvFiter, jobsFilter, pagination, employerId) => {
  try {
    let result = [];

    let jobsFilterArr = [];

    if (jobsFilter.job_type.length || jobsFilter.job_category.length || jobsFilter.min_expected_salary.length) {

      const jobTypePlaceholders = (await Promise.all(jobsFilter.job_type.map(() => '?'))).join(',');
      const jobCategoryPlaceholders = (await Promise.all(jobsFilter.job_category.map(() => '?'))).join(',');
      const jobTypeValues = jobsFilter.job_type || [];
      const jobCategoryValues = jobsFilter.job_category || [];

      const values = [...jobTypeValues, ...jobCategoryValues];
      let myQuery = `
  SELECT 
      jscp.job_seeker_id
  FROM 
      job_seeker_career_preference AS jscp`;

      if (jobsFilter.job_type.length && jobsFilter.job_category.length) {
        myQuery += `
    LEFT JOIN (
      SELECT 
          id, 
          JSON_UNQUOTE(JSON_EXTRACT(job_type, CONCAT('$[', numbers.n, ']'))) AS job_type_element
      FROM 
          job_seeker_career_preference
      CROSS JOIN (
          SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
      ) AS numbers
      WHERE 
          JSON_UNQUOTE(JSON_EXTRACT(job_type, CONCAT('$[', numbers.n, ']'))) IS NOT NULL
    ) AS expanded_job_types 
    ON jscp.id = expanded_job_types.id
    
    LEFT JOIN (
      SELECT 
          id, 
          JSON_UNQUOTE(JSON_EXTRACT(job_category, CONCAT('$[', numbers.n, ']'))) AS job_category_element
      FROM 
          job_seeker_career_preference
      CROSS JOIN (
          SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
      ) AS numbers
      WHERE 
          JSON_UNQUOTE(JSON_EXTRACT(job_category, CONCAT('$[', numbers.n, ']'))) IS NOT NULL
    ) AS expanded_job_categories 
    ON jscp.id = expanded_job_categories.id
    
    WHERE job_type_element IN (${jobTypePlaceholders}) AND job_category_element IN (${jobCategoryPlaceholders})
  `;
      } else if (jobsFilter.job_type.length) {
        myQuery += `
    LEFT JOIN (
      SELECT 
          id, 
          JSON_UNQUOTE(JSON_EXTRACT(job_type, CONCAT('$[', numbers.n, ']'))) AS job_type_element
      FROM 
          job_seeker_career_preference
      CROSS JOIN (
          SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
      ) AS numbers
      WHERE 
          JSON_UNQUOTE(JSON_EXTRACT(job_type, CONCAT('$[', numbers.n, ']'))) IS NOT NULL
    ) AS expanded_job_types 
    ON jscp.id = expanded_job_types.id
    
    WHERE job_type_element IN (${jobTypePlaceholders})
  `;
      } else if (jobsFilter.job_category.length) {
        myQuery += `
    LEFT JOIN (
      SELECT 
          id, 
          JSON_UNQUOTE(JSON_EXTRACT(job_category, CONCAT('$[', numbers.n, ']'))) AS job_category_element
      FROM 
          job_seeker_career_preference
      CROSS JOIN (
          SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
      ) AS numbers
      WHERE 
          JSON_UNQUOTE(JSON_EXTRACT(job_category, CONCAT('$[', numbers.n, ']'))) IS NOT NULL
    ) AS expanded_job_categories 
    ON jscp.id = expanded_job_categories.id
    
    WHERE job_category_element IN (${jobCategoryPlaceholders})
  `;
      }

      if (jobsFilter.min_expected_salary && jobsFilter.min_expected_salary.length) {
        let isUse = jobsFilter.job_type.length || jobsFilter.job_category.length;
        myQuery += (isUse) ? "" : " WHERE";
        jobsFilter.min_expected_salary.forEach((range, i) => {
          if (range.includes('or below')) {
            const value = Number(range.replace(' or below', '').replace(",",""));
            myQuery += ` ${(i > 0) ? " OR" : (isUse) ? " AND" : ""} min_expected_salary <= ${value}`;
          } else if (range.includes('or above')) {
            const value = Number(range.replace(' or above', '').replace(",",""));
            myQuery += ` ${(i > 0) ? " OR" : (isUse) ? " AND" : ""} min_expected_salary > ${value}`;
          } else {
            const [min, max] = range.split(' - ').map((s)=>Number(s.replace(",", "")));
            myQuery += `${(i > 0) ? " OR" : (isUse) ? " AND" : ""} min_expected_salary > ${min} AND min_expected_salary <= ${max}`;
          }
        });

        myQuery += " GROUP BY jscp.job_seeker_id;"
      } else {
        myQuery += " GROUP BY jscp.job_seeker_id;"
      }

      const getFilterCv = await DB.raw(myQuery, values);

      let ids = await Promise.all(getFilterCv[0].map((m) => m.job_seeker_id));
      if (ids.length == 0) {
        return { data: [], totalDocuments: 0, status: true, message: "Data Fetched." }
      }
      jobsFilterArr = ids;
    }

    if (jobsFilter.job_title) {
      const query = await DB("job_seeker_experiences").select("job_seeker_id").where("job_title", "like", `%${jobsFilter.job_title}%`);

      if (query.length) {

        let ids = await Promise.all(query.map(d => d.job_seeker_id));
        
        if (jobsFilterArr.length) {
          jobsFilterArr =  jobsFilterArr.filter(f => ids.includes(f));
          if (!jobsFilterArr.length) {
            return { data: [], totalDocuments: 0, status: true, message: "Data Fetched." }
          }
        } else {
          if (ids.length) {
            
            jobsFilterArr = ids;
          } else {
            return { data: [], totalDocuments: 0, status: true, message: "Data Fetched." }
          }
        }
      } else {
        return { data: [], totalDocuments: 0, status: true, message: "Data Fetched." }
      }

    }

    const countQuery = DB(table)
    .where(cvFiter)
    .andWhere("job_seeker_career_preference.make_profile_public","=",1)
    .leftJoin("job_seeker_career_preference", "job_seeker_cv.job_seeker_id", "=", "job_seeker_career_preference.job_seeker_id")


    if (jobsFilterArr.length > 0) {
      countQuery.whereIn("job_seeker_cv.job_seeker_id", jobsFilterArr);
    }
    countQuery.count("job_seeker_cv.job_seeker_id as count")
    const totalDocuments = await countQuery;

    const query = DB(table)
      .select(
        // "job_seeker_cv.id",
        "job_seeker_career_preference.make_profile_public",
        "job_seeker_cv.profile_pic as image",
        "job_seeker_cv.job_seeker_id",
        "job_seeker_cv.first_name",
        "job_seeker_cv.last_name",
        "job_seeker_cv.dob",
        "job_seeker_cv.contact_email",
        "cv_city.name as cv_city",
        "cv_country.name as cv_country",
        "job_seeker_details.gender",
        "nationality.name as nationality",
        "employer_applicant_actions.unlock_profile"
      );
        
      if (jobsFilterArr.length > 0) {
        query.whereIn("job_seeker_cv.job_seeker_id", jobsFilterArr);
      }

      query.where(cvFiter)
      .andWhere("job_seeker_career_preference.make_profile_public","=",1)
      .leftJoin("job_seeker_details", "job_seeker_details.job_seeker_id", "=", "job_seeker_cv.job_seeker_id")
      .leftJoin("job_seeker_career_preference", "job_seeker_cv.job_seeker_id", "=", "job_seeker_career_preference.job_seeker_id")
      .leftJoin("cities as cv_city", "job_seeker_cv.current_city", "=", "cv_city.id")
      .leftJoin("countries as cv_country", "job_seeker_cv.current_country", "=", "cv_country.id")
      .leftJoin("nationality", "job_seeker_cv.nationality", "=", "nationality.id")
      .leftJoin("employer_applicant_actions", function() {
        this.on("employer_applicant_actions.job_seeker_id", "=", "job_seeker_cv.job_seeker_id")
            .andOn("employer_applicant_actions.employer_id", "=", employerId)})
      .groupBy("job_seeker_id")
      
      if(pagination.sortBy == "first_name") {
        query.orderByRaw('CONCAT(job_seeker_cv.first_name, job_seeker_cv.last_name)')
        .limit(pagination?.per_page || 100)
        .offset((pagination?.page - 1) * pagination?.per_page || 0)
      } else if(pagination.sortBy != "invited_before" && pagination.sortBy != "applied_before"){
        query.orderBy("job_seeker_cv." + pagination.sortBy, pagination.order)
        .limit(pagination?.per_page || 100)
        .offset((pagination?.page - 1) * pagination?.per_page || 0)
      }
      else{
        query.orderBy("job_seeker_cv.created_at", "desc")
      }

    const cvData = await query;
    const getIds = await Promise.all(cvData.map((id) => id.job_seeker_id));
    console.log("ids : ", getIds);
    

    const exp = await DB("job_seeker_experiences").select("job_seeker_experiences.job_seeker_id", "job_seeker_experiences.job_title", "job_seeker_experiences.company_name", "job_seeker_experiences.start_date", "job_seeker_experiences.end_date", "cities.name as city", "countries.name as country", "job_types.name as job_type")
      .whereIn("job_seeker_id", getIds)
      .leftJoin("cities", "job_seeker_experiences.city", "=", "cities.id")
      .leftJoin("countries", "job_seeker_experiences.country", "=", "countries.id")
      .leftJoin("job_types", "job_seeker_experiences.job_type", "=", "job_types.id")
      // .groupBy("job_seeker_id");

    const education = await DB("job_seeker_post_graduations").select("job_seeker_post_graduations.job_seeker_id", "job_seeker_post_graduations.university_name", "job_seeker_post_graduations.field_of_study", "job_seeker_post_graduations.other_field_of_study", "job_seeker_post_graduations.start_year", "job_seeker_post_graduations.end_year", "countries.name as country", "post_graduation_degree_levels.name as degree_name", "job_seeker_post_graduations.other_degree_level")
      .whereIn("job_seeker_id", getIds)
      .leftJoin("countries", "job_seeker_post_graduations.country", "=", "countries.id")
      .leftJoin("post_graduation_degree_levels", "job_seeker_post_graduations.degree_level", "=", "post_graduation_degree_levels.id")
    
    
      const university = await DB("job_seeker_universities").select("job_seeker_universities.job_seeker_id","job_seeker_universities.university_name","job_seeker_universities.field_of_study","job_seeker_universities.other_field_of_study","job_seeker_universities.start_year","job_seeker_universities.end_year","countries.name as country", "degree_levels.name as degree_name", "job_seeker_universities.other_degree_level")
      .whereIn("job_seeker_id", getIds)
      .leftJoin("countries", "job_seeker_universities.country", "=", "countries.id")
      .leftJoin("degree_levels", "degree_levels.id","=","job_seeker_universities.degree_level")
      
      const school = await DB("job_seeker_educations").select("job_seeker_educations.job_seeker_id","job_seeker_educations.high_school_name","job_seeker_educations.graduation_year","countries.name as country", "job_seeker_educations.graduation_other_certificate", "graduation_certificates.name as grade_name")
      .whereIn("job_seeker_id", getIds)
      .leftJoin("countries", "job_seeker_educations.country", "=", "countries.id")
      .leftJoin("graduation_certificates", "job_seeker_educations.graduation_certificate", "=", "graduation_certificates.id")
    
      const inviteDates = await DB("job_invited_candidate")
      .select("job_seeker_id","created_at")
      .whereIn("job_seeker_id", getIds)
      .andWhere("employer_id",employerId)
      .groupBy("job_seeker_id")
      .orderBy("created_at","desc")

      const applyDates = await DB("job_seeker_applied_jobs")
      .select("job_seeker_id","job_seeker_applied_jobs.created_at")
      .whereIn("job_seeker_id", getIds)
      .leftJoin("employer_job_posts", function (){
        this.on("job_seeker_applied_jobs.job_id", "=", "employer_job_posts.id")
        .andOn("employer_job_posts.employer_id", "=", employerId)
      })
      .whereNotNull("employer_job_posts.id")
      .groupBy("job_seeker_id")
      .orderBy("created_at","desc")


    const certification = await DB("job_seeker_certifications").select("job_seeker_certifications.job_seeker_id", "job_seeker_certifications.organisation_name", "job_seeker_certifications.topic", "job_seeker_certifications.other_topic", "job_seeker_certifications.graduation_year", "countries.name as country")
      .whereIn("job_seeker_id", getIds)
      .leftJoin("countries", "job_seeker_certifications.country", "=", "countries.id")
      // .groupBy("job_seeker_id");

    const careerPrefrence = await DB.raw(`
    SELECT 
    jscp.id,
    jscp.job_seeker_id,
    jscp.job_type, 
    jscp.job_category, 
    jscp.make_profile_public, 

    jt.name AS job_type_name, 
    jc.name AS job_category_name
    FROM 
        job_seeker_career_preference AS jscp
    LEFT JOIN (
        SELECT 
            id, 
            JSON_UNQUOTE(JSON_EXTRACT(job_type, CONCAT('$[', numbers.n, ']'))) AS job_type_element
        FROM 
            job_seeker_career_preference
        CROSS JOIN (
            SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
        ) AS numbers
        WHERE 
            JSON_UNQUOTE(JSON_EXTRACT(job_type, CONCAT('$[', numbers.n, ']'))) IS NOT NULL
    ) AS expanded_job_types 
    ON jscp.id = expanded_job_types.id
    LEFT JOIN 
        job_types AS jt 
    ON expanded_job_types.job_type_element = jt.id
    LEFT JOIN (
        SELECT 
            id, 
            JSON_UNQUOTE(JSON_EXTRACT(job_category, CONCAT('$[', numbers.n, ']'))) AS job_category_element
        FROM 
            job_seeker_career_preference
        CROSS JOIN (
            SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
        ) AS numbers
        WHERE 
            JSON_UNQUOTE(JSON_EXTRACT(job_category, CONCAT('$[', numbers.n, ']'))) IS NOT NULL
    ) AS expanded_job_categories 
    ON jscp.id = expanded_job_categories.id
    LEFT JOIN 
        job_categories AS jc 
    ON expanded_job_categories.job_category_element = jc.id;
        `)
    const prefrenceResult = Object.values(careerPrefrence[0].reduce((acc, curr) => {
      const key = curr.id; // or curr.job_seeker_id

      if (!acc[key]) {
        acc[key] = {
          id: curr.id,
          job_seeker_id: curr.job_seeker_id,
          job_type_names: [],
          job_category_names: []
        };
      }

      if (!acc[key].job_type_names.includes(curr.job_type_name)) {
        acc[key].job_type_names.push(curr.job_type_name);
      }

      if (!acc[key].job_category_names.includes(curr.job_category_name)) {
        acc[key].job_category_names.push(curr.job_category_name);
      }

      return acc;
    }, {}));

    let finalData = await Promise.all(cvData.map((d) => {

      const isAlreadyInvited = inviteDates.filter((m) => m.job_seeker_id == d.job_seeker_id).length > 0;
      const isAlreadyApplied = applyDates.filter((m) => m.job_seeker_id == d.job_seeker_id).length > 0;

      d['exp'] = exp.filter((f) => f.job_seeker_id == d.job_seeker_id);
      d['edu'] = education.filter((m) => m.job_seeker_id == d.job_seeker_id);
      d['uni'] = university.filter((m) => m.job_seeker_id == d.job_seeker_id);
      d['sch'] = school.filter((m) => m.job_seeker_id == d.job_seeker_id);
      d['isAlreadyInvited'] = inviteDates.filter((m) => m.job_seeker_id == d.job_seeker_id).length > 0;
      d['isAlreadyApplied'] = applyDates.filter((m) => m.job_seeker_id == d.job_seeker_id).length > 0;
      d['invite_date'] = isAlreadyInvited ? inviteDates.find(m => m.job_seeker_id == d.job_seeker_id).created_at : 0;
      d['apply_date'] = isAlreadyApplied ? applyDates.find(m => m.job_seeker_id == d.job_seeker_id).created_at : 0;
      d['cert'] = certification.filter((n) => n.job_seeker_id == d.job_seeker_id);
      d['pref'] = prefrenceResult.filter((n) => n.job_seeker_id == d.job_seeker_id)[0];
      return d;
    }))


    if(pagination.sortBy == "invited_before"){
      finalData.sort((a,b)=> {
        return new Date(b.invite_date) - new Date(a.invite_date)
      })
    } else if(pagination.sortBy == "applied_before"){
      finalData.sort((a,b)=> {
        return new Date(b.apply_date) - new Date(a.apply_date)
      })
    }

    if(pagination.sortBy == "invited_before" || pagination.sortBy == "applied_before"){
      const skipped = ((pagination?.page - 1) * pagination?.per_page || 0);      
      finalData = finalData.slice(skipped, skipped + (pagination?.per_page || 100)+1)
    }

    return { data: finalData, totalDocuments: totalDocuments[0].count, status: true, message: "Data Fetched." }
  } catch (err) {
    console.log(">>>>>>Errr", err)
    return { data: [], status: false, message: new Error(err).message }
  }

}

exports.getJobTypeWithNumber = async () => {
  return new Promise((resolve, reject) => {
    DB.raw(`
    SELECT 
      jt.id,
      jt.name,
      COALESCE(COUNT(jscp.id), 0) as total_count
    FROM 
      job_types jt
    LEFT JOIN 
    job_seeker_career_preference jscp
    ON 
      FIND_IN_SET(jt.id, REPLACE(REPLACE(REPLACE(jscp.job_type, '[', ''), ']', ''), ' ', '')) > 0
    AND 
    jscp.job_seeker_id IN (
        SELECT job_seeker_id 
        FROM job_seeker_cv 
        WHERE step_1 = 1 
          AND step_2 = 1 
          AND step_3 = 1 
          AND step_4 = 1
          AND make_profile_public = 1
    )
    GROUP BY 
      jt.id, jt.name
  `).then(function (record) {
      resolve({ status: true, data: record[0] });
    })
      .catch(function (error) {
        resolve({ status: false, data: error });
      });
  });
}

exports.getJobCategoryWithNumber = async () => {
  return new Promise((resolve, reject) => {
    DB.raw(`
    SELECT 
      jt.id,
      jt.name,
      COALESCE(COUNT(jscp.id), 0) as total_count
    FROM 
      job_categories jt
    LEFT JOIN 
    job_seeker_career_preference jscp
    ON 
      FIND_IN_SET(jt.id, REPLACE(REPLACE(REPLACE(jscp.job_category, '[', ''), ']', ''), ' ', '')) > 0
    AND 
    jscp.job_seeker_id IN (
        SELECT job_seeker_id 
        FROM job_seeker_cv 
        WHERE step_1 = 1 
          AND step_2 = 1 
          AND step_3 = 1 
          AND step_4 = 1
          AND make_profile_public = 1
    )
    GROUP BY 
      jt.id, jt.name`).then(function (record) {
      resolve({ status: true, data: record[0] });
    })
      .catch(function (error) {
        resolve({ status: false, data: error });
      });
  });
}

exports.getSalaryRangeForJobs = async () => {
  return new Promise((resolve, reject) => {
    DB('employer_job_posts')
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
        DB.raw('COUNT(*) AS count')
      )
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
        const salaryRanges = [
          '5 - 10,000',
          '10,000 - 15,000',
          '15,000 - 20,000',
          '20,000 - 25,000',
          '25,000 - 30,000',
          '30,000 - 40,000',
          '40,000 - 50,000',
          '50,000 or above',
        ];

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
        resolve({ status: true, data: err });
      });
  });
}

exports.getSalaryRangeForFiler = async (user_id = "") => {

  return new Promise((resolve, reject) => {
    DB('job_seeker_career_preference')
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
        DB.raw('COUNT(*) AS count')
      )
      .whereIn("job_seeker_id", DB.raw("SELECT job_seeker_id FROM job_seeker_cv WHERE step_1 = 1 AND step_2 = 1 AND step_3 = 1 AND step_4 = 1 AND make_profile_public = 1"))
      .whereNotNull('min_expected_salary')
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
        const salaryRanges = [
          '5 - 10,000',
          '10,000 - 15,000',
          '15,000 - 20,000',
          '20,000 - 25,000',
          '25,000 - 30,000',
          '30,000 - 40,000',
          '40,000 - 50,000',
          '50,000 or above',
        ];

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
        resolve({ status: true, data: err });
      });
  });
}
