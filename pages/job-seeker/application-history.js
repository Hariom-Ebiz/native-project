import React, { useEffect, useState } from "react";
import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import { Tabs, Tab } from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Styles from "@/styles/application_history.module.css";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from "react-bootstrap/Button";
import Pagination from 'react-bootstrap/Pagination';
import { useSelector } from "react-redux";
import useRequest from "@/hooks/useRequest";
import { toast } from "react-toastify";
import { getAllAppliedJobs } from "@/services/jobSeeker/jobs";
import { createAxiosCookies, getCookies } from "@/fn";
import moment from "moment";
import { IMAGEBASEURL } from "@/api";
import Link from "next/link";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from "next/router";

const getDayTime = () => {
    const hour = new Date().getHours();
    let message = "";
    if (hour < 12) message = "Morning";
    else if (hour < 16) message = "Afternoon";
    else if (hour < 24) message = "Evening";

    return message;
}

const getStatus = (job) => {
    let status = { text: "", color: "black" };
    if (job.is_unlock) {
        status = { text: "Unlocked", color: "blue" };
    } else {
        status = { text: "Locked", color: "#2A3858" };
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

const getJobStatus = (job) => {
    let status = { text: "", color: "black" };

    if (job.is_active) {
        status = { text: "Open", color: "#56CDAD", description: "Accepting Applications", bg: "rgba(86, 205, 173, 0.1)" };
    }

    if (job.is_under_review) {
        status = { text: "Under Review", color: "#26A4FF", description: "No Longer Accepting New Applications", bg: 'rgba(245, 233, 64, 0.474)' };
    }

    if (job.is_hired) {
        status = { text: "Hired", color: "#26A4FF", description: "Successfully Hired", bg: "rgba(40, 165, 254, 0.23)" };
    }

    if (!job.is_active) {
        status = { text: "Canceled", color: "#872923", description: "No Longer Available", bg: "rgba(255, 101, 80, 0.1)" };
    }

    return status;
}

const ApplicationHistory = ({ allJobs: all_jobs, appliedJobs: applied_jobs, savedJobs: saved_jobs, totalAllJobs, totalAppliedJobs, totalSavedJobs, PER_PAGE }) => {
    const router = useRouter();
    const { query } = router;

    const { t } = useTranslation('common');
    const { firstName, lastName } = useSelector((store) => store.auth);
    const [allJobs, setAllJobs] = useState(all_jobs);
    const [appliedJobs, setAppliedJobs] = useState(applied_jobs);
    const [savedJobs, setSavedJobs] = useState(saved_jobs);
    const [pageChangeAll, setPageChangeAll] = useState(1);
    const [pageChangeApplied, setPageChangeApplied] = useState(1);
    const [pageChangeSaved, setPageChangeSaved] = useState(1);

    const { request: requestAllApplicationHistory, response: responseAllApplicationHistory } = useRequest();
    const { request: requestAppliedApplicationHistory, response: responseAppliedApplicationHistory } = useRequest();
    const { request: requestSavedApplicationHistory, response: responseSavedApplicationHistory } = useRequest();

    const [welcomPopup, setWelcomePopup] = useState(true);
    const handleWelcomeClose = () => setWelcomePopup(false);
    const handleWelcomeShow = () => setWelcomePopup(true);

    const [currentSort, setCurrentSort] = useState({
        sortBy: "created_at",
        order: "desc",
    });

    const [appliedCurrentSort, setAppliedCurrentSort] = useState({
        sortBy: "created_at",
        order: "desc",
    });

    const [savedCurrentSort, setSavedCurrentSort] = useState({
        sortBy: "created_at",
        order: "desc",
    });

    const handleAllApplicationSectionPageChange = (page) => {
        if (pageChangeAll != page) {
            setPageChangeAll(page);
            requestAllApplicationHistory("get", `employer/job-post/get/job-seeker/applied-jobs?page=${page}&per_page=${PER_PAGE}&sortBy=${currentSort.sortBy}&order=${currentSort.order}`)
        }
    }

    const handleAppliedApplicationSectionPageChange = (page) => {
        if (pageChangeApplied != page) {
            setPageChangeApplied(page);
            requestAppliedApplicationHistory("get", `employer/job-post/get/job-seeker/applied-jobs?page=${page}&per_page=${PER_PAGE}&isApplied=1&sortBy=${appliedCurrentSort.sortBy}&order=${appliedCurrentSort.order}`)
        }
    }

    const handleSavedApplicationSectionPageChange = (page) => {
        if (pageChangeSaved != page) {
            setPageChangeSaved(page);
            requestSavedApplicationHistory("get", `employer/job-post/get/job-seeker/applied-jobs?page=${page}&per_page=${PER_PAGE}&isApplied=0&sortBy=${savedCurrentSort.sortBy}&order=${savedCurrentSort.order}`)
        }
    }

    useEffect(() => {
        if (responseAllApplicationHistory) {
            console.log("responseAllApplicationHistory", responseAllApplicationHistory);
            window.scrollTo({top: 0, behavior: 'smooth'});
            const { status, list } = responseAllApplicationHistory;
            if (!status) {
                toast.error("Something went wrong!");
                return;
            }
            setAllJobs(list)
        }
    }, [responseAllApplicationHistory])

    useEffect(() => {
        if (responseAppliedApplicationHistory) {
            window.scrollTo({top: 0, behavior: 'smooth'});
            const { status, list } = responseAppliedApplicationHistory;
            if (!status) {
                toast.error("Something went wrong!");
                return;
            }
            setAppliedJobs(list)
        }
    }, [responseAppliedApplicationHistory])

    useEffect(() => {
        if (responseSavedApplicationHistory) {
            window.scrollTo({top: 0, behavior: 'smooth'});
            const { status, list } = responseSavedApplicationHistory;
            if (!status) {
                toast.error("Something went wrong!");
                return;
            }
            setSavedJobs(list)
        }
    }, [responseSavedApplicationHistory])

    const getJobsList = (sortBy) => {
        setPageChangeAll(1)
        if (currentSort.sortBy == sortBy) {
            const newOrder = currentSort.order === "asc" ? "desc" : "asc";
            requestAllApplicationHistory("get", `employer/job-post/get/job-seeker/applied-jobs?page=${1}&per_page=${PER_PAGE}&sortBy=${sortBy}&order=${newOrder}`)
            setCurrentSort({ sortBy, order: newOrder });
        } else {
            requestAllApplicationHistory("get", `employer/job-post/get/job-seeker/applied-jobs?page=${1}&per_page=${PER_PAGE}&sortBy=${sortBy}&order=desc`)
            setCurrentSort({ sortBy, order: "desc" });
        }
    }

    const getAllApplied = (sortBy) => {
        setPageChangeApplied(1)
        if (appliedCurrentSort.sortBy == sortBy) {
            const newOrder = appliedCurrentSort.order === "asc" ? "desc" : "asc";
            requestAppliedApplicationHistory("get", `employer/job-post/get/job-seeker/applied-jobs?page=${1}&per_page=${PER_PAGE}&sortBy=${sortBy}&order=${newOrder}&isApplied=${1}`)
            setAppliedCurrentSort({ sortBy, order: newOrder });
        } else {
            requestAppliedApplicationHistory("get", `employer/job-post/get/job-seeker/applied-jobs?page=${1}&per_page=${PER_PAGE}&sortBy=${sortBy}&order=desc&isApplied=${1}`)
            setAppliedCurrentSort({ sortBy, order: "desc" });
        }
    }

    const getAllSaved = (sortBy) => {
        setPageChangeSaved(1)
        if (savedCurrentSort.sortBy == sortBy) {
            const newOrder = savedCurrentSort.order === "asc" ? "desc" : "asc";
            requestSavedApplicationHistory("get", `employer/job-post/get/job-seeker/applied-jobs?page=${1}&per_page=${PER_PAGE}&sortBy=${sortBy}&order=${newOrder}&isApplied=${0}`)
            setSavedCurrentSort({ sortBy, order: newOrder });
        } else {
            requestSavedApplicationHistory("get", `employer/job-post/get/job-seeker/applied-jobs?page=${1}&per_page=${PER_PAGE}&sortBy=${sortBy}&order=desc&isApplied=${0}`)
            setSavedCurrentSort({ sortBy, order: "desc" });
        }
    }

    return (
        <JobSeekerAuth data={{ title: "My Job Applications" }}>
            <div className="page_container">
                <div className={`main_content ${Styles.application_box}`}>
                    <div className={Styles.top_head}>
                        <h2 className={Styles.page_title}>{t(`Good ${getDayTime()}`)}, {firstName} {lastName}</h2>
                        <p className={Styles.applications_description}>{t("Here is what’s happening with your job search applications")}</p>
                    </div>
                    <div className={Styles.tabs_box}>
                        <Tabs className="tabsBlock" style={{ overflow: "hidden" }} 
                            defaultActiveKey={query.job_application ? query.job_application : "all"}
                            onSelect={(v) => router.push(`?job_application=${v}`)}
                        >
                            <Tab eventKey="all" title={`${t("All")} (${totalAllJobs})`}>
                                <div className={Styles.tabs_content}>
                                    <h3 className={Styles.tabs_title}>{t("Applications History")}</h3>
                                    <div className="table-responsive">
                                        <table className={`${Styles.table_track} table`} cellPadding={0} cellSpacing={0}>
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th className={` ${(currentSort.sortBy == "company_name") ? (currentSort.order == "asc") ? Styles.top : Styles.bottom : ""}`} onClick={() => getJobsList("company_name")}>
                                                    <span className={Styles.sortable}>{t("Company Name")}</span>
                                                        
                                                        
                                                        </th>
                                                    <th className={` ${(currentSort.sortBy == "title") ? (currentSort.order == "asc") ? Styles.top : Styles.bottom : ""}`} onClick={() => getJobsList("title")}>
                                                    <span className={Styles.sortable}>{t("Role")}</span>
                                                        
                                                        </th>
                                                    <th style={{ textAlign: "center" }} className={` ${(currentSort.sortBy == "action_on_date") ? (currentSort.order == "asc") ? Styles.top : Styles.bottom : ""}`} onClick={() => getJobsList("action_on_date")}>
                                                    <span className={Styles.sortable}>{t("Applied/Saved On")}</span></th>
                                                    <th style={{ textAlign: "center", minWidth: "180px" }}  className={` ${(currentSort.sortBy == "hiring_status") ? (currentSort.order == "asc") ? Styles.top : Styles.bottom : ""}`} onClick={() => getJobsList("hiring_status")}>
                                                    <span className={Styles.sortable}>{t("Application Status")}</span>
                                                        </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Array.isArray(allJobs) && allJobs.map((job, index) => {
                                                    return <tr key={job.id}>
                                                        <td>{(pageChangeAll - 1) * PER_PAGE + index + 1}</td>
                                                        <td>
                                                            <div className={Styles.first_col} style={{cursor: "pointer"}} onClick={()=>router.push(`/job-seeker/job-description/${job.job_id}?from=applications`)}>
                                                                {job.is_confidential ? <img src="/img/confedential.png" /> : <img src={(job.logo) ? `${IMAGEBASEURL}${job.logo}` : "/img/no-image.jpg"} alt="user" />}
                                                                <span>{job.is_confidential ? "Confidential" : job.company_name}</span>
                                                            </div>
                                                        </td>
                                                        <td><Link href={`/job-seeker/job-description/${job.job_id}?from=applications`}>{job?.title?.length > 80 ? job.title.substring(0, 80) + "..." : job.title}</Link></td>
                                                        <td style={{ textAlign: "center" }}>{moment(job.action_on_date).format("DD MMMM YYYY")}</td>
                                                        <td>
                                                            <center>
                                                                <p className={`${Styles.status_title}`} style={{ color: job.is_applied ? "#56CDAD" : "#872923", background: job.is_applied ? "rgba(86, 205, 173, 0.1)" : "rgba(255, 101, 80, 0.1)", border: "0" }}>{job.is_applied ? t("Applied") : t("Saved")}</p>
                                                            </center>
                                                        </td>
                                                    </tr>
                                                })}
                                            </tbody>
                                        </table>
                                        {allJobs.length > 0 ? <div className={Styles.Pagination_box}>
                                            <Pagination>

                                                <Pagination.First disabled={pageChangeAll == 1} onClick={() => handleAllApplicationSectionPageChange(pageChangeAll - 1)} />
                                                {
                                                    Array.from({ length: Math.ceil(totalAllJobs / PER_PAGE) }).map((d, i) => (
                                                        <Pagination.Item key={i + 1} active={pageChangeAll == i + 1} onClick={() => handleAllApplicationSectionPageChange(i + 1)}>{i + 1}</Pagination.Item>
                                                    ))
                                                }

                                                <Pagination.Last disabled={Math.ceil(totalAllJobs / PER_PAGE) == pageChangeAll} onClick={() => handleAllApplicationSectionPageChange(pageChangeAll + 1)} />
                                            </Pagination>
                                        </div> : <p style={{ padding: "16px", paddingTop: "0px", margin: "0px" }}>{t("No Jobs Found!")}</p>}
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="applied" title={`${t("Applied")} (${totalAppliedJobs})`}>
                                <div className={Styles.tabs_content}>
                                    <h3 className={Styles.tabs_title}>{t("Applications History")}</h3>
                                    <div className="table-responsive">
                                        <table className={`${Styles.table_track} table`} cellPadding={0} cellSpacing={0}>
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th className={`${Styles.sortable} ${(appliedCurrentSort.sortBy == "company_name") ? (appliedCurrentSort.order == "asc") ? Styles.top : Styles.bottom : ""}`} onClick={() => getAllApplied("company_name")}>{t("Company Name")}</th>
                                                    <th className={`${Styles.sortable} ${(appliedCurrentSort.sortBy == "title") ? (appliedCurrentSort.order == "asc") ? Styles.top : Styles.bottom : ""}`} onClick={() => getAllApplied("title")}>{t("Role")}</th>
                                                    <th style={{ textAlign: "center" }} className={`${Styles.sortable} ${(appliedCurrentSort.sortBy == "action_on_date") ? (appliedCurrentSort.order == "asc") ? Styles.top : Styles.bottom : ""}`} onClick={() => getAllApplied("action_on_date")}>{t("Date Applied")}</th>
                                                    <th 
                                                        style={{ textAlign: "center" }} 
 
                                                        className={
                                                            `
                                                            ${(appliedCurrentSort.sortBy == "my_hiring_status")
                                                                ? (appliedCurrentSort.order == "asc")
                                                                    ? Styles.top : Styles.bottom
                                                                : ""
                                                            }`
                                                        }
                                                        onClick={
                                                            () => getAllApplied("my_hiring_status")
                                                        }
                                                    >
                                                         <span className={Styles.sortable}>{t("Hiring Status")}</span>
                                                    </th>
                                                    <th 
                                                        style={{ textAlign: "center" }} 
                                                        
                                                        className={
                                                            ` 
                                                            ${(appliedCurrentSort.sortBy == "job_status")
                                                                ? (appliedCurrentSort.order == "asc")
                                                                    ? Styles.top : Styles.bottom
                                                                : ""
                                                            }`
                                                        }
                                                        onClick={
                                                            () => getAllApplied("job_status")
                                                        }
                                                    >
                                                        <span className={Styles.sortable}> {t("Job Status")}</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {console.log("applied Jobs : ",appliedJobs)}
                                                {Array.isArray(appliedJobs) && appliedJobs.map((job, index) => {
                                                    return <tr key={job.id}>
                                                        <td>{(pageChangeApplied - 1) * PER_PAGE + index + 1}</td>
                                                        <td>
                                                            <div className={Styles.first_col} style={{cursor: "pointer"}} onClick={()=>router.push(`/job-seeker/job-description/${job.job_id}?from=applications`)}>
                                                                {job.is_confidential ? <img src="/img/confedential.png" /> : <img src={(job.logo) ? `${IMAGEBASEURL}${job.logo}` : "/img/no-image.jpg"} alt="user" />}

                                                                <span>{job.is_confidential ? "Confidential" : job.company_name}</span>
                                                            </div>
                                                        </td>
                                                        <td><Link href={`/job-seeker/job-description/${job.job_id}?from=applications`}>{job?.title?.length > 80 ? job.title.substring(0, 80) + "..." : job.title}</Link></td>
                                                        <td style={{ textAlign: "center" }}>{moment(job.applied_on).format("DD MMMM YYYY")}</td>
                                                        <td>
                                                            <center>
                                                                <p className={`${Styles.status_title}`} style={{ color: getStatus(job).color, display: "flex", "alignItems": "center" }}>{t(getStatus(job).text)}

                                                                    {getStatus(job).text == "Declined" && <span style={{ background: "transparent", border: "0px", marginLeft: "6px", cursor: "pointer" }} className={Styles.tooltip}><OverlayTrigger
                                                                        delay={{ hide: 450, show: 300 }}
                                                                        overlay={(props) => (
                                                                            <Tooltip {...props}>
                                                                                {"" + job.reject_reason + "" || <>&nbsp;</>}
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
                                                                    </OverlayTrigger></span>}</p>

                                                            </center>
                                                        </td>
                                                        <td style={{ textAlign: "center" }}>
                                                            <center>
                                                                <p className={`${Styles.status_title}`} style={{ background: getJobStatus(job).bg, color: getJobStatus(job).color, display: "flex", "alignItems": "center", border: "0" }}>
                                                                    {t(getJobStatus(job).text)}
                                                                    <span style={{ marginLeft: "6px" }}>
                                                                        <OverlayTrigger
                                                                            delay={{ hide: 450, show: 300 }}
                                                                            overlay={(props) => (
                                                                                <Tooltip {...props}>
                                                                                    {"" + getJobStatus(job).description + "" || <>&nbsp;</>}
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
                                                                </p>
                                                            </center>
                                                        </td>
                                                    </tr>
                                                })}
                                            </tbody>
                                        </table>
                                        {appliedJobs.length > 0 ? <div className={Styles.Pagination_box}>
                                            <Pagination>

                                                <Pagination.First disabled={pageChangeApplied == 1} onClick={() => handleAppliedApplicationSectionPageChange(pageChangeApplied - 1)} />
                                                {
                                                    Array.from({ length: Math.ceil(totalAppliedJobs / PER_PAGE) }).map((d, i) => (
                                                        <Pagination.Item key={i + 1} active={pageChangeApplied == i + 1} onClick={() => handleAppliedApplicationSectionPageChange(i + 1)}>{i + 1}</Pagination.Item>
                                                    ))
                                                }

                                                <Pagination.Last disabled={Math.ceil(totalAppliedJobs / PER_PAGE) == pageChangeApplied} onClick={() => handleAppliedApplicationSectionPageChange(pageChangeApplied + 1)} />
                                            </Pagination>
                                        </div> : <p style={{ padding: "16px", paddingTop: "0px", margin: "0px" }}>{t("No Applied Jobs Found!")}</p>}
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="saved" title={`${t("Saved")} (${totalSavedJobs})`}>
                                <div className={Styles.tabs_content}>
                                    <h3 className={Styles.tabs_title}>{t("Applications History")}</h3>
                                    <div className="table-responsive">
                                        <table className={`${Styles.table_track} table`} cellPadding={0} cellSpacing={0}>
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th
                                                        className={
                                                            ` 
                                                            ${(savedCurrentSort.sortBy == "company_name")
                                                                ? (savedCurrentSort.order == "asc")
                                                                    ? Styles.top : Styles.bottom
                                                                : ""
                                                            }`
                                                        }
                                                        style={{padding: "15px 10px"}}
                                                        onClick={
                                                            () => getAllSaved("company_name")
                                                        }
                                                    ><span className={Styles.sortable}>{t("Company Name")}</span></th>
                                                    <th className={` ${(savedCurrentSort.sortBy == "title") ? (savedCurrentSort.order == "asc") ? Styles.top : Styles.bottom : ""}`} onClick={() => getAllSaved("title")}>
                                                        
                                                    <span className={Styles.sortable}>{t("Role")}</span>
                                                        
                                                        </th>
                                                    <th style={{ textAlign: "center" }} className={` ${(savedCurrentSort.sortBy == "created_at") ? (savedCurrentSort.order == "asc") ? Styles.top : Styles.bottom : ""}`} onClick={() => getAllSaved("created_at")}>
                                                    <span className={Styles.sortable}>{t("Date Saved")}</span>
                                                        </th>

                                                    <th 
                                                        style={{ textAlign: "center" }} 
                                                        className={
                                                            `
                                                            ${(savedCurrentSort.sortBy == "job_status")
                                                                ? (savedCurrentSort.order == "asc")
                                                                    ? Styles.top : Styles.bottom
                                                                : ""
                                                            }`
                                                        }
                                                        onClick={
                                                            () => getAllSaved("job_status")
                                                        }
                                                    >
                                                        <span className={Styles.sortable}>{t("Job Status")}</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Array.isArray(savedJobs) && savedJobs.map((job, index) => {
                                                    return <tr key={job.id}>
                                                        <td>{(pageChangeSaved - 1) * PER_PAGE + index + 1}</td>
                                                        <td>
                                                            <div className={Styles.first_col} style={{cursor: "pointer"}} onClick={()=>router.push(`/job-seeker/job-description/${job.job_id}?from=applications`)}>
                                                                {job.is_confidential ? <img src="/img/confedential.png" /> : <img src={(job.logo) ? `${IMAGEBASEURL}${job.logo}` : "/img/no-image.jpg"} alt="user" />}
                                                                <span>{job.is_confidential ? "Confidential" : job.company_name}</span>
                                                            </div>
                                                        </td>
                                                        <td><Link href={`/job-seeker/job-description/${job.job_id}?from=applications`}>{job?.title?.length > 80 ? job.title.substring(0, 80) + "..." : job.title}</Link></td>
                                                        <td>
                                                            <center>
                                                                {moment(job.created_at).format("DD MMMM YYYY")}
                                                            </center>
                                                        </td>
                                                        <td>
                                                            <center>
                                                                <p className={`${Styles.status_title}`} style={{ background: getJobStatus(job).bg, color: getJobStatus(job).color, display: "flex", "alignItems": "center", border: "0" }}>{t(getJobStatus(job).text)} </p>
                                                            </center>
                                                        </td>
                                                    </tr>
                                                })}
                                            </tbody>
                                        </table>
                                        {savedJobs.length > 0 ? <div className={Styles.Pagination_box}>
                                            <Pagination>

                                                <Pagination.First disabled={pageChangeSaved == 1} onClick={() => handleSavedApplicationSectionPageChange(pageChangeSaved - 1)} />
                                                {
                                                    Array.from({ length: Math.ceil(totalSavedJobs / PER_PAGE) }).map((d, i) => (
                                                        <Pagination.Item key={i + 1} active={pageChangeSaved == i + 1} onClick={() => handleSavedApplicationSectionPageChange(i + 1)}>{i + 1}</Pagination.Item>
                                                    ))
                                                }

                                                <Pagination.Last disabled={Math.ceil(totalSavedJobs / PER_PAGE) == pageChangeSaved} onClick={() => handleSavedApplicationSectionPageChange(pageChangeSaved + 1)} />
                                            </Pagination>
                                        </div> : <p style={{ padding: "16px", paddingTop: "0px", margin: "0px", textAlign: "center" }}>{t("No Saved Jobs Found!")}</p>}
                                    </div>
                                </div>
                            </Tab>
                        </Tabs>
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
                        <h2 className="modal_heading"> {t("What's This Section About? A Quick Overview!")}</h2>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className={Styles.modal_content} style={{ textAlign: "left" }}>
                        <p>
                            {t("Keep track of all job applications you've submitted or saved for later, and stay updated on their status to streamline your job search process.")}
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

    let PER_PAGE = 10;
    const jobsData = await getAllAppliedJobs(PER_PAGE);
    
    return {
        props: {
            allJobs: jobsData.allJobs,
            appliedJobs: jobsData.appliedJobs,
            savedJobs: jobsData.savedJobs,
            totalAllJobs: jobsData.totalAllJobs,
            totalAppliedJobs: jobsData.totalAppliedJobs,
            totalSavedJobs: jobsData.totalSavedJobs,
            PER_PAGE,
            publicHeader: false,
            publicFooter: false,
            ...(await serverSideTranslations(lang_code, [
                'common',
            ])),
        },
    };
}


export default ApplicationHistory;