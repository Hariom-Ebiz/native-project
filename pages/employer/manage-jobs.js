import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createAxiosCookies, getCookies } from "@/fn";
import styles from "../../styles/manage_jobs.module.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import ProgressBar from 'react-bootstrap/ProgressBar';
import FlagLang from "@/components/FlagLang";
import DropdownButton from 'react-bootstrap/DropdownButton';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import LogOut from "@/components/logout";
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Pagination from 'react-bootstrap/Pagination';
import { IMAGEBASEURL } from "@/api";
import EmployerAuth from "@/components/layout/EmployerAuth";
import { getJob, getPostJobs } from "@/services/employer/manage-jobs";
import moment from "moment";
import { toast } from "react-toastify";
import useRequest from "@/hooks/useRequest";
import 'bootstrap-daterangepicker/daterangepicker.css';
import { useRouter } from "next/router";
import { ModalFooter, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from "react-i18next";

const ManageJobs = () => {

  const { t } = useTranslation('common');
  const { register, unregister, formState: { errors }, handleSubmit, watch, reset } = useForm();

  const [show, setShow] = useState(false);
  const [savedPostDate, setsavedPostDate] = useState("")
  const handleClose = () => setShow(false);

  const [modalContent, setModalContent] = useState({});
  const [ReopenModalShow, setReopenModalShow] = useState(false);
  const [openModalShow, setopenModalShow] = useState(false);
  const [postJobId, setPostJobId] = useState("");

  const handleReOpenModal = () => setReopenModalShow(true);
  const handleOpenModal = () => setopenModalShow(true);
  const handleReOpenModalclose = () => { setReopenModalShow(false); setModalContent({}); unregister("apply_before"); unregister("vacancies") }
  const handleOpenModalclose = () => { setopenModalShow(false);setsavedPostDate(""); }

  const { request: getJobDataReq, response: getJobDataResp } = useRequest();
  const { request: postStatusReq, response: postStatusRes } = useRequest();
  const { request: statusChangeRequest, response: statusChangeRes } = useRequest();
  const { request: hiredChangeRequest, response: hiredChangeRes } = useRequest();
  const { request: deleteRequest, response: deleteRes } = useRequest();
  const { request: jobReopenReq, response: jobReopenResp } = useRequest();
  const { companyProfile } = useSelector((store) => store.auth);
  const handleShow = () => setShow(true);
  const [deleteId, setDeleteId] = useState(0);
  const dispatch = useDispatch()
  const route = useRouter();

  console.log("route query : ", route.query);
  

  const [postsList, setPosts] = useState([]);
  const [savedList, setSaved] = useState([]);

  const [totalDocument, setTotalDocument] = useState(0);
  const [savedTotalDocument, setSavedTotalDocument] = useState(0);

  const [fromDate, setFromDate] = useState(route.query.start);
  const [toDate, setToDate] = useState(route.query.end);

  const [welcomPopup, setWelcomePopup] = useState(true);
  const handleWelcomeClose = () => setWelcomePopup(false);
  const handleWelcomeShow = () => setWelcomePopup(true);

  const [selectPerPage, setSelectPerPage] = useState(10);

  const [page, setPage] = useState(1);
  const [currentSort, setCurrentSort] = useState({
    sortBy: "created_at",
    order: "desc",
  });


  const changePostStatus = (id, data) => {
    postStatusReq("PUT", `employer/job-post/status?id=${id}`, data)
  }

  const jobStatus = (id, data) => {
    statusChangeRequest("PUT", `employer/job-post/status?id=${id}`, data)
  }

  const jobStatusHired = (id, data) => {
    hiredChangeRequest("PUT", `employer/job-post/status?id=${id}`, data)
  }

  const deleteJob = (id, data) => {
    deleteRequest("PUT", `employer/job-post/status?id=${id}`, data)
  }

  useEffect(() => {
    const { from: start, to: end } = route.query;
    
    if (start && end) {
      setFromDate(start)
      setToDate(end)
      getJobDataReq("GET", `employer/job-post/all?from=${start || fromDate}&to=${end || toDate}&page=${page}&per_page=${selectPerPage}&requestFor=all`)
    }
    else {
      const from = new Date().getMonth() <= 5 ? moment().startOf('year').format("YYYY/MM/DD") : moment().month(6).startOf('month').format('YYYY-MM-DD');
      const to = new Date().getMonth() <= 5 ? moment().month(5).endOf('month').format("YYYY/MM/DD") : moment().endOf('year').format('YYYY-MM-DD')
      setFromDate(from)
      setToDate(to)
      getJobDataReq("GET", `employer/job-post/all?from=${from}&to=${to}&page=${page}&per_page=${selectPerPage}&requestFor=all`)
    }
  }, [])

  useEffect(() => {
    if (postStatusRes) {
      setSaved(savedList.filter((f) => f.id != postStatusRes.data));
      let find = savedList.find((i) => i.id == postStatusRes.data);
      
      if (find) find['posted_on'] = new Date().toISOString();
      if (find) find['apply_before'] = savedPostDate ? new Date(savedPostDate).toISOString() : new Date().toISOString();
      if (find) find['is_under_review'] = 0;
      if (find) find['job_status'] = "Open";
      setsavedPostDate(new Date().getTime())
      setPosts([find,...postsList])
      setTotalDocument(prev => prev+1);
      setSavedTotalDocument(prev => prev-1)
      handleOpenModalclose()
    }
  }, [postStatusRes])

  useEffect(() => {
    if (statusChangeRes) {
      toast.success("Job status changed successfully.")
      setSaved(savedList.map((m) => {
        if (m.id == statusChangeRes.data) {
          return { ...m, is_active: (m.is_active == 1) ? 0 : 1 };
        } else {
          return m;
        }
      }));

      setPosts(postsList.map((m) => {
        if (m.id == statusChangeRes.data) {
          return { ...m,job_status: (m.is_active == 1) ? "Canceled" : "Open", is_active: (m.is_active == 1) ? 0 : 1 };
        } else {
          return m;
        }
      }))
    }
  }, [statusChangeRes])

  const filterData = async (from, to, p, pp, requestFor) => {
    getJobDataReq("GET", `employer/job-post/all?from=${from || moment().format("YYYY/MM/DD")}&to=${to || moment().format("YYYY/MM/DD")}&page=${p}&per_page=${pp}&sortBy=${currentSort.sortBy}&order=${currentSort.order}&requestFor=${requestFor}`)
  }

  useEffect(() => {
    if (deleteRes) {
      handleClose();
      setSaved(savedList.filter((f) => f.id != deleteRes.data));
      setPosts(postsList.filter((f) => f.id != deleteRes.data));
    }
  }, [deleteRes])

  useEffect(() => {
    if (getJobDataResp) {
      console.log(">>>>>>>>>>>>> req",getJobDataResp.requestFor)
      if(getJobDataResp.requestFor == "saved"){
        setSavedTotalDocument(getJobDataResp?.savedJobsTotalDocuments)
        setSaved(getJobDataResp?.savedPosts || []);
      } else if(getJobDataResp.requestFor == "posted") {
        setTotalDocument(getJobDataResp?.totalDocuments)
        setPosts(getJobDataResp.posts || [])
      } else {
        const respData = getJobDataResp.posts || [];
        setTotalDocument(getJobDataResp?.totalDocuments)
        setSavedTotalDocument(getJobDataResp?.savedJobsTotalDocuments)
        setPosts(getJobDataResp.posts || [])
        setSaved(getJobDataResp?.savedPosts || []);
      }
    }
  }, [getJobDataResp])

  useEffect(() => {
    if (hiredChangeRes) {
      toast.success("Job status changed successfully.")
      setPosts(postsList.map((m) => {
        if (m.id == hiredChangeRes.data) {
          return { ...m, is_hired: (m.is_hired == 1) ? 0 : 1 };
        } else {
          return m;
        }
      }))
    }
  }, [hiredChangeRes])

  function perPageFunction(d) {
    setSelectPerPage(d);
    setPage(1);
    filterData(fromDate, toDate, 1, d,route.query.isSaved == "true" ? "saved" : "posted")
  }

  function handleClickPage(p) {
    setPage(p);
    filterData(fromDate, toDate, p, selectPerPage, route.query.isSaved == "true" ? "saved" : "posted")
    window.scrollTo(0, 0);
  }

  function handleDateRange(start, end) {
    setToDate(end.format("YYYY/MM/DD"));
    setFromDate(start.format("YYYY/MM/DD"));
    console.log("route.query.isSaved",route.query.isSaved);
    
    route.push(`/employer/manage-jobs?isSaved=${route.query.isSaved ?? "false"}&from=${start.format("YYYY/MM/DD")}&to=${end.format("YYYY/MM/DD")}`)
    filterData(start.format("YYYY/MM/DD"), end.format("YYYY/MM/DD"), 1, selectPerPage, "all")
    // handleClickPage(1);
  }

  const reOpenJob = (data) => {
    jobReopenReq("POST", "employer/job-post/reopen/job", { ...data, id: modalContent.id, is_active: 1 })
  }

  useEffect(() => {
    if (jobReopenResp) {
      toast.success("Job reopened successfully.");
      setPosts(postsList.map((m) => {
        if (m.id == jobReopenResp.data) {
          return { ...m,is_hired: 0,is_under_review: 0, is_active: 1, job_status: "Open", vacancies: watch("vacancies"), apply_before: new Date(watch("apply_before")) };
        } else {
          return m;
        }
      }))
      handleReOpenModalclose();
    }
  }, [jobReopenResp])

  const sortingHandler = (sortBy) => {
    if (currentSort.sortBy == sortBy) {
      const newOrder = currentSort.order === "asc" ? "desc" : "asc";
      getJobDataReq("GET", `employer/job-post/all?from=${fromDate}&to=${moment(toDate).format("YYYY/MM/DD")}&page=${page}&per_page=${selectPerPage}&sortBy=${sortBy}&order=${newOrder}&requestFor=${route.query.isSaved == "true" ? "saved": "posted"}`)
      setCurrentSort({ sortBy, order: newOrder });
    } else {
      getJobDataReq("GET", `employer/job-post/all?from=${fromDate}&to=${moment(toDate).format("YYYY/MM/DD")}&page=${page}&per_page=${selectPerPage}&sortBy=${sortBy}&order=desc&requestFor=${route.query.isSaved == "true" ? "saved": "posted"}`)
      setCurrentSort({ sortBy, order: "desc" });
    }
  }

  const postedJobTableHeadings = [
    { heading: t("Roles"), sortBy: "title", isSortable: true },
    { heading: t("Status"), sortBy: "job_status", isSortable: true },
    { heading: t("Date Posted"), sortBy: "posted_on", isSortable: true },
    { heading: t("Due Date"), sortBy: "apply_before", isSortable: true },
    { heading: t("Job Type"), sortBy: "job_type", isSortable: true },
    { heading: t("Applicants"), sortBy: "total_unseen", isSortable: true },
    { heading: t("Unlocked"), sortBy: "total_unlocked_profiles", isSortable: true },
    { heading: t("Shortlisted"), sortBy: "total_shortlisted", isSortable: true },
    { heading: t("Final Interview"), sortBy: "total_interviewed", isSortable: true },
    { heading: t("Hired"), sortBy: "total_selected", isSortable: true },
    { heading: t("Declined"), sortBy: "total_rejected", isSortable: true },
    { heading: t("Action"), sortBy: "", isSortable: false },
  ]

  const savedJobTableHeading = [
    { heading: t("Roles"), sortBy: "title", isSortable: true },
    { heading: t("Date Saved"), sortBy: "created_at", isSortable: true },
    { heading: t("Due Date"), sortBy: "apply_before", isSortable: true },
    { heading: t("Job Type"), sortBy: "job_type", isSortable: true },
    { heading: t("Action"), sortBy: "", isSortable: false }
  ]

  const getSatusDescription = (status) => {
    return (status == "Open") ? "Accepting Applications" : (status == "Under Review") ? "No Longer Accepting New Applications" : (status == "Hired") ? "Successfully Hired" : "No Longer Available"
  }

  return (
    <>
      <EmployerAuth />
      <div className="page_container">
        <div className={`main_content ${styles.land_ar}`} id="body_lang_css">
          <div className={styles.company_message}>
            <div className={styles.company_message_left}>
              <h3 className={styles.morning_text}>
                {t("Manage Jobs")}
              </h3>
              <p className={styles.message_info}>
                {t("Here is your jobs listing status from")} {moment(fromDate).format("MMMM DD")} - {moment(toDate).format("MMMM DD")}.
              </p>
            </div>
            <div className={styles.company_message_right}>
              {
                (fromDate || toDate) && 
                <DateRangePicker initialSettings={{ startDate: moment(fromDate).format("MM/DD/YYYY"), endDate: moment(toDate).format("MM/DD/YYYY") }} onCallback={(start, end) => handleDateRange(start, end)}>
                  <input type="text" className="form-control col-4" />
                </DateRangePicker>
              }
            </div>
          </div>

          <div className={styles.manage_job_table_box}>
            <h3 className={styles.table_heading}>{t("Job List")}</h3>
            <div className={`tabsBlock  ${styles.data_tableTabs}`}>
              <Tabs defaultActiveKey={(route.query.isSaved == "true") ? t("Saved Jobs") : t("Posted Jobs")}
                onSelect={(v) => {(
                  v == t("Saved Jobs")) ? route.push(`?isSaved=true&from=${fromDate}&to=${moment(toDate).format("YYYY/MM/DD")}`) : route.push(`?from=${fromDate}&to=${moment(toDate).format("YYYY/MM/DD")}`)
                  
                  getJobDataReq("GET", `employer/job-post/all?from=${fromDate}&to=${moment(toDate).format("YYYY/MM/DD")}&page=${1}&per_page=${10}&sortBy=${currentSort.sortBy}&order=${currentSort.order}&requestFor=all`)
                  setPage(1);
                  setSelectPerPage(10)
                }
                } >
                <Tab eventKey={t("Posted Jobs")} title={t("Posted Jobs")+"(" + totalDocument + ")"}>
                  <div className={`table-responsive ${styles.data_table}`}>
                    <table className={`table mb-0 ${styles.table_min_height}`}>
                      <thead>
                        <tr>
                          {postedJobTableHeadings.map(h => {
                            let sortOrder = "";
                            if (h.isSortable && h.sortBy == currentSort.sortBy) {
                              if (currentSort.order == "desc") {
                                sortOrder = styles.top;
                              } else {
                                sortOrder = styles.bottom;
                              }
                            }

                            return <th
                              onClick={() => h.isSortable ? sortingHandler(h.sortBy) : null}
                              className={`${h.isSortable ? styles.sortable : ""} ${sortOrder}`}
                              style={{textAlign: (h.heading != t("Roles")) ? "center" : "left"}}
                            >
                              <span className={styles.sortable_arrow}>{h.heading}</span></th>
                          })}
                        </tr>
                      </thead>
                      <tbody className={styles.post_job_tbody}>
                        {
                          postsList.length == 0
                            ?
                            <tr>
                              <td colSpan={15} rowSpan={15} style={{ "textAlign": "center" }}>{t("No Data Found")}</td>
                            </tr>
                            :
                            postsList.map((d) => {
                              console.log("d",d);
                              let st = styles.job_status;
                              switch (d.job_status) {
                                case "Under Review": 
                                  st = styles.job_under_review;
                                  break;
                                case "Hired": 
                                  st = styles.job_hired
                                  break;
                                case "Canceled": 
                                  st = styles.job_closed
                                  break;
                              }
                              
                              return (
                                <tr>
                                  <td style={{ textAlign: "left" }}><Link href={"/employer/job-detail/" + d.id}>{d.title?.substring(0, 40)}{(d.title.length <= 40) ? "" : "..."}</Link></td>
                                  <td>
                                    {/* <span className={(d.is_active != 1) ? styles.job_closed : (d.is_hired == 1) ? styles.job_hired : styles.job_status}>
                                      {(d.is_active == 0) ? "Canceled" : (d.is_hired == 1) ? "Hired" : (d.is_under_review == 1) ? "Under Review" : "Active"}
                                    </span>  */}

                                    <span className={st}>
                                      {d.job_status}
                                      <span style={{marginLeft: "6px"}}>
                                        <OverlayTrigger
                                          delay={{ hide: 450, show: 300 }}
                                          overlay={(props) => (
                                            <Tooltip {...props}>
                                              {"" +  getSatusDescription(d.job_status) + "" || <>&nbsp;</>}
                                            </Tooltip>
                                          )}
                                          placement="top"
                                        >
                                          <span>
                                            <svg
                                              width="14"
                                              height="14"
                                              viewBox="0 0 14 14"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <g clip-path="url(#clip0_1553_14029)">
                                                <path
                                                  d="M7 13.125C5.37555 13.125 3.81763 12.4797 2.66897 11.331C1.52031 10.1824 0.875 8.62445 0.875 7C0.875 5.37555 1.52031 3.81763 2.66897 2.66897C3.81763 1.52031 5.37555 0.875 7 0.875C8.62445 0.875 10.1824 1.52031 11.331 2.66897C12.4797 3.81763 13.125 5.37555 13.125 7C13.125 8.62445 12.4797 10.1824 11.331 11.331C10.1824 12.4797 8.62445 13.125 7 13.125ZM7 14C8.85652 14 10.637 13.2625 11.9497 11.9497C13.2625 10.637 14 8.85652 14 7C14 5.14348 13.2625 3.36301 11.9497 2.05025C10.637 0.737498 8.85652 0 7 0C5.14348 0 3.36301 0.737498 2.05025 2.05025C0.737498 3.36301 0 5.14348 0 7C0 8.85652 0.737498 10.637 2.05025 11.9497C3.36301 13.2625 5.14348 14 7 14Z"
                                                  fill="#A8ADB7"
                                                />
                                                <path
                                                  d="M7.81371 5.7645L5.80996 6.01562L5.73821 6.34812L6.13196 6.42075C6.38921 6.482 6.43996 6.57475 6.38396 6.83113L5.73821 9.86562C5.56846 10.6505 5.83008 11.0197 6.44521 11.0197C6.92208 11.0197 7.47596 10.7993 7.72708 10.4965L7.80408 10.1325C7.62908 10.2865 7.37358 10.3478 7.20383 10.3478C6.96321 10.3478 6.87571 10.1789 6.93783 9.88138L7.81371 5.7645ZM7.87496 3.9375C7.87496 4.16956 7.78277 4.39212 7.61868 4.55622C7.45458 4.72031 7.23202 4.8125 6.99996 4.8125C6.76789 4.8125 6.54533 4.72031 6.38124 4.55622C6.21715 4.39212 6.12496 4.16956 6.12496 3.9375C6.12496 3.70544 6.21715 3.48288 6.38124 3.31878C6.54533 3.15469 6.76789 3.0625 6.99996 3.0625C7.23202 3.0625 7.45458 3.15469 7.61868 3.31878C7.78277 3.48288 7.87496 3.70544 7.87496 3.9375Z"
                                                  fill="#A8ADB7"
                                                />
                                              </g>
                                              <defs>
                                                <clipPath id="clip0_1553_14029">
                                                  <rect
                                                    width="14"
                                                    height="14"
                                                    fill="white"
                                                  />
                                                </clipPath>
                                              </defs>
                                            </svg>
                                          </span>
                                        </OverlayTrigger>
                                      </span>
                                    </span>
                                  </td>
                                  <td>{moment(d.posted_on).format("DD MMM YYYY")}</td>
                                  <td>{moment(d.apply_before).format("DD MMM YYYY")}</td>
                                  <td><span className={styles.job_type}>{d.job_type ?? "N/A"}</span></td>
                                  <td>
                                    
                                    <div className={styles.new_applicants_box}>
                                        <p className={styles.new_applicants_track}>
                                          
                                            <span>(New)</span> 
                                            {d.total_unseen} / 
                                            </p>
                                        <span className={styles.interview_status}>
                                            <span style={{fontSize: "12px"}}>(Total) </span>
                                        {d.totalAppliedCandidates}</span>
                                    </div>
                                   
                                    </td>
                                  <td>{d.total_unlocked_profiles}</td>
                                  <td>{d.total_shortlisted}</td>
                                  <td>{d.total_interviewed}</td>
                                  <td>{d.total_selected}<span className={styles.interview_status}>/{d.vacancies}</span></td>
                                  <td>{d.total_rejected}</td>

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
                                        {/* <button className={styles.application_btn}>
                                          Action
                                        </button> */}
                                      </Dropdown.Toggle>
                                      <Dropdown.Menu className="py-0" style={{textAlign: "center"}}>
                                        {
                                          (d.is_hired || d.is_under_review || d.is_active == "0") 
                                          ? <Dropdown.Item onClick={() => {handleReOpenModal(); setModalContent({id: d.id, hired: d.total_selected, vacancy: d.vacancies}), reset({"vacancies": d.vacancies})}}>{t("Re-Open Job")}</Dropdown.Item>
                                          : <Dropdown.Item onClick={() => jobStatus(d.id, { is_active: d.is_active == 0 ? 1 : 0 })}>{d.is_active == 0 ? t("Active Job") : t("Cancel")}</Dropdown.Item>
                                        }
                                        
                                        {
                                          d.is_under_review ? <Dropdown.Item onClick={() => jobStatus(d.id, { is_active: d.is_active == 0 ? 1 : 0 })}>{t("Cancel")}</Dropdown.Item> : <></>
                                        }
                                        
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  </td>
                                </tr>
                              )
                            })
                        }
                      </tbody>

                    </table>
                  </div>

                </Tab>
                <Tab eventKey={t("Saved Jobs")} title={t("Saved Jobs")+"(" + savedTotalDocument + ")"}>
                  <div className={`table-responsive ${styles.data_table}`}>
                    <table className={`table mb-0 ${styles.table_min_height}`} >
                      <thead>
                        <tr>
                        {savedJobTableHeading.map(h => {
                            let sortOrder = "";
                            if (h.isSortable && h.sortBy == currentSort.sortBy) {
                              if (currentSort.order == "desc") {
                                sortOrder = styles.top;
                              } else {
                                sortOrder = styles.bottom;
                              }
                            }

                            return <th
                              onClick={() => h.isSortable ? sortingHandler(h.sortBy) : null}
                              className={`${h.isSortable ? styles.sortable : ""} ${sortOrder}`}
                              style={{textAlign: (h.heading != t("Roles")) ? "center" : "left"}}
                            >
                              <span className={styles.sortable_arrow}>{h.heading}</span></th>
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {
                          savedList.length == 0
                            ?
                            <tr>
                              <td colSpan={15} rowSpan={15} style={{ "textAlign": "center" }}>{t("No Data Found")}</td>
                            </tr>
                            :
                            savedList.map((d) => {
                              return (
                                <tr>
                                  <td className="yy" style={{textAlign: "left"}}><Link href={"/employer/job-detail/" + d.id}>{d.title?.substring(0, 40)}{(d.title.length <= 40) ? "" : "..."}</Link></td>
                                  <td style={{textAlign: "center"}}>{moment(d.created_at).format("DD MMM YYYY")}</td>
                                  <td style={{textAlign: "center"}}>{moment(d.apply_before).format("DD MMM YYYY")}</td>
                                  <td style={{textAlign: "center"}}><span className={styles.job_type}>{d.job_type ?? "N/A"}</span></td>
                                  <td className={styles.highlight_td} style={{textAlign: "center"}}>
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
                                        {/* <button className={styles.application_btn}>
                                          Action
                                        </button> */}
                                      </Dropdown.Toggle>


                                      <Dropdown.Menu align="auto" className="py-0" style={{textAlign: "center"}}>
                                        <Dropdown.Item href={`/employer/edit-job?id=${d.id}`}>{t("Edit Job")}</Dropdown.Item>
                                        {
                                          (moment(d.apply_before).add(1, "day").startOf("day").valueOf() > new Date().valueOf()) ?
                                            (
                                              <Dropdown.Item onClick={() => {changePostStatus(d.id, { is_posted: 1 })}}>{t("Post Job")}</Dropdown.Item>
                                            )
                                            :
                                            (
                                              <Dropdown.Item onClick={() => {
                                                handleOpenModal();
                                                setPostJobId(d.id)
                                              }}>{t("Post Job")}</Dropdown.Item>
                                            )
                                        }
                                        <Dropdown.Item style={{ color: "red" }} onClick={() => { handleShow(true); setDeleteId(d.id) }}>{t("Delete Job")}</Dropdown.Item>
                                      </Dropdown.Menu>
                                    </Dropdown>


                                  </td>
                                </tr>
                              )
                            })
                        }

                      </tbody>
                    </table>
                  </div>
                </Tab>
              </Tabs>

              <div className={styles.pagination_box}>
                <div className={styles.pagination_left_box}>
                  <span className={styles.view_title}>{t("View")}</span>
                  <div className={styles.manage_job_drop}>
                    <DropdownButton id="dropdown-basic-button" title={selectPerPage}>
                      <Dropdown.Item onClick={() => perPageFunction("10")}>10</Dropdown.Item>
                      <Dropdown.Item onClick={() => perPageFunction("20")}>20</Dropdown.Item>
                      <Dropdown.Item onClick={() => perPageFunction("30")}>30</Dropdown.Item>
                    </DropdownButton>
                  </div>
                  <span className={styles.view_title}>{t("Jobs per page")}</span>

                </div>
                {
                  (route.query.isSaved == "true" ? savedList.length : postsList.length) ? (
                    <Pagination>
                      <Pagination.First disabled={page == 1} onClick={() => handleClickPage(1)} />
                      {
                        Array.from({ length: Math.ceil((route.query.isSaved == "true" ? savedTotalDocument : totalDocument) / selectPerPage) }).map((d, i) => {
                          return (
                            <Pagination.Item
                              key={i}
                              active={i + 1 == page}
                              onClick={() => handleClickPage(i + 1)}
                            >{i + 1}</Pagination.Item>
                          )
                        })
                      }

                      {/* <Pagination.Item active>{2}</Pagination.Item> */}
                      <Pagination.Last disabled={Math.ceil((route.query.isSaved == "true" ? savedTotalDocument : totalDocument) / selectPerPage) == page} onClick={() => handleClickPage(page + 1)} />
                    </Pagination>
                  ) : ""
                }

              </div>

              <Modal
                className={styles.modalBox}
                show={show}
                onHide={handleClose}
              >
                <Modal.Body className="p-0 border-0">
                  <div className={styles.unlockPopupContent} style={{ paddingTop: "30px" }}>
                    <div className="icon_block" style={{ marginBottom: "15px" }}>
                      <img src="/img/error.png" alt="" />
                    </div>
                    <h2 className={styles.popupTitle}>
                      {t("Are you sure you want to delete the Job?")}
                    </h2>
                    <button className={styles.confirmBtn} onClick={() => deleteJob(deleteId, { is_delete: 1 })}>
                      Delete
                    </button>
                    <button className={styles.cancelBtn} onClick={() => handleClose()}>{t("Cancel")}</button>
                  </div>
                </Modal.Body>
              </Modal>

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
                      {t("Seamlessly track all your posted or saved job listings, stay informed on their status, and streamline your hiring process to find perfect candidates quickly. Additionally, manage candidates' statuses effortlessly from screening and shortlisting to interviewing & hiring, ensuring a smooth recruitment process.")}
                    </p>
                  </div>
                </Modal.Body>
              </Modal>

              {/* handle reopen */}

              <Modal
                className="successfull_popup"
                show={ReopenModalShow}
                onHide={handleReOpenModalclose}
                size="lg"
                centered
              >
                <Modal.Header closeButton>
                  <h3>{t("Re-Open Job")}</h3>
                </Modal.Header>
                <Modal.Body>
                  <div style={{ textAlign: "left" }}>
                    <div>
                      <label className={styles.label_text}>{t("Apply Before Date")}</label>
                      <input
                        className={`form-control ${styles.form_control}`}
                        name="apply_before"
                        type="date"
                        placeholder="eg: 20.05.2023"
                        min={new Date().toISOString().split("T")[0]} // Set min attribute to today's date
                        {...register("apply_before", {
                          required: "This field is required",
                          validate: {
                            dateNotLessThanToday: (value) => {
                              const selectedDate = new Date(value);
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              return selectedDate >= today || "Date should not be less than today's date.";
                            }
                          }
                        })}
                      />
                      {errors.apply_before && (<span className="text-danger">{errors.apply_before.message}</span>)}
                    </div>

                    <div style={{ marginTop: "10px" }}>
                      {/* <label className={styles.label_text}>{t("manage_vacancy",{1:modalContent.vacancy,2: modalContent.hired})}</label> */}
                      <label className={styles.label_text}>{t("Number of Vacancies",{1:modalContent.vacancy,2: modalContent.hired})}</label>
                      <input 
                        type="number"
                        name="vacancies"
                        className="form-control"
                        defaultValue={modalContent.vacancy}
                        placeholder="Enter vacancy"
                        {
                          ...register("vacancies", {
                            required: {
                              value: true,
                              message: "This field is required."
                            },
                            validate: {
                              isNumber: (value) => !isNaN(value) || "Only numbers are allowed",
                              minValue: (value) => value > 0 || "Number must be greater than 0"
                            }
                          })
                          }
                      />
                      {errors.vacancies && (<span className="text-danger">{errors.vacancies.message}</span>)}
                    </div>
                  </div>
                </Modal.Body>

                <Modal.Footer>
                  <Button className={styles.send_invitation_btn} variant="primary" onClick={handleSubmit(reOpenJob)}>
                    {t("Re-Open Job")}
                  </Button>
                </Modal.Footer>
              </Modal>
                          {console.log("savedPostDate", savedPostDate)}

              <Modal
                className="successfull_popup"
                show={openModalShow}
                onHide={handleOpenModalclose}
                size="lg"
                centered
              >
                <Modal.Header closeButton>
                  <h3>{t("Post Job")}</h3>
                </Modal.Header>
                <Modal.Body>
                  <div style={{ textAlign: "left" }}>
                    <div>
                      <label className={styles.label_text}>{t("Apply Before Date")}</label>
                      <input
                        className={`form-control ${styles.form_control}`}
                        name="apply_before_post_job"
                        type="date"
                        placeholder="eg: 20.05.2023"
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e)=> {
                          setsavedPostDate(e.target.value)
                        }}
                        value={savedPostDate && new Date(savedPostDate).toISOString().split("T")[0]}
                      />
                      {(new Date(new Date(savedPostDate).toDateString()) < new Date(new Date().toDateString())) && <span className="text-danger">Date should not be less than today's date.</span>}
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button className={styles.send_invitation_btn} variant="primary" disabled={new Date(new Date(savedPostDate).toDateString()) < new Date(new Date().toDateString())} onClick={()=> {
                    changePostStatus(postJobId, { is_posted: 1,  apply_before: new Date(savedPostDate)})
                  }}>
                    {t("Post Job")}
                  </Button>
                </Modal.Footer>
              </Modal>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  createAxiosCookies(context);
  // const data = await getPostJobs(1, 10, "", "");
  const { lang } = getCookies(context);
  let lang_code = "en";
  try {
    const language = JSON.parse(lang)

    lang_code = String(language.code).toLowerCase()
  } catch (error) {
    lang_code = "en"
  }
  return {
    props: {
      // posts: data.posted || [],
      // saved: data.saved || [],
      // totalData: data?.totalDocuments || [],
      publicHeader: false,
      publicFooter: false,
      isProtected: true,
      ...(await serverSideTranslations(lang_code, [
        'common',
      ])),
    },
  };
}

export default ManageJobs;
