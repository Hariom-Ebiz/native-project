const HttpError = require("../http-error");
const aptitudeModal = require("../models/aptitude");
const dateTimeFormat = require("../utils/dateTime");

exports.addQuestionsPart = async (req, res, next) => {

    const { questions, aptitude_id, part_text } = req.body;
    console.log("questions : ", typeof questions);
    
    const files = req.files;

    if (!aptitude_id) {
        return res.status(200).json({
            message: "aptitude Id is required",
            status: false
        })
    }

    let finalQuestions = [];
    try {
        finalQuestions = JSON.parse(questions);
        if (!finalQuestions || finalQuestions.length == 0) {
            return res.status(400).json({ message: 'No options were provided.', status: false });
        }
    } catch (err) {
        return res.status(400).json({ message: 'Invalid Questions Provided.', status: false });
    }

    const part_image = files.find(file => file.fieldname === 'part_image')?.path ?? "";
    const partResp = await aptitudeModal.addQuestionsPart({ aptitude_id: aptitude_id, image: part_image, text: String(part_text).trim(), created_at: dateTimeFormat(), updated_at: dateTimeFormat() })

    if (!partResp.status) {
        return res.status(200).json({
            message: "Something went wrong",
            status: false
        })
    }

    console.log("partResp", partResp);
    
    const part_id = partResp.data[0]

    try {
        for await (let [index, question] of finalQuestions.entries()) {
            console.log("q : ", question);
            
            if (!question.question || !question.options) { continue }

            const question_image = files.find(file => file.fieldname === `question_image${index}`);
            const resp = await aptitudeModal.addQuestion({ text: question.question, aptitude_id, image: question_image ? question_image.path : null, created_at: dateTimeFormat(), updated_at: dateTimeFormat(), part_id })

            if (resp.status) {
                const finalOptions = question.options.map(o => { return { ...o, question_id: resp.data[0] } })
                await aptitudeModal.addOptions(finalOptions)
            }
        }

        return res.status(200).json({
            message: "Part Added Successfully.",
            status: true
        })
    } catch (error) {
        console.log("err",error);
        
        return res.status(200).json({
            message: "Something went wrong",
            status: false
        })
    }
}

exports.updateQuestionsPart = async (req, res, next) => {
    const {id: part_id} = req.params;

    const { questions, aptitude_id, part_text } = req.body;
    const files = req.files;

    if (!aptitude_id) {
        return res.status(200).json({
            message: "aptitude Id is required",
            status: false
        })
    }

    let finalQuestions = [];
    try {
        finalQuestions = JSON.parse(questions);
        if (!finalQuestions || finalQuestions.length == 0) {
            return res.status(400).json({ message: 'No options were provided.', status: false });
        }
    } catch (err) {
        return res.status(400).json({ message: 'Invalid Questions Provided.', status: false });
    }

    const part_image = files.find(file => file.fieldname === 'part_image')?.path ?? "";
    const extras = {};
    if(part_image){
        extras.part_image = part_image
    }
    const partResp = await aptitudeModal.updateQuestionPart({"id": part_id},{ aptitude_id: aptitude_id, text: part_text, updated_at: dateTimeFormat(), ...extras })


    console.log("partResp",partResp);
    
    if (!partResp.status) {
        return res.status(200).json({
            message: "Something went wrong",
            status: false
        })
    }

    try {
        const deleteResult = await aptitudeModal.deleteQuestionsByPart(part_id)
        if(!deleteResult.status){
            return res.status(500).json({
                message: "Something went wrong",
                status: false
            })
        }
        for await (let [index, question] of finalQuestions.entries()) {
            
            if (!question.question || !question.options) { continue }
            let question_image = files.find(file => file.fieldname === `question_image${index}`)?.path ?? question.question_image ?? "";

            question_image = typeof question_image == 'object' && Object.keys(question_image).length == 0 ? "" : question_image;

            const resp = await aptitudeModal.addQuestion({ text: question.question, aptitude_id, image: question_image, created_at: dateTimeFormat(), updated_at: dateTimeFormat(), part_id })

            if (resp.status) {
                const finalOptions = question.options.map(o => { return { ...o, question_id: resp.data[0] } })
                await aptitudeModal.addOptions(finalOptions)
            }
        }

        return res.status(200).json({
            message: "Part Updated Successfully.",
            status: true
        })
    } catch (error) {
        console.log("err",error);
        
        return res.status(200).json({
            message: "Something went wrong",
            status: false
        })
    }
}

exports.updateQuestion = async (req, res, next) => {
    const { id, text } = req.body;

    let finalOptions = [];
    const files = req.files;
    console.log("files : ", files);


    const question_image = files.find(file => file.fieldname === 'question_image');

    if (req.body.options) {
        const options = JSON.parse(req.body.options);

        if (!options || options.length === 0) {
            return res.status(400).send('No options were provided.');
        }

        finalOptions = options.map((option, index) => {
            const file = files.find(file => file.fieldname === `option_image${index}`);
            return {
                text: option.text,
                is_answer: option.is_answer ?? 0,
                image: file ? file.path : option.image,
                question_id: id
            };
        });
    }

    console.log("finalOptions : ", finalOptions);

    try {
        let updateRes = await aptitudeModal.updateQuestion(
            { id },
            {
                text, image: question_image ? question_image.path : null, updated_at: dateTimeFormat()
            }
        );
        await aptitudeModal.deleteOptions({ "aptitude_questions_options.question_id": id })
        await aptitudeModal.addOptions(finalOptions)

        res.status(201).json({
            status: true,
            message: "Updated Successfully",
        });
    } catch (err) {
        console.log("error : ", err);
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not update.",
            500
        );
        return next(error);
    }
}

exports.getAllQuestions = async (req, res, next) => {
    let { page, per_page, sort_by, order, question, aptitude_id } = req.query;
    let list;

    page = page ? +page : 1;
    per_page = per_page ? +per_page : 10;
    sort_by = sort_by ?? "created_at";
    order = order ?? "desc";
    question = question ?? "";

    try {
        list = await aptitudeModal.getAllQuestions({
            match: { "aptitude_id": aptitude_id },
            page,
            per_page,
            sort_by,
            order,
            question,
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

exports.deleteQuestion = async (req, res, next) => {
    const { id } = req.body;

    try {
        const aptitudeQuestion = await aptitudeModal.getOneQuestion({ "id": id });
        await aptitudeModal.deleteQuestion({ id });
        await aptitudeModal.deleteOptions({ "aptitude_questions_options.question_id": id });

        const count = await aptitudeModal.totalQuestionsInPart(aptitudeQuestion.part_id)

        if(count.status == true && count.data[0].count == 0){
            await aptitudeModal.deletePartOnlyWithId(aptitudeQuestion.part_id)
        }
    } catch (err) {
        console.log("err : ", err);
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

// exports.calculateScore = async (req, res, next) => {
//     // const { id, answers } = req.body;
//     const currentUserId = req.userId;
//     const {question_id, option_id, type_id} = req.body;
//     try {
//         const result = await aptitudeModal.calculateScore({ question_id, option_id, type_id });
//         if (!result) {
//             const error = new HttpError(
//                 req,
//                 new Error().stack.split("at ")[1].trim(),
//                 "Could not calculate score.",
//                 500
//             );
//             return next(error);
//         }

//         // const user = await aptitudeModal.getOneUser({ "id": currentUserId });
//         // await aptitudeModal.addUserScore({ user_id: currentUserId, score: result, created_at: dateTimeFormat() });

//         // await aptitudeModal.addTestResult({
//         //     user_id: currentUserId,
//         //     test_id: id,
//         //     total_score: result
//         // })

//         res.status(201).json({
//             status: true,
//             message: "Score Calculated Successfully",
//             result
//         });
//     } catch (err) {
//         console.log("err : ", err);
//         const error = new HttpError(
//             req,
//             new Error().stack.split("at ")[1].trim(),
//             "Could not calculate score.",
//             500
//         );
//         return next(error);
//     }
// }

exports.calculateScore = async (req, res, next) => {
    const currentUserId = req.userId;
    const { question_id, option_id, type_id } = req.body;

    try {
        // Calculate the score for the current question
        const result = await aptitudeModal.calculateScore({ question_id, option_id, type_id });

        if (!result) {
            const error = new HttpError(
                req,
                new Error().stack.split("at ")[1].trim(),
                "Could not calculate score.",
                500
            );
            return next(error);
        }

        // Assuming result contains whether the answer is correct or not (e.g. result.correct)
        let scoreUpdate = result.correct ? 1 : 0; // Example logic: 1 for correct, 0 for incorrect

        // Update the user's score in the database
        await aptitudeModal.addUserScore({
            user_id: currentUserId,
            score: scoreUpdate, // Add or update score incrementally
            created_at: dateTimeFormat() // Record the time of update
        });

        // Optionally, save the test result in another table (if tracking more details)
        await aptitudeModal.addTestResult({
            user_id: currentUserId,
            question_id, // Record the current question ID
            type_id,     // Type of the aptitude question
            is_correct: result.correct, // Track whether the answer was correct
            updated_at: dateTimeFormat() // Time of this particular answer
        });

        // Return the response
        res.status(201).json({
            status: true,
            message: "Score Calculated and Saved Successfully",
            result: {
                score: scoreUpdate,
                correct: result.correct
            }
        });
    } catch (err) {
        console.log("Error while calculating and saving score: ", err);
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not calculate score.",
            500
        );
        return next(error);
    }
};


exports.updateQuestion = async (req, res, next) => {
    const { id, text } = req.body;

    let finalOptions = [];
    const files = req.files;
    console.log("files : ", files);


    const question_image = files.find(file => file.fieldname === 'question_image');

    if (req.body.options) {
        const options = JSON.parse(req.body.options);

        if (!options || options.length === 0) {
            return res.status(400).send('No options were provided.');
        }

        finalOptions = options.map((option, index) => {
            const file = files.find(file => file.fieldname === `option_image${index}`);
            return {
                text: option.text,
                is_answer: option.is_answer ?? 0,
                image: file ? file.path : option.image,
                question_id: id
            };
        });
    }

    console.log("finalOptions : ", finalOptions);

    try {
        let updateRes = await aptitudeModal.updateQuestion(
            { id },
            {
                text, image: question_image ? question_image.path : null, updated_at: dateTimeFormat()
            }
        );
        await aptitudeModal.deleteOptions({ "aptitude_questions_options.question_id": id })
        await aptitudeModal.addOptions(finalOptions)

        res.status(201).json({
            status: true,
            message: "Updated Successfully",
        });
    } catch (err) {
        console.log("error : ", err);
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not update.",
            500
        );
        return next(error);
    }
}

exports.getOnePart = async (req, res, next) => {
    const { id } = req.params;

    let results;
    try {
        results = await aptitudeModal.getOnePart({ "aqp.id": id });
        if (!results) {
            const error = new HttpError(
                req,
                new Error().stack.split("at ")[1].trim(),
                "Could not fetch.",
                422
            );
            return next(error);
        }

        const partsMap = {};

        results.forEach(row => {
            const {
                part_id, part_text, part_image,
                question_id, question_text, question_image,
                option_id, option_text, option_image, is_answer
            } = row;

            if (!partsMap[part_id]) {
                partsMap[part_id] = {
                    part_id,
                    part_text,
                    part_image,
                    questions: {}
                };
            }

            const part = partsMap[part_id];

            if (!part.questions[question_id]) {
                part.questions[question_id] = {
                    question_id,
                    question_text,
                    question_image,
                    options: []
                };
            }

            const question = part.questions[question_id];

            if (option_id) {
                question.options.push({
                    option_id,
                    option_text,
                    option_image,
                    is_answer
                });
            }
        });

        const partsArray = Object.values(partsMap).map(part => ({
            ...part,
            questions: Object.values(part.questions)
        }));

        res.status(201).json({
            status: true,
            message: "Fetched Successfully",
            result: partsArray[0],
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
}

exports.deletePart = async (req, res, next) => {
    const { id } = req.body;

    try {
        const res = await aptitudeModal.deletePart({ id })
        if (res.status) {
            res.status(201).json({
                status: true,
                message: "Deleted Successfully",
                id,
            });
        }
        else {
            res.status(201).json({
                status: false,
                message: "Something went wrong!",
                id,
            });
        }
    } catch (err) {
        console.log("err : ", err);
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not delete.",
            500
        );
        return next(error);
    }


}

exports.getOneQuestion = async (req, res, next) => {
    const { id } = req.params;

    let data;
    try {
        data = await aptitudeModal.getOneQuestion({ "id": id });
        aptitudeOptions = await aptitudeModal.getOneQuestionOptions(id);
        console.log(aptitudeOptions);
        data.options = aptitudeOptions;
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

exports.getUserAptitudeDetails = async (req, res, next) => {
    const currentUserId = req.userId;

    try {
        const data = await aptitudeModal.getUserAptitudeDetails(currentUserId);
        if (!data) {
            const error = new HttpError(
                req,
                new Error().stack.split("at ")[1].trim(),
                "Could not fetch.",
                422
            );
            return next(error);
        }

        res.status(201).json({
            status: true,
            message: "Fetched Successfully",
            data,
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
}

exports.getAptitudeQuestions = async (req, res, next) => {
    const { typeId } = req.params;
    const currentUserId = req.userId;

    try {
        const data = await aptitudeModal.getAptitudeQuestions(currentUserId, typeId)
        if (!data) {
            const error = new HttpError(
                req,
                new Error().stack.split("at ")[1].trim(),
                "Could not fetch.",
                422
            );
            return next(error);
        }

        const finalQuestions = {};

        data.forEach(d => {
            if (finalQuestions.hasOwnProperty(d.id)) {
                finalQuestions[d.id].options.push({
                    option_text: d.option_text,
                    option_image: d.option_image,
                    option_id: d.option_id
                })
            }
            else {
                finalQuestions[d.id] = {
                    question_id: d.id,
                    question_text: d.question_text,
                    question_image: d.question_image,
                    aptitude_type_name: d.aptitude_type_name,
                    options: [
                        {
                            option_text: d.option_text,
                            option_image: d.option_image,
                            option_id: d.option_id
                        }
                    ]
                };
            }
        })

        let last_test_date = null;
        if (data.length > 0) {
            last_test_date = data[0].last_test_date;
        }


        res.status(201).json({
            status: true,
            message: "Fetched Successfully",
            data: Object.values(finalQuestions),
            last_test_date: last_test_date
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not fetch.",
            422
        );
        return next(error);
    }
}

exports.getAptitudeParts = async (req, res, next) => {
    const { typeId } = req.params;
    const currentUserId = req.userId;

    try {
        const data = await aptitudeModal.getAptitudePart(currentUserId, typeId)
        if (!data) {
            const error = new HttpError(
                req,
                new Error().stack.split("at ")[1].trim(),
                "Could not fetch.",
                422
            );
            return next(error);
        }

        const partsMap = {};

        data.forEach(row => {
            // Extract data from the row
            const {
                part_id, part_text, part_image,
                question_id, question_text, question_image,
                option_id, option_text, option_image
            } = row;
        
            // Use part_id as the key to ensure uniqueness
            if (!partsMap[part_id]) {
                partsMap[part_id] = {
                    part_id,
                    part_text,
                    part_image,
                    questions: {}
                };
            }
        
            const part = partsMap[part_id];
        
            // Check if the question already exists in the questions array
            if (!part.questions[question_id]) {
                part.questions[question_id] = {
                    question_id,
                    question_text,
                    question_image,
                    options: []
                };
            }
        
            const question = part.questions[question_id];
        
            // Add the option to the options array if it exists
            if (option_id) {
                question.options.push({
                    option_id,
                    option_text,
                    option_image
                });
            }
        });

        // Convert the partsMap to an array of objects and its questions array of objects
        const partsArray = Object.values(partsMap).map(part => ({
            ...part,
            questions: Object.values(part.questions)
        }));


        let last_test_date = null;
        if (data.length > 0) {
            last_test_date = data[0].last_test_date;
        }

        let aptitude_type_name = null
        if (data.length > 0) {
            aptitude_type_name = data[0].aptitude_type_name
        }

        let aptitude_type_time = null
        if (data.length > 0) {
            aptitude_type_time = data[0].aptitude_type_time
        }


        res.status(201).json({
            status: true,
            message: "Fetched Successfully",
            data: partsArray,
            last_test_date: last_test_date,
            aptitude_type_name: aptitude_type_name,
            aptitude_type_time: aptitude_type_time
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not fetch.",
            422
        );
        return next(error);
    }
}

exports.submitAptitudeTest = async (req, res, next) => {
    const { typeId } = req.params;
    const { answers } = req.body;
    console.log("answers : ", answers);
    
    const currentUserId = req.userId;

    const totalQuestions = answers.length;
    const filterdAns = answers.filter(ans => ans != null)

    try {
        let total_points = 0;
        let data = { totalRightQuestions: 0 }
        if (filterdAns.length > 0) {
            data = await aptitudeModal.submitAptitudeTest(filterdAns);
            if (!data) {
                const error = new HttpError(
                    req,
                    new Error().stack.split("at ")[1].trim(),
                    "Could not fetch.",
                    422
                );
                return next(error);
            }
            total_points = data.totalRightQuestions;
        }


        const resp = await aptitudeModal.addTestResult({
            user_id: currentUserId,
            aptitude_type: typeId,
            right_questions: total_points,
            total_questions: totalQuestions,
            wrong_questions: totalQuestions - total_points,
            created_at: dateTimeFormat(),
            updated_at: dateTimeFormat()
        })

        if (resp.status) {
            return res.status(200).json({
                message: "Submited Successfully.",
                status: true,
                data
            })
        } else {
            return res.status(200).json({
                message: "Something went wrong",
                status: false
            })
        }
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            req,
            new Error().stack.split("at ")[1].trim(),
            "Could not fetch.",
            422
        );
        return next(error);
    }
}

exports.getUserAptitudeTests = async (req, res, next) => {
    let { page, per_page, sort_by, order } = req.query;
    const currentUserId = req.query.seeker_id || req.userId;
    let list;

    page = page ? +page : 1;
    per_page = per_page ? +per_page : 10;
    sort_by = sort_by ?? "created_at";
    order = order ?? "desc";

    try {
        list = await aptitudeModal.getUserAptitudeTests({
            match: { "user_id": currentUserId },
            page,
            per_page,
            sort_by,
            order,
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
        list: Array.isArray(list?.data) ? list.data.sort((a,b)=> (a.aptitude_type_id < b.aptitude_type_id)) : list.data,
        totalDocuments: list?.totalDocuments,
    });
}