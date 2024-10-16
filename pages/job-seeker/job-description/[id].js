import React, { useEffect, useState } from "react";
import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import styles from "@/styles/job_description.module.css";
import { createAxiosCookies, getCookies } from "@/fn";
import { getJobDescription } from "@/services/jobSeeker/jobs";
import moment from "moment";
import { useRouter } from "next/router";
import { IMAGEBASEURL } from "@/api";
import useRequest from "@/hooks/useRequest";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Link from "next/link";
import { useSelector } from "react-redux";

import { useTranslation } from "react-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
// import styles from "@/styles/post_a_job.module.css";

const JobDescription = ({ jobId, description }) => {
  const { cvStep } = useSelector(store => store.auth)
  const { t } = useTranslation('common');
  const route = useRouter();
  const [titleWrap, setTitleWrap] = useState(false)
  const [careerName, setCareerName] = useState("")
  const [cvBuilderPopup, setCvBuilderPopup] = useState(false);
  const [show, setShow] = useState(false);

  const handleCvBuilderPopupClose = () => setCvBuilderPopup(false);
  const handleCvBuilderPopup = () => setCvBuilderPopup(true);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const [saved, setisSaved] = useState(false);

  function kFormatter(num) {
    return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num)
  }

  const { request: requestCareerLevel, response: responesCareerLevel } = useRequest();
  const { request: applyReq, response: aplyRes } = useRequest()

  const applyJob = (id, isSave) => {
    if (cvStep && cvStep !== 5) {
      handleCvBuilderPopup();
      return;
    }

    if (description.totalAskedQuestions == 0 || isSave) {
      setisSaved((isSave == 1) ? true : false)
      applyReq("POST", "job-seeker/job/apply", { id: id, is_applied: !isSave })
    } else {
      route.push(`/job-seeker/application-form?id=${jobId}`)
    }
  }

  useEffect(() => {
    if (aplyRes) {
      if (!aplyRes.status) {
        toast.error(t("Something went wrong!"));
        return;
      } else {
        toast.success(aplyRes.message)
        handleShow();
      }


      // route.push("/job-seeker/job-list")
    }
  }, [aplyRes])

  useEffect(() => {
    requestCareerLevel("get", "master/carrier-level-list")
  }, [])

  useEffect(() => {
    if (responesCareerLevel) {
      const { status, list } = responesCareerLevel;
      if (!status) {
        toast.error(t("Something went wrong"));
        return;
      }
      console.log("list", list);
      // setCareerLevels(list)

      if (description?.career_level) {
        const carrer = list.find(d => String(d.id) == description?.career_level)
        setCareerName(carrer?.name)
      }
    }
  }, [responesCareerLevel])

  return (
    <JobSeekerAuth data={{ title: "Job Description", backArrow: "", isRedirecttoPreviousPage: true }}>
      <div className="page_container">
        <div className="main_content" id="body_lang_css">

          <div className={` p-0 {styles.header_bg}`}>
            <div className={styles.social_head}>
              <div className={styles.left_box}>
                <div className={styles.icon_wrapper}>
                  {/* {description.logo && description.is_confidential ? <img src="/img/confedential.png"/> : <></>}
                                  {description.logo && !description.is_confidential && <img src={(description.logo && !description.is_confidential) ? `${IMAGEBASEURL}${description.logo}` : "/img/no-image.jpg"} style={{maxWidth: "81px", width: "auto"}} alt="company-logo" />} */}

                  {description.is_confidential ? <img src="/img/confedential.png" /> : <img src={(description.logo) ? `${IMAGEBASEURL}${description.logo}` : "/img/no-image.jpg"} alt="user" style={{ maxWidth: "81px", width: "auto" }} />}

                  {/* <span className={styles.user_name_later}>s</span> */}
                </div>

                <div className={` ${styles.job_save_bnt_track} ${styles.job_apply_btn_bx}`}  style={{position: "relative"}}>
                  <div style={{width: "1px", background: "#C2E4EF", height: "100%", maxHeight: "100%", position: "absolute",left: "-10px"}}></div>

                  {
                    <h4 className={styles.social_head_title}>
                      {description.title}
                    </h4>
                  }
                </div>
              </div>
              <div className={styles.job_save_bnt_track} style={{ position: "relative" }}>
                <div style={{ width: "1px", background: "#C2E4EF", height: "100%", maxHeight: "100%", position: "absolute", left: "-30px" }}></div>
                {
                  (!description.is_active || description.is_hired || description.is_under_review) ? (
                    <button id="applyBtn" className={`${styles.apply_btn}`} disabled={true} onClick={() => applyJob(jobId, 0)} style={{ backgroundColor: "red" }}>{t("Closed")}</button>
                  ) : (
                    <>
                      <button id="applyBtn" className={`${styles.apply_btn}`} disabled={description.isApplied == "1"} onClick={() => applyJob(jobId, 0)} style={{ backgroundColor: description.isApplied == "1" ? "grey" : "#2A3858" }}>{description.isApplied == "1" ? t("Applied!") : t("Apply")}</button>


                      {description.isApplied != "1" && <button id="applyBtn" className={ `${!description.isSaved  ? `${styles.save_apply_btn}`:""}`}  disabled={description.isSaved} onClick={() => applyJob(jobId, 1)} 
                          style={{ backgroundColor: description.isSaved == "1" ? "#c7c3c3" : "#2A3858" , color: description.isSaved == "1" ? "#2A3858" : "#fff" }}>
                        {description.isApplied == "1" ? "Applied!" : (description.isSaved == "1") ? t("Saved") : t("Save and Apply Later")}</button>}
                    </>
                  )
                }

              </div>
            </div>
          </div>

          <div className={styles.details_page_main}>
            <div className="row">
              <div className="col-md-7">
                <div className={styles.details_page_left}>
                  <div className={styles.details_content_box}>
                    <h2 className={styles.box_title}>{t("Job Description")}</h2>
                    <ul className={styles.requirements_list}>
                      {
                        description.job_description?.split("\n").map(d => {
                          if (d.trim()) {
                            return (
                              <li className={styles.requirements_list_items}>
                                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <g clip-path="url(#clip0_1397_9362)">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99999 3.57389C6.31809 3.57389 3.33332 6.55866 3.33332 10.2406C3.33332 13.9225 6.31809 16.9072 9.99999 16.9072C13.6819 16.9072 16.6667 13.9225 16.6667 10.2406C16.6667 6.55866 13.6819 3.57389 9.99999 3.57389ZM1.66666 10.2406C1.66666 5.63819 5.39762 1.90723 9.99999 1.90723C14.6024 1.90723 18.3333 5.63819 18.3333 10.2406C18.3333 14.8429 14.6024 18.5739 9.99999 18.5739C5.39762 18.5739 1.66666 14.8429 1.66666 10.2406Z" fill="#56CDAD" />
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M13.0892 7.98431C13.4147 8.30975 13.4147 8.83739 13.0892 9.16282L9.75591 12.4962C9.43048 12.8216 8.90284 12.8216 8.5774 12.4962L6.91073 10.8295C6.5853 10.5041 6.5853 9.97642 6.91073 9.65098C7.23617 9.32554 7.76381 9.32554 8.08925 9.65098L9.16666 10.7284L11.9107 7.98431C12.2362 7.65888 12.7638 7.65888 13.0892 7.98431Z" fill="#56CDAD" />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_1397_9362">
                                      <rect width="20" height="20" fill="white" transform="translate(0 0.240234)" />
                                    </clipPath>
                                  </defs>
                                </svg>
                                {d}
                              </li>
                            )
                          }
                        })
                      }

                    </ul>
                  </div>
                  <div className={styles.details_content_box}>
                    <h2 className={styles.box_title}>{t("Job Requirements")}</h2>
                    <ul className={styles.requirements_list}>
                      {
                        description?.job_requirements?.split("\n").map(d => {
                          if (d.trim()) {
                            return (
                              <li className={styles.requirements_list_items}>
                                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <g clip-path="url(#clip0_1397_9362)">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99999 3.57389C6.31809 3.57389 3.33332 6.55866 3.33332 10.2406C3.33332 13.9225 6.31809 16.9072 9.99999 16.9072C13.6819 16.9072 16.6667 13.9225 16.6667 10.2406C16.6667 6.55866 13.6819 3.57389 9.99999 3.57389ZM1.66666 10.2406C1.66666 5.63819 5.39762 1.90723 9.99999 1.90723C14.6024 1.90723 18.3333 5.63819 18.3333 10.2406C18.3333 14.8429 14.6024 18.5739 9.99999 18.5739C5.39762 18.5739 1.66666 14.8429 1.66666 10.2406Z" fill="#56CDAD" />
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M13.0892 7.98431C13.4147 8.30975 13.4147 8.83739 13.0892 9.16282L9.75591 12.4962C9.43048 12.8216 8.90284 12.8216 8.5774 12.4962L6.91073 10.8295C6.5853 10.5041 6.5853 9.97642 6.91073 9.65098C7.23617 9.32554 7.76381 9.32554 8.08925 9.65098L9.16666 10.7284L11.9107 7.98431C12.2362 7.65888 12.7638 7.65888 13.0892 7.98431Z" fill="#56CDAD" />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_1397_9362">
                                      <rect width="20" height="20" fill="white" transform="translate(0 0.240234)" />
                                    </clipPath>
                                  </defs>
                                </svg>
                                {d}
                              </li>
                            )
                          }
                        })
                      }

                    </ul>
                  </div>



                  {!description.is_confidential && <div className={styles.details_content_box}>
                    <h2 className={styles.box_title}>{t("About Company")}</h2>

                    {/* <p className={styles.description} style={{wordBreak: "break-word"}}>
                      <div dangerouslySetInnerHTML={{ __html: description.description.replace(/\n/g,"<br />") }} />
                    </p> */}

                    <div className={styles.description} style={{ wordBreak: "break-word" }} dangerouslySetInnerHTML={{ __html: `<pre style="white-space: pre-wrap; word-wrap: break-word; font-size: 16px; font-family: 'Karla', sans-serif;">${description.description}</pre>` }} />

                  </div>}

                </div>

              </div>
              <div className="col-md-1">

              </div>
              <div className="col-md-4">
                <div className={styles.details_page_right}>
                  <div className={styles.job_about_box}>
                    <h2 class={styles.box_title}>{t("About this role")}</h2>
                    <div className={styles.job_details_progressBar}>
                      <div className="job_tabs">
                        <div className="tab-content" id="pills-tabContent">
                          <div
                            className="tab-pane fade show active"
                            id="pills-home"
                            role="tabpanel"
                            aria-labelledby="pills-home-tab"
                            tabIndex="0"
                          >
                            <div className="inner_deta">
                              <div
                                className="progress"
                                role="progressbar"
                                aria-label="Basic example"
                                aria-valuenow="25"
                                aria-valuemin="0"
                                aria-valuemax="100"
                              >
                                <div
                                  className="progress-bar"
                                  style={{ width: (description.totalApplied < description.vacancies) ? `${Math.round((description.totalApplied / description.vacancies) * 100)}%` : "100%" }}
                                ></div>
                              </div>
                              <div className="apply_count">
                                <h5>
                                  {t("applyTestInJobList", { 1: description.totalApplied, 2: description.vacancies,3: description.totalApplied > 1 ? "s" : "", 4: description.vacancies > 1 ? "s" : "" })}
                                </h5>
                              </div>
                            </div>
                          </div>
                          <div
                            className="tab-pane fade"
                            id="pills-profile"
                            role="tabpanel"
                            aria-labelledby="pills-profile-tab"
                            tabIndex="0"
                          >
                            ...
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <ul className={styles.role_list}>
                        <li className={styles.role_list_items}>
                          <span className={styles.job_tag}>{t("Apply Before")}</span>
                          <span className={styles.job_sub_tag}>{moment(description.apply_before).format("MMMM DD, YYYY")}</span>
                        </li>
                        <li className={styles.role_list_items}>
                          <span className={styles.job_tag}>{t("Job Posted On")}</span>
                          <span className={styles.job_sub_tag}>{moment(description.posted_on).format("MMMM DD, YYYY")}</span>
                        </li>
                        <li className={styles.role_list_items}>
                          <span className={styles.job_tag}>{t("Job Type")}</span>
                          <span className={styles.job_sub_tag}>{t(description.job_type_name)}</span>
                        </li>
                        <li className={styles.role_list_items}>
                          <span className={styles.job_tag}>{t("Experience")}</span>
                          <span className={styles.job_sub_tag}>
                            <span className={` w-100 d-block text-right ${styles.job_sub_tag}`} style={{ "textTransform": "capitalize" }}>{t(careerName)} </span>
                          </span>
                        </li>
                        <li className={styles.role_list_items}>
                          <span className={styles.job_tag}>{t("Salary")}</span>
                          <span className={styles.job_sub_tag}>{kFormatter(description.salary_range_from)}-{kFormatter(description.salary_range_to)} {(description.salary_currency == "usd") ? "USD" : "EGP"}/{t("Month")}</span>
                        </li>
                        <li className={styles.role_list_items}>
                          <span className={styles.job_tag}>{t("Location")}</span>
                          <span className={styles.job_sub_tag}>
                            {description.area_name || description.other_area || description.area}, {description.city_name}, {description.country_name}

                          </span>
                        </li>

                      </ul>
                    </div>
                  </div>
                  <div className={styles.job_about_box}>
                    <h2 class={styles.box_title}>{t("Categories")}</h2>
                    <ul className={styles.statusBox}>
                      <li
                        className={`${styles.statusItems} ${styles.greenBtn}`}
                      >
                        {t(description.job_type_name)}
                      </li>
                      <li
                        className={`${styles.statusItems} ${styles.yellowBtn}`}
                      >
                        {description.job_category_id != 0 ? t(description.job_category_name) : description.other_job_category}
                      </li>

                    </ul>
                  </div>
                  {
                    Array.isArray(description.skills) && description.skills.length > 0 && <div className={styles.job_about_box}>
                      <h2 class={styles.box_title}>{t("Required Skills")}</h2>
                      <div className={styles.skills_tags_box}>
                        {
                          description.skills.map((s) => {
                            return (
                              <span className={styles.skills_tags}>{s.name}</span>
                            )
                          })
                        }

                      </div>
                    </div>
                  }
                </div>
              </div>
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
          <Modal.Body closeButton>
            <div className={styles.modal_content}>
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
                  {t("My Applications")} <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 10 20" fill="none"><path fill="#fff" fill-rule="evenodd" d="M8 3.517a1 1 0 011.62-.784l5.348 4.233a1 1 0 010 1.568l-5.347 4.233A1 1 0 018 11.983v-1.545c-.76-.043-1.484.003-2.254.218-.994.279-2.118.857-3.506 1.99a.993.993 0 01-1.129.096.962.962 0 01-.445-1.099c.415-1.5 1.425-3.141 2.808-4.412C4.69 6.114 6.244 5.241 8 5.042V3.517zm1.5 1.034v1.2a.75.75 0 01-.75.75c-1.586 0-3.066.738-4.261 1.835a8.996 8.996 0 00-1.635 2.014c.878-.552 1.695-.916 2.488-1.138 1.247-.35 2.377-.33 3.49-.207a.75.75 0 01.668.745v1.2l4.042-3.2L9.5 4.55z" clip-rule="evenodd" /></svg>
                </button>
              </Link>
              <Link href="/job-seeker/job-list" className={`w-40 text-center`}>
                <button className="btn btn-primary p-3 w-auto">
                  View More Jobs <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 10 20" fill="none"><path fill="#fff" fill-rule="evenodd" d="M8 3.517a1 1 0 011.62-.784l5.348 4.233a1 1 0 010 1.568l-5.347 4.233A1 1 0 018 11.983v-1.545c-.76-.043-1.484.003-2.254.218-.994.279-2.118.857-3.506 1.99a.993.993 0 01-1.129.096.962.962 0 01-.445-1.099c.415-1.5 1.425-3.141 2.808-4.412C4.69 6.114 6.244 5.241 8 5.042V3.517zm1.5 1.034v1.2a.75.75 0 01-.75.75c-1.586 0-3.066.738-4.261 1.835a8.996 8.996 0 00-1.635 2.014c.878-.552 1.695-.916 2.488-1.138 1.247-.35 2.377-.33 3.49-.207a.75.75 0 01.668.745v1.2l4.042-3.2L9.5 4.55z" clip-rule="evenodd" /></svg>
                </button>
              </Link>
            </div>
          </Modal.Footer>
        </Modal>

        <Modal
        className={styles.modalBox}
        show={cvBuilderPopup}
        onHide={handleCvBuilderPopupClose}
        // size="lg"
        centered
      >
        <Modal.Body className="p-0 border-0">
          <div className="icon_block" style={{ marginTop: "30px" }}>
            <img src="/img/error.png" alt="" />
          </div>
          <div className={styles.unlockPopupContent} style={{paddingTop: "20px", paddingBottom: "20px"}}>
            <h2 className={styles.popupTitle}>
              {t("Please Complete Your CV.")}
            </h2>
            <p className={styles.subText}>
              Ready to apply? Complete your CV <b>(just once)</b> in the <b>(CV Builder)</b>, and you're set for all future jobs. Get started now
            </p>
            <button className={styles.confirmBtn} onClick={() => route.push("/job-seeker/create-cv/step1")}>
              {t("Go to CV Builder")}
            </button>
          </div>
        </Modal.Body>
      </Modal>
      </div>
    </JobSeekerAuth>
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
  const id = context.params.id;
  const data = await getJobDescription(id);
  return {
    props: {
      jobId: id,
      description: data.job,
      isProtected: true,
      ...(await serverSideTranslations(lang_code, [
        'common',
      ])),
    }
  }
}

export default JobDescription;