import React, { useEffect, useState } from "react";
import modalStyles from "@/styles/login_signup.module.css";
import styles from "@/styles/job_seeker_dashborad.module.css";
import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import { createAxiosCookies, getCookies } from "@/fn";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { setModal, unsetModal } from "@/store/siteSlice";
import { useDispatch } from "react-redux";
import Link from "next/link";
import useRequest from "@/hooks/useRequest";
import { toast } from "react-toastify";
import moment from "moment";
import { IMAGEBASEURL } from "@/api";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {Modal} from "react-bootstrap"
import { getMyMemberships } from "@/services/jobSeeker/subscription";

const getDayTime = () => {
  const hour = new Date().getHours();
  console.log("hour : ", hour);
  let message = "";
  if (hour < 12) message = "Morning";
  else if (hour < 16) message = "Afternoon";
  else if (hour < 24) message = "Evening";

  return message;
}

const getCourseStatus = (course) => {
  if (course.completedLessonsCount >= course.totalCourseLesson) {
    return { color: "green", text: "Completed" }
  }
  return { color: "red", text: "In-progress" }
}




const getStatus = (job) => {
  let status = { text: "", color: "black" };
  if (job.is_unlock) {
    status = { text: "Unlock", color: "blue" };
  } else {
    status = { text: "Locked", color: "#2A3858" };
  }

  if (job.is_applied) {
    status = { text: "Applied", color: "#F3CF5B" };
  }
  if (job.shortlisted) {
    status = { text: "Shortlisted", color: "green" };
  }
  if (job.interviewd) {
    status = { text: "Final Interview", color: "maroon" };
  }
  if (job.selected) {
    status = { text: "Hired", color: "green" };
  }
  if (job.rejected) {
    status = { text: "Declined", color: "red" };
  }

  if (status.text == "") {
    status = { text: "Saved", color: "#2A3858" };
  }

  return status;
}


const Dashboard = ({subscriptionList}) => {
  const PER_PAGE = 10;
  const { t } = useTranslation('common');
  const router = useRouter();
  const dispatch = useDispatch();
  const { cvStep, role,firstName, lastName, is_subscriber } = useSelector((store) => store.auth);
  const [dashboardData, setDashboardData] = useState({})
  const { request: requestDashboardData, response: responesDashboardData } = useRequest();
  const { request: requestCourseData, response: responesCourseData } = useRequest();
  const { request: requestJobData, response: responesJobData } = useRequest();
  const [coursesPage, setCoursesPage] = useState(2);
  const [jobsPage, setJobsPage] = useState(2);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [courses, setCourses] = useState([])

  const [subscriptionAlert, setSubscriptionClose] = useState((!is_subscriber) ? true : false)

  useEffect(() => {
    if (role == 2) {
      router.replace("/employer/dashboard")
    }

    requestDashboardData("get", `dashboard/get-candidate-dashboard-data`);
  }, []);


  const loadMoreCourseData = () => {
    requestCourseData("get", `dashboard/get-candidate-dashboard-course-data?page=${coursesPage}`);
    setCoursesPage(prevPage => prevPage + 1)
  }

  const loadMoreJobData = () => {
    requestJobData("get", `dashboard/get-candidate-dashboard-job-data?page=${jobsPage}`);
    setJobsPage(prevPage => prevPage + 1)
  }

  useEffect(()=>{
    if(responesCourseData){
      setCourses((prev)=>{
        const newCourses = [...prev];
        return [...newCourses,...responesCourseData.data.courseData.courseData]
      })
    }
  },[responesCourseData])

  useEffect(()=>{
    if(responesJobData){
      setJobs((prev)=>{
        const newJobs = [...prev];
        return [...newJobs,...responesJobData.data.jobData.latestAppliedJobs]
      })
    }
  },[responesJobData])

  useEffect(() => {
    if (responesDashboardData) {
      const { status, message, data } = responesDashboardData;
      if (!status) {
        toast.error(message);
        return;
      }

      console.log("data : ", data);
      setDashboardData(data);

      setJobs(data.jobData.latestAppliedJobs)
      setCourses(data.courseData.courseData)

      setTotalCourses(data.courseData.totalCourses)
      setTotalJobs(data.jobData.totalJobs)
    }
  }, [responesDashboardData])

  console.log("totalJobs",totalJobs);
  

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
                  {t("Job’s Roadway")}
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
                  {t("Career Roadway")}
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
                    {t(`Good ${getDayTime()}`)}, {firstName + " " + lastName}
                  </h3>
                  <p className={styles.message_info}>
                    {t("Here is your job listings statistic report.")}
                  </p>
                </div>

                <div className="row g-3">
                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div className={styles.card_box_white}>
                      <h2 className={styles.box_heading}>{t("Total Jobs Applied")}</h2>
                      <span className={styles.count_digit}>{dashboardData?.jobData?.totalAppliedJobs}</span>
                      <div className={styles.img_box_right}>
                        <img src="../img/dashbox.png" alt="#" />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div
                      className={`${styles.card_box_white} ${styles.dark_box}`}
                    >
                      <h2 className={styles.box_heading}>{t("Saved Jobs")}</h2>
                      <span className={styles.count_digit}>{dashboardData?.jobData?.totalSavedJobs}</span>
                      <div className={styles.img_box_right}>
                        <img src="../img/dashbox.png" alt="#" />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div
                      className={`${styles.card_box_white} ${styles.box_light}`}
                    >
                      <h2 className={styles.box_heading}>{t("Total Jobs Applied")}</h2>

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
                        {t("Recent Job History")}
                      </h2>
                    </div>
                    <div
                      className={`${styles.tebal_box} ${styles.tbl_mobile_view}`}
                    >
                      <div className="table-responsiv">
                        <table className={` ${styles.table} table`}>
                          <tbody>
                            {
                              Array.isArray(jobs) && jobs.map((job, index) => {
                                return <tr className={index & 1 ? styles.main_comaputer_wrapper_block : styles.main_comaputer_wrapper_block_second} key={job.id}>
                                  <td colSpan={2}>
                                    <div className={styles.computer_network_box}>
                                      {/* <div className={styles.comapny_img}>
                                      <img
                                        src="../img/Company-img.png"
                                        alt="Company-img"
                                      />
                                    </div> */}
                                      <div>
                                        <h3 className={styles.course_usr_name}>
                                          {job?.title?.length > 30 ? job.title.substring(0, 30) + "..." : job.title}
                                        </h3>
                                        <div className={styles.job_details}>
                                          <span>{job?.area_name || job?.other_area || job?.area}</span>
                                          <span>{job?.city_name}, {job?.country_name}</span>
                                          <span>{t(job?.job_type)}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div>
                                      <h3 className={styles.apply_date}>
                                        {t("Date Applied")}
                                      </h3>
                                      <span className={styles.Lesson_neme}>
                                        {job.created_at ? moment(job.created_at).format("D MMMM YYYY") : "-"}
                                      </span>
                                    </div>
                                  </td>
                                  <td>
                                    <div className={styles.mobile_link} >
                                      <a
                                        href="javascript:void(0);"
                                        className={styles.course_usr_box}
                                        style={{ color: getStatus(job).color, border: `1px solid ${getStatus(job).color}` }}
                                      >
                                        {getStatus(job).text}
                                      </a>
                                    </div>
                                  </td>
                                  {/* <td>
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
                                </td> */}
                                </tr>
                              })
                            }
                            {Array.isArray(jobs) && jobs.length == 0 && <p>No Jobs Found!</p>}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {Array.isArray(jobs) && jobs.length < totalJobs && <div className={styles.Load_More_btn}>
                      <button onClick={loadMoreJobData}>
                        {t("Load More")}
                        <span className={styles.more_icon_button}>{" "}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                          >
                            <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                          </svg>
                        </span>
                      </button>
                    </div>}

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
                    {t(`Good ${getDayTime()}`)}, {firstName + " " + lastName}
                  </h3>
                  <p className={styles.message_info}>
                    {t("Here's what's happening with your career development.")}
                  </p>
                </div>

                <div className="row g-3">
                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div
                      className={`${styles.card_box_white} ${styles.dark_box}`}
                    >
                      <h2 className={styles.box_heading}>
                        {t("Completed Courses")}
                      </h2>
                      <span className={styles.count_digit}>{dashboardData?.courseData?.totalCompletedCourses}</span>
                      <div className={styles.img_box_right}>
                        <svg width="80" height="80" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g clipPath="url(#clip0_650_7)">
                            <path d="M497.36 69.995C489.828 62.45 477.607 62.437 470.075 69.963L238.582 300.845L155.06 210.132C147.843 202.298 135.641 201.79 127.794 209.006C119.953 216.223 119.451 228.431 126.668 236.272L223.794 341.753C225.554 343.666 227.682 345.202 230.051 346.271C232.419 347.34 234.98 347.919 237.578 347.973C237.719 347.979 237.855 347.979 237.99 347.979C243.096 347.977 247.994 345.954 251.613 342.351L497.322 97.286C504.873 89.761 504.886 77.54 497.36 69.995Z" fill="gray" />
                            <path d="M492.703 236.703C482.045 236.703 473.407 245.341 473.407 256C473.407 375.883 375.883 473.407 256 473.407C136.124 473.407 38.593 375.883 38.593 256C38.593 136.124 136.124 38.593 256 38.593C266.658 38.593 275.297 29.955 275.297 19.297C275.297 8.638 266.658 0 256 0C114.84 0 0 114.84 0 256C0 397.154 114.84 512 256 512C397.154 512 512 397.154 512 256C512 245.342 503.362 236.703 492.703 236.703Z" fill="gray" />
                          </g>
                          <defs>
                            <clipPath id="clip0_650_7">
                              <rect width="512" height="512" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>

                        {/*<img src="../img/dashbox.png" alt="#" /> */}
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div
                      className={`${styles.card_box_white} ${styles.red_box}`}
                    >
                      <h2 className={styles.box_heading}>
                        {t("In-Progress Courses")}
                      </h2>
                      <span className={styles.count_digit}>{dashboardData?.courseData?.totalIncompltedCourses}</span>
                      <div className={styles.img_box_right}>
                        {/*<img src="../img/dashbox.png" alt="#" />*/}
                        <svg width="80" height="80" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M258.133 417.707C251.602 417.702 245.187 415.981 239.531 412.715L128.597 348.715C120.03 343.754 113.782 335.597 111.222 326.034C108.662 316.471 110.001 306.284 114.944 297.707L130.944 269.973C139.403 258.202 150.473 248.549 163.286 241.772C176.1 234.995 190.309 231.278 204.8 230.912C205.524 230.786 206.211 230.502 206.813 230.08C207.415 229.658 207.917 229.11 208.284 228.473C208.65 227.835 208.872 227.126 208.934 226.393C208.995 225.661 208.895 224.924 208.64 224.235C201.698 211.494 197.804 197.318 197.264 182.819C196.723 168.32 199.551 153.894 205.525 140.672L221.525 112.939C226.49 104.382 234.642 98.1406 244.196 95.578C253.751 93.0155 263.932 94.3407 272.512 99.2639L383.445 163.264C392.012 168.225 398.261 176.381 400.821 185.944C403.381 195.507 402.042 205.695 397.099 214.272L381.099 242.005C372.638 253.786 361.562 263.446 348.74 270.227C335.919 277.008 321.7 280.726 307.2 281.088C306.475 281.208 305.786 281.487 305.181 281.906C304.577 282.324 304.073 282.871 303.706 283.508C303.339 284.145 303.117 284.855 303.058 285.587C302.998 286.32 303.101 287.056 303.36 287.744C310.305 300.487 314.201 314.667 314.742 329.17C315.282 343.673 312.452 358.103 306.475 371.328L290.475 399.061C287.194 404.734 282.479 409.444 276.802 412.717C271.125 415.989 264.686 417.71 258.133 417.707ZM253.867 126.293C252.929 126.291 252.007 126.537 251.194 127.005C250.381 127.473 249.706 128.148 249.237 128.96L233.237 156.693C230.01 165.692 228.778 175.284 229.625 184.806C230.472 194.328 233.379 203.553 238.144 211.84C240.307 217.086 241.237 222.76 240.86 228.422C240.484 234.085 238.812 239.585 235.974 244.5C233.136 249.414 229.206 253.61 224.489 256.766C219.772 259.921 214.394 261.951 208.768 262.699C199.212 262.718 189.773 264.814 181.106 268.84C172.439 272.866 164.75 278.726 158.571 286.016L142.571 313.749C142.218 314.356 141.989 315.026 141.896 315.721C141.803 316.416 141.848 317.122 142.028 317.8C142.209 318.478 142.521 319.113 142.947 319.67C143.373 320.227 143.905 320.694 144.512 321.045L255.445 385.045C256.673 385.737 258.123 385.919 259.484 385.552C260.845 385.185 262.007 384.298 262.72 383.083L278.72 355.349C281.947 346.351 283.18 336.758 282.332 327.236C281.485 317.714 278.578 308.49 273.813 300.203C271.645 294.958 270.712 289.285 271.086 283.622C271.461 277.959 273.132 272.458 275.971 267.544C278.811 262.63 282.742 258.435 287.462 255.282C292.181 252.13 297.563 250.106 303.189 249.365C312.746 249.333 322.182 247.23 330.847 243.201C339.513 239.172 347.203 233.313 353.387 226.027L369.387 198.293C369.739 197.687 369.968 197.017 370.061 196.322C370.154 195.627 370.11 194.92 369.929 194.243C369.749 193.565 369.437 192.93 369.01 192.373C368.584 191.816 368.052 191.348 367.445 190.997L256.512 126.997C255.705 126.539 254.794 126.297 253.867 126.293Z" fill="gray" />
                          <path d="M469.333 272C465.09 272 461.02 270.314 458.019 267.314C455.019 264.313 453.333 260.243 453.333 256C453.335 216.97 441.763 178.815 420.08 146.362C398.397 113.908 367.577 88.6138 331.518 73.6772C295.458 58.7406 255.779 54.8327 217.499 62.4478C179.219 70.0628 144.056 88.8588 116.459 116.459C109.843 123.083 103.698 130.162 98.0692 137.643C95.5231 141.037 91.7327 143.282 87.5319 143.882C83.3311 144.482 79.0639 143.389 75.6692 140.843C72.2744 138.297 70.0301 134.506 69.43 130.305C68.8299 126.105 69.9231 121.837 72.4692 118.443C79.0168 109.791 86.1443 101.595 93.8025 93.9093C125.869 61.8291 166.729 39.9784 211.214 31.1205C255.7 22.2625 301.813 26.7952 343.722 44.1453C385.631 61.4954 421.454 90.8837 446.661 128.594C471.868 166.303 485.326 210.641 485.333 256C485.333 260.243 483.647 264.313 480.647 267.314C477.646 270.314 473.577 272 469.333 272ZM256 485.333C225.882 485.339 196.058 479.411 168.231 467.888C140.405 456.365 115.121 439.472 93.8242 418.176C72.5275 396.879 55.6351 371.595 44.1121 343.769C32.589 315.942 26.6609 286.118 26.6665 256C26.6665 251.757 28.3522 247.687 31.3528 244.686C34.3534 241.686 38.423 240 42.6665 240C46.91 240 50.9796 241.686 53.9802 244.686C56.9808 247.687 58.6665 251.757 58.6665 256C58.6643 295.03 70.2365 333.185 91.9196 365.638C113.603 398.092 144.423 423.386 180.482 438.323C216.541 453.259 256.22 457.167 294.501 449.552C332.781 441.937 367.944 423.141 395.541 395.541C402.153 388.927 408.291 381.856 413.909 374.379C416.539 371.225 420.279 369.202 424.358 368.726C428.436 368.251 432.541 369.359 435.826 371.823C439.111 374.286 441.324 377.917 442.01 381.966C442.695 386.014 441.8 390.171 439.509 393.579C432.97 402.243 425.842 410.448 418.176 418.133C396.928 439.498 371.654 456.438 343.817 467.973C315.98 479.508 286.132 485.408 256 485.333Z" fill="gray" />
                          <path d="M437.013 453.013C432.77 453.013 428.7 451.328 425.699 448.327C422.699 445.326 421.013 441.257 421.013 437.013V392.683H376.661C372.418 392.683 368.348 390.997 365.347 387.996C362.347 384.996 360.661 380.926 360.661 376.683C360.661 372.439 362.347 368.37 365.347 365.369C368.348 362.368 372.418 360.683 376.661 360.683H437.013C441.256 360.683 445.326 362.368 448.327 365.369C451.327 368.37 453.013 372.439 453.013 376.683V437.013C453.013 441.257 451.327 445.326 448.327 448.327C445.326 451.328 441.256 453.013 437.013 453.013ZM135.317 151.317H74.9863C70.7429 151.317 66.6732 149.632 63.6726 146.631C60.672 143.63 58.9863 139.561 58.9863 135.317V74.9867C58.9863 70.7432 60.672 66.6736 63.6726 63.673C66.6732 60.6724 70.7429 58.9867 74.9863 58.9867C79.2298 58.9867 83.2995 60.6724 86.3 63.673C89.3006 66.6736 90.9863 70.7432 90.9863 74.9867V119.317H135.317C139.56 119.317 143.63 121.003 146.631 124.004C149.631 127.004 151.317 131.074 151.317 135.317C151.317 139.561 149.631 143.63 146.631 146.631C143.63 149.632 139.56 151.317 135.317 151.317Z" fill="gray" />
                        </svg>

                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div
                      className={`${styles.card_box_white} ${styles.box_light}`}
                    >
                      <h2 className={styles.box_heading}>{t("Earned Certificates & Badges")}</h2>

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
                        {t("Course's History & Status")}
                      </h2>
                    </div>
                    <div
                      className={`${styles.tebal_box} ${styles.tbl_mobile_view}`}
                    >
                      <div className="table-responsiv">
                        <table className={` ${styles.table} table`}>
                          <tbody>
                            {Array.isArray(courses) && courses?.map((c, index) => {
                              return <tr className={index & 1 ? styles.main_comaputer_wrapper_block : styles.main_comaputer_wrapper_block_second} key={c.id}>
                                <td>
                                  <div className={styles.computer_network_box}>
                                    <div className={styles.comapny_img}>
                                      <img
                                        src={IMAGEBASEURL + c.image}
                                        alt="Company-img"
                                      />
                                    </div>
                                    <div>
                                      <h3 className={styles.course_usr_name}>
                                        {c?.course_name?.length > 30 ? c?.course_name.substring(0, 30) + "..." : c?.course_name}
                                      </h3>
                                      {/* <div className={styles.job_details}>
                                      <span>Nomad</span>
                                      <span>Paris, France</span>
                                      <span>Full-Time</span>
                                    </div> */}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div>
                                    <h3 className={styles.apply_date}>
                                      {t("Date Started")}
                                    </h3>
                                    <span className={styles.Lesson_neme}>
                                      {c.courseStartDate ? moment(c.courseStartDate).format("DD MMMM YYYY") : "-"}
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  <div className={styles.mobile_link}>
                                    <a
                                      href=""
                                      style={{ border: `1px solid ${getCourseStatus(c).color}`, color: getCourseStatus(c).color }}
                                      className={styles.course_usr_box}
                                    >
                                      {getCourseStatus(c).text}
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            })}
                            {Array.isArray(courses) && courses.length == 0 && <p>{t("No Course Found!")}</p>}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {Array.isArray(courses) && courses.length < totalCourses && <div className={styles.Load_More_btn}>
                      <button onClick={loadMoreCourseData}>
                      {t("Load More")}
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
                      </button>
                    </div>}

                  </div>
                </div>

                <div className={styles.Recent_Lessons_History_wrapper}>
                  <div className={styles.Recent_Lessons_History_block}>
                    <div className={styles.Recent_Lessons_head_box}>
                      <h2 className={styles.Recent_Lesson_text}>
                        {t("Membership Status")}
                      </h2>
                    </div>
                    <div className={`table-responsive ${styles.data_table}`} style={{border: "1px solid #d6ddeb"}}>
                      <table className={` ${styles.table} table`}>
                        <thead>
                          <tr>
                            <th>Package</th>
                            <th style={{ textAlign: "center" }}>Start Date</th>
                            <th style={{ textAlign: "center" }}>Expiry Date</th>
                            <th>Remaining Lessons to Complete </th>
                          </tr>
                        </thead>
                        <tbody>
                        {
                          subscriptionList.filter(f => f.is_expire == "0").length <= 0 ?
                          (<tr><td colSpan={5} ><center>{t("No info. to display")}</center></td></tr>)
                          :
                          subscriptionList.filter(f => f.is_expire == "0").map(d => (
                            <tr>
                              <td style={{ textAlign: "left" }}>{d.title} {d.course_type == "functional_mastery" && "(" + d.sub_course_type_name + ")"}</td>
                              <td style={{ textAlign: "center" }}>{moment(d.start).format("DD MMM YYYY")}</td>
                              <td style={{ textAlign: "center" }}>{moment(d.end).format("DD MMM YYYY")}</td>
                              <td style={{ textAlign: "center" }}><span className={styles.job_type}>{d.totalLessons - d.completedLessons}</span></td>
                            </tr>
                          ))
                        }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        className="successfull_popup"
        show={subscriptionAlert}
        onHide={() => setSubscriptionClose(false)}
        centered
      >
        <Modal.Header closeButton>
        <h5>Which journey will you embark on today?</h5>
        </Modal.Header>
        <Modal.Body>
          <div className="modal_inner">
             
             <p>
                <b>Career Roadway:</b> Explore our extensive range of development courses and assessment centers. Earn high scores and prestigious badges that will elevate your profile as a top choice for employers, both within our platform and in the competitive job market. <Link href={"/course?query=true"}>Here</Link> 

             </p> <br />
             <p>
              <b>Jobs Gate:</b> Use our easy-to-use CV builder to create your professional CV. Customize and download your CV in multiple formats to suit different application needs. Apply to multiple job vacancies across various employers, and effortlessly manage and track your applications—all in one convenient place. <Link href={"/job-seeker/job-list"}>Here</Link>
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
  const subscriptionList = await getMyMemberships();
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
      subscriptionList: subscriptionList.list,
      roles: [1],
      ...(await serverSideTranslations(lang_code, [
        'common',
      ])),
    },
  };
}

export default Dashboard;
