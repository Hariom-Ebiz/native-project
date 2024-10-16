import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createAxiosCookies } from "@/fn";
import styles from "../../styles/search_cv.module.css";
import Select from "react-select";
import Pagination from "react-bootstrap/Pagination";
import FlagLang from "@/components/FlagLang";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/authSlice";
import LogOut from "@/components/logout";
import { CANDIDATE_URL, IMAGEBASEURL } from "@/api";
import EmployerAuth from "@/components/layout/EmployerAuth";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { getCityCountry } from "@/services/other";
import {
    getJobCategories,
    getJobCategory,
    getJobSalaryRange,
    getJobTypes,
    getSearchCvs,
    // inviteCnadidateMailTemplate,
    getInviteMailTemplete
} from "@/services/employer/searchCv";
import moment from "moment";
import useRequest from "@/hooks/useRequest";
import { toast } from "react-toastify";
import { jobCategory, jobTypeList } from "@/services/master";
import { getCookies } from "@/fn";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

// const options = [
//   { value: "chocolate", label: "Chocolate" },
//   { value: "strawberry", label: "Most relevant" },
//   { value: "vanilla", label: "Vanilla" },
// ];
let active = 2;
let items = [];
for (let number = 1; number <= 5; number++) {
    items.push(
        <Pagination.Item key={number} active={number === active}>
            {number}
        </Pagination.Item>
    );
}

function calculate_age(dob) {
    // Calculate the difference in milliseconds between the current date and the provided date of birth
    let diff_ms = Date.now() - new Date(dob).getTime();
    // Create a new Date object representing the difference in milliseconds and store it in the letiable age_dt (age Date object)
    let age_dt = new Date(diff_ms);

    // Calculate the absolute value of the difference in years between the age Date object and the year 1970 (UNIX epoch)
    return Math.abs(age_dt.getUTCFullYear() - 1970);
}

function totalExp(start, end) {
    let starts = moment(start);
    let ends = end ? moment(end) : moment();

    let duration = ends.diff(start, "months", true);

    let diff = {
        years: parseInt(duration / 12),
        months: parseInt(duration % 12),
    };

    let str =
        diff.years == "0" && diff.months == "0"
            ? "Less than 1 month"
            : `${diff.years} years ${diff.months} months`;
    return str;
}

const Searchcv = ({ jobTypeList, jobCategory, salaryRange, inviteCnadidateMailTemplate }) => {
    const { t } = useTranslation('common');
    const [show, setShow] = useState(false);
    const router = useRouter();
    const [welcomPopup, setWelcomePopup] = useState(true);
    const handleWelcomeClose = () => setWelcomePopup(false);
    const handleWelcomeShow = () => setWelcomePopup(true);

    let PAGE = 1;
    let PER_PAGE = 10;
    const [checkClass, setCheckClass] = useState(false);
    const [cvData, setcvData] = useState([]);
    const [pageChange, setPageChange] = useState(1);

    const [myJobs, setMyJobs] = useState([]);

    const [options, setOptions] = useState([]);
    const [location, setLocation] = useState({ label: `${t("Select")} ${t("Location")}`, value: "" });

    const [jobTypeFilter, setJobTypeFilter] = useState([]);
    const [jobCategoryFilter, setJobCategoryFilter] = useState([]);
    const [salaryRangeFilter, setSalaryRangeFilter] = useState([]);
    const [jobTitle, setJobTitle] = useState("");

    const [totalDoc, setTotalDoc] = useState();

    const [sort, setSort] = useState("");

    const [mailTemplateSub, setMailcontentSub] = useState(
        inviteCnadidateMailTemplate.subject
    );
    const [mailTemplateBody, setMailcontentBody] = useState(
        inviteCnadidateMailTemplate.body
    );

    const [sortOptions, setSortOptions] = useState([
        { id: "first_name", value: "first_name", label: "A - Z" },
        { id: "updated_at", value: "updated_at", label: "Latest" },
        { id: "invited_before", value: "invited_before", label: "Invited Before" },
        { id: "applied_before", value: "applied_before", label: "Applied Before" },
    ]);

    const [isAlreadyInvited, setIsAlreadyInvied] = useState(false)

    const { companyProfile } = useSelector((store) => store.auth);

    const addClassFilter = () => {
        setCheckClass(!checkClass);
        let classes = document.getElementById("filter-show");
        classes.classList.add("show");
    };

    const { request: cvDataReq, response: cvDataResp } = useRequest();
    const { request: jobListReq, response: jobListResp } = useRequest();

    const { request: inviteRequest, response: inviteResp } = useRequest();

    const { request: isAlreadInviteReq, response: isAlreadyInviteResp } = useRequest();

    const [inviteDetails, setInviteDetails] = useState({});
    const [selectedInvite, setSelectdInvite] = useState("");

    const [selectedJob, setSelecetdJob] = useState("");

    const handleClose = () => {
        setInviteDetails({})
        setSelectdInvite("")
        setMailcontentSub(inviteCnadidateMailTemplate.subject);
        setMailcontentBody(inviteCnadidateMailTemplate.body);
        setSelecetdJob("")
        setIsAlreadyInvied(false)
        setShow(false)
    };
    const handleShow = () => setShow(true);

    const handleRequest = (filter) => {
        const params = new URLSearchParams();

        // Iterate over the keys in the filter object
        for (const key in filter) {
            if (filter.hasOwnProperty(key)) {
                const value = filter[key];
                if (Array.isArray(value)) {
                    // If the value is an array, append each item in the array separately
                    value.forEach((item) => params.append(key, item));
                } else {
                    // If the value is not an array, simply append it
                    params.append(key, value);
                }
            }
        }

        params.append("location", JSON.stringify(location))
        
        const queryString = params.toString();
        console.log("params; : ", queryString);

        router.replace("/employer/search-cv?" + queryString);
        cvDataReq("GET", "job-seeker-cv/employer/search?" + queryString);
    };

    useEffect(() => {
        handleRequest({});
        jobListReq("GET", "employer/job-post/my-jobs");
        const { job_category, job_title, job_type, min_expected_salary, order, page, per_page, sortBy, location } = router.query;
        setJobCategoryFilter(job_category ? Array.isArray(job_category) ? job_category : [job_category] : []);
        setJobTypeFilter(job_type ? Array.isArray(job_type) ? job_type : [job_type] : [])
        setSalaryRangeFilter(min_expected_salary ? Array.isArray(min_expected_salary) ? min_expected_salary : [min_expected_salary] : [])
        setJobTitle(job_title)
        setSort(sortBy || "updated_at")
        if (location) {
            setLocation(JSON.parse(location))
        }
        // setPageChange(page || 1)
    }, []);

    useEffect(() => {
        if (cvDataResp) {
            setcvData(cvDataResp?.list?.data);
            setTotalDoc(cvDataResp?.list.totalDocuments);
        }
    }, [cvDataResp]);

    useEffect(() => {
        if (jobListResp) {
            setMyJobs(jobListResp?.list);
        }
    }, [jobListResp]);

    const handleLocation = (d) => {
        if (d.length) {
            getCityCountry(d)
                .then((v) => setOptions(v))
                .catch((err) => alert(new Error(err).message));
        }
        else {
            // setLocation("")
            setOptions([])
        }
    };

    const serachCV = (page) => {
        const jobTitleData = jobTitle;
        const loc = location?.value;
        const jobType = jobTypeFilter;
        const jobFilter = jobCategoryFilter;
        const salaryFilter = salaryRangeFilter;
        const sorting = sort;

        let city = "";
        let country = "";
        let job_type = "";
        let job_category = "";
        let min_expected_salary = "";
        let job_title = "";
        let sortBy = "";
        let order = "";
        if (loc) {
            let parseLoc = location?.value?.split(",");
            city = parseLoc[0];
            country = parseLoc[1];
        }

        if (jobTitleData) job_title = jobTitleData;

        if (jobType.length) job_type = jobType;

        if (jobFilter.length) job_category = jobFilter;

        if (salaryFilter.length) min_expected_salary = salaryFilter;

        if (sorting && sorting == "first_name") {
            sortBy = sorting;
            order = "asc"
        }

        if (sorting && sorting == "updated_at") {
            sortBy = sorting;
            order = "desc"
        }

        if (sorting && sorting == "invited_before") {
            sortBy = sorting;
            order = "desc"
        }

        if (sorting && sorting == "applied_before") {
            sortBy = sorting;
            order = "desc"
        }

        handleRequest({ city, country, job_title, job_type, job_category, min_expected_salary, sortBy, order, page, per_page: PER_PAGE });
    };

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
            from: companyProfile?.company_name + " Hiring Team",
            job_title: selectedJob,
            org_name: companyProfile?.company_name
        });
    };

    useEffect(() => {
        if (inviteResp) {
            setSelectdInvite({});
            handleClose();
            toast.success("Candidate Invited successfully.");
        }
    }, [inviteResp]);

    useEffect(() => {
        serachCV();
        setPageChange(1);
    }, [jobTypeFilter, jobCategoryFilter, salaryRangeFilter, sort]);

    const checkIsAlreadyInvited = (jobId, seekerId) => {
        if (jobId) {
            isAlreadInviteReq("GET", `employer/invite/candidate/invite/get?job_id=${jobId}&job_seeker_id=${seekerId}`)
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

    const handleChange = (e, type, id) => {
        if (e.target.checked) {
            if (type == "job_type") {
                let pushed = [...jobTypeFilter, id];
                setJobTypeFilter(pushed);
            } else if (type == "salary_range") {
                let pushed = [...salaryRangeFilter, id];
                setSalaryRangeFilter(pushed);
            } else {
                let pushed = [...jobCategoryFilter, id];
                setJobCategoryFilter(pushed);
            }
        } else {
            if (type == "job_type") {
                let filterd = jobTypeFilter?.filter((f) => f != id);
                setJobTypeFilter(filterd);
            } else if (type == "salary_range") {
                let filterd = salaryRangeFilter?.filter((f) => f != id);
                setSalaryRangeFilter(filterd);
            } else {
                let filterd = jobCategoryFilter.filter((f) => f != id);
                setJobCategoryFilter(filterd);
            }
        }
    };

    const handlePage = (page) => {
        if (pageChange != page) {
            setPageChange(page);
            serachCV(page);
            window.scrollTo(0, 0);
        }

    }

    const resetCV = () => {
        setJobTitle("");
        setLocation({ label: "Select Location ...", value: "" });
        setOptions([])
        setJobTypeFilter([]);
        setJobCategoryFilter([]);
        setSalaryRangeFilter([]);
        setSort("updated_at")

        setPageChange(1);
        serachCV();
    }

    return (
        <>
            <EmployerAuth data={{ title: "Serach-CV" }} />
            <div className="page_container">
                <div className={`main_content`} id="body_lang_css">
                    <div className={styles.cv_fillter_head}>
                        <form className="row col-12" onSubmit={(e) => { e.preventDefault(); setPageChange(1); serachCV(); }}>
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
                                    <input
                                        className={styles.inputBorderBottom}
                                        type="text"
                                        value={jobTitle}
                                        onChange={(e) => setJobTitle(e.target.value)}
                                        placeholder={t("Search CV by Job Title")}
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
                                                fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                d="M11.5 8.50051C11.5 7.11924 10.3808 6 9.00051 6C7.61924 6 6.5 7.11924 6.5 8.50051C6.5 9.88076 7.61924 11 9.00051 11C10.3808 11 11.5 9.88076 11.5 8.50051Z"
                                                stroke="#25324B"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                            <path
                                                fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                d="M8.99951 19C7.80104 19 1.5 13.8984 1.5 8.56329C1.5 4.38664 4.8571 1 8.99951 1C13.1419 1 16.5 4.38664 16.5 8.56329C16.5 13.8984 10.198 19 8.99951 19Z"
                                                stroke="#25324B"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                    </span>

                                    {/* <select
                  className={styles.inputBorderBottom}
                  >
                    {
                      options.map((s) => (
                        <option value={s.value}>{s.label}</option>
                      ))
                    }
                  </select> */}
                                    <Select
                                        className={styles.inputBorderBottom}
                                        onChange={(d) => { setLocation(d) }}
                                        onInputChange={handleLocation}
                                        options={options}
                                        value={location?.value != "" ? location : null}
                                        placeholder={"Select Location ..."}
                                        isClearable
                                    />
                                </div>
                            </div>
                            <div style={{ width: "22%", display: "flex", gap: "5px" }}>
                                <div className={`col-lg-2 ${styles.threeCol}`} style={{ width: "50%" }}>
                                    <div className={styles.headBtnBox}>
                                        <button
                                            className={styles.post_btn}
                                            onClick={() => { setPageChange(1); serachCV(); }}
                                        >
                                            {t("Search")}
                                        </button>
                                    </div>
                                </div>
                                <div className={`col-lg-2 ${styles.threeCol}`} style={{ width: "50%" }}>
                                    <div className={styles.headBtnBox}>
                                        <button
                                            className={styles.post_btn}
                                            onClick={() => { resetCV() }}
                                        >
                                            {t("Reset")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className={styles.all_cv_review_box}>
                        <div className={`row ${styles.rowGap}`}>
                            <div className=" col-xxl-3 col-lg-4 ">
                                <div
                                    className={`${styles.categoriesSelectBox} ${checkClass ? styles.show : ""
                                        }`}
                                    id="filter-show"
                                >
                                    <div className="accordion" id="select_categoris">
                                        <div className={`accordion-item ${styles.accordion_item_box}`}>
                                            <h2 className="accordion-header" id="employment_type">
                                                <button
                                                    className={`accordion-button collapsed ${styles.collapsBtn}`}
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
                                            >
                                                <div className="accordion-body p-0">
                                                    {jobTypeList.map((d) => (
                                                        <div className={`form-group custom_checkbox ${styles.custom_checkbox_desing}`}>
                                                            <input
                                                                type="checkbox"
                                                                onChange={(e) => handleChange(e, "job_type", d.id)}
                                                                checked={jobTypeFilter.find(f => f == d.id)}
                                                                id={`check_type_${d.id}`}
                                                            />
                                                            <label htmlFor={`check_type_${d.id}`}>{d.name} ({d.total_count})</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`accordion-item ${styles.accordion_item_box}`}>
                                            <h2 className="accordion-header" id="employment_type_categories">
                                                <button
                                                    className={`accordion-button collapsed ${styles.collapsBtn}`}
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
                                            >
                                                <div className="accordion-body p-0">
                                                    {jobCategory.filter(f => f.id != "0").map((d) => (
                                                        <div className={`form-group custom_checkbox ${styles.custom_checkbox_desing}`}>
                                                            <input
                                                                type="checkbox"
                                                                onChange={(e) => handleChange(e, "job_category", d.id)}
                                                                checked={jobCategoryFilter.find(f => f == d.id)}
                                                                id={`check_cate_${d.id}`}
                                                            />
                                                            <label htmlFor={`check_cate_${d.id}`}>{d.name} ({d.total_count})</label>
                                                        </div>
                                                    ))}
                                                    {jobCategory.filter(f => f.id == "0").map((d) => (
                                                        <div className={`form-group custom_checkbox ${styles.custom_checkbox_desing}`}>
                                                            <input
                                                                type="checkbox"
                                                                onChange={(e) => handleChange(e, "job_category", "0")}
                                                                checked={jobCategoryFilter.find(f => f == "0")}
                                                                id={`check_cate_0`}
                                                            />
                                                            <label htmlFor={`check_cate_0`}>{d.name} ({d.total_count})</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`accordion-item ${styles.accordion_item_box}`}>
                                            <h2 className="accordion-header" id="employment_type_categories">
                                                <button
                                                    className={`accordion-button collapsed ${styles.collapsBtn}`}
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#collapseFive"
                                                    aria-expanded="false"
                                                    aria-controls="collapseFive"
                                                >
                                                    {t("Salary Range")}
                                                </button>
                                            </h2>
                                            <div
                                                id="collapseFive"
                                                className="accordion-collapse collapse show"
                                                aria-labelledby="employment_type_categories"
                                            >
                                                <div className="accordion-body p-0">
                                                    {salaryRange.map(d => (
                                                        <div className={`form-group custom_checkbox ${styles.custom_checkbox_desing}`}>
                                                            <input
                                                                type="checkbox"
                                                                onChange={(e) => handleChange(e, "salary_range", d.salary_range)}
                                                                checked={salaryRangeFilter.find(f => f == d.salary_range)}
                                                                id={`check_salary_${d.id}`}
                                                            />
                                                            <label htmlFor={`check_salary_${d.id}`}>{d.salary_range} ({d.count})</label>
                                                        </div>
                                                    ))}
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
                                            <h2 className={styles.all_cv_title}>{t("All CVs")}</h2>
                                            <p className={styles.showing_results_text}>
                                                {
                                                    (cvData.length <= 0) ? "No results are found" : (
                                                        pageChange == "1" ?
                                                            `Showing 1 to ${cvData.length} of ${totalDoc} results`
                                                            :
                                                            `Showing ${(PER_PAGE * (pageChange - 1)) + 1} to ${(PER_PAGE * (pageChange - 1)) + cvData.length} of ${totalDoc} results`
                                                    )
                                                }

                                            </p>
                                        </div>
                                        <div className={styles.sort_resume}>
                                            <span className={styles.select_lebal}>{t("Sort by")}:</span>
                                            {
                                                sort && (

                                                    <Select className={styles.selectbox}
                                                        defaultValue={sortOptions.find(f => f.id == sort)}
                                                        onChange={(e) => setSort(e.id)}
                                                        options={sortOptions} />
                                                )
                                            }
                                        </div>
                                    </div>
                                    {cvData.map((d, i) => {
                                        return (
                                            <div className={styles.cv_main_box} key={i}>
                                                <figure className={styles.userImg}>
                                                    <img
                                                        src={
                                                            d?.image
                                                                ? `${IMAGEBASEURL}${d.image}`
                                                                : "/img/no-image.jpg"
                                                        }
                                                        alt="user"
                                                    />
                                                </figure>
                                                <div className={styles.cv_content}>
                                                    <div className={styles.userNameBox}>
                                                        <Link
                                                            href={`/employer/profile-cv?id=${d.job_seeker_id}&from=search_cv`}
                                                        >
                                                            <h3 className={styles.user_name_text} style={{ textTransform: "capitalize" }}>
                                                                {d.first_name} {(d.unlock_profile == "1") ? d.last_name : d.last_name[0]}
                                                                {
                                                                    d.unlock_profile != "1" && (
                                                                        <span className={styles.lock_icon}>
                                                                            <svg
                                                                                width="24"
                                                                                height="24"
                                                                                viewBox="0 0 24 24"
                                                                                fill="none"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                            >
                                                                                <path
                                                                                    d="M6 22C5.45 22 4.97933 21.8043 4.588 21.413C4.19667 21.0217 4.00067 20.5507 4 20V10C4 9.45 4.196 8.97933 4.588 8.588C4.98 8.19667 5.45067 8.00067 6 8H7V6C7 4.61667 7.48767 3.43767 8.463 2.463C9.43833 1.48833 10.6173 1.00067 12 1C13.3827 0.999334 14.562 1.487 15.538 2.463C16.514 3.439 17.0013 4.618 17 6V8H18C18.55 8 19.021 8.196 19.413 8.588C19.805 8.98 20.0007 9.45067 20 10V20C20 20.55 19.8043 21.021 19.413 21.413C19.0217 21.805 18.5507 22.0007 18 22H6ZM12 17C12.55 17 13.021 16.8043 13.413 16.413C13.805 16.0217 14.0007 15.5507 14 15C13.9993 14.4493 13.8037 13.9787 13.413 13.588C13.0223 13.1973 12.5513 13.0013 12 13C11.4487 12.9987 10.978 13.1947 10.588 13.588C10.198 13.9813 10.002 14.452 10 15C9.998 15.548 10.194 16.019 10.588 16.413C10.982 16.807 11.4527 17.0027 12 17ZM9 8H15V6C15 5.16667 14.7083 4.45833 14.125 3.875C13.5417 3.29167 12.8333 3 12 3C11.1667 3 10.4583 3.29167 9.875 3.875C9.29167 4.45833 9 5.16667 9 6V8Z"
                                                                                    fill="currentcolor"
                                                                                />
                                                                            </svg>
                                                                        </span>
                                                                    )
                                                                }
                                                            </h3>
                                                        </Link>
                                                        <div style={{ position: "relative" }}>
                                                            <button
                                                                className={styles.applyBtn}
                                                                onClick={() => {
                                                                    handleShow();
                                                                    setInviteDetails({
                                                                        name: d.first_name,
                                                                        userId: d.job_seeker_id,
                                                                        email: d.contact_email,
                                                                    });
                                                                }}
                                                            >
                                                                {t("Invite to Apply")}
                                                            </button>
                                                            <div className={styles.invited_tag_box}>
                                                                <p className={`${styles.applied_status_track} ${styles.text_color}`}>
                                                                    {d.isAlreadyInvited ? "Invited Before" : ""}
                                                                </p>
                                                                <p className={`${styles.applied_status_track} ${styles.text_color}`}>
                                                                    {d.isAlreadyApplied ? "Applied Before" : ""}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>


                                                    <ul className={styles.userDetailsBox}>
                                                        <li className={styles.userItemsBox}>
                                                            {d.nationality ?? "-"}
                                                        </li>
                                                        <li className={styles.userItemsBox}>
                                                            {d.cv_city ?? "-"}, {d.cv_country ?? "-"}
                                                        </li>
                                                    </ul>
                                                    <ul className={styles.userDetailsBox}>
                                                        <li
                                                            className={styles.userItemsBox}
                                                            style={{ textTransform: "capitalize" }}
                                                        >
                                                            {d.gender}
                                                        </li>
                                                        <li className={styles.userItemsBox}>
                                                            {calculate_age(d.dob)} y.o
                                                            {/* 25 y.o */}
                                                        </li>
                                                    </ul>

                                                    {/* <div className={styles.userDetailsBlock}>
                                                        <h3 className={styles.Box_title}>Certificates</h3>
                                                        <div id="collapseExample">
                                                            <div className={styles.profile_listing}>
                                                                <div className={styles.profile_inner_content}>
                                                                    <h4 className={styles.sub_heading}>
                                                                        {d.cert?.organisation_name ?? "-"}
                                                                    </h4>
                                                                    <span>{d.cert?.country ?? "-"}</span>
                                                                    <br />
                                                                    <span>{d.cert?.graduation_year ?? "-"}</span>
                                                                    <p className="ms-3">
                                                                        -{" "}
                                                                        { d.cert?.topic ?? "-"}{" "}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div> */}

                                                    <div className={styles.userDetailsBlock}>
                                                        <h3 className={styles.Box_title}>
                                                            {t("Education")}:
                                                        </h3>

                                                        <div id="collapseExample">
                                                            <div className={styles.profile_listing}>
                                                                <div className={styles.profile_inner_content} style={{ marginLeft: "1rem" }}>
                                                                    <ul style={{ flexDirection: "column", gap: "0px" }}>
                                                                        {Array.isArray(d.edu) && d.edu.map(p => {
                                                                            return <li key={p?.start_year} style={{ listStyle: "disc" }}>{p?.degree_name || p?.other_degree_level || "-"}, {p?.field_of_study ?? "-"}, {p?.university_name ?? "-"}, {p?.country ?? "-"}, {p?.end_year ?? "-"}</li>
                                                                        })}

                                                                        {Array.isArray(d.uni) && d.uni.map(u => {
                                                                            return <li key={u?.start_year} style={{ listStyle: "disc" }}>{u?.degree_name || u?.other_degree_level || "-"}, {u?.field_of_study ?? "-"}, {u?.university_name ?? "-"}, {u?.country ?? "-"}, {u?.end_year ?? "-"}</li>
                                                                        })}

                                                                        {Array.isArray(d.sch) && d.sch.map(s => {
                                                                            return <li key={s?.graduation_year} style={{ listStyle: "disc" }}>{s?.grade_name || s?.graduation_other_certificate || "-"}, {s?.high_school_name ?? "-"}, {s?.country ?? "-"}, {s?.graduation_year ?? "-"}</li>
                                                                        })}

                                                                        {Array.isArray(d.cert) && d.cert.map(c => {
                                                                            return <li key={c?.graduation_year} style={{ listStyle: "disc" }}>{c?.topic ?? "-"}, {c?.organisation_name ?? "-"}, {c?.country ?? "-"} </li>
                                                                        })}
                                                                    </ul>


                                                                    {/* <h4 className={styles.sub_heading}>
                                                                        {d.edu?.university_name ?? "-"}
                                                                    </h4>
                                                                    <span>{d.edu?.country ?? "-"}</span>
                                                                    <br />
                                                                    <span>{d.edu?.end_year ?? "-"}</span>
                                                                    <p className="ms-3">
                                                                        -{" "}
                                                                        {d.edu?.field_of_study ??
                                                                            d.edu?.field_of_study ??
                                                                            "-"}{" "}
                                                                    </p> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div
                                                        className={styles.userDetailsBlock}
                                                        style={{ paddingBottom: "0px" }}
                                                    >
                                                        <h3 className={styles.Box_title}>{t("Job Titles")}:</h3>
                                                        <div className={styles.profile_listing} style={{ marginTop: "15px" }}>
                                                            <p style={{ marginLeft: "1rem" }}>
                                                                {Array.isArray(d.exp) && d.exp.map((e, index) => {
                                                                    return <span key={e.job_title + index}>{e.job_title} {index + 1 < d.exp.length ? ", " : ""}</span>
                                                                })}
                                                            </p>
                                                            {/* <div className={styles.profile_inner_content}>
                                                                <h4 className={styles.sub_heading}>
                                                                    {d.exp?.job_title ?? "-"}
                                                                </h4>
                                                                <div className={styles.experience_list}>
                                                                    <ul className={styles.experience_list_inner}>
                                                                        <li className={styles.title}>
                                                                            {d.exp?.company_name ?? "-"}
                                                                        </li>
                                                                        <li>
                                                                            {moment(d.exp?.start_date).format(
                                                                                "MMM-YYYY"
                                                                            )}{" "}
                                                                            -{" "}
                                                                            {d.exp?.end_date
                                                                                ? moment(d.exp?.end_date).format(
                                                                                    "MMM-YYYY"
                                                                                )
                                                                                : "Present"}{" "}
                                                                            (
                                                                            {totalExp(
                                                                                d.exp?.start_date,
                                                                                d.exp?.end_date
                                                                            )}
                                                                            )
                                                                        </li>
                                                                    </ul>
                                                                    <span>
                                                                        {d.exp?.city ?? "-"},{" "}
                                                                        {d.exp?.country ?? "-"}
                                                                    </span>
                                                                </div>
                                                            </div> */}
                                                        </div>
                                                    </div>

                                                    {/* <div className={styles.userDetailsBlock}>
                                                        <h3 className={styles.Box_title}>
                                                            Work Prefrences:
                                                        </h3>

                                                        <div id="collapseExample" style={{ marginTop: "15px" }}>
                                                            <div className={styles.profile_listing}>
                                                                <p style={{ marginLeft: "1rem" }}>
                                                                    {Array.isArray(d.pref) && d.pref.map((p, index) => {
                                                                        console.log("p",p)
                                                                        return <span>{p.job_title} {index + 1 < d.pref.length ? ", " : ""}</span>
                                                                    })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div> */}
                                                    <div
                                                        className={styles.userDetailsBlock}
                                                        style={{ paddingBottom: "0px" }}
                                                    >
                                                        <h3 className={styles.Box_title} >
                                                            {t("Work Preferences")}:
                                                        </h3>
                                                        <ul className={styles.statusBox} style={{ marginTop: "15px" }}>
                                                            {d.pref?.job_type_names.map((t, i) => (
                                                                <li
                                                                    className={`${styles.statusItems} ${styles.greenBtn} ${(i + 1 != d.pref?.job_type_names.length) ? styles.greenBtnNone : ""}`}
                                                                >
                                                                    {t}
                                                                </li>
                                                            ))}

                                                            {d.pref?.job_category_names.map((c) => (
                                                                <li
                                                                    className={`${styles.statusItems} ${styles.yellowBtn}`}
                                                                >
                                                                    {c}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                </div>
                                <div className={styles.paginationBox}>
                                    {
                                        (cvData && cvData.length > 0) && (
                                            <Pagination>
                                                <Pagination.First disabled={pageChange == 1} onClick={() => handlePage(pageChange - 1)} />
                                                {
                                                    Array.from({ length: Math.ceil(totalDoc / PER_PAGE) }).map((d, i) => (
                                                        <Pagination.Item active={pageChange == i + 1} onClick={() => handlePage(i + 1)}>{i + 1}</Pagination.Item>
                                                    ))
                                                }
                                                <Pagination.Last disabled={Math.ceil(totalDoc / PER_PAGE) == pageChange} onClick={() => handlePage(pageChange + 1)} ></Pagination.Last>
                                            </Pagination>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        <div onClick={addClassFilter} className={styles.sideTabicon}>
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
            {/* // MODAL INVITE TO APPLY */}
            <Modal className="successfull_popup" show={show} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title className={styles.modal_title}>{t("Send Invitation")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={styles.modal_content}>
                        <div className={styles.select_box}>
                            <label className={styles.select_job_lebal}>{t("select job to invite to")}</label>
                            <Form.Select aria-label="Default select example" onChange={(e) => { jobTitleChange(e); checkIsAlreadyInvited(e.target.value?.split("_")[0], inviteDetails.userId) }}>
                                <option value={""}>{t("Select")}</option>
                                {
                                    myJobs.map((d) => (
                                        <option value={`${d.id}_${d.title}`}>{d.title.substring(0, 80)}</option>
                                    ))
                                }
                                {/* <option value="1">Job Subject</option>
                                <option value="2">Email</option>
                                <option value="3">Description</option> */}
                            </Form.Select>
                            <div className={styles.textarea_box}>
                                <lebal className={styles.select_job_lebal}>{t("Subject")}:</lebal>
                                <input type="text" className={styles.textarea_track} value={mailTemplateSub?.replace("{ORG}", companyProfile?.company_name)} readOnly />
                            </div>

                        </div>
                        <div className={styles.email_preview}>
                            <h3 className={styles.select_job_lebal}>
                                {t("Email Preview")}
                            </h3>
                            <div className={styles.textarea_track} style={{ "overflow": "scroll", width: "100%", "height": "200px" }}>

                                <div dangerouslySetInnerHTML={{ __html: mailTemplateBody.replace("{NAME}", inviteDetails?.name) }}>

                                </div>
                            </div>

                        </div>

                    </div>

                </Modal.Body>
                <Modal.Footer>
                    {isAlreadyInvited && (<><p className="text-danger">{t("This candidate has already been invited previously for the same job.")}</p><br /></>)}
                    <Button className={styles.send_invitation_btn} variant="primary" disabled={(!selectedJob || isAlreadyInvited) ? true : false} onClick={() => {
                        if (!isAlreadyInvited) { inviteCandidate(mailTemplateSub.replace("{ORG}", companyProfile?.company_name), mailTemplateBody.replace("{NAME}", inviteDetails?.name)) }
                    }}>
                        {t("Send Invitation")}
                    </Button>
                </Modal.Footer>
            </Modal>
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
                            {t("Navigate our comprehensive database of applicant profiles and resumes with ease. Use advanced filters to pinpoint the ideal candidates for your vacancies swiftly. Save time by inviting promising candidates with a single click, ensuring a seamless connection with top-tier talents.")}
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

    const getType = await getJobTypes();
    const getJobCategory = await getJobCategories();
    const salary = await getJobSalaryRange();
    const mailTemplate = await getInviteMailTemplete();
    
    // const getData = await getSearchCvs();
    return {
        props: {
            jobTypeList: getType,
            jobCategory: getJobCategory,
            salaryRange: salary,
            inviteCnadidateMailTemplate: mailTemplate.emailTemplate,
            publicHeader: false,
            publicFooter: false,
            isProtected: true,
            ...(await serverSideTranslations(lang_code, [
                'common',
            ])),
        },
    }
}

export default Searchcv;
