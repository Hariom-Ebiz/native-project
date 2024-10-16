import React, { useEffect, useState } from "react";
import styles from "@/styles/edit_cv_steps.module.css";
import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import { createAxiosCookies } from "@/fn";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import useRequest from "@/hooks/useRequest";
import { API } from "@/api";
import moment from "moment";


const Step5 = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    unregister,
    watch,
  } = useForm();

  const { loggedIn, userId } = useSelector((store) => store.auth);
  const [generalData, setGeneralData] = useState([]);
  const [languagesData, setLanguagesData] = useState([]);
  const [careerPrefrenceData, setCareerPrefrenceData] = useState([]);
  const [certificationData, setCertificationData] = useState([]);
  const [educationData, setEducationData] = useState([]);
  const [postGraduationData, setPostGraduationData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [universityData, setUniversityData] = useState([]);
  const [workExperienceData, setWorkExperienceData] = useState([]);

  const { request, response } = useRequest();

  // useEffect(() => {
  //   request("GET", "job-seeker-cv/get-complete");
  // }, []);
  useEffect(() => {
    if (!loggedIn || !userId) return;
    request("GET", "job-seeker-cv/get-complete");
  }, [loggedIn]);

  useEffect(() => {
    if (response && response.status);
    setGeneralData(response?.data?.general);
    setLanguagesData(response?.data?.languages);
    setCareerPrefrenceData(response?.data?.careerPrefrence);
    setCertificationData(response?.data?.certification);
    setEducationData(response?.data?.education);
    setPostGraduationData(response?.data?.postGraduation);
    setSkillsData(response?.data?.skills);
    setUniversityData(response?.data?.university);
    setWorkExperienceData(response?.data?.workExperience);
  }, [response]);

  return (
    <JobSeekerAuth data={{ title: "Edit CV" }}>
      <div className="page_container">
        <div className="main_content main_bg" id="body_lang_css">
        <div className="row">
                  <div className="col-md-8">
                    <div className={styles.cv_dashboard}>
                      <div className={styles.profile_bg_img}>
                        <figure>
                          <img
                            src={`${API}/${generalData?.cover_pic}`}
                            alt=""
                            className={styles.img_wrapper}
                          />
                        </figure>
                        <a className={styles.edit_icon} href="#">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clip-path="url(#clip0_29464_34860)">
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
                        </a>
                        <div className={styles.dash_wrapper}>
                          <div className={styles.profile_detail}>
                            <div className={styles.profile_img}>
                              <img
                                src={`${API}/${generalData?.profile_pic}`}
                                alt=""
                                className={styles.user_profile}
                              />
                            </div>
                            <div className={styles.profile_content}>
                              <div className={styles.profile_description}>
                                <h2 className={styles.user_name}>
                                  {" "}
                                  {generalData?.first_name}{" "}
                                  {generalData?.last_name}
                                </h2>
                                <p className={styles.user_designation}>
                                  {workExperienceData?.map((val, i) => {
                                    return (
                                      <>
                                        {val.job_title} at{" "}
                                        <b>{val.company_name}</b>
                                      </>
                                    );
                                  })}
                                </p>
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
                              </div>
                              <div className={styles.edit_btn}>
                                <Link
                                  href="/job-seeker/edit-cv/step1"
                                  className={styles.add_icon}
                                >
                                  Edit CV
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`${styles.dash_wrapper} ${styles.about_section}`}
                      >
                        <h3 className={styles.inner_heading}>About Me</h3>
                        <p className={styles.inner_content}>
                          {generalData?.about}
                        </p>
                      </div>

                      <div
                        className={`${styles.dash_wrapper} ${styles.profile_experience}`}
                      >
                        <div className={styles.profile_heading}>
                          <h3 className={styles.inner_heading}>Experiences</h3>
                          <a href="#" className={styles.add_icon}>
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clip-path="url(#clip0_29464_34884)">
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
                          </a>
                        </div>
                        <div className={styles.profile_listing}>
                          {workExperienceData?.map((val, i) => {
                            return (
                              <>
                                <div className={styles.profile_list_img}>
                                  <img src="../../img/twitter.png" alt="" />
                                </div>
                                <div className={styles.profile_inner_content}>
                                  <h4 className={styles.sub_heading}>
                                    {val.job_title}
                                  </h4>
                                  <div className={styles.experience_list}>
                                    <ul
                                      className={styles.experience_list_inner}
                                    >
                                      <li className={styles.title}>
                                        {val.company_name}
                                      </li>
                                      <li>{val.job_type_name}</li>
                                      <li>
                                        {moment(val.start_date).format(
                                          "MMM-YY"
                                        )}{" "}
                                        -{" "}
                                        {moment(val.end_date).format("MMM-YY")}{" "}
                                        {/* (1y 1m) */}
                                      </li>
                                    </ul>
                                  </div>
                                  {/* <span>Manchester, UK</span> */}
                                  <p>Achievements : {val.achievements}</p>
                                  <p>
                                    Responsibilities : {val.responsibilities}
                                  </p>
                                </div>
                              </>
                            );
                          })}
                        </div>
                        <a
                          href="#experienceexample"
                          className={styles.show_more}
                          data-bs-toggle="collapse"
                          role="button"
                          aria-expanded="false"
                          aria-controls="collapseExample"
                        >
                          Show 3 more experiences
                        </a>
                        {/* 
                        <div className="collapse" id="experienceexample">
                          <div className={styles.profile_listing}>
                            <div className={styles.profile_list_img}>
                              <img src="../../img/twitter.png" alt="" />
                            </div>
                            <div className="profile_inner_content">
                              <h4 className="sub-heading">Product Designer</h4>
                              <div className="experience_list">
                                <ul className="experience_list_inner">
                                  <li className="title">Twitter</li>
                                  <li>Full-Time</li>
                                  <li>Jun 2019 - Present (1y 1m)</li>
                                </ul>
                              </div>
                              <span>Manchester, UK</span>
                              <p>
                                Created and executed social media plan for 10
                                brands utilizing multiple features and content
                                types to increase brand outreach, engagement,
                                and leads.
                              </p>
                            </div>
                          </div>
                        </div> */}
                      </div>

                      <div
                        className={`${styles.dash_wrapper} ${styles.profile_experience}`}
                      >
                        <div className={styles.profile_heading}>
                          <h3 className={styles.inner_heading}>Educations</h3>
                          <a href="#" className={styles.add_icon}>
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clip-path="url(#clip0_29464_34884)">
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
                          </a>
                        </div>
                        <div className={styles.profile_listing}>
                          {universityData?.map((val) => {
                            return (
                              <>
                                <div className={styles.profile_list_img}>
                                  <img src="../../img/education.png" alt="" />
                                </div>
                                <div className={styles.profile_inner_content}>
                                  <h4 className={styles.sub_heading}>
                                    {val.university_name}
                                  </h4>
                                  <ul className={styles.experience_list_inner}>
                                    <li>
                                      Postgraduate degree, Applied Psychology
                                    </li>
                                  </ul>
                                  <span>2010 - 2012</span>
                                  <p>
                                    As an Applied Psychologist in the field of
                                    Consumer and Society, I am specialized in
                                    creating business opportunities by
                                    observing, analysing, researching and
                                    changing behaviour.
                                  </p>
                                </div>
                              </>
                            );
                          })}
                        </div>
                        <a
                          href="#collapseExample"
                          className={styles.show_more}
                          data-bs-toggle="collapse"
                          role="button"
                          aria-expanded="false"
                          aria-controls="collapseExample"
                        >
                          Show 2 more educations
                        </a>
                        {/* 
                        <div className="collapse" id="collapseExample">
                          <div className={styles.profile_listing}>
                            <div className={styles.profile_list_img}>
                              <img src="../../img/education.png" alt="" />
                            </div>
                            <div className={styles.profile_inner_content}>
                              <h4 className="sub-heading">
                                Harvard University
                              </h4>
                              <ul className="experience_list_inner">
                                <li>Postgraduate degree, Applied Psychology</li>
                              </ul>
                              <span>2010 - 2012</span>
                              <p>
                                As an Applied Psychologist in the field of
                                Consumer and Society, I am specialized in
                                creating business opportunities by observing,
                                analysing, researching and changing behaviour.
                              </p>
                            </div>
                          </div>
                        </div> */}
                      </div>

                      <div
                        className={`${styles.dash_wrapper} ${styles.profile_experience}`}
                      >
                        <div className={styles.profile_heading}>
                          <h3 className={styles.inner_heading}>Skills</h3>
                          <a href="#" className={styles.add_icon}>
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clip-path="url(#clip0_29464_34884)">
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
                          </a>
                        </div>
                        <div className={styles.skills_box}>
                          <ul className={styles.skills_list}>
                            {skillsData?.map((val) => {
                              return <li key={val.id}>{val.skill_name}</li>;
                            })}
                          </ul>
                        </div>

                        <h3
                          className={`${styles.inner_heading} ${styles.language}`}
                        >
                          Languages
                        </h3>
                        <div className={styles.lang_detail}>
                          <span>
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clip-path="url(#clip0_29464_50394)">
                                <path
                                  d="M5 7H12M10 5V7C10 9.12173 9.47322 11.1566 8.53553 12.6569C7.59785 14.1571 6.32608 15 5 15M6 11C5.99834 12.0318 6.69452 13.0241 7.94307 13.7695C9.19163 14.5149 10.896 14.9558 12.7 15"
                                  stroke="#7C8493"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M11 19L15 10L19 19M18.1 17H11.9"
                                  stroke="#7C8493"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_29464_50394">
                                  <rect width="24" height="24" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </span>
                          <span className={styles.lang_content}>
                          {languagesData?.map((val, i) => {
                        return (
                          <>
                            <span key={val.id}>{val.skill_name}
                            {i === languagesData?.length - 1
                              ? " "
                              : ", "}
                              </span>
                          </>
                        );
                      })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className={styles.right_section}>
                      <div
                        className={`${styles.dash_wrapper} ${styles.additional_detail}`}
                      >
                        <h3 className={styles.inner_heading}>
                          Additional Details
                        </h3>
                        <div className={styles.additional_detail}>
                          <span className={styles.label}>Marital Status</span>
                          <p className={styles.label_description}>
                            {generalData?.martial_status}
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
                          <span
                            className={`${styles.label} ${styles.location}`}
                          >
                            Location
                          </span>
                          <p className={styles.label_description}>
                            {generalData?.current_country_name},{" "}
                            {generalData?.current_city_name},{" "}
                            {generalData?.current_area_name || generalData?.current_other_area}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`${styles.dash_wrapper} ${styles.contact}`}
                      >
                        <h3 className={styles.inner_heading}>
                          Additional Details
                        </h3>
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
                                    <g clip-path="url(#clip0_528_23107)">
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
                                        <rect
                                          width="24"
                                          height="24"
                                          fill="white"
                                        />
                                      </clipPath>
                                    </defs>
                                  </svg>
                                </span>
                              </div>
                              <div className={styles.contact_content}>
                                <span>Email</span>
                                <a href={generalData?.contact_email}>
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
                                    <g clip-path="url(#clip0_528_23115)">
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
                                        <rect
                                          width="24"
                                          height="24"
                                          fill="white"
                                        />
                                      </clipPath>
                                    </defs>
                                  </svg>
                                </span>
                              </div>
                              <div className={styles.contact_content}>
                                <span>Phone</span>
                                <a href="tel: +44 1245 572 135">
                                  {generalData?.contact_mobile}
                                </a>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className={styles.download_button}>
                        <button
                          type="button"
                          className={`${styles.btn_primary} btn btn-primary`}
                        >
                          Download CV
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
        </div>
      </div>
    </JobSeekerAuth>
  );
};

export async function getServerSideProps(context) {
  createAxiosCookies(context);

  return {
    props: {     
      isProtected : true,
      roles : [1]
    },
  };
}

export default Step5;
