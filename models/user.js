const CourseCategory = require("../models/courseCategory");
const table = "users";

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
        resolve({
          ...record,
          isActive: record?.is_active ? true : false,
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

    if (args.role) {
      countQuery.where("users.user_role_id", args.role);
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

        if (args.role) {
          dataQuery.where("users.user_role_id", args.role);
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
        "job_hunter_details.step4 as step4"
      )
      .leftJoin(
        "job_hunter_details",
        "job_hunter_details.job_hunter_id",
        "=",
        "users.id"
      );

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

exports.getCourseProgress = async (course_type,userId = 0) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userData = await this.getOne({ id: userId });

      const currentProgress = {};
      if ("current_category_id" in userData) {
        try {
          const category = await CourseCategory.getOne(course_type,{
            id: userData.current_category_id,
          });

          currentProgress.current_sequence_mandatory =
            category?.sequence_mandatory ?? 0;
        } catch (err) {
          const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Something went wrong",
            500
          );
          return next(error);
        }

        currentProgress.current_category_id = userData.current_category_id;
        currentProgress.current_course_id = userData.current_course_id;
        currentProgress.current_lesson_id = userData.current_lesson_id;
      }
      resolve(currentProgress);
    } catch (err) {
      resolve({});
    }
  });
};

exports.getEmployerData = async (userId) => {
  return new Promise((resolve, reject) => {
    //for count
    let countQuery = DB("company_profile");
    countQuery.where("company_profile.employer_id", userId)
    countQuery
      .select(
        "company_profile.id as id",
        "company_profile.employer_id",
        "company_profile.logo",
        "company_profile.cover_image",
        "company_profile.company_name",
        "company_profile.website",
        "company_profile.employee",
        "company_profile.area",
        "company_profile.other_area",
        "company_profile.industry",
        "company_profile.other_industry",
        "company_profile.founded",
        "company_profile.description",
        "company_profile.phone",
        "company_profile.email",
        "company_profile.twitter",
        "company_profile.facebook",
        "company_profile.linkedin",
        "company_profile.created_at",
        "countries.name as country",
        "cities.name as city",
        "areas.name as area_name",
        "job_industries.name as industry_value",
        "job_industries.id as industry",
        "employee_numbers.name as employee_value",
        "employee_numbers.id as employee"
      )
      .leftJoin(
        "countries",
        "countries.id",
        "=",
        "company_profile.country"
      )
      .leftJoin(
        "cities",
        "cities.id",
        "=",
        "company_profile.city"
      )
      .leftJoin(
        "areas",
        "areas.id",
        "=",
        "company_profile.area"
      )
      .leftJoin(
        "job_industries",
        "job_industries.id",
        "=",
        "company_profile.industry"
      )
      .leftJoin(
        "employee_numbers",
        "employee_numbers.id",
        "=",
        "company_profile.employee"
      )

    countQuery
      .then(function (record) {
        resolve(record);
      })
      .catch(function (error) {
        console.log(error);
        resolve([]);
      });
  });
}

exports.getUserCertificates = async (userId) => {
  return new Promise((resolve, reject) => {
    let dataQuery = DB("certificates")
    .where("user_id", "=", userId)
    .orderBy("created_at", "desc")

    dataQuery
      .then(function (record) {
        resolve(record);
      })
      .catch(function (error) {
        console.log(error);
        resolve([]);
      });
  });
}