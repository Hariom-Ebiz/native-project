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
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { IMAGEBASEURL } from "@/api";
import moment from "moment";
import useRequest from "../../../hooks/useRequest";
import { useRouter } from "next/router";
import { getCookies } from "@/fn";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from "react-i18next";

const JobPreview = ({ category, jobType, skills }) => {
  const { t } = useTranslation('common');
  const { companyProfile } = useSelector((store) => store.auth);
  const { request: PostJobRequest, response: postJobResponse } = useRequest();

  const route = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    unregister,
    setValue,
    formState: { errors },
    clearErrors,
    reset,
  } = useFormContext();
  const [isSaved, setIsSaved] = useState(true);
  const formVals = getValues();
  function kFormatter(num) {
    return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num)
  }

  let jobTypeName = jobType.find(f => f.id == formVals?.post_type);

  let jobCategoryName = category.find(f => f.id == formVals?.job_category);

  let skillName = formVals.keywords;

  const [expandTitle,setExpandTitle] = useState(false);

  const onSubmit = async (data) => {
    setIsSaved(true)
    data.id = route.query.id;
    PostJobRequest("PUT", "employer/job-post", data);
  };

  const postSubmit = async(data) => {
    setIsSaved(false)
    data.is_posted = 1;
    data.id = route.query.id;
    PostJobRequest("PUT", "employer/job-post", data);
  }

  useEffect(() => {
    window.scrollTo(0,0);
  },[])

  useEffect(() => {
    if (postJobResponse) {
      let redirectLink = `/employer/manage-jobs${(isSaved) ? "?isSaved=true" : ""}`
      route.push(redirectLink)
    }
  }, [postJobResponse])

  return (
    <>
      <div className={`${styles.social_head}`}>

        <div className={styles.left_box}>
          <div className={styles.icon_wrapper}>
            <img src={(companyProfile?.logo) ? `${IMAGEBASEURL}${companyProfile.logo}` : "/img/no-image.jpg"} alt="social-icon" />
          </div>

          {
            (!expandTitle) ? <h4 className={styles.social_head_title}>{formVals?.title?.substring(0,40)} 
            {formVals?.title.length > 40 && (<span onClick={() => setExpandTitle(true)} style={{cursor: "pointer"}}>...</span>)}</h4> : <h4 className={styles.social_head_title}>{formVals.title}</h4>
          }

        </div>
        <div className={`${styles.next_step_btn_block} ${styles.btn_col_box}`}>
          <button onClick={handleSubmit(postSubmit)} className={`${styles.next_btn} ${styles.post_now_btn}`}>
            {t("Post")} {t("Now")}
          </button>
          <button onClick={handleSubmit(onSubmit)} className={`${styles.next_btn} ${styles.post_now_btn}`}>
            {t("Save")} {t("Updates")}
          </button>
        </div>

      </div>


      <div className={styles.details_page_main}>
        <div className="row">
          <div className="col-md-7">
            <div className={styles.details_page_left}>
              <div className={styles.details_content_box}>
                <h2 className={styles.box_title}>{t("Job Description")}</h2>
                <ul className={styles.requirements_list}>
                  {formVals?.job_description.split("\n").map(d => {
                    if(d.trim()) {
                      return (
                        <li className={styles.requirements_list_items} style={{wordBreak: "break-word"}}>
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
                  })}
                </ul>
              </div>
              <div className={styles.details_content_box}>
                <h2 className={styles.box_title}>{t("Job Requirements")}</h2>
                <ul className={styles.requirements_list}>
                  {
                    formVals?.job_requirements.split("\n").map(d => 
                      {
                        if(d.trim()) {
                          return (
                            <li className={styles.requirements_list_items} style={{wordBreak: "break-word"}}>
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
                      }
                      )
                  }
                  {/* <li className={styles.requirements_list_items}>
                                  <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <g clip-path="url(#clip0_1397_9362)">
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99999 3.57389C6.31809 3.57389 3.33332 6.55866 3.33332 10.2406C3.33332 13.9225 6.31809 16.9072 9.99999 16.9072C13.6819 16.9072 16.6667 13.9225 16.6667 10.2406C16.6667 6.55866 13.6819 3.57389 9.99999 3.57389ZM1.66666 10.2406C1.66666 5.63819 5.39762 1.90723 9.99999 1.90723C14.6024 1.90723 18.3333 5.63819 18.3333 10.2406C18.3333 14.8429 14.6024 18.5739 9.99999 18.5739C5.39762 18.5739 1.66666 14.8429 1.66666 10.2406Z" fill="#56CDAD"/>
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M13.0892 7.98431C13.4147 8.30975 13.4147 8.83739 13.0892 9.16282L9.75591 12.4962C9.43048 12.8216 8.90284 12.8216 8.5774 12.4962L6.91073 10.8295C6.5853 10.5041 6.5853 9.97642 6.91073 9.65098C7.23617 9.32554 7.76381 9.32554 8.08925 9.65098L9.16666 10.7284L11.9107 7.98431C12.2362 7.65888 12.7638 7.65888 13.0892 7.98431Z" fill="#56CDAD"/>
                                  </g>
                                  <defs>
                                  <clipPath id="clip0_1397_9362">
                                  <rect width="20" height="20" fill="white" transform="translate(0 0.240234)"/>
                                  </clipPath>
                                  </defs>
                                  </svg>
                                  Focus on social media content development and publication
                              </li>
                              <li className={styles.requirements_list_items}>
                                   <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <g clip-path="url(#clip0_1397_9362)">
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99999 3.57389C6.31809 3.57389 3.33332 6.55866 3.33332 10.2406C3.33332 13.9225 6.31809 16.9072 9.99999 16.9072C13.6819 16.9072 16.6667 13.9225 16.6667 10.2406C16.6667 6.55866 13.6819 3.57389 9.99999 3.57389ZM1.66666 10.2406C1.66666 5.63819 5.39762 1.90723 9.99999 1.90723C14.6024 1.90723 18.3333 5.63819 18.3333 10.2406C18.3333 14.8429 14.6024 18.5739 9.99999 18.5739C5.39762 18.5739 1.66666 14.8429 1.66666 10.2406Z" fill="#56CDAD"/>
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M13.0892 7.98431C13.4147 8.30975 13.4147 8.83739 13.0892 9.16282L9.75591 12.4962C9.43048 12.8216 8.90284 12.8216 8.5774 12.4962L6.91073 10.8295C6.5853 10.5041 6.5853 9.97642 6.91073 9.65098C7.23617 9.32554 7.76381 9.32554 8.08925 9.65098L9.16666 10.7284L11.9107 7.98431C12.2362 7.65888 12.7638 7.65888 13.0892 7.98431Z" fill="#56CDAD"/>
                              </g>
                              <defs>
                              <clipPath id="clip0_1397_9362">
                              <rect width="20" height="20" fill="white" transform="translate(0 0.240234)"/>
                              </clipPath>
                              </defs>
                                    </svg>
                                    Stay on top of trends on social media platforms, and suggest content ideas to the team
                              </li>
                              <li className={styles.requirements_list_items}>
                                   <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <g clip-path="url(#clip0_1397_9362)">
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99999 3.57389C6.31809 3.57389 3.33332 6.55866 3.33332 10.2406C3.33332 13.9225 6.31809 16.9072 9.99999 16.9072C13.6819 16.9072 16.6667 13.9225 16.6667 10.2406C16.6667 6.55866 13.6819 3.57389 9.99999 3.57389ZM1.66666 10.2406C1.66666 5.63819 5.39762 1.90723 9.99999 1.90723C14.6024 1.90723 18.3333 5.63819 18.3333 10.2406C18.3333 14.8429 14.6024 18.5739 9.99999 18.5739C5.39762 18.5739 1.66666 14.8429 1.66666 10.2406Z" fill="#56CDAD"/>
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M13.0892 7.98431C13.4147 8.30975 13.4147 8.83739 13.0892 9.16282L9.75591 12.4962C9.43048 12.8216 8.90284 12.8216 8.5774 12.4962L6.91073 10.8295C6.5853 10.5041 6.5853 9.97642 6.91073 9.65098C7.23617 9.32554 7.76381 9.32554 8.08925 9.65098L9.16666 10.7284L11.9107 7.98431C12.2362 7.65888 12.7638 7.65888 13.0892 7.98431Z" fill="#56CDAD"/>
                              </g>
                              <defs>
                              <clipPath id="clip0_1397_9362">
                              <rect width="20" height="20" fill="white" transform="translate(0 0.240234)"/>
                              </clipPath>
                              </defs>
                                    </svg>
                                    Engage with online communities
                              </li> */}
                </ul>
              </div>

              <div className={styles.details_content_box}>
                <h2 className={styles.box_title}>{t("About Company")}</h2>
                <div className={styles.description} style={{wordBreak: "break-word"}} dangerouslySetInnerHTML={{__html: `<pre style="white-space: pre-wrap; word-wrap: break-word; font-size: 16px; font-family: 'Karla', sans-serif;">${companyProfile.description}</pre>`}} />
                {/* <ul className={styles.requirements_list}> */}
                  {/* {
                    formVals?.skills_qualifications.split("\n").map(d => (
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
                    ))
                  } */}
                 
                {/* </ul> */}
              </div>




            </div>

          </div>
          <div className="col-md-1">

          </div>
          <div className="col-md-4">
            <div className={styles.details_page_right}>
              <div className={styles.job_about_box}>
                <h2 class={styles.box_title}>{t("About this role")}</h2>

                <div>
                  <ul className={styles.role_list}>
                    <li className={styles.role_list_items}>
                      <span className={styles.job_tag}>{t("Apply Before")}</span>
                      <span className={styles.job_sub_tag}>{moment(formVals?.apply_before).format("MMMM DD, YYYY")}</span>
                    </li>
                    <li className={styles.role_list_items}>
                      <span className={styles.job_tag}>{t("Vacancies")}</span>
                      <span className={styles.job_sub_tag}>{formVals?.vacancies}</span>
                    </li>
                    <li className={styles.role_list_items}>
                      <span className={styles.job_tag}>{t("Job Type")}</span>
                      <span className={styles.job_sub_tag}>{jobTypeName?.name ?? "-"}</span>
                    </li>
                    <li className={styles.role_list_items}>
                      <span className={styles.job_tag}>{t("Experience")} </span>
                      <span className={styles.job_sub_tag}>
                        <span className={` w-100 d-block text-right ${styles.job_sub_tag}`} style={{ "textTransform": "capitalize" }}>{formVals?.career_name} </span>
                        </span>
                    </li>
                    <li className={styles.role_list_items}>
                      <span className={styles.job_tag}>{t("Salary")}</span>
                      <span className={styles.job_sub_tag}>{kFormatter(formVals.salary_range_from)}-{kFormatter(formVals.salary_range_to)} {(formVals.salary_currency == "usd") ? "USD" : "EGP"}/{t("Month")}</span>
                    </li>
                    <li className={styles.role_list_items}>
                      <span className={styles.job_tag}>{t("Location")}</span>
                      <span className={styles.job_sub_tag}>
                      {formVals.area_name || formVals.other_area}, {formVals.city_name}, {formVals.country_name}

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
                    {jobTypeName?.name ?? "-"}
                  </li>
                  <li
                    className={`${styles.statusItems} ${styles.yellowBtn}`}
                  >
                    {(formVals?.job_category != "0") ? jobCategoryName?.name : formVals?.other_job_category}
                  </li>

                </ul>
              </div>
              <div className={styles.job_about_box}>
                <h2 class={styles.box_title}>{t("Required Skills")}</h2>
                <div className={styles.skills_tags_box}>
                  {
                    skillName.map(d => (
                      <span className={styles.skills_tags}>{d.value}</span>
                    ))
                  }
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
  //   createAxiosCookies(context);
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
    },
  };
}

export default JobPreview;
