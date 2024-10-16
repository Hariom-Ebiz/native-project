import React, { useState, useEffect } from "react";
import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import styles from "@/styles/job_list.module.css";
import Select from "react-select";
import Link from "next/link";
import { createAxiosCookies, getCookies } from "@/fn";
import { jobTypeList, jobCategory, careerLevelList, getJobSalaryRange, getJobSeekerJobList } from "@/services/jobSeeker/invites";
import { useSelector } from "react-redux";
import moment from "moment";
import { IMAGEBASEURL } from "@/api";
import useRequest from "@/hooks/useRequest";
import Pagination from "react-bootstrap/Pagination";
import { getCityCountry } from "@/services/other";
import { useRouter } from "next/router"
import { Modal } from "react-bootstrap";
import { useTranslation, Trans } from "react-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'


function kFormatter(num) {
  return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num)
}

const Invitations = ({ Jobs, jobTypeList, jobCategory, careerLevels, salaryRange }) => {
  const { t } = useTranslation('common');
  let PER_PAGE = 10;
  const { firstName, lastName } = useSelector(store => store.auth)
  const [jobTypeFilter, setJobTypeFilter] = useState([]);
  const [jobCategoryFilter, setJobCategoryFilter] = useState([]);
  const [salaryRangeFilter, setSalaryRangeFilter] = useState([]);
  const [careerLevelFilter, setCareerLevelFilter] = useState([]);
  const [jobsList, setJobList] = useState(Jobs)
  const [pageChange, setPageChange] = useState(1);
  const [totalDoc, setTotalDoc] = useState();
  const [title, setTitle] = useState("");
  const [sortBy, setSortBy] = useState({ label: t("Latest"), value: "created_at" })
  const [options, setOptions] = useState([]);
  const [location, setLocation] = useState({ label: t("Select Location ..."), value: "" });

  const { request: jobDataReq, response: jobDataResp } = useRequest();
  const { request: applyReq, response: applyRes } = useRequest();

  const route = useRouter();

  const applyJob = (jobId, totalAskedQuestions) => {
    if (totalAskedQuestions == 0) {
      applyReq("POST", "job-seeker/job/apply", { id: jobId, is_applied: 1 })
    } else {
      route.push(`/job-seeker/application-form?id=${jobId}`)
    }
  }


  const [welcomPopup, setWelcomePopup] = useState(true);
  const handleWelcomeClose = () => setWelcomePopup(false);
  const handleWelcomeShow = () => setWelcomePopup(true);

  const handleRequest = (filter) => {
    const params = new URLSearchParams()

    // Iterate over the keys in the filter object
    for (const key in filter) {
      if (filter.hasOwnProperty(key)) {
        const value = filter[key];
        if (Array.isArray(value)) {
          // If the value is an array, append each item in the array separately
          value.forEach(item => params.append(key, item));
        } else {
          // If the value is not an array, simply append it
          params.append(key, value);
        }
      }
    }

    const queryString = params.toString()

    jobDataReq("GET", "employer/invite/candidate/invites?" + queryString)
  }

  const serachJobs = (page) => {
    const loc = location;
    const jobType = jobTypeFilter;
    const jobFilter = jobCategoryFilter;
    const salaryFilter = salaryRangeFilter;
    let city = "";
    let country = "";
    let job_type = "";
    let job_category = "";
    let salary_range_from = "";
    if (loc.value) {
      let parseLoc = location.value.split(",");
      city = parseLoc[0];
      country = parseLoc[1];
    }

    if (jobType.length) job_type = jobType;

    if (jobFilter.length) job_category = jobFilter;

    if (salaryFilter.length) salary_range_from = salaryFilter;

    handleRequest({ city, country, job_type, job_category, page, per_page: PER_PAGE, salary_range_from, title, sortBy: sortBy.value, career_level: careerLevelFilter })
  }

  const handleLocation = (d) => {
    if (d.length > 2) {
      getCityCountry(d)
        .then(v => setOptions(v))
        .catch(err => alert(new Error(err).message))

    }
  }

  const handlePage = (page) => {
    if (pageChange != page) {
      setPageChange(page);
      serachJobs(page);
      window.scrollTo(0, 0);
    }
  }

  const handleChange = (e, type, id) => {
    console.log("run : ");
    if (e.target.checked) {
      if (type == "job_type") {
        let pushed = [...jobTypeFilter, id]
        setJobTypeFilter(pushed)
      } else if (type == "job_category") {
        let pushed = [...jobCategoryFilter, id]
        setJobCategoryFilter(pushed)
      } else if (type == "salary_range") {
        let pushed = [...salaryRangeFilter, id];
        setSalaryRangeFilter(pushed);
      } else if (type == "career_level") {
        let pushed = [...careerLevelFilter, id];
        setCareerLevelFilter(pushed);
      }
    } else {
      if (type == "job_type") {
        let filterd = jobTypeFilter?.filter((f) => f != id)
        setJobTypeFilter(filterd)
      } else if (type == "job_category") {
        let filterd = jobCategoryFilter.filter((f) => f != id)
        setJobCategoryFilter(filterd)
      } else if (type == "salary_range") {
        let filterd = salaryRangeFilter.filter((f) => f != id)
        setSalaryRangeFilter(filterd);
      } else if (type == "career_level") {
        let filterd = careerLevelFilter.filter((f) => f != id)
        setCareerLevelFilter(filterd);
      }
    }
  }

  const resetFilter = () => {
    setTitle("")
    setSortBy({ label: t("Latest"), value: "created_at" })
    setLocation({ label: t("Select Location ..."), value: "" })
    setPageChange(1)
    setOptions([])
    setJobTypeFilter([])
    setJobCategoryFilter([])
    setSalaryRangeFilter([])
    setCareerLevelFilter([])

    serachJobs(1);
  }

  useEffect(() => {
    setPageChange(1);
    serachJobs(1)
  }, [jobTypeFilter, jobCategoryFilter, salaryRangeFilter, careerLevelFilter, sortBy])

  useEffect(() => {
    if (jobDataResp) {
      setJobList(jobDataResp?.list?.data);

      setTotalDoc(jobDataResp?.list?.totalDocuments);
    }
  }, [jobDataResp])


  console.log("jobList : ", jobsList);
  

  return (
    <JobSeekerAuth data={{ title: "Invitations" }}>
      <div className="page_container">
        <div className={`main_content main_bg ${styles.job_list_page}`} id="body_lang_css">
          <p>
            <Trans
              i18nKey="invitationsHelloTest"
              values={{ 1: firstName + " " + lastName }}
              components={{ b: <b /> }}
            />
          </p>

          <div className={styles.cv_fillter_head}>
          <form action="" onSubmit={(e) => { e.preventDefault(); serachJobs() }}>
            <div className="row">
              <div className={`col-lg-4 col-md-6 ${styles.firstCol}`} style={{ width: "39%" }}>
                <div className={styles.jobSearchInput}>
                  <span className={styles.iconBox}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="11.7664"
                        cy="11.7666"
                        r="8.98856"
                        stroke="#25324B"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18.0181 18.4851L21.5421 22"
                        stroke="#25324B"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <input
                    className={styles.inputBorderBottom}
                    type="text"
                    placeholder={t("Search Job Invitations by Job Title")}
                    value={title}
                    onChange={(e) => setTitle(e?.target?.value)}
                  />
                </div>
              </div>
              <div className={`col-lg-4 col-md-6 ${styles.secondCol}`} style={{ width: "39%" }}>
                <div className={styles.jobSearchInput}>
                  <span className={styles.iconBox}>
                    <svg
                      width="18"
                      height="20"
                      viewBox="0 0 18 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11.5 8.50051C11.5 7.11924 10.3808 6 9.00051 6C7.61924 6 6.5 7.11924 6.5 8.50051C6.5 9.88076 7.61924 11 9.00051 11C10.3808 11 11.5 9.88076 11.5 8.50051Z"
                        stroke="#25324B"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8.99951 19C7.80104 19 1.5 13.8984 1.5 8.56329C1.5 4.38664 4.8571 1 8.99951 1C13.1419 1 16.5 4.38664 16.5 8.56329C16.5 13.8984 10.198 19 8.99951 19Z"
                        stroke="#25324B"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>

                  <Select
                    className={styles.inputBorderBottom}
                    onChange={(d) => setLocation(d)}
                    onInputChange={handleLocation}
                    options={options}
                    value={location}
                  />
                </div>
              </div>
              <div style={{ width: "22%", display: "flex", gap: "5px" }}>
                <div className={`col-lg-2 ${styles.threeCol}`} style={{ width: "50%" }}>
                  <div className={styles.headBtnBox}>
                    <button className={styles.post_btn} onClick={() => serachJobs()}>{t("Search")}</button>
                  </div>
                </div>

                <div className={`col-lg-2 ${styles.threeCol}`} style={{ width: "50%" }}>
                  <div className={styles.headBtnBox}>
                    <button className={styles.post_btn} onClick={() => resetFilter()}>{t("Reset")}</button>
                  </div>
                </div>

              </div>
            </div>
    </form>
          </div>
          <div className={styles.all_cv_review_box}>
            <div className={`row ${styles.rowGap}`}>
              <div className=" col-xxl-3 col-lg-4 ">
                <div
                  className={`${styles.categoriesSelectBox}}`}
                  id="filter-show"
                >
                  <div className="accordion" id="select_categoris">
                    <div
                      className={`accordion-item ${styles.accordion_item_box}`}
                    >
                      <h2 className="accordion-header" id="employment_type">
                        <button
                          className={`accordion-button collapsed  ${styles.collapsBtn}`}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseFirst"
                          aria-expanded="false"
                          aria-controls="collapseFirst"
                        >
                          {t("Type of Employment")}
                        </button>
                      </h2>
                      <div
                        id="collapseFirst"
                        className="accordion-collapse collapse show"
                        aria-labelledby="employment_type"
                        data-bs-parent="#select_categoris"
                      >
                        <div className="accordion-body p-0">
                        {
                            Object.keys(jobTypeList).map(d => {                              
                              return (
                                <div
                                  key={jobTypeList[d].id}
                                  className={`form-group custom_checkbox ${styles.custom_checkbox_desing}`}
                                >
                                  <input type="checkbox" name=""
                                    checked={(!jobTypeFilter.includes(jobTypeList[d].id)) ? false : true}
                                    onChange={(e) => handleChange(e, "job_type", jobTypeList[d].id)} id={`type_${jobTypeList[d].id}`} />
                                  <label htmlFor={`type_${jobTypeList[d].id}`}>{t(d)} ({jobTypeList[d].count})</label>
                                </div>
                              )
                            })
                          }
                        </div>
                      </div>
                    </div>
                    <div
                      className={`accordion-item ${styles.accordion_item_box}`}
                    >
                      <h2
                        className="accordion-header"
                        id="employment_type_categories"
                      >
                        <button
                          className={`accordion-button collapsed  ${styles.collapsBtn}`}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseSecond"
                          aria-expanded="false"
                          aria-controls="collapseSecond"
                        >
                          {t("Categories")}
                        </button>
                      </h2>
                      <div
                        id="collapseSecond"
                        className="accordion-collapse collapse show"
                        aria-labelledby="employment_type_categories"
                        data-bs-parent="#select_categoris"
                      >
                        <div className="accordion-body p-0">
                        {
                            Object.keys(jobCategory)?.map(d => {
                                return (
                                  <div
                                    key={jobCategory[d].id}
                                    className={`form-group custom_checkbox ${styles.custom_checkbox_desing}`}
                                  >
                                    <input type="checkbox" name=""
                                      checked={(jobCategoryFilter.includes(jobCategory[d].id))}
                                      onChange={(e) => handleChange(e, "job_category", jobCategory[d].id)} id={`category_${jobCategory[d].id}`} />
                                    <label htmlFor={`category_${jobCategory[d].id}`}>{t(d)} ({jobCategory[d].count})</label>
                                  </div>
                                )
                            })
                          }
                        </div>
                      </div>
                    </div>
                    <div
                      className={`accordion-item ${styles.accordion_item_box}`}
                    >
                      <h2
                        className="accordion-header"
                        id="employment_type_categories"
                      >
                        <button
                          className={`accordion-button collapsed  ${styles.collapsBtn}`}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseThree"
                          aria-expanded="false"
                          aria-controls="collapseThree"
                        >
                          {t("Job Level")}
                        </button>
                      </h2>
                      <div
                        id="collapseThree"
                        className="accordion-collapse collapse show"
                        aria-labelledby="employment_type_categories"
                        data-bs-parent="#select_categoris"
                      >
                        <div className="accordion-body p-0">
                        {
                            Object.values(careerLevels)?.map(d => {
                              return (
                                <div
                                  key={d.id}
                                  className={`form-group custom_checkbox ${styles.custom_checkbox_desing}`}
                                >
                                  <input type="checkbox" name="" onChange={(e) => handleChange(e, "career_level", d.id)} id={`level_${d.id}`} />
                                  <label htmlFor={`level_${d.id}`}>{t(d.text)} ({d.count})</label>
                                </div>

                              )
                            })
                          }
                        </div>
                      </div>
                    </div>
                    <div
                      className={`accordion-item ${styles.accordion_item_box}`}
                    >
                      <h2
                        className="accordion-header"
                        id="employment_type_categories"
                      >
                        <button
                          className={`accordion-button collapsed  ${styles.collapsBtn}`}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseFor"
                          aria-expanded="false"
                          aria-controls="collapseFor"
                        >
                          {t("Salary Range")}
                        </button>
                      </h2>
                      <div
                        id="collapseFor"
                        className="accordion-collapse collapse show"
                        aria-labelledby="employment_type_categories"
                        data-bs-parent="#select_categoris"
                      >
                        <div className="accordion-body p-0">
                        {
                            Object.keys(salaryRange).map(d => {
                              return (
                                <div
                                  key={d}
                                  className={`form-group custom_checkbox ${styles.custom_checkbox_desing}`}
                                >
                                  <input type="checkbox" name=""
                                    checked={(!salaryRangeFilter.includes(d)) ? false : true}
                                    onChange={(e) =>
                                      handleChange(e, "salary_range", d)
                                    }
                                    id={`range_${d.salary_range}`} />
                                  <label htmlFor={`range_${d}`}>{t(d)} ({salaryRange[d]})</label>
                                </div>
                              )
                            })
                          }
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
              <div className="col-xxl-9 col-lg-8">
                <div className="showResumeBox">
                  <div className={styles.showResumeHeader}>
                    <div className="showResumeLeft">
                      <h2 className={styles.all_cv_title}>{t("All Jobs Invitations")}</h2>
                      <p className={styles.showing_results_text}>
                        {Array.isArray(jobsList) && jobsList.length > 0 ? pageChange == "1" ?
                          t("showText1InJobList", { 1: 1, 2: jobsList.length, 3: totalDoc })
                          :
                          t("showText1InJobList", { 1: (PER_PAGE * (pageChange - 1)) + 1, 2: jobsList.length, 3: totalDoc }) : ""}
                        {/* {jobsList.length == 0 ? "No matching jobs found." :  } */}
                      </p>
                    </div>
                    <div className={styles.sort_resume}>
                      <span className={styles.select_lebal}>{t("Sort by")}:</span>
                      <Select
                        className={styles.selectbox}
                        onChange={(e) => { setSortBy(e); }}
                        value={sortBy}
                        options={[{ label: t("Latest"), value: "created_at" }, { label: t("Recommended"), value: "recommended" }]}
                      />
                    </div>
                  </div>
                </div>

                {
                  jobsList?.map((d,index) => {
                    return (
                      <div className={styles.job_relevant_Box} key={index + d.id}>
                        <div className="row">
                          <div className="col-xl-8 col-md-8 col-lg-12">
                            <div className="mb-2" style={{ color: "#7C8493", fontSize: "16px", fontWeight: 500 }}>
                              {t("Invitation Date")}   : {moment(d.invitation_date).format("MMMM DD, YYYY")}
                            </div>
                            <div className={styles.job_relevant_left}>
                              <figure className={styles.userImg}>
                              {d.is_confidential ? <img src="/img/confedential.png" /> : <img src={(d.logo) ? `${IMAGEBASEURL}${d.logo}` : "/img/no-image.jpg"} alt="user" />}
                              </figure>
                              <div className={styles.cv_content}>
                                <div className={styles.userNameBox}>
                                  <Link
                                    href={`/job-seeker/job-description/${d.id}`}
                                  >
                                    <h3 className={styles.user_name_text}>{d.title}</h3>
                                  </Link>
                                </div>

                                <ul className={styles.userDetailsBox}>
                                {d.title && !d.is_confidential ? <li className={styles.userItemsBoxFirst}>{d.company_name}</li> : <li className={styles.userItemsBoxFirst}>Confidential</li>}
                                  <li className={styles.userItemsBox}>
                                    {d.area_name || d.other_area || d.area}, {d.city_name}, {d.country_name}
                                  </li>
                                </ul>
                                {!d.hide_salary_range && <div style={{ color: "#7C8493", fontSize: "14px", fontWeight: 400, marginBottom: "10px" }}>
                                  Salary : {kFormatter(d.salary_range_from)} {String(d.salary_currency).toUpperCase()} to {kFormatter(d.salary_range_to)} {String(d.salary_currency).toUpperCase()}
                                </div>}

                                <ul className={styles.statusBox}>
                                  <li
                                    className={`${styles.statusItems} ${styles.greenBtn}`}
                                  >
                                    {t(d.job_type_name)}
                                  </li>
                                  <li
                                    className={`${styles.statusItems} ${styles.yellowBtn}`}
                                  >
                                    {d.job_category_id != 0 ? t(d.job_category_name) : d.other_job_category}
                                  </li>
                                </ul>

                              </div>
                            </div>
                          </div>
                          <div className="col-xl-4 col-md-4 col-lg-12">
                            <div className={styles.job_relevant_right}>
                              {/* <Link
                                href={`/job-seeker/application-form?id=${d.id}`}
                              > */}
                              {/* totalAskedQuestions */}
                              <button className={styles.apply_btn} disabled={d.isApplied == "1"} onClick={() => applyJob(d.id, d.totalAskedQuestions)}>{(d.isApplied == "1") ? t("Applied!") : t("Apply")}</button>

                              {/* </Link> */}


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
                                        aria-label="Basic example"
                                        aria-valuenow="25"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                      >
                                        <div
                                          className="progress-bar"
                                          style={{ width: (d.totalApplied < d.vacancies) ? `${Math.round((d.totalApplied / d.vacancies) * 100)}%` : "100%" }}
                                        ></div>
                                      </div>
                                      <div className="apply_count">
                                        <h5>
                                        {t("applyTestInJobList", { 1: d.totalApplied, 2: d.vacancies, 3: d.totalApplied > 1 ? "s" : "", 4: d.vacancies > 1 ? "s" : "" })}
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
                              <div className="mt-2" style={{ color: "#7C8493", fontSize: "14px", fontWeight: 400 }}>
                                {t("Posted on")} : {moment(d.posted_on).format("MMM DD, YYYY")}
                                <br />
                                {t("Last Date")} : {moment(d.apply_before).format("MMM DD, YYYY")}
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>
                    )

                  })
                }


                {Array.isArray(jobsList) && jobsList.length > 0 ? <div className={styles.paginationBox}>
                  <Pagination>

                    <Pagination.First disabled={pageChange == 1} onClick={() => handlePage(pageChange - 1)} />
                    {
                      Array.from({ length: Math.ceil(totalDoc / PER_PAGE) }).map((d, i) => (
                        <Pagination.Item key={i + 1} active={pageChange == i + 1} onClick={() => handlePage(i + 1)}>{i + 1}</Pagination.Item>
                      ))
                    }

                    <Pagination.Last disabled={Math.ceil(totalDoc / PER_PAGE) == pageChange} onClick={() => handlePage(pageChange + 1)} />
                  </Pagination>
                </div> : <p>{t("No matching Jobs Invitations found.")}</p>}
              </div>
            </div>
            <div className={styles.sideTabicon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 64 64"
                style={{ enableBackground: "new 0 0 512 512" }}
              >
                <g>
                  <path
                    d="M53.39 8H10.61a5.61 5.61 0 0 0-4.15 9.38L25 37.77V57a2 2 0 0 0 1.13 1.8 1.94 1.94 0 0 0 .87.2 2 2 0 0 0 1.25-.44l3.75-3 6.25-5A2 2 0 0 0 39 49V37.77l18.54-20.39A5.61 5.61 0 0 0 53.39 8z"
                    fill="#fff"
                    opacity="1"
                  ></path>
                </g>
              </svg>
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
        {/* <Modal.Header closeButton>
              <Modal.Title className={styles.modal_title}>
                  Send Invitation
              </Modal.Title>
          </Modal.Header> */}
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
                    <h2 className="modal_heading">{t("What's This Section About? A Quick Overview!")}</h2>
                    </div>
                </Modal.Header>
            <Modal.Body>
              <div className={styles.modal_content} style={{textAlign: "left"}}>
                <p>
                {t("Keep track of all job invitations you may receive from employers and apply with ease.")}
                </p>
              </div>
            </Modal.Body>


      </Modal>
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

  const jobs = await getJobSeekerJobList();
  const getType = await jobTypeList()
  const getJobCategory = await jobCategory()
  const salary = await getJobSalaryRange();
  const getCareerLevelList = await careerLevelList();

  return {
    props: {
      Jobs: jobs?.job?.data || [],
      jobTypeList: jobs?.job.jobTypes ?? {},
      jobCategory: jobs?.job?.jobCategories ?? {},
      careerLevels: jobs?.job?.jobLevels ?? {},
      salaryRange: jobs?.job?.salaryRanges ?? {},
      publicHeader: false,
      publicFooter: false,
      ...(await serverSideTranslations(lang_code, [
        'common',
      ])),
    },
  };
}

export default Invitations;