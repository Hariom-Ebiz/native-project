import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createAxiosCookies } from "@/fn";
import styles from "../../styles/database.module.css";
import Dropdown from "react-bootstrap/Dropdown";
import Select from "react-select";
import FlagLang from "@/components/FlagLang";

import { useSelector } from "react-redux";
import { logout } from "@/store/authSlice";
import { useDispatch } from "react-redux";
import LogOut from "@/components/logout";
import { IMAGEBASEURL } from "@/api";
import moment from "moment";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import EmployerAuth from "@/components/layout/EmployerAuth";
import { getSavedProfiles } from "@/services/employer/manage-jobs";
import useRequest from "@/hooks/useRequest";
import { Modal } from "react-bootstrap";
import { getCookies } from "@/fn";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from "react-i18next";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Most relevant" },
  { value: "vanilla", label: "Vanilla" },
];

const Database = ({ applicantList }) => {
  
  const { t } = useTranslation('common');

  const [allData, setAllData] = useState(applicantList)
  const [lockedData, setLockedData] = useState(applicantList?.filter(f => f.unlock_profile == "0") || [])
  const [unlockedData, setUnlockedData] = useState(applicantList?.filter(f => f.unlock_profile == "1") || [])
  const { request: getSerachReq, response: getSerachResp } = useRequest();

  const [welcomPopup, setWelcomePopup] = useState(true);
  const handleWelcomeClose = () => setWelcomePopup(false);
  const handleWelcomeShow = () => setWelcomePopup(true);

  

  function calculate_age(dob) {
    // Calculate the difference in milliseconds between the current date and the provided date of birth
    let diff_ms = Date.now() - new Date(dob).getTime();
    // Create a new Date object representing the difference in milliseconds and store it in the letiable age_dt (age Date object)
    let age_dt = new Date(diff_ms);

    // Calculate the absolute value of the difference in years between the age Date object and the year 1970 (UNIX epoch)
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  }
  const [search, setSearch] = useState("")

  const searchText = () => {
    getSerachReq("GET", "employer/applicant/saved/list?search=" + search)
  }

  useEffect(() => {
    if (getSerachResp) {
      setAllData(getSerachResp.applicants)
      setLockedData(getSerachResp.applicants?.filter(f => f.unlock_profile == "0") || [])
      setUnlockedData(getSerachResp.applicants?.filter(f => f.unlock_profile == "1") || [])
    }
  }, [getSerachResp])

  return (
    <>
      <EmployerAuth />
      <div className="page_container">
        <div className="main_content" id="body_lang_css">
          <div className={styles.DatabaseHead}>
            <h2 className={styles.DatabaseTitle}>{t("Applicant’s Database")}</h2>
          </div>

          {/*TABS DATABASE */}

          <div className={` tabsBlock  active_bg ${styles.tabsBlock}`}>
            <Tabs defaultActiveKey="all" id="uncontrolled-tab-example">
              {/* FIRST TAB START */}
              <Tab eventKey="all" title={t("All")}>
                <div className={styles.cv_fillter_head}>
                  <div className="row">
                    <div
                      className={`col-lg-10 col-md-10 col-sm-8 ${styles.firstCol}`}
                    >
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
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M18.0181 18.4851L21.5421 22"
                              stroke="#25324B"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </span>
                        <form onSubmit={(e) => {e.preventDefault(); searchText()}} style={{width: "100%"}}>
                          <input
                            className={styles.inputBorderBottom}
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                            type="text"
                            placeholder={t("Search CV by Job Title and Name with Tool")}
                          />
                        </form>
                      </div>
                    </div>

                    <div
                      className={`col-lg-2 col-md-2 col-sm-4 ${styles.threeCol}`}
                    >
                      <div className={styles.headBtnBox}>
                        <button className={styles.post_btn} onClick={() => searchText()}>{t("Search")}</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className={`table ${styles.table_box}`}>
                    <thead>
                      <tr className={styles.table_row}>
                        <th className={styles.second_col}>
                          <div className="d-flex">
                            <h3 className={styles.table_head}>
                              {t("Full Name")}
                            </h3>
                          </div>
                        </th>
                        <th className={styles.three_col}>
                          <h3 className={styles.table_head}>
                            {t("Details")}
                          </h3>
                        </th>
                        <th colSpan={2} className={styles.for_col}>
                          <h3 className={` text-center ${styles.table_head}`}>
                            {t("Unlock Date")}
                          </h3>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        allData.length <= 0 ? (
                          <tr>
                            <td colSpan={3} rowSpan={2}>{t("No Data Available")}</td>
                          </tr>
                        ) : allData.map(d => {
                          let job_title = "-, ";                          
                          if(d.latest_job_title && d.latest_job_title.length > 80){                            
                            job_title = d.latest_job_title.substring(0,80) + "..., ";
                          } else if(d.latest_job_title) {
                            job_title = d.latest_job_title + ", ";
                          }

                          let company_name = "-, ";
                          if(d.latest_company_name && d.latest_company_name.length > 80){                            
                            company_name = d.latest_company_name.substring(0,80) + "..., ";
                          } else if(d.latest_company_name) {
                            company_name = d.latest_company_name + ", ";
                          }

                          return <tr className={styles.table_row}>
                            <td className={styles.second_col}>
                              <div className="d-flex">
                                <Link href={`/employer/profile-cv?id=${d.job_seeker_id}&from=database`} className={styles.uerBox}>
                                  <img src={(d.profile_pic) ? `${IMAGEBASEURL}${d.profile_pic}` : "/img/no-image.jpg"} alt="user" />
                                  <span className={styles.userName}>
                                    {d.first_name ? `${d.first_name} ${(d.unlock_profile) ? d.last_name : d.last_name[0]}` : "N/A"}
                                  </span>
                                </Link>
                              </div>
                            </td>
                            <td className={styles.three_col}>
                              <p className={styles.Tabletext}>
                                <span className={styles.lebal_text}>
                                  {job_title}
                                </span> {`${company_name }`} {calculate_age(d.dob)} {t("years old")}, {t("lives in")} {d.city_name}, {d.country_name}
                              </p>
                            </td>
                            <td className={` text-center ${styles.for_col}`}>
                              {
                                d.unlock_profile ? (<p className={styles.dateText}>{moment(d.unlock_profile_date).format("DD MMM, YYYY")}</p>) : (<p className={styles.locked_label}>{t("Locked")}</p>)
                              }
                            </td>
                          </tr>
                        })
                      }
                    </tbody>
                  </table>
                </div>
              </Tab>
              {/* FIRST TAB END */}

              {/* SECOND TAB START */}
              <Tab eventKey="locked" title={t("Locked")}>
                <div className={styles.cv_fillter_head}>
                  <div className="row">
                    <div
                      className={`col-lg-10 col-md-10 col-sm-8 ${styles.firstCol}`}
                    >
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
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M18.0181 18.4851L21.5421 22"
                              stroke="#25324B"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </span>
                        <form onSubmit={(e) => {e.preventDefault(); searchText()}}  style={{width: "100%"}}>
                          <input
                            className={styles.inputBorderBottom}
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                            type="text"
                            placeholder="Search CV by Job Title and Name with Tool"
                          />
                        </form>
                      </div>
                    </div>

                    <div
                      className={`col-lg-2 col-md-2 col-sm-4 ${styles.threeCol}`}
                    >
                      <div className={styles.headBtnBox}>
                        <button className={styles.post_btn} onClick={() => searchText()}>{t("Search")}</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className={`table ${styles.table_box}`}>
                    <thead>
                      <tr className={styles.table_row}>
                        <th className={styles.second_col}>
                          <div className="d-flex">
                            <h3 className={styles.table_head}>
                              {t("Full Name")}
                            </h3>
                          </div>
                        </th>
                        <th className={styles.three_col}>
                          <h3 className={styles.table_head}>
                            {t("Details")}
                          </h3>
                        </th>

                      </tr>
                    </thead>
                    <tbody>
                      {
                        lockedData.length <= 0 ? (
                          <tr>
                            <td colSpan={3} rowSpan={2}>{t("No Data Available")}</td>
                          </tr>
                        ) : lockedData.map(d => {
                          let job_title = "-, ";                          
                          if(d.latest_job_title && d.latest_job_title.length > 80){                            
                            job_title = d.latest_job_title.substring(0,80) + "..., ";
                          } else if(d.latest_job_title) {
                            job_title = d.latest_job_title + ", ";
                          }

                          let company_name = "-, ";
                          if(d.latest_company_name && d.latest_company_name.length > 80){                            
                            company_name = d.latest_company_name.substring(0,80) + "..., ";
                          } else if(d.latest_company_name) {
                            company_name = d.latest_company_name + ", ";
                          }
                          return <tr className={styles.table_row}>
                            <td className={styles.second_col}>
                              <div className="d-flex">
                                <Link href={`/employer/profile-cv?id=${d.job_seeker_id}`} className={styles.uerBox}>
                                  <img src={(d.profile_pic) ? `${IMAGEBASEURL}${d.profile_pic}` : "/img/no-image.jpg"} alt="user" />
                                  <span className={styles.userName}>
                                    {d.first_name ? `${d.first_name} ${d.last_name[0]}` : "N/A"}
                                  </span>
                                </Link>
                              </div>
                            </td>
                            <td className={styles.three_col}>
                              <p className={styles.Tabletext}>
                                <span className={styles.lebal_text}>
                                  {job_title}
                                </span>
                                {`${company_name}`} {calculate_age(d.dob)} {t("years old")}, {t("lives in")} {d.city_name}, {d.country_name}
                              </p>
                            </td>
                          </tr>
                        })
                      }
                    </tbody>
                  </table>
                </div>
              </Tab>
              {/* SECOND TAB END */}

              {/* THREE TAB START */}
              <Tab eventKey="unlocked" title={t("Unlocked")}>
                <div className={styles.cv_fillter_head}>
                  <div className="row">
                    <div
                      className={`col-lg-10 col-md-10 col-sm-8 ${styles.firstCol}`}
                    >
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
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M18.0181 18.4851L21.5421 22"
                              stroke="#25324B"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </span>
                        <form onSubmit={(e) => {e.preventDefault(); searchText()}} style={{width: "100%"}}>
                          <input
                            className={styles.inputBorderBottom}
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                            type="text"
                            placeholder="Search CV by Job Title and Name with Tool"
                          />
                        </form>
                      </div>
                    </div>

                    <div
                      className={`col-lg-2 col-md-2 col-sm-4 ${styles.threeCol}`}
                    >
                      <div className={styles.headBtnBox}>
                        <button className={styles.post_btn} onClick={() => searchText()}>{t("Search")}</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className={`table ${styles.table_box}`}>
                    <thead>
                      <tr className={styles.table_row}>
                        <th className={styles.second_col}>
                          <div className="d-flex">
                            <h3 className={styles.table_head}>
                              {t("Full Name")}
                            </h3>
                          </div>
                        </th>
                        <th className={styles.three_col}>
                          <h3 className={styles.table_head}>
                            {t("Details")}
                          </h3>
                        </th>
                        <th colSpan={2} className={styles.for_col}>
                          <h3 className={styles.table_head}>
                            {t("Unlock Date")}
                          </h3>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        unlockedData.length <= 0 ? (
                          <tr>
                            <td colSpan={3} rowSpan={2}>{t("No Data Available")}</td>
                          </tr>
                        ) : unlockedData.map(d => {
                          let job_title = "-, ";                          
                          if(d.latest_job_title && d.latest_job_title.length > 80){                            
                            job_title = d.latest_job_title.substring(0,80) + "..., ";
                          } else if(d.latest_job_title) {
                            job_title = d.latest_job_title + ", ";
                          }
                          let company_name = "-, ";
                          if(d.latest_company_name && d.latest_company_name.length > 80){                            
                            company_name = d.latest_company_name.substring(0,80) + "..., ";
                          } else if(d.latest_company_name) {
                            company_name = d.latest_company_name + ", ";
                          }
                          return <tr className={styles.table_row} key={d.id}>
                            <td className={styles.second_col}>
                              <div className="d-flex">
                                <Link href={`/employer/profile-cv?id=${d.job_seeker_id}`} className={styles.uerBox}>
                                  <img src={(d.profile_pic) ? `${IMAGEBASEURL}${d.profile_pic}` : "/img/no-image.jpg"} alt="user" />
                                  <span className={styles.userName}>
                                    {d.first_name ? `${d.first_name} ${d.last_name}` : "N/A"}
                                  </span>
                                </Link>
                              </div>
                            </td>
                            <td className={styles.three_col}>
                              <p className={styles.Tabletext}>
                                <span className={styles.lebal_text}>
                                  {job_title}
                                </span> {`${company_name}`} {calculate_age(d.dob)} {t("years old")}, {t("lives in")} {d.city_name}, {d.country_name}
                              </p>
                            </td>
                            <td className={styles.for_col}>
                              {
                                d.unlock_profile ? (<p className={styles.dateText}>{moment(d.unlock_profile_date).format("DD MMM, YYYY")}</p>) : (<p className={styles.locked_label}>{t("Locked")}</p>)
                              }
                            </td>
                          </tr>
                        })
                      }
                    </tbody>
                  </table>
                </div>
              </Tab>
              {/* THREE TAB END */}
            </Tabs>
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
              <path d="M54.7687 46.4813L50.0812 41.7938C49.2152 40.9356 48.1027 40.3695 46.8992 40.1746C45.6957 39.9796 44.4614 40.1655 43.3687 40.7063L40.2187 37.5C43.603 33.4167 45.2842 28.1866 44.9132 22.8961C44.5422 17.6056 42.1475 12.6613 38.2265 9.09019C34.3055 5.5191 29.1595 3.59568 23.8575 3.71943C18.5554 3.84318 13.5048 6.0046 9.75467 9.75473C6.00453 13.5049 3.84312 18.5555 3.71937 23.8575C3.59561 29.1596 5.51904 34.3056 9.09013 38.2266C12.6612 42.1476 17.6055 44.5423 22.896 44.9133C28.1865 45.2843 33.4166 43.603 37.5 40.2188L40.65 43.3688C40.1092 44.4614 39.9233 45.6958 40.1182 46.8993C40.3132 48.1027 40.8793 49.2152 41.7375 50.0813L46.425 54.7688C47.5275 55.8611 49.0167 56.4739 50.5687 56.4739C52.1207 56.4739 53.61 55.8611 54.7125 54.7688C55.8123 53.6737 56.4353 52.1886 56.4458 50.6366C56.4563 49.0846 55.8536 47.5912 54.7687 46.4813ZM24.375 41.25C21.0374 41.25 17.7748 40.2603 14.9997 38.4061C12.2246 36.5518 10.0617 33.9163 8.7845 30.8328C7.50727 27.7493 7.17309 24.3563 7.82421 21.0829C8.47534 17.8094 10.0825 14.8026 12.4425 12.4426C14.8025 10.0826 17.8094 8.4754 21.0828 7.82427C24.3562 7.17315 27.7492 7.50733 30.8327 8.78456C33.9162 10.0618 36.5518 12.2247 38.406 14.9998C40.2603 17.7749 41.25 21.0375 41.25 24.375C41.25 28.8506 39.4721 33.1428 36.3074 36.3074C33.1427 39.4721 28.8505 41.25 24.375 41.25ZM52.1062 52.1063C51.9126 52.3024 51.682 52.4582 51.4277 52.5645C51.1734 52.6708 50.9006 52.7255 50.625 52.7255C50.3494 52.7255 50.0765 52.6708 49.8222 52.5645C49.5679 52.4582 49.3373 52.3024 49.1437 52.1063L44.4562 47.4188C44.2386 47.2298 44.0622 46.9981 43.938 46.738C43.8138 46.4779 43.7445 46.195 43.7344 45.907C43.7242 45.619 43.7735 45.3319 43.8791 45.0637C43.9847 44.7956 44.1443 44.552 44.3481 44.3482C44.5519 44.1444 44.7955 43.9847 45.0637 43.8791C45.3319 43.7736 45.6189 43.7243 45.9069 43.7344C46.195 43.7446 46.4778 43.8139 46.7379 43.9381C46.998 44.0623 47.2297 44.2386 47.4187 44.4563L52.1062 49.1438C52.3024 49.3374 52.4581 49.568 52.5644 49.8223C52.6707 50.0766 52.7254 50.3494 52.7254 50.625C52.7254 50.9006 52.6707 51.1735 52.5644 51.4278C52.4581 51.682 52.3024 51.9127 52.1062 52.1063Z" fill="url(#paint0_linear_532_3115)" />
              <defs>
                <linearGradient id="paint0_linear_532_3115" x1="23.1937" y1="47.5125" x2="43.8187" y2="11.7938" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#4A55A5" />
                  <stop offset="1" stop-color="#5DB9BF" />
                </linearGradient>
              </defs>
            </svg>
            <h2 className={styles.modal_heading}> {t("What's This Section About? A Quick Overview!")}</h2>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.modal_content} style={{ textAlign: "left" }}>
            <p>
              {t("Easily track all applicant profiles and resumes you've locked or unlocked. Stay updated on their status to efficiently manage your recruitment efforts.")}
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
  let lang_code = "en";
  try {
    const language = JSON.parse(lang)

    lang_code = String(language.code).toLowerCase()
  } catch (error) {
    lang_code = "en"
  }
  const getSaved = await getSavedProfiles();
  return {
    props: {
      applicantList: getSaved.profiles,
      publicHeader: false,
      publicFooter: false,
      isProtected: true,
      ...(await serverSideTranslations(lang_code, [
        'common',
      ])),
    },
  };
}

export default Database;
