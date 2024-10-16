const table = "course_categories";

exports.create = async (data) => {
  return new Promise((resolve, reject) => {
    DB(table)
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

exports.getCourses = async (userId) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .select(
        "course_categories.id",
        "course_categories.title",
        "course_categories.sequence_mandatory",
        "course_categories.order_number as category_order_number",
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
        "lesson_progress.is_completed as lesson_progress_is_completed"
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
            courses: courseObj[key].map((course) => ({
              ...course,
              lessons: lessonsObj[course.id],
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
        resolve({ status: false, data: [], error });
      });
  });
};

exports.getOne = async (table,query) => {
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
