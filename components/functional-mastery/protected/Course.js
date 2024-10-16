import React,{useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ProgressBar from "react-bootstrap/ProgressBar";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import style from "@/styles/course.module.css";
import { API } from "@/api";
import { setModal } from "@/store/siteSlice";
import { Modal } from "react-bootstrap";

const Course = ({ categories, progress, thirdCompleted,course_package_details }) => {
  
  const router = useRouter();
  const dispatch = useDispatch();

  const [welcomPopup, setWelcomePopup] = useState(true);
  const handleWelcomeClose = () => setWelcomePopup(false);
  const handleWelcomeShow = () => setWelcomePopup(true);

  const pushToLessonsListingHandler = (
    categoryId,
    courseId,
    skip_lessons,
    lessonId
  ) => {
    console.log(">>>>>>> ", categoryId,courseId,skip_lessons,lessonId);
    router.push(`/functional-mastery/chapter/lesson/${courseId}`);
    
    const pushHandler = () => {
      
      if (skip_lessons) {
        router.push(`/functional-mastery/chapter/lesson/description/${lessonId}`);
        // router.push(
        //   {
        //     pathname: `/functional-mastery/lesson/description/${lessonId}`,
        //     query: {
        //       id: categoryId,
        //     },
        //   },
        //   `/functional-mastery/lesson/description/${lessonId}`
        // );
      } else {
        router.push(`/functional-mastery/chapter/lesson/${courseId}`);
      }
    };
    // if (!thirdCompleted && categoryId == 4) {
    //   errorHandler();
    //   return;
    // }
    // if (progress.current_category_id >= categoryId) {
    //   if (progress.current_category_id == categoryId) {
    //     if (progress.current_sequence_mandatory == 0) {
    //       pushHandler(courseId, skip_lessons);
    //     } else if (progress.current_course_id >= courseId) {
    //       pushHandler(courseId, skip_lessons);
    //     } else {
    //       errorHandler();
    //     }
    //   } else {
    //     pushHandler(courseId, skip_lessons);
    //   }
    // } else {
    //   errorHandler();
    // }
  };

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
    <JobSeekerAuth data={{ title: course_package_details.title,backArrow:"/functional-mastery?query=true" }} >
      <div className="page_container">
        <div className="main_content main_bg" id="body_lang_css">
          {/* <div className={style.top_btn}>
            <h1 className={style.page_heading}>Introduction</h1>
            <a className={style.book_btn} href="javascript:void(0)">
              Book Coaching{" "}
            </a>
          </div> */}
          <div>
            {categories.map((category) => {
              
              return <>
                <div
                  id={category.id}
                  style={{ position: "relative", bottom: "100px" }}
                ></div>

                <div key={category.id}>
                  <div className={style.top_btn}>
                    <h1
                      className={`${style.page_heading} ${style.top_bottom_space}`}
                    >
                      {category.title}
                    </h1>
                  </div>
                  <div className="row g-4">
                    {category.courses.map((course) => {
                      console.log("course",course);
                      
                      const totalSeconds = course?.functional_mastery_lessons?.reduce((sum, l)=> {
                        sum += l.total_seconds ?? 0;
                        return sum;
                      },0)
                      return <>
                        <div
                          key={course.id}
                          className="col-sm-6 col-md-6 col-lg-6 col-xl-4"
                        >
                          <div className={style.course_crad}>
                            <div
                              className={style.course_img_block}
                              // style={{
                              //   backgroundImage: `url('${API}/${course.image}')`,
                              // }}
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
                              {/* <div className={style.icon_block}>
                                    <img src={`${API}/${course.image}`} /> 
                                    </div> */}
                            </div>
                            <div className={style.main_block}>
                              <div className={style.course_detais}>
                                {/* <h3 className={style.course_tittle}>
                                <a
                                  onClick={() =>
                                    pushToLessonsListingHandler(
                                      category.id,
                                      course.id,
                                      course.skip_lessons === 1,
                                      course.lessons[0]
                                    )
                                  }
                                  href="javascript:void(0)"
                                >
                                  {course.title}
                                </a>
                              </h3> */}
                                <div className={style.progress_bar}>
                                  <div className={style.progress_bar_heading}>
                                    <span>Progress</span>
                                    <span>{course.completed_percentage}%</span>
                                  </div>

                                  <div className="progress_bar_block">
                                    <ProgressBar
                                      now={course.completed_percentage}
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
                                    {course.lesson_completed_count} /{" "}
                                    {course.lessons.length}
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
                                    {Math.ceil(totalSeconds/60)} min
                                  </span>
                                  <button
                                  disabled={course?.lessons?.length == 0}
                                  style={course?.lessons?.length == 0 ? {backgroundColor: "grey", cursor: "auto"} : {}}
                                    onClick={() => {
                                        if(course.lessons.length == 0) return;
                                        pushToLessonsListingHandler(
                                          category.id,
                                          course.id,
                                          course.skip_lessons === 1,
                                          course.lessons[0]
                                        )
                                      }
                                    }
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
                                    Play
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          id={category.id + "-" + course.id}
                          style={{
                            position: "relative",
                            bottom: "100px",
                            width: "0px",
                            paddingLeft: "0px",
                            paddingRight: "0px",
                          }}
                        ></div>
                      </>
                    })}
                  </div>
                </div>
              </>
})}
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
                    <h2 className="modal_heading">What's This Section About? A Quick Overview!</h2>
                    </div>
                </Modal.Header>
        <Modal.Body>
          <div className={style.modal_content} style={{ textAlign: "left" }}>
            <p>
              Dive deep into specialized Functional Training to excel in key business areas like Sales, Supply Chain, HR, and more. Gain the expertise and practical skills needed to thrive in your chosen field, setting yourself apart in today's competitive job market.
            </p>
          </div>
        </Modal.Body>
      </Modal>
    </JobSeekerAuth>
  );
};

export default Course;
