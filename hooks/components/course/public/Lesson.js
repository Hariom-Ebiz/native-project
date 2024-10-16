import React from "react";
import Link from "next/link";
import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import style from "@/styles/lesson.module.css";
import { CircularProgressbar } from "react-circular-progressbar";
import { API } from "@/api";
import PublicLayout from "@/components/layout/PublicLayout";
import { getShortText } from "@/utils/helper";

const colours = [
  "theem_progress",
  "brown_progress",
  "theem_blue_progress",
  "yellow_progress",
];

const colourClass = ["", "brown_box", "blue_box", "yellow_box"];

const Lesson = ({ lessons, course }) => {
  return (
    <PublicLayout
      data={{
        title: getShortText(course.title),
      }}
    >
      <section className={style.section_course}>
        <div className="container">
          <h1 className={style.sec_heading}>
            <Link href="/course">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_29602_18997)">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6.6665 20.0007C6.6665 19.0802 7.4127 18.334 8.33317 18.334H31.6665C32.587 18.334 33.3332 19.0802 33.3332 20.0007C33.3332 20.9211 32.587 21.6673 31.6665 21.6673H8.33317C7.4127 21.6673 6.6665 20.9211 6.6665 20.0007Z"
                    fill="#25324B"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.15466 18.8221C7.80553 18.1713 8.86081 18.1713 9.51168 18.8221L19.5117 28.8221C20.1626 29.473 20.1626 30.5283 19.5117 31.1792C18.8608 31.83 17.8055 31.83 17.1547 31.1792L7.15466 21.1792C6.50379 20.5283 6.50379 19.473 7.15466 18.8221Z"
                    fill="#25324B"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M19.5117 8.82214C20.1626 9.47301 20.1626 10.5283 19.5117 11.1792L9.51168 21.1792C8.86081 21.83 7.80553 21.83 7.15466 21.1792C6.50379 20.5283 6.50379 19.473 7.15466 18.8221L17.1547 8.82214C17.8055 8.17127 18.8608 8.17127 19.5117 8.82214Z"
                    fill="#25324B"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_29602_18997">
                    <rect width="40" height="40" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </Link>
            Build your profile and...
          </h1>
          <div className={style.lesson_wrapper}>
            <ul className={style.lesson_list_block}>
              {lessons.map((lesson, index) => (
                <li key={lesson.id} className={colours[index % colours.length]}>
                  <div className={style.points_text}>
                    <span
                      className={`${style.count_box} ${
                        style[colourClass[index % colours.length]]
                      }`}
                    >
                      {lesson.order_number}
                    </span>
                  </div>
                  <div className={style.lesson_details}>
                    <div className={style.lesson_img}>
                      <img src={`${API}/${lesson.image}`} alt="working" />
                    </div>
                    <div className={style.lesson_dis}>
                      <h3 className={style.lesson_tittle}>{lesson.title}</h3>
                      <p className={style.lesson_text}>
                        {/* {lesson.short_description} */}
                      </p>
                      <div className={style.top_btn}>
                        {/* <Link
                          className={style.book_btn}
                          href="/login"
                        >
                          <svg
                            width="14"
                            height="18"
                            viewBox="0 0 14 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3.76189 1.37562L3.76143 1.37529C3.05852 0.882131 2.3312 0.760807 1.7101 1.10028C1.14118 1.39072 0.81437 2.07032 0.81437 2.8934V15.1292C0.81437 15.9529 1.14166 16.6328 1.71133 16.9229L1.71158 16.923C1.93438 17.0357 2.16234 17.0919 2.43852 17.0919C2.83071 17.0919 3.32182 16.9256 3.75045 16.7069L3.7509 16.7077L3.76192 16.6999L11.9546 10.8761C12.6087 10.4335 12.9981 9.76706 12.9981 9.03571C12.9981 8.30453 12.6088 7.63795 11.9544 7.19935L3.76189 1.37562ZM3.01834 15.6412L3.01816 15.641L3.0123 15.6459C2.70855 15.9024 2.43421 15.9326 2.26688 15.8463L2.26625 15.846C2.18943 15.8072 2.1217 15.7235 2.07279 15.5948C2.0243 15.4672 1.99814 15.3045 1.99814 15.1251V2.88933C1.99814 2.46808 2.10234 2.25281 2.26688 2.16805L2.27985 2.16136L2.29012 2.15099C2.29598 2.14506 2.31209 2.13614 2.34489 2.13062C2.37564 2.12544 2.40773 2.12527 2.43446 2.12527C2.57286 2.12527 2.81767 2.17232 3.06149 2.37327L3.06134 2.37346L3.06669 2.37726L11.2603 8.20171L11.2602 8.20175L11.2626 8.20332C11.5639 8.40377 11.7498 8.70032 11.7498 8.98276L11.7499 8.98507C11.7568 9.26282 11.5718 9.55571 11.2115 9.81703C11.2114 9.81711 11.2113 9.81718 11.2112 9.81726L3.01834 15.6412Z"
                              fill="white"
                              stroke="Currentcolor"
                              stroke-width="0.183759"
                            />
                          </svg>
                          Play
                        </Link> */}
                      </div>
                    </div>
                    {/* <div className={style.chart_block}>
                      <CircularProgressbar
                        value={lesson.completed_percentage}
                        text={`${lesson.completed_percentage}%`}
                      />
                    </div> */}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Lesson;
