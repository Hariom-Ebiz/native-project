import React, { useEffect, useState } from "react";
import modalStyles from "@/styles/login_signup.module.css";
import styles from "@/styles/job_seeker_dashborad.module.css";
import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import { createAxiosCookies } from "@/fn";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { setModal, unsetModal } from "@/store/siteSlice";
import { useDispatch } from "react-redux";
import Link from "next/link";

const Dashboard = ({}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { cvStep } = useSelector((store) => store.auth);

  useEffect(() => {
    dispatch(
      setModal(
        <>
          <div className="modal_inner">
            <div className={modalStyles.icon_block}>
              <img src="/img/error.png" alt="" />
            </div>
            <h3 className="modal_heading_formate">
              “We are now in the <strong>Testing Phase!</strong> so only{" "}
              <a
                href="#!"
                onClick={() => {
                  router.replace("/course?query=true");
                  dispatch(unsetModal());
                }}
              >
                Career Coaching
              </a>{" "}
              &amp;
              <a
                href="#!"
                onClick={() => {
                  cvStep === 5
                    ? router.replace("/job-seeker/view-cv")
                    : router.replace("/job-seeker/create-cv/step1");
                  dispatch(unsetModal());
                }}
              >
                {" "}
                CV Builder
              </a>{" "}
              sections are currently working”
            </h3>
            <div className="popup_btn_bottom">
              <button
                type="submit"
                // className="link_btn"
                className="btn-primary w-100"
                onClick={() => {
                  router.replace("/course?query=true");
                  dispatch(unsetModal());
                }}
              >
                Career Coaching
              </button>
              <button
                type="submit"
                // className="link_btn"
                className="btn-primary w-100 "
                onClick={() => {
                  cvStep === 5
                    ? router.replace("/job-seeker/view-cv")
                    : router.replace("/job-seeker/create-cv/step1");
                  dispatch(unsetModal());
                }}
              >
                CV Builder
              </button>
            </div>
          </div>
        </>
      )
    );
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (cvStep && cvStep !== 5) {
        document.getElementById("popupModelOpener")?.click();
      }
    }, 500);
  }, [cvStep]);

  return (
    <>
      <JobSeekerAuth data={{ title: "Dashboard" }} />
      {/* <button
          id="popupModelOpener"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#popupModel"
        >
          Save
        </button>
        <div
          className={`modal fade ${modalStyles.successfull_popup}`}
          id="popupModel"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className={`${modalStyles.modal_content} modal-content`}>
              <div className={`${modalStyles.modal_body} modal-body`}>
                <div className={modalStyles.modal_inner}>
                  <div className={modalStyles.icon_block}>
                    <img src="/img/icon.png" alt="" />
                  </div>
                  <h3>For best results please complete your CV</h3>
                  <button
                    type="button"
                    onClick={() => {
                      document.getElementById("popupModelOpener").click();
                      router.push("/job-seeker/create-cv/step1");
                    }}
                    className={`${modalStyles.btn_primary} w-100`}
                  >
                    Open CV Builder
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      document.getElementById("popupModelOpener").click();
                    }}
                    className={`${modalStyles.btn_secondary} w-100`}
                  >
                    Skip
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </JobSeekerAuth> */}

      <div className="page_container">
        <div className="main_content main_bg" id="body_lang_css">
          <div className={`${styles.tabs_wrapper} all_tabs`}>
            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`${styles.nav_link} nav-link`}
                  id="pills-home-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-home"
                  type="button"
                  role="tab"
                  aria-controls="pills-home"
                  aria-selected="false"
                >
                  Job’s Roadway
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`${styles.nav_link} nav-link active`}
                  id="pills-profile-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-profile"
                  type="button"
                  role="tab"
                  aria-controls="pills-profile"
                  aria-selected="true"
                >
                  {" "}
                  Career Roadway{" "}
                </button>
              </li>
            </ul>
            <div className="tab-content" id="pills-tabContent">
              <div
                className="tab-pane fade show"
                id="pills-home"
                role="tabpanel"
                aria-labelledby="pills-home-tab"
                tabIndex="0"
              >
                <div className={styles.company_message_box}>
                  <h3 className={styles.company_message_title}>
                    Good morning, John
                  </h3>
                  <p className={styles.message_info}>
                    Here is your job listings statistic report from April 21 -
                    April 28.
                  </p>
                </div>

                <div className="row g-3">
                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div className={styles.card_box_white}>
                      <h2 className={styles.box_heading}>Total Jobs Applied</h2>
                      <span className={styles.count_digit}>45</span>
                      <div className={styles.img_box_right}>
                        <img src="../img/dashbox.png" alt="#" />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div
                      className={`${styles.card_box_white} ${styles.dark_box}`}
                    >
                      <h2 className={styles.box_heading}>Saved Jobs</h2>
                      <span className={styles.count_digit}>100</span>
                      <div className={styles.img_box_right}>
                        <img src="../img/dashbox.png" alt="#" />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div
                      className={`${styles.card_box_white} ${styles.box_light}`}
                    >
                      <h2 className={styles.box_heading}>Total Jobs Applied</h2>

                      <div className="text-start">
                        <img src="../img/last-chart.png" alt="#" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.Recent_Lessons_History_wrapper}>
                  <div className={styles.Recent_Lessons_History_block}>
                    <div className={styles.Recent_Lessons_head_box}>
                      <h2 className={styles.Recent_Lesson_text}>
                        Recent Lessons History
                      </h2>
                    </div>
                    <div
                      className={`${styles.tebal_box} ${styles.tbl_mobile_view}`}
                    >
                      <div className="table-responsiv">
                        <table className={` ${styles.table} table`}>
                          <tbody>
                            <tr className={styles.main_comaputer_wrapper_block}>
                              <td>
                                <div className={styles.computer_network_box}>
                                  <div className={styles.comapny_img}>
                                    <img
                                      src="../img/Company-img.png"
                                      alt="Company-img"
                                    />
                                  </div>
                                  <div className={styles.course_usr_box}>
                                    <h3 className={styles.course_usr_name}>
                                      Social Media Assistant
                                    </h3>
                                    <div className={styles.job_details}>
                                      <span>Nomad</span>
                                      <span>Paris, France</span>
                                      <span>Full-Time</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className={styles.course_usr_box}>
                                  <h3 className={styles.apply_date}>
                                    Date Applied
                                  </h3>
                                  <span className={styles.Lesson_neme}>
                                    24 July 2021
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div className={styles.mobile_link}>
                                  <a
                                    href="javascript:void(0);"
                                    className={styles.course_usr_box}
                                  >
                                    In Review
                                  </a>
                                </div>
                              </td>
                              <td>
                                <div className={`${styles.dropdown} dropdown`}>
                                  <button
                                    className={`${styles.dropdown_toggle} btn dropdown-toggle`}
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <span className={styles.more_icon_button}>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                      >
                                        <path d="M4.5 10.5C3.675 10.5 3 11.175 3 12C3 12.825 3.675 13.5 4.5 13.5C5.325 13.5 6 12.825 6 12C6 11.175 5.325 10.5 4.5 10.5ZM19.5 10.5C18.675 10.5 18 11.175 18 12C18 12.825 18.675 13.5 19.5 13.5C20.325 13.5 21 12.825 21 12C21 11.175 20.325 10.5 19.5 10.5ZM12 10.5C11.175 10.5 10.5 11.175 10.5 12C10.5 12.825 11.175 13.5 12 13.5C12.825 13.5 13.5 12.825 13.5 12C13.5 11.175 12.825 10.5 12 10.5Z"></path>
                                      </svg>
                                    </span>
                                  </button>
                                  <ul
                                    className={`${styles.dropdown_menu_end} dropdown-menu`}
                                  >
                                    <li>
                                      <a
                                        className="dropdown-item"
                                        href="javascript:void(0);"
                                      >
                                        Action
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item"
                                        href="javascript:void(0);"
                                      >
                                        Another action
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item"
                                        href="javascript:void(0);"
                                      >
                                        Something else here
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </td>
                            </tr>

                            <tr
                              className={
                                styles.main_comaputer_wrapper_block_second
                              }
                            >
                              <td>
                                <div className={styles.computer_network_box}>
                                  <div className={styles.comapny_img}>
                                    <img
                                      src="../img/Company-img.png"
                                      alt="Company-img"
                                    />
                                  </div>
                                  <div className={styles.course_usr_box}>
                                    <h3 className={styles.course_usr_name}>
                                      Social Media Assistant
                                    </h3>
                                    <div className={styles.job_details}>
                                      <span>Nomad</span>
                                      <span>Paris, France</span>
                                      <span>Full-Time</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className={styles.course_usr_box}>
                                  <h3 className={styles.apply_date}>
                                    Date Applied
                                  </h3>
                                  <span className={styles.Lesson_neme}>
                                    24 July 2021
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div className={styles.mobile_link}>
                                  <a
                                    href="javascript:void(0);"
                                    className={styles.course_usr_box}
                                  >
                                    Approved
                                  </a>
                                </div>
                              </td>
                              <td>
                                <div className={`${styles.dropdown} dropdown`}>
                                  <button
                                    className={`${styles.dropdown_toggle} btn dropdown-toggle`}
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <span className={styles.more_icon_button}>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                      >
                                        <path d="M4.5 10.5C3.675 10.5 3 11.175 3 12C3 12.825 3.675 13.5 4.5 13.5C5.325 13.5 6 12.825 6 12C6 11.175 5.325 10.5 4.5 10.5ZM19.5 10.5C18.675 10.5 18 11.175 18 12C18 12.825 18.675 13.5 19.5 13.5C20.325 13.5 21 12.825 21 12C21 11.175 20.325 10.5 19.5 10.5ZM12 10.5C11.175 10.5 10.5 11.175 10.5 12C10.5 12.825 11.175 13.5 12 13.5C12.825 13.5 13.5 12.825 13.5 12C13.5 11.175 12.825 10.5 12 10.5Z"></path>
                                      </svg>
                                    </span>
                                  </button>
                                  <ul
                                    className={`${styles.dropdown_menu_end} dropdown-menu`}
                                  >
                                    <li>
                                      <a
                                        className="dropdown-item"
                                        href="javascript:void(0);"
                                      >
                                        Action
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item"
                                        href="javascript:void(0);"
                                      >
                                        Another action
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item"
                                        href="javascript:void(0);"
                                      >
                                        Something else here
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </td>
                            </tr>
                            <tr className={styles.main_comaputer_wrapper_block}>
                              <td>
                                <div className={styles.computer_network_box}>
                                  <div className={styles.comapny_img}>
                                    <img
                                      src="../img/Company-img.png"
                                      alt="Company-img"
                                    />
                                  </div>
                                  <div className={styles.course_usr_box}>
                                    <h3 className={styles.course_usr_name}>
                                      Social Media Assistant
                                    </h3>
                                    <div className={styles.job_details}>
                                      <span>Nomad</span>
                                      <span>Paris, France</span>
                                      <span>Full-Time</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className={styles.course_usr_box}>
                                  <h3 className={styles.apply_date}>
                                    Date Applied
                                  </h3>
                                  <span className={styles.Lesson_neme}>
                                    24 July 2021
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div className={styles.mobile_link}>
                                  <a
                                    href="javascript:void(0);"
                                    className={`${styles.course_usr_box} ${styles.unlocked}`}
                                  >
                                    Unlocked
                                  </a>
                                </div>
                              </td>
                              <td>
                                <div className={`${styles.dropdown} dropdown`}>
                                  <button
                                    className={`${styles.dropdown_toggle} btn dropdown-toggle`}
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <span className={styles.more_icon_button}>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                      >
                                        <path d="M4.5 10.5C3.675 10.5 3 11.175 3 12C3 12.825 3.675 13.5 4.5 13.5C5.325 13.5 6 12.825 6 12C6 11.175 5.325 10.5 4.5 10.5ZM19.5 10.5C18.675 10.5 18 11.175 18 12C18 12.825 18.675 13.5 19.5 13.5C20.325 13.5 21 12.825 21 12C21 11.175 20.325 10.5 19.5 10.5ZM12 10.5C11.175 10.5 10.5 11.175 10.5 12C10.5 12.825 11.175 13.5 12 13.5C12.825 13.5 13.5 12.825 13.5 12C13.5 11.175 12.825 10.5 12 10.5Z"></path>
                                      </svg>
                                    </span>
                                  </button>
                                  <ul
                                    className={`${styles.dropdown_menu_end} dropdown-menu`}
                                  >
                                    <li>
                                      <a
                                        className="dropdown-item"
                                        href="javascript:void(0);"
                                      >
                                        Action
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item"
                                        href="javascript:void(0);"
                                      >
                                        Another action
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item"
                                        href="javascript:void(0);"
                                      >
                                        Something else here
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className={styles.Load_More_btn}>
                      <a href="javascript:void(0);">
                        Load More
                        <span className={styles.more_icon_button}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                          >
                            <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                          </svg>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="tab-pane fade show active"
                id="pills-profile"
                role="tabpanel"
                aria-labelledby="pills-profile-tab"
                tabIndex="0"
              >
                <div className={styles.company_message_box}>
                  <h3 className={styles.company_message_title}>
                    Good morning, John
                  </h3>
                  <p className={styles.message_info}>
                    Here is your job listings statistic report from April 21 -
                    April 28.
                  </p>
                </div>

                <div className="row g-3">
                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div
                      className={`${styles.card_box_white} ${styles.dark_box}`}
                    >
                      <h2 className={styles.box_heading}>
                        Total Coaching Journey Lessons
                      </h2>
                      <span className={styles.count_digit}>45</span>
                      <div className={styles.img_box_right}>
                        <img src="../img/dashbox.png" alt="#" />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div
                      className={`${styles.card_box_white} ${styles.red_box}`}
                    >
                      <h2 className={styles.box_heading}>
                        Total Standout Journey Lessons
                      </h2>
                      <span className={styles.count_digit}>100</span>
                      <div className={styles.img_box_right}>
                        <img src="../img/dashbox.png" alt="#" />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div
                      className={`${styles.card_box_white} ${styles.box_light}`}
                    >
                      <h2 className={styles.box_heading}>Your Results</h2>

                      <div className="text-start">
                        <img src="../img/last-chart.png" alt="#" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.Recent_Lessons_History_wrapper}>
                  <div className={styles.Recent_Lessons_History_block}>
                    <div className={styles.Recent_Lessons_head_box}>
                      <h2 className={styles.Recent_Lesson_text}>
                        Recent Lessons History
                      </h2>
                    </div>
                    <div
                      className={`${styles.tebal_box} ${styles.tbl_mobile_view}`}
                    >
                      <div className="table-responsiv">
                        <table className={` ${styles.table} table`}>
                          <tbody>
                            <tr className={styles.main_comaputer_wrapper_block}>
                              <td>
                                <div className={styles.computer_network_box}>
                                  <div className={styles.comapny_img}>
                                    <img
                                      src="../img/Company-img.png"
                                      alt="Company-img"
                                    />
                                  </div>
                                  <div className={styles.course_usr_box}>
                                    <h3 className={styles.course_usr_name}>
                                      Social Media Assistant
                                    </h3>
                                    <div className={styles.job_details}>
                                      <span>Nomad</span>
                                      <span>Paris, France</span>
                                      <span>Full-Time</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className={styles.course_usr_box}>
                                  <h3 className={styles.apply_date}>
                                    Date Applied
                                  </h3>
                                  <span className={styles.Lesson_neme}>
                                    24 July 2021
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div className={styles.mobile_link}>
                                  <a
                                    href="javascript:void(0);"
                                    className={styles.course_usr_box}
                                  >
                                    In Review
                                  </a>
                                </div>
                              </td>
                              <td>
                                <div className={`${styles.dropdown} dropdown`}>
                                  <button
                                    className={`${styles.dropdown_toggle} btn dropdown-toggle`}
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <span className={styles.more_icon_button}>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                      >
                                        <path d="M4.5 10.5C3.675 10.5 3 11.175 3 12C3 12.825 3.675 13.5 4.5 13.5C5.325 13.5 6 12.825 6 12C6 11.175 5.325 10.5 4.5 10.5ZM19.5 10.5C18.675 10.5 18 11.175 18 12C18 12.825 18.675 13.5 19.5 13.5C20.325 13.5 21 12.825 21 12C21 11.175 20.325 10.5 19.5 10.5ZM12 10.5C11.175 10.5 10.5 11.175 10.5 12C10.5 12.825 11.175 13.5 12 13.5C12.825 13.5 13.5 12.825 13.5 12C13.5 11.175 12.825 10.5 12 10.5Z"></path>
                                      </svg>
                                    </span>
                                  </button>
                                  <ul
                                    className={`${styles.dropdown_menu_end} dropdown-menu`}
                                  >
                                    <li>
                                      <a
                                        className="dropdown-item"
                                        href="javascript:void(0);"
                                      >
                                        Action
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item"
                                        href="javascript:void(0);"
                                      >
                                        Another action
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item"
                                        href="javascript:void(0);"
                                      >
                                        Something else here
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </td>
                            </tr>

                            <tr
                              className={
                                styles.main_comaputer_wrapper_block_second
                              }
                            >
                              <td>
                                <div className={styles.computer_network_box}>
                                  <div className={styles.comapny_img}>
                                    <img
                                      src="../img/Company-img.png"
                                      alt="Company-img"
                                    />
                                  </div>
                                  <div className={styles.course_usr_box}>
                                    <h3 className={styles.course_usr_name}>
                                      Social Media Assistant
                                    </h3>
                                    <div className={styles.job_details}>
                                      <span>Nomad</span>
                                      <span>Paris, France</span>
                                      <span>Full-Time</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className={styles.course_usr_box}>
                                  <h3 className={styles.apply_date}>
                                    Date Applied
                                  </h3>
                                  <span className={styles.Lesson_neme}>
                                    24 July 2021
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div className={styles.mobile_link}>
                                  <a
                                    href="javascript:void(0);"
                                    className={styles.course_usr_box}
                                  >
                                    Approved
                                  </a>
                                </div>
                              </td>
                              <td>
                                <div className={`${styles.dropdown} dropdown`}>
                                  <button
                                    className={`${styles.dropdown_toggle} btn dropdown-toggle`}
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <span className={styles.more_icon_button}>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                      >
                                        <path d="M4.5 10.5C3.675 10.5 3 11.175 3 12C3 12.825 3.675 13.5 4.5 13.5C5.325 13.5 6 12.825 6 12C6 11.175 5.325 10.5 4.5 10.5ZM19.5 10.5C18.675 10.5 18 11.175 18 12C18 12.825 18.675 13.5 19.5 13.5C20.325 13.5 21 12.825 21 12C21 11.175 20.325 10.5 19.5 10.5ZM12 10.5C11.175 10.5 10.5 11.175 10.5 12C10.5 12.825 11.175 13.5 12 13.5C12.825 13.5 13.5 12.825 13.5 12C13.5 11.175 12.825 10.5 12 10.5Z"></path>
                                      </svg>
                                    </span>
                                  </button>
                                  <ul
                                    className={`${styles.dropdown_menu_end} dropdown-menu`}
                                  >
                                    <li>
                                      <a
                                        className="dropdown-item"
                                        href="javascript:void(0);"
                                      >
                                        Action
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item"
                                        href="javascript:void(0);"
                                      >
                                        Another action
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item"
                                        href="javascript:void(0);"
                                      >
                                        Something else here
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </td>
                            </tr>
                            <tr className={styles.main_comaputer_wrapper_block}>
                              <td>
                                <div className={styles.computer_network_box}>
                                  <div className={styles.comapny_img}>
                                    <img
                                      src="../img/Company-img.png"
                                      alt="Company-img"
                                    />
                                  </div>
                                  <div className={styles.course_usr_box}>
                                    <h3 className={styles.course_usr_name}>
                                      Social Media Assistant
                                    </h3>
                                    <div className={styles.job_details}>
                                      <span>Nomad</span>
                                      <span>Paris, France</span>
                                      <span>Full-Time</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className={styles.course_usr_box}>
                                  <h3 className={styles.apply_date}>
                                    Date Applied
                                  </h3>
                                  <span className={styles.Lesson_neme}>
                                    24 July 2021
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div className={styles.mobile_link}>
                                  <a
                                    href="javascript:void(0);"
                                    className={`${styles.course_usr_box} ${styles.unlocked}`}
                                  >
                                    Unlocked
                                  </a>
                                </div>
                              </td>
                              <td>
                                <div className={`${styles.dropdown} dropdown`}>
                                  <button
                                    className={`${styles.dropdown_toggle} btn dropdown-toggle`}
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <span className={styles.more_icon_button}>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                      >
                                        <path d="M4.5 10.5C3.675 10.5 3 11.175 3 12C3 12.825 3.675 13.5 4.5 13.5C5.325 13.5 6 12.825 6 12C6 11.175 5.325 10.5 4.5 10.5ZM19.5 10.5C18.675 10.5 18 11.175 18 12C18 12.825 18.675 13.5 19.5 13.5C20.325 13.5 21 12.825 21 12C21 11.175 20.325 10.5 19.5 10.5ZM12 10.5C11.175 10.5 10.5 11.175 10.5 12C10.5 12.825 11.175 13.5 12 13.5C12.825 13.5 13.5 12.825 13.5 12C13.5 11.175 12.825 10.5 12 10.5Z"></path>
                                      </svg>
                                    </span>
                                  </button>
                                  <ul
                                    className={`${styles.dropdown_menu_end} dropdown-menu`}
                                  >
                                    <li>
                                      <a
                                        className="dropdown-item"
                                        href="javascript:void(0);"
                                      >
                                        Action
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item"
                                        href="javascript:void(0);"
                                      >
                                        Another action
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item"
                                        href="javascript:void(0);"
                                      >
                                        Something else here
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className={styles.Load_More_btn}>
                      <a href="javascript:void(0);">
                        Load More
                        <span className={styles.more_icon_button}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                          >
                            <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                          </svg>
                        </span>
                      </a>
                    </div>
                  </div>
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

  return {
    props: {
      isProtected: true,
      roles: [1],
    },
  };
}

export default Dashboard;
