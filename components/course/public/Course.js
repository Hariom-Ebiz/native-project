import React, { useState } from "react";
import Link from "next/link";
import ProgressBar from "react-bootstrap/ProgressBar";
import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import style from "@/styles/course.module.css";
import { API } from "@/api";
import PublicLayout from "@/components/layout/PublicLayout";
import { Modal } from "react-bootstrap";

const Course = ({ categories }) => {
  const [welcomPopup, setWelcomePopup] = useState(true);
  const handleWelcomeClose = () => setWelcomePopup(false);
  const handleWelcomeShow = () => setWelcomePopup(true);
  return (
    <PublicLayout data={{ title: "Career Roadway" }}>
      <section className={style.section_course}>
        <div className="container">
          <h1 className="sec_heading tex text-start mb-4">Career Roadway</h1>

          {/* <div className={style.top_btn}>
            <a className={style.book_btn} href="javascript:void(0)">
              Book Coaching{" "}
            </a>
          </div> */}
          <div>
            {categories.map((category) => (
              <div key={category.id}>
                <h1
                  className={`${style.page_heading} ${style.top_bottom_space}`}
                >
                
                  {category.title} 
                </h1>
                <div className="row g-4">
                  {category.courses.map((course) => (
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
                          {/* <div className={style.icon_block}>
                          <img src={`${API}/${course.image}`} />
                        </div> */}
                        </div>
                        <div className={style.main_block}>
                          <div className={style.course_detais}>
                            <h3 className={style.course_tittle}>
                              <Link
                                href={
                                  course.skip_lessons == 1
                                    ? `/login`
                                    : `/course/lesson/${course.id}`
                                }
                              >
                                {course.title}
                              </Link>
                            </h3>
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
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M2.19671 13.3934H1.83956C1.64242 13.3934 1.48242 13.5534 1.48242 13.7506V15.1791C1.48242 16.1648 2.28242 16.9648 3.26814 16.9648H14.6967C15.6824 16.9648 16.4824 16.1648 16.4824 15.1791V13.7506C16.4824 13.5534 16.3224 13.3934 16.1253 13.3934H15.7681V3.03627C15.7681 2.44484 15.2881 1.96484 14.6967 1.96484H3.26814C2.67671 1.96484 2.19671 2.44484 2.19671 3.03627V13.3934ZM2.19671 14.1077H15.7681V15.1791C15.7681 15.7706 15.2881 16.2506 14.6967 16.2506H3.26814C2.67671 16.2506 2.19671 15.7706 2.19671 15.1791V14.1077ZM8.26814 15.5363H9.69671C9.89385 15.5363 10.0539 15.3763 10.0539 15.1791C10.0539 14.982 9.89385 14.822 9.69671 14.822H8.26814C8.07099 14.822 7.91099 14.982 7.91099 15.1791C7.91099 15.3763 8.07099 15.5363 8.26814 15.5363ZM15.0539 13.3934V3.03627C15.0539 2.83913 14.8939 2.67913 14.6967 2.67913H3.26814C3.07099 2.67913 2.91099 2.83913 2.91099 3.03627V13.3934H15.0539ZM11.2849 8.35556C11.406 8.2952 11.4824 8.17163 11.4824 8.03627C11.4824 7.90092 11.406 7.77734 11.2849 7.71699L6.99921 5.57413C6.88849 5.51877 6.75707 5.52449 6.65171 5.58949C6.54635 5.65484 6.48242 5.76949 6.48242 5.89342V10.1791C6.48242 10.3031 6.54635 10.4177 6.65171 10.4831C6.75707 10.5481 6.88849 10.5538 6.99921 10.4984L11.2849 8.35556ZM10.3267 8.03627L7.19671 9.60127V6.47127L10.3267 8.03627Z"
                                    fill="#5FA9C0"
                                  />
                                </svg>
                                {/* {course.lesson_completed_count} /{" "} */}
                                {course.lessons.length}
                              </span>
                            </div>
                            <div className={style.lesson_time}>
                              <Link
                                href={
                                  course.skip_lessons == 1
                                    ? `/login`
                                    : `/course/lesson/${course.id}`
                                }
                              >
                                {" "}
                                Details{" "}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
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
                    Discover your ideal career path with our transformative coaching journey. Gain the clarity needed to identify careers that align with your values, interests, skills, personality and learn how to create a strategic plan to achieve your professional goals.
                                  <br /> <br />
                    Through deep dives into self-awareness and market trends, you'll gain insights into what drives you and the opportunities available. Develop a personalized roadmap that combines your strengths with market demands, ensuring your journey is both fulfilling and successful.
                    <br /> <br />
                    It is worth mentioning that this part includes comprehensive Psychometric Assessments that not only expand your self-awareness but also significantly boosts your chances of standing out to employers searching for top candidates on our platform.
                  </p>
              </div>
          </Modal.Body>
      </Modal>
    </PublicLayout>
  );
};

export default Course;
