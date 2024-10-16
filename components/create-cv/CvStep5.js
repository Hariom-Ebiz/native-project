import React, { useState,useEffect } from "react";
import styles from "@/styles/edit_cv_steps.module.css";
import Link from "next/link";
import { API } from "@/api";
import moment from "moment";
import { getLatestCompany, timeGapYearMonth } from "@/utils/helper";
import CvTemplate from "@/components/cv/cvTemplate";
import CvTemplate2 from "@/components/cv/cvTemplate2";
import CvTemplate3 from "@/components/cv/cvTemplate3";
import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";
import { getFirstLetterCapital } from "@/utils/helper";
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useTranslation } from "react-i18next";


const CvStep5 = ({
  generalData,
  languagesData,
  careerPrefrenceData,
  certificationData,
  educationData,
  postGraduationData,
  skillsData,
  universityData,
  workExperienceData,
  mode,
}) => {
  console.log(" data : ", generalData);
  
  const { t } = useTranslation('common');
  let latestCompany = getLatestCompany(workExperienceData);

  useEffect(() => {
    const collapseElement = document.getElementById("collapseExample");

    const showListener = () => setSeeMore(true);
    const hideListener = () => setSeeMore(false);

    collapseElement.addEventListener("show.bs.collapse", showListener);
    collapseElement.addEventListener("hide.bs.collapse", hideListener);

    return () => {
      collapseElement.removeEventListener("show.bs.collapse", showListener);
      collapseElement.removeEventListener("hide.bs.collapse", hideListener);
    };
  }, []);

  const downloadCvHandler1 = async () => {
    const blob = await pdf(
      <CvTemplate
        data={{
          generalData,
          languagesData,
          careerPrefrenceData,
          certificationData,
          educationData,
          postGraduationData,
          skillsData,
          universityData,
          workExperienceData,
        }}
      />
    ).toBlob();
    saveAs(
      blob,
      `${generalData?.first_name ? generalData.first_name + "-" : ""}resume.pdf`
    );
  };

  function escapeHtml(unsafeText) {
    if(!unsafeText) return "";
    return unsafeText
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  const downloadCvHandler2 = async () => {
    const blob = await pdf(
      <CvTemplate2
        data={{
          generalData,
          languagesData,
          careerPrefrenceData,
          certificationData,
          educationData,
          postGraduationData,
          skillsData,
          universityData,
          workExperienceData,
        }}
      />
    ).toBlob();
    saveAs(
      blob,
      `${generalData?.first_name ? generalData.first_name + "-" : ""}resume.pdf`
    );
  };

  const downloadCvHandler3 = async () => {
    const blob = await pdf(
      <CvTemplate3
        data={{
          generalData,
          languagesData,
          careerPrefrenceData,
          certificationData,
          educationData,
          postGraduationData,
          skillsData,
          universityData,
          workExperienceData,
        }}
      />
    ).toBlob();
    saveAs(
      blob,
      `${generalData?.first_name ? generalData.first_name + "-" : ""}resume.pdf`
    );
  };
  const [seeMore, setSeeMore] = useState(false);
  const [workSeeMore, setWorkSeeMore] = useState(false);

  const [show, setShow] = useState(false);

  const phoneNumber = parsePhoneNumberFromString("+"+generalData?.contact_mobile)

  return (
    <div className={` row `}>
      <div className="col-md-8">
        <div className={styles.cv_dashboard}>
          <div className={styles.profile_bg_img}>
            <figure>
              <img
                src={
                  generalData?.cover_pic
                    ? `${API}/${generalData?.cover_pic}`
                    : "/img/cover-pic2.png"
                }
                alt=""
                className={styles.img_wrapper}
              />
            </figure>
            <Link
              className={styles.edit_icon}
              href={`/job-seeker/${mode}-cv/step1`}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_29464_34860)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.87868 6.87868C4.44129 6.31607 5.20435 6 6 6H9C9.55228 6 10 6.44772 10 7C10 7.55228 9.55228 8 9 8H6C5.73478 8 5.48043 8.10536 5.29289 8.29289C5.10536 8.48043 5 8.73478 5 9V18C5 18.2652 5.10536 18.5196 5.29289 18.7071C5.48043 18.8946 5.73478 19 6 19H15C15.2652 19 15.5196 18.8946 15.7071 18.7071C15.8946 18.5196 16 18.2652 16 18V15C16 14.4477 16.4477 14 17 14C17.5523 14 18 14.4477 18 15V18C18 18.7957 17.6839 19.5587 17.1213 20.1213C16.5587 20.6839 15.7957 21 15 21H6C5.20435 21 4.44129 20.6839 3.87868 20.1213C3.31607 19.5587 3 18.7956 3 18V9C3 8.20435 3.31607 7.44129 3.87868 6.87868Z"
                    fill="#F8F8FD"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16.7929 2.79312C17.3783 2.20776 18.1722 1.87891 19 1.87891C19.8278 1.87891 20.6217 2.20776 21.2071 2.79312C21.7925 3.37848 22.1213 4.1724 22.1213 5.00023C22.1213 5.82805 21.7925 6.62197 21.2071 7.20733L12.7071 15.7073C12.5196 15.8949 12.2652 16.0002 12 16.0002H9C8.44772 16.0002 8 15.5525 8 15.0002V12.0002C8 11.735 8.10536 11.4807 8.29289 11.2931L16.7929 2.79312ZM19 3.87891C18.7026 3.87891 18.4174 3.99705 18.2071 4.20733L10 12.4144V14.0002H11.5858L19.7929 5.79312C20.0032 5.58283 20.1213 5.29762 20.1213 5.00023C20.1213 4.70283 20.0032 4.41762 19.7929 4.20733C19.5826 3.99705 19.2974 3.87891 19 3.87891Z"
                    fill="#F8F8FD"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.2929 4.29289C15.6834 3.90237 16.3166 3.90237 16.7071 4.29289L19.7071 7.29289C20.0976 7.68342 20.0976 8.31658 19.7071 8.70711C19.3166 9.09763 18.6834 9.09763 18.2929 8.70711L15.2929 5.70711C14.9024 5.31658 14.9024 4.68342 15.2929 4.29289Z"
                    fill="#F8F8FD"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_29464_34860">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </Link>
            <div className={styles.dash_wrapper}>
              <div className={styles.profile_detail}>
                <div className={styles.profile_img}>
                  <img
                    src={
                      generalData?.profile_pic
                        ? `${API}/${generalData?.profile_pic}`
                        : "/img/user-icon2.jpg"
                    }
                    alt=""
                    className={styles.user_profile}
                  />
                </div>
                <div className={styles.profile_content}>
                  <div className={styles.profile_description}>
                    <h2 className={styles.user_name}>
                      {" "}
                      {generalData?.first_name} {generalData?.last_name}
                    </h2>
                    {}
                    {latestCompany && Object.keys(latestCompany).length > 0 && (
                      <p className={styles.user_designation}>
                        {latestCompany?.job_title} at{" "}
                        {latestCompany?.company_name || ""}
                      </p>
                    )}
                    {generalData && (
                      <div className={styles.location_detail}>
                        <span className={styles.location_icon}>
                          <svg
                            width="18"
                            height="21"
                            viewBox="0 0 18 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M11.5 9.00051C11.5 7.61924 10.3808 6.5 9.00051 6.5C7.61924 6.5 6.5 7.61924 6.5 9.00051C6.5 10.3808 7.61924 11.5 9.00051 11.5C10.3808 11.5 11.5 10.3808 11.5 9.00051Z"
                              stroke="#7C8493"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M8.99951 19.5C7.80104 19.5 1.5 14.3984 1.5 9.06329C1.5 4.88664 4.8571 1.5 8.99951 1.5C13.1419 1.5 16.5 4.88664 16.5 9.06329C16.5 14.3984 10.198 19.5 8.99951 19.5Z"
                              stroke="#7C8493"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        <span className={styles.location_city}>
                          {generalData?.current_city_name},{" "}
                          {generalData?.current_country_name}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className={styles.edit_btn}>
                    <Link
                      href={`/job-seeker/${mode}-cv/step1`}
                      className={styles.add_icon}>
                      {t("Edit CV")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.dash_wrapper} ${styles.about_section}`}>
            <h3 className={styles.inner_heading}>About Me</h3>
            <p className={styles.inner_content} dangerouslySetInnerHTML={{__html: escapeHtml(generalData?.about).replace(/\n/g,"<br />")}}></p>
          </div>

          <div
            className={`${styles.dash_wrapper} ${styles.profile_experience}`}
          >
            <div className={styles.profile_heading}>
              <h3 className={styles.inner_heading}>{t("Experience")}</h3>
              <Link
                href={`/job-seeker/${mode}-cv/step3`}
                className={styles.add_icon}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_29464_34884)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 4C12.5523 4 13 4.44772 13 5V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V5C11 4.44772 11.4477 4 12 4Z"
                      fill="#2A3858"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4 12C4 11.4477 4.44772 11 5 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H5C4.44772 13 4 12.5523 4 12Z"
                      fill="#2A3858"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_29464_34884">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </Link>
            </div>
            {workExperienceData?.map((val, i) => {
              return (
                <div
                  key={val.id}
                  className={i > 0 ? "collapse" : ""}
                  id={i > 0 ? "experienceexample" : ""}
                >
                  <div className={styles.profile_listing}>
                    <div className={styles.profile_inner_content}>
                      <h4 className={styles.sub_heading}>{val.job_title}</h4>
                      <div className={styles.experience_list}>
                        <ul
                          className={styles.experience_list_inner}
                          style={{ gap: "7px" }}
                        >
                          <li className={styles.title}>{val.company_name}</li>
                          <li>{val.job_type_name || val.other_job_type}</li>
                          <li>
                            {moment(val.start_date).format("MMM-YY")} -{" "}
                            {val?.end_date
                              ? moment(val.end_date).format("MMM-YY")
                              : "Present"}{" "}
                            (
                            {timeGapYearMonth(
                              val.start_date,
                              val?.end_date || moment()
                            )}
                            )
                          </li>
                        </ul>
                          <span style={{ marginBottom: "0px" }}>
                        {val.city_name}, {val?.country_name}
                      </span>
                      </div>

                      <p style={{ marginBottom: "0px" }}>{t("Responsibilities")} :</p>
                      <p style={{ marginLeft: "10px", whiteSpace: "pre-wrap" }}>
                        {val.responsibilities}
                      </p>  

                      <p style={{ marginBottom: "0px" }}>{t("Achievements")} :</p>
                      <p style={{ marginLeft: "10px", whiteSpace: "pre-wrap" }}>
                        {val.achievements}
                      </p>
                      
                    </div>
                  </div>
                </div>
              );
            })}
            {workExperienceData && workExperienceData?.length > 1 && (
              <a
                href="#experienceexample"
                className={styles.show_more}
                data-bs-toggle="collapse"
                role="button"
                aria-expanded="false"
                aria-controls="collapseExample"
                onClick={() => setWorkSeeMore(!workSeeMore)}
              >
                {!workSeeMore ? t("See More") : t("See Less")}
              </a>
            )}
          </div>

          <div
            className={`${styles.dash_wrapper} ${styles.profile_experience}`}
          >
            <div className={styles.profile_heading}>
              <h3 className={styles.inner_heading}>Education</h3>
              <Link
                href={`/job-seeker/${mode}-cv/step2`}
                className={styles.add_icon}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_29464_34884)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 4C12.5523 4 13 4.44772 13 5V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V5C11 4.44772 11.4477 4 12 4Z"
                      fill="#2A3858"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4 12C4 11.4477 4.44772 11 5 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H5C4.44772 13 4 12.5523 4 12Z"
                      fill="#2A3858"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_29464_34884">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </Link>
            </div>

            {postGraduationData &&
              postGraduationData.length > 0 &&
              postGraduationData?.map((val, i) => {
                return (
                  <div
                    key={val.id}
                    className={i > 0 ? "collapse" : ""}
                    id={i > 0 ? "collapseExample" : ""}
                  >
                    <div className={styles.profile_listing}>
                      <div className={styles.profile_inner_content}>
                        <h4 className={styles.sub_heading}>
                          {val.university_name}
                        </h4>
                        <span>
                          {val.degree_level_name ||
                            val.other_degree_level ||
                            val.degree_level}
                          ,{" "}
                          {val.field_of_study_name ||
                            val.other_field_of_study ||
                            val.field_of_study}{" "}
                          {/* , {val.university_name}, {val.country_name} */}
                        </span>
                        <br />
                        <span>
                          {val.start_year} - {val.end_year}
                        </span>
                        <p
                          style={{
                            marginLeft: "10px",
                            // marginBottom: "0px"
                          }}
                        >
                          - Grade (
                          {val.grade_name || val.other_grade || val.grade})
                        </p>
                        {/* <p style={{ marginLeft: "10px" }}>
                        - Degree level (
                        {val.degree_level_name ||
                          val.other_degree_level ||
                          val.degree_level}
                        )
                      </p> */}
                      </div>
                    </div>
                  </div>
                );
              })}
            {postGraduationData &&
              universityData &&
              postGraduationData?.length +
                universityData?.length +
                certificationData?.length >
                1 && (
                <a
                  href="#collapseExample"
                  className={styles.show_more}
                  data-bs-toggle="collapse"
                  role="button"
                  aria-expanded={seeMore}
                  aria-controls="collapseExample"
                  // onClick={() => setSeeMore(prev=> !prev)}
                >
                  {!seeMore ? "See More" : "See Less"}
                  {/* Show{" "}
                  {postGraduationData?.length +
                    universityData?.length +
                    certificationData?.length}{" "}
                  more educations */}
                </a>
              )}

            {universityData &&
              universityData.length > 0 &&
              universityData?.map((val) => {
                return (
                  <div className="collapse" id="collapseExample" key={val.id}>
                    <div className={styles.profile_listing}>
                      <div className={styles.profile_inner_content}>
                        <h4 className={styles.sub_heading}>
                          {val.university_name}
                        </h4>
                        <span>
                          {val.degree_level_name ||
                            val.other_degree_level ||
                            val.degree_level}
                          ,{" "}
                          {val.field_of_study_name ||
                            val.other_field_of_study ||
                            val.field_of_study}{" "}
                          {/* , {val.university_name}, {val.country_name} */}
                        </span>
                        <br />
                        <span>
                          {val.start_year} - {val.end_year}
                        </span>
                        <p
                          style={{
                            marginLeft: "10px",
                            // marginBottom: "0px"
                          }}
                        >
                          - Grade (
                          {val.grade_name || val.other_grade || val.grade})
                        </p>
                        {/* <p style={{ marginLeft: "10px" }}>
                        - Degree level (
                        {val.degree_level_name ||
                          val.other_degree_level ||
                          val.degree_level}
                        )
                      </p> */}
                      </div>
                    </div>
                  </div>
                );
              })}

            {certificationData &&
              certificationData.length > 0 &&
              certificationData?.map((val, i) => {
                return (
                  <div className="collapse" id="collapseExample" key={val.id}>
                    <div className={styles.profile_listing}>
                      <div className={styles.profile_inner_content}>
                        <h4 className={styles.sub_heading}>
                          {val.organisation_name}
                        </h4>
                        <span>
                          {val.field_of_study_name ||
                            val.other_field_of_study ||
                            val.field_of_study}
                          {/* , {val.organisation_name}, {val.country_name} */}
                        </span>
                        <br />
                        <span>{val.graduation_year}</span>
                        <p style={{ marginLeft: "10px" }}>
                          - Topic ({val.topic})
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            {educationData && (
              <>
                <div className="collapse" id="collapseExample">
                  <div className={styles.profile_listing}>
                    <div className={styles.profile_inner_content}>
                      <h4 className={styles.sub_heading}>
                        {educationData?.high_school_name}
                      </h4>
                      <span>
                        {educationData?.graduation_certificate_name ||
                          educationData?.graduation_other_certificate ||
                          educationData?.graduation_certificate}
                      </span>
                      <br />
                      <span>{educationData?.graduation_year}</span>
                      <p style={{ marginLeft: "10px" }}>
                        - Grade (
                        {educationData?.grade_name ||
                          educationData?.graduation_other_grade ||
                          educationData?.grade}
                        )
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div
            className={`${styles.dash_wrapper} ${styles.profile_experience}`}
          >
            <div className={styles.profile_heading}>
              <h3 className={styles.inner_heading}>Skills</h3>
              <Link
                href={`/job-seeker/${mode}-cv/step4`}
                className={styles.add_icon}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_29464_34884)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 4C12.5523 4 13 4.44772 13 5V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V5C11 4.44772 11.4477 4 12 4Z"
                      fill="#2A3858"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4 12C4 11.4477 4.44772 11 5 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H5C4.44772 13 4 12.5523 4 12Z"
                      fill="#2A3858"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_29464_34884">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </Link>
            </div>
            <div className={styles.skills_box}>
              <ul className={styles.skills_list}>
                {skillsData?.map((val) => {
                  return (
                    <li key={val.id}>
                      {val.skill_name} ({getFirstLetterCapital(val.level)})
                    </li>
                  );
                })}
              </ul>
            </div>

            <h3 className={`${styles.inner_heading} ${styles.language}`}>
              Languages
            </h3>
            <div style={{ display: "flex" }}>
              <div className={styles.skills_box}>
                <ul className={styles.skills_list}>
                  {languagesData?.map((val, i) => {
                    return (
                      <li key={val.id}>
                        {val.language_name} ({getFirstLetterCapital(val.level)})
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className={styles.right_section}>
          <div className={`${styles.dash_wrapper} ${styles.additional_detail}`}>
            <h3 className={styles.inner_heading}>Additional Details</h3>
            <div className={styles.additional_detail}>
              <span className={styles.label}>Marital Status</span>
              <p className={styles.label_description}>
                {getFirstLetterCapital(generalData?.martial_status)}
              </p>
            </div>
            <div className={styles.additional_detail}>
              <span className={styles.label}>Driver License</span>
              <p className={styles.label_description}>
                {generalData?.have_driving_licence == 1 ? (
                  <span>Yes</span>
                ) : (
                  <span>No</span>
                )}
              </p>
            </div>
            <div className={styles.additional_detail}>
              <span className={`${styles.label} ${styles.location}`}>
                Location
              </span>
              {generalData && (
                <p className={styles.label_description}>
                  {generalData?.current_area_name || generalData?.current_other_area}, {generalData?.current_city_name},{" "}
                  {generalData?.current_country_name}
                </p>
              )}
            </div>
          </div>
          <div className={`${styles.dash_wrapper} ${styles.contact}`}>
            <h3 className={styles.inner_heading}>Contact Info</h3>
            <div className={styles.contact_detail}>
              <ul className={styles.contact_box}>
                <li className={styles.contact_list}>
                  <div className={styles.contact_icon}>
                    <span>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_528_23107)">
                          <path
                            d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z"
                            stroke="#7C8493"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M3 7L12 13L21 7"
                            stroke="#7C8493"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_528_23107">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </span>
                  </div>
                  <div className={styles.contact_content}>
                    <span>Email</span>
                    <a 
                      style={{ wordBreak: "break-all" }}
                      target="_blank"
                    href={`mailto: ${generalData?.contact_email}`}>
                      {generalData?.contact_email}
                    </a>
                  </div>
                </li>
                <li className={styles.contact_list}>
                  <div className={styles.contact_icon}>
                    <span>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_528_23115)">
                          <path
                            d="M16 4H8C7.44772 4 7 4.44772 7 5V19C7 19.5523 7.44772 20 8 20H16C16.5523 20 17 19.5523 17 19V5C17 4.44772 16.5523 4 16 4Z"
                            stroke="#7C8493"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M11 5H13"
                            stroke="#7C8493"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 17V17.01"
                            stroke="#25324B"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_528_23115">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </span>
                  </div>
                  <div className={styles.contact_content}>
                    <span>Phone</span>
                    <a href={"tel: "+generalData?.contact_mobile} target="_blank">
                      {phoneNumber?.formatInternational()}
                    </a>
                  </div>
                </li>
                <li className={styles.contact_list}>
                <div className={styles.contact_icon}>
                          <span>
                            <svg width="24" height="24" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <g clip-path="url(#clip0_186_11517)">
                                <rect width="512" height="512" rx="70" fill="rgb(124, 132, 147)" />
                                <path d="M442.182 0H69.8182C51.3013 0 33.5427 7.35582 20.4493 20.4493C7.35582 33.5427 0 51.3013 0 69.8182L0 442.182C0 460.699 7.35582 478.457 20.4493 491.551C33.5427 504.644 51.3013 512 69.8182 512H442.182C460.699 512 478.457 504.644 491.551 491.551C504.644 478.457 512 460.699 512 442.182V69.8182C512 51.3013 504.644 33.5427 491.551 20.4493C478.457 7.35582 460.699 0 442.182 0ZM174.545 405.178C174.549 406.598 174.273 408.005 173.732 409.317C173.192 410.63 172.397 411.823 171.395 412.829C170.392 413.834 169.201 414.632 167.89 415.176C166.578 415.72 165.173 416 163.753 416H117.76C116.338 416.004 114.929 415.727 113.614 415.184C112.299 414.642 111.105 413.845 110.099 412.839C109.094 411.833 108.297 410.639 107.754 409.324C107.212 408.009 106.934 406.6 106.938 405.178V212.364C106.938 209.494 108.078 206.741 110.108 204.711C112.137 202.682 114.89 201.542 117.76 201.542H163.753C166.618 201.55 169.363 202.693 171.386 204.722C173.409 206.75 174.545 209.499 174.545 212.364V405.178ZM140.742 183.273C132.111 183.273 123.675 180.714 116.499 175.919C109.323 171.124 103.73 164.309 100.427 156.335C97.1243 148.362 96.2602 139.588 97.9439 131.123C99.6276 122.659 103.784 114.883 109.886 108.781C115.989 102.678 123.764 98.5222 132.229 96.8385C140.693 95.1547 149.467 96.0189 157.441 99.3216C165.414 102.624 172.229 108.217 177.024 115.393C181.819 122.569 184.378 131.006 184.378 139.636C184.378 151.209 179.781 162.309 171.597 170.492C163.414 178.675 152.315 183.273 140.742 183.273ZM414.953 405.935C414.957 407.242 414.702 408.538 414.203 409.746C413.705 410.955 412.972 412.054 412.047 412.978C411.123 413.903 410.024 414.636 408.816 415.134C407.607 415.633 406.311 415.888 405.004 415.884H355.549C354.241 415.888 352.946 415.633 351.737 415.134C350.528 414.636 349.43 413.903 348.505 412.978C347.581 412.054 346.848 410.955 346.35 409.746C345.851 408.538 345.596 407.242 345.6 405.935V315.607C345.6 302.109 349.556 256.495 310.313 256.495C279.913 256.495 273.716 287.709 272.495 301.731V406.051C272.495 408.665 271.467 411.173 269.632 413.035C267.798 414.897 265.304 415.962 262.691 416H214.924C213.618 416 212.326 415.742 211.121 415.242C209.915 414.742 208.82 414.008 207.899 413.084C206.977 412.16 206.247 411.063 205.75 409.856C205.254 408.649 205 407.356 205.004 406.051V211.52C205 210.215 205.254 208.922 205.75 207.715C206.247 206.508 206.977 205.411 207.899 204.487C208.82 203.562 209.915 202.829 211.121 202.329C212.326 201.828 213.618 201.571 214.924 201.571H262.691C265.33 201.571 267.86 202.619 269.726 204.485C271.592 206.351 272.64 208.881 272.64 211.52V228.335C283.927 211.375 300.655 198.342 336.349 198.342C415.418 198.342 414.895 272.175 414.895 312.727L414.953 405.935Z" fill="white" />
                              </g>
                              <defs>
                                <clipPath id="clip0_186_11517">
                                  <rect width="512" height="512" rx="70" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </span>
                        </div>
                  <div className={styles.contact_content} style={{width: "calc(100% - 40px)"}}>
                    <span>LinkedIn</span>
                    <a href={generalData?.linked_in ?? "#"} target="_blank" style={{wordWrap: "break-word"}}>
                      {generalData?.linked_in && generalData?.linked_in != "null" ? generalData?.linked_in : "--"}
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className={`${styles.download_button} dropdown show`}>
            {/* <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Dropdown link
            </a> */}
            <button
              type="button"
              className={`${styles.btn_primary} btn btn-primary dropdown-toggle`}
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              onClick={() => setShow(!show)}
            >
              Download CV
            </button>

            <div className={`dropdown-menu ${show ? "show" : ""} w-100`} onBlur={() => setShow(false)}>
              <button className="dropdown-item" onClick={downloadCvHandler1}>Download CV - Format 1</button>
              <button className="dropdown-item" onClick={downloadCvHandler2}>Download CV - Format 2</button>
              <button className="dropdown-item" onClick={downloadCvHandler3}>Download CV - Format 3</button>
            </div>
          </div>

          {/* <div className={styles.download_button}>
            <button
              type="button"
              className={`${styles.btn_primary} btn btn-primary`}
             
            >
              Download CV
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default CvStep5;
