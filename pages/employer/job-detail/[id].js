import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createAxiosCookies, getCookies } from "@/fn";
import styles from "../../../styles/applicant_jobs.module.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import ProgressBar from "react-bootstrap/ProgressBar";
import FlagLang from "@/components/FlagLang";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import LogOut from "@/components/logout";
import Dropdown from "react-bootstrap/Dropdown";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { IMAGEBASEURL } from "@/api";
import EmployerAuth from "@/components/layout/EmployerAuth";
import { getJob } from "@/services/employer/manage-jobs";
import moment from "moment";
import useRequest from "@/hooks/useRequest";
import { useParams } from 'next/navigation'
import { toast } from "react-toastify";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { TableSortingArrows } from "../../../utils/Svg";

function kFormatter(num) {
  return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num)
}

const getStatus = (applicant) => {
  let status = { text: "", color: "black" };
  // if (applicant.is_applied) {
  //   status = { text: "Applied", color: "#F3CF5B" };
  // }
  if (applicant.is_unlock) {
    status = { text: "Unlocked", color: "#F3CF5B" };
  } else {
    status = { text: "Locked", color: "red" };
  }

  if (applicant.shortlisted) {
    status = { text: "Shortlisted", color: "green" };
  }
  if (applicant.interviewd) {
    status = { text: "Final Interview", color: "maroon" };
  }
  if (applicant.selected) {
    status = { text: "Hired", color: "green" };
  }
  if (applicant.rejected) {
    status = { text: "Declined", color: "red" };
  }

  if (status) {
    return status;
  } else {
    return status = { text: "Saved", color: "#2A3858" };
  }
}

const JobDetails = ({ jobDetails }) => {
  const router = useRouter()
  const { t } = useTranslation('common');
  console.log("jobDetails", jobDetails);
  const { id } = useParams();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const { companyProfile } = useSelector((store) => store.auth);
  const handleShow = () => setShow(true);
  const dispatch = useDispatch();
  const [titleWrap, setTitleWrap] = useState(false)
  const [totalDoc, setTotalDoc] = useState(0)
  const [applicantsList, setApplicantsList] = useState([]);
  const [careerLevels, setCareerLevels] = useState([]);
  const [careerName, setCareerName] = useState("")

  const [searchKey, setSearchKey] = useState("")

  const [currentSort, setCurrentSort] = useState({
    sortBy: "created_at",
    order: "desc",
  });

  const [selectedTab, setSelectedTab] = useState("applicants")

  const { request, response } = useRequest();
  const { request: requestCareerLevel, response: responesCareerLevel } = useRequest();

  const getApplicantList = (sortBy) => {
    console.log("yes", sortBy);

    let newOrder = "desc";
    if (currentSort.sortBy == sortBy) {
      newOrder = currentSort.order === "asc" ? "desc" : "asc";
    }
    setCurrentSort({ sortBy: sortBy, order: newOrder })

    if (sortBy == "full_name") {
      setApplicantsList(prev => {

        let newList = [...prev];
        if (newOrder == "desc") {
          newList = newList.sort((a, b) => String(a.first_name + a.last_name).localeCompare(String(b.first_name + b.last_name)))
        }
        else {
          newList = newList.sort((a, b) => String(b.first_name + b.last_name).localeCompare(String(a.first_name + a.last_name)))
        }
        return newList;
      })
    } else if (sortBy == "matching_score") {
      setApplicantsList(prev => {
        let newList = [...prev];
        if (newOrder == "desc") {
          newList.sort((a, b) => {
            const partsA = getRating(a).total.split('.').map(Number);
            const partsB = getRating(b).total.split('.').map(Number);

            for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
              const numA = partsA[i] || 0; // Fallback to 0 if a part is missing
              const numB = partsB[i] || 0;

              if (numA !== numB) {
                return numA - numB;
              }
            }
            return 0;
          });
        }
        else {
          newList.sort((a, b) => {
            const partsA = getRating(a).total.split('.').map(Number);
            const partsB = getRating(b).total.split('.').map(Number);

            for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
              const numA = partsA[i] || 0; // Fallback to 0 if a part is missing
              const numB = partsB[i] || 0;

              if (numA !== numB) {
                return numB - numA;
              }
            }
            return 0;
          });
        }
        return newList;
      })
    } else if (sortBy == "hiring_stage") {
      setApplicantsList(prev => {
        let newList = [...prev];
        if (newOrder == "desc") {
          newList = newList.sort((a, b) => getStatus(a).text.localeCompare(getStatus(b).text))
        }
        else {
          newList = newList.sort((a, b) => getStatus(b).text.localeCompare(getStatus(a).text))
        }
        return newList;
      })
    } else if (sortBy == "created_at") {
      console.log("sortBy");

      setApplicantsList(prev => {
        let newList = [...prev];
        if (newOrder == "desc") {
          newList = newList.sort((a, b) => {
            const d1 = new Date(a.updated_at).getTime();
            const d2 = new Date(b.updated_at).getTime();
            return d1 - d2;
          })
        }
        else {
          newList = newList.sort((a, b) => {
            const d1 = new Date(a.updated_at).getTime();
            const d2 = new Date(b.updated_at).getTime();
            return d2 - d1;
          })
        }
        return newList;
      })
    }
  }

  useEffect(() => {
    document.querySelectorAll(".score_title").forEach(function (element) {
      element.addEventListener("click", function () {
        document.querySelectorAll(".score_show_row").forEach(function (row) {
          row.classList.toggle("show_score");
        });
      });
    });

    // is_applied rejected selected interviewd

    request("get", `employer/job-post/get/applicants-list?id=${id}&sortBy=created_at&order=desc`)
    requestCareerLevel("get", "master/carrier-level-list")
  }, []);

  useEffect(() => {
    if (response) {
      console.log("response", response);
      const { status, list, totalDocuments } = response;
      if (!status) {
        toast.error("Something went wrong!")
        return;
      }


      setApplicantsList(list);
      if (totalDocuments) {
        setTotalDoc(totalDocuments);
      }
    }
  }, [response])

  useEffect(() => {
    if (responesCareerLevel) {
      const { status, list } = responesCareerLevel;
      if (!status) {
        toast.error("Something went wrong");
        return;
      }
      console.log("list", list);
      // setCareerLevels(list)

      if (jobDetails?.career_level) {
        const carrer = list.find(d => String(d.id) == jobDetails?.career_level)
        setCareerName(carrer?.name)
      }
    }
  }, [responesCareerLevel])

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Reason
    </Tooltip>
  );

  function kFormatter(num) {
    return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num)
  }

  const getRating = (applicant) => {

    function getPhycometricScore() {
      let eachCareerValueWeight = jobDetails.career_weight / jobDetails.career_value_count;
      let career_percentage = ((applicant.career_value_match * eachCareerValueWeight) / jobDetails.career_weight) * 100;

      let eachInterestValueWeight = jobDetails.interest_weight / jobDetails.career_interest_count;
      let interest_percentage = ((applicant.career_interest_match * eachInterestValueWeight) / jobDetails.interest_weight) * 100;

      let eachMotivatedSkillWeight = jobDetails.skill_weight / jobDetails.motilvated_skill_count;
      let motivate_skill_percentage = ((applicant.motivated_skill_match * eachMotivatedSkillWeight) / jobDetails.skill_weight) * 100;

      let personalityValueWeight = jobDetails.personality_weight / jobDetails.personality_value_count;
      let personality_percentage = ((applicant.personality_skill_match * personalityValueWeight) / jobDetails.personality_weight) * 100;

      let totalPrecentage = ((career_percentage + interest_percentage + motivate_skill_percentage + personality_percentage) / 400) * 100;

      return isNaN(totalPrecentage) ? 0 : totalPrecentage;
    }

    function getSkillScore() {
      let eachSkillWeight = 100 / jobDetails.keywords.length;
      let kill_percentage = applicant.skill_match * eachSkillWeight;

      return isNaN(kill_percentage) ? 0 : kill_percentage;
    }

    function getAptitudeScore() {

      let aptitudeScore = 0;

      if (applicant.aptitude_match && (jobDetails.logical_number || jobDetails.numerical_number || jobDetails.situational_number || jobDetails.verbal_number)) {

        let aptitudArray = (typeof applicant.aptitude_match == "string") ? JSON.parse(applicant.aptitude_match) : applicant.aptitude_match;
        let numerical = 0;
        let logical = 0;
        let situational = 0;
        let verbal = 0;

        for (const a of aptitudArray) {
          if (a.name == "Numerical") {
            numerical = (a.percentage / 100) * jobDetails.numerical_number;
          } else if (a.name == "Logical") {
            logical = (a.percentage / 100) * jobDetails.logical_number;
          } else if (a.name == "Situational") {
            situational = (a.percentage / 100) * jobDetails.situational_number;
          } else if (a.name == "Verbal") {
            verbal = (a.percentage / 100) * jobDetails.verbal_number;
          }
        }

        let totalWeight = (jobDetails.numerical_number + jobDetails.logical_number + jobDetails.situational_number + jobDetails.verbal_number)

        aptitudeScore = ((numerical + logical + situational + verbal) / totalWeight) * 100;

      }

      return aptitudeScore;
    }

    return (function main() {
      let first = getPhycometricScore();
      let second = getSkillScore();
      let third = getAptitudeScore();

      return { psychometric: ((first / 100) * 10).toFixed(1), skills: ((second / 100) * 10).toFixed(1), aptitude: ((third / 100) * 10).toFixed(1), total: (((((first + second + third) / 300) * 100) / 100) * 10).toFixed(1), badges: applicant.total_certificates > 0 }
    })()
  }

  return (
    <>
      <EmployerAuth />
      <div className="page_container">
        <div
          className={`main_content ${styles.land_ar}`}
          id="body_lang_css"
        >
          <div className={styles.company_message}>
            <div className={styles.company_message_left}>
               <div onClick={() => router.back()} className={styles.morning_text} style={{cursor: window.history.length > 1 ? "pointer": "auto"}}>
               {window.history.length > 1 && <span>
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_18_25084)">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6.6665 19.9997C6.6665 19.0792 7.4127 18.333 8.33317 18.333H31.6665C32.587 18.333 33.3332 19.0792 33.3332 19.9997C33.3332 20.9201 32.587 21.6663 31.6665 21.6663H8.33317C7.4127 21.6663 6.6665 20.9201 6.6665 19.9997Z"
                        fill="#25324B"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.15466 18.8212C7.80553 18.1703 8.86081 18.1703 9.51168 18.8212L19.5117 28.8212C20.1626 29.472 20.1626 30.5273 19.5117 31.1782C18.8608 31.8291 17.8055 31.8291 17.1547 31.1782L7.15466 21.1782C6.50379 20.5273 6.50379 19.472 7.15466 18.8212Z"
                        fill="#25324B"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M19.5117 8.82116C20.1626 9.47204 20.1626 10.5273 19.5117 11.1782L9.51168 21.1782C8.86081 21.8291 7.80553 21.8291 7.15466 21.1782C6.50379 20.5273 6.50379 19.472 7.15466 18.8212L17.1547 8.82116C17.8055 8.17029 18.8608 8.17029 19.5117 8.82116Z"
                        fill="#25324B"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_18_25084">
                        <rect width="40" height="40" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>}
                
                {jobDetails.title.substring(0, 40)}{jobDetails.title.length > 40 && "..."}
              </div>
              
            </div>
                {console.log("selected", selectedTab)}
            {
              jobDetails?.is_posted == 1 && selectedTab == "applicants" ? (
                <div className={styles.company_message_right}>
                  <input
                    type="text"
                    class="form-control"
                    placeholder={t("Search Applicants")}
                    onChange={(e) => setSearchKey(e.target.value)}
                  />
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="11.7666"
                      cy="11.7669"
                      r="8.98856"
                      stroke="#A8ADB7"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18.0183 18.4854L21.5423 22.0002"
                      stroke="#A8ADB7"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              ) : ""
            }
          </div>

          <div className="tabsBlock ps-0">
            <Tabs className="border-0" onSelect={(v) => setSelectedTab(v)}>
              {jobDetails?.is_posted == 1 && <Tab eventKey="applicants" title={t("applicants")}>
                <div
                  className={`table-responsive ${styles.social_media_assistant_table}`}
                >
                  <table className={`tabel w-100 ${styles.applicants_data_table}`}>
                    <thead>
                      <tr>
                        <th>
                          <div
                            className={`custom_checkbox second_checkbox ${styles.data_group} ${styles.top}`} 
                          >
                            <div className={styles.table_row}>
                              <h3 className={styles.table_head_title}>
                                {t("Full Name")}
                              </h3>
                              <span className={styles.sortingArrow} onClick={() => getApplicantList("full_name")}>
                                <TableSortingArrows currentSort={currentSort} checkKey={"full_name"} />
                              </span>
                            </div>
                          </div>
                        </th>
                        <th>
                          <div className={`custom_checkbox second_checkbox ${styles.data_group} d-flex gap-2`} style={{ cursor: 'pointer', justifyContent: "center",}} >
                            <div className={`${styles.table_row} score_title`}>
                              <h3 className={`${styles.table_head_title}`}>
                                {t("Matching Score")}
                              </h3>
                              <OverlayTrigger
                                delay={{ hide: 450, show: 300 }}
                                overlay={(props) => (
                                  <Tooltip {...props}>{t("This is the applicant's Matching Score 'out of 10' —a blend of Psychometric, Aptitude, Skills, & Keywords matching. Want to see the details? Just click on the Matching Score title to dive into each criterion!")}</Tooltip>
                                )}
                                placement="top">
                                <span>
                                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1553_14029)"><path d="M7 13.125C5.37555 13.125 3.81763 12.4797 2.66897 11.331C1.52031 10.1824 0.875 8.62445 0.875 7C0.875 5.37555 1.52031 3.81763 2.66897 2.66897C3.81763 1.52031 5.37555 0.875 7 0.875C8.62445 0.875 10.1824 1.52031 11.331 2.66897C12.4797 3.81763 13.125 5.37555 13.125 7C13.125 8.62445 12.4797 10.1824 11.331 11.331C10.1824 12.4797 8.62445 13.125 7 13.125ZM7 14C8.85652 14 10.637 13.2625 11.9497 11.9497C13.2625 10.637 14 8.85652 14 7C14 5.14348 13.2625 3.36301 11.9497 2.05025C10.637 0.737498 8.85652 0 7 0C5.14348 0 3.36301 0.737498 2.05025 2.05025C0.737498 3.36301 0 5.14348 0 7C0 8.85652 0.737498 10.637 2.05025 11.9497C3.36301 13.2625 5.14348 14 7 14Z" fill="#A8ADB7"></path><path d="M7.81371 5.7645L5.80996 6.01562L5.73821 6.34812L6.13196 6.42075C6.38921 6.482 6.43996 6.57475 6.38396 6.83113L5.73821 9.86562C5.56846 10.6505 5.83008 11.0197 6.44521 11.0197C6.92208 11.0197 7.47596 10.7993 7.72708 10.4965L7.80408 10.1325C7.62908 10.2865 7.37358 10.3478 7.20383 10.3478C6.96321 10.3478 6.87571 10.1789 6.93783 9.88138L7.81371 5.7645ZM7.87496 3.9375C7.87496 4.16956 7.78277 4.39212 7.61868 4.55622C7.45458 4.72031 7.23202 4.8125 6.99996 4.8125C6.76789 4.8125 6.54533 4.72031 6.38124 4.55622C6.21715 4.39212 6.12496 4.16956 6.12496 3.9375C6.12496 3.70544 6.21715 3.48288 6.38124 3.31878C6.54533 3.15469 6.76789 3.0625 6.99996 3.0625C7.23202 3.0625 7.45458 3.15469 7.61868 3.31878C7.78277 3.48288 7.87496 3.70544 7.87496 3.9375Z" fill="#A8ADB7"></path></g><defs><clipPath id="clip0_1553_14029"><rect width="14" height="14" fill="white"></rect></clipPath></defs></svg>
                                </span>
                              </OverlayTrigger>
                            </div>
                            <span className={styles.sortingArrow} onClick={() => getApplicantList("matching_score")}>
                              <TableSortingArrows currentSort={currentSort} checkKey={"matching_score"} />
                            </span>
                          </div>

                        </th>
                        <th className="score_show_row" style={{ justifyContent: "center" }}>
                          <h3 className={`${styles.table_head_title}`}>
                            {t("Psychometric Matching")}
                          </h3>

                        </th>
                        <th className="score_show_row" style={{ justifyContent: "center" }}>
                          <h3 className={`${styles.table_head_title}`}>
                            {t("Aptitude Matching")}
                          </h3>
                        </th>

                        <th className="score_show_row" style={{ justifyContent: "center" }}>
                          <h3 className={`${styles.table_head_title}`}>
                            {t("Skills & Keywords Matching")}
                          </h3>
                        </th>

                        <th className="score_show_row" style={{ justifyContent: "center" }}>
                          <h3 className={`${styles.table_head_title}`}>
                            {t("Badges")}
                          </h3>
                        </th>

                        <th>
                          <div className={styles.table_row}>
                            <h3 className={`${styles.table_head_title}`} style={{ justifyContent: "center", minWidth: "140px" }}>
                              {t("Hiring Stage")}
                            </h3>
                            <span className={styles.sortingArrow} onClick={() => getApplicantList("hiring_stage")}>
                              <TableSortingArrows currentSort={currentSort} checkKey={"hiring_stage"} />
                            </span>

                          </div>

                        </th>
                        <th>
                          <div className={styles.table_row}>
                            <h3 className={styles.table_head_title} style={{ justifyContent: "center" }}>
                              {t("Applied On")}
                            </h3>

                            <span className={styles.sortingArrow} onClick={() => getApplicantList("created_at")}>
                              <TableSortingArrows currentSort={currentSort} checkKey={"created_at"} />
                            </span>
                          </div>


                        </th>

                        <th>
                          <h3 className={styles.table_head_title} style={{ justifyContent: "center" }}>
                            {t("Action")}

                          </h3>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {console.log("applicantsList",applicantsList.map(f => String(f.first_name).toLowerCase().includes(searchKey)), searchKey)}
                      
                      {Array.isArray(applicantsList) && applicantsList.filter(f => {return String(f.first_name + " " + f.last_name).toLowerCase().includes(searchKey)}).map(applicant => {
                        
                        const ratings = getRating(applicant)
                        let name = "Native User";
                        if(applicant.is_unlock){
                          name = (applicant.first_name ?? "Native") + " " + (applicant.last_name ?? "User")
                        } else if(applicant.first_name) {
                          name = applicant.first_name;
                          if(applicant.last_name && applicant.last_name.length > 0){
                            name += ` ${applicant.last_name[0]}`
                          }
                        }
                        return <tr key={applicant._id}>
                          <td style={{paddingLeft: "10px"}}>
                            <div
                              className={`custom_checkbox second_checkbox ${styles.data_group}`}
                            >
                              <h3 className={styles.user_name_text} style={{ textTransform: "capitalize" }}>
                                <img
                                  src={applicant.profile_picture ? `${IMAGEBASEURL}${applicant.profile_picture}` : "/img/user-icon.png"}
                                  className={styles.user_img}
                                  alt="USER IMG"
                                />
                                {console.log("applicant", applicant.last_name)}

                                {name}
                              </h3>
                            </div>
                          </td>
                          <td>
                            <div className={styles.td_data} style={{ justifyContent: "center" }}>
                              <svg
                                width="23"
                                height="21"
                                viewBox="0 0 23 21"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M11.7927 0.00195312C12.1733 0.00195312 12.521 0.218054 12.6894 0.559392L15.5426 6.34073L21.9221 7.26529C22.299 7.31992 22.6122 7.58388 22.7298 7.94609C22.8474 8.30831 22.7491 8.70589 22.4762 8.97153L17.8532 13.4715L18.9433 19.8259C19.0077 20.2012 18.8533 20.5805 18.5451 20.8042C18.2369 21.0279 17.8284 21.0572 17.4915 20.8796L11.7991 17.88L6.09303 20.8801C5.75611 21.0572 5.34784 21.0277 5.03988 20.804C4.73193 20.5802 4.57771 20.2011 4.64207 19.8259L5.7321 13.4715L1.10916 8.97153C0.836262 8.70589 0.737937 8.30831 0.855563 7.94609C0.973189 7.58388 1.28634 7.31992 1.66324 7.26529L8.04271 6.34073L10.8959 0.559392C11.0644 0.218054 11.412 0.00195312 11.7927 0.00195312ZM11.7927 3.26153L9.60341 7.69751C9.45769 7.99278 9.17596 8.19739 8.8501 8.24461L3.95808 8.9536L7.50418 12.4054C7.74021 12.6351 7.84796 12.9664 7.79227 13.291L6.95587 18.1668L11.3343 15.8648C11.6259 15.7115 11.9744 15.7117 12.2659 15.8653L16.6291 18.1645L15.7931 13.291C15.7374 12.9664 15.8451 12.6351 16.0812 12.4054L19.6273 8.9536L14.7352 8.24461C14.4094 8.19739 14.1277 7.99278 13.9819 7.69751L11.7927 3.26153Z"
                                  fill="#25324B"
                                />
                              </svg>
                              <span className={styles.td_data_text}>{ratings.total}</span>
                            </div>
                          </td>
                          <td className="score_show_row">
                            {
                              (jobDetails.career_weight || jobDetails.interest_weight || jobDetails.skill_weight || jobDetails.personality_weight) ?
                              <div className={styles.td_data} style={{ justifyContent: "center" }}>
                                <svg
                                  width="23"
                                  height="21"
                                  viewBox="0 0 23 21"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M11.7927 0.00195312C12.1733 0.00195312 12.521 0.218054 12.6894 0.559392L15.5426 6.34073L21.9221 7.26529C22.299 7.31992 22.6122 7.58388 22.7298 7.94609C22.8474 8.30831 22.7491 8.70589 22.4762 8.97153L17.8532 13.4715L18.9433 19.8259C19.0077 20.2012 18.8533 20.5805 18.5451 20.8042C18.2369 21.0279 17.8284 21.0572 17.4915 20.8796L11.7991 17.88L6.09303 20.8801C5.75611 21.0572 5.34784 21.0277 5.03988 20.804C4.73193 20.5802 4.57771 20.2011 4.64207 19.8259L5.7321 13.4715L1.10916 8.97153C0.836262 8.70589 0.737937 8.30831 0.855563 7.94609C0.973189 7.58388 1.28634 7.31992 1.66324 7.26529L8.04271 6.34073L10.8959 0.559392C11.0644 0.218054 11.412 0.00195312 11.7927 0.00195312ZM11.7927 3.26153L9.60341 7.69751C9.45769 7.99278 9.17596 8.19739 8.8501 8.24461L3.95808 8.9536L7.50418 12.4054C7.74021 12.6351 7.84796 12.9664 7.79227 13.291L6.95587 18.1668L11.3343 15.8648C11.6259 15.7115 11.9744 15.7117 12.2659 15.8653L16.6291 18.1645L15.7931 13.291C15.7374 12.9664 15.8451 12.6351 16.0812 12.4054L19.6273 8.9536L14.7352 8.24461C14.4094 8.19739 14.1277 7.99278 13.9819 7.69751L11.7927 3.26153Z"
                                    fill="#25324B"
                                  />
                                </svg>
                                <span className={styles.td_data_text}>{ratings.psychometric}</span>
                              </div> : <div className={styles.td_data} style={{ justifyContent: "center" }}>-</div>
                            }
                          </td>
                          <td className="score_show_row">
                            {
                              (jobDetails.logical_number || jobDetails.numerical_number || jobDetails.situational_number || jobDetails.verbal_number) ?
                              <div className={styles.td_data} style={{ justifyContent: "center" }}>
                                <svg
                                  width="23"
                                  height="21"
                                  viewBox="0 0 23 21"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M11.7927 0.00195312C12.1733 0.00195312 12.521 0.218054 12.6894 0.559392L15.5426 6.34073L21.9221 7.26529C22.299 7.31992 22.6122 7.58388 22.7298 7.94609C22.8474 8.30831 22.7491 8.70589 22.4762 8.97153L17.8532 13.4715L18.9433 19.8259C19.0077 20.2012 18.8533 20.5805 18.5451 20.8042C18.2369 21.0279 17.8284 21.0572 17.4915 20.8796L11.7991 17.88L6.09303 20.8801C5.75611 21.0572 5.34784 21.0277 5.03988 20.804C4.73193 20.5802 4.57771 20.2011 4.64207 19.8259L5.7321 13.4715L1.10916 8.97153C0.836262 8.70589 0.737937 8.30831 0.855563 7.94609C0.973189 7.58388 1.28634 7.31992 1.66324 7.26529L8.04271 6.34073L10.8959 0.559392C11.0644 0.218054 11.412 0.00195312 11.7927 0.00195312ZM11.7927 3.26153L9.60341 7.69751C9.45769 7.99278 9.17596 8.19739 8.8501 8.24461L3.95808 8.9536L7.50418 12.4054C7.74021 12.6351 7.84796 12.9664 7.79227 13.291L6.95587 18.1668L11.3343 15.8648C11.6259 15.7115 11.9744 15.7117 12.2659 15.8653L16.6291 18.1645L15.7931 13.291C15.7374 12.9664 15.8451 12.6351 16.0812 12.4054L19.6273 8.9536L14.7352 8.24461C14.4094 8.19739 14.1277 7.99278 13.9819 7.69751L11.7927 3.26153Z"
                                    fill="#25324B"
                                  />
                                </svg>
                                <span className={styles.td_data_text}>{ratings.aptitude}</span>
                              </div> : <div className={styles.td_data} style={{ justifyContent: "center" }}>-</div>

                            }
                          </td>

                          <td className="score_show_row">
                            <div className={styles.td_data} style={{ justifyContent: "center" }}>
                              <svg
                                width="23"
                                height="21"
                                viewBox="0 0 23 21"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M11.7927 0.00195312C12.1733 0.00195312 12.521 0.218054 12.6894 0.559392L15.5426 6.34073L21.9221 7.26529C22.299 7.31992 22.6122 7.58388 22.7298 7.94609C22.8474 8.30831 22.7491 8.70589 22.4762 8.97153L17.8532 13.4715L18.9433 19.8259C19.0077 20.2012 18.8533 20.5805 18.5451 20.8042C18.2369 21.0279 17.8284 21.0572 17.4915 20.8796L11.7991 17.88L6.09303 20.8801C5.75611 21.0572 5.34784 21.0277 5.03988 20.804C4.73193 20.5802 4.57771 20.2011 4.64207 19.8259L5.7321 13.4715L1.10916 8.97153C0.836262 8.70589 0.737937 8.30831 0.855563 7.94609C0.973189 7.58388 1.28634 7.31992 1.66324 7.26529L8.04271 6.34073L10.8959 0.559392C11.0644 0.218054 11.412 0.00195312 11.7927 0.00195312ZM11.7927 3.26153L9.60341 7.69751C9.45769 7.99278 9.17596 8.19739 8.8501 8.24461L3.95808 8.9536L7.50418 12.4054C7.74021 12.6351 7.84796 12.9664 7.79227 13.291L6.95587 18.1668L11.3343 15.8648C11.6259 15.7115 11.9744 15.7117 12.2659 15.8653L16.6291 18.1645L15.7931 13.291C15.7374 12.9664 15.8451 12.6351 16.0812 12.4054L19.6273 8.9536L14.7352 8.24461C14.4094 8.19739 14.1277 7.99278 13.9819 7.69751L11.7927 3.26153Z"
                                  fill="#25324B"
                                />
                              </svg>
                              <span className={styles.td_data_text}>{ratings.skills}</span>
                            </div>
                          </td>

                          <td className="score_show_row">
                            <div className={styles.td_data} style={{ justifyContent: "center" }}>
                              <span className={styles.td_data_text}>{ratings.badges ? "Yes" : "No"}</span>
                            </div>
                          </td>

                          <td style={{ textAlign: "center" }}>
                            <span className={styles.button_track} style={{ color: getStatus(applicant).color }}>
                              {getStatus(applicant).text}
                            </span>
                          </td>
                          <td style={{ textAlign: "center" }}>{moment(applicant.created_at).format("DD MMMM, YYYY hh:mm A")}</td>
                          <td>
                            <div className={styles.application_box} style={{ justifyContent: "center" }}>
                              <Link href={`/employer/job-detail/application/${id}/${applicant.id}?seekerId=${applicant.job_seeker_id}&rating=${ratings.total}`} className={styles.application_btn}>
                                {t("See Application")}
                              </Link>
                            </div>
                          </td>
                        </tr>
                      })}
                      {Array.isArray(applicantsList) && applicantsList?.length == 0 && <td colSpan={15} style={{ padding: "16px", margin: "0px", textAlign: "center" }}>{t("No Applications Yet.")}</td>}
                    </tbody>
                  </table>
                </div>
              </Tab>}

              <Tab eventKey="job details" title={jobDetails?.is_posted == 1 ? t("Job Details") : ""}>
                <div className={`${styles.edit_job_inner_head} ${styles.social_head}`}>
                  <div className={styles.left_box}>
                    <div className={styles.icon_wrapper}>
                      <img src={(jobDetails.logo) ? `${IMAGEBASEURL}${jobDetails.logo}` : "/img/no-image.jpg"} alt="social-icon" />
                    </div>
                    <div>

                      {
                        (titleWrap || jobDetails.title.length <= 40) ? (
                          <h4 className={styles.social_head_title}>
                            {jobDetails.title}
                          </h4>
                        )
                          :
                          (
                            <h4 className={styles.social_head_title}>
                              {jobDetails.title.substring(0, 40)}<span style={{ "cursor": "pointer" }} onClick={() => setTitleWrap(true)}>...</span>
                            </h4>
                          )
                      }
                    </div>

                  </div>
                  {
                    jobDetails.is_posted == 0 && (
                      <div className={styles.next_step_btn_block}>
                        <Link
                          href={"/employer/edit-job?id=" + jobDetails.id}
                          className={`${styles.next_btn}`}
                          
                        >

                          <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M1.23223 4.35235C1.70107 3.88351 2.33696 3.62012 3 3.62012H5.5C5.96024 3.62012 6.33333 3.99321 6.33333 4.45345C6.33333 4.91369 5.96024 5.28678 5.5 5.28678H3C2.77899 5.28678 2.56702 5.37458 2.41074 5.53086C2.25446 5.68714 2.16667 5.8991 2.16667 6.12012V13.6201C2.16667 13.8411 2.25446 14.0531 2.41074 14.2094C2.56702 14.3657 2.77899 14.4535 3 14.4535H10.5C10.721 14.4535 10.933 14.3657 11.0893 14.2094C11.2455 14.0531 11.3333 13.8411 11.3333 13.6201V11.1201C11.3333 10.6599 11.7064 10.2868 12.1667 10.2868C12.6269 10.2868 13 10.6599 13 11.1201V13.6201C13 14.2832 12.7366 14.919 12.2678 15.3879C11.7989 15.8567 11.163 16.1201 10.5 16.1201H3C2.33696 16.1201 1.70107 15.8567 1.23223 15.3879C0.763392 14.919 0.5 14.2832 0.5 13.6201V6.12012C0.5 5.45708 0.763392 4.82119 1.23223 4.35235Z" fill="currentcolor" />
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9941 0.947391C12.4819 0.45959 13.1435 0.185547 13.8334 0.185547C14.5232 0.185547 15.1848 0.45959 15.6726 0.947391C16.1604 1.43519 16.4345 2.09679 16.4345 2.78665C16.4345 3.4765 16.1604 4.1381 15.6726 4.6259L8.58928 11.7092C8.433 11.8655 8.22103 11.9533 8.00002 11.9533H5.50002C5.03978 11.9533 4.66669 11.5802 4.66669 11.12V8.61998C4.66669 8.39897 4.75448 8.18701 4.91076 8.03073L11.9941 0.947391ZM13.8334 1.85221C13.5855 1.85221 13.3478 1.95066 13.1726 2.1259L6.33335 8.96516V10.2866H7.65484L14.4941 3.44739C14.6693 3.27215 14.7678 3.03447 14.7678 2.78665C14.7678 2.53882 14.6693 2.30114 14.4941 2.1259C14.3189 1.95066 14.0812 1.85221 13.8334 1.85221Z" fill="currentcolor" />
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M10.7441 2.1972C11.0695 1.87177 11.5972 1.87177 11.9226 2.1972L14.4226 4.6972C14.748 5.02264 14.748 5.55028 14.4226 5.87571C14.0972 6.20115 13.5695 6.20115 13.2441 5.87571L10.7441 3.37571C10.4186 3.05028 10.4186 2.52264 10.7441 2.1972Z" fill="currentcolor" />
                            </svg>
                          </span>
                          &nbsp; {t("Edit Job")} {t("Details")}
                        </Link>
                      </div>
                    )
                  }
                </div>


                <div className={styles.details_page_main}>
                  <div className="row">
                    <div className="col-md-7">
                      <div className={styles.details_page_left}>
                        <div className={styles.details_content_box}>
                          <h2 className={styles.box_title}>
                            {t("Job Description")}
                          </h2>
                          <ul className={styles.requirements_list}>
                            {jobDetails?.job_description.split("\n").map(d => {
                              if (d.trim()) {
                                return (
                                  <li className={styles.requirements_list_items} style={{ wordBreak: "break-word" }}>
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
                              jobDetails?.job_requirements?.split("\n").map(d => {

                                if (d.trim()) {

                                  return (
                                    <li className={styles.requirements_list_items} key={d.id}>
                                      <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_1397_9362)">
                                          <path fillRule="evenodd" clipRule="evenodd" d="M9.99999 3.57389C6.31809 3.57389 3.33332 6.55866 3.33332 10.2406C3.33332 13.9225 6.31809 16.9072 9.99999 16.9072C13.6819 16.9072 16.6667 13.9225 16.6667 10.2406C16.6667 6.55866 13.6819 3.57389 9.99999 3.57389ZM1.66666 10.2406C1.66666 5.63819 5.39762 1.90723 9.99999 1.90723C14.6024 1.90723 18.3333 5.63819 18.3333 10.2406C18.3333 14.8429 14.6024 18.5739 9.99999 18.5739C5.39762 18.5739 1.66666 14.8429 1.66666 10.2406Z" fill="#56CDAD" />
                                          <path fillRule="evenodd" clipRule="evenodd" d="M13.0892 7.98431C13.4147 8.30975 13.4147 8.83739 13.0892 9.16282L9.75591 12.4962C9.43048 12.8216 8.90284 12.8216 8.5774 12.4962L6.91073 10.8295C6.5853 10.5041 6.5853 9.97642 6.91073 9.65098C7.23617 9.32554 7.76381 9.32554 8.08925 9.65098L9.16666 10.7284L11.9107 7.98431C12.2362 7.65888 12.7638 7.65888 13.0892 7.98431Z" fill="#56CDAD" />
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
                            {/* <li className={styles.requirements_list_items}>
                                                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0_1397_9362)">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M9.99999 3.57389C6.31809 3.57389 3.33332 6.55866 3.33332 10.2406C3.33332 13.9225 6.31809 16.9072 9.99999 16.9072C13.6819 16.9072 16.6667 13.9225 16.6667 10.2406C16.6667 6.55866 13.6819 3.57389 9.99999 3.57389ZM1.66666 10.2406C1.66666 5.63819 5.39762 1.90723 9.99999 1.90723C14.6024 1.90723 18.3333 5.63819 18.3333 10.2406C18.3333 14.8429 14.6024 18.5739 9.99999 18.5739C5.39762 18.5739 1.66666 14.8429 1.66666 10.2406Z" fill="#56CDAD"/>
                                                <path fillRule="evenodd" clipRule="evenodd" d="M13.0892 7.98431C13.4147 8.30975 13.4147 8.83739 13.0892 9.16282L9.75591 12.4962C9.43048 12.8216 8.90284 12.8216 8.5774 12.4962L6.91073 10.8295C6.5853 10.5041 6.5853 9.97642 6.91073 9.65098C7.23617 9.32554 7.76381 9.32554 8.08925 9.65098L9.16666 10.7284L11.9107 7.98431C12.2362 7.65888 12.7638 7.65888 13.0892 7.98431Z" fill="#56CDAD"/>
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
                                            <g clipPath="url(#clip0_1397_9362)">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M9.99999 3.57389C6.31809 3.57389 3.33332 6.55866 3.33332 10.2406C3.33332 13.9225 6.31809 16.9072 9.99999 16.9072C13.6819 16.9072 16.6667 13.9225 16.6667 10.2406C16.6667 6.55866 13.6819 3.57389 9.99999 3.57389ZM1.66666 10.2406C1.66666 5.63819 5.39762 1.90723 9.99999 1.90723C14.6024 1.90723 18.3333 5.63819 18.3333 10.2406C18.3333 14.8429 14.6024 18.5739 9.99999 18.5739C5.39762 18.5739 1.66666 14.8429 1.66666 10.2406Z" fill="#56CDAD"/>
                                            <path fillRule="evenodd" clipRule="evenodd" d="M13.0892 7.98431C13.4147 8.30975 13.4147 8.83739 13.0892 9.16282L9.75591 12.4962C9.43048 12.8216 8.90284 12.8216 8.5774 12.4962L6.91073 10.8295C6.5853 10.5041 6.5853 9.97642 6.91073 9.65098C7.23617 9.32554 7.76381 9.32554 8.08925 9.65098L9.16666 10.7284L11.9107 7.98431C12.2362 7.65888 12.7638 7.65888 13.0892 7.98431Z" fill="#56CDAD"/>
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
                                            <g clipPath="url(#clip0_1397_9362)">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M9.99999 3.57389C6.31809 3.57389 3.33332 6.55866 3.33332 10.2406C3.33332 13.9225 6.31809 16.9072 9.99999 16.9072C13.6819 16.9072 16.6667 13.9225 16.6667 10.2406C16.6667 6.55866 13.6819 3.57389 9.99999 3.57389ZM1.66666 10.2406C1.66666 5.63819 5.39762 1.90723 9.99999 1.90723C14.6024 1.90723 18.3333 5.63819 18.3333 10.2406C18.3333 14.8429 14.6024 18.5739 9.99999 18.5739C5.39762 18.5739 1.66666 14.8429 1.66666 10.2406Z" fill="#56CDAD"/>
                                            <path fillRule="evenodd" clipRule="evenodd" d="M13.0892 7.98431C13.4147 8.30975 13.4147 8.83739 13.0892 9.16282L9.75591 12.4962C9.43048 12.8216 8.90284 12.8216 8.5774 12.4962L6.91073 10.8295C6.5853 10.5041 6.5853 9.97642 6.91073 9.65098C7.23617 9.32554 7.76381 9.32554 8.08925 9.65098L9.16666 10.7284L11.9107 7.98431C12.2362 7.65888 12.7638 7.65888 13.0892 7.98431Z" fill="#56CDAD"/>
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
                          <div className={styles.description} style={{ wordBreak: "break-word" }} dangerouslySetInnerHTML={{ __html: `<pre style="white-space: pre-wrap; word-wrap: break-word; font-size: 16px; font-family: 'Karla', sans-serif;"">${jobDetails.description}</pre>` }} />
                          {/* <ul className={styles.requirements_list}> */}
                          {
                            // jobDetails?.skills_qualifications?.split("\n").map(d => (
                            // <li className={styles.requirements_list_items}>
                            //     <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            //     <g clipPath="url(#clip0_1397_9362)">
                            //         <path fillRule="evenodd" clipRule="evenodd" d="M9.99999 3.57389C6.31809 3.57389 3.33332 6.55866 3.33332 10.2406C3.33332 13.9225 6.31809 16.9072 9.99999 16.9072C13.6819 16.9072 16.6667 13.9225 16.6667 10.2406C16.6667 6.55866 13.6819 3.57389 9.99999 3.57389ZM1.66666 10.2406C1.66666 5.63819 5.39762 1.90723 9.99999 1.90723C14.6024 1.90723 18.3333 5.63819 18.3333 10.2406C18.3333 14.8429 14.6024 18.5739 9.99999 18.5739C5.39762 18.5739 1.66666 14.8429 1.66666 10.2406Z" fill="#56CDAD" />
                            //         <path fillRule="evenodd" clipRule="evenodd" d="M13.0892 7.98431C13.4147 8.30975 13.4147 8.83739 13.0892 9.16282L9.75591 12.4962C9.43048 12.8216 8.90284 12.8216 8.5774 12.4962L6.91073 10.8295C6.5853 10.5041 6.5853 9.97642 6.91073 9.65098C7.23617 9.32554 7.76381 9.32554 8.08925 9.65098L9.16666 10.7284L11.9107 7.98431C12.2362 7.65888 12.7638 7.65888 13.0892 7.98431Z" fill="#56CDAD" />
                            //     </g>
                            //     <defs>
                            //         <clipPath id="clip0_1397_9362">
                            //         <rect width="20" height="20" fill="white" transform="translate(0 0.240234)" />
                            //         </clipPath>
                            //     </defs>
                            //     </svg>
                            //     {d}
                            // </li>
                            // ))


                          }
                          {/* <li className={styles.requirements_list_items}>
                                                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0_1397_9362)">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M9.99999 3.57389C6.31809 3.57389 3.33332 6.55866 3.33332 10.2406C3.33332 13.9225 6.31809 16.9072 9.99999 16.9072C13.6819 16.9072 16.6667 13.9225 16.6667 10.2406C16.6667 6.55866 13.6819 3.57389 9.99999 3.57389ZM1.66666 10.2406C1.66666 5.63819 5.39762 1.90723 9.99999 1.90723C14.6024 1.90723 18.3333 5.63819 18.3333 10.2406C18.3333 14.8429 14.6024 18.5739 9.99999 18.5739C5.39762 18.5739 1.66666 14.8429 1.66666 10.2406Z" fill="#56CDAD"/>
                                                <path fillRule="evenodd" clipRule="evenodd" d="M13.0892 7.98431C13.4147 8.30975 13.4147 8.83739 13.0892 9.16282L9.75591 12.4962C9.43048 12.8216 8.90284 12.8216 8.5774 12.4962L6.91073 10.8295C6.5853 10.5041 6.5853 9.97642 6.91073 9.65098C7.23617 9.32554 7.76381 9.32554 8.08925 9.65098L9.16666 10.7284L11.9107 7.98431C12.2362 7.65888 12.7638 7.65888 13.0892 7.98431Z" fill="#56CDAD"/>
                                                </g>
                                                <defs>
                                                <clipPath id="clip0_1397_9362">
                                                <rect width="20" height="20" fill="white" transform="translate(0 0.240234)"/>
                                                </clipPath>
                                                </defs>
                                                </svg>
                                                Project management skills
                                            </li>
                                            <li className={styles.requirements_list_items}>
                                                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clipPath="url(#clip0_1397_9362)">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M9.99999 3.57389C6.31809 3.57389 3.33332 6.55866 3.33332 10.2406C3.33332 13.9225 6.31809 16.9072 9.99999 16.9072C13.6819 16.9072 16.6667 13.9225 16.6667 10.2406C16.6667 6.55866 13.6819 3.57389 9.99999 3.57389ZM1.66666 10.2406C1.66666 5.63819 5.39762 1.90723 9.99999 1.90723C14.6024 1.90723 18.3333 5.63819 18.3333 10.2406C18.3333 14.8429 14.6024 18.5739 9.99999 18.5739C5.39762 18.5739 1.66666 14.8429 1.66666 10.2406Z" fill="#56CDAD"/>
                                            <path fillRule="evenodd" clipRule="evenodd" d="M13.0892 7.98431C13.4147 8.30975 13.4147 8.83739 13.0892 9.16282L9.75591 12.4962C9.43048 12.8216 8.90284 12.8216 8.5774 12.4962L6.91073 10.8295C6.5853 10.5041 6.5853 9.97642 6.91073 9.65098C7.23617 9.32554 7.76381 9.32554 8.08925 9.65098L9.16666 10.7284L11.9107 7.98431C12.2362 7.65888 12.7638 7.65888 13.0892 7.98431Z" fill="#56CDAD"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_1397_9362">
                                            <rect width="20" height="20" fill="white" transform="translate(0 0.240234)"/>
                                            </clipPath>
                                            </defs>
                                                </svg>
                                                Copy editing skills
                                            </li> */}

                          {/* </ul> */}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-1"></div>
                    <div className="col-md-4">
                      <div className={styles.details_page_right}>
                        <div className={styles.job_about_box}>
                          <h2 class={styles.box_title}>{t("About this role")}</h2>
                          {jobDetails.is_posted == 1 &&
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
                                          style={{ width: (applicantsList?.length < jobDetails.vacancies) ? `${Math.round((applicantsList?.length / jobDetails.vacancies) * 100)}%` : "100%" }}
                                        // style={{ width: "100%" }}
                                        ></div>
                                      </div>
                                      <div className="apply_count">
                                        <h5>
                                          {t("applyTestInJobList", { 1: applicantsList?.length, 2: jobDetails.vacancies })}
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
                          }
                          <div>
                            <ul className={styles.role_list}>
                              <li className={styles.role_list_items}>
                                <span className={styles.job_tag}>
                                  {t("Apply Before")}
                                </span>
                                <span className={styles.job_sub_tag}>
                                  {moment(jobDetails?.apply_before).format("MMMM DD, YYYY")}
                                </span>
                              </li>
                              <li className={styles.role_list_items}>
                                {jobDetails.is_posted == 1 ? <span className={styles.job_tag}>
                                  {t("Posted On")}
                                </span> : <span className={styles.job_tag}>
                                  {t("Saved On")}
                                </span>}
                                {jobDetails.is_posted == 1 ? <span className={styles.job_sub_tag}>
                                  {(jobDetails?.posted_on) ? moment(jobDetails?.posted_on).format("MMMM DD, YYYY") : "-"}
                                </span> : <span className={styles.job_sub_tag}>
                                  {(jobDetails?.created_at) ? moment(jobDetails?.created).format("MMMM DD, YYYY") : "-"}
                                </span>}
                              </li>
                              <li className={styles.role_list_items}>
                                <span className={styles.job_tag}>
                                  {t("Job Type")}
                                </span>
                                <span className={styles.job_sub_tag}>
                                  {jobDetails.job_type_name}
                                </span>
                              </li>
                              <li className={styles.role_list_items}>
                                <span className={styles.job_tag}>{t("Experience")} </span>
                                <span className={styles.job_sub_tag}>
                                  <span className={` w-100 d-block text-right ${styles.job_sub_tag}`} style={{ "textTransform": "capitalize" }}>{careerName} </span>
                                </span>
                              </li>
                              <li className={styles.role_list_items}>
                                <span className={styles.job_tag}>{t("Salary")}</span>
                                <span className={styles.job_sub_tag}>
                                  {kFormatter(jobDetails.salary_range_from)} to {kFormatter(jobDetails.salary_range_to)} {String(jobDetails.salary_currency).toUpperCase()}/Month
                                </span>
                              </li>
                              <li className={styles.role_list_items}>
                                <span className={styles.job_tag}>
                                  {t("Location")}
                                </span>
                                <span className={styles.job_sub_tag}>
                                  {jobDetails.area_name || jobDetails.other_area}, {jobDetails.city_name}, {jobDetails.country_name}
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
                              {jobDetails.job_type_name ?? "-"}
                            </li>
                            <li
                              className={`${styles.statusItems} ${styles.yellowBtn}`}
                            >
                              {(jobDetails.job_category_id ? jobDetails.job_category_name : jobDetails.other_job_category) ?? "-"}
                            </li>

                          </ul>
                        </div>
                        {Array.isArray(jobDetails.keywords) && jobDetails.keywords.length > 0 && <div className={styles.job_about_box}>
                          <h2 class={styles.box_title}>{t("Required Skills")}</h2>
                          <div className={styles.skills_tags_box}>
                            {
                              jobDetails.keywords.map(d => (
                                <span className={styles.skills_tags}>{d.skill}</span>
                              ))
                            }
                          </div>
                        </div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  createAxiosCookies(context);
  let { id } = context.query;
  const { lang } = getCookies(context);
  let lang_code = "en";
  try {
    const language = JSON.parse(lang)

    lang_code = String(language.code).toLowerCase()
  } catch (error) {
    lang_code = "en"
  }

  const jobDetails = await getJob(id)
  return {
    props: {
      jobDetails: jobDetails.job,
      publicHeader: false,
      publicFooter: false,
      ...(await serverSideTranslations(lang_code, [
        'common',
      ])),
    },
  };
}

export default JobDetails;
