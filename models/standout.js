// exports.createCourse = async (insertData)=>{
//     try{
//         await DB("standout_courses")
//         .insert(insertData)

//         return {status: true}
//     } catch(err){
//       console.log("err", err);
//         return {status: false}
//     }
// }

exports.checkIsCourseIsCompleted = async (args) => {
  try {

    let coursesQuery = await DB("standout_courses")
    .select("id")
    .where("package_id","=", args.package_id)

    const courses_ids = coursesQuery.map(course => course.id)    

    let totalCompletedLessonsQuery = await DB("standout_lesson_progress")
      .select(DB.raw(`COUNT(CASE
      WHEN standout_lesson_progress.is_completed = '1' THEN 1
      ELSE 0
  END) AS totalCompletedLessons`))
      .whereIn("course_id",courses_ids)
      .andWhere("user_id", "=", args.user_id);


    let totalLessonsQuery = await DB("standout_lessons")
        .whereIn("course_id", courses_ids)
      .select(DB.raw(`COUNT(standout_lessons.id)
  AS totalLessons`))

    if (totalLessonsQuery[0].totalLessons > totalCompletedLessonsQuery[0].totalCompletedLessons) {
      return { status: true, data: false }
    } else {
      return { status: true, data: true }
    }
  } catch (err) {
    console.log("error : ", err);
    
    return { status: false, data: false }
  }
}

exports.getAllGroupByCategories = async (user_id) => {
    try{
        const finalData = {};
        const query = DB("standout_course_categories")
        .select(
            "standout_course_categories.title as category_name","standout_courses.title as course_name","standout_courses.image as course_image","standout_courses.linkdin_link",
            DB.raw("SUM(standout_lessons.time) as totalCourseTime"),
            DB.raw("COUNT(standout_lessons.id) as totalLessons"),
            DB.raw("COUNT(standout_lesson_progress.id) as totalCompletedLessons")
        )
        .leftJoin("standout_courses", "standout_course_categories.id","=","standout_courses.category_id")
        .leftJoin("standout_lessons","standout_courses.id","=","standout_lessons.course_id")
        .leftJoin("standout_lesson_progress", function() {
            this.on("standout_lesson_progress.lesson_id", "=", "standout_lessons.id")
              .andOn("standout_lesson_progress.course_id", "=", "standout_lessons.course_id")
              .andOn("standout_lesson_progress.user_id", "=", user_id)
        })
        .orderBy("standout_course_categories.order_number","ASC")
        .groupBy("course_name");

        const data = await query;
        if(Array.isArray(data)){
            data.forEach(d => {
                if(!finalData[d.category_name]){
                    finalData[d.category_name] = [d];
                } else {
                    finalData[d.category_name].push(d);
                }
            })
        }
        return {status: true, list: finalData};
    } catch(err){
        console.log("err", err);
        return {status: false, list: []}
    }
}

// exports.getAllLessonsGroupByCategory = async (user_id, course_id) =>{
//   try{
//     const finalData = {};
//     const query = DB("standout_course_categories")
//     .select(
//         "standout_course_categories.title as category_name","standout_lessons.id as lesson_id","standout_lessons.name as lesson_name","standout_lessons.image as lesson_image",
//         "standout_lessons.time as lesson_time",
//         // DB.raw("COUNT(standout_lessons.id) as totalLessons"),
//         DB.raw("COUNT(standout_lesson_progress.id) as isLessonCompleted")
//     )
//     .leftJoin("standout_lessons", function (){
//       this.on("standout_course_categories.id","=","standout_lessons.category_id")
//       .andOn("standout_lessons.course_id", "=", DB.raw("?", [course_id]))
//     })
//     .leftJoin("standout_lesson_progress", function() {
//         this.on("standout_lesson_progress.lesson_id", "=", "standout_lessons.id")
//           .andOn("standout_lesson_progress.course_id", "=", "standout_lessons.course_id")
//           .andOn("standout_lesson_progress.user_id", "=", user_id)
//     })
//     .orderBy("standout_course_categories.order_number","ASC")
//     .groupBy("lesson_name");

//     const data = await query;
//     if(Array.isArray(data)){
//         data.forEach(d => {
//           if(d.lesson_id){
//             if(!finalData[d.category_name]){
//                 finalData[d.category_name] = [d];
//             } else {
//                 finalData[d.category_name].push(d);
//             }
//           }
//         })
//     }
//     return {status: true, list: finalData};
// } catch(err){
//     console.log("err", err);
//     return {status: false, list: []}
// }
// }

exports.getAllCoursesFront = async (args) => {
  return new Promise((resolve, reject) => {
    let totalRecords;

    //for count
    let countQuery = DB("standout_courses");    

    countQuery.where(args.match);
    countQuery.count("id as count");
    if (args.title && args.title != "") {
      countQuery.whereILike("title", "%" + args.title + "%");
    }

    if(args.category_id && args.category_id != ""){
      countQuery.andWhere("category_id", category_id);
    }

    countQuery
      .then(function (record) {
        totalRecords = record[0].count;

        //for data
        let dataQuery = DB("standout_courses_packages");
        dataQuery.where(args.match);
        if (args.title && args.title != "") {
          dataQuery.whereILike("standout_courses_packages.title", "%" + args.title + "%");
        }

        dataQuery
          .select("standout_courses_packages.*",
            DB.raw("COUNT(standout_courses.id) as totalCourses"),
            DB.raw("SUM(COALESCE(standout_lessons.total_seconds, 0)) as totalPackageTime"),
            DB.raw("COUNT(DISTINCT(standout_lessons.id)) as totalLessons"),
            DB.raw("COUNT(CASE WHEN standout_lesson_progress.is_completed = 1 THEN 1 END) as totalCompletedLessons")
          )
          .leftJoin("standout_courses","standout_courses_packages.id","=","standout_courses.package_id")
          .leftJoin("standout_lessons", "standout_courses.id", "=", "standout_lessons.course_id")
          .leftJoin("standout_lesson_progress", function() {
            this.on("standout_lesson_progress.course_id", "=", "standout_courses.id")
              .andOn("standout_lesson_progress.user_id", "=", args.user_id)
          })
          .orderBy(args?.sort_by || "created_at", args?.order || "desc")
          .groupBy("standout_courses_packages.title")
          .limit(args?.per_page || 100)
          .offset((args?.page - 1) * args?.per_page || 0)
          .then(function (record) {
            console.log("record : ", record);
            resolve({
              status: true,
              data: record,
              totalDocuments: totalRecords,
            });
          })
          .catch(function (error) {
            console.log("error",error);
            resolve({ status: false, data: error });
          });
      })
      .catch(function (error) {
        console.log(error);
        resolve({ status: false, data: error });
      });
  });
}

// exports.updateCourse = async (query,data) => {
//   return new Promise((resolve, reject) => {
//     DB("standout_courses")
//       .where({ ...query })
//       .update(data)
//       .then(function (record) {
//         resolve({ status: true, data: record });
//       })
//       .catch(function (error) {
//         console.log("error : ", error);
//         resolve({ status: false, data: error });
//       });
//   });
// }

// exports.getOneCourseDetails = async (query) => {
//   return new Promise((resolve, reject) => {
//     DB("standout_courses")
//       .where(query)
//       .first()
//       .then(function (record) {
//         resolve(record);
//       })
//       .catch(function (error) {
//         console.log(error);
//         resolve(null);
//       });
//   });
// }

// exports.getOneCourse = async (query = {}, notQuery = {}) => {
//   return new Promise((resolve, reject) => {
//     DB("standout_courses")
//       .select("standout_courses.*", "standout_course_categories.id as category_id", "standout_course_categories.title as category_name")
//       .leftJoin("standout_course_categories", "standout_courses.category_id","=","standout_course_categories.id")
//       .groupBy("standout_courses.id")
//       .where(query)
//       .whereNot(notQuery)
//       .first()
//       .then(function (record) {
//         resolve(record);
//       })
//       .catch(function (error) {
//         console.log("error : ", error);
//         console.log(error);
//         resolve(null);
//       });
//   });
// }


// exports.getAllCourses = async (args) => {
//   return new Promise((resolve, reject) => {
//     let totalRecords;

//     //for count
//     let countQuery = DB("standout_courses");    

//     countQuery.where(args.match);
//     countQuery.count("id as count");
//     if (args.title && args.title != "") {
//       countQuery.whereILike("title", "%" + args.title + "%");
//     }

//     if(args.category_id && args.category_id != ""){
//       countQuery.andWhere("category_id", category_id);
//     }

//     countQuery
//       .then(function (record) {
//         totalRecords = record[0].count;

//         //for data
//         let dataQuery = DB("standout_courses");
//         dataQuery.where(args.match);
//         if (args.title && args.title != "") {
//           dataQuery.whereILike("standout_courses.title", "%" + args.title + "%");
//         }

//         dataQuery
//           .select("standout_courses.*","standout_course_categories.title as category_name")
//           .leftJoin("standout_course_categories", "standout_courses.category_id","=","standout_course_categories.id")
//           .orderBy(args?.sort_by || "created_at", args?.order || "desc")
//           .limit(args?.per_page || 100)
//           .offset((args?.page - 1) * args?.per_page || 0)
//           .then(function (record) {
//             resolve({
//               status: true,
//               data: record,
//               totalDocuments: totalRecords,
//             });
//           })
//           .catch(function (error) {
//             console.log(error);
//             resolve({ status: false, data: error });
//           });
//       })
//       .catch(function (error) {
//         console.log(error);
//         resolve({ status: false, data: error });
//       });
//   });
// }



// /*    LESSONS CONTROLLER     */
// exports.addLesson = async (insertData) => {
//   try{
//     await DB("standout_lessons")
//     .insert(insertData)
//     return {status: true}
//   } catch(err){
//     console.log("err", err);
//       return {status: false}
//   }
// }

exports.getAllLessons = async (args) =>{
  return new Promise((resolve, reject) => {
    let totalRecords;

    //for count
    let countQuery = DB("standout_lessons");    

    countQuery.where(args.match);
    countQuery.count("id as count");
    if (args.title && args.title != "") {
      countQuery.whereILike("title", "%" + args.title + "%");
    }

    if(args.course_id && args.course_id != ""){
      countQuery.andWhere("standout_lessons.course_id", args.course_id);
    }

    countQuery
      .then(function (record) {
        totalRecords = record[0].count;

        //for data
        let dataQuery = DB("standout_lessons");
        dataQuery.where(args.match);
        if (args.title && args.title != "") {
          dataQuery.whereILike("standout_lessons.title", "%" + args.title + "%");
        }

        dataQuery
          .select("standout_lessons.*")
          .orderBy(args?.sort_by || "created_at", args?.order || "desc")
          .limit(args?.per_page || 100)
          .offset((args?.page - 1) * args?.per_page || 0)

        if(args.course_id && args.course_id != ""){
          dataQuery.andWhere("course_id", args.course_id);
        }

        dataQuery
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
}

// exports.updateLesson = async (query,data) => {
//   return new Promise((resolve, reject) => {
//     DB("standout_lessons")
//       .where({ ...query })
//       .update(data)
//       .then(function (record) {
//         resolve({ status: true, data: record });
//       })
//       .catch(function (error) {
//         console.log("error : ", error);
//         resolve({ status: false, data: error });
//       });
//   });
// }

// exports.deleteLesson = async (args) => {
//   return new Promise((resolve, reject) => {
//     let query = DB("standout_lessons");
//     query
//       .where(args)
//       .del()
//       .then(function (record) {
//         resolve({ status: true });
//       })
//       .catch(function (error) {
//         resolve({ status: false });
//       });
//   });
// }

exports.getOneLessonAdmin = async (query = {}, notQuery = {}) => {
  return new Promise((resolve, reject) => {
    DB("standout_lessons")
      .where(query)
      .whereNot(notQuery)
      .first()
      .then(function (record) {
        resolve(record);
      })
      .catch(function (error) {
        console.log("error : ", error);
        console.log(error);
        resolve(null);
      });
  });
}


// exports.getJustNextLesson = async (lesson, query, queryTwo = {}) => {
//   return new Promise((resolve, reject) => {
//     DB("standout_lessons")
//       .where(query)
//       .andWhere('standout_lessons.created_at', '>', lesson.created_at)
//       .first()
//       .then(function (record) {
//         resolve(record);
//       })
//       .catch(function (error) {
//         console.log(error);
//         resolve(null);
//       });
//   });
// };

// exports.getOneLessonDetails = async (query, queryTwo = {}) => {
//   return new Promise((resolve, reject) => {
//     DB("standout_lessons")
//       .where(query)
//       .first()
//       .then(function (record) {
//         if (record) {
//           DB(""standout_lesson_progress"")
//             .select(
//               "seconds_watched",
//               "total_seconds",
//               "is_completed",
//               "lesson_id",
//               "id as progress_id"
//             )
//             .where("lesson_id", record.id)
//             .where(queryTwo)
//             .first()
//             .then((progressData) => {
//               resolve({
//                 ...record,
//                 ...(progressData ? progressData : {}),
//               });
//             })
//             .catch((err) => {
//               console.log(err);
//               resolve(null);
//             });
//         } else {
//           resolve(null);
//         }
//       })
//       .catch(function (error) {
//         console.log(error);
//         resolve(null);
//       });
//   });
// };


// /*      STAND OUT CATEGORY TABLE     */
// exports.createCategory = async (data) => {
//   return new Promise((resolve, reject) => {
//     DB("standout_course_categories")
//       .insert(data)
      
//       .then(function (record) {
//         resolve({ status: true, data: record });
//       })
//       .catch(function (error) {
//         console.log("err", error);
//         resolve({ status: false, data: error });
//       });
//   });
// };

// exports.updateCategory = async (query, data) => {
//   return new Promise((resolve, reject) => {
//     DB("standout_course_categories")
//       .where({ ...query })
//       .update(data)
//       .then(function (record) {
//         resolve({ status: true, data: record });
//       })
//       .catch(function (error) {
//         resolve({ status: false, data: error });
//       });
//   });
// };

// exports.getOneCategory = async (query = {}, notQuery = {}) => {
//   return new Promise((resolve, reject) => {
//     DB("standout_course_categories")
//       .where(query)
//       .whereNot(notQuery)
//       .first()
//       .then(function (record) {
//         resolve(record);
//       })
//       .catch(function (error) {
//         console.log(error);
//         resolve(null);
//       });
//   });
// };

// exports.getAllCategories = async (query = {}, notQuery = {}, user_id = "") => {
//   return new Promise((resolve, reject) => {
//     DB("standout_course_categories")
//     .select("job_categories.id", "job_categories.title")
//       .where(query)
//       .whereNot(notQuery)
//       .leftJoin("employer_job_posts as ejp", function (){
//         this.on("job_categories.id", "ejp.job_category")
//         .andOn('ejp.is_posted', '=', 1)
//         .andOn('ejp.is_delete', '=', 0)
//         .andOn('ejp.is_active', '=', 1);
//       })
//       .leftJoin("job_seeker_applied_jobs", function () {
//         this.on("job_seeker_applied_jobs.job_id", "=", "ejp.id")
//           .andOn("job_seeker_applied_jobs.job_seeker_id", "=", user_id);
//       })
      
//       // .count('ejp.id as count')
//       .select(DB.raw('COUNT(ejp.id) - COUNT(job_seeker_applied_jobs.id) as count'))
//       // .count('ejp.id as count')
//       .groupBy('job_categories.id', 'job_categories.title')
//       .then(function (record) {
//         resolve(record);
//       })
//       .catch(function (error) {
//         console.log(error);
//         resolve([]);
//       });
//   });
// };

exports.deleteCategory = async (args) => {
  return new Promise((resolve, reject) => {
    let query = DB("standout_course_categories");
    query
      .where(args)
      .del()
      .then(function (record) {
        resolve({ status: true });
      })
      .catch(function (error) {
        resolve({ status: false });
      });
  });
};

exports.getManyCategories = async (args) => {
  return new Promise((resolve, reject) => {
    let totalRecords;

    //for count
    let countQuery = DB("standout_course_categories");
    countQuery.where(args.match);
    countQuery.count("id as count");
    if (args.title && args.title != "") {
      countQuery.whereILike("title", "%" + args.title + "%");
    }
    if(args.package_id){
      countQuery.andWhere("package_id", "=", args.package_id)
    }

    countQuery
      .then(function (record) {
        totalRecords = record[0].count;

        //for data
        let dataQuery = DB("standout_course_categories");
        dataQuery.where(args.match);
        if (args.title && args.title != "") {
          dataQuery.whereILike("title", "%" + args.title + "%");
        }

        if(args.package_id){
          dataQuery.andWhere("package_id", "=", args.package_id)
        }

        dataQuery
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

/*    COURSES CATEGORY MODELS     */
exports.createCategory = async (data) => {
  return new Promise((resolve, reject) => {
    DB("standout_course_categories")
      .insert(data)
      
      .then(function (record) {
        resolve({ status: true, data: record });
      })
      .catch(function (error) {
        console.log("err", error);
        resolve({ status: false, data: error });
      });
  });
};

exports.updateCategory = async (query, data) => {
  return new Promise((resolve, reject) => {
    DB("standout_course_categories")
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

exports.getCategoryCourses = async (packageId,userId) => {
  return new Promise((resolve, reject) => {
    DB("standout_course_categories")
      .select(
        "standout_course_categories.id",
        "standout_course_categories.title",
        "standout_course_categories.sequence_mandatory",
        "standout_course_categories.order_number as category_order_number",
        "standout_courses.id as course_id",
        "standout_courses.title as course_title",
        "standout_courses.image as course_image",
        "standout_courses.order_number as course_order_number",
        "standout_courses.skip_lessons as course_skip_lessons",
        "standout_courses.time as course_time",
        "standout_courses.linkdin_link as linkdin_link",
        "standout_lessons.id as lesson_id",
        "standout_lessons.total_seconds as lesson_total_seconds",
        "standout_lesson_progress.id as lesson_progress_id",
        "standout_lesson_progress.seconds_watched as lesson_progress_seconds_watched",
        "standout_lesson_progress.total_seconds as lesson_progress_total_seconds",
        "standout_lesson_progress.is_completed as lesson_progress_is_completed",
        // DB.raw("SUM(standout_lessons.total_seconds) as total_course_time_in_seconds"),
      )
      .leftJoin("standout_courses", function (){
        this.on("standout_courses.category_id", "=", "standout_course_categories.id")
        .andOn("standout_courses.package_id", "=", DB.raw('?', [packageId ?? 0]))
      })
      .leftJoin("standout_lessons", "standout_lessons.course_id", "=", "standout_courses.id")
      .leftJoin("standout_lesson_progress", function () {
        this.on("standout_lesson_progress.lesson_id", "=", "standout_lessons.id").on(
          "standout_lesson_progress.user_id",
          "=",
          userId
        );
      })
      .where("standout_course_categories.package_id","=", packageId)
      .orderBy("standout_course_categories.order_number", "asc")
      .orderBy("course_order_number", "asc")
      .then((record) => {
        const categoryObj = {}; //id: title, sequence

        const courseObj = {}; //categoryId: [courseData]
        const lessonsObj = {}; //courseId: [lesson_ids]

        const addedCourseId = [];

        record.forEach((r) => {
          categoryObj[r.id] = {
            title: r.title,
            sequence_mandatory: r.sequence_mandatory,
            category_order_number: r.category_order_number
          };

          if (!addedCourseId.includes(r.course_id)) {
            if (courseObj[r.id]) {
              addedCourseId.push(r.course_id);
              courseObj[r.id] = [
                ...courseObj[r.id],
                {
                  id: r.course_id,
                  title: r.course_title,
                  image: r.course_image,
                  skip_lessons: r.course_skip_lessons,
                  time: r.course_time,
                  linkdin_link: r.linkdin_link
                },
              ];
            } else {
              addedCourseId.push(r.course_id);
              courseObj[r.id] = [
                {
                  id: r.course_id,
                  title: r.course_title,
                  image: r.course_image,
                  skip_lessons: r.course_skip_lessons,
                  time: r.course_time,
                  linkdin_link: r.linkdin_link
                },
              ];
            }
          }

          let progress = {};

          if (r.lesson_progress_id) {
            if (r.lesson_total_seconds == null) {
              progress = {
                is_completed: r.lesson_progress_is_completed,
              };
            } else {
              progress = {
                seconds_watched: r.lesson_progress_seconds_watched,
                total_seconds: r.lesson_progress_total_seconds,
                is_completed: r.lesson_progress_is_completed,
              };
            }
          }

          if (lessonsObj[r.course_id]) {
            lessonsObj[r.course_id] = [
              ...lessonsObj[r.course_id],
              {
                id: r.lesson_id,
                total_seconds: r.lesson_total_seconds,
                progress,
              },
            ];
          } else {
            lessonsObj[r.course_id] = [
              {
                id: r.lesson_id,
                total_seconds: r.lesson_total_seconds,
                progress,
              },
            ];
          }
        });

        const recordUpdated = [];

        for (let key in categoryObj) {
          recordUpdated.push({
            id: key,
            ...categoryObj[key],
            standout_courses: courseObj[key].map((course) => ({
              ...course,
              standout_lessons: lessonsObj[course.id],
            })),
          });
        }

        recordUpdated.sort((a,b) => {
          return a.category_order_number - b.category_order_number
        })

        resolve({
          status: true,
          data: recordUpdated,
        });
      })
      .catch(function (error) {
        console.log("error : ", error);
        resolve({ status: false, data: [], error });
      });
  });
};

exports.getOneCategory = async (query) => {
  return new Promise((resolve, reject) => {
    DB("standout_course_categories")
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

/*    COURSES CATEGORY MODELS     */
exports.createStandoutPackage = async (data) => {
  return new Promise((resolve, reject) => {
    DB("standout_courses_packages")
      .insert(data)
      .then(function (record) {
        resolve({ status: true, data: record });
      })
      .catch(function (error) {
        console.log("err", error);
        resolve({ status: false, data: error });
      });
  });
};

exports.updateStandoutPackage = async (query, data) => {
  return new Promise((resolve, reject) => {
    DB("standout_courses_packages")
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

exports.getOneStandoutPackage = async (query) => {
  return new Promise((resolve, reject) => {
    DB("standout_courses_packages")
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

exports.deleteStandoutPackage = async (args) => {
  return new Promise((resolve, reject) => {
    let query = DB("standout_courses_packages");
    query
      .where(args)
      .del()
      .then(function (record) {
        DB("standout_courses_packages")
        .where("package_id", "=", args.id)
        .del()
        .then(()=> {
          resolve({status: true})
        }).catch(function (err){
          resolve({ status: false });
        })
      })
      .catch(function (error) {
        resolve({ status: false });
      });
  });
};

exports.getAllCoursePackages = async (args) => {
  return new Promise((resolve, reject) => {
    let totalRecords;

    //for count
    let countQuery = DB("standout_courses_packages");
    countQuery.where(args.match);
    countQuery.count("id as count");
    if (args.title && args.title != "") {
      countQuery.whereILike("title", "%" + args.title + "%");
    }
    countQuery
      .then(function (record) {
        totalRecords = record[0].count;

        //for data
        let dataQuery = DB("standout_courses_packages");
        dataQuery.where(args.match);
        if (args.title && args.title != "") {
          dataQuery.whereILike("title", "%" + args.title + "%");
        }

        dataQuery
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

/*    COURSES MODELS     */
exports.createCourse = async (data) => {
  return new Promise((resolve, reject) => {
    DB("standout_courses")
      .insert(data)
      
      .then(function (record) {
        resolve({ status: true, data: record });
      })
      .catch(function (error) {
        console.log("err", error);
        resolve({ status: false, data: error });
      });
  });
};

exports.updateCourse = async (query, data) => {
  return new Promise((resolve, reject) => {
    DB("standout_courses")
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

exports.getOneCourse = async (query) => {
  return new Promise((resolve, reject) => {
    DB("standout_courses")
    .select("standout_courses.*", "standout_course_categories.title as category_name", "standout_course_categories.id as category_id")
      .where(query)
      .leftJoin("standout_course_categories", "standout_courses.category_id", "=", "standout_course_categories.id")
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

exports.getOneCoursePackage = async (query) => {
  return new Promise((resolve, reject) => {
    DB("standout_courses_packages")
    .select("standout_courses_packages.*")
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

exports.deleteCourse = async (match) => {
  return new Promise((resolve, reject) => {
    let query = DB("standout_courses");
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

exports.getAllCourses = async (args) => {
  return new Promise((resolve, reject) => {
    let dataQuery = DB("standout_courses");

    dataQuery
      .where(args.query ?? {})
      .orderBy(args?.sort_by || "created_at", args?.order || "desc")
      .limit(args?.per_page || 100)
      .offset((args?.page - 1) * args?.per_page || 0)
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

exports.getManyClient = async () => {
  return new Promise((resolve) => {
    // const coalesce = DB.raw(`coalesce(standout_lessons.items, '[]') as items`);
    // const sub = DB("standout_lessons")
    //   .select(DB.raw("json_agg(standout_lessons.*) as items"))
    //   .whereRaw("standout_courses.id = standout_lessons.course_id");

    // DB("standout_courses")
    //   .select(["standout_courses.*", coalesce])
    //   .joinRaw("left join lateral ? standout_lessons on true", sub)
    //   .orderBy("standout_courses.order_number", "asc")
    //   .then(function (record) {
    //     resolve({
    //       status: true,
    //       data: record,
    //     });
    //   })
    //   .catch(function (error) {
    //     resolve({ status: false, data: error });
    //   });

    DB("standout_courses")
      .select(
        "standout_courses.id",
        "standout_courses.title",
        "standout_courses.time",
        "standout_courses.image",
        // "standout_courses.background_image",
        "standout_courses.order_number",
        "standout_courses.skip_lessons",
        "standout_lessons.id as lesson_id"
        // "standout_lessons.id"
        // DB.raw("GROUP_CONCAT(standout_lessons.id) as idss")
        // DB.raw("ARRAY_AGG(standout_lessons.id) as lesson_id")
      )
      .leftJoin("standout_lessons", "standout_lessons.course_id", "=", "standout_courses.id")
      //   .groupBy("standout_courses.id", "standout_courses.title", "lesson_id")
      //   .groupBy("standout_courses.id")
      .orderBy("standout_courses.order_number", "asc")
      .then(function (record) {
        const resultMap = record.reduce((result, row) => {
          const lesson_id = row.lesson_id;
          delete row.lesson_id;

          result[row.id] = result[row.id] || {
            ...row,
            standout_lessons: [],
          };

          result[row.id].standout_lessons.push(lesson_id);

          return result;
        }, {});

        resolve({
          status: true,
          data: Object.values(resultMap),
        });
      })
      .catch(function (error) {
        resolve({ status: false, data: error });
      });
  });
};

/*    LESSON MODALS      */
exports.createLesson = async (data) => {
  return new Promise((resolve, reject) => {
    DB("standout_lessons")
      .insert(data)
      
      .then(function (record) {
        resolve({ status: true, data: record });
      })
      .catch(function (error) {
        console.log("err", error);
        resolve({ status: false, data: error });
      });
  });
};

exports.updateLesson = async (query, data) => {
  return new Promise((resolve, reject) => {
    DB("standout_lessons")
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

exports.getOneLesson = async (query, queryTwo = {}) => {
  // get lesson with progress
  return new Promise((resolve, reject) => {
    DB("standout_lessons")
      .where(query)
      .first()
      .then(function (record) {
        if (record) {
          DB("standout_lesson_progress")
            .select(
              "seconds_watched",
              "total_seconds",
              "is_completed",
              "lesson_id",
              "id as progress_id"
            )
            .where("lesson_id", record.id)
            .where(queryTwo)
            .first()
            .then((progressData) => {
              resolve({
                ...record,
                ...(progressData ? progressData : {}),
              });
            })
            .catch((err) => {
              console.log(err);
              resolve(null);
            });
        } else {
          resolve(null);
        }
      })
      .catch(function (error) {
        console.log(error);
        resolve(null);
      });
  });
};

exports.deleteLesson = async (match) => {
  return new Promise((resolve, reject) => {
    let query = DB("standout_lessons");
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

exports.lessonGetMany = async (args) => {
  return new Promise((resolve, reject) => {
    let dataQuery = DB("standout_lessons");

    dataQuery
      .where(args.match || {})
      .orderBy(args?.sort_by || "created_at", args?.order || "desc")
      .limit(args?.per_page || 100)
      .offset((args?.page - 1) * args?.per_page || 0)
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

exports.lessonGetManyClient = async (args) => {
  return new Promise((resolve, reject) => {
    let dataQuery = DB("standout_lessons");

    dataQuery
      .where(args.match || {})
      //   .orWhere(args.matchTwo || {})
      //   .select(
      //     "standout_lessons.id",
      //     "standout_lessons.title",
      //     "standout_lessons.image",
      //     "standout_lessons.short_description",
      //     "standout_lessons.total_seconds",
      //     "standout_lesson_progress.seconds_watched",
      //     "standout_lesson_progress.is_completed"
      //   )
      //   .leftJoin(
      //     "standout_lesson_progress",
      //     "standout_lesson_progress.lesson_id",
      //     "=",
      //     "standout_lessons.id"
      //   )
      .orderBy(args?.sort_by || "created_at", args?.order || "desc")
      //   .limit(args?.per_page || 100)
      //   .offset((args?.page - 1) * args?.per_page || 0)
      .then(function (record) {
        DB("standout_lesson_progress")
          .select(
            "seconds_watched",
            "total_seconds",
            "is_completed",
            "lesson_id"
          )
          .whereIn(
            "lesson_id",
            record.map((r) => r.id)
          )
          .where(args.matchTwo)
          .then((progressData) => {
            record = record.map((r) => {
              const pData =
                progressData.find((pd) => pd.lesson_id === r.id) || {};

              return {
                ...r,
                ...pData,
              };
            });

            resolve({
              status: true,
              data: record,
            });
          })
          .catch((err) => {
            console.log(err);
            resolve({ status: false, data: err });
          });
      })
      .catch(function (error) {
        console.log(error);
        resolve({ status: false, data: error });
      });
  });
};

exports.lessonGetOneTwo = async (match, dynamicQuery=[]) => {
  // only get lesson
  
  try{
    const query = DB("standout_lessons")
    .where(match)
    .first()

    console.log("dynamicQuery",dynamicQuery);
    

    if(Array.isArray(dynamicQuery) && dynamicQuery.length > 0){
      dynamicQuery.forEach(d => {
        if(d.key && d.operator && d.value){
          query.andWhere(d.key, d.operator, d.value)
        }
      })
    }

    console.log("query : ", query.toString());
    

    const data = await query;
    return data;
  } catch(err){
    console.log("err", err);
    
    return null;
  }

  // return new Promise((resolve, reject) => {
  //   DB("standout_lessons")
  //     .where(query)
  //     .first()
  //     .then(function (record) {
  //       resolve(record);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //       resolve(null);
  //     });
  // });
};

exports.lessonGetOneThree = async (query) => {
  // lesson with course
  return new Promise((resolve, reject) => {
    DB("standout_lessons")
      .where(query)
      .first()
      .select(
        "standout_lessons.id as lesson_id",
        "standout_courses.id as course_id",
        "standout_courses.category_id as course_category_id"
      )
      .leftJoin("standout_courses", "standout_courses.id", "=", "standout_lessons.course_id")
      .then(function (record) {
        resolve(record);
      })
      .catch(function (error) {
        console.log(error);
        resolve(null);
      });
  });
};

exports.lessonCheckThirdCategoryIsCompleted = async (userId = 2) => {
  return new Promise(async (resolve, reject) => {
    const { data: standout_courses } = await this.lessonGetMany({
      query: { category_id: 3 },
      page: 0,
    });
    const courseIds = standout_courses.map((c) => c.id);

    let dataQuery = DB("standout_lessons");

    dataQuery
      .whereIn("course_id", courseIds)
      .then(function (record) {
        DB("standout_lesson_progress")
          .select(
            "seconds_watched",
            "total_seconds",
            "is_completed",
            "lesson_id"
          )
          .whereIn(
            "lesson_id",
            record.map((r) => r.id)
          )
          .where({ user_id: userId })
          .then((progressData) => {
            record = record.map((r) => {
              const pData =
                progressData.find((pd) => pd.lesson_id === r.id) || {};

              return {
                ...r,
                ...pData,
              };
            });

            record = record.map((r) => r.is_completed);
            record = record.every((r) => r == 1);
            resolve(record);
          })
          .catch((err) => {
            console.log(err);
            resolve(false);
          });
      })
      .catch(function (error) {
        console.log(error);
        resolve(false);
      });
  });
};

exports.lessonRaw = async (raw, values = []) => {
  return new Promise((resolve, reject) => {
    DB.raw(raw, values)
      .then(function (record) {
        resolve({ status: true, data: record[0] });
      })
      .catch(function (error) {
        console.log("err", error);
        resolve({ status: false, data: error });
      });
  });
};


/*    LESSON PROGRESS MODALS     */
exports.createLessonProgress = async (data) => {
  return new Promise((resolve, reject) => {
    DB("standout_lesson_progress")
      .insert(data)
      
      .then(function (record) {
        resolve({ status: true, data: record });
      })
      .catch(function (error) {
        console.log("err", error);
        resolve({ status: false, data: error });
      });
  });
};

exports.lessonProgressGetBasedOnLesson = async (ids, userId) => {
  return new Promise((resolve, reject) => {
    DB("standout_lesson_progress")
      .select("seconds_watched", "total_seconds", "is_completed", "lesson_id")
      .whereIn("lesson_id", ids)
      .where("user_id", userId)
      .then(function (record) {
        resolve(record);
      })
      .catch(function (error) {
        console.log("err", error);
        resolve(null);
      });
  });
};

exports.updateLessonProgress = async (query, data) => {
  return new Promise((resolve, reject) => {
    DB("standout_lesson_progress")
      .where({ ...query })
      .update(data)
      .then(function (record) {
        resolve({ status: true, data: record });
      })
      .catch(function (error) {
        console.log("err : ", err);
        resolve({ status: false, data: error });
      });
  });
};

exports.getOneLessonProgress = async (query, notQuery = {}) => {
  return new Promise((resolve, reject) => {
    DB("standout_lesson_progress")
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





// GET NEXT MODALS 
exports.getNextLesson = async (course_id, current_lesson_order_number) => {
  return new Promise((resolve, reject) => {
    DB("standout_lessons")
      .where("standout_lessons.course_id","=",course_id)
      .andWhere("standout_lessons.order_number",">",current_lesson_order_number)
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
}
exports.getNextCourse = async (match={}, dynamicQuery=[]) => {

  try{
    const query = DB("standout_courses")
    .select("standout_courses.*", "standout_course_categories.title as category_name", "interview_course_categories.id as category_id")
      .where(match)
      .leftJoin("interview_course_categories", "standout_courses.category_id", "=", "interview_course_categories.id")
      .first()

    dynamicQuery.map(d => {
      if(d.operator && d.key && d.value){
        query.andWhere(d.key, d.operator, d.value)
      }
    })

    const data = await query;
    return data;
  } catch(err){
    console.log("err",err);
    return null
  }
}

// exports.getNextCategory = async (course_package_id, current_category_order_number) => {

// }

// getAllCoursePackages
// getOneStandoutPackage
// deleteStandoutPackage
// createStandoutPackage
// updateStandoutPackage