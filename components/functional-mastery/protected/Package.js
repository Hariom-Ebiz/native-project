import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ProgressBar from "react-bootstrap/ProgressBar";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import style from "@/styles/course.module.css";
import { API } from "@/api";
import { setModal } from "@/store/siteSlice";
import { Modal } from "react-bootstrap";

const Package = ({ courses }) => {
    const {  subscription } = useSelector((store) => store.auth);
    const [welcomPopup, setWelcomePopup] = useState(true);
    const [coursePurchagePopup, setCoursePurchasePopup] = useState(false);
    const handleWelcomeClose = () => setWelcomePopup(false);

    const handlePurchasePopupClose = () => setCoursePurchasePopup(false);
    const handlePurchasePopupOpen = () => setCoursePurchasePopup(true);
    //   console.log("progress",progress);
    const router = useRouter();
    const dispatch = useDispatch();

    const pushToLessonsListingHandler = (
        categoryId,
        courseId,
        skip_lessons,
        lessonId
    ) => {
        const pushHandler = () => {

            if (skip_lessons) {
                router.push(`/functional-mastery/lesson/description/${lessonId}`);
            } else {
                router.push(`/functional-mastery/lesson/${courseId}`);
            }
        };
    };

    const pushToChaptersHandler = (packageId) => {
        
        if(Array.isArray(subscription['functional_mastery'])){
            if(subscription['functional_mastery'].includes(String(packageId))){
                router.push(`/functional-mastery/chapter/${packageId}`)
            } else {
                handlePurchasePopupOpen()
            }
        }
    }

    const errorHandler = () => {
        dispatch(
            setModal(
                <>
                    <div className="modal_inner">
                        <div className="icon_block">
                            <img src="/img/error.png" alt="" />
                        </div>
                        <h3>Please finish the previous lesson first.</h3>
                    </div>
                </>
            )
        );
    };

    return (
        <JobSeekerAuth data={{ title: "Functional Mastery" }}>
            <div className="page_container">
                <div className="main_content main_bg" id="body_lang_css">
                    <div>
                        <div
                            id={"category.id"}
                            style={{ position: "relative", bottom: "100px" }}
                        ></div>

                        <div>
                            <div className={style.top_btn}>
                            </div>
                            <div className="row g-4">
                                {courses.map((course) => (
                                    <>
                                        <div
                                            key={course.id}
                                            className="col-sm-6 col-md-6 col-lg-6 col-xl-4"
                                        >
                                            <div className={style.course_crad}>
                                                <div
                                                    className={style.course_img_block}
                                                >
                                                    <img src={`${API}/${course.image}`} />

                                                    {course.linkdin_link ? (
                                                        <a
                                                            className="linkdin_icon_box"
                                                            href={course?.linkdin_link}
                                                            target="_blank"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="16"
                                                                height="16"
                                                                fill="currentColor"
                                                                class="bi bi-linkedin"
                                                                viewBox="0 0 16 16"
                                                            >
                                                                <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                                                            </svg>
                                                        </a>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                                <div className={style.main_block}>
                                                    <div className={style.course_detais}>
                                                        <h3 className={style.course_tittle}>
                                                            <button
                                                                type="button"
                                                                className="bg-transparent border-0 p-0 m-0"
                                                                style={course?.totalLessons == 0 ? { backgroundColor: "grey", cursor: "auto", fontSize: "18px", textAlign: "left" } : { fontSize: "18px", textAlign: "left" }}
                                                                onClick={() => { course?.totalLessons != 0 && router.push(`/functional-mastery/chapter/${course.id}`) }}
                                                            >
                                                                {course.title}
                                                            </button>
                                                        </h3>
                                                        <div className={style.progress_bar}>
                                                            <div className={style.progress_bar_heading}>
                                                                <span>Progress</span>
                                                                <span>{Math.round((course.totalCompletedLessons / (course.totalLessons || 1)) * 100)}%</span>
                                                            </div>

                                                            <div className="progress_bar_block">
                                                                <ProgressBar
                                                                    now={Math.round((course.totalCompletedLessons / (course.totalLessons || 1)) * 100)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className={style.course_type}>
                                                            <span>Lesson</span>
                                                            <span>
                                                                <svg
                                                                    width="18"
                                                                    height="18"
                                                                    viewBox="0 0 18 18"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        clipRule="evenodd"
                                                                        d="M2.19671 13.3934H1.83956C1.64242 13.3934 1.48242 13.5534 1.48242 13.7506V15.1791C1.48242 16.1648 2.28242 16.9648 3.26814 16.9648H14.6967C15.6824 16.9648 16.4824 16.1648 16.4824 15.1791V13.7506C16.4824 13.5534 16.3224 13.3934 16.1253 13.3934H15.7681V3.03627C15.7681 2.44484 15.2881 1.96484 14.6967 1.96484H3.26814C2.67671 1.96484 2.19671 2.44484 2.19671 3.03627V13.3934ZM2.19671 14.1077H15.7681V15.1791C15.7681 15.7706 15.2881 16.2506 14.6967 16.2506H3.26814C2.67671 16.2506 2.19671 15.7706 2.19671 15.1791V14.1077ZM8.26814 15.5363H9.69671C9.89385 15.5363 10.0539 15.3763 10.0539 15.1791C10.0539 14.982 9.89385 14.822 9.69671 14.822H8.26814C8.07099 14.822 7.91099 14.982 7.91099 15.1791C7.91099 15.3763 8.07099 15.5363 8.26814 15.5363ZM15.0539 13.3934V3.03627C15.0539 2.83913 14.8939 2.67913 14.6967 2.67913H3.26814C3.07099 2.67913 2.91099 2.83913 2.91099 3.03627V13.3934H15.0539ZM11.2849 8.35556C11.406 8.2952 11.4824 8.17163 11.4824 8.03627C11.4824 7.90092 11.406 7.77734 11.2849 7.71699L6.99921 5.57413C6.88849 5.51877 6.75707 5.52449 6.65171 5.58949C6.54635 5.65484 6.48242 5.76949 6.48242 5.89342V10.1791C6.48242 10.3031 6.54635 10.4177 6.65171 10.4831C6.75707 10.5481 6.88849 10.5538 6.99921 10.4984L11.2849 8.35556ZM10.3267 8.03627L7.19671 9.60127V6.47127L10.3267 8.03627Z"
                                                                        fill="#5FA9C0"
                                                                    />
                                                                </svg>
                                                                {course.totalCompletedLessons} /{" "}
                                                                {course.totalLessons}
                                                            </span>
                                                        </div>
                                                        <div className={style.lesson_time}>
                                                            <span>
                                                                <svg
                                                                    width="16"
                                                                    height="16"
                                                                    viewBox="0 0 16 16"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        d="M7.98242 15.166C4.27617 15.166 1.26367 12.1535 1.26367 8.44727C1.26367 4.74102 4.27617 1.72852 7.98242 1.72852C11.6887 1.72852 14.7012 4.74102 14.7012 8.44727C14.7012 12.1535 11.6887 15.166 7.98242 15.166ZM7.98242 2.66602C4.79492 2.66602 2.20117 5.25977 2.20117 8.44727C2.20117 11.6348 4.79492 14.2285 7.98242 14.2285C11.1699 14.2285 13.7637 11.6348 13.7637 8.44727C13.7637 5.25977 11.1699 2.66602 7.98242 2.66602Z"
                                                                        fill="#872923"
                                                                    />
                                                                    <path
                                                                        d="M10.3016 10.9036C10.2203 10.9036 10.1391 10.8849 10.0641 10.8349L8.12656 9.67861C7.64531 9.39111 7.28906 8.75986 7.28906 8.20361V5.64111C7.28906 5.38486 7.50156 5.17236 7.75781 5.17236C8.01406 5.17236 8.22656 5.38486 8.22656 5.64111V8.20361C8.22656 8.42861 8.41406 8.75986 8.60781 8.87236L10.5453 10.0286C10.7703 10.1599 10.8391 10.4474 10.7078 10.6724C10.6141 10.8224 10.4578 10.9036 10.3016 10.9036Z"
                                                                        fill="#872923"
                                                                    />
                                                                </svg>
                                                                {Math.ceil(course.totalPackageTime / 60)} min
                                                            </span>
                                                            <button
                                                                disabled={course?.totalLessons == 0}
                                                                style={course?.totalLessons == 0 ? { backgroundColor: "grey", cursor: "auto" } : {}}
                                                                onClick={() => pushToChaptersHandler(course.id)}
                                                            >
                                                                <svg
                                                                    width="13"
                                                                    height="17"
                                                                    viewBox="0 0 13 17"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        d="M3.21728 0.822451L3.21681 0.822123C2.5138 0.32889 1.78626 0.207477 1.16493 0.547077C0.595775 0.837637 0.268916 1.51747 0.268916 2.34067V14.5764C0.268916 15.4002 0.596252 16.0804 1.16617 16.3707L1.16642 16.3708C1.38929 16.4834 1.61734 16.5397 1.8936 16.5397C2.28592 16.5397 2.77711 16.3733 3.20577 16.1546L3.20622 16.1555L3.21731 16.1476L11.41 10.3238C12.0642 9.88111 12.4537 9.21452 12.4537 8.48297C12.4537 7.75159 12.0643 7.08485 11.4098 6.64616L3.21728 0.822451ZM2.47311 15.088L2.47293 15.0878L2.46703 15.0928C2.16337 15.3492 1.88926 15.3792 1.7222 15.2931L1.72157 15.2928C1.64491 15.2541 1.57725 15.1705 1.52837 15.0419C1.4799 14.9143 1.45375 14.7517 1.45375 14.5723V2.3366C1.45375 1.91539 1.55795 1.7004 1.7222 1.61579L1.73525 1.60907L1.74557 1.59863C1.75132 1.59282 1.7673 1.58393 1.80006 1.57841C1.83075 1.57324 1.8628 1.57307 1.88954 1.57307C2.02783 1.57307 2.27252 1.62008 2.51623 1.82095L2.51608 1.82113L2.52146 1.82496L10.715 7.64941L10.715 7.64945L10.7174 7.65103C11.0185 7.85141 11.2044 8.14781 11.2044 8.43003L11.2044 8.43235C11.2114 8.70983 11.0265 9.00257 10.6663 9.26384C10.6662 9.26393 10.6661 9.26401 10.666 9.2641L2.47311 15.088Z"
                                                                        fill="white"
                                                                        stroke="#fff"
                                                                        strokeWidth="0.184825"
                                                                    />
                                                                </svg>
                                                                Start
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            id={"category.id" + "-" + course.id}
                                            style={{
                                                position: "relative",
                                                bottom: "100px",
                                                width: "0px",
                                                paddingLeft: "0px",
                                                paddingRight: "0px",
                                            }}
                                        ></div>
                                    </>
                                ))}
                            </div>
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
                <Modal.Header closeButton>
                    <div className={style.modal_content}>
                        <span style={{ fontSize: "24px", }}>What's This Section About? A Quick Overview!</span>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className={style.modal_content} style={{ textAlign: "left" }}>
                        <h6>
                            Dive deep into specialized Functional Training to excel in key business areas like Sales, Supply Chain, HR, and more. Gain the expertise and practical skills needed to thrive in your chosen field, setting yourself apart in today's competitive job market.
                        </h6>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal
                className="successfull_popup"
                show={coursePurchagePopup}
                onHide={handlePurchasePopupClose}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <div className={style.modal_content}>
                        <span style={{ fontSize: "24px", }}>Please Purchase this Package !</span>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className={style.modal_content} style={{ textAlign: "left" }}>
                        <h6>
                            You have to purchase this Package before accessing it.
                        </h6>
                        <div style={{width: "100%", maxWidth: "350px", margin: "auto", fontWeight: 400, fontSize: "18px", fontFamily: "Montserrat", textAlign: "center", color: "#fff"}}>
                            <Link href={"/job-seeker/expansion-renewal"} style={{background: "#161d46", display: "flex", padding: "12px 24px", justifyContent: "center", alignItems: "center", gap: "10px", borderRadius: "15px", marginTop: "25px",color: "#fff"}}>Purchase Now</Link>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </JobSeekerAuth>
    );
};

export default Package;
