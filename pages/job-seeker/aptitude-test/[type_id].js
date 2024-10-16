import React from "react";
import EmployerAuth from "@/components/layout/EmployerAuth";
import styles from "../../../styles/logical-aptitude-test.module.css";
import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import { createAxiosCookies, getCookies } from "@/fn";
import { useRouter } from "next/navigation";

import { useTranslation } from "react-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'


const Instructions = ({ type_id }) => {
    const router = useRouter();

    const tests = [
        "Logical",
        "Numerical",
        "Verbal",
        "Situational"
    ]

    const descriptions = [
        "A logical reasoning test is an assessment that measures your ability to interpret information, apply logic to solve problems and draw relevant conclusions. The test is timed and in a multiple-choice format.",
        "A numerical reasoning test is used to assess a candidate's ability to handle and interpret numerical data. You will be required to analyse and draw conclusions from the data, which may be presented in the form of tables or graphs.",
        "Verbal reasoning tests reveal how well you can analyse written information. Usually, the format is a short passage of text followed by true, false and cannot say questions. They're designed to assess your ability to understand what you've read, think constructively and reach accurate conclusions.",
        "The Reasoning Test-R evaluates cognitive abilities like logical thinking, numerical analysis, verbal communication that is required to perform in a professional environment. It is particularly useful for roles requiring good analytical skills or in a complex work environment."
    ]

    return (
        <>
            <JobSeekerAuth data={{ title: "Aptitude Assesment" }} />
            <div className="page_container">
                <div className="main_content" id="body_lang_css">
                    <div className={styles.main_box}>
                        <h2 className={styles.page_title}>What is a {tests[type_id - 1]} reasoning test?</h2>
                        <p className={styles.page_des}>
                            {descriptions[type_id - 1]}
                        </p>


                        <div className={styles.logical_reasoning_inner}>
                            <h3 className={styles.section_title}>Tips for {tests[type_id - 1]} reasoning test</h3>

                            <div className={styles.ans_label}>
                                <span className={styles.question_number}>1</span>
                                <p className={styles.logical_reasoning_items}>Practice before the test</p>
                            </div>

                            <div className={styles.ans_label}>
                                <span className={styles.question_number}>2</span>
                                <p className={styles.logical_reasoning_items}>Prior the start button, make sure you are comfortable, not distracted by mobile, friends or others</p>
                            </div>

                            <div className={styles.ans_label}>
                                <span className={styles.question_number}>3</span>
                                <p className={styles.logical_reasoning_items}>Bring a pencil and a white paper just in case</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.btn_track}>
                        <button className={`post_btn ${styles.exam_btn}`} onClick={() => {router.replace(`/job-seeker/aptitude-test/test/${type_id}`)}}>Start Exam</button>
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

export default Instructions;
