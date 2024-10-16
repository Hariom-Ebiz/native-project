import React from "react";
import Link from "next/link";
import ProgressBar from "react-bootstrap/ProgressBar";
import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import style from "@/styles/course.module.css";
import { API } from "@/api";
import PublicLayout from "@/components/layout/PublicLayout";

const Course = ({ categories }) => {
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
    </PublicLayout>
  );
};

export default Course;
