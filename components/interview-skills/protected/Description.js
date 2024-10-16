import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ReactPlayer from "react-player";
import { Document, Page, pdfjs } from "react-pdf";
import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import style from "@/styles/description.module.css";
import { API } from "@/api";
import useRequest from "@/hooks/useRequest";
import { getScreenWidth, getShortText } from "@/utils/helper";
pdfjs.GlobalWorkerOptions.workerSrc = `cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

import CareerValues from "./assessment/CareerValues";
import CareerInterests from "./assessment/CareerInterests";
import MotivatedSkills from "./assessment/MotivatedSkills";
import PersonalityType from "./assessment/PersonalityType";
import LifePurpose from "./assessment/LifePurpose";

const assessmentObj = {
  career_values: CareerValues,
  career_interests: CareerInterests,
  motivated_skills: MotivatedSkills,
  personality_type: PersonalityType,
  life_purpose: LifePurpose,
};

const Description = ({ lesson }) => {
  const [isShowPlayButton, setIsShowPlayButton] = useState(true);
  const [isFirstTimeSeeked, setIsFirstTimeSeeked] = useState(false);
  const [progressId, setProgressId] = useState(lesson.progress_id);
  const [isCompleted, setIsCompleted] = useState(lesson.is_completed);
  const [isThirdCategoryCompleted, setIsThirdCategoryCompleted] = useState(
    lesson.is_third_category_completed
  );
  
  const [screenWidth, setScreenWidth] = useState(getScreenWidth());

  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);

  const [lang, setLang] = useState(null);

  const videoRef = useRef();

  const { request, response } = useRequest(true);
  const { request: requestComplete, response: responseComplete } =
    useRequest(true);
  const {
    request: requestIsThirdCategoryCompleted,
    response: responseIsThirdCategoryCompleted,
  } = useRequest(true);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

    if (localStorage.getItem("lang")) {
      setLang(JSON.parse(localStorage.getItem("lang")).code)
    }
  }, []);

  useEffect(() => {
    if (response) {
      if (response.id) {
        setProgressId(response.id);
      }
    }
  }, [response]);

  useEffect(() => {
    if (responseComplete) {
      setIsCompleted(true);

      if (
        lesson.course_data.category_id == 3 &&
        !isThirdCategoryCompleted &&
        lesson.is_another_course &&
        lesson.is_different_category
      ) {
        checkIsThirdCategroyCompletedHandler();
      }
    }
  }, [responseComplete]);

  useEffect(() => {
    if (responseIsThirdCategoryCompleted) {
      setIsThirdCategoryCompleted(
        responseIsThirdCategoryCompleted.isThirdCategoryCompleted
      );
    }
  }, [responseIsThirdCategoryCompleted]);

  const updateLessonProgressHandler = (playedSeconds) => {
    request("POST", "interview-skills/lesson-progress", {
      id: progressId,
      lesson_id: lesson.id,
      course_id: lesson.course_id,
      total_seconds: lesson.total_seconds,
      seconds_watched: playedSeconds,
    });
  };

  const completeLessonHandler = () => {
    if (!isCompleted) {
      requestComplete("PUT", "interview-skills/lesson-progress/complete", {
        id: progressId,
        total_seconds: lesson.total_seconds,
        lesson_id: lesson.id,
        course_id: lesson.course_id,
      });
    }
  };

  const getExtension = (filename) => {
    return filename.split(".").pop();
  };

  const downloadDocumentHandler = () => {
    // fetch(`${API}/${lesson.document}`)
    fetch(lesson.document).then((response) => {
      response.blob().then((blob) => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = `file.${getExtension(lesson.document)}`;
        a.click();
      });
    });
  };

  const checkIsThirdCategroyCompletedHandler = () => {
    requestIsThirdCategoryCompleted("GET", "interview-skills/category/third-category");
  };

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setTimeout(() => {
      setScreenWidth(() => {
        let sw = getScreenWidth();
        if (sw <= 767) {
          return sw - 30;
        }
        return sw - 800;
      });
    }, 100);
  }

  let isNextRouteAvailable = false;

  if (isCompleted && lesson.next_lesson_id) {
    if (lesson.course_data.category_id != 3) {
      isNextRouteAvailable = true;
    } else {
      if (lesson.is_different_category) {
        if (isThirdCategoryCompleted) {
          isNextRouteAvailable = true;
        } else if (!lesson.is_another_course) {
          isNextRouteAvailable = true;
        }
      } else if (!lesson.is_different_category) {
        isNextRouteAvailable = true;
      }

      // if (lesson.is_another_course && isThirdCategoryCompleted) {
      //   isNextRouteAvailable = true;
      // } else if (!lesson.is_another_course) {
      //   isNextRouteAvailable = true;
      // }
    }
  }

  const AssessmentComponent = assessmentObj[lesson.assessment];
  return (
    <JobSeekerAuth
      data={{
        // title: getShortText(lesson.course_data.title),
        title:
          lesson.course_data.category_id == 1
            ? "Introduction"
            : lesson.course_data.category_id == 2
            ? "Self Awareness"
            : lesson.course_data.category_id == 3
            ? "Market Awareness"
            : lesson.course_data.category_id == 4
            ? "Decision Making"
            : getShortText(lesson.course_data.title),
        // backArrow:
        //   lesson.course_data.skip_lessons === 1
        //     ? "/interview-skills"
        //     : `/interview-skills/lesson/${lesson.course_id}`,
        backArrow: `/interview-skills#${lesson.course_data.category_id}`,
      }}
    >
      <div className="page_container">
        <div className={["main_content main_bg", `${(lang == "AR") ? style.land_ar : ""}`]} id="body_lang_css">
          <div className={style.heading_block}>
            <p>
              <Link
                href={
                  lesson.course_data.skip_lessons === 1
                    ? "/interview-skills"
                    : `/interview-skills/lesson/${lesson.course_id}`
                }
              >
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
              {/* {lesson.course_data.title}  */}
              <span>{lesson.title}</span>
            </p>
            <div className={style.right_btn_block}>
              <div className={style.complete_btn_top}>
                {isCompleted && (
                  <div className={style.complete_btn}>
                    <img
                      className={style.complete_image}
                      src="/img/yestick.png"
                      alt=""
                    />
                    Completed
                  </div>
                )}
                {isNextRouteAvailable && (
                  <div className={style.download_pdf}>
                    <Link
                      href={`/interview-skills/lesson/description/${lesson.next_lesson_id}`}
                    >
                      Next
                    </Link>
                  </div>
                )}
              </div>
              {lesson.document && (
                <a
                  // target="__blank"
                  href="#!"
                  className={style.download_pdf}
                  // href={`${API}/${lesson.document}`}
                  onClick={downloadDocumentHandler}
                >
                  {lesson.is_excel ? "Download Excel" : "Download Pdf"}
                  {/* Download Pdf */}
                </a>
              )}
            </div>
          </div>
          {!lesson.document && (
            <div className={style.vedio_block}>
              {/* <video width="100%" height="509" controls>
              <source src="/img/demo-vedio.mp4" type="video/mp4" />
            </video> */}
              <ReactPlayer
                // url={`${API}/${lesson.video}`}
                // url="https://vz-9f6db73f-54e.b-cdn.net/3815d9ad-4ebc-4ff9-bc8f-1e04b3444339/playlist.m3u8"
                url={lesson.video}
                controls={true}
                playbackRate={1}
                pip={false}
                progressInterval={2000}
                width="100%"
                height="509"
                playing={!isShowPlayButton}
                onEnded={completeLessonHandler}
                onReady={() => {
                  if (!isFirstTimeSeeked) {
                    if (
                      !lesson.is_completed &&
                      !isNaN(lesson.seconds_watched)
                    ) {
                      videoRef.current.seekTo(
                        lesson.seconds_watched,
                        "seconds"
                      );
                    }
                    setIsFirstTimeSeeked(true);
                  }
                }}
                ref={videoRef}
                onProgress={(data) => {
                  !isCompleted &&
                    updateLessonProgressHandler(+data.playedSeconds.toFixed(0));
                }}
                onPause={() => setIsShowPlayButton(true)}
                onPlay={() => setIsShowPlayButton(false)}
              />
              {isShowPlayButton && (
                <a
                  onClick={() => setIsShowPlayButton(false)}
                  className={style.play_btn}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-play-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
                  </svg>
                </a>
              )}
            </div>
          )}

          {lesson.document && !lesson.is_excel && (
            <div className={style.vedio_block} style={{ height: "500px" }}>
              {/* <object
                data={`${API}/${lesson.document}`}
                type="application/pdf"
                width="100%"
                height="100%"
              >
                <p>
                  Alternative text - include a link{" "}
                  <a href={`${API}/${lesson.document}`}>to the PDF!</a>
                </p>
              </object> */}
              {/* <embed
                src={`${API}/${lesson.document}`}
                type="application/pdf"
                frameBorder="0"
                scrolling="auto"
                height="100%"
                width="100%"
              ></embed> */}

              <div
                className={style.react_pdf_container}
                // style={{
                //   height: "500px",
                //   overflow: "auto",
                //   width: "fit-content",
                //   margin : "auto"
                // }}
              >
                <Document
                  onLoadSuccess={onDocumentLoadSuccess}
                  // file={`${API}/${lesson.document}`}
                  file={lesson.document}
                >
                  {/* <Page pageNumber={pageNumber} renderAnnotationLayer={false} />
                  <p>
                    Page {pageNumber} of {numPages}
                  </p> */}
                  {Array.from(new Array(numPages), (el, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      renderAnnotationLayer={false}
                      renderTextLayer={false}
                      width={screenWidth - 30}
                    />
                  ))}
                </Document>
              </div>

              {/* <div className={style["pdf-container"]}> */}
              {/* <iframe
                // className={style["pdf-iframe"]}
                src={`${API}/${lesson.document}`}
                frameBorder="0"
                scrolling="auto"
                height="100%"
                width="100%"
              ></iframe> */}
              {/* </div> */}
            </div>
          )}

          {lesson.document && lesson.is_excel && (
            <div className={style.vedio_block} style={{ height: "500px" }}>
              <div className={style.react_pdf_container}>
                {/* Failed to load Excel file */}
                Download Excel
              </div>
            </div>
          )}


          {/*     TODO : DO SAME WITH CERTIFICATE     */}
          {/* {lesson.is_assessment == 1 && (
            <AssessmentComponent
              {...lesson.assessmentData}
              progressId={lesson.assessment_progress_id}
              nextLink={`/interview-skills/lesson/description/${lesson.next_lesson_id}`}
              lessonId={lesson.id}
              courseBackId={lesson.course_id}
            />
          )} */}
          <div className={style.right_btn_block_bottom}>
            {lesson.prev_lesson_id ? (
              <div className={`${style.download_pdf} ${style.prev_btn}`}>
                <Link
                  href={`/interview-skills/lesson/description/${lesson.prev_lesson_id}`}
                >
                  Previous
                </Link>
              </div>
            ) : (
              <div></div>
            )}

            {isNextRouteAvailable && (
              <div className={style.download_pdf}>
                <Link
                  href={`/interview-skills/lesson/description/${lesson.next_lesson_id}`}
                >
                  Next
                </Link>
              </div>
            )}
          </div>

          <div className={style.vedio_dis}>
            <p dangerouslySetInnerHTML={{__html: lesson.long_description}}></p>
          </div>
        </div>
      </div>
    </JobSeekerAuth>
  );
};

export default Description;
