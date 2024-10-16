// exports.createCourse = async (insertData)=>{
//     try{
//         await DB("courses")
//         .insert(insertData)

//         return {status: true}
//     } catch(err){
//       console.log("err", err);
//         return {status: false}
//     }
// }

// exports.getAllGroupByCategories = async (user_id) => {
//     try{
//         const finalData = {};
//         const query = DB("course_categories")
//         .select(
//             "course_categories.title as category_name","courses.title as course_name","courses.image as course_image","courses.linkdin_link",
//             DB.raw("SUM(lessons.time) as totalCourseTime"),
//             DB.raw("COUNT(lessons.id) as totalLessons"),
//             DB.raw("COUNT(lesson_progress.id) as totalCompletedLessons")
//         )
//         .leftJoin("courses", "course_categories.id","=","courses.category_id")
//         .leftJoin("lessons","courses.id","=","lessons.course_id")
//         .leftJoin("lesson_progress", function() {
//             this.on("lesson_progress.lesson_id", "=", "lessons.id")
//               .andOn("lesson_progress.course_id", "=", "lessons.course_id")
//               .andOn("lesson_progress.user_id", "=", user_id)
//         })
//         .orderBy("course_categories.order_number","ASC")
//         .groupBy("course_name");

//         const data = await query;
//         if(Array.isArray(data)){
//             data.forEach(d => {
//                 if(!finalData[d.category_name]){
//                     finalData[d.category_name] = [d];
//                 } else {
//                     finalData[d.category_name].push(d);
//                 }
//             })
//         }
//         return {status: true, list: finalData};
//     } catch(err){
//         console.log("err", err);
//         return {status: false, list: []}
//     }
// }

// exports.getAllLessonsGroupByCategory = async (user_id, course_id) =>{
//   try{
//     const finalData = {};
//     const query = DB("course_categories")
//     .select(
//         "course_categories.title as category_name","lessons.id as lesson_id","lessons.name as lesson_name","lessons.image as lesson_image",
//         "lessons.time as lesson_time",
//         // DB.raw("COUNT(lessons.id) as totalLessons"),
//         DB.raw("COUNT(lesson_progress.id) as isLessonCompleted")
//     )
//     .leftJoin("lessons", function (){
//       this.on("course_categories.id","=","lessons.category_id")
//       .andOn("lessons.course_id", "=", DB.raw("?", [course_id]))
//     })
//     .leftJoin("lesson_progress", function() {
//         this.on("lesson_progress.lesson_id", "=", "lessons.id")
//           .andOn("lesson_progress.course_id", "=", "lessons.course_id")
//           .andOn("lesson_progress.user_id", "=", user_id)
//     })
//     .orderBy("course_categories.order_number","ASC")
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

// exports.getAllCoursesFront = async (args) => {
//   return new Promise((resolve, reject) => {
//     let totalRecords;

//     //for count
//     let countQuery = DB("courses");    

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
//         let dataQuery = DB("courses");
//         dataQuery.where(args.match);
//         if (args.title && args.title != "") {
//           dataQuery.whereILike("courses.title", "%" + args.title + "%");
//         }

//         dataQuery
//           .select("courses.*","course_categories.title as category_name",
//             DB.raw("SUM(lessons.time) as totalCourseTime"),
//             DB.raw("COUNT(lessons.id) as totalLessons"),
//             DB.raw("COUNT(lesson_progress.id) as totalCompletedLessons")
//           )
//           .leftJoin("lessons","courses.id","=","lessons.course_id")
//           .leftJoin("lesson_progress", function() {
//             this.on("lesson_progress.lesson_id", "=", "lessons.id")
//               .andOn("lesson_progress.course_id", "=", "lessons.course_id")
//               .andOn("lesson_progress.user_id", "=", args.user_id)
//         })
//           .leftJoin("course_categories", "courses.category_id","=","course_categories.id")
//           .orderBy(args?.sort_by || "created_at", args?.order || "desc")
//           .groupBy("courses.title")
//           .limit(args?.per_page || 100)
//           .offset((args?.page - 1) * args?.per_page || 0)
//           .then(function (record) {
//             console.log("record : ", record);
//             resolve({
//               status: true,
//               data: record,
//               totalDocuments: totalRecords,
//             });
//           })
//           .catch(function (error) {
//             console.log("error",error);
//             resolve({ status: false, data: error });
//           });
//       })
//       .catch(function (error) {
//         console.log(error);
//         resolve({ status: false, data: error });
//       });
//   });
// }

// exports.updateCourse = async (query,data) => {
//   return new Promise((resolve, reject) => {
//     DB("courses")
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
//     DB("courses")
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
//     DB("courses")
//       .select("courses.*", "course_categories.id as category_id", "course_categories.title as category_name")
//       .leftJoin("course_categories", "courses.category_id","=","course_categories.id")
//       .groupBy("courses.id")
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
//     let countQuery = DB("courses");    

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
//         let dataQuery = DB("courses");
//         dataQuery.where(args.match);
//         if (args.title && args.title != "") {
//           dataQuery.whereILike("courses.title", "%" + args.title + "%");
//         }

//         dataQuery
//           .select("courses.*","course_categories.title as category_name")
//           .leftJoin("course_categories", "courses.category_id","=","course_categories.id")
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
//     await DB("lessons")
//     .insert(insertData)
//     return {status: true}
//   } catch(err){
//     console.log("err", err);
//       return {status: false}
//   }
// }


exports.checkIsCourseIsCompleted = async (args) => {
  try {
    let totalCompletedLessonsQuery = await DB("lesson_progress")
      .select(DB.raw(`COUNT(CASE
      WHEN lesson_progress.is_completed = '1' THEN 1
      ELSE 0
  END) AS totalCompletedLessons`))
      .where(args.query);

    let totalLessonsQuery = await DB("lessons")
      .select(DB.raw(`COUNT(id)
  AS totalLessons`))


    if (totalLessonsQuery[0].totalLessons > totalCompletedLessonsQuery[0].totalCompletedLessons) {
      return { status: true, data: false }
    } else {
      return { status: true, data: true }
    }
  } catch (err) {
    return { status: false, data: false }
  }
}

exports.getAllLessons = async (args) =>{
  return new Promise((resolve, reject) => {
    let totalRecords;

    //for count
    let countQuery = DB("lessons");    

    countQuery.where(args.match);
    countQuery.count("id as count");
    if (args.title && args.title != "") {
      countQuery.whereILike("title", "%" + args.title + "%");
    }

    if(args.course_id && args.course_id != ""){
      countQuery.andWhere("lessons.course_id", args.course_id);
    }

    countQuery
      .then(function (record) {
        totalRecords = record[0].count;

        //for data
        let dataQuery = DB("lessons");
        dataQuery.where(args.match);
        if (args.title && args.title != "") {
          dataQuery.whereILike("lessons.title", "%" + args.title + "%");
        }

        dataQuery
          .select("lessons.*")
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
//     DB("lessons")
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
//     let query = DB("lessons");
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

// exports.getOneLesson = async (query = {}, notQuery = {}) => {
//   return new Promise((resolve, reject) => {
//     DB("lessons")
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


// exports.getJustNextLesson = async (lesson, query, queryTwo = {}) => {
//   return new Promise((resolve, reject) => {
//     DB("lessons")
//       .where(query)
//       .andWhere('lessons.created_at', '>', lesson.created_at)
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
//     DB("lessons")
//       .where(query)
//       .first()
//       .then(function (record) {
//         if (record) {
//           DB(""lesson_progress"")
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
//     DB("course_categories")
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
//     DB("course_categories")
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
//     DB("course_categories")
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
//     DB("course_categories")
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
    let query = DB("course_categories");
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
    let countQuery = DB("course_categories");
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
        let dataQuery = DB("course_categories");
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
    DB("course_categories")
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
    DB("course_categories")
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

exports.getCategoryCourses = async (userId) => {
  return new Promise((resolve, reject) => {
    DB("course_categories")
      .select(
        "course_categories.id",
        "course_categories.title",
        "course_categories.sequence_mandatory",
        "courses.id as course_id",
        "courses.title as course_title",
        "courses.image as course_image",
        "courses.order_number as course_order_number",
        "courses.skip_lessons as course_skip_lessons",
        "courses.time as course_time",
        "courses.linkdin_link as linkdin_link",
        "lessons.id as lesson_id",
        "lessons.total_seconds as lesson_total_seconds",
        "lesson_progress.id as lesson_progress_id",
        "lesson_progress.seconds_watched as lesson_progress_seconds_watched",
        "lesson_progress.total_seconds as lesson_progress_total_seconds",
        "lesson_progress.is_completed as lesson_progress_is_completed",
        // DB.raw("SUM(lessons.total_seconds) as total_course_time_in_seconds"),
      )
      .leftJoin("courses", "courses.category_id", "=", "course_categories.id")
      .leftJoin("lessons", "lessons.course_id", "=", "courses.id")
      .leftJoin("lesson_progress", function () {
        this.on("lesson_progress.lesson_id", "=", "lessons.id").on(
          "lesson_progress.user_id",
          "=",
          userId
        );
      })
      .orderBy("course_categories.order_number", "asc")
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
            courses: courseObj[key].map((course) => ({
              ...course,
              lessons: lessonsObj[course.id],
            })),
          });
        }

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
    DB("course_categories")
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
    DB("courses_packages")
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
    DB("courses_packages")
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
    DB("courses_packages")
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
    let query = DB("courses_packages");
    query
      .where(args)
      .del()
      .then(function (record) {
        DB("courses_packages")
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
    let countQuery = DB("courses_packages");
    countQuery.where(args.match);
    countQuery.count("id as count");
    if (args.title && args.title != "") {
      countQuery.whereILike("title", "%" + args.title + "%");
    }
    countQuery
      .then(function (record) {
        totalRecords = record[0].count;

        //for data
        let dataQuery = DB("courses_packages");
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
    DB("courses")
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
    DB("courses")
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
    DB("courses")
    .select("courses.*", "course_categories.title as category_name", "course_categories.id as category_id")
      .where(query)
      .leftJoin("course_categories", "courses.category_id", "=", "course_categories.id")
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
    let query = DB("courses");
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
    let dataQuery = DB("courses");

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
    // const coalesce = DB.raw(`coalesce(lessons.items, '[]') as items`);
    // const sub = DB("lessons")
    //   .select(DB.raw("json_agg(lessons.*) as items"))
    //   .whereRaw("courses.id = lessons.course_id");

    // DB("courses")
    //   .select(["courses.*", coalesce])
    //   .joinRaw("left join lateral ? lessons on true", sub)
    //   .orderBy("courses.order_number", "asc")
    //   .then(function (record) {
    //     resolve({
    //       status: true,
    //       data: record,
    //     });
    //   })
    //   .catch(function (error) {
    //     resolve({ status: false, data: error });
    //   });

    DB("courses")
      .select(
        "courses.id",
        "courses.title",
        "courses.time",
        "courses.image",
        // "courses.background_image",
        "courses.order_number",
        "courses.skip_lessons",
        "lessons.id as lesson_id"
        // "lessons.id"
        // DB.raw("GROUP_CONCAT(lessons.id) as idss")
        // DB.raw("ARRAY_AGG(lessons.id) as lesson_id")
      )
      .leftJoin("lessons", "lessons.course_id", "=", "courses.id")
      //   .groupBy("courses.id", "courses.title", "lesson_id")
      //   .groupBy("courses.id")
      .orderBy("courses.order_number", "asc")
      .then(function (record) {
        const resultMap = record.reduce((result, row) => {
          const lesson_id = row.lesson_id;
          delete row.lesson_id;

          result[row.id] = result[row.id] || {
            ...row,
            lessons: [],
          };

          result[row.id].lessons.push(lesson_id);

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
    DB("lessons")
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
    DB("lessons")
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
    DB("lessons")
      .where(query)
      .first()
      .then(function (record) {
        if (record) {
          DB("lesson_progress")
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
    let query = DB("lessons");
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
    let dataQuery = DB("lessons");

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
    let dataQuery = DB("lessons");

    dataQuery
      .where(args.match || {})
      //   .orWhere(args.matchTwo || {})
      //   .select(
      //     "lessons.id",
      //     "lessons.title",
      //     "lessons.image",
      //     "lessons.short_description",
      //     "lessons.total_seconds",
      //     "lesson_progress.seconds_watched",
      //     "lesson_progress.is_completed"
      //   )
      //   .leftJoin(
      //     "lesson_progress",
      //     "lesson_progress.lesson_id",
      //     "=",
      //     "lessons.id"
      //   )
      .orderBy(args?.sort_by || "created_at", args?.order || "desc")
      //   .limit(args?.per_page || 100)
      //   .offset((args?.page - 1) * args?.per_page || 0)
      .then(function (record) {
        DB("lesson_progress")
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

exports.lessonGetOneTwo = async (query, queryTwo = {}) => {
  // only get lesson
  return new Promise((resolve, reject) => {
    DB("lessons")
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

exports.lessonGetOneThree = async (query) => {
  // lesson with course
  return new Promise((resolve, reject) => {
    DB("lessons")
      .where(query)
      .first()
      .select(
        "lessons.id as lesson_id",
        "courses.id as course_id",
        "courses.category_id as course_category_id"
      )
      .leftJoin("courses", "courses.id", "=", "lessons.course_id")
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
    const { data: courses } = await this.lessonGetMany({
      query: { category_id: 3 },
      page: 0,
    });
    const courseIds = courses.map((c) => c.id);

    let dataQuery = DB("lessons");

    dataQuery
      .whereIn("course_id", courseIds)
      .then(function (record) {
        DB("lesson_progress")
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
    DB("lesson_progress")
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
    DB("lesson_progress")
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
    DB("lesson_progress")
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
    DB("lesson_progress")
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
    DB("lessons")
      .where("lessons.course_id","=",course_id)
      .andWhere("lessons.order_number",">",current_lesson_order_number)
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

exports.getNextCourse = async (category_id, current_course_order_number) => {
  return new Promise((resolve, reject) => {
    DB("courses")
      .where("courses.category_id","=",category_id)
      .andWhere("courses.order_number",">",current_course_order_number)
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

// exports.getNextCategory = async (course_package_id, current_category_order_number) => {

// }