import React, { useEffect, useState } from "react";
import modalStyles from "@/styles/login_signup.module.css";
import ProgressBar from "react-bootstrap/ProgressBar";

import styles from "@/styles/certificates.module.css";
import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import { createAxiosCookies } from "@/fn";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { setModal, unsetModal } from "@/store/siteSlice";
import { useDispatch } from "react-redux";
import Link from "next/link";
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';



const Dashboard = ({}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { cvStep, role } = useSelector((store) => store.auth);

  useEffect(() => {
    if (role == 2) {
      router.replace("/employer/dashboard");
    }
    // dispatch(
    //   setModal(
    //     <>
    //       <div className="modal_inner">
    //         <div className={modalStyles.icon_block}>
    //           <img src="/img/error.png" alt="" />
    //         </div>
    //         <h3 className="modal_heading_formate">
    //           “We are now in the <strong>Testing Phase!</strong> so only{" "}
    //           <a
    //             href="#!"
    //             onClick={() => {
    //               router.replace("/course?query=true");
    //               dispatch(unsetModal());
    //             }}
    //           >
    //             Career Coaching
    //           </a>{" "}
    //           &amp;
    //           <a
    //             href="#!"
    //             onClick={() => {
    //               cvStep === 5
    //                 ? router.replace("/job-seeker/view-cv")
    //                 : router.replace("/job-seeker/create-cv/step1");
    //               dispatch(unsetModal());
    //             }}
    //           >
    //             {" "}
    //             CV Builder
    //           </a>{" "}
    //           sections are currently working”
    //         </h3>
    //         <div className="popup_btn_bottom">
    //           <button
    //             type="submit"
    //             // className="link_btn"
    //             className="btn-primary w-100"
    //             onClick={() => {
    //               router.replace("/course?query=true");
    //               dispatch(unsetModal());
    //             }}
    //           >
    //             Career Coaching
    //           </button>
    //           <button
    //             type="submit"
    //             // className="link_btn"
    //             className="btn-primary w-100 "
    //             onClick={() => {
    //               cvStep === 5
    //                 ? router.replace("/job-seeker/view-cv")
    //                 : router.replace("/job-seeker/create-cv/step1");
    //               dispatch(unsetModal());
    //             }}
    //           >
    //             CV Builder
    //           </button>
    //         </div>
    //       </div>
    //     </>
    //   )
    // );
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
        <div className="main_content" id="body_lang_css">
                <div className={`${styles.top_btn} ${styles.mobile_space}`}>
                    <h1
                      className={`${styles.page_heading} ${styles.top_bottom_space} `}
                    >
                      Certificate Section
                    </h1>
                  </div>
                  <div className="row">
                      <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4">
                            <div className={styles.course_crad}>
                                <div className={styles.styles}>
                                      <img src="https://ns.native-career.com/uploads/images/course/Introduction.png" />
                                </div>
                                <div className={styles.main_block}>
                                    <div className={styles.course_detais}>
                                      <h3 className={styles.card_title}>certificate name</h3>
                                      <p className={styles.status_title}>Lorem Ipsum is simply</p> 
                                      <div className={styles.download_certificate}>
                                            <div class="dropdown">
                                                <button class="btn  dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M8.75 4.6875C8.75 4.44027 8.82331 4.1986 8.96066 3.99304C9.09802 3.78748 9.29324 3.62726 9.52165 3.53265C9.75005 3.43804 10.0014 3.41329 10.2439 3.46152C10.4863 3.50975 10.7091 3.6288 10.8839 3.80362C11.0587 3.97843 11.1778 4.20116 11.226 4.44364C11.2742 4.68611 11.2495 4.93745 11.1549 5.16585C11.0602 5.39426 10.9 5.58949 10.6945 5.72684C10.4889 5.86419 10.2472 5.9375 10 5.9375C9.66848 5.9375 9.35054 5.8058 9.11612 5.57138C8.8817 5.33696 8.75 5.01902 8.75 4.6875ZM10 8.75C9.75277 8.75 9.5111 8.82331 9.30554 8.96066C9.09998 9.09802 8.93976 9.29324 8.84515 9.52165C8.75054 9.75005 8.72579 10.0014 8.77402 10.2439C8.82225 10.4863 8.9413 10.7091 9.11612 10.8839C9.29093 11.0587 9.51366 11.1778 9.75614 11.226C9.99861 11.2742 10.2499 11.2495 10.4784 11.1549C10.7068 11.0602 10.902 10.9 11.0393 10.6945C11.1767 10.4889 11.25 10.2472 11.25 10C11.25 9.66848 11.1183 9.35054 10.8839 9.11612C10.6495 8.8817 10.3315 8.75 10 8.75ZM10 14.0625C9.75277 14.0625 9.5111 14.1358 9.30554 14.2732C9.09998 14.4105 8.93976 14.6057 8.84515 14.8341C8.75054 15.0626 8.72579 15.3139 8.77402 15.5564C8.82225 15.7988 8.9413 16.0216 9.11612 16.1964C9.29093 16.3712 9.51366 16.4903 9.75614 16.5385C9.99861 16.5867 10.2499 16.562 10.4784 16.4674C10.7068 16.3727 10.902 16.2125 11.0393 16.007C11.1767 15.8014 11.25 15.5597 11.25 15.3125C11.25 14.981 11.1183 14.663 10.8839 14.4286C10.6495 14.1942 10.3315 14.0625 10 14.0625Z" fill="#161D46"/>
                                                  </svg>

                                                </button>
                                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                  <li><a class="dropdown-item" href="#">View</a></li>
                                                  <li><a class="dropdown-item" href="#">Download</a></li>
                                                </ul>
                                              </div>
                                      </div>
                                    </div>
                                </div>
                            </div>
                      </div>
                      <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4">
                            <div className={styles.course_crad}>
                                <div className={styles.styles}>
                                      <img src="https://ns.native-career.com/uploads/images/course/Career Interests.jpg" />
                                </div>
                                <div className={styles.main_block}>
                                    <div className={styles.course_detais}>
                                      <h3 className={styles.card_title}>certificate name</h3>
                                      <p className={styles.status_title}>Lorem Ipsum is simply</p> 
                                      <div className={styles.download_certificate}>
                                            <div class="dropdown">
                                                <button class="btn  dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M8.75 4.6875C8.75 4.44027 8.82331 4.1986 8.96066 3.99304C9.09802 3.78748 9.29324 3.62726 9.52165 3.53265C9.75005 3.43804 10.0014 3.41329 10.2439 3.46152C10.4863 3.50975 10.7091 3.6288 10.8839 3.80362C11.0587 3.97843 11.1778 4.20116 11.226 4.44364C11.2742 4.68611 11.2495 4.93745 11.1549 5.16585C11.0602 5.39426 10.9 5.58949 10.6945 5.72684C10.4889 5.86419 10.2472 5.9375 10 5.9375C9.66848 5.9375 9.35054 5.8058 9.11612 5.57138C8.8817 5.33696 8.75 5.01902 8.75 4.6875ZM10 8.75C9.75277 8.75 9.5111 8.82331 9.30554 8.96066C9.09998 9.09802 8.93976 9.29324 8.84515 9.52165C8.75054 9.75005 8.72579 10.0014 8.77402 10.2439C8.82225 10.4863 8.9413 10.7091 9.11612 10.8839C9.29093 11.0587 9.51366 11.1778 9.75614 11.226C9.99861 11.2742 10.2499 11.2495 10.4784 11.1549C10.7068 11.0602 10.902 10.9 11.0393 10.6945C11.1767 10.4889 11.25 10.2472 11.25 10C11.25 9.66848 11.1183 9.35054 10.8839 9.11612C10.6495 8.8817 10.3315 8.75 10 8.75ZM10 14.0625C9.75277 14.0625 9.5111 14.1358 9.30554 14.2732C9.09998 14.4105 8.93976 14.6057 8.84515 14.8341C8.75054 15.0626 8.72579 15.3139 8.77402 15.5564C8.82225 15.7988 8.9413 16.0216 9.11612 16.1964C9.29093 16.3712 9.51366 16.4903 9.75614 16.5385C9.99861 16.5867 10.2499 16.562 10.4784 16.4674C10.7068 16.3727 10.902 16.2125 11.0393 16.007C11.1767 15.8014 11.25 15.5597 11.25 15.3125C11.25 14.981 11.1183 14.663 10.8839 14.4286C10.6495 14.1942 10.3315 14.0625 10 14.0625Z" fill="#161D46"/>
                                                  </svg>

                                                </button>
                                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                  <li><a class="dropdown-item" href="#">View</a></li>
                                                  <li><a class="dropdown-item" href="#">Download</a></li>
                                                </ul>
                                              </div>
                                      </div>
                                    </div>
                                </div>
                            </div>
                      </div>
                      <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4">
                            <div className={styles.course_crad}>
                                <div className={styles.styles}>
                                      <img src="https://ns.native-career.com/uploads/images/course/Introduction.png" />
                                </div>
                                <div className={styles.main_block}>
                                    <div className={styles.course_detais}>
                                      <h3 className={styles.card_title}>certificate name</h3>
                                      <p className={styles.status_title}>Lorem Ipsum is simply</p> 
                                      <div className={styles.download_certificate}>
                                            <div class="dropdown">
                                                <button class="btn  dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M8.75 4.6875C8.75 4.44027 8.82331 4.1986 8.96066 3.99304C9.09802 3.78748 9.29324 3.62726 9.52165 3.53265C9.75005 3.43804 10.0014 3.41329 10.2439 3.46152C10.4863 3.50975 10.7091 3.6288 10.8839 3.80362C11.0587 3.97843 11.1778 4.20116 11.226 4.44364C11.2742 4.68611 11.2495 4.93745 11.1549 5.16585C11.0602 5.39426 10.9 5.58949 10.6945 5.72684C10.4889 5.86419 10.2472 5.9375 10 5.9375C9.66848 5.9375 9.35054 5.8058 9.11612 5.57138C8.8817 5.33696 8.75 5.01902 8.75 4.6875ZM10 8.75C9.75277 8.75 9.5111 8.82331 9.30554 8.96066C9.09998 9.09802 8.93976 9.29324 8.84515 9.52165C8.75054 9.75005 8.72579 10.0014 8.77402 10.2439C8.82225 10.4863 8.9413 10.7091 9.11612 10.8839C9.29093 11.0587 9.51366 11.1778 9.75614 11.226C9.99861 11.2742 10.2499 11.2495 10.4784 11.1549C10.7068 11.0602 10.902 10.9 11.0393 10.6945C11.1767 10.4889 11.25 10.2472 11.25 10C11.25 9.66848 11.1183 9.35054 10.8839 9.11612C10.6495 8.8817 10.3315 8.75 10 8.75ZM10 14.0625C9.75277 14.0625 9.5111 14.1358 9.30554 14.2732C9.09998 14.4105 8.93976 14.6057 8.84515 14.8341C8.75054 15.0626 8.72579 15.3139 8.77402 15.5564C8.82225 15.7988 8.9413 16.0216 9.11612 16.1964C9.29093 16.3712 9.51366 16.4903 9.75614 16.5385C9.99861 16.5867 10.2499 16.562 10.4784 16.4674C10.7068 16.3727 10.902 16.2125 11.0393 16.007C11.1767 15.8014 11.25 15.5597 11.25 15.3125C11.25 14.981 11.1183 14.663 10.8839 14.4286C10.6495 14.1942 10.3315 14.0625 10 14.0625Z" fill="#161D46"/>
                                                  </svg>

                                                </button>
                                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                  <li><a class="dropdown-item" href="#">View</a></li>
                                                  <li><a class="dropdown-item" href="#">Download</a></li>
                                                </ul>
                                              </div>
                                      </div>
                                    </div>
                                </div>
                            </div>
                      </div>
                </div>  
                <div>
                      <div className={styles.top_btn}>
                        <h1 className={`${styles.page_heading} ${styles.aptitude_section}`}>
                            Aptitude Section 
                        </h1>
                    </div>
                    <div className={styles.manage_job_table_box}>
                            <h3 className={styles.table_heading}>Aptitude Analysis</h3>
                              <div className={`table-responsive ${styles.data_table}`}>
                                 <table className={`table mb-0 ${styles.table_min_height}`}>
                                      <thead>
                                        <tr>
                                          <th>Section</th>
                                          <th>Completion</th>
                                          <th>Scor</th>
                                          <th>Next Possible Trial Date</th>
                                        </tr>
                                      </thead>
                                      <tbody className={styles.post_job_tbody}>
                                          <tr>
                                              <td>IQ Test Name 1</td>
                                              <td>24 July 2023</td>
                                              <td>180 Points</td>
                                                <td className={styles.highlight_td}>
                                                <Dropdown>
                                                    <Dropdown.Toggle className={styles.DropdownBtn} id="dropdown-basic">
                                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g clip-path="url(#clip0_1443_25680)">
                                                          <path d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z" stroke="#25324B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                          <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="#25324B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                          <path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z" stroke="#25324B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                        </g>
                                                        <defs>
                                                          <clipPath id="clip0_1443_25680">
                                                            <rect width="24" height="24" fill="white" />
                                                          </clipPath>
                                                        </defs>
                                                      </svg>
                                                    
                                                    </Dropdown.Toggle>


                                                    <Dropdown.Menu align="auto">
                                                        <Dropdown.Item href="#">Edit Job</Dropdown.Item>
                                                        <Dropdown.Item href="#">Post Job</Dropdown.Item>
                                                        <Dropdown.Item style={{ color: "red" }} onClick={() => {handleShow(true); setDeleteId(d.id)}}>Delete Job</Dropdown.Item>
                                                      </Dropdown.Menu>
                                                    </Dropdown> 
                                                </td>
                                          </tr>
                                            <tr>
                                              <td>IQ Test Name 1</td>
                                              <td>24 July 2023</td>
                                              <td>180 Points</td>
                                                <td className={styles.highlight_td}>
                                                <Dropdown>
                                                    <Dropdown.Toggle className={styles.DropdownBtn} id="dropdown-basic">
                                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g clip-path="url(#clip0_1443_25680)">
                                                          <path d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z" stroke="#25324B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                          <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="#25324B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                          <path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z" stroke="#25324B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                        </g>
                                                        <defs>
                                                          <clipPath id="clip0_1443_25680">
                                                            <rect width="24" height="24" fill="white" />
                                                          </clipPath>
                                                        </defs>
                                                      </svg>
                                                    
                                                    </Dropdown.Toggle>


                                                    <Dropdown.Menu align="auto">
                                                        <Dropdown.Item href="#">Edit Job</Dropdown.Item>
                                                        <Dropdown.Item href="#">Post Job</Dropdown.Item>
                                                        <Dropdown.Item style={{ color: "red" }} onClick={() => {handleShow(true); setDeleteId(d.id)}}>Delete Job</Dropdown.Item>
                                                      </Dropdown.Menu>
                                                    </Dropdown> 
                                                </td>
                                          </tr>
                                           <tr>
                                              <td>IQ Test Name 1</td>
                                              <td>24 July 2023</td>
                                              <td>180 Points</td>
                                                <td className={styles.highlight_td}>
                                                <Dropdown>
                                                    <Dropdown.Toggle className={styles.DropdownBtn} id="dropdown-basic">
                                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g clip-path="url(#clip0_1443_25680)">
                                                          <path d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z" stroke="#25324B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                          <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="#25324B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                          <path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z" stroke="#25324B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                        </g>
                                                        <defs>
                                                          <clipPath id="clip0_1443_25680">
                                                            <rect width="24" height="24" fill="white" />
                                                          </clipPath>
                                                        </defs>
                                                      </svg>
                                                    
                                                    </Dropdown.Toggle>


                                                    <Dropdown.Menu align="auto">
                                                        <Dropdown.Item href="#">Edit Job</Dropdown.Item>
                                                        <Dropdown.Item href="#">Post Job</Dropdown.Item>
                                                        <Dropdown.Item style={{ color: "red" }} onClick={() => {handleShow(true); setDeleteId(d.id)}}>Delete Job</Dropdown.Item>
                                                      </Dropdown.Menu>
                                                    </Dropdown> 
                                                </td>
                                          </tr>
                                      </tbody>
                                  </table>
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
