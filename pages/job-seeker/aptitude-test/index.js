import React, { useEffect, useState } from "react";
import { createAxiosCookies, getCookies } from "@/fn";

import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import styles from "@/styles/aptitude_test.module.css"

import useRequest from "@/hooks/useRequest";
import { useRouter } from "next/router";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Modal } from "react-bootstrap";

const AptitudeTest = () => {
    const { t } = useTranslation('common');

    const [welcomPopup, setWelcomePopup] = useState(false);
    const handleWelcomeClose = () => setWelcomePopup(false);
    const handleWelcomeOpen = () => setWelcomePopup(true);
    const router = useRouter();
    const query = router.query;
    const { request: requestAptitudeDetails, response: responseAptitudeDetails } = useRequest();
    const [aptitudeTypes, setAptitudeTypes] = useState([]);

    useEffect(() => {
        if(Object.keys(query).length == 0){
            handleWelcomeOpen()
        }
        requestAptitudeDetails("get", "aptitude/user/details")
    }, [])

    useEffect(() => {
        if (responseAptitudeDetails) {
            const { status, message, data } = responseAptitudeDetails;
            if (!status) {
                return;
            }

            data.sort((a,b)=> {
                return a.aptitude_type_id - b.aptitude_type_id
            })

            setAptitudeTypes(data);
        }
    }, [responseAptitudeDetails])

    const checkCanTakeExam = (aptitude) => {
        if (!aptitude.last_test_date) {
            return true;
        }

        const last_test_date = new Date(aptitude.last_test_date);
        const next_aptitude_date = new Date(last_test_date.setMonth(last_test_date.getMonth() + 6)).getTime();

        if (next_aptitude_date >= new Date().getTime()) {
            return false;
        }

        return true;
    }

    const getScore = (right_questions, total_questions) => {
        return Math.ceil((right_questions / (total_questions || 1)) * 100)
    }

    return (
        <>
            <JobSeekerAuth data={{ title: "Aptitude Assessment" }} />
            <div className="page_container">
                <div className="main_content" id="body_lang_css">
                    <div className={styles.page_head_block}>
                        {/* <h2 className={styles.page_title}>Aptitude Assesment</h2> */}
                    </div>
                    <div className={styles.test_main_box}>
                        <div className="row gy-4">
                            {aptitudeTypes?.map(aptitudeType => {
                                const canTakeExam = checkCanTakeExam(aptitudeType);

                                return <div className="col-lg-6 col-md-6 " key={aptitudeType.aptitude_type_id}>
                                    <div className={styles.test_inner} style={{ height: "100%" }}>
                                        <h2 className={styles.section_title}>{t(aptitudeType.aptitude_type_name)}</h2>
                                        {
                                            aptitudeType.last_test_date
                                                ?
                                                <div className={styles.date_box}>
                                                    <p className={styles.date_track}>{t("Last Assessment Date :")} <span>
                                                        {moment(aptitudeType.last_test_date).format("DD MMM YYYY")}
                                                    </span></p> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    <p className={styles.date_track}>{t("Next Trial Date :")}  <span>
                                                        {moment(aptitudeType.last_test_date).add(6, 'M').format("DD MMM YYYY")}
                                                    </span></p>
                                                </div>
                                                :
                                                <p className={styles.date_track} style={{ marginBottom: "33px" }}>{t("Start your assessment now to know your level.")} </p>
                                        }

                                        <div className={styles.score_block}>
                                            {aptitudeType.last_test_date && <p className={styles.score_content}>{t("Score")} : <span className={styles.score_text}>{getScore(aptitudeType.right_questions, aptitudeType.total_questions)} %</span></p>}

                                            <button
                                                disabled={!canTakeExam}
                                                className={`${styles.exam_btn} ${canTakeExam ? styles.exam_active : styles.exam_disabled}`} onClick={() => {
                                                    router.push(`/job-seeker/aptitude-test/${aptitudeType.aptitude_type_id}`)
                                                }}
                                            >{t("Take Assessment")}</button>
                                        </div>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                className="successfull_popup"
                show={welcomPopup}
                onHide={handleWelcomeClose}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <div className="modal_head_block">
                    <svg width="20" height="20" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M54.7687 46.4813L50.0812 41.7938C49.2152 40.9356 48.1027 40.3695 46.8992 40.1746C45.6957 39.9796 44.4614 40.1655 43.3687 40.7063L40.2187 37.5C43.603 33.4167 45.2842 28.1866 44.9132 22.8961C44.5422 17.6056 42.1475 12.6613 38.2265 9.09019C34.3055 5.5191 29.1595 3.59568 23.8575 3.71943C18.5554 3.84318 13.5048 6.0046 9.75467 9.75473C6.00453 13.5049 3.84312 18.5555 3.71937 23.8575C3.59561 29.1596 5.51904 34.3056 9.09013 38.2266C12.6612 42.1476 17.6055 44.5423 22.896 44.9133C28.1865 45.2843 33.4166 43.603 37.5 40.2188L40.65 43.3688C40.1092 44.4614 39.9233 45.6958 40.1182 46.8993C40.3132 48.1027 40.8793 49.2152 41.7375 50.0813L46.425 54.7688C47.5275 55.8611 49.0167 56.4739 50.5687 56.4739C52.1207 56.4739 53.61 55.8611 54.7125 54.7688C55.8123 53.6737 56.4353 52.1886 56.4458 50.6366C56.4563 49.0846 55.8536 47.5912 54.7687 46.4813ZM24.375 41.25C21.0374 41.25 17.7748 40.2603 14.9997 38.4061C12.2246 36.5518 10.0617 33.9163 8.7845 30.8328C7.50727 27.7493 7.17309 24.3563 7.82421 21.0829C8.47534 17.8094 10.0825 14.8026 12.4425 12.4426C14.8025 10.0826 17.8094 8.4754 21.0828 7.82427C24.3562 7.17315 27.7492 7.50733 30.8327 8.78456C33.9162 10.0618 36.5518 12.2247 38.406 14.9998C40.2603 17.7749 41.25 21.0375 41.25 24.375C41.25 28.8506 39.4721 33.1428 36.3074 36.3074C33.1427 39.4721 28.8505 41.25 24.375 41.25ZM52.1062 52.1063C51.9126 52.3024 51.682 52.4582 51.4277 52.5645C51.1734 52.6708 50.9006 52.7255 50.625 52.7255C50.3494 52.7255 50.0765 52.6708 49.8222 52.5645C49.5679 52.4582 49.3373 52.3024 49.1437 52.1063L44.4562 47.4188C44.2386 47.2298 44.0622 46.9981 43.938 46.738C43.8138 46.4779 43.7445 46.195 43.7344 45.907C43.7242 45.619 43.7735 45.3319 43.8791 45.0637C43.9847 44.7956 44.1443 44.552 44.3481 44.3482C44.5519 44.1444 44.7955 43.9847 45.0637 43.8791C45.3319 43.7736 45.6189 43.7243 45.9069 43.7344C46.195 43.7446 46.4778 43.8139 46.7379 43.9381C46.998 44.0623 47.2297 44.2386 47.4187 44.4563L52.1062 49.1438C52.3024 49.3374 52.4581 49.568 52.5644 49.8223C52.6707 50.0766 52.7254 50.3494 52.7254 50.625C52.7254 50.9006 52.6707 51.1735 52.5644 51.4278C52.4581 51.682 52.3024 51.9127 52.1062 52.1063Z" fill="url(#paint0_linear_532_3115)" />
                        <defs>
                        <linearGradient id="paint0_linear_532_3115" x1="23.1937" y1="47.5125" x2="43.8187" y2="11.7938" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#4A55A5" />
                            <stop offset="1" stop-color="#5DB9BF" />
                        </linearGradient>
                        </defs>
                    </svg>
                    <h2 className="modal_heading">What's This Section About? A Quick Overview!</h2>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ textAlign: "left" }}>
                        <p>
                            Leverage Aptitude Assessment to understand your capabilities and skills. Taking these assessments significantly boosts your chances of standing out to employers searching for top candidates on our platform.
                        </p>
                    </div>
                </Modal.Body>
            </Modal>
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
    return {
        props: {
            isProtected: true,
            ...(await serverSideTranslations(lang_code, [
                'common',
            ])),
        }
    }
}

export default AptitudeTest;
