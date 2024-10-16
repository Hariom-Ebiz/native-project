const moment = require("moment")
exports.getCandidateDashboardDetails = async (user_id) => {
    console.log("user_id : ", user_id);
    try{
        const jobData = {};
        const jobCountData =  await DB("job_seeker_applied_jobs").select(
            "job_seeker_applied_jobs.id","job_seeker_applied_jobs.created_at", "job_seeker_applied_jobs.shortlisted","job_seeker_applied_jobs.interviewd","job_seeker_applied_jobs.selected","job_seeker_applied_jobs.rejected","job_seeker_applied_jobs.is_applied","job_seeker_applied_jobs.is_hold","employer_job_posts.title","employer_job_posts.area","countries.name as country_name","employer_job_posts.title","cities.name as city_name", "areas.name as area_name", "employer_job_posts.other_area", "job_types.name as job_type",
            DB.raw('(SELECT COUNT(*) FROM job_seeker_applied_jobs WHERE job_seeker_applied_jobs.is_applied = 0 AND job_seeker_applied_jobs.job_seeker_id = ?) as totalSavedJobs', [user_id]),
            DB.raw('(SELECT COUNT(*) FROM job_seeker_applied_jobs WHERE job_seeker_applied_jobs.is_applied = 1 AND job_seeker_applied_jobs.job_seeker_id = ?) as totalAppliedJobs', [user_id])
          )
        .where("job_seeker_applied_jobs.job_seeker_id","=",user_id)
        .leftJoin("employer_job_posts", "job_seeker_applied_jobs.job_id", "=", "employer_job_posts.id")
        .leftJoin("countries", 'employer_job_posts.country', "=", "countries.id")
        .leftJoin("cities", 'employer_job_posts.city', "=", "cities.id")
        .leftJoin("areas", 'employer_job_posts.area', "=", "areas.id")
        .leftJoin("job_types", 'employer_job_posts.job_type', "=", "job_types.id")
        .orderBy("job_seeker_applied_jobs.id", "desc")
        .groupBy("job_seeker_applied_jobs.id")

        jobData.totalAppliedJobs = jobCountData.length > 0 ? jobCountData[0].totalAppliedJobs : 0;
        jobData.totalSavedJobs = jobCountData.length > 0 ? jobCountData[0].totalSavedJobs : 0;
        jobData.totalJobs = jobCountData.length;
        jobData.latestAppliedJobs = jobCountData.slice(0,10);


        const courseData = await DB("lesson_progress")
        .select(
            DB.raw("COUNT(CASE WHEN lesson_progress.is_completed = 0 THEN 1 END) as inCompltedLessonsCount"),
            DB.raw("COUNT(CASE WHEN lesson_progress.is_completed = 1 THEN 1 END) as completedLessonsCount"),
            'courses.id', "courses.title as course_name","courses.image",
            DB.raw("COUNT(lessons.id) as totalCourseLesson"),
            DB.raw("MIN(lesson_progress.created_at) as courseStartDate")
        )
        .where("lesson_progress.user_id", "=", user_id)
        .leftJoin("courses", "lesson_progress.course_id","=", "courses.id")
        .leftJoin("lessons", "courses.id","=", "lessons.course_id")
        .groupBy("lesson_progress.course_id")

        
        const finalCourseData = {};

        let totalCompletedCourses = 0;
        let totalIncompltedCourses = 0;
        courseData.forEach(c => {
            if(c.totalCourseLesson <= c.completedLessonsCount) totalCompletedCourses++;
            else totalIncompltedCourses++;
        })

        finalCourseData.totalCompletedCourses = totalCompletedCourses;
        finalCourseData.totalIncompltedCourses = totalIncompltedCourses;
        finalCourseData.totalCourses = courseData.length;
        finalCourseData.courseData = courseData.slice(0,10);


        return {
            jobData: jobData,
            courseData: finalCourseData,
            status: true
        }
    } catch(err){
        console.log("err", err)
        return {
            status: false
        }
    }
}


exports.getAllCandidateDashboardCourseData = async (user_id, pagination) => {
    console.log("user_id : ", user_id);
    try{
        const courseData = await DB("lesson_progress")
        .select(
            DB.raw("COUNT(CASE WHEN lesson_progress.is_completed = 0 THEN 1 END) as inCompltedLessonsCount"),
            DB.raw("COUNT(CASE WHEN lesson_progress.is_completed = 1 THEN 1 END) as completedLessonsCount"),
            'courses.id', "courses.title as course_name","courses.image",
            DB.raw("COUNT(lessons.id) as totalCourseLesson"),
            DB.raw("MIN(lesson_progress.created_at) as courseStartDate")
        )
        .where("lesson_progress.user_id", "=", user_id)
        .leftJoin("courses", "lesson_progress.course_id","=", "courses.id")
        .leftJoin("lessons", "courses.id","=", "lessons.course_id")
        .groupBy("lesson_progress.course_id")

        
        const finalCourseData = {};

        let totalCompletedCourses = 0;
        let totalIncompltedCourses = 0;
        courseData.forEach(c => {
            if(c.totalCourseLesson <= c.completedLessonsCount) totalCompletedCourses++;
            else totalIncompltedCourses++;
        })

        finalCourseData.totalCompletedCourses = totalCompletedCourses;
        finalCourseData.totalIncompltedCourses = totalIncompltedCourses;

        
        const skipped = ((pagination?.page - 1) * pagination?.per_page || 0);   
        finalCourseData.courseData = courseData.slice(skipped, skipped + (pagination?.per_page || 100)+1);

        return {
            courseData: finalCourseData,
            status: true
        }
    } catch(err){
        console.log("err", err)
        return {
            status: false
        }
    }
}

exports.getAllCandidateDashboardJobData = async (user_id,pagination) => {
    console.log("user_id : ", user_id);
    try{
        const jobData = {};
        const jobCountData =  await DB("job_seeker_applied_jobs").select(
            "job_seeker_applied_jobs.id","job_seeker_applied_jobs.created_at", "job_seeker_applied_jobs.shortlisted","job_seeker_applied_jobs.interviewd","job_seeker_applied_jobs.selected","job_seeker_applied_jobs.rejected","job_seeker_applied_jobs.is_applied","job_seeker_applied_jobs.is_hold","employer_job_posts.title","employer_job_posts.area","countries.name as country_name","employer_job_posts.title","cities.name as city_name", "areas.name as area_name", "employer_job_posts.other_area", "job_types.name as job_type",
            DB.raw('(SELECT COUNT(*) FROM job_seeker_applied_jobs WHERE job_seeker_applied_jobs.is_applied = 0 AND job_seeker_applied_jobs.job_seeker_id = ?) as totalSavedJobs', [user_id]),
            DB.raw('(SELECT COUNT(*) FROM job_seeker_applied_jobs WHERE job_seeker_applied_jobs.is_applied = 1 AND job_seeker_applied_jobs.job_seeker_id = ?) as totalAppliedJobs', [user_id])
          )
        .where("job_seeker_applied_jobs.job_seeker_id","=",user_id)
        .leftJoin("employer_job_posts", "job_seeker_applied_jobs.job_id", "=", "employer_job_posts.id")
        .leftJoin("countries", 'employer_job_posts.country', "=", "countries.id")
        .leftJoin("cities", 'employer_job_posts.city', "=", "cities.id")
        .leftJoin("areas", 'employer_job_posts.area', "=", "areas.id")
        .leftJoin("job_types", 'employer_job_posts.job_type', "=", "job_types.id")
        .orderBy("job_seeker_applied_jobs.id", "desc")
        .groupBy("job_seeker_applied_jobs.id")

        jobData.totalAppliedJobs = jobCountData.length > 0 ? jobCountData[0].totalAppliedJobs : 0;
        jobData.totalSavedJobs = jobCountData.length > 0 ? jobCountData[0].totalSavedJobs : 0;

        const skipped = ((pagination?.page - 1) * pagination?.per_page || 0);   
        jobData.latestAppliedJobs = jobCountData.slice(skipped, skipped + (pagination?.per_page || 100)+1);

        return {
            jobData: jobData,
            status: true
        }
    } catch(err){
        console.log("err", err)
        return {
            status: false
        }
    }
}

exports.getEmployerDashboardDetails = async (user_id, from_date, to_date) => {
    try{
        const query = DB("employer_job_posts as ejp")
        .select("*","ejp.id as id", "jsaj.id as jsaj_id", "eaa.id as eaa_id", "eaa.created_at as eaa_created_at","jsaj.job_seeker_id as job_seeker_id")
        .leftJoin("job_seeker_applied_jobs as jsaj", function (){
            this.on("ejp.id", "=", "jsaj.job_id")
            .andOn("jsaj.is_applied", "=", 1)
        })
        .leftJoin("employer_applicant_actions as eaa", "jsaj.job_seeker_id", "=", "eaa.job_seeker_id")
        .where("ejp.employer_id","=", user_id)
        .andWhere("ejp.is_posted", "=", 1)
        // pleaes dont add .andWhere for is_active, is_delete, is_under_review,is_hired, otherwise you don't get data right, becuase suppose if a user closed a job but he hired a person then using is_hired will remove it from list and computing can be wrong.
        
        if (from_date) {
            query.andWhere("ejp.posted_on", ">=", from_date);
        }
        if (to_date) {
            query.andWhere("ejp.posted_on", "<", moment(to_date).add(1,"day").format("YYYY-MM-DD"));
        }

        const data = await query;

        const dataFindings = {
            totalCandidatesToReview: 0,
            totalHiredCandidates: 0,
            totalUnlockedCVAnyTime: 0,
            totalVacancies: 0,
            totalCandidates: 0,
            totalUnlocked: 0,
            totalShortlisted: 0,
            totalInterviewed: 0,
        };

        const jobStatusSummeryData = {
            totalJobs: 0,
            savedJobs: 0,
            openJobs: 0,
            underReview: 0,
            hired: 0,
            closed: 0
        }

        if(Array.isArray(data)){
            const usedJobs = {}
            const alreadyUsedJob = {};
            data.forEach(d => {         
                // just because we didn't put and groupBy and added joins then a same user for same job can come multiple time so this condition will help to remove it from result.
                if(!alreadyUsedJob.hasOwnProperty(d.id + "_" + d.job_seeker_id)){
                    if(d.id && d.is_active == 1 && d.is_delete == 0 && !usedJobs.hasOwnProperty(d.id)){                    
                        dataFindings.totalVacancies += d.vacancies;
                        usedJobs[d.id] = true;
                    }

                    dataFindings.totalCandidatesToReview += d.is_read == 0 ? 1 : 0;
                    dataFindings.totalHiredCandidates += d.selected == 1 ? 1 : 0;
                    dataFindings.totalUnlockedCVAnyTime += d.unlock_profile == 1 ? 1 : 0;
                    dataFindings.totalCandidates += d.jsaj_id ? 1 : 0;
                    dataFindings.totalShortlisted += d.shortlisted == 1 ? 1 : 0;
                    dataFindings.totalInterviewed += d.interviewd == 1 ? 1 : 0;
    
                    if(d.eaa_created_at && new Date(d.eaa_created_at) >= new Date(from_date) && new Date(d.eaa_created_at) < new Date(to_date)){
                        dataFindings.totalUnlocked += d.unlock_profile == 1 ? 1 : 0;
                    }
    
                    alreadyUsedJob[d.id + "_" + d.job_seeker_id] = true;
                }       
            })

            jobStatusSummeryData.openJobs =  Object.keys(usedJobs).length

        }

        const ejpData = await DB("employer_job_posts as ejp")
        .andWhere("ejp.created_at", ">=", from_date)
        .andWhere("ejp.created_at", "<", to_date)

        if(Array.isArray(ejpData)){
            ejpData.forEach(d => {
                jobStatusSummeryData.savedJobs += !d.is_posted;
                jobStatusSummeryData.hired += d.is_hired;
                jobStatusSummeryData.closed += !d.is_active;
            })
            jobStatusSummeryData.totalJobs = ejpData.length;
        }

        const categoriesData = await DB("job_categories")
        .select("job_categories.id", "job_categories.name")
        .select(
            DB.raw('COUNT(ejp.id) as count')
        )
        .leftJoin("employer_job_posts as ejp", function (){
            this.on("job_categories.id", "ejp.job_category")
            .andOn('ejp.is_posted', '=', 1)
            .andOn('ejp.is_delete', '=', 0)
            .andOn('ejp.is_active', '=', 1)
            .andOn("ejp.is_hired", "=", 0)
            .andOn('ejp.employer_id', '=', user_id)
            .andOn(DB.raw('ejp.created_at >= ?', [from_date]))
            .andOn(DB.raw('ejp.created_at < ?', [to_date]));
        })
        .groupBy('job_categories.id', 'job_categories.name')
    
        return {data: {...dataFindings, categories: categoriesData, jobSummery: jobStatusSummeryData}, status: true}
    } catch(err){
        console.log("err",err);
        return {data: null, status: false}
    }
}