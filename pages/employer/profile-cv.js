import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createAxiosCookies } from "@/fn";
import styles from "../../styles/profile_cv.module.css";
import Modalstyles from "../../styles/search_cv.module.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import FlagLang from "@/components/FlagLang";
import Form from 'react-bootstrap/Form';
import { useSelector } from "react-redux";
import { logout, updateCompanyProfile } from "@/store/authSlice";
import { useDispatch } from "react-redux";
import LogOut from "@/components/logout";
import { API, CANDIDATE_URL, IMAGEBASEURL } from "@/api";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Dropdown from 'react-bootstrap/Dropdown';
import EmployerAuth from "@/components/layout/EmployerAuth";
import { useRouter } from "next/router";
import useRequest from "@/hooks/useRequest";
import moment from "moment";
import { getFirstLetterCapital, getLatestCompany, getTotalExperience, timeGapYearMonth } from "@/utils/helper";
import { getInviteMailTemplete, getSearchCvs, inviteCnadidateMailTemplate } from "@/services/employer/searchCv";
import { toast } from "react-toastify";
import MakeListShort from "@/components/common/MakeListShort";
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { getCookies } from "@/fn";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from "react-i18next";

const Profilecv = ({inviteCnadidateMailTemplate}) => {
  const { t } = useTranslation('common');
  const [show, setShow] = useState(false);
  const [inviteShow, setInviteShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [purchaseModalShow, setPurchaseModalShow] = useState(false);
  const handlePurchaseModalClose = () => setPurchaseModalShow(false);
  const handlePurchaseModalShow = () => setPurchaseModalShow(true);

  
  const { companyProfile } = useSelector((store) => store.auth);
  const { request: requestProfile, response: profileRes } = useRequest();
  const { request: requestAssesment, response: assesmentResp } = useRequest();
  const dispatch = useDispatch();
  const [myJobs, setMyJobs] = useState([]);
  //data of profiles
  
  const [mailTemplateSub, setMailcontentSub] = useState(inviteCnadidateMailTemplate.subject);
  const [mailTemplateBody, setMailcontentBody] = useState(inviteCnadidateMailTemplate.body);  
  
  const [generalData, setgeneralData] = useState({});
  const [languagesData, setlanguagesData] = useState([]);
  const [careerPrefrenceData, setcareerPrefrenceData] = useState({});
  const [certificationData, setcertificationData] = useState([]);
  const [educationData, seteducationData] = useState([]);
  const [postGraduationData, setpostGraduationData] = useState([]);
  const [skillsData, setskillsData] = useState([]);
  const [universityData, setuniversityData] = useState([]);
  const [workExperienceData, setworkExperienceData] = useState([]);
  
  const [assesmentResult, setAssesmentResult] = useState({
    "carrerValues": [],
    "careerInterests": [],
    "personalityType": {},
    "motivatedSkills": [],
    "lifePurpose": ""
  });
  
  const [inviteDetail, setInviteDetail] = useState({});
  
  const [latestComp, setLatestComp] = useState({});
  const [seeMore, setSeeMore] = useState(false);
  const [workSeeMore, setWorkSeeMore] = useState(false);
  const [aptitudeList, setAptitudeList] = useState([]);
  
  const [totalExp, setTotalExp] = useState({years: 0, months: 0});
  
  const [isSave, setIsSave] = useState(false);
  
  const [isLocked, setIsLocked] = useState(true)
  
  const { request: inviteRequest, response: inviteResp } = useRequest();
  
  const { request: isSavedRequest, response: isSavedResponse } = useRequest();

  const { request: unlockCvReq, response: unlockCvResp } = useRequest();

  const { request: saveApplicantReq, response: saveAplicantResp } = useRequest();

  const { request: isAlreadInviteReq, response: isAlreadyInviteResp } = useRequest();
  const { request: requestAllAptitudes, response: responseAllAptitudes } = useRequest();

  const { request: requestAllCertificates, response: responseAllCertificates } = useRequest()
  
  const [inviteDetails, setInviteDetails] = useState({});
  const [otherAppliedJob, setOtherAppliedJob] = useState({});
  const [selectedInvite, setSelectdInvite] = useState("");

  const [selectedJob, setSelecetdJob] = useState("");

  const [expandTitle, setExpandTitle] = useState(false);
  const [isAlreadyInvited, setIsAlreadyInvied] = useState(false)


  const [certificateList, setCertificateList] = useState([])

  const handleInviteClose = () => { 
    setInviteShow(false);
    setMailcontentSub(inviteCnadidateMailTemplate.subject);
    setMailcontentBody(inviteCnadidateMailTemplate.body);
    setSelectdInvite({});
  }

  const handleInviteShow = () => {
    setInviteDetails({})
    setSelectdInvite("")
    setSelecetdJob("")
    setIsAlreadyInvied(false)
    setInviteShow(true);
  }

  const [appliedJobExpandTitle, setAppliedJobExpandTitle] = useState(false);

  const { request: jobListReq, response: jobListResp } = useRequest();

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Reason
    </Tooltip>
  );

  const route = useRouter();

  const jobSeekerId = route.query.id;

  useEffect(() => {
    requestProfile("GET", "job-seeker-cv/employer/get-complete/" + jobSeekerId + "?job_id=" + "0")
    requestAssesment("GET", "job-seeker-cv/get/assesment-result/" + jobSeekerId)
    isSavedRequest("GET", "employer/applicant/isSave?job_seeker_id="+jobSeekerId)
    jobListReq("GET", "employer/job-post/my-jobs")
    requestAllAptitudes("get", "aptitude/user/aptitudes?seeker_id="+jobSeekerId)
  }, [])

  useEffect(() => {
    if (profileRes && profileRes.status) {
      let profileData = profileRes?.data;

      setgeneralData(profileData?.general);
      setlanguagesData(profileData?.languages);
      setcareerPrefrenceData(profileData?.careerPrefrence);
      setcertificationData(profileData?.certification);
      seteducationData(profileData?.education);
      setpostGraduationData(profileData?.postGraduation);
      setskillsData(profileData?.skills);
      setuniversityData(profileData?.university);
      setworkExperienceData(profileData?.workExperience);

      setInviteDetail(profileData?.invites)
      setOtherAppliedJob(profileData?.otherAppliedJob)

      setLatestComp(getLatestCompany(profileData?.workExperience))
    }
  }, [profileRes])

  useEffect(() => {
    if (assesmentResp) {
      setAssesmentResult(assesmentResp.results);
    }
  }, [assesmentResp])

  const checkIsAlreadyInvited = (jobId) => {
    if (jobId) {
        isAlreadInviteReq("GET", `employer/invite/candidate/invite/get?job_id=${jobId}&job_seeker_id=${jobSeekerId}`)
    } else {
        setIsAlreadyInvied(false);
    }
}

useEffect(() => {
    if (isAlreadyInviteResp) {
      if (isAlreadyInviteResp.data?.id) {
        setIsAlreadyInvied(true);
      } else {
        setIsAlreadyInvied(false);
      }
    }
}, [isAlreadyInviteResp])

  function calculate_age(dob) {
    // Calculate the difference in milliseconds between the current date and the provided date of birth
    let diff_ms = Date.now() - new Date(dob).getTime();
    // Create a new Date object representing the difference in milliseconds and store it in the letiable age_dt (age Date object)
    let age_dt = new Date(diff_ms);

    // Calculate the absolute value of the difference in years between the age Date object and the year 1970 (UNIX epoch)
    // let dob =  Math.abs(age_dt.getUTCFullYear() - 1970);
    let age = age_dt.getUTCFullYear() - 1970;
    return (age > 0) ? age : 0;
  }
  
  const unlockCv = () => {
    unlockCvReq("POST", "employer/applicant/action", {job_seeker_id: jobSeekerId, save: 1, unlock_profile: 1})
  }

const jobTitleChange = (e) => {
  const val = e.target.value.split("_")[1];
  const jobId = e.target.value.split("_")[0];

  let body = inviteCnadidateMailTemplate.body;
  let sub = inviteCnadidateMailTemplate.subject;
  setSelecetdJob(val);
  setSelectdInvite(e.target.value.split("_")[0]);
  setMailcontentSub(sub.replace("{JOB_TITLE}", val));
  body = body.replace("{JOB_TITLE}", val);
  body = body.replace(/{JOB_LINK}/g, `${CANDIDATE_URL}/job-seeker/job-description/${jobId}`);
  body = body.replace("{COMPANY_NAME}", companyProfile?.company_name)
  setMailcontentBody(body);
};

const inviteCandidate = (sub, body) => {
    inviteRequest("POST", "employer/invite/candidate", {
      job_id: selectedInvite, 
      email: inviteDetails.email, 
      job_seeker_id: inviteDetails.userId, 
      body: body, 
      subject: sub,
      from: companyProfile?.company_name+" Hiring Team",
      job_title: selectedJob,
      org_name: companyProfile?.company_name
    })
}

useEffect(() => {
    if (inviteResp) {
        handleInviteClose()
        toast.success("Candidate Invited successfully.")
    }
}, [inviteResp])

  useEffect(() => {
    if (jobListResp) {
        setMyJobs(jobListResp?.list);
    }
}, [jobListResp])

useEffect(()=> {
  if(responseAllAptitudes){
    const {list, status, message,totalDocuments} = responseAllAptitudes;
    setAptitudeList(list);
  }
},[responseAllAptitudes])

const saveApplicant = () => {
  saveApplicantReq("POST", "employer/applicant/action", {job_seeker_id: generalData.job_seeker_id, save: 1, unlock_profile: (isLocked) ? 0 : 1})
}

useEffect(() => {
  if (saveAplicantResp) {
    const btn = document.getElementById("save_btn");
    btn.setAttribute("disabled", true)
    btn.textContent = "Saved";
    btn.style.background = "#efefef";
    btn.style.color = "#000";
    toast.success("Applicant saved successfully.")
  }
}, [saveAplicantResp])

useEffect(() => {
  if (unlockCvResp) {
    setIsLocked(false);
    setShow(false);
    const btn = document.getElementById("save_btn");
    btn.setAttribute("disabled", true)
    btn.textContent = "Saved";
    dispatch(updateCompanyProfile({...companyProfile, unlock_qty: (companyProfile?.unlock_qty || 1)-1}))
  }
}, [unlockCvResp])

useEffect(() => {
  if (isSavedResponse) {
    setIsSave(isSavedResponse?.data?.save == "1" ? true : false)
    setIsLocked(isSavedResponse?.data?.unlock_profile == "1" ? false : true)
  }
}, [isSavedResponse])

  useEffect(() => {
    getTotalExperience(workExperienceData).then(d => {
      setTotalExp(d)
    });
  }, [workExperienceData])

  const tabChangeFunction = (s) => {
    if (s && s == "profile" && !isLocked) {
      requestAllCertificates("get", "user/certificates?user="+jobSeekerId)
    }
  }

  useEffect(() => {
    if (responseAllCertificates) {
      const { certificates } = responseAllCertificates;
      setCertificateList(certificates);
    }
  }, [responseAllCertificates])

  const phoneNumber = parsePhoneNumberFromString("+"+generalData?.contact_mobile);
  

  return (
    <>
      <EmployerAuth />
      <div className="page_container">
        <div className="main_content" id="body_lang_css">
          <div className={styles.applicant_details_head}>
            <div className={styles.applicant_details_text}>
              <Link href={""} onClick={() => route.back()} className={styles.applicant_details_heading}  style={{cursor: "pointer"}}>
                <span className={styles.LeftarrowIcon} style={{cursor: "pointer"}}>
                  <svg
                    width="28"
                    height="24"
                    viewBox="0 0 28 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M0.666504 12C0.666504 11.0795 1.4127 10.3333 2.33317 10.3333H25.6665C26.587 10.3333 27.3332 11.0795 27.3332 12C27.3332 12.9205 26.587 13.6666 25.6665 13.6666H2.33317C1.4127 13.6666 0.666504 12.9205 0.666504 12Z"
                      fill="#25324B"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M1.15466 10.8215C1.80553 10.1706 2.86081 10.1706 3.51168 10.8215L13.5117 20.8215C14.1626 21.4723 14.1626 22.5276 13.5117 23.1785C12.8608 23.8294 11.8055 23.8294 11.1547 23.1785L1.15466 13.1785C0.503785 12.5276 0.503785 11.4723 1.15466 10.8215Z"
                      fill="#25324B"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M13.5117 0.821468C14.1626 1.47234 14.1626 2.52762 13.5117 3.17849L3.51168 13.1785C2.86081 13.8294 1.80553 13.8294 1.15466 13.1785C0.503785 12.5276 0.503785 11.4723 1.15466 10.8215L11.1547 0.821468C11.8055 0.170594 12.8608 0.170594 13.5117 0.821468Z"
                      fill="#25324B"
                    />
                  </svg>
                </span>
                {t("Applicant Details")}
              </Link>
            </div>
            <div className={styles.applicant_details_btn_box}>
              <button className={(!isSave) ? styles.post_btn : styles.saved_btn} id="save_btn" disabled={isSave} onClick={() => saveApplicant()} >{(!isSave) ? t("Save Applicant") : t("Saved")}</button>
              <button className={styles.applyBtn} onClick={() => {handleInviteShow(); setInviteDetails({name: generalData.first_name, userId: generalData.job_seeker_id, email: generalData.contact_email})}}>
                {t("Invite to Apply")}
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-4">
              <div className={styles.user_details_block}>
                <div className={styles.user_details_inner}>
                  <figure className={styles.userImg}>
                    <img src={(generalData?.profile_pic) ? `${IMAGEBASEURL}${generalData?.profile_pic}` : "/img/no-image.jpg"} alt="user" />
                  </figure>
                  <div className={styles.userFullDetails}>
                    <h3 className={styles.username}>
                      {generalData?.first_name ?? "-"} {(isLocked) ? generalData?.last_name?.substring(0, 1) : generalData?.last_name ?? "-"}
                      </h3>
                    <p className={styles.designationname}>
                      {latestComp && latestComp?.job_title}
                    </p>
                  </div>
                </div>
              {
                Object.entries(inviteDetail).length > 0 ? (
                  <div className={styles.appliedJobBox}>
                    <div className={styles.appliedJobStatus}>
                      <h3 className={styles.statustitle}>{t("Previous Invitations")}</h3>
                      <p className={styles.statusday}>{moment().diff(moment(inviteDetail.created_at), "days")} day(s) ago</p>
                    </div>
                    <h2 className={styles.appliedJobBoxTitle} style={{wordWrap: "break-word"}}>
                      {
                        (!expandTitle && inviteDetail.title.length > 25) ? <>{inviteDetail?.title?.substring(0,25)} <span onClick={() => setExpandTitle(true)} style={{cursor: "pointer"}}>...</span></> : inviteDetail.title
                      }
                      
                    </h2>
                  </div>
                ) : (
                  <div className={styles.appliedJobBox}>
                    <div className={styles.appliedJobStatus}>
                      <h3 className={styles.statustitle}>{t("Previous Invitations")}</h3>
                      <p className={styles.statusday}>-- day(s) ago</p>
                    </div>
                    <h2 className={styles.appliedJobBoxTitle} style={{textAlign: "center"}}>
                      {t("No Invitations")}
                    </h2>
                  </div>
                )
              }

                {Object.keys(otherAppliedJob).length > 0 ? (
                  <div className={styles.appliedJobBox}>
                    <div className={styles.appliedJobStatus}>
                      <h3 className={styles.statustitle}>{t("Previous Applications")}</h3>
                      <p className={styles.statusday}>{moment().diff(moment(otherAppliedJob.created_at), "days")} day(s) ago</p>
                    </div>
                    <h2 className={styles.appliedJobBoxTitle} style={{wordWrap: "break-word"}}>
                      {
                        (!appliedJobExpandTitle && otherAppliedJob.title.length > 25) ? <>{otherAppliedJob?.title?.substring(0, 25)}<span onClick={() => setAppliedJobExpandTitle(true)} style={{ cursor: "pointer" }}>...</span></> : otherAppliedJob.title
                      }
                    </h2>
                    <ul className={styles.jobstatus}>
                      <li className={styles.jobItems}>{otherAppliedJob.job_category_name || otherAppliedJob.other_job_category}</li>
                      <li className={styles.jobItems}>{otherAppliedJob.job_type_name}</li>
                    </ul>
                  </div>
                ) : (
                  <div className={styles.appliedJobBox}>
                    <div className={styles.appliedJobStatus}>
                      <h3 className={styles.statustitle}>{t("Previous Applications")}</h3>
                      <p className={styles.statusday}>-- day(s) ago</p>
                    </div>
                    <h2 className={styles.appliedJobBoxTitle} style={{textAlign: "center"}}>{t("No Jobs")}</h2>
                  </div>
                )
              }
                <div className={styles.customer_persona_details}>
                  {
                    isLocked && 
                    (
                      <>
                        <Button
                          className="w-100"
                          variant="primary"
                          onClick={()=> {                            
                            if(companyProfile?.unlock_qty > 0) {
                              handleShow()
                            } else {
                              handlePurchaseModalShow()
                            }
                          }}
                        >
                          {t("Unlock")}
                        </Button>
                        <p className={styles.open_contacts}>
                        {t("Click unlock to open contact details")}
                        </p>
                      </>
                    )
                  }
                  <Modal
                    className={styles.modalBox}
                    show={show}
                    onHide={handleClose}
                  >
                    <Modal.Body className="p-0 border-0">
                      <div className={styles.unlockPopupContent} style={{paddingTop: "30px"}}>
                        <div className="icon_block" style={{marginBottom: "15px"}}>
                          <img src="/img/error.png" alt="" />
                        </div>
                        <h2 className={styles.popupTitle}>
                          {t("Are you sure you want to unlock?")}
                        </h2>
                        <p className={styles.subText}>
                          {t("Remaining quantity to unlock:")} {companyProfile?.unlock_qty}
                        </p>
                        {
                          (companyProfile?.unlock_qty <= 0) ? (
                            <button className={styles.confirmBtn} disabled={true}>
                              {t("Confirm")}
                            </button>
                          ) : (
                          <button className={styles.confirmBtn} onClick={() => unlockCv()}>
                            {t("Confirm")}
                          </button>
                          )
                        }
                        <button className={styles.cancelBtn} onClick={() => handleClose()}>{t("Cancel")}</button>
                      </div>
                    </Modal.Body>
                  </Modal>

                  <Modal
                    className={styles.modalBox}
                    show={purchaseModalShow}
                    onHide={handlePurchaseModalClose}
                  >
                    <Modal.Body className="p-0 border-0">
                      <div className={styles.unlockPopupContent} style={{paddingTop: "30px", paddingBottom: "40px"}}>
                        <div className="icon_block" style={{marginBottom: "15px"}}>
                          <img src="/img/error.png" alt="" />
                        </div>
                        <h2 className={styles.popupTitle}>
                          {t("You don't have a Subsciption.")}
                        </h2>
                        {
                          <button 
                            className={styles.confirmBtn}
                            onClick={()=>{
                              route.push("/employer/explore-our-packages")
                            }}
                          >
                            {t("Purchase Now")}
                          </button>
                        }
                        <button className={styles.cancelBtn} onClick={() => handlePurchaseModalClose()}>{t("Cancel")}</button>
                      </div>
                    </Modal.Body>
                  </Modal>
                </div>
                {/* ${styles.blurBox} */}
                <div className={`${styles.contact_box} ${styles.main_box}`} style={{height: (isLocked) ? "50%" : "auto"}}>

                  {
                    isLocked && (

                    <div className={styles.blurblock}>
                        <img src="/assets/img/contact-details.png" alt="blur-img" style={{position: "relative"}}/>
                    </div>
                    )
                  }

                  {
                    !isLocked && (
                      <>
                        <h3 className={styles.contact_title}>{t("Contact")}</h3>
                        <ul className={styles.contact_list}>
                          <li className={styles.contact_Items}>
                            <span className={styles.contact_Icon}>
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clip-path="url(#clip0_775_8219)">
                                  <path
                                    d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z"
                                    stroke="#7C8493"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M3 7L12 13L21 7"
                                    stroke="#7C8493"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_775_8219">
                                    <rect width="24" height="24" fill="white" />
                                  </clipPath>
                                </defs>
                              </svg>
                            </span>
                            <div className={styles.contact_content}>
                              <p className={styles.contact_heading}>{t("Email")}</p>
                              <p className={styles.contact_link}>
                                {generalData?.contact_email ?? "-"}
                              </p>
                            </div>
                          </li>
                          <li className={styles.contact_Items}>
                            <span className={styles.contact_Icon}>
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clip-path="url(#clip0_775_8227)">
                                  <path
                                    d="M16 4H8C7.44772 4 7 4.44772 7 5V19C7 19.5523 7.44772 20 8 20H16C16.5523 20 17 19.5523 17 19V5C17 4.44772 16.5523 4 16 4Z"
                                    stroke="#7C8493"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M11 5H13"
                                    stroke="#7C8493"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M12 17V17.01"
                                    stroke="#25324B"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_775_8227">
                                    <rect width="24" height="24" fill="white" />
                                  </clipPath>
                                </defs>
                              </svg>
                            </span>
                            <div className={styles.contact_content}>
                              <p className={styles.contact_heading}>{t("Phone")}</p>
                              <p className={styles.contact_link}>
                                {phoneNumber?.formatInternational() || "-"}
                              </p>
                            </div>
                          </li>
                          <li className={styles.contact_Items}>
                            <span className={styles.contact_Icon}>
                            <svg width="24" height="24" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_186_11517)">
                                    <rect width="512" height="512" rx="70" fill="rgb(124, 132, 147)" />
                                    <path d="M442.182 0H69.8182C51.3013 0 33.5427 7.35582 20.4493 20.4493C7.35582 33.5427 0 51.3013 0 69.8182L0 442.182C0 460.699 7.35582 478.457 20.4493 491.551C33.5427 504.644 51.3013 512 69.8182 512H442.182C460.699 512 478.457 504.644 491.551 491.551C504.644 478.457 512 460.699 512 442.182V69.8182C512 51.3013 504.644 33.5427 491.551 20.4493C478.457 7.35582 460.699 0 442.182 0ZM174.545 405.178C174.549 406.598 174.273 408.005 173.732 409.317C173.192 410.63 172.397 411.823 171.395 412.829C170.392 413.834 169.201 414.632 167.89 415.176C166.578 415.72 165.173 416 163.753 416H117.76C116.338 416.004 114.929 415.727 113.614 415.184C112.299 414.642 111.105 413.845 110.099 412.839C109.094 411.833 108.297 410.639 107.754 409.324C107.212 408.009 106.934 406.6 106.938 405.178V212.364C106.938 209.494 108.078 206.741 110.108 204.711C112.137 202.682 114.89 201.542 117.76 201.542H163.753C166.618 201.55 169.363 202.693 171.386 204.722C173.409 206.75 174.545 209.499 174.545 212.364V405.178ZM140.742 183.273C132.111 183.273 123.675 180.714 116.499 175.919C109.323 171.124 103.73 164.309 100.427 156.335C97.1243 148.362 96.2602 139.588 97.9439 131.123C99.6276 122.659 103.784 114.883 109.886 108.781C115.989 102.678 123.764 98.5222 132.229 96.8385C140.693 95.1547 149.467 96.0189 157.441 99.3216C165.414 102.624 172.229 108.217 177.024 115.393C181.819 122.569 184.378 131.006 184.378 139.636C184.378 151.209 179.781 162.309 171.597 170.492C163.414 178.675 152.315 183.273 140.742 183.273ZM414.953 405.935C414.957 407.242 414.702 408.538 414.203 409.746C413.705 410.955 412.972 412.054 412.047 412.978C411.123 413.903 410.024 414.636 408.816 415.134C407.607 415.633 406.311 415.888 405.004 415.884H355.549C354.241 415.888 352.946 415.633 351.737 415.134C350.528 414.636 349.43 413.903 348.505 412.978C347.581 412.054 346.848 410.955 346.35 409.746C345.851 408.538 345.596 407.242 345.6 405.935V315.607C345.6 302.109 349.556 256.495 310.313 256.495C279.913 256.495 273.716 287.709 272.495 301.731V406.051C272.495 408.665 271.467 411.173 269.632 413.035C267.798 414.897 265.304 415.962 262.691 416H214.924C213.618 416 212.326 415.742 211.121 415.242C209.915 414.742 208.82 414.008 207.899 413.084C206.977 412.16 206.247 411.063 205.75 409.856C205.254 408.649 205 407.356 205.004 406.051V211.52C205 210.215 205.254 208.922 205.75 207.715C206.247 206.508 206.977 205.411 207.899 204.487C208.82 203.562 209.915 202.829 211.121 202.329C212.326 201.828 213.618 201.571 214.924 201.571H262.691C265.33 201.571 267.86 202.619 269.726 204.485C271.592 206.351 272.64 208.881 272.64 211.52V228.335C283.927 211.375 300.655 198.342 336.349 198.342C415.418 198.342 414.895 272.175 414.895 312.727L414.953 405.935Z" fill="white"/>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_186_11517">
                                    <rect width="512" height="512" rx="70" fill="white"/>
                                    </clipPath>
                                    </defs>
                                  </svg>
                            </span>
                            <div className={styles.contact_content} style={{width: "calc(100% - 42px)"}}>
                              <p className={styles.contact_heading}>{t("LinkedIn")}</p>
                              <p className={styles.contact_link} style={{wordWrap: "break-word"}}>
                                {generalData?.linked_in ?? "-"}
                              </p>
                            </div>
                          </li>
                          {/* <li className={styles.contact_Items}>
                            <span className={styles.contact_Icon}>
                              <svg
                                width="22"
                                height="19"
                                viewBox="0 0 22 19"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M21 2.01001C20 2.50001 19.02 2.69901 18 3.00001C16.879 1.73501 15.217 1.66501 13.62 2.26301C12.023 2.86101 10.977 4.32301 11 6.00001V7.00001C7.755 7.08301 4.865 5.60501 3 3.00001C3 3.00001 -1.182 10.433 7 14C5.128 15.247 3.261 16.088 1 16C4.308 17.803 7.913 18.423 11.034 17.517C14.614 16.477 17.556 13.794 18.685 9.77501C19.0218 8.55268 19.189 7.28987 19.182 6.02201C19.18 5.77301 20.692 3.25001 21 2.00901V2.01001Z"
                                  stroke="#7C8493"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </span>
                            <div className={styles.contact_content}>
                              <p className={styles.contact_heading}>Twitter</p>
                              <p className={styles.contact_link}>
                                twitter.com/link
                              </p>
                            </div>
                          </li>
                          <li className={`${styles.contact_Items} mb-0`}>
                            <span className={styles.contact_Icon}>
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clip-path="url(#clip0_775_8252)">
                                  <path
                                    d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                                    stroke="#7C8493"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M3.60001 9H20.4"
                                    stroke="#7C8493"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M3.60001 15H20.4"
                                    stroke="#7C8493"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M11.5 3C9.81535 5.69961 8.92221 8.81787 8.92221 12C8.92221 15.1821 9.81535 18.3004 11.5 21"
                                    stroke="#7C8493"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M12.5 3C14.1847 5.69961 15.0778 8.81787 15.0778 12C15.0778 15.1821 14.1847 18.3004 12.5 21"
                                    stroke="#7C8493"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_775_8252">
                                    <rect width="24" height="24" fill="white" />
                                  </clipPath>
                                </defs>
                              </svg>
                            </span>
                            <div className={styles.contact_content}>
                              <p className={styles.contact_heading}>Website</p>
                              <p className={styles.contact_link}>
                                www.google.com
                              </p>
                            </div>
                          </li> */}
                        </ul>
                      </>
                    )
                  }
                </div>
              </div>
            </div>
            <div className="col-lg-8 col-md-8">
              <div className={styles.right_box}>
                <Tabs defaultActiveKey="home" className={` ${styles.tabs_box_profile} tabsBlock`} onSelect={(s) => tabChangeFunction(s)}>
                  <Tab eventKey="home" title={t("Applicant Info")}>
                    <div className={styles.userProfileDetailsBox}>
                      <h2 className={styles.userProfileDetailsHeading}>{t("Personal Info")}</h2>
                      <div className={`${styles.rowGap} row`}>
                        <div className="col-md-6">
                          <div className={styles.PersonalInfo}>
                            <h3 className={styles.PersonalInfo_Title}>{t("Full Name")}</h3>
                            <h3 className={styles.PersonalInfo_Detail} style={{textTransform: "capitalize"}}>{generalData?.first_name ?? "-"} {(isLocked) ? generalData?.last_name?.substring(0, 1) : generalData?.last_name ?? "-"}</h3>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className={styles.PersonalInfo}>
                            <h3 className={styles.PersonalInfo_Title}>{t("Gender")}</h3>
                            <h3 className={styles.PersonalInfo_Detail} style={{"textTransform": "capitalize"}}>{generalData?.gender ?? "-"}</h3>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className={styles.PersonalInfo}>
                            <h3 className={styles.PersonalInfo_Title}>{t("Date of Birth")}</h3>
                            <h3 className={styles.PersonalInfo_Detail}>{moment(generalData?.dob).format("MMMM DD, YYYY")} <span className={styles.PersonalInfo_Title}> ({calculate_age(generalData?.dob)} y.o)</span> </h3>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className={styles.PersonalInfo}>
                            <h3 className={styles.PersonalInfo_Title}>{t("Languages")}</h3>
                            <h3 className={styles.PersonalInfo_Detail}>
                              {
                                languagesData?.map((l, i) => {
                                  if (i > 0) {
                                    return (", " + l.language_name)
                                  }
                                  return (l.language_name)
                                })
                              }</h3>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className={styles.PersonalInfo}>
                            <h3 className={styles.PersonalInfo_Title}>{t("Location")}</h3>
                            <h3 className={styles.PersonalInfo_Detail}>
                                {generalData?.current_city_name},{" "}{generalData?.current_country_name}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.userProfileDetailsAbout}>
                      <h2 className={styles.userProfileDetailsHeading}>{t("Professional Info")}</h2>

                      <h4 className={styles.sub_title}>{t("About Me")}</h4>
                      <p className={styles.descriptionTrack}>{generalData?.about ?? "-"}</p>


                      <div className={`${styles.rowGap} row border-0`}>
                        <div className="col-md-6">
                          <div className={styles.PersonalInfo}>
                            <h3 className={styles.PersonalInfo_Title}>{t("Current Job")}</h3>
                            <h3 className={styles.PersonalInfo_Detail}>{latestComp?.job_title}</h3>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className={styles.PersonalInfo}>
                            <h3 className={styles.PersonalInfo_Title}>{t("Experience in Years")}</h3>
                            <h3 className={styles.PersonalInfo_Detail}>{totalExp.years} {(totalExp.years > 1) ? "Years" : "Year"} {totalExp.months} {(totalExp.months > 1) ? "Months" : "Month"}</h3>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className={styles.PersonalInfo}>
                            <h3 className={styles.PersonalInfo_Title}>{t("Company Name")}</h3>
                            <h3 className={styles.PersonalInfo_Detail} style={{textTransform: "capitalize"}}>{latestComp?.company_name} </h3>
                          </div>
                        </div>

                          <div className="col-md-6">
                            <div className={styles.PersonalInfo}>
                              <h3 className={styles.PersonalInfo_Title}>{t("Skill Set")}</h3>
                              <ul className={styles.skillBox}>
                                {
                                  skillsData.length > 0 ? skillsData?.map((s, i) => (
                                    <li className={styles.skillsItems} style={{"textTransform": "capitalize"}}>
                                      {s.skill_name}
                                    </li>
                                  )) : "N/A"
                                }
                                {/* <li className={styles.skillsItems}>Project Management</li>
                                  <li className={styles.skillsItems}>Copywritingt</li>
                                  <li className={styles.skillsItems}>English</li> */}
                              </ul>
                            </div>
                          </div>
                        <div className="col-md-6">
                          <div className={styles.PersonalInfo}>
                            <h3 className={styles.PersonalInfo_Title}>{t("Highest Qualification Held")}</h3>
                            <h3 className={styles.PersonalInfo_Detail}>
                              {
                                (postGraduationData.length) ? (postGraduationData[0]?.degree_level_name ?? "N/A") : (universityData.length) ? (universityData[0]?.degree_level_name ?? "N/A") : (educationData?.graduation_certificate_name ?? "N/A")
                              }
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab>
                  <Tab eventKey="cv" title={t("CV")} className={styles.main_box}>
                    {/* ${styles.blurBox} */}
                    {
                      isLocked && (

                          <div className={styles.blurblock}>
                              <img src="/assets/img/cv-img.png" alt="blur-img" style={{position: "relative"}}/>
                          </div>
                      )
                    }
                     
                    {
                      !isLocked && (
                        <div className={`${styles.cv_box} ${styles.bg_color}  ${(isLocked) ? styles.blurBox : {}}`}>
                          <div className="row">
                            <div className="col-xl-8 col-12">
                              <div className={styles.cv_dashboard}>
                                <div className={styles.profile_bg_img}>
                                  <figure>
                                    <img src={
                                      generalData?.cover_pic
                                        ? `${IMAGEBASEURL}${generalData?.cover_pic}`
                                        : "/img/no-image.jpg"
                                    } alt="" className={styles.img_wrapper} />
                                  </figure>

                                  <div className={styles.dash_wrapper}>
                                    <div className={styles.profile_detail}>
                                      <div className={styles.profile_img}>
                                        <img src={
                                          generalData?.profile_pic
                                            ? `${IMAGEBASEURL}${generalData?.profile_pic}`
                                            : "/img/no-image.jpg"
                                        } alt="" className={styles.user_profile} />
                                      </div>
                                      <div className={styles.profile_content}>
                                        <div className={styles.profile_description}>
                                          <h2 className={styles.user_name}>{" "}
                                            {generalData?.first_name ?? "-"} {generalData?.last_name ?? "-"}</h2>
                                          {latestComp && Object.keys(latestComp).length > 0 && (
                                            <p className={styles.user_designation}>
                                              {latestComp?.job_title} at{" "}
                                              {latestComp?.company_name || ""}
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
                                          {/* <p className={styles.details_lebal}>
                                            <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <g clip-path="url(#clip0_1456_2426)">
                                                <path d="M3.79785 2.96875V12.0131" stroke="#56CDAD" stroke-width="1.13055" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M11.7114 2.96875V8.05622" stroke="#56CDAD" stroke-width="1.13055" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M3.79785 2.96809C4.32618 2.45023 5.0365 2.16016 5.77631 2.16016C6.51612 2.16016 7.22644 2.45023 7.75477 2.96809C8.2831 3.48596 8.99342 3.77603 9.73323 3.77603C10.473 3.77603 11.1834 3.48596 11.7117 2.96809" stroke="#56CDAD" stroke-width="1.13055" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M3.79785 8.05599C4.32618 7.53812 5.0365 7.24805 5.77631 7.24805C6.51612 7.24805 7.22644 7.53812 7.75477 8.05599C8.2831 8.57385 8.99342 8.86392 9.73323 8.86392C10.473 8.86392 11.1834 8.57385 11.7117 8.05599" stroke="#56CDAD" stroke-width="1.13055" stroke-linecap="round" stroke-linejoin="round" />
                                              </g>
                                              <defs>
                                                <clipPath id="clip0_1456_2426">
                                                  <rect width="13.5666" height="13.5666" fill="white" transform="translate(0.971191 0.142578)" />
                                                </clipPath>
                                              </defs>
                                            </svg>
                                            OPEN FOR OPPORTUNITIES

                                          </p> */}
                                        </div>

                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className={`${styles.dash_wrapper} ${styles.about_section}`}>
                                  <h3 className={styles.inner_heading}>{t("About Me")}</h3>
                                  <p className={styles.inner_content}>{generalData?.about}`</p>
                                </div>
                                {/* <div className={`${styles.dash_wrapper} ${styles.about_section}`}>
                                  <h3 className={styles.inner_heading}>Career Intersts</h3>
                                  <p className={styles.inner_content}>I
                                    I’m a product designer + filmmaker currently working remotel -y at Twitter from beautiful Manchester, United Kingdom. I’m passionate about designing digital products that have a positive impact on the world.</p>
                                  <p className={styles.inner_content}>For 10 years, I’ve specialised in interface, experience &
                                    interaction design as well as working in user research and product strategy for
                                    product agencies, big tech companies & start-ups.</p>
                                </div> */}

                                <div className={`${styles.dash_wrapper} ${styles.profile_experience}`}>
                                  <div className={styles.profile_heading}>
                                    <h3 className={styles.inner_heading}>{t("Experience")}</h3>
                                    {/* <a href="#" className="add-icon"><svg width="24" height="24" viewBox="0 0 24 24"
                                      fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <g clip-path="url(#clip0_29464_34884)">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                          d="M12 4C12.5523 4 13 4.44772 13 5V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V5C11 4.44772 11.4477 4 12 4Z"
                                          fill="#2A3858" />
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                          d="M4 12C4 11.4477 4.44772 11 5 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H5C4.44772 13 4 12.5523 4 12Z"
                                          fill="#2A3858" />
                                      </g>
                                      <defs>
                                        <clipPath id="clip0_29464_34884">
                                          <rect width="24" height="24" fill="white" />
                                        </clipPath>
                                      </defs>
                                    </svg>
                                    </a> */}
                                  </div>
                                  {workExperienceData?.map((val, i) => {
                                    return (
                                      <div
                                        key={val.id}
                                        className={i > 0 ? "collapse" : ""}
                                        id={i > 0 ? "experienceexample" : ""}
                                      >
                                        <div className={styles.profile_listing}>
                                          <div className={styles.profile_list_img}>
                                            <img src="/img/no-image.jpg" alt="" />
                                          </div>
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
                                            {
                                              val.achievements && (
                                                <>
                                                  <p style={{ marginBottom: "0px" }}>{t("Achievements")} :</p>
                                                  <p style={{ marginLeft: "10px", whiteSpace: "pre-wrap" }}>
                                                    {val.achievements}
                                                  </p>
                                                
                                                </>
                                              )
                                            }
                                           
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
                                      {/* Show {workExperienceData?.length - 1} more experiences */}
                                    </a>
                                  )}
                                </div>

                                <div className={`${styles.dash_wrapper} ${styles.profile_experience}`}>
                                  <div className={styles.profile_heading}>
                                    <h3 className={styles.inner_heading}>{t("Education")}</h3>
                                    {/* <a href="#" className="add-icon"><svg width="24" height="24" viewBox="0 0 24 24"
                                      fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <g clip-path="url(#clip0_29464_34884)">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                          d="M12 4C12.5523 4 13 4.44772 13 5V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V5C11 4.44772 11.4477 4 12 4Z"
                                          fill="#2A3858" />
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                          d="M4 12C4 11.4477 4.44772 11 5 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H5C4.44772 13 4 12.5523 4 12Z"
                                          fill="#2A3858" />
                                      </g>
                                      <defs>
                                        <clipPath id="clip0_29464_34884">
                                          <rect width="24" height="24" fill="white" />
                                        </clipPath>
                                      </defs>
                                    </svg>
                                    </a> */}
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
                                        aria-expanded="false"
                                        aria-controls="collapseExample"
                                        onClick={() => setSeeMore(!seeMore)}
                                      >
                                        {!seeMore ? t("See More") : t("See Less")}
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
                                                - Topic (
                                                {val.topic})
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

                                <div className={`${styles.dash_wrapper} ${styles.profile_experience}`}>
                                  <div className={styles.profile_heading}>
                                    <h3 className={styles.inner_heading}>{t("Skills")}</h3>
                                    {/* <a href="#" className="add-icon"><svg width="24" height="24" viewBox="0 0 24 24"
                                      fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <g clip-path="url(#clip0_29464_34884)">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                          d="M12 4C12.5523 4 13 4.44772 13 5V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V5C11 4.44772 11.4477 4 12 4Z"
                                          fill="#2A3858" />
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                          d="M4 12C4 11.4477 4.44772 11 5 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H5C4.44772 13 4 12.5523 4 12Z"
                                          fill="#2A3858" />
                                      </g>
                                      <defs>
                                        <clipPath id="clip0_29464_34884">
                                          <rect width="24" height="24" fill="white" />
                                        </clipPath>
                                      </defs>
                                    </svg>
                                    </a> */}
                                  </div>
                                  <div className={styles.skills_box}>
                                    <ul className={styles.skills_list}>
                                    {skillsData?.map((val) => {
                                        return (
                                          <li key={val.id} style={{textTransform: "capitalize"}}>
                                            {val.skill_name} ({getFirstLetterCapital(val.level)})
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </div>

                                  <h3 className={`${styles.inner_heading} ${styles.language}`}>{t("Languages")} </h3>
                                  <div className={styles.lang_detail}>
                                    <ul className={styles.skills_list}>{
                                      languagesData?.map((l, i) => {
                                        return <li key={l.id} style={{"textTransform": "capitalize"}}>
                                            {l.language_name} ({getFirstLetterCapital(l.level)})
                                          </li>
                                      })
                                    }</ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-xl-4 col-12">
                              <div className={styles.right_section}>
                                <div className={` mt-0 ${styles.dash_wrapper} ${styles.contact}`}>
                                  <h3 className={styles.inner_heading}>{t("Additional Details")}</h3>
                                  <div className={styles.additional_detail}>
                                    <span className={styles.label}>{t("Marital Status")}</span>
                                    <p className={styles.label_description}>
                                      {getFirstLetterCapital(generalData?.martial_status)}
                                    </p>
                                  </div>
                                  <div className={styles.additional_detail}>
                                    <span className={styles.label}>{t("Driver License")}</span>
                                    <p className={styles.label_description}>
                                      {generalData?.have_driving_licence == 1 ? (
                                        <span>{t("Yes")}</span>
                                      ) : (
                                        <span>{t("No")}</span>
                                      )}
                                    </p>
                                  </div>
                                  <div className={styles.additional_detail}>
                                    <span className={`${styles.label} ${styles.location}`}>
                                      {t("Location")}
                                    </span>
                                    {generalData && (
                                      <p className={styles.label_description}>
                                        {generalData?.current_area_name || generalData?.current_other_area}, {generalData?.current_city_name},{" "}
                                        {generalData?.current_country_name}
                                      </p>
                                    )}
                                  </div>
                                </div>

                              </div>
                            </div>
                          </div>

                        </div>
                      )
                    }
                  </Tab>

                  <Tab eventKey="profile" title={t("Assessment Insights")} className={styles.main_box}>
                    {
                      isLocked && (

                          <div className={styles.blurblock} >
                              <img src="/assets/img/assesment-blur.png" alt="blur-img" style={{position: "relative"}} />
                          </div>
                      )
                    }
                    {
                      !isLocked && (

                        <div className={` ${styles.hiring_page} ${styles.bg_color} ${(isLocked) ? styles.blurBox : {}}`}>
                          <h2 className={`${styles.box_heading} mb-4  `}>{t("Career Identity")}</h2>
  
                          <div className="row">
                            <div className="col-sm-12 col-xl-6 col-lg-12">
                              {
                                assesmentResult?.carrerValues.length > 0 && ( 

                                  <div className={`${styles.dash_card} ${styles.dash_card_blue} `}>
                                    <h3 class={` ${styles.text_white} ${styles.card_heading}`}>{t("My Top 5 Values")}</h3>
                                    <div class={styles.rank_img_box}>
                                      <img src="../../img/identity.png" alt="" />
                                    </div>
                                    <div className={styles.value_top_listing}>
                                      <ul>
                                        {assesmentResult?.carrerValues.map((obj, idx) => (
                                          <li key={obj.id}>
                                            <div className={styles.value_name}>
                                              <div className={styles.skills_inner_box}>
                                                  <span>{idx + 1}.</span>
                                                  {obj.value}

                                                  
                                              </div>

                                              <div>
                                                <OverlayTrigger
                                                  delay={{ hide: 450, show: 300 }}
                                                  overlay={(props) => (
                                                    <Tooltip {...props}>
                                                      {obj?.description}
                                                    </Tooltip>
                                                  )}
                                                  placement="top"
                                                >
                                                  <Button className={styles.info_icon}>
                                                    {" "}
                                                    <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      width="16"
                                                      height="16"
                                                      fill="currentColor"
                                                      class="bi bi-info-circle"
                                                      viewBox="0 0 16 16"
                                                    >
                                                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                                      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                                    </svg>
                                                  </Button>
                                                </OverlayTrigger>
                                              </div>
                                            </div>
                                            <div className={styles.value_img_box}>
                                              {idx < 5 && (
                                                <img src={`/img/value${idx + 1}.png`} alt="" />
                                              )}
                                            </div>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>

                                )
                              }

                              {
                                assesmentResult?.motivatedSkills.length > 0 && ( 

                                  <div className={`${styles.dash_card} ${styles.dash_card_white} ${styles.card_topspace} ${styles.card_topspace} ${styles.mobile_top_space} pb-0 mb-md-0 mb-3`}>
                                    <h3 class={`${styles.card_heading} ${styles.text_blue}`}>{t("My Top 5 Motivated Skills")}</h3>
                                    <div className={styles.value_top_listing}>
                                      <ul>

                                      {assesmentResult?.motivatedSkills.map((obj, idx) => (
                                        <li key={obj.id}>
                                          <div className={styles.value_name}>
                                            <div className={styles.skills_inner_box}>
                                              <span>{idx + 1}.</span>
                                              {obj.skill}
                                            </div>
                                            <div>
                                              <OverlayTrigger
                                                delay={{ hide: 450, show: 300 }}
                                                overlay={(props) => (
                                                  <Tooltip {...props}>
                                                    {obj?.description}
                                                  </Tooltip>
                                                )}
                                                placement="top"
                                              >
                                                <Button className={styles.info_icon}>
                                                  {" "}
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    class="bi bi-info-circle"
                                                    viewBox="0 0 16 16"
                                                  >
                                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                                  </svg>
                                                </Button>
                                              </OverlayTrigger>
                                            </div>
                                          </div>
                                          <div className={styles.value_img_box}>
                                            {idx < 5 && (
                                              <img src={`/img/value${idx + 1}.png`} alt="" />
                                            )}
                                          </div>
                                        </li>
                                      ))}
                                      </ul>
                                    </div>
                                  </div>
                                )
                              }

                              <div className={`${styles.dash_card} ${styles.dash_card_red} ${styles.card_topspace_right} ${styles.mobile_none} mb-3 mb-xl-0`}>
                                <h3 className={`${styles.card_heading} ${styles.text_white}`}>{t("My Life Purpose")}</h3>
                                <p>
                                  {assesmentResult?.lifePurpose ? (
                                    <div
                                      dangerouslySetInnerHTML={{
                                        // __html: lifePurpose.replaceAll(".", ""),
                                        __html: assesmentResult.lifePurpose.split(".").join(""),
                                      }}
                                    />
                                  ) : (
                                    <>&nbsp;</>
                                  )}
                                </p>
                                <img className={styles.quote_img} src="../../img/left-quote.png" alt="" />
                              </div>
                            </div>
  
                            <div className="col-sm-12 col-xl-6 col-lg-12">
                              {
                                assesmentResult?.careerInterests.length > 0 && (

                                  <div className={`${styles.dash_card} ${styles.dash_card_white} ${styles.card_topspace} ${styles.card_topspace} ${styles.mobile_top_space} pb-0 mt-0`}>
                                    <h3 class={`${styles.card_heading} ${styles.text_blue}`}>{t("My Interest Profile")}</h3>
                                    <div className={styles.value_top_listing}>
                                      <ul>
                                        {assesmentResult?.careerInterests.map((obj, idx) => (
                                          <li key={obj.id}>
                                            <div className={styles.value_name}>
                                            <div className={styles.skills_inner_box}>
                                                <span>{idx + 1}.</span>
                                                {obj.title}
                                              </div>
                                              
                                            </div>
                                            <div className={styles.value_img_box}>
                                              <img src={`/img/value${idx + 1}.png`} alt="" />
                                            </div>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                )
                              }
  
                              <div className={` ${styles.dash_card} ${styles.dash_card_blu_sky} ${styles.card_topspace_right} mt-0`}>
                                <div className={styles.top_bar_box}>
  
                                  <h3 className={`${styles.text_blue} ${styles.card_heading}`}>
                                    {t("My Personality Type is")}
  
                                    <span className={`${styles.value_name_second} ${styles.text_style}`}>
                                    {'"' + assesmentResult?.personalityType.title?.split("~")[0].trim() + '"' || <>&nbsp;</>}
                                    </span>
                                  </h3>
                                  <OverlayTrigger
                                    placement="right"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={(props) => (
                                      <Tooltip {...props}>
                                        {"" + assesmentResult?.personalityType.title + "" || <>&nbsp;</>}
                                      </Tooltip>
                                    )}
                                  >
                                    <Button className={` ${styles.info_icon} ${styles.other_icon_info}`}>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path></svg>
                                    </Button>
                                  </OverlayTrigger>
                                </div>
                                <div className={styles.value_top_listing}>
                                    {/* <ul>
                                      <li> */}

                                    {/* <div className={styles.value_img_box}>
                                        <img src="../../img/value1.png" alt="" />
                                      </div> */}
                                    {/* </li>
                                    </ul> */}
                                    <div className={styles.dis_block}>
                                      <ol>
                                        <MakeListShort
                                          content={(assesmentResult?.personalityType?.description) ? JSON.parse(assesmentResult?.personalityType.description) : []}
                                          btnColor="#161d46"
                                        />
                                      </ol>

                                      {/* {JSON.parse(personalityType.description)} */}
                                      {/* Lorem Ipsum is simply dummy text of the printing and
                                    typesetting industry. Lorem Ipsum has been the industry's
                                    standard dummy text ever since the 1500s, when an unknown
                                    printer took a galley of type and scrambled it to make a
                                    type specimen book. It has survived not only five
                                    centuries, but also the leap into electronic typesetting,
                                    remaining essentially unchanged. */}
                                    </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className={styles.toprowspace}>
                            <div className={styles.dash_page_heading}>
                              <h2 className={styles.page_heading}>{t("Certification Awards")}</h2>
                            </div>
                            <div className="row">
                              {Array.isArray(certificateList) && certificateList?.map(cert => {
                                return <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4 mb-4" key={cert.id}>
                                  <div className={styles.course_crad}>
                                    <div className={styles.styles}>
                                      <img src="https://ns.native-career.com/uploads/images/course/Introduction.png" />
                                    </div>
                                    <div className={styles.main_block} style={{padding: "0px 15px"}}>
                                      <div className={styles.course_detais}>
                                        <div style={{width: "80%"}}>
                                        <h3 className={styles.card_title}>{cert.title}</h3>
                                        <p className={styles.status_title}>
                                          {t("Completed Date")}  : &nbsp;<span>{moment(cert.created_at).format("DD-MM-YYYY")}</span>
                                        </p>
                                        </div>
                                        <div className={styles.download_certificate}>
                                          <div class="dropdown">
                                            <button class="btn  dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8.75 4.6875C8.75 4.44027 8.82331 4.1986 8.96066 3.99304C9.09802 3.78748 9.29324 3.62726 9.52165 3.53265C9.75005 3.43804 10.0014 3.41329 10.2439 3.46152C10.4863 3.50975 10.7091 3.6288 10.8839 3.80362C11.0587 3.97843 11.1778 4.20116 11.226 4.44364C11.2742 4.68611 11.2495 4.93745 11.1549 5.16585C11.0602 5.39426 10.9 5.58949 10.6945 5.72684C10.4889 5.86419 10.2472 5.9375 10 5.9375C9.66848 5.9375 9.35054 5.8058 9.11612 5.57138C8.8817 5.33696 8.75 5.01902 8.75 4.6875ZM10 8.75C9.75277 8.75 9.5111 8.82331 9.30554 8.96066C9.09998 9.09802 8.93976 9.29324 8.84515 9.52165C8.75054 9.75005 8.72579 10.0014 8.77402 10.2439C8.82225 10.4863 8.9413 10.7091 9.11612 10.8839C9.29093 11.0587 9.51366 11.1778 9.75614 11.226C9.99861 11.2742 10.2499 11.2495 10.4784 11.1549C10.7068 11.0602 10.902 10.9 11.0393 10.6945C11.1767 10.4889 11.25 10.2472 11.25 10C11.25 9.66848 11.1183 9.35054 10.8839 9.11612C10.6495 8.8817 10.3315 8.75 10 8.75ZM10 14.0625C9.75277 14.0625 9.5111 14.1358 9.30554 14.2732C9.09998 14.4105 8.93976 14.6057 8.84515 14.8341C8.75054 15.0626 8.72579 15.3139 8.77402 15.5564C8.82225 15.7988 8.9413 16.0216 9.11612 16.1964C9.29093 16.3712 9.51366 16.4903 9.75614 16.5385C9.99861 16.5867 10.2499 16.562 10.4784 16.4674C10.7068 16.3727 10.902 16.2125 11.0393 16.007C11.1767 15.8014 11.25 15.5597 11.25 15.3125C11.25 14.981 11.1183 14.663 10.8839 14.4286C10.6495 14.1942 10.3315 14.0625 10 14.0625Z" fill="#161D46" />
                                              </svg>

                                            </button>
                                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                              <li><Link class="dropdown-item" href={API + "/" + cert.path} target="__blank">{t("View")}</Link></li>
                                              <li><Link class="dropdown-item" href={API + "/" + cert.path} target="__blank" download={true}>{t("Download")}</Link></li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              })}
                              {Array.isArray(certificateList) && certificateList.length == 0 && <p>{t("No Certificates")}</p>}
                            </div>
                            
                          </div>

                          <div className={styles.toprowspace}>
                            <div className={styles.dash_page_heading}>
                              <h2 className={styles.page_heading}>{t("Aptitude Analysis")}</h2>
                            </div>
                            <div style={{border: "1px solid #C2E4EF", "backgroundColor": "#fff"}}>
                              <div className={`table-responsive ${styles.data_table}`}>
                                <table className={`table mb-0 table-data-center ${styles.data_table} ${styles.table_min_height}`}>
                                    <thead>
                                      <tr>
                                        <th>{t("Section")}</th>
                                        <th>{t("Completion")}</th>
                                        <th>{t("Score")}</th>
                                        {/* <th>Next Possible Trial Date</th> */}
                                      </tr>
                                    </thead>
                                    <tbody className={styles.post_job_tbody}>
                                      {aptitudeList.map(aptitude => {
                                        return <tr>
                                            <td>{aptitude.name}</td>
                                            <td>{moment(aptitude.created_at).format("DD MMM YYYY")}</td>
                                            <td>{Math.round((aptitude.right_questions / (aptitude.total_questions || 1)) * 100)}%</td>
                                            {/* <td>{moment(aptitude.created_at).add(6, 'M').format("DD MMM YYYY")}</td> */}
                                        </tr>
                                      })}
                                      {aptitudeList.length == 0 && <p className="mt-4" style={{paddingLeft: "24px"}}>{t("No Data to Show.")}</p>}
                                    </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    }
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>

      // MODAL INVITE TO APPLY
            <Modal className="successfull_popup" show={inviteShow} onHide={handleInviteClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title className={Modalstyles.modal_title}>{t("Send Invitation")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={Modalstyles.modal_content}>
                        <div className={Modalstyles.select_box}>
                            <label className={Modalstyles.select_job_lebal}>{t("select job to invite to")}</label>
                            <Form.Select aria-label="Default select example" onChange={(e) => {jobTitleChange(e); checkIsAlreadyInvited(e.target.value?.split("_")[0])}}>
                                <option value={""}>{t("Select")}</option>
                                {
                                    myJobs.map((d) => (
                                        <option value={`${d.id}_${d.title}`}>{d.title}</option>
                                    ))
                                }
                                {/* <option value="1">Job Subject</option>
                                <option value="2">Email</option>
                                <option value="3">Description</option> */}
                            </Form.Select>
                            <div className={Modalstyles.textarea_box}>
                                <lebal className={Modalstyles.select_job_lebal}>{t("Subject")}:</lebal>
                                <input type="text" className={Modalstyles.textarea_track} value={mailTemplateSub.replace("{ORG}", companyProfile?.company_name)} readOnly />
                            </div>

                        </div>
                        <div className={Modalstyles.email_preview}>
                            <h3 className={Modalstyles.select_job_lebal}>
                                {t("Email Preview")}
                            </h3>
                            <div className={Modalstyles.textarea_track} style={{"overflow": "scroll", width: "100%", "height": "200px"}}>

                                <div  dangerouslySetInnerHTML={{ __html: mailTemplateBody.replace("{NAME}", inviteDetails?.name) }}>

                                </div>
                            </div>

                        </div>

                    </div>

                </Modal.Body>
                <Modal.Footer>
                    {isAlreadyInvited && (<><p className="text-danger">{t("This candidate has already been invited previously for the same job.")}</p><br /></>)}
                    <Button className={styles.send_invitation_btn} variant="primary" disabled={(!selectedJob || isAlreadyInvited) ? true : false} onClick={() => inviteCandidate(mailTemplateSub.replace("{ORG}", companyProfile?.company_name),mailTemplateBody.replace("{NAME}", inviteDetails?.name))}>
                        {t("Send Invitation")}
                    </Button>
                </Modal.Footer>
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


    const mailTemplate = await getInviteMailTemplete();

  return {
    props: {
      publicHeader: false,
      publicFooter: false,
      isProtected: true,
                  ...(await serverSideTranslations(lang_code, [
                'common',
            ])),
      inviteCnadidateMailTemplate: mailTemplate.emailTemplate,
    },
  };
}

export default Profilecv;
