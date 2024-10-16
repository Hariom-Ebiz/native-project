import React, { useEffect, useState } from "react";
import Link from "next/link";
// import { createAxiosCookies } from "@/fn";
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import styles from "@/styles/post_a_job.module.css";
import Sidebar from "@/components/jobSeeker/Sidebar";
import AuthHeader from "@/components/employer/AuthHeader";
import Header from "@/components/common/Header";
import EmployerAuth from "@/components/layout/EmployerAuth";
import { useRouter } from "next/router";
import StepOne from "./step-one";
import StepTwo from "./step-two";
import StepFour from "./step-four";
import { countriesData } from "@/services/jobSeeker/profile";
import { createAxiosCookies, getCookies } from "@/fn";
// import { FormProvider } from "./FormContext";
import { useForm, FormProvider as ReactHookFormProvider } from "react-hook-form";
import useRequest from "@/hooks/useRequest";
import { getPsycometricWeigths, getSkills, jobCategory, jobTypeList } from "@/services/master";
import { axiosInstance } from "@/api";
import StepThree from "./step-three";
import { getCoreInterest, getCoreInterestCategory, getCoreValues, getMotivatedSkills, getPersonalitySummary } from "@/services/other";
import JobPreview from "./job-preview";
import { Modal } from "react-bootstrap";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from "react-i18next";


const PostJob = ({ countries, jobCategories, jobType, skills, coreValues, intrestsData, motivateSkills, personalitySummary, psycometrics }) => {
    const route = useRouter()
    const { t } = useTranslation('common');
    const { request: requestCity, response: responseCity } = useRequest();
    const { request: requestArea, response: responseArea } = useRequest();
    const [cityList, setCities] = useState([]);
    const [areaList, setAreas] = useState([]);


    // const { form } = route.query;

    const [formTrack, setFormTrack] = useState(1);

    const [formAllow, setFormAllow] = useState([true, false, false, false])

    const [welcomPopup, setWelcomePopup] = useState(true);
    const handleWelcomeClose = () => setWelcomePopup(false);
    const handleWelcomeShow = () => setWelcomePopup(true);

    // form submit 
    const methods = useForm();
    const { handleSubmit, watch, setValue, trigger } = methods;

    const onSubmit = (data) => {
        console.log("newwwwwwww", data);
    };

    const validateStep = async (step) => {
        const isStepValid = await trigger(); // This triggers validation for all fields
        if (isStepValid) {
            console.log("formAllow", formAllow);
            const updatedFormAllow = [...formAllow];
            updatedFormAllow[step] = true;
            setFormAllow(updatedFormAllow);
            setFormTrack(step + 1);
        }
    };

    const navigateToStep = (step) => {
        if (formAllow[step - 1]) {
            setFormTrack(step);
        }
    };


    const countrySelectedHandler = (data) => {
        if (data) {
            requestCity("GET", `master/cities?country=${data}`);
        }
    };

    useEffect(() => {
        if (responseCity && responseCity.status) {
            setCities(responseCity?.list);
        }
    }, [responseCity]);

    const citySelectedHandler = (data) => {
        if (data) {
            requestArea("GET", `master/areas?city=${data}`);
        }
    };

    useEffect(() => {
        if (responseArea && responseArea.status) {
            setAreas(responseArea?.list);
        }
    }, [responseArea]);

    return (
        <>
            <EmployerAuth data={{ title: "Job Post" }} />
            <div className="page_container">
                <div className="main_content" id="body_lang_css">
                    <div className={styles.post_job_box}>
                        {formTrack != 5 && (
                            <>
                                <div className={styles.post_job_head}>
                                    <h2 className={styles.post_job_title}>
                                        <span onClick={() => route.back()} style={{"cursor": "pointer"}}>
                                            <svg width="27" height="24" viewBox="0 0 27 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M0.166504 11.9997C0.166504 11.0792 0.912696 10.333 1.83317 10.333H25.1665C26.087 10.333 26.8332 11.0792 26.8332 11.9997C26.8332 12.9201 26.087 13.6663 25.1665 13.6663H1.83317C0.912696 13.6663 0.166504 12.9201 0.166504 11.9997Z" fill="#25324B" />
                                                <path fillRule="evenodd" clipRule="evenodd" d="M0.654659 10.8212C1.30553 10.1703 2.36081 10.1703 3.01168 10.8212L13.0117 20.8212C13.6626 21.472 13.6626 22.5273 13.0117 23.1782C12.3608 23.8291 11.3055 23.8291 10.6547 23.1782L0.654659 13.1782C0.0037854 12.5273 0.0037854 11.472 0.654659 10.8212Z" fill="#25324B" />
                                                <path fillRule="evenodd" clipRule="evenodd" d="M13.0117 0.821163C13.6626 1.47204 13.6626 2.52731 13.0117 3.17819L3.01168 13.1782C2.36081 13.8291 1.30553 13.8291 0.654659 13.1782C0.0037854 12.5273 0.0037854 11.472 0.654659 10.8212L10.6547 0.821163C11.3055 0.170289 12.3608 0.170289 13.0117 0.821163Z" fill="#25324B" />
                                            </svg>
                                        </span>
                                        {t("Post a Job")}
                                    </h2>
                                </div>
                                <div className={styles.steps_box}>
                                    <div className={`row ${styles.row_flex_wrap}`}>
                                        {[t("General Info"), t("Job Details"), t("Screening Assessments"), t("Screening Questions")].map((step, index) => (
                                            <p
                                                key={index}
                                                role="button"
                                                className={`col-lg-3 ${styles.step_col}`}
                                                onClick={() => navigateToStep(index + 1)}
                                                style={{ pointerEvents: formAllow[index] ? "auto" : "none" }}
                                            >
                                                <div
                                                    className={`${styles.steps_trake} ${formTrack === index + 1 ? styles.current_view : formAllow[index] ? styles.user_view : ""}`}
                                                >
                                                    <div className={styles.icon_box}>
                                                        <svg width="25" height="25" viewBox={(index == 0) ? "0 0 21 17" :"0 0 25 25"} fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            {
                                                                index == 0 && (
                                                                    <path
                                                                        d="M19.938 7.62479C17.9211 2.93347 14.123 0.0209745 10.023 0.0182838C5.92302 0.0155931 2.12111 2.9231 0.0980283 7.61177C0.0428822 7.7379 0.0143714 7.87406 0.014281 8.01172C0.0141907 8.14938 0.0425228 8.28557 0.0975033 8.41177C2.11442 13.1031 5.91251 16.0156 10.0125 16.0183C14.1125 16.021 17.9144 13.1135 19.9375 8.42479C19.9926 8.29866 20.0212 8.16251 20.0212 8.02485C20.0213 7.88719 19.993 7.751 19.938 7.62479ZM10.0138 14.0183C6.83383 14.0162 3.84533 11.7242 2.11777 8.0131C3.8502 4.30423 6.8417 2.0162 10.0217 2.01828C13.2017 2.02037 16.1902 4.31233 17.9178 8.02347C16.1853 11.7323 13.1938 14.0204 10.0138 14.0183ZM10.0204 4.01828C9.22926 4.01776 8.45575 4.25185 7.79767 4.69095C7.13958 5.13004 6.62648 5.75442 6.32325 6.48512C6.02002 7.21583 5.94028 8.02004 6.09411 8.79607C6.24794 9.57209 6.62844 10.2851 7.18748 10.8449C7.74652 11.4046 8.45901 11.7861 9.23483 11.9409C10.0107 12.0958 10.815 12.0171 11.5461 11.7148C12.2772 11.4125 12.9022 10.9003 13.3422 10.2427C13.7821 9.58524 14.0172 8.81203 14.0178 8.02091C14.0185 6.96004 13.5977 5.94235 12.848 5.19171C12.0984 4.44107 11.0813 4.01898 10.0204 4.01828ZM10.0165 10.0183C9.62089 10.018 9.23429 9.90047 8.90553 9.68049C8.57678 9.46051 8.32064 9.14799 8.1695 8.78244C8.01837 8.41689 7.97902 8.01473 8.05645 7.62681C8.13387 7.2389 8.32459 6.88266 8.60448 6.60314C8.88437 6.32362 9.24086 6.13337 9.62887 6.05646C10.0169 5.97954 10.419 6.01941 10.7843 6.17103C11.1497 6.32264 11.4619 6.57919 11.6814 6.90823C11.901 7.23728 12.018 7.62403 12.0178 8.01959C12.0174 8.55003 11.8064 9.0586 11.431 9.43342C11.0557 9.80825 10.5469 10.0186 10.0165 10.0183Z"
                                                                        fill="currentcolor"
                                                                    />
                                                                )
                                                            }

                                                            {
                                                                index == 1 && (
                                                                    <path
                                                                        d="M21.517 13.2795C18.6568 14.4339 15.6003 15.0244 12.5159 15.0186C9.33288 15.0165 6.29629 14.3945 3.51703 13.2677M12.5178 12.0186L12.5278 12.0186M16.5218 6.02123L16.5231 4.02123C16.5234 3.49079 16.3131 2.98195 15.9382 2.60663C15.5634 2.23131 15.0548 2.02026 14.5244 2.01991L10.5244 2.01729C9.99398 2.01694 9.48513 2.22732 9.10982 2.60215C8.7345 2.97697 8.52345 3.48554 8.5231 4.01598L8.52179 6.01598L16.5218 6.02123ZM5.5126 20.014L19.5126 20.0232C20.043 20.0235 20.5519 19.8132 20.9272 19.4383C21.3025 19.0635 21.5136 18.5549 21.5139 18.0245L21.5205 8.02451C21.5208 7.49407 21.3104 6.98523 20.9356 6.60991C20.5608 6.23459 20.0522 6.02354 19.5218 6.0232L5.52179 6.01401C4.99136 6.01366 4.48251 6.22404 4.10719 6.59887C3.73187 6.97369 3.52082 7.48226 3.52048 8.01269L3.51391 18.0127C3.51357 18.5431 3.72395 19.052 4.09877 19.4273C4.4736 19.8026 4.98217 20.0137 5.5126 20.014Z"
                                                                        stroke="currentcolor"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                )
                                                            }

                                                            {
                                                                index == 2 && (
                                                                    <>
                                                                        <path
                                                                            d="M18.0229 4.02286L6.02295 4.01498C4.91838 4.01426 4.02236 4.9091 4.02164 6.01367L4.02032 8.01367C4.0196 9.11824 4.91444 10.0143 6.01901 10.015L18.019 10.0229C19.1236 10.0236 20.0196 9.12874 20.0203 8.02417L20.0216 6.02417C20.0224 4.9196 19.1275 4.02358 18.0229 4.02286Z"
                                                                            stroke="currentcolor"
                                                                            stroke-width="2"
                                                                            stroke-linecap="round"
                                                                            stroke-linejoin="round"
                                                                        />
                                                                        <path
                                                                            d="M18.0166 14.0229L6.0166 14.015C4.91203 14.0143 4.01601 14.9091 4.01529 16.0137L4.01398 18.0137C4.01325 19.1182 4.90809 20.0143 6.01266 20.015L18.0127 20.0229C19.1172 20.0236 20.0132 19.1287 20.014 18.0242L20.0153 16.0242C20.016 14.9196 19.1212 14.0236 18.0166 14.0229Z"
                                                                            stroke="currentcolor"
                                                                            stroke-width="2"
                                                                            stroke-linecap="round"
                                                                            stroke-linejoin="round"
                                                                        /></>
                                                                )
                                                            }

                                                            {
                                                                index == 3 && (
                                                                    <>
                                                                        <path
                                                                            d="M12.5121 21.0186C17.4827 21.0219 21.5148 16.9951 21.518 12.0245C21.5213 7.05394 17.4945 3.02186 12.5239 3.0186C7.55336 3.01534 3.52128 7.04213 3.51802 12.0127C3.51476 16.9833 7.54155 21.0153 12.5121 21.0186Z"
                                                                            stroke="currentcolor"
                                                                            stroke-width="2"
                                                                            stroke-linecap="round"
                                                                            stroke-linejoin="round"
                                                                        />
                                                                        <path
                                                                            d="M12.5146 17.0186L12.5146 17.0286"
                                                                            stroke="currentcolor"
                                                                            stroke-width="2"
                                                                            stroke-linecap="round"
                                                                            stroke-linejoin="round"
                                                                        />
                                                                        <path
                                                                            d="M12.5172 13.5191C12.499 13.1944 12.5868 12.8727 12.7673 12.6022C12.9479 12.3318 13.2114 12.1274 13.5182 12.0197C13.8942 11.8762 14.2317 11.6474 14.5042 11.3513C14.7767 11.0552 14.9768 10.6999 15.0886 10.3133C15.2005 9.92677 15.2211 9.51952 15.1488 9.12365C15.0765 8.72777 14.9134 8.35408 14.6721 8.03198C14.4309 7.70989 14.1182 7.44819 13.7586 7.26749C13.399 7.08678 13.0024 6.99201 12.6 6.99063C12.1976 6.98925 11.8003 7.0813 11.4396 7.25953C11.0788 7.43776 10.7643 7.69731 10.5208 8.01774"
                                                                            stroke="currentcolor"
                                                                            stroke-width="2"
                                                                            stroke-linecap="round"
                                                                            stroke-linejoin="round"
                                                                        />
                                                                    </>
                                                                )
                                                            }
                                                           
                                                        </svg>
                                                    </div>
                                                    <div className={styles.step_content}>
                                                        <h3 className={styles.step_number}>{t("Step")} {index + 1}/4</h3>
                                                        <h4 className={styles.step_type}>{step}</h4>
                                                    </div>
                                                </div>
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </>
                            )}

                        <ReactHookFormProvider {...methods}>
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                {formTrack === 1 && (
                                    <StepOne
                                        validateStep={() => validateStep(1)}
                                        setData={setFormAllow}
                                        trackForm={setFormTrack}
                                        country={countries}
                                        getcity={countrySelectedHandler}
                                        getArea={citySelectedHandler}
                                        city={cityList}
                                        area={areaList}
                                        category={jobCategories}
                                        jobType={jobType}
                                    />
                                )}
                                {formTrack === 2 && (
                                    <StepTwo
                                        validateStep={() => validateStep(2)}
                                        setData={setFormAllow}
                                        trackForm={setFormTrack}
                                        skills={skills}
                                        // countrySelectedHandler={countrySelectedHandler}
                                        countries={countries}
                                        cityList={cityList}
                                    />
                                )}
                                {formTrack === 3 && (
                                    <StepThree
                                        setData={setFormAllow}
                                        trackForm={setFormTrack}
                                        validateStep={() => validateStep(3)}
                                        coreValues={coreValues}
                                        intrestsData={intrestsData}
                                        motivateSkills={motivateSkills}
                                        personalitySummary={personalitySummary}
                                        psycometrics={psycometrics}
                                    />
                                )}
                                {formTrack === 4 && (
                                    <StepFour
                                        setData={setFormAllow}
                                        trackForm={setFormTrack}
                                        validateStep={() => validateStep(4)}
                                        skills={skills}
                                    />
                                )}
                                {formTrack === 5 && (
                                    <JobPreview
                                        setData={setFormAllow}
                                        trackForm={setFormTrack}
                                        validateStep={() => validateStep(4)}
                                        category={jobCategories}
                                        jobType={jobType}
                                        skills={skills}
                                    />
                                )}
                                {/* <div className="form-actions">
                                {formTrack > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => setFormTrack(formTrack - 1)}
                                    >
                                        Previous
                                    </button>
                                )}
                                {formTrack < 4 && (
                                    <button
                                        type="button"
                                        onClick={() => validateStep(formTrack)}
                                    >
                                        Next
                                    </button>
                                )}
                                {formTrack === 4 && (
                                    <button
                                        type="submit"
                                        disabled={!formAllow[3]}
                                    >
                                        Submit
                                    </button>
                                )}
                            </div> */}
                            </Form>
                        </ReactHookFormProvider>
                    </div>
                </div>
            </div>

            {/* // Welcome popup */}
            <Modal
                className="successfull_popup"
                show={welcomPopup}
                onHide={handleWelcomeClose}
                size="lg"
                centered
            >

                <Modal.Header closeButton>
                <div className={styles.modal_head_block}>
                        <svg width="20" height="20" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M54.7687 46.4813L50.0812 41.7938C49.2152 40.9356 48.1027 40.3695 46.8992 40.1746C45.6957 39.9796 44.4614 40.1655 43.3687 40.7063L40.2187 37.5C43.603 33.4167 45.2842 28.1866 44.9132 22.8961C44.5422 17.6056 42.1475 12.6613 38.2265 9.09019C34.3055 5.5191 29.1595 3.59568 23.8575 3.71943C18.5554 3.84318 13.5048 6.0046 9.75467 9.75473C6.00453 13.5049 3.84312 18.5555 3.71937 23.8575C3.59561 29.1596 5.51904 34.3056 9.09013 38.2266C12.6612 42.1476 17.6055 44.5423 22.896 44.9133C28.1865 45.2843 33.4166 43.603 37.5 40.2188L40.65 43.3688C40.1092 44.4614 39.9233 45.6958 40.1182 46.8993C40.3132 48.1027 40.8793 49.2152 41.7375 50.0813L46.425 54.7688C47.5275 55.8611 49.0167 56.4739 50.5687 56.4739C52.1207 56.4739 53.61 55.8611 54.7125 54.7688C55.8123 53.6737 56.4353 52.1886 56.4458 50.6366C56.4563 49.0846 55.8536 47.5912 54.7687 46.4813ZM24.375 41.25C21.0374 41.25 17.7748 40.2603 14.9997 38.4061C12.2246 36.5518 10.0617 33.9163 8.7845 30.8328C7.50727 27.7493 7.17309 24.3563 7.82421 21.0829C8.47534 17.8094 10.0825 14.8026 12.4425 12.4426C14.8025 10.0826 17.8094 8.4754 21.0828 7.82427C24.3562 7.17315 27.7492 7.50733 30.8327 8.78456C33.9162 10.0618 36.5518 12.2247 38.406 14.9998C40.2603 17.7749 41.25 21.0375 41.25 24.375C41.25 28.8506 39.4721 33.1428 36.3074 36.3074C33.1427 39.4721 28.8505 41.25 24.375 41.25ZM52.1062 52.1063C51.9126 52.3024 51.682 52.4582 51.4277 52.5645C51.1734 52.6708 50.9006 52.7255 50.625 52.7255C50.3494 52.7255 50.0765 52.6708 49.8222 52.5645C49.5679 52.4582 49.3373 52.3024 49.1437 52.1063L44.4562 47.4188C44.2386 47.2298 44.0622 46.9981 43.938 46.738C43.8138 46.4779 43.7445 46.195 43.7344 45.907C43.7242 45.619 43.7735 45.3319 43.8791 45.0637C43.9847 44.7956 44.1443 44.552 44.3481 44.3482C44.5519 44.1444 44.7955 43.9847 45.0637 43.8791C45.3319 43.7736 45.6189 43.7243 45.9069 43.7344C46.195 43.7446 46.4778 43.8139 46.7379 43.9381C46.998 44.0623 47.2297 44.2386 47.4187 44.4563L52.1062 49.1438C52.3024 49.3374 52.4581 49.568 52.5644 49.8223C52.6707 50.0766 52.7254 50.3494 52.7254 50.625C52.7254 50.9006 52.6707 51.1735 52.5644 51.4278C52.4581 51.682 52.3024 51.9127 52.1062 52.1063Z" fill="url(#paint0_linear_532_3115)"/>
                            <defs>
                            <linearGradient id="paint0_linear_532_3115" x1="23.1937" y1="47.5125" x2="43.8187" y2="11.7938" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#4A55A5"/>
                            <stop offset="1" stop-color="#5DB9BF"/>
                            </linearGradient>
                            </defs>
                        </svg>
                        <h2 className={styles.modal_heading}> {t("What's This Section About? A Quick Overview!")}</h2>
                </div>
                </Modal.Header>
                <Modal.Body>
                <div className={styles.modal_content} style={{textAlign: "left"}}>
                    <p>
                        {t("Craft an impactful job post step-by-step. Utilize our ready-made Screening Assessments and insightful Questions to attract top talent tailored to your needs. Leverage automated candidate scores for a streamlined hiring process that connects you with the best-suited candidates.")}
                    </p>
                </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export async function getServerSideProps(context) {
    createAxiosCookies(context);
    const getCountry = await countriesData();
    const getJobategory = await jobCategory();
    const res = await jobTypeList();
    const skillList = await getSkills();
    const coreVal = await getCoreValues();
    const intrestes = await getCoreInterestCategory();
    const motiSkills = await getMotivatedSkills()
    const personality = await getPersonalitySummary()
    const psycometrics = await getPsycometricWeigths()

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
            countries: getCountry,
            jobCategories: getJobategory,
            jobType: res,
            skills: skillList,
            publicHeader: false,
            publicFooter: false,
            coreValues: coreVal,
            intrestsData: intrestes,
            motivateSkills: motiSkills,
            personalitySummary: personality,
            psycometrics: psycometrics,
            ...(await serverSideTranslations(lang_code, [
                'common',
              ])),
        },
    };
}

export default PostJob;