import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { CircularProgressbar } from "react-circular-progressbar";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import style from "@/styles/lesson.module.css";
import styleDescription from "@/styles/description.module.css";
import { API } from "@/api";
import { setModal } from "@/store/siteSlice";
import { getShortText } from "@/utils/helper";

const colours = [
  "theem_progress",
  "brown_progress",
  "theem_blue_progress",
  "yellow_progress",
];

const colourClass = ["", "brown_box", "blue_box", "yellow_box"];

const Lesson = ({ lessons, course, progress }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [lang, setLang] = useState(null);

  const pushToLessonsListingHandler = (lessonId) => {
    const pushHandler = () => {
      router.push(`/course/lesson/description/${lessonId}`);
    };
    if (
      progress.current_lesson_id >= lessonId ||
      (progress.current_sequence_mandatory === 0 &&
        course.category_id == progress.current_category_id)
    ) {
      pushHandler();
    } else {
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
    }
  };

  // const routerChange = () => {
  //   router.push({
  //     pathname: "/course",
  //     query: { routerScroll: true },
  //   });
  // };

  useEffect(() => {

    if (localStorage.getItem("lang")) {
      setLang(JSON.parse(localStorage.getItem("lang")).code)
    }
  }, [])

  return (
    <JobSeekerAuth
      data={{
        // title: getShortText(course.title),
        title:
          course.category_id == 1
            ? "Introduction"
            : course.category_id == 2
            ? "Self Awareness"
            : course.category_id == 3
            ? "Market Awareness"
            : course.category_id == 4
            ? "Decision Making"
            : getShortText(course.title),
        backArrow: `/course#${course.category_id}`,
      }}
    >
      <div className="page_container">
        <div className={["main_content main_bg", `${(lang == "AR") ? style.land_ar : ""}`]} id="body_lang_css">
          <div className={styleDescription.heading_block}>
            <p>
              <Link href={"/course/#" + course.category_id + "-" + course.id}>
                <svg
                  width="38"
                  height="37"
                  viewBox="0 0 38 37"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_1026_163)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.77734 18.5002C6.77734 17.6487 7.46757 16.9585 8.31901 16.9585H29.9023C30.7538 16.9585 31.444 17.6487 31.444 18.5002C31.444 19.3516 30.7538 20.0418 29.9023 20.0418H8.31901C7.46757 20.0418 6.77734 19.3516 6.77734 18.5002Z"
                      fill="#25324B"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.22889 17.41C7.83095 16.808 8.80708 16.808 9.40913 17.41L18.6591 26.66C19.2612 27.2621 19.2612 28.2382 18.6591 28.8403C18.0571 29.4423 17.0809 29.4423 16.4789 28.8403L7.22889 19.5903C6.62683 18.9882 6.62683 18.0121 7.22889 17.41Z"
                      fill="#25324B"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M18.6591 8.16004C19.2612 8.7621 19.2612 9.73823 18.6591 10.3403L9.40913 19.5903C8.80708 20.1923 7.83095 20.1923 7.22889 19.5903C6.62683 18.9882 6.62683 18.0121 7.22889 17.41L16.4789 8.16004C17.0809 7.55798 18.0571 7.55798 18.6591 8.16004Z"
                      fill="#25324B"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1026_163">
                      <rect
                        width="37"
                        height="37"
                        fill="white"
                        transform="translate(0.61084)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </Link>
              {course.title}
            </p>
          </div>
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
                      <h3
                        onClick={() => pushToLessonsListingHandler(lesson.id)}
                        className={style.lesson_tittle}
                      >
                        {lesson.title}
                      </h3>
                      <p className={style.lesson_text}>
                        {/* {lesson.short_description} */}
                      </p>
                      <div className={style.top_btn}>
                        <a
                          className={style.book_btn}
                          // href={`/course/lesson/description/${lesson.id}`}
                          href="javascript:void(0)"
                          onClick={() => pushToLessonsListingHandler(lesson.id)}
                        >
                          {lesson.video ? (
                            <>
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
                                  strokeWidth="0.183759"
                                />
                              </svg>
                              Play
                            </>
                          ) : lesson.is_assessment == 1 ? (
                            <span>Take Assessment</span>
                          ) : lesson.is_excel == 1 ? (
                            // <a href={`${API}/${lesson.document}`}>
                            <a href={lesson.document}>
                              <span style={{ color: "white" }}>
                                Download Excel
                              </span>
                            </a>
                          ) : (
                            <span>View</span>
                          )}
                        </a>
                      </div>
                    </div>
                    <div className={style.chart_block}>
                      {lesson.is_assessment == 0 && (
                        <CircularProgressbar
                          value={lesson.completed_percentage}
                          text={`${lesson.completed_percentage}%`}
                        />
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </JobSeekerAuth>
  );
};

export default Lesson;
