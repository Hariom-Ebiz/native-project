const fs = require("fs");
const path = require("path");
const HttpError = require("../http-error");
const functionalMasteryModal = require("../models/functional-mastery");
const dateTimeFormat = require("../utils/dateTime");
const { validationResult } = require("express-validator");
const { ErrorMessageHandler } = require("../utils/helper");
const { getVideoDurationInSeconds } = require("get-video-duration");
const User = require("../models/user");
const Common = require("../models/common");
const puppeteer  = require("puppeteer")
const moment = require("moment");
const { default: axios } = require("axios");



// /*      COURSE CONTROLLER        */
// exports.addCourse = async (req, res, next) => {

//     const { title, description, linkdin_link,category_id } = req.body;

//     if(!title || !description){
//         return res.status(200).json({
//             message: "Invalid Data Given",
//             status: false
//         })
//     }

    // let course_image = null;

    // if (!req.file) {
    //     return res.status(200).json({
    //         message: "Required course image",
    //         status: false
    //     })
    // }
    // course_image = req.file.path;

//     try {
//         const insertData = { title, description };
//         if (linkdin_link) {
//             insertData.linkdin_link = linkdin_link;
//         }
//         if(category_id){
//             insertData.category_id = category_id;
//         }
//         const resp = await functionalMasteryCourses.createCourse({...insertData, image: course_image, created_at: dateTimeFormat(),
//             updated_at: dateTimeFormat(),})
//         if (resp.status) {
//             return res.status(200).json({
//                 message: "Course Added Successfully.",
//                 status: true
//             })
//         } else {
//             return res.status(200).json({
//                 message: "Something went wrong",
//                 status: false
//             })
//         }
//     } catch (err) {
//         return res.status(200).json({
//             message: "Something went wrong",
//             status: false
//         })
//     }
// }

exports.getAllGroupByCategories = async (req, res, next) => {
    const currentUserId = req.userId;
    console.log("here : ", currentUserId);
    try {
        const resp = await functionalMasteryModal.getAllGroupByCategories(currentUserId);
        console.log("resp : ", resp)
        if (resp.status) {
            return res.status(200).json({
                message: "Data Fetched Successfully",
                status: true,
                list: resp.list
            })
        } else {
            return res.status(200).json({
                message: "Something went wrong",
                status: false,
                list: []
            })
        }
    } catch (error) {
        return res.status(200).json({
            message: "Something went wrong!",
            status: false
        })
    }
}

exports.getAllFunctionalMasteryCourse = async (req, res, next) => {
    let { page, per_page, sort_by, order, title,package_id } = req.query;
    let list;

    page = page ? +page : 1;
    per_page = per_page ? +per_page : 10;
    sort_by = sort_by ?? "created_at";
    order = order ?? "desc";
    // title = title ?? "";

    const extras = {};
    if(title){
        extras.title = title;
    }
    
    if(package_id && package_id != "undefined"){
        console.log("here : ");
        
        extras.package_id = package_id;
    }

    try {
        list = await functionalMasteryModal.getAllCourses({
            query: {...extras},
            page,
            per_page,
            sort_by,
            order
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not fetch.",
            500
        );
        return next(error);
    }

    res.status(201).json({
        status: true,
        message: "Fetched Successfully",
        list: list?.data,
        totalDocuments: list?.totalDocuments,
    });
}

exports.getAllFunctionalMasteryCourseFront = async (req,res, next) => {
    let { page, per_page, sort_by, order, title } = req.query;
    let list;
    const currentUserId = req.userId;

    page = page ? +page : 1;
    per_page = per_page ? +per_page : 100;
    sort_by = sort_by ?? "created_at";
    order = order ?? "desc";
    title = title ?? "";

    try {
        list = await functionalMasteryModal.getAllCoursesFront({
            match: {},
            page,
            per_page,
            sort_by,
            order,
            title,
            user_id: currentUserId
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not fetch.",
            500
        );
        return next(error);
    }

    res.status(201).json({
        status: true,
        message: "Fetched Successfully",
        list: list?.data,
        totalDocuments: list?.totalDocuments,
    });
}

exports.deleteFunctionalMasteryCourse = async (req,res,next) =>{
    const { id } = req.body;

    try {
        await functionalMasteryModal.deleteCourse({ id });
        await functionalMasteryModal.deleteLesson({ "course_id":id });
    } catch (err) {
        console.log("err : ",err);
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not delete.",
            500
        );
        return next(error);
    }

    res.status(201).json({
        status: true,
        message: "Deleted Successfully",
        id,
    });
}

// exports.updateFunctionalMasteryCourse = async (req,res,next) => {
//     const { id, title,description,linkdin_link,category_id } = req.body;

//     let extras = {};

//     if(req.file){
//         extras.image = req.file.path;
//     }

//     try {
//         let updateRes = await functionalMasteryCourses.updateCourse(
//             { id },
//             {
//                 title,description,linkdin_link,category_id,updated_at: dateTimeFormat(), ...extras
//             }
//         );
//         res.status(201).json({
//             status: true,
//             message: "Updated Successfully",
//         });
//     } catch (err) {
//         const error = new HttpError(
//             req,
//             new Error().stack.split("at ")[1].trim(),
//             "Could not update.",
//             500
//         );
//         return next(error);
//     }
// }

// exports.getOneCourse = async (req,res,next) => {
//     const { id } = req.params;

//     let data;
//     try {
//         data = await functionalMasteryCourses.getOneCourse({ "functional_mastery_courses.id": id });
//         if (!data) {
//             const error = new HttpError(
//                 req,
//                 new Error().stack.split("at ")[1].trim(),
//                 "Could not fetch.",
//                 422
//             );
//             return next(error);
//         }
//     } catch (err) {
//         console.log(err);
//         const error = new HttpError(
//             req,
//             new Error().stack.split("at ")[1].trim(),
//             "Could not fetch.",
//             500
//         );
//         return next(error);
//     }

//     res.status(201).json({
//         status: true,
//         message: "Fetched Successfully",
//         data,
//     });
// }

// /*      LESSON CONTROLLER        */
// exports.addLesson = async (req, res, next) => {

//     const { course_id, name, description, lesson_time, category_id } = req.body;

//     if(!course_id || !description || !name || !lesson_time || !category_id){
//         return res.status(200).json({
//             message: "Invalid Data Given",
//             status: false
//         })
//     }

//     let files = req.files;

//     if(!files){
//         return res.status(400).send({
//             status: false,
//             message: "No Lesson Image or lesson content found."
//         });
//     }

//     let lesson_image = null;
//     let lesson_content = null;

//     if(files.lesson_image){
//         lesson_image = files.lesson_image[0].path;
//     }

//     if(files.lesson_content){
//         lesson_content = files.lesson_content[0].path;
//     }

//     try {
//         const insertData = { course_id, name, description, time:lesson_time, category_id };
//         const resp = await functionalMasteryCourses.addLesson({...insertData, image: lesson_image,content: lesson_content, created_at: dateTimeFormat(),
//             updated_at: dateTimeFormat(),})
//         if (resp.status) {
//             return res.status(200).json({
//                 message: "Course Added Successfully.",
//                 status: true
//             })
//         } else {
//             return res.status(200).json({
//                 message: "Something went wrong",
//                 status: false
//             })
//         }
//     } catch (err) {
//         console.log("errro : ", err);
//         return res.status(200).json({
//             message: "Something went wrong",
//             status: false
//         })
//     }
// }

exports.getAllFunctionalMasteryLessonsByCourses = async (req, res, next) => {
    let { page, per_page, sort_by, order, title,course_id } = req.query;
    let list;

    page = page ? +page : 1;
    per_page = per_page ? +per_page : 10;
    sort_by = sort_by ?? "created_at";
    order = order ?? "desc";
    title = title ?? "";

    try {
        list = await functionalMasteryModal.getAllLessons({
            match: {},
            page,
            per_page,
            sort_by,
            order,
            title,
            course_id
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not fetch.",
            500
        );
        return next(error);
    }

    res.status(201).json({
        status: true,
        message: "Fetched Successfully",
        list: list?.data,
        totalDocuments: list?.totalDocuments,
    });
}

// exports.getAllLessonsGroupByCategory = async (req,res, next) => {
//     const {course_id} = req.query;
//     console.log("req.query ; ", req.query);
//     const currentUserId = req.userId;

//     try {
//         const resp = await functionalMasteryCourses.getAllLessonsGroupByCategory(currentUserId,course_id);
//         console.log("resp : ", resp)
//         if (resp.status) {
//             return res.status(200).json({
//                 message: "Data Fetched Successfully",
//                 status: true,
//                 list: resp.list
//             })
//         } else {
//             return res.status(200).json({
//                 message: "Something went wrong",
//                 status: false,
//                 list: []
//             })
//         }
//     } catch (error) {
//         return res.status(200).json({
//             message: "Something went wrong!",
//             status: false
//         })
//     }

// }

exports.deleteFunctionalMasteryLesson = async (req,res,next) =>{
    const { id } = req.body;

    try {
        await functionalMasteryModal.deleteLesson({ id });
    } catch (err) {
        console.log("err : ",err);
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not delete.",
            500
        );
        return next(error);
    }

    res.status(201).json({
        status: true,
        message: "Deleted Successfully",
        id,
    });
}

// exports.updateFunctionalMasteryLesson = async (req,res,next) => {
//     const { id,course_id, name, description, lesson_time } = req.body;

//     let files = req.files;

//     if(!files){
//         return res.status(400).send({
//             status: false,
//             message: "No Lesson Image or lesson content found."
//         });
//     }

//     const extras = {};

//     if(files.lesson_image){
//         extras.image = files.lesson_image[0].path;
//     }

//     if(files.lesson_content){
//         extras.content = files.lesson_content[0].path;
//     }


//     try {
//         let updateRes = await functionalMasteryCourses.updateLesson(
//             { id },
//             {
//                 ...extras,course_id, name, description, time:lesson_time,updated_at: dateTimeFormat(),
//             }
//         );
//         res.status(201).json({
//             status: true,
//             message: "Updated Successfully",
//         });
//     } catch (err) {
//         const error = new HttpError(
//             req,
//             new Error().stack.split("at ")[1].trim(),
//             "Could not update.",
//             500
//         );
//         return next(error);
//     }
// }

exports.getOneLessonForAdmin = async (req,res,next) => {
    const { id } = req.params;

    let data;
    try {
        data = await functionalMasteryModal.getOneLessonAdmin({ "functional_mastery_lessons.id": id });
        if (!data) {
            const error = new HttpError(
                req,
                new Error().stack.split("at ")[1].trim(),
                "Could not fetch.",
                422
            );
            return next(error);
        }
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not fetch.",
            500
        );
        return next(error);
    }

    res.status(201).json({
        status: true,
        message: "Fetched Successfully",
        data,
    });
}

// exports.getLessonData = async (req,res,next) => {
//     const { id } = req.params;
//     const user_id = req.userId;

//     try {
//         const lessonInformation = await functionalMasteryCourses.getOneLesson({
//             "functional_mastery_lessons.id": id
//         })

//         console.log("lessonInformation",lessonInformation);

//         return res.status(200).json({
//             message: "Lesson Details Fetched !",
//             status: true,
//             lesson : lessonInformation
//         })

//     } catch (error) {

//     }

// }
// /*      ALL FUNCTIONAL MASTERY CATEGORY CONTROLLERS      */
// exports.createFunctionalMasteryCategory = async (req, res, next) => {
//     const { title } = req.body;
//     try {
//         let saveRes = await functionalMasteryCourses.createCategory({
//             title,
//             created_at: dateTimeFormat(),
//             updated_at: dateTimeFormat(),
//         });
//     } catch (err) {
//         console.log("err", err);
//         const error = new HttpError(
//             req,
//             new Error().stack.split("at ")[1].trim(),
//             "Could not create.",
//             500
//         );
//         return next(error);
//     }

//     res.status(201).json({
//         status: true,
//         message: "Created Successfully",
//     });
// }

// exports.updateFunctionalMasteryCategory = async (req, res, next) => {
//     const { id, title } = req.body;

//     try {
//         let updateRes = await functionalMasteryCourses.updateCategory(
//             { id },
//             {
//                 title,
//                 updated_at: dateTimeFormat(),
//             }
//         );
//         res.status(201).json({
//             status: true,
//             message: "Updated Successfully",
//         });
//     } catch (err) {
//         const error = new HttpError(
//             req,
//             new Error().stack.split("at ")[1].trim(),
//             "Could not update.",
//             500
//         );
//         return next(error);
//     }
// }



/*      CATEGORY CONTROLLERS         */
exports.createCategory = async (req, res, next) => {
    const { title, order_number, sequence_mandatory, package_id } = req.body;

    const updates = {
        title,
        order_number,
        sequence_mandatory,
        package_id,
        created_at: dateTimeFormat(),
        updated_at: dateTimeFormat(),
    };

    try {
        await functionalMasteryModal.createCategory(updates);
    } catch (err) {
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not able to create course category.",
            500
        );
        return next(error);
    }

    res.status(201).json({
        status: true,
        message: "Course Category Created Successfully",
    });
};

exports.updateCategory = async (req, res, next) => {
    const { id, title, order_number, sequence_mandatory } = req.body;

    const updates = {
        title,
        order_number,
        sequence_mandatory,
        updated_at: dateTimeFormat(),
    };

    try {
        await functionalMasteryModal.updateCategory({ id }, updates);
    } catch (err) {
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not able to update course category.",
            500
        );
        return next(error);
    }

    res.status(201).json({
        status: true,
        message: "Course Category Updated Successfully",
    });
};

exports.getCategoryCourses = async (req, res, next) => {
    const {packageId} = req.params;
    let categories, progress, thirdCompleted,course_package_details;

    try {
        [categories, progress, thirdCompleted] = await Promise.all([
            functionalMasteryModal.getCategoryCourses(packageId,req.userId ?? 0),
            User.getCourseProgress("functional_mastery_course_categories", req.userId),
            functionalMasteryModal.lessonCheckThirdCategoryIsCompleted(req.userId ?? 0),
        ]);

        course_package_details = await functionalMasteryModal.getOneCoursePackage({id: packageId})

    } catch (err) {
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not able to fetch courses.",
            500
        );
        return next(error);
    }

    // console.log("categories : ", categories);

    categories = categories.data;

    categories = categories.map((category) => {
        category.courses = category.functional_mastery_courses.map((course) => {
            const lesson_count = course.functional_mastery_lessons.length;
            const each_lesson_percentage = +(100 / course.functional_mastery_lessons.length).toFixed(2);

            let lesson_completed_count = course.functional_mastery_lessons.filter(
                (lesson) => lesson.progress.is_completed == 1
            ).length;
            let completed_percentage = 0;

            if (lesson_count === lesson_completed_count) {
                completed_percentage = 100;
            } else {
                completed_percentage = course.functional_mastery_lessons.reduce((acc, cv) => {
                    if (cv.progress.is_completed == 1) {
                        acc += each_lesson_percentage;
                    } else if (
                        cv.total_seconds != null &&
                        "is_completed" in cv.progress
                    ) {
                        const percentage = (
                            (cv.progress.seconds_watched / cv.progress.total_seconds) *
                            each_lesson_percentage
                        ).toFixed(2);
                        acc += +percentage;
                    }
                    return acc;
                }, 0);
            }

            // course.lessons = course.functional_mastery_lessons.map((lesson) => lesson.id);

            course.lessons = course?.functional_mastery_lessons?.reduce((finalLessons, lesson) => {
                if (lesson && lesson.id) {
                    if(!finalLessons.find(l => l.id == lesson.id)){
                        finalLessons.push({id: lesson.id, total_seconds: lesson.total_seconds ?? 0});
                      }
                }
                return finalLessons;
            }, []);

            return {
                ...course,
                completed_percentage: +completed_percentage.toFixed(0),
                lesson_completed_count,
            };
        });

        return category;
    });

    res.status(200).json({
        status: true,
        message: "Categories fetched successfully",
        categories,
        progress,
        thirdCompleted,
        course_package_details
    });
};

exports.thirdCategory = async (req, res, next) => {
    let isThirdCategoryCompleted;

    try {
        isThirdCategoryCompleted = await functionalMasteryModal.lessonCheckThirdCategoryIsCompleted(
            req.userId
        );
    } catch (err) {
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Something went wrong",
            500
        );
        return next(error);
    }

    res.status(200).json({
        status: true,
        message: "Data fetched successfully",
        isThirdCategoryCompleted,
    });
};

exports.getAllFunctionalMasteryCategory = async (req, res, next) => {
    let { page, per_page, sort_by, order, title, package_id} = req.query;
    let list;

    page = page ? +page : 1;
    per_page = per_page ? +per_page : 10;
    sort_by = sort_by ?? "created_at";
    order = order ?? "desc";
    title = title ?? "";

    const extras = {};
    if(package_id && package_id != "undefined"){
        extras.package_id = package_id;
    }

    try {
        list = await functionalMasteryModal.getManyCategories({
            match: {},
            page,
            per_page,
            sort_by,
            order,
            title,
            ...extras
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not fetch.",
            500
        );
        return next(error);
    }

    res.status(201).json({
        status: true,
        message: "Fetched Successfully",
        list: list?.data,
        totalDocuments: list?.totalDocuments,
    });
}

exports.getOneFunctionalMasteryCategory = async (req, res, next) => {
    const { id } = req.params;

    let data;
    try {
        data = await functionalMasteryModal.getOneCategory({ id });
        if (!data) {
            const error = new HttpError(
                req,
                new Error().stack.split("at ")[1].trim(),
                "Could not fetch.",
                422
            );
            return next(error);
        }
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not fetch.",
            500
        );
        return next(error);
    }

    res.status(201).json({
        status: true,
        message: "Fetched Successfully",
        data,
    });
}

exports.deleteFunctionalMasteryCategory = async (req, res, next) => {
    const { id } = req.body;

    try {
        await functionalMasteryModal.deleteCategory({ id });
    } catch (err) {
        console.log("err : ",err);
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not delete.",
            500
        );
        return next(error);
    }

    res.status(201).json({
        status: true,
        message: "Deleted Successfully",
        id,
    });
}


/*      COURSE PACKAGES      */

exports.getAllFunctionalMasteryPackage = async (req, res, next) => {
    let { page, per_page, sort_by, order, title } = req.query;
    let list;

    page = page ? +page : 1;
    per_page = per_page ? +per_page : 10;
    sort_by = sort_by ?? "created_at";
    order = order ?? "desc";
    title = title ?? "";

    try {
        list = await functionalMasteryModal.getAllCoursePackages({
            match: {},
            page,
            per_page,
            sort_by,
            order,
            title,
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not fetch.",
            500
        );
        return next(error);
    }

    res.status(201).json({
        status: true,
        message: "Fetched Successfully",
        list: list?.data,
        totalDocuments: list?.totalDocuments,
    });
}

exports.getOneFunctionalMasteryPackage = async (req, res, next) => {
    const { id } = req.params;

    let data;
    try {
        data = await functionalMasteryModal.getOneFunctionalMasteryPackage({ id });
        if (!data) {
            const error = new HttpError(
                req,
                new Error().stack.split("at ")[1].trim(),
                "Could not fetch.",
                422
            );
            return next(error);
        }
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not fetch.",
            500
        );
        return next(error);
    }

    res.status(201).json({
        status: true,
        message: "Fetched Successfully",
        course: data,
    });
}

exports.deleteFunctionalMasteryPackage = async (req, res, next) => {
    const { id } = req.body;

    try {
        await functionalMasteryModal.deleteFunctionalMasteryPackage({ id });
    } catch (err) {
        console.log("err : ",err);
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not delete.",
            500
        );
        return next(error);
    }

    res.status(201).json({
        status: true,
        message: "Deleted Successfully",
        id,
    });
}

exports.createFunctionalMasteryPackage = async (req, res, next) => {
    const {  title,  description} = req.body;

    let course_image = null;

    if (!req.file) {
        return res.status(200).json({
            message: "Required course image",
            status: false
        })
    }
    course_image = req.file.path;

    try {
        await functionalMasteryModal.createFunctionalMasteryPackage({
            title,
            description,
            image: course_image,
            created_at: dateTimeFormat(),
            updated_at: dateTimeFormat(),
        });
    } catch (err) {
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not able to create course package.",
            500
        );
        return next(error);
    }

    res.status(201).json({
        status: true,
        message: "Course Package Created Successfully",
    });
};

exports.updateFunctionalMasteryPackage = async (req, res, next) => {
    const { id, title, description } = req.body;

    const extras = {
        updated_at: dateTimeFormat(),
        title,
        description
    };

    if (req.file) {
        extras.image = req.file.path
    }


    try {
        await functionalMasteryModal.updateFunctionalMasteryPackage({ id }, extras);
    } catch (err) {
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not able to update course.",
            500
        );
        return next(error);
    }

    res.status(200).json({
        status: true,
        message: "Course Package Updated Successfully",
    });
};




/*    COURSES CONTROLLERS    */
exports.createCourse = async (req, res, next) => {
    const { category_id, title, time, order_number, skip_lessons, description,linkdin_link, package_id } = req.body;

    let course_image = null;

    if (!req.file) {
        return res.status(200).json({
            message: "Required course image",
            status: false
        })
    }
    course_image = req.file.path;

    try {
        await functionalMasteryModal.createCourse({
            package_id,
            category_id,
            title,
            description,
            time,
            order_number,
            skip_lessons,
            image: course_image,
            linkdin_link,
            created_at: dateTimeFormat(),
            updated_at: dateTimeFormat(),
        });
    } catch (err) {
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not able to create course.",
            500
        );
        return next(error);
    }

    res.status(201).json({
        status: true,
        message: "Course Created Successfully",
    });
};

exports.updateCourse = async (req, res, next) => {
    const { id, category_id, title, time, order_number, skip_lessons,linkdin_link } = req.body;

    const extras = {
        updated_at: dateTimeFormat(),
        category_id,
        title,
        time,
        order_number,
        skip_lessons,
        linkdin_link
    };

    if (req.file) {
        extras.image = req.file.path
    }

    // if (files.background_image && files.background_image.length > 0) {
    //   extras.background_image = files.background_image[0].path;
    // }

    try {
        await functionalMasteryModal.updateCourse({ id }, extras);
    } catch (err) {
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not able to update course.",
            500
        );
        return next(error);
    }

    res.status(200).json({
        status: true,
        message: "Course Updated Successfully",
    });
};

exports.getOneCourse = async (req, res, next) => {
    const { id } = req.params;

    let course;

    try {
        course = await functionalMasteryModal.getOneCourse({ "functional_mastery_courses.id": id });
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not able to fetch.",
            500
        );
        return next(error);
    }

    if (!course) {
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Course not found",
            404
        );
        return next(error);
    }

    res.status(200).json({
        status: true,
        message: "Course Fetched Successfully",
        course,
    });
};

exports.getAllCourses = async (req, res, next) => {
    let courses;

    try {
        courses = await functionalMasteryModal.getAllCourses({
            page: 1,
            per_page: 100,
            sort_by: "order_number",
            order: "asc",
        });
    } catch (err) {
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not fetch courses.",
            500
        );
        return next(error);
    }

    res.status(200).json({
        status: true,
        message: "Courses Fetched Successfully",
        courses: courses?.data,
    });
};



/*      LESSONS CONTROLLERS          */
const getVideoLength = async (filename) => {
    const directoryPath = path.resolve(
        __dirname,
        "..",
        "uploads",
        "images",
        "lesson_content",
        filename
    );
    console.log("direname : ", directoryPath);
    
    // Verify that the file exists
    const fs = require("fs");
    if (!fs.existsSync(directoryPath)) {
        return {status: false};
        throw new Error(`File does not exist at path: ${directoryPath}`);
    }

    const duration = await getVideoDurationInSeconds(directoryPath);
    console.log("duration : ", duration);
    
    return {status: true,duration};
    return duration;

    // const file = await fs.open(directoryPath, "r");
    // const { buffer } = await file.read(buff, 0, 100, 0);

    // await file.close();

    // const start = buffer.indexOf(header) + 17;
    // const timeScale = buffer.readUInt32BE(start);
    // const duration = buffer.readUInt32BE(start + 4);

    // const audioLength = Math.floor((duration / timeScale) * 1000) / 1000;

    // return audioLength;
};

exports.createLesson = async (req, res, next) => {
    const {
        title,
        // short_description,
        description,
        course_id,
        order_number,
        video_url,
        document_url,
        id,
        is_assessment,
        is_excel
    } = req.body;

    const files = req.files;

    const image = files.image[0].path;

    const updates = {
        title,
        long_description: description,
        course_id,
        order_number,
        image,
        created_at: dateTimeFormat(),
        updated_at: dateTimeFormat(),
        id,
        is_excel: false,
    };

    if(video_url){
        updates.video = video_url;
        const duration = await getVideoDurationInSeconds(video_url);
        updates.total_seconds = duration;
    }
    if(document_url){
        updates.document_url = document_url;
        updates.total_seconds = 0;
    }

    if (updates.video && updates.document) {
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "You cannot upload both video and pdf.",
            422
        );
        return next(error);
    }

    try {
        await functionalMasteryModal.createLesson(updates);
    } catch (err) {
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not able to create lesson.",
            500
        );
        return next(error);
    }

    res.status(201).json({
        status: true,
        course_id: course_id,
        message: "Lesson Created Successfully",
    });
};

exports.updateLesson = async (req, res, next) => {
    const {
        id,
        title,
        description,
        course_id,
        order_number,
        video_url,
        document_url
    } = req.body;

    const extras = {
        updated_at: dateTimeFormat(),
        title,
        long_description: description,
        course_id,
        order_number,
    };

    const files = req.files;

    if(video_url){
        extras.video = video_url;
        const duration = await getVideoDurationInSeconds(video_url);
        extras.total_seconds = duration;
    }
    if(document_url){
        extras.document_url = document_url;
        extras.total_seconds = 0;
    }


    try {
        await functionalMasteryModal.updateLesson({ id }, extras);
    } catch (err) {
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not able to update lesson.",
            500
        );
        return next(error);
    }

    res.status(200).json({
        status: true,
        message: "Lesson Updated Successfully",
    });
};

exports.getOneLesson = async (req, res, next) => {
    const { id } = req.params;

    let lesson;

    try {
        lesson = await functionalMasteryModal.getOneLesson(
            { "functional_mastery_lessons.id": id },
            { "functional_mastery_lesson_progress.user_id": req.userId }
        );
    } catch (err) {
        console.log("err", err);
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not able to fetch.",
            500
        );
        return next(error);
    }

    if (!lesson) {
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Lesson not found",
            404
        );
        return next(error);
    }

    let nextLesson, course, progress, nextCourse, nextCourseLesson;

    try {

        nextLesson = await functionalMasteryModal.lessonGetOneTwo({
            "functional_mastery_lessons.course_id": lesson.course_id,
            // "functional_mastery_lessons.order_number": lesson.order_number + 1,
        },[
            {key: "functional_mastery_lessons.order_number",operator: "=", value: lesson.order_number},
            {key: "functional_mastery_lessons.id",operator: "!=", value: lesson.id}
        ]);

        if(!nextLesson){
            nextLesson = await functionalMasteryModal.lessonGetOneTwo({
                "functional_mastery_lessons.course_id": lesson.course_id,
                // "functional_mastery_lessons.order_number": lesson.order_number + 1,
            },[
                {key: "functional_mastery_lessons.order_number",operator: ">", value: lesson.order_number},
                {key: "functional_mastery_lessons.id",operator: "!=", value: lesson.id}
            ]);
        }


        course = functionalMasteryModal.getOneCourse({ "functional_mastery_courses.id": lesson.course_id });

        progress = User.getCourseProgress("functional_mastery_course_categories", req.userId);

        [course, progress] = await Promise.all([
            course,
            progress,
        ]);

        nextCourse = await functionalMasteryModal.getNextCourse({category_id: course.category_id}, [{key: "functional_mastery_courses.order_number", operator: ">", value: course.order_number}])

        if (!nextCourse) {
            nextCourse = await functionalMasteryModal.getNextCourse({}, [
                {
                    key: 'category_id', operator: ">", value: course.category_id
                },
                {
                    key: "functional_mastery_courses.order_number", operator: ">", value: course.order_number
                }
            ])
        }

        lesson.is_different_category = false;

        if (nextCourse) {
            nextCourseLesson = functionalMasteryModal.lessonGetOneTwo({
                "functional_mastery_lessons.course_id": nextCourse.id,
            },[
                {key: "functional_mastery_lessons.order_number",operator: ">=", value: 1},
            ]);

            if (course.category_id !== nextCourse.category_id) {
                lesson.is_different_category = true;
            }
        }
    } catch (err) {
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not able to fetch.",
            500
        );
        return next(error);
    }

    let previousLesson;

    try {
        //can be id - 1;
        lesson.prev_lesson_id = null;

        previousLesson = functionalMasteryModal.lessonGetOneTwo({
            "functional_mastery_lessons.course_id": lesson.course_id,
            // "functional_mastery_lessons.order_number": lesson.order_number + 1,
        },[
            {key: "functional_mastery_lessons.order_number",operator: "<=", value: lesson.order_number},
            {key: "functional_mastery_lessons.id",operator: "!=", value: lesson.id}
        ]);

        if (!previousLesson) {
            previousLesson = await functionalMasteryModal.lessonRaw(
                "SELECT * FROM functional_mastery_lessons WHERE `course_id` = ? ORDER BY order_number DESC LIMIT 1",
                [lesson.course_id - 1]
            );

            if (previousLesson.status && previousLesson.data.length > 0) {
                lesson.prev_lesson_id = previousLesson.data[0].id;
            }
        } else {
            lesson.prev_lesson_id = previousLesson.id;
        }
    } catch (err) {
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not able to fetch.",
            500
        );
        return next(error);
    }

    let isError = false;

    if ("current_course_id" in progress) {
        if (progress.current_category_id < course.category_id) {
            isError = true;
            console.log("hre >>>>MMMM???/");
        } else if (
            progress.current_category_id === course.category_id &&
            progress.current_sequence_mandatory == 1 &&
            progress.current_course_id < lesson.course_id
        ) {
            console.log("hre >>>>MMMM<<<");
            isError = true;
        } else if (
            progress.current_category_id === course.category_id &&
            progress.current_sequence_mandatory == 1 &&
            progress.current_lesson_id < id
        ) {
            console.log("hre >>>>MMMM");
            isError = true;
        }
    }

    // console.log("req.anotherApi : ", req.anotherApi);
    // console.log("isError : ", isError);
    // if (!req.anotherApi && isError) {
    //     return res.status(200).json({
    //         status: true,
    //         message: "Lesson Fetched Successfully",
    //         lesson: {},
    //     });
    // }

    lesson.course_data = course;

    if (nextLesson) {
        lesson.next_lesson_id = nextLesson.id;
        lesson.is_another_course = false;
    } else if (nextCourseLesson) {
        lesson.next_lesson_id = nextCourseLesson.id;
        lesson.is_another_course = true;
    } else {
        lesson.next_lesson_id = null;
    }

    if (
        "current_course_id" in progress &&
        (lesson.document || lesson.is_assessment == 1)
    ) {
        // await LessonProgress.upsert({
        //   user_id: req.userId,
        //   lesson_id: lesson.id,
        //   course_id: lesson.course_id,
        //   total_seconds: 1,
        //   seconds_watched: 1,
        //   is_completed: 1,
        //   created_at: dateTimeFormat(),
        //   updated_at: dateTimeFormat(),
        // });

        const isExits = await functionalMasteryModal.getOneLessonProgress({
            user_id: req.userId,
            lesson_id: lesson.id,
            course_id: lesson.course_id,
        });

        if (!isExits) {
            if (lesson.is_assessment == 1) {
                const response = await functionalMasteryModal.createLessonProgress({
                    user_id: req.userId,
                    lesson_id: lesson.id,
                    course_id: lesson.course_id,
                    total_seconds: 1,
                    seconds_watched: 1,
                    is_completed: 0,
                    created_at: dateTimeFormat(),
                    updated_at: dateTimeFormat(),
                });

                lesson.assessment_progress_id = response?.data?.[0];
            } else {
                lesson.is_completed = 1;
                await functionalMasteryModal.createLessonProgress({
                    user_id: req.userId,
                    lesson_id: lesson.id,
                    course_id: lesson.course_id,
                    total_seconds: 1,
                    seconds_watched: 1,
                    is_completed: 1,
                    created_at: dateTimeFormat(),
                    updated_at: dateTimeFormat(),
                });
            }
        } else {
            if (lesson.is_assessment == 1) {
                lesson.assessment_progress_id = isExits.id;
            }
        }
    }

    if (
        "current_course_id" in progress &&
        lesson.document &&
        lesson.id >= progress.current_lesson_id
    ) {
        let current_category_id = progress.current_category_id;
        let current_course_id = progress.current_course_id;
        let current_lesson_id = progress.current_lesson_id;

        if (lesson.next_lesson_id && !lesson.is_another_course) {
            current_lesson_id = lesson.next_lesson_id;
        } else {
            current_lesson_id = lesson.id + 1;

            const nextLessonData = await functionalMasteryModal.lessonGetOneTwo({
                "functional_mastery_lessons.id": current_lesson_id,
            },{});

            if (nextLessonData) {
                current_course_id = nextLessonData.course_id;
                current_category_id = nextLessonData.course_category_id;
            } else {
                current_course_id = lesson.course_data.id + 1;
                current_category_id = lesson.course_data.category_id + 1;
            }
        }

        await Promise.all([
            User.update(
                { id: req.userId },
                {
                    current_category_id,
                    current_course_id,
                    current_lesson_id,
                    updated_at: dateTimeFormat(),
                }
            ),
            // functionalMasteryModal.createLessonProgress({
            //   user_id: req.userId,
            //   lesson_id: lesson.id,
            //   course_id: lesson.course_id,
            //   total_seconds: 1,
            //   seconds_watched: 1,
            //   is_completed: 1,
            //   created_at: dateTimeFormat(),
            //   updated_at: dateTimeFormat(),
            // }),
        ]);
    }

    try {
        if (course.category_id == 3) {
            const isThirdCategoryCompleted =
                await functionalMasteryModal.lessonCheckThirdCategoryIsCompleted(req.userId ?? 0);

            lesson.is_third_category_completed = isThirdCategoryCompleted;
        } else {
            lesson.is_third_category_completed = false;
        }
    } catch (err) {
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not able to fetch.",
            500
        );
        return next(error);
    }

    let completed_percentage = 0;
    if (lesson.seconds_watched != null) {
        completed_percentage =
            (lesson.seconds_watched / lesson.total_seconds) * 100;
        completed_percentage = +completed_percentage.toFixed(0);
    }

    lesson.is_completed = lesson.is_completed === 1;

    if (lesson.is_completed === 1) {
        completed_percentage = 100;
    }

    lesson.completed_percentage = completed_percentage;

    // delete lesson.total_seconds;
    // delete lesson.seconds_watched;

    if (lesson.is_assessment == 1) {
        switch (lesson.assessment) {
            case "career_values":
                {
                    let [values, titles] = await Promise.all([
                        Common.getAll("core_values"),
                        Common.getAll("core_value_titles"),
                    ]);

                    values = values?.record.map((r) => ({
                        id: r.id.toString(),
                        content: r.value,
                        description: r.description,
                    }));

                    const titlesArr = ["Choose Values"],
                        bgColours = [null],
                        maxLimit = [1000];

                    titles.record.forEach((t) => {
                        titlesArr.push(t.title);
                        bgColours.push(t.background_colour);
                        maxLimit.push(t.max_limit);
                    });

                    lesson.assessmentData = {
                        values,
                        titles: titlesArr,
                        bgColours,
                        maxLimit,
                    };
                }
                break;
            case "career_interests": {
                let [statements, categories] = await Promise.all([
                    Common.getAll("career_interests"),
                    Common.getAll("career_interest_categories"),
                ]);

                lesson.assessmentData = {
                    statements: statements.record,
                    categories: categories.record,
                };

                break;
            }
            case "motivated_skills": {
                const motivatedSkills = await Common.getAll("motivated_skills");
                lesson.assessmentData = {
                    motivatedSkills: motivatedSkills?.record.map((s) => ({
                        id: s.id.toString(),
                        content: s.skill,
                        description: s.description,
                    })),
                };
                break;
            }
            case "personality_type": {
                const types = await Common.getAll("personality_types");

                const data = types?.record ?? [];

                const size = 4;
                const arrayOfArrays = [];

                for (let i = 0; i < data.length; i += size) {
                    arrayOfArrays.push(data.slice(i, i + size));
                }

                lesson.assessmentData = {
                    types: arrayOfArrays,
                };
                break;
            }
            default: {
            }
        }
    }

    if (req.anotherApi) {
        return lesson;
    }

    res.status(200).json({
        status: true,
        message: "Lesson Fetched Successfully",
        lesson,
    });
};

exports.getAllLesson = async (req, res, next) => {
    let lessons;

    try {
        lessons = await functionalMasteryModal.lessonGetMany({
            page: 1,
            per_page: 100,
            sort_by: "order_number",
            order: "asc",
        });
    } catch (err) {
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not fetch lessons.",
            500
        );
        return next(error);
    }

    res.status(200).json({
        status: true,
        message: "Lessons Fetched Successfully",
        lessons: lessons?.data,
    });
};

exports.getAllLessons = async (req, res, next) => {
    let lessons, course, progress;
    const courseId = +req.params.id;

    try {
        lessons = functionalMasteryModal.lessonGetManyClient({
            page: 1,
            per_page: 100,
            sort_by: "order_number",
            order: "asc",
            match: {
                "functional_mastery_lessons.course_id": courseId,
            },
            matchTwo: {
                // "functional_mastery_lesson_progress.user_id": 2,
                user_id: req.userId ?? 0,
            },
        });

        course = functionalMasteryModal.getOneCourse({ "functional_mastery_courses.id": courseId });

        progress = User.getCourseProgress("functional_mastery_course_categories", req.userId);

        [lessons, course, progress] = await Promise.all([
            lessons,
            course,
            progress,
        ]);
    } catch (err) {
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not able to fetch lessons.",
            500
        );
        return next(error);
    }

    let isError = false;
    //user logged in
    if ("current_course_id" in progress) {
        if (progress.current_category_id < course.category_id) {
            isError = true;
        } else if (
            progress.current_category_id === course.category_id &&
            progress.current_sequence_mandatory == 1 &&
            progress.current_course_id < courseId
        ) {
            isError = true;
        }
    }

    // if (isError) {
    //     return res.status(200).json({
    //         status: true,
    //         message: "Lessons Fetched Successfully",
    //         lessons: [],
    //         course: {},
    //     });
    // }

    const data = lessons?.data.map((lesson) => {
        let completed_percentage = 0;
        if (lesson.seconds_watched != null) {
            completed_percentage =
                (lesson.seconds_watched / lesson.total_seconds) * 100;
            completed_percentage = +completed_percentage.toFixed(0);
        }

        if (lesson.is_completed === 1) {
            completed_percentage = 100;
        }

        delete lesson.total_seconds;
        delete lesson.seconds_watched;

        return {
            ...lesson,
            is_completed: lesson.is_completed === 1,
            completed_percentage,
        };
    });

    res.status(200).json({
        status: true,
        message: "Lessons Fetched Successfully",
        lessons: data,
        course,
        progress,
    });
};

exports.lessonUpdateId = async (req, res, next) => {
    const lastId = 74;
    const firstId = 27;

    for (let i = lastId; i >= firstId; i--) {
        await functionalMasteryModal.updateLessonProgress(
            {
                lesson_id: i,
            },
            {
                lesson_id: i + 1,
            }
        );
    }

    res.status(200).json({
        status: true,
        message: "DONE",
    });
};

exports.uploadVideoToBunny = async (req,res,next) =>{
    try{
        const filePath = path.join(__dirname,"../", req.file.path);
        const fileStream = fs.createReadStream(filePath);

        const videoName =  new Date().toISOString().replace(/:/g, "-") +"-" + Math.floor(10000 + Math.random()*9000000) + req.file.originalname;
        
        const bunnyStorageZone = "native-storage";
        const bunnyStorageZonePassword = "ff00ddb4-ed9e-4574-bdff732f3f8d-3277-4666";
        const bunnyPullZone = "natives"

        const response = await axios.put(
            `https://storage.bunnycdn.com/${bunnyStorageZone}/${videoName}`,
            fileStream,
            {
                headers: {
                    'AccessKey': bunnyStorageZonePassword,
                    'Content-Type': 'application/octet-stream',
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            }
        );

        if(response.status){
            fs.unlinkSync(filePath);
            return res.status(200).json({
                message: "file uploaded.",
                url: `https://${bunnyPullZone}.b-cdn.net/${videoName}`,
                status: true
            })
        }
        else {
            return res.status(200).json({
                message:'Something went wrong with bunny.',
                status: false, 
                url : ""
            })
        }
    } catch(err){
        console.log("error : ",err);
        
        return res.status(200).json({
            message:'Internal Server Error.',
            status: false, 
            url : ""
        })
    }
}


/*      LESSON PROGRESS      */
exports.createLessonProgress = async (req, res, next) => {
    const user_id = req.userId;

    const { id, lesson_id, course_id, total_seconds, seconds_watched } = req.body;

    const updates = {
        user_id,
        lesson_id,
        course_id,
        total_seconds,
        seconds_watched,
        is_completed: 0,
        created_at: dateTimeFormat(),
        updated_at: dateTimeFormat(),
    };

    let response;

    try {
        if (id) {
            await functionalMasteryModal.updateLessonProgress(
                { id, is_completed: 0 },
                {
                    seconds_watched,
                    updated_at: dateTimeFormat(),
                }
            );
        } else {
            response = await functionalMasteryModal.createLessonProgress(updates);
        }
    } catch (err) {
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not able to create lesson progress.",
            500
        );
        return next(error);
    }

    res.status(201).json({
        status: true,
        message: "Lesson Progress Updated Successfully",
        id: response?.data?.[0],
    });
};

exports.completeLessonProgress = async (req, res, next) => {
    const user_id = req.userId;
    const { id, total_seconds, lesson_id,package_id } = req.body;

    console.log("user_id : ", user_id);
    console.log("req.body : ", req.body);

    let response;
    try {

        response = await functionalMasteryModal.updateLessonProgress(
            { id, is_completed: 0, user_id },
            {
                total_seconds,
                seconds_watched: total_seconds,
                is_completed: 1,
                updated_at: dateTimeFormat(),
            }
        );

        const isCouseCompletedRes = await functionalMasteryModal.checkIsCourseIsCompleted({user_id,package_id})
        if(isCouseCompletedRes.status && isCouseCompletedRes.data){
            const packageDetails = await functionalMasteryModal.getOneCoursePackage({"id": package_id})
            console.log("packageDetails : ", packageDetails);
            await createCertificate(user_id, packageDetails.title, "functional_mastery_course")
        }
    } catch (err) {
        console.log("errkjk : err", err);
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not able to complete lesson progress.",
            500
        );
        return next(error);
    }

    if (response.data > 0) {
        //actually updated to user
        try {
            req.params = { id: lesson_id };
            req.anotherApi = true;

            let progress = User.getCourseProgress("functional_mastery_course_categories", req.userId);
            let lesson = this.getOneLesson(req, res, next);
            
            
            [progress, lesson] = await Promise.all([progress, lesson]);
            
            console.log("progress : ", progress);
            console.log("lesson : ", lesson);

            if (lesson.id >= progress.current_lesson_id) {
                let current_category_id = progress.current_category_id;
                let current_course_id = progress.current_course_id;
                let current_lesson_id = progress.current_lesson_id;

                if (lesson.next_lesson_id && !lesson.is_another_course) {
                    current_lesson_id = lesson.next_lesson_id;
                } else {
                    current_lesson_id = lesson_id + 1;

                    const nextLessonData = await functionalMasteryModal.lessonGetOneThree({
                        "functional_mastery_lessons.id": current_lesson_id,
                    });

                    if (nextLessonData) {
                        current_course_id = nextLessonData.course_id;
                        current_category_id = nextLessonData.course_category_id;
                    } else {
                        current_category_id = lesson.course_data.category_id + 1;
                        current_course_id = lesson.course_data.id + 1;
                    }
                }

                await User.update(
                    { id: user_id },
                    {
                        current_category_id,
                        current_course_id,
                        current_lesson_id,
                        updated_at: dateTimeFormat(),
                    }
                );
            }
        } catch (err) {
            console.log("err", err);
            const error = new HttpError(
                req,
                new Error().stack.split("at ")[1].trim(),
                "Something went wrong",
                500
            );
            return next(error);
        }
    }

    res.status(201).json({
        status: true,
        message: "Lesson Progress Completed Successfully",
        resultToSend: req.resultToSend,
    });
};

const createCertificate = async (user_id, course_name, course_type) => {
    try{
        const userData = await DB("users").where("id", "=", user_id).limit(1)

        let certificateHTML = fs.readFileSync(path.resolve(__dirname + "/../uploads/images/certificate/certificate.html"),"utf8")

        certificateHTML = certificateHTML.replace(/{BACKEND_BASE_URL}/g, process.env.BACKEND_URL)
        certificateHTML = certificateHTML.replace(/{NAME}/g, userData[0].first_name + " " + userData[0].last_name)
        certificateHTML = certificateHTML.replace(/{DATE}/g,moment().format("MMMM, YYYY"))
        certificateHTML = certificateHTML.replace(/{COURSE_NAME}/g,course_name)

        const browser = await puppeteer.launch({ headless: true,args: ['--no-sandbox'] });
        const page = await browser.newPage();

        await page.setContent(certificateHTML,{
            waitUntil: 'networkidle0',
        })

        const filename = `${user_id}_${course_name}_${new Date().getTime()}`

        await page.setViewport({ width: 1080, height: 512 });
        await page.emulateMediaType('screen');
        await page.pdf({
            path: `uploads/images/certificate/${filename}.pdf`,
            printBackground: true,
            width: '720px',
            height: '516.7px',
            printBackground: true,
            margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
        })
        await browser.close();

        await DB("certificates")
        .insert({
            user_id: user_id,
            title: course_name,
            path: `uploads/images/certificate/${filename}.pdf`,
            course_type: course_type,
            created_at: dateTimeFormat(),
            updated_at: dateTimeFormat()
        })

        return {status: true}

    } catch (err) {
        console.log("error : ", err);
        
        return {status: false}
    }
}