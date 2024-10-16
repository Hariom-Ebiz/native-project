import React, { useEffect, useState } from "react";
import Styles from "@/styles/application_form.module.css";
import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import useRequest from "@/hooks/useRequest";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createAxiosCookies, getCookies } from "@/fn";
import { IMAGEBASEURL } from "@/api";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Modal } from "react-bootstrap";
import modalStyles from "@/styles/job_description.module.css";

let isSave = false;

const ApplicationForm = () => {
    const { t } = useTranslation('common');
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
        setValue,
        watch
    } = useForm({
        defaultValues: {
            screening_answer: {}
        }
    })

    const [questions, setQuestions] = useState([]);
    const [companyDetails, setCompanyDetails] = useState({ companyName: "", logo: "" })

    const { request: questionsReq, response: questionResp } = useRequest()
    const { request: questionsAnsReq, response: questionAnsResp } = useRequest()

    const route = useRouter();

    const { request: applyReq, response: aplyRes } = useRequest()

    const [show, setShow] = useState(false);

    const [saved, setisSaved] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const { id } = route.query;

    useEffect(() => {
        questionsReq("GET", `job-seeker/job/application/questions?id=${id}`)
        questionsAnsReq("GET", `job-seeker/job/application/answers?id=${id}`)
    }, [id])

    useEffect(() => {
        if (questionResp) {            
            setQuestions(questionResp?.list?.data)
            setCompanyDetails(questionResp?.list?.companyDetails[0]);
        }
    }, [questionResp])

    useEffect(() => {
        if (questionAnsResp) {
            const { data: { defaultAns, screenAnswers } } = questionAnsResp;

            if (defaultAns) {
                setValue("salary_expectation", defaultAns.salary_expectation)
                setValue("start_immediate", defaultAns.start_immediate)
                setValue("notice_period", defaultAns.notice_period)
                setValue("team_manage_exp", defaultAns.team_manage_exp)
                setValue("eng_level", defaultAns.eng_level)
                setValue("why_you", defaultAns.why_you)
            }

            if (Array.isArray(screenAnswers)) {
                screenAnswers.forEach(sa => {
                    console.log("sa", sa);

                    setValue(`screening_answer.question_${sa.question_id}`, sa.answer)
                })
            }
        }
    }, [questionAnsResp])

    console.log("isSave : ", isSave)


    const onSubmit = (data) => {
        try {
            console.log("isSave : ", isSave)
            data.is_applied = 1;
            if (data.screening_answer) {
                data['screening_answer'] = Object.entries(data.screening_answer).map(d => {
                    return { question_id: d[0].split("_")[1], answer: d[1] }
                })
            }
            applyReq("POST", "job-seeker/job/apply", { id: id, ...data })
        } catch (err) {
            toast.error(new Error(err).message)
        }
    }

    const onSubmit2 = () => {
        try {
            setisSaved(true);
            const data = getValues();
            data.is_applied = 0;
            if (data.screening_answer) {
                data['screening_answer'] = Object.entries(data.screening_answer).map(d => {
                    return { question_id: d[0].split("_")[1], answer: d[1] }
                })
            }
            applyReq("POST", "job-seeker/job/apply", { id: id, ...data })
        } catch (err) {
            toast.error(new Error(err).message)
        }
    }

    useEffect(() => {
        if (aplyRes) {
            if (isSave) {
                isSave = false;
                toast.success(t("Job Saved successfully."))
                if (window.history.length > 1) {
                    route.back();
                } else {
                    route.push("/job-seeker/job-list")
                }
            } else {
                toast.success(t("Applied successfully."))
                handleShow();
            }

        }
    }, [aplyRes])
    return (

        <div className={Styles.main_box}>
            <div className="container">

                <div className={Styles.head} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <button className="back_arrow" style={{background: "transparent", border: "0"}} onClick={()=>route.back()}>
                        <svg
                            width="40"
                            height="40"
                            viewBox="0 0 40 40"
                            style={{ fill: "#fff" }}
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g clip-path="url(#clip0_543_19418)">
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M6.66699 20.0002C6.66699 19.0797 7.41318 18.3335 8.33366 18.3335H31.667C32.5875 18.3335 33.3337 19.0797 33.3337 20.0002C33.3337 20.9206 32.5875 21.6668 31.667 21.6668H8.33366C7.41318 21.6668 6.66699 20.9206 6.66699 20.0002Z"
                                    fill="#fff"
                                />
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M7.15515 18.8217C7.80602 18.1708 8.8613 18.1708 9.51217 18.8217L19.5122 28.8217C20.163 29.4725 20.163 30.5278 19.5122 31.1787C18.8613 31.8295 17.806 31.8295 17.1551 31.1787L7.15515 21.1787C6.50427 20.5278 6.50427 19.4725 7.15515 18.8217Z"
                                    fill="#fff"
                                />
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M19.5122 8.82165C20.163 9.47253 20.163 10.5278 19.5122 11.1787L9.51217 21.1787C8.8613 21.8295 7.80602 21.8295 7.15515 21.1787C6.50427 20.5278 6.50427 19.4725 7.15515 18.8217L17.1551 8.82165C17.806 8.17078 18.8613 8.17078 19.5122 8.82165Z"
                                    fill="#fff"
                                />
                            </g>
                            <defs>
                                <clipPath id="clip0_543_19418">
                                    <rect width="40" height="40" fill="#fff" />
                                </clipPath>
                            </defs>
                        </svg>
                    </button>
                    <h3 className={Styles.head_title}>{t("Application Form")} </h3>
                </div>
                <div className={Styles.parent_box}>
                <div className="row">
                            <div className="col-md-6">
                                <div className={Styles.team_box}>
                                    <h2 className={Styles.page_title}>{t("Screening Questions")}</h2>
                                    <p className={Styles.description_track}>{t("The Hiring Team needs your input! Please answer the following questions.")}</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                {console.log("companyDetails",companyDetails)}
                                <div className={Styles.canva_img_box}>
                                    {
                                        questions.length > 0 && questions[0].is_confidential ? (
                                            <img src="/img/confedential.png" alt="Company Logo" />
                                        ) :
                                            (
                                                <img src={companyDetails.logo ? IMAGEBASEURL + companyDetails.logo : "/img/no-image.jpg"} alt={t("Company Logo")} />
                                            )
                                    }
                                </div>
                            </div>
                        </div>
                    {/* <div className={Styles.content_box}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className={Styles.team_box}>
                                    <h2 className={Styles.page_title}>{t("Screening Questions")}</h2>
                                    <p className={Styles.description_track}>{t("The Hiring Team needs your input! Please answer the following questions.")}</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                {console.log("companyDetails",companyDetails)}
                                <div className={Styles.canva_img_box}>
                                    {
                                        questions.length > 0 && questions[0].is_confidential ? (
                                            <img src="/img/confedential.png" alt="Company Logo" />
                                        ) :
                                            (
                                                <img src={companyDetails.logo ? IMAGEBASEURL + companyDetails.logo : "/img/no-image.jpg"} alt={t("Company Logo")} />
                                            )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={Styles.content_block}>
                        <label className={Styles.lebal}>{t("What are your salary expectations?")}<span className="text-danger">*</span></label>
                        <textarea className={Styles.textarea} {...register("salary_expectation", { required: t("This field is required.") })} placeholder={t("Type anything")}></textarea>
                        {errors.salary_expectation && (
                            <span className="invalid-feedback d-block">
                                {errors.salary_expectation.message}
                            </span>
                        )}
                    </div>

                    <div className={Styles.content_block}>
                        <label className={Styles.lebal}>{t("Are you willing to start immediately?")}<span className="text-danger">*</span></label>
                        <div className="row">
                            <div className="col-md-2 col-6">
                                <div class="form-group custom_radio">
                                    <input type="radio" id="test3" {...register("start_immediate", { required: t("This field is required.") })} value={1} name="start_immediate" onChange={(e) => setValue("start_immediate", e.target.value)} checked={watch("start_immediate") == "1"} />
                                    <label for="test3">{t("Yes")}</label>
                                </div>
                                {errors.start_immediate && (
                                    <span className="invalid-feedback d-block">
                                        {errors.start_immediate.message}
                                    </span>
                                )}
                            </div>
                            
                            <div className="col-6 col-md-2">
                                <div class="form-group custom_radio">
                                    <input type="radio" id="test2" {...register("start_immediate", { required: t("This field is required.") })} value={0} name="start_immediate" onChange={(e) => setValue("start_immediate", e.target.value)} checked={watch("start_immediate") == "0"} />
                                    <label for="test2">{t("No")}</label>
                                </div>
                                {errors.start_immediate && (
                                    <span className="invalid-feedback d-block">
                                        {errors.start_immediate.message}
                                    </span>)}
                            </div>
                        </div>
                        {watch("start_immediate") == "0" && <div>
                            <div className={Styles.content_block}>
                                <label className={Styles.lebal}>{t("What is your Notice Period? (In Days)")}<span className="text-danger">*</span></label>
                                <input type="number" className={Styles.input_track} {...register("notice_period", { required: t("This field is required.") })} placeholder={t("Write answer here...")} />
                                {errors.notice_period && (
                                    <span className="invalid-feedback d-block">
                                        {errors.notice_period.message}
                                    </span>)}
                            </div>
                        </div>}
                    </div>
                    <div className={Styles.content_block}>
                        <label className={Styles.lebal}>{t("How many years of experience do you have?")}<span className="text-danger">*</span></label>
                        <input className={Styles.input_track} {...register("team_manage_exp", { required: t("This field is required.") })} placeholder={t("Write answer here...")} />
                        {errors.team_manage_exp && (
                            <span className="invalid-feedback d-block">
                                {errors.team_manage_exp.message}
                            </span>)}
                    </div>
                    <div className={Styles.content_block}>
                        <label className={Styles.lebal}>{t("What is your English Level? (C2-A2)")}<span className="text-danger">*</span></label>
                        <input className={Styles.input_track} {...register("eng_level", { required: t("This field is required.") })} />
                        {errors.eng_level && (
                            <span className="invalid-feedback d-block">
                                {errors.eng_level.message}
                            </span>)}
                    </div>
                    <div className={Styles.content_block}>
                        <label className={Styles.lebal}>{t("What makes you the ideal candidate for this position?")}</label>
                        <input className={Styles.input_track} {...register("why_you", { required: false })} placeholder={t("Write answer here...")} />
                        {errors.why_you && (
                            <span className="invalid-feedback d-block">
                                {errors.why_you.message}
                            </span>)}
                    </div> */}

                    {
                        questions.map(q => {
                            return (
                                <div className={Styles.content_block}>
                                    <label className={Styles.lebal}>{q.question} {q.is_required ? (<span className="text-danger">*</span>) : ""}</label>
                                    <input className={Styles.input_track} {...register(`screening_answer.question_${q.id}`, { required: (q.is_required == "1") ? "This field is required" : false, })} placeholder={t("Write answer here...")} />
                                    {errors[`screening_answer`] && errors.screening_answer[`question_${q.id}`] && (
                                        <span className="invalid-feedback d-block">
                                            {errors.screening_answer[`question_${q.id}`].message}
                                        </span>
                                    )}
                                </div>
                            )
                        })
                    }

                    <div className={Styles.btn_box}>
                        <button className={Styles.secondry_btn} onClick={() => { isSave = true; onSubmit2() }} >{t("Save & Apply Later")}</button>
                        <button className={Styles.primary_btn} onClick={handleSubmit(onSubmit)} >{t("Submit Application")} </button>
                    </div>
                </div>

            </div>

            {/* after apply popup */}
        <Modal
                className="successfull_popup"
                show={show}
                // onHide={handleClose}
                size="md"
                centered
            >
                {/* <Modal.Header >
                    <Modal.Title className={styles.modal_title}>
                        Send Invitation
                    </Modal.Title>
                </Modal.Header> */}
                <Modal.Body closeButton>
                  <div className={modalStyles.modal_content}>
                    <div className="icon_block">
                      <img src="/img/icon.png" alt="" />
                    </div>
                    <h3>
                      {t(`Application has been submitted successfully.`)}
                    </h3>
                  </div>
                </Modal.Body>
                <Modal.Footer className="p-4 d-flex justify-content-center">
                  <div className="d-flex w-100 gap-4 justify-content-center">
                    <Link href="/job-seeker/application-history" className={`w-40 text-center`}>
                      <button className="btn btn-primary p-3 w-auto">
                          {t("My Applications")} <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 10 20" fill="none"><path fill="#fff" fill-rule="evenodd" d="M8 3.517a1 1 0 011.62-.784l5.348 4.233a1 1 0 010 1.568l-5.347 4.233A1 1 0 018 11.983v-1.545c-.76-.043-1.484.003-2.254.218-.994.279-2.118.857-3.506 1.99a.993.993 0 01-1.129.096.962.962 0 01-.445-1.099c.415-1.5 1.425-3.141 2.808-4.412C4.69 6.114 6.244 5.241 8 5.042V3.517zm1.5 1.034v1.2a.75.75 0 01-.75.75c-1.586 0-3.066.738-4.261 1.835a8.996 8.996 0 00-1.635 2.014c.878-.552 1.695-.916 2.488-1.138 1.247-.35 2.377-.33 3.49-.207a.75.75 0 01.668.745v1.2l4.042-3.2L9.5 4.55z" clip-rule="evenodd"/></svg>
                      </button>
                    </Link>
                    <Link href="/job-seeker/job-list" className={`w-40 text-center`}>
                      <button className="btn btn-primary p-3 w-auto">
                          View More Jobs <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 10 20" fill="none"><path fill="#fff" fill-rule="evenodd" d="M8 3.517a1 1 0 011.62-.784l5.348 4.233a1 1 0 010 1.568l-5.347 4.233A1 1 0 018 11.983v-1.545c-.76-.043-1.484.003-2.254.218-.994.279-2.118.857-3.506 1.99a.993.993 0 01-1.129.096.962.962 0 01-.445-1.099c.415-1.5 1.425-3.141 2.808-4.412C4.69 6.114 6.244 5.241 8 5.042V3.517zm1.5 1.034v1.2a.75.75 0 01-.75.75c-1.586 0-3.066.738-4.261 1.835a8.996 8.996 0 00-1.635 2.014c.878-.552 1.695-.916 2.488-1.138 1.247-.35 2.377-.33 3.49-.207a.75.75 0 01.668.745v1.2l4.042-3.2L9.5 4.55z" clip-rule="evenodd"/></svg>

                      </button>
                    </Link>

                  </div>
                </Modal.Footer>
            </Modal>
        </div>

    );
};


export async function getServerSideProps(context) {
    createAxiosCookies(context);
    const { lang } = getCookies(context);
    let lang_code = "en";

    try {
        const language = JSON.parse(lang)
        console.log("lang : ", language);

        lang_code = String(language.code).toLowerCase()
    } catch (error) {
        lang_code = "en"
    }
    return {
        props: {
            isProtected: true,
            ...(await serverSideTranslations(lang_code, [
                'common',
            ])),
        }
    }
}

export default ApplicationForm;