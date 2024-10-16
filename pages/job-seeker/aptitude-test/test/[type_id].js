import React, { useEffect, useRef, useState } from "react";
import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import styles from "@/styles/aptitude_test.module.css"
import { createAxiosCookies, getCookies } from "@/fn";

import { API } from "@/api";

import useRequest from "@/hooks/useRequest";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'


const AptitudeTest2 = ({ type_id }) => {


    const { t } = useTranslation('common');
    const router = useRouter();
    const completeModalCloseRef = useRef()
    const completeModalOpenRef = useRef();
    const [partNumber, setPartNumber] = useState(0);
    const [parts, setParts] = useState([])
    const [isPartCompleted, setIsPartCompleted] = useState({})
    const [answers, setAnswer] = useState({})
    const [score, setScore] = useState(0);
    const [isSubmited, setIsSubmited] = useState(false);
    const [aptitudeType, setAptitudeType] = useState("");

    const { request: requestAptitudeParts, response: responseAptitudeParts } = useRequest();
    const { request: requestSubmitTest, response: responseSubmitTest } = useRequest();

    const [time, setTime] = useState(20 * 60 + 0);
    const [totalTime, setTotalTime] = useState(0)
    let timerId;

    useEffect(() => {
        if (time > 0) {
            timerId = setTimeout(() => {
                setTime(time - 1);
            }, 1000);

            return () => clearTimeout(timerId);
        } else {
            handleTimerEnd();
        }
    }, [time]);

    const handleTimerEnd = () => {
        console.log("answers", answers)
        requestSubmitTest("post", `aptitude/user/submit/${type_id}`, { answers: Object.values(answers).length > 0 ? Object.values(answers) : [] })
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };



    useEffect(() => {
        requestAptitudeParts("get", `aptitude/user/parts/${type_id}`)
    }, [])

    useEffect(() => {
        if (responseAptitudeParts) {
            setParts(responseAptitudeParts.data)


            if (responseAptitudeParts.data.length == 0) {
                router.push("/job-seeker/aptitude-test")
            }
            else {
                setAptitudeType(responseAptitudeParts.aptitude_type_name)
                setTime(responseAptitudeParts.aptitude_type_time * 60)
                setTotalTime(responseAptitudeParts.aptitude_type_time * 60)
            }

            if (responseAptitudeParts.last_test_date) {
                const last_test_date = new Date(responseAptitudeParts.last_test_date)
                const next_test_date = new Date(new Date(last_test_date).setMonth(last_test_date.getMonth() + 6)).getTime()

                if (next_test_date > new Date().getTime()) {
                    router.push("/job-seeker/my-profile")
                    return;
                }
            }
        }
    }, [responseAptitudeParts])

    const handleNextButtonClick = () => {
        if (partNumber + 1 < parts.length) {
            setPartNumber(partNumber + 1);
        }
    }

    const handleSubmitButtonClick = () => {
        console.log("answers", answers);
        requestSubmitTest("post", `aptitude/user/submit/${type_id}`, { answers: Object.values(answers) })
    }

    useEffect(() => {
        if (responseSubmitTest) {
            const { data, message, status } = responseSubmitTest;
            if (!status) {
                return;
            }

            const totalQuestions = parts.reduce((total, p) => {
                total += p.questions.length;
                return total;
            }, 0)

            setIsSubmited(true);
            setScore(Math.round((data.totalRightQuestions / (totalQuestions || 1)) * 100))

            completeModalOpenRef?.current?.click();
            // router.replace("/job-seeker/aptitude-test?fromResult=true")
        }
    }, [responseSubmitTest])

    const handleSelectAnswer = (partNumber, question_id, option_id) => {
        setAnswer(prev => {
            const newAns = { ...prev };
            newAns
            newAns[question_id] = {
                option_id: option_id,
                question_id: question_id
            }

            setIsPartCompleted(prev => {
                const newVal = { ...prev };
                const questions_ids = parts[partNumber].questions.map(q => q.question_id)
                newVal[partNumber] = questions_ids.every(question_id => newAns.hasOwnProperty(question_id))
                return newVal;
            })

            return newAns;
        })
    }

    // const isPartCompleted = (parts, partNumber) =>{
    //     const questions_ids = parts[partNumber].questions.map(q => q.question_id)
    //     return questions_ids.every(question_id => answers.hasOwnProperty(question_id))
    // }


    const handleProfileButtonClick = () => {
        completeModalCloseRef?.current?.click()
        router.push("/job-seeker/my-profile?scrollTill=aptitudeAnalysis")
    }

    return (
        <>
            <button style={{ border: "0", padding: "0" }} data-bs-toggle="modal" data-bs-target="#test_complete_modal" ref={completeModalOpenRef}></button>

            <JobSeekerAuth data={{ title: "Aptitude Assesment" }} />
            <div className="page_container">
                <div className="main_content" id="body_lang_css">
                    <div className={styles.page_head} style={{ marginBottom: "0px" }}>
                        <h2 className={styles.page_title}>{aptitudeType}</h2>
                        {
                            partNumber != parts.length - 1 &&
                            <button className={styles.next_btn} onClick={handleNextButtonClick} disabled={!isPartCompleted[partNumber]} style={{ backgroundColor: !isPartCompleted[partNumber] ? "gray" : "#5FA9C0" }}>{t("next")}</button>
                        }
                        {
                            partNumber == parts.length - 1 && !isSubmited &&
                            <button className={styles.next_btn} disabled={!isPartCompleted[partNumber]} style={{ backgroundColor: !isPartCompleted[partNumber] ? "gray" : "#5FA9C0" }} onClick={handleSubmitButtonClick}>{t("submit")}</button>
                        }
                        {
                            partNumber == parts.length - 1 && isSubmited &&
                            <button className={styles.next_btn} disabled={!isPartCompleted[partNumber]} onClick={() => router.push("/job-seeker/my-profile?scrollTill=aptitudeAnalysis")}>{t("go to profile")}</button>
                        }
                    </div>
                    <svg width="100%" height="5" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100%" height="5" fill="#E5F6FB" rx="3" ry="3" />
                        <rect width={((partNumber + 1) / (parts.length || 1)) * 100 + "%"} height="5" fill="#5FA9C0" rx="3" ry="3" />
                    </svg>
                    <div className={styles.question_inner_box}>
                        <p className={styles.question_title}>

                            <span className={styles.question_sub_title}>
                                {parts.length > partNumber && parts[partNumber].part_text ? t("Part") : t("Question")} {partNumber + 1}
                            </span> {" "}
                            {t("of")} {parts.length}</p>
                        <p className={styles.question_time}>
                            {/* <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="1" y="1" width="31" height="31" rx="15.5" fill="white" stroke="#2A3858" stroke-width="2" />
                                <path d="M16.557 18.306L16.85 1.41122L24.2707 3.12578L29.184 7.13669L16.557 18.306Z" fill="#2A3858" />
                            </svg> */}


                            <div className="Datapercent">
                                <div className="percent">
                                    <svg viewBox="0 0 100 100" className="circle">
                                        <circle cx="50" cy="50" r="45"></circle>
                                        <circle cx="50" cy="50" r="45" className="progress" style={{ '--percent': Math.round(((totalTime - time) / totalTime) * 100) }}></circle>
                                    </svg>

                                </div>
                            </div>
                            {formatTime(time)}
                        </p>
                    </div>

                    <div className={`${styles.question_inner_block}`}>
                        {
                            parts.length > partNumber && parts[partNumber].part_text && <p className={styles.question_inner_track} style={{ alignItems: "flex-start" }}>
                                <span className={styles.question_icon} >
                                    P
                                </span>
                                {parts.length > partNumber && <p dangerouslySetInnerHTML={{ __html: parts[partNumber].part_text.replace(/\n/g, "<br />") }}></p>}
                                {/* {parts.length > partNumber && parts[partNumber].part_text} */}
                            </p>
                        }
                        {parts.length > partNumber && parts[partNumber].part_image && <div className={`${styles.question_ans_box} ${styles.question_img_block}`}>
                            <div className={styles.question_img_track} style={{ margin: parts.length > partNumber && parts[partNumber].part_image ? "auto" : "0px" }}>
                                <img src={parts.length > partNumber && parts[partNumber].part_image && API + "/" + parts[partNumber].part_image} />
                            </div>
                        </div>}
                    </div>
                    {parts.length > partNumber && parts[partNumber].questions?.map((question, index) => {
                        return <div className={`${styles.question_inner_block}`}>
                            <p className={styles.question_inner_track} style={{ alignItems: "flex-start" }}>

                                <span className={styles.question_icon}>
                                    Q
                                </span>
                                <div className="d-flex flex-column">
                                    Question {index + 1} of {parts[partNumber].questions.length}
                                    {question.question_text && <p dangerouslySetInnerHTML={{ __html: question.question_text.replace(/\n/g, "<br />") }}></p>}
                                </div>
                            </p>

                            <div className={`${styles.question_ans_box} ${styles.question_img_block}`} style={{ paddingTop: "0px" }}>
                                {parts.length > partNumber && question.question_image && <div className={styles.question_img_track} style={{ margin: parts.length > partNumber && question.question_image ? "auto" : "0px" }}>
                                    <img src={parts.length > partNumber && question.question_image && API + "/" + question.question_image} />
                                </div>}




                                {/* vertical question add this class  ${styles.question_track} */}

                                <div className={`${styles.question_img_box} ${styles.question_track}`} style={{ marginTop: "10px" }}>
                                    {parts.length > partNumber && question.options?.map((option, i) => {
                                        return <div className={styles.ans_list_main}>
                                            <input type="radio" name={`question_${question.question_id}_option[]`} className={styles.ans_checkbox} id={`option${option.option_id}`} onChange={() => handleSelectAnswer(partNumber, question.question_id, option.option_id)} checked={answers[question.question_id]?.option_id == option.option_id} />

                                            <label className={styles.ans_label} for={`option${option.option_id}`}>
                                                <span className={styles.question_number}>{String.fromCharCode(64 + i + 1)}</span>
                                                <span className={styles.ans_track} style={{ textTransform: "capitalize" }}>{option.option_text}</span>
                                            </label>
                                        </div>
                                    })}
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            </div>


            {/* -------------Modal---------------  */}
            <div className="modal fade successfull_popup" id="test_complete_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <button type="button" data-bs-dismiss="modal" aria-label="Close" style={{ background: "transparent", border: "0" }} ref={completeModalCloseRef}></button>
                <div className={`modal-dialog modal-dialog-centered ${styles.modal_dialog}`}>
                    <div className="modal-content">
                        <div className={`modal-body ${styles.modal_box}`}>
                            <div className={styles.test_complete_box}>
                                <div className={styles.icon_box}>
                                    <svg width="116" height="115" viewBox="0 0 116 115" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="57.9999" cy="57.6134" r="57.0353" fill="#5FA9C0" />
                                        <path d="M80.1167 48.4185L54.9778 73.5575C54.0635 74.4739 52.8242 74.9921 51.5297 74.9993C51.5181 74.9993 51.5066 75 51.4951 75C51.4836 75 51.472 74.9993 51.4604 74.9992C51.3509 74.9982 51.2414 74.9936 51.1322 74.9853C51.0455 74.9791 50.9588 74.9705 50.8721 74.9594C50.7657 74.9463 50.6598 74.9298 50.5545 74.9099C50.5452 74.908 50.5359 74.9056 50.5266 74.9039C50.4178 74.8818 50.3097 74.8561 50.2026 74.8269C50.0965 74.7984 49.9913 74.7664 49.8873 74.7309C49.8801 74.7284 49.8729 74.7264 49.8657 74.7239C49.8513 74.7189 49.8371 74.713 49.8228 74.7078C49.6107 74.6317 49.4042 74.5411 49.2046 74.4365C49.1043 74.3833 49.0058 74.3265 48.9094 74.2664C48.7272 74.1543 48.5525 74.0305 48.3865 73.8955C48.322 73.843 48.2585 73.7885 48.1961 73.7322C48.1337 73.6758 48.0725 73.6176 48.0124 73.5575L35.4425 60.9881C34.5189 60.0645 34 58.8117 34 57.5055C34 56.1992 34.5189 54.9465 35.4426 54.0229C36.3662 53.0992 37.619 52.5803 38.9252 52.5803C40.2314 52.5803 41.4842 53.0993 42.4078 54.0229L51.4948 63.1098L73.1514 41.4531C73.6082 40.9935 74.1513 40.6286 74.7495 40.3792C75.3476 40.1298 75.9891 40.001 76.6372 40C77.2852 39.999 77.9271 40.1259 78.526 40.3735C79.1249 40.621 79.6691 40.9844 80.1273 41.4426C80.5856 41.9008 80.9489 42.445 81.1964 43.0439C81.4439 43.6428 81.5709 44.2847 81.5699 44.9328C81.5689 45.5808 81.44 46.2223 81.1906 46.8205C80.9413 47.4186 80.5763 47.9617 80.1167 48.4185Z" fill="white" />
                                    </svg>
                                </div>
                                <h2 className={styles.modal_title}>{t("Assessment Completed")}</h2>
                                <p className={styles.modal_description}>{t("Your Assessment has been completed.")}</p>

                                <div className={styles.score_box}>
                                    <span className={styles.score_track}>{t("Your Score")} </span>
                                    <span className={styles.score_track}>{Math.ceil(score)}%</span>
                                </div>
                                <p className={styles.add_results}>{t("Results are added to Profile")}</p>
                                <div className={styles.btn_box}>
                                    <Link data-dismiss="modal" aria-label="Close" href={"/job-seeker/my-profile?scrollTill=aptitudeAnalysis"} className={`post_btn ${styles.pay_now}`}>{t("Go to Profile")}</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export async function getServerSideProps(context) {
    createAxiosCookies(context);
    const { lang } = getCookies(context);
    let lang_code = "en";

    try {
        const language = JSON.parse(lang)
        lang_code = String(language.code).toLowerCase()
    } catch (error) {
        lang_code = "en"
    }
    const type_id = context.params.type_id;
    return {
        props: {
            type_id: type_id,
            isProtected: true,
            ...(await serverSideTranslations(lang_code, [
                'common',
            ])),
        }
    }
}

export default AptitudeTest2;
