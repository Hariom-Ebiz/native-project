const Schedule = require("node-cron");
const { getExpiredJobs, updateMany } = require("../models/employer_job_post");
const { updateExpiry, getHighestDurationPlan } = require("../models/employerSubscriber");
const moment = require("moment")
const Notification = require("../utils/notification");
const { emailSend, emailSendIndividually } = require("../utils/helper");
const EmailTemplate = require("../models/emailTemplate");
const { updateCandidateSubsExpiry, getComingExpiration } = require("../models/candidate_subscriber");

// Job are closing if date is passed

const job = Schedule.schedule("0 1 * * *", async () => {
    console.log("****Start Job Close****");
    const jobs = await getExpiredJobs();
    let ids = []; 
    for await (const i of jobs.data) {
        ids.push(i.id)
    }

    await updateMany(ids, {"is_under_review": 1})
    console.log("****End Job Close****");
})

// expiring plan if end date is passed

const expirePlan = Schedule.schedule("0 1 * * *", async () => {
    console.log("******Plan Expiration Job Start******")

    try {
        
        await updateExpiry();

        await updateCandidateSubsExpiry();

    } catch (error) {
        console.log(">>>err", error);
    }

    console.log("******Plan Expiration Job End******")
})

// notifications for remainiing date of current plan

const getSubscribedPlans = Schedule.schedule("30 1 * * *", async () => {
    console.log("******Plan expiration reminder Job Start******")
    try {
        
        const plan = await getHighestDurationPlan();
        const notification = new Notification("subscription_remaining","0");
        let emailTemplate = await EmailTemplate.getOne({ name: "employer subscription reminder" });

        for await (const i of plan.result) {
            let remaining = moment(new Date(i.end)).diff(moment(new Date()), "days");
            let str = remaining > 0 ? `in ${remaining} day(s)` : "Today";

            await notification.formatTemplate({SUBSCRIPTION_NAME: i.title, REMAINING: str})
            await notification.sendNotification([i.employer_id], "/employer/my-membership");

            if (emailTemplate) {
                let message = emailTemplate.body;
                message = message.replace(/\{NAME\}/g, i.company_name);
                message = message.replace(/\{CONTACT_US_URL\}/g, process.env.FRONTEND_EMPLOYER_URL+"/employer/contact-us");
                message = message.replace(/\{RENEWEL_LINK\}/g, process.env.FRONTEND_EMPLOYER_URL+"/employer/expansion-renewal");
                message = message.replace(/\{EMPLOYER_URL\}/g, process.env.FRONTEND_EMPLOYER_URL);
                message = message.replace(/\{EXPIRATION_DATE\}/g, moment(new Date(i.end)).format("DD MMM, YYYY"));
            
                let subject = emailTemplate.subject;
                subject = subject.replace(/\{EXPIRATION_DATE\}/g, moment(new Date(i.end)).format("DD MMM, YYYY"))
                
                emailSendIndividually(i.email, subject, message, {
                    mailSend: 1,
                });
            }
        }
        
    } catch (error) {
        console.log(">>>err", error);
    }

    console.log("******Plan expiration reminder Job End******")
})

// notifications for remainiing date of current plan

const sendReminderaztocandidate = Schedule.schedule("15 1 * * *", async () => {
    console.log("******Plan expiration reminder Job Start******")
    try {
        
        const plan = await getComingExpiration();
        const notification = new Notification("candidate_subscription_remaining","0");
        let emailTemplate = await EmailTemplate.getOne({ name: "candidate subscription reminder" });

        for await (const i of plan.result) {
            let remaining = moment(new Date(i.end)).diff(moment(new Date()), "days");
            let str = remaining > 0 ? `in ${remaining} day(s)` : "Today";

            await notification.formatTemplate({SUBSCRIPTION_NAME: i.title, REMAINING: str})
            await notification.sendNotification([i.job_seeker_id], "/job-seeker/my-membership");

            if (emailTemplate) {
                let message = emailTemplate.body;
                message = message.replace(/\{NAME\}/g, i.first_name);
                message = message.replace(/\{CONTACT_US_URL\}/g, process.env.FRONTEND_CANDIDATE_URL+"/contact-us");
                message = message.replace(/\{RENEWEL_LINK\}/g, process.env.FRONTEND_CANDIDATE_URL+"/job-seeker/expansion-renewal");
                message = message.replace(/\{EXPIRATION_DATE\}/g, moment(new Date(i.end)).format("DD MMM, YYYY"));
            
                let subject = emailTemplate.subject;
                subject = subject.replace(/\{EXPIRATION_DATE\}/g, moment(new Date(i.end)).format("DD MMM, YYYY"))
                
                emailSendIndividually(i.email, subject, message, {
                    mailSend: 1,
                });
            }
        }
        
    } catch (error) {
        console.log(">>>err", error);
    }

    console.log("******Plan expiration reminder Job End******")
})

job.start();

expirePlan.start();

getSubscribedPlans.start();

sendReminderaztocandidate.start();