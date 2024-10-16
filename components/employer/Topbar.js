import React, { useEffect, useState } from "react";
import styles from "@/styles/edit_cv_steps.module.css";
import Link from "next/link";
import { useRouter } from "next/router";

const TopBar = () => {

    const router = useRouter();
    const { pathname } = router;

    const [lang, setLang] = useState(null);

    useEffect(() => {
        let id = "";
        switch (pathname) {
          case "/employer/edit-cv/step1":
            {
              id = "generalInfo";
            }
            break;
          case "/employer/edit-cv/step2":
            {
              id = "education";
            }
            break;
          case "/employer/edit-cv/step3":
            {
              id = "workExp";
            }
            break;
          case "/employer/edit-cv/step4":
            {
              id = "skills";
            }
            break;
          default:
        }
    
        if (id) {
          const ele = document.getElementById(id);
          if (ele) {
            ele.scrollIntoView();
            window.scroll(0, 0);
          }
        }

        if (localStorage.getItem("lang")) {
          setLang(JSON.parse(localStorage.getItem("lang")).code)
        }
      }, [pathname]);

    return (
        <div className="page_container">
            <div className={["main_content" `${(lang == "AR") ? styles.land_ar : ""}`]} id="body_lang_css">
              <div className="company_message">
                <div className="company_message_left">
                  <h3 className="morning_text">Good morning, John</h3>
                  <p className="message_info">
                    Here is your job listings statistic report from April 21 -
                    April 28.
                  </p>
                </div>
                <div className="company_message_right">
                  <input
                    type="text"
                    className="form-control"
                    name="daterange"
                    value="Apr 21 - Apr 28"
                  />

                  <svg
                    width="20"
                    height="21"
                    viewBox="0 0 20 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_118_12054)">
                      <path
                        d="M14.9999 4.66602H4.99992C4.07944 4.66602 3.33325 5.41221 3.33325 6.33268V16.3327C3.33325 17.2532 4.07944 17.9993 4.99992 17.9993H14.9999C15.9204 17.9993 16.6666 17.2532 16.6666 16.3327V6.33268C16.6666 5.41221 15.9204 4.66602 14.9999 4.66602Z"
                        stroke="#2A3858"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M13.3333 3V6.33333"
                        stroke="#2A3858"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6.66675 3V6.33333"
                        stroke="#2A3858"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3.33325 9.66602H16.6666"
                        stroke="#2A3858"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.33341 13H6.66675V14.6667H8.33341V13Z"
                        stroke="#2A3858"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_118_12054">
                        <rect
                          width="20"
                          height="20"
                          fill="white"
                          transform="translate(0 0.5)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </div>
              <div className="row g-4">
                <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-3">
                  <a href="#">
                    <div className="candidates_info">
                      <span className="review_number">76</span>
                      <div className="review_text">
                        New candidates to review
                      </div>
                    </div>
                  </a>
                </div>
                <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-3">
                  <a href="#">
                    <div className="candidates_info dash_box2">
                      <span className="review_number">100</span>
                      <div className="review_text">Candidates hired</div>
                    </div>
                  </a>
                </div>
                <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-3">
                  <a href="#">
                    <div className="candidates_info dash_box3">
                      <span className="review_number">24</span>
                      <div className="review_text">Position Closed</div>
                    </div>
                  </a>
                </div>
                <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-3">
                  <a href="#">
                    <div className="candidates_info dash_box4">
                      <span className="review_number">14</span>
                      <div className="review_text">Remaining CV to unlock</div>
                    </div>
                  </a>
                </div>
              </div>

              <div className="row g-4 mt-0">
                <div className="col-sm-12 col-md-8 col-lg-8">
                  <div className="inner_wrapper">
                    <div className="card_selectReviBox">
                      <h3 className="card_reviewTitle">
                        Job statistics{" "}
                        <span>Showing Jobstatistic Jul 19-25</span>
                      </h3>
                      <div className="Month-radio-buttons">
                        <input
                          type="radio"
                          className="check-radio-button"
                          name="radioButton"
                          id="button1"
                          checked
                        />
                        <label htmlFor="button1">Week</label>

                        <input
                          type="radio"
                          className="check-radio-button"
                          name="radioButton"
                          id="button2"
                        />
                        <label htmlFor="button2">Month</label>

                        <input
                          type="radio"
                          className="check-radio-button"
                          name="radioButton"
                          id="button3"
                        />
                        <label htmlFor="button3">Year</label>
                      </div>
                    </div>
                    <div className="chart_wrapper">
                      <img src="img/chart-1.png" alt="" />
                    </div>
                  </div>
                </div>
                <div className="col-sm-12 col-md-4 col-lg-4">
                  <div className="inner_wrapper">
                    <h3 className="box_heading">Applicants Summary</h3>
                    <div className="chart_wrapper">
                      <img src="img/chart-2.png" alt="" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="job_wrapper">
                <div className="job_heading_box">
                  <h3 className="box_heading">Last Opened Jobs</h3>
                </div>
                <div className="inner_wrapper">
                  <div className="row g-4">
                    <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4 col-xxl-3">
                      <div className="job_card">
                        <div className="job_tittle">
                          <div className="job_icon">
                            <img src="img/job-img.png" alt="" />
                          </div>
                          <div className="job_type">Full-Time</div>
                        </div>
                        <div className="job_designation">
                          <h3>UX/UI Designer</h3>
                          <div className="comapny_name">
                            <span className="dot_point">Company N</span>
                            <span>Paris, France</span>
                          </div>
                        </div>
                        <div className="job_tabs">
                          <ul
                            className="nav nav-pills"
                            id="pills-tab"
                            role="tablist"
                          >
                            <li className="nav-item" role="presentation">
                              <button
                                className="nav-link active"
                                id="pills-home-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-home"
                                type="button"
                                role="tab"
                                aria-controls="pills-home"
                                aria-selected="true"
                              >
                                Business
                              </button>
                            </li>
                            <li className="nav-item" role="presentation">
                              <button
                                className="nav-link"
                                id="pills-profile-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-profile"
                                type="button"
                                role="tab"
                                aria-controls="pills-profile"
                                aria-selected="false"
                              >
                                Design
                              </button>
                            </li>
                          </ul>
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
                                    style={{ width: "25%" }}
                                  ></div>
                                </div>
                                <div className="apply_count">
                                  <h5>
                                    5 applied <span>of 10 capacity</span>
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
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4 col-xxl-3">
                      <div className="job_card">
                        <div className="job_tittle">
                          <div className="job_icon">
                            <img src="img/job-img2.png" alt="" />
                          </div>
                          <div className="job_type">Full-Time</div>
                        </div>
                        <div className="job_designation">
                          <h3>UX/UI Designer</h3>
                          <div className="comapny_name">
                            <span className="dot_point">Discord </span>
                            <span>Paris, France</span>
                          </div>
                        </div>
                        <div className="job_tabs">
                          <ul
                            className="nav nav-pills"
                            id="pills-tab"
                            role="tablist"
                          >
                            <li className="nav-item" role="presentation">
                              <button
                                className="nav-link active"
                                id="pills-home-tab2"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-home"
                                type="button"
                                role="tab"
                                aria-controls="pills-home"
                                aria-selected="true"
                              >
                                Business
                              </button>
                            </li>
                            <li className="nav-item" role="presentation">
                              <button
                                className="nav-link"
                                id="pills-profile-tab2"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-profile"
                                type="button"
                                role="tab"
                                aria-controls="pills-profile"
                                aria-selected="false"
                              >
                                Design
                              </button>
                            </li>
                          </ul>
                          <div className="tab-content" id="pills-tabContent">
                            <div
                              className="tab-pane fade show active"
                              id="pills-home"
                              role="tabpanel"
                              aria-labelledby="pills-home-tab2"
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
                                    style={{ width: "25%" }}
                                  ></div>
                                </div>
                                <div className="apply_count">
                                  <h5>
                                    5 applied <span>of 10 capacity</span>
                                  </h5>
                                </div>
                              </div>
                            </div>
                            <div
                              className="tab-pane fade"
                              id="pills-profile"
                              role="tabpanel"
                              aria-labelledby="pills-profile-tab2"
                              tabIndex="0"
                            >
                              ...
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4 col-xxl-3">
                      <div className="job_card">
                        <div className="job_tittle">
                          <div className="job_icon">
                            <img src="img/job-img3.png" alt="" />
                          </div>
                          <div className="job_type">Full-Time</div>
                        </div>
                        <div className="job_designation">
                          <h3>Brand Designer</h3>
                          <div className="comapny_name">
                            <span className="dot_point">Dropbox</span>
                            <span>Paris, France</span>
                          </div>
                        </div>
                        <div className="job_tabs">
                          <ul
                            className="nav nav-pills"
                            id="pills-tab"
                            role="tablist"
                          >
                            <li className="nav-item" role="presentation">
                              <button
                                className="nav-link active"
                                id="pills-home-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-home"
                                type="button"
                                role="tab"
                                aria-controls="pills-home"
                                aria-selected="true"
                              >
                                Business
                              </button>
                            </li>
                            <li className="nav-item" role="presentation">
                              <button
                                className="nav-link"
                                id="pills-profile-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-profile"
                                type="button"
                                role="tab"
                                aria-controls="pills-profile"
                                aria-selected="false"
                              >
                                Design
                              </button>
                            </li>
                          </ul>
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
                                    style={{ width: "25%" }}
                                  ></div>
                                </div>
                                <div className="apply_count">
                                  <h5>
                                    5 applied <span>of 10 capacity</span>
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
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4 col-xxl-3">
                      <div className="job_card">
                        <div className="job_tittle">
                          <div className="job_icon">
                            <img src="img/job-img4.png" alt="" />
                          </div>
                          <div className="job_type">Full-Time</div>
                        </div>
                        <div className="job_designation">
                          <h3>Brand Designer</h3>
                          <div className="comapny_name">
                            <span className="dot_point">GoDaddy</span>
                            <span>Paris, France</span>
                          </div>
                        </div>
                        <div className="job_tabs">
                          <ul
                            className="nav nav-pills"
                            id="pills-tab"
                            role="tablist"
                          >
                            <li className="nav-item" role="presentation">
                              <button
                                className="nav-link active"
                                id="pills-home-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-home"
                                type="button"
                                role="tab"
                                aria-controls="pills-home"
                                aria-selected="true"
                              >
                                Business
                              </button>
                            </li>
                            <li className="nav-item" role="presentation">
                              <button
                                className="nav-link"
                                id="pills-profile-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-profile"
                                type="button"
                                role="tab"
                                aria-controls="pills-profile"
                                aria-selected="false"
                              >
                                Design
                              </button>
                            </li>
                          </ul>
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
                                    style={{ width: "25%" }}
                                  ></div>
                                </div>
                                <div className="apply_count">
                                  <h5>
                                    5 applied <span>of 10 capacity</span>
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
    )
}

export default TopBar;