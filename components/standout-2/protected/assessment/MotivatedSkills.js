import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useRouter } from "next/router";
import Link from "next/link";

import styles from "@/styles/assesment.module.css";
import { getMotivatedSkills } from "@/services/other";
import useDnd from "@/hooks/useDnd2";
import useRequest from "@/hooks/useRequest";

const MotivatedSkills = ({
  motivatedSkills,
  progressId,
  lessonId,
  nextLink,
  courseBackId,
}) => {
  const [show, setShow] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [newColumnStep2, setNewColumnStep2] = useState(null);
  const [newColumnStep3, setNewColumnStep3] = useState(null);

  const router = useRouter();
  const { asPath } = useRouter();

  const { request, response } = useRequest(true);

  const [result, setResult] = useState({
    motivated: [],
    developmental: [],
    burnout: [],
    unimportant: [],
  });

  const { showNextButton, getUI, columns } = useDnd({
    values: [motivatedSkills, [], [], []],
    titles: [
      "Choose Skills",
      "Enjoy Using Very Much",
      "Neutral",
      "Prefer Not To Use",
    ],
    bgColours: [null, "#DDF6D4", "#FBEDD9", "#E7E6FB"],
    maxLimit: [30, 10, 10, 10],
  });
  const {
    showNextButton: showNextButtonStep2,
    getUI: getUIStep2,
    updateColumns: updateColumnsStep2,
    columns: columnsStep2,
  } = useDnd({
    values: [],
    titles: [
      "Enjoy Using Very Much",
      "Highly Proficient / Competent",
      "Lack Desired Level",
    ],
    bgColours: [null, "#DDF6D4", "#FBEDD9"],
    maxLimit: [10, 5, 5],
  });

  const {
    showNextButton: showNextButtonStep3,
    getUI: getUIStep3,
    updateColumns: updateColumnsStep3,
    columns: columnsStep3,
  } = useDnd({
    values: [],
    titles: [
      "Prefer Not To Use",
      "Highly Proficient / Competent",
      "Lack Desired Level",
    ],
    bgColours: [null, "#DDF6D4", "#FBEDD9"],
    maxLimit: [10, 5, 5],
  });

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 10);
    return () => {
      clearTimeout();
    };
  }, [currentStep]);

  // const scroll = ()=> {
  //   const ele = document.getElementById("target");
  //   ele.scrollLeft = 0;
  //   ele.scrollTop = 0;
  // }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const buttonHandler = () => {
    //  scroll();
    if (currentStep == 3) {
      setResult({
        motivated: columnsStep2[1],
        developmental: columnsStep2[2],
        burnout: columnsStep3[1],
        unimportant: columnsStep3[2],
      });

      request("POST", "assessment-result", {
        type: "motivated_skills",
        result: columnsStep2[1].map((c) => +c.id),
        progressId,
        lessonId,
      });

      handleShow();
    } else {
      if (currentStep == 1) {
        if (newColumnStep2) {
          let allCheck = [];

          columns[1].forEach((element) => {
            if (
              element.id ==
                newColumnStep2[1].find((item) => item.id == element.id)?.id ||
              element.id ==
                newColumnStep2[2].find((item) => item.id == element.id)?.id ||
              element.id ==
                newColumnStep2[0].find((item) => item.id == element.id)?.id
            ) {
              allCheck.push(true);
            } else {
              allCheck.push(false);
            }
          });
          let isAllTrue = allCheck.every((v) => v);
          if (isAllTrue) {
            updateColumnsStep2(newColumnStep2);
          } else {
            updateColumnsStep2([[...columns[1]], [], []]);
          }
        } else {
          updateColumnsStep2([[...columns[1]], [], []]);
        }
      } else {
        if (newColumnStep3) {
          let allCheck = [];

          columns[3].forEach((element) => {
            if (
              element.id ==
                newColumnStep3[1].find((item) => item.id == element.id)?.id ||
              element.id ==
                newColumnStep3[2].find((item) => item.id == element.id)?.id ||
              element.id ==
                newColumnStep3[0].find((item) => item.id == element.id)?.id
            ) {
              allCheck.push(true);
            } else {
              allCheck.push(false);
            }
          });
          let isAllTrue = allCheck.every((v) => v);

          if (isAllTrue) {
            updateColumnsStep3(newColumnStep3);
          } else {
            updateColumnsStep3([[...columns[3]], [], []]);
          }
        } else {
          updateColumnsStep3([[...columns[3]], [], []]);
        }
      }
      setCurrentStep((prev) => prev + 1);
    }
  };

  let showNextButtonOriginal = false;

  if (currentStep == 1) {
    showNextButtonOriginal = showNextButton;
  } else if (currentStep == 2) {
    showNextButtonOriginal = showNextButtonStep2;
  } else if (currentStep == 3) {
    showNextButtonOriginal = showNextButtonStep3;
  }

  const scroll = () => {
    var ele = document.getElementById("target");
    // const scrollableDiv = document.querySelector('.scrollable-div');
    let scrollPosition = 0; // Reset the scroll position to 0
    ele.scrollLeft = scrollPosition;

    ele.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });

    // var ele = document.getElementById("target");
    // ele.scrollTo(0, 0);
  };
  //  const  previousButtonHandler = () => {
  //   // if (currentStep == 1) {
  //   //   updateColumnsStep2([[...columns[1]], [], []]);
  //   // } else {
  //   //   updateColumnsStep3([[...columns[3]], [], []]);
  //   // }
  //   setCurrentStep((prev) => prev - 1);
  //  }

  return (
    <>
      <div
        className={`${styles.instructions_wrapper} ${styles.motivated_skills_wrapper}`}
      >
        <p>
          <b>
            Welcome to the Motivated Skills Assessment. To uncover the
            classification of your skills, please follow these steps :{" "}
          </b>
        </p>
        {currentStep == 1 ? (
          <p>
            <span>Step 1: </span> Read carefully each skill with the explanation
            and classify them according to how much you enjoy using them. Level
            of enjoyment is classified into three categories:
            <ul className={styles.inner_point}>
              <li>1. Enjoy Using Very Much</li>
              <li>2. Neutral</li>
              <li>3. Prefer Not To Use </li>
            </ul>
            <span className={styles.note_text}>Note :</span> Please take into
            account that each category can include a maximum of 10 skills.
            <p>Let's begin!</p>
          </p>
        ) : currentStep == 2 ? (
          <p>
            <span>Step 2: </span> For the 10 selected skills under the category
            "Enjoy Using Very Much", now classify each of these skills according
            to how good you are at performing it.
            <p>Level of proficiency is classified into two categories:</p>
            <ul className={styles.inner_point}>
              <li>1. Highly Proficient / Competent</li>
              <li>2. Lack Desired Level</li>
            </ul>
            <span className={styles.note_text}>Note :</span> Please take into
            account that each category can include a maximum of 5 skills.
            <p>Let's continue!</p>
          </p>
        ) : (
          <p>
            <span>Step 3: </span> For the 10 selected skills under the category
            &quot;Prefer Not To Use&quot;, now classify each of these skills
            according to how good you are at performing it.
            <p>Level of proficiency is classified into two categories:</p>
            <ul className={styles.inner_point}>
              <li>1. Highly Proficient / Competent</li>
              <li>2. Lack Desired Level</li>
            </ul>
            <span className={styles.note_text}>Note :</span>Please take into
            account that each category can include a maximum of 5 skills.
            <p>
              After completing the assessment, you will receive insights into
              the categorization of your skills.{" "}
            </p>
            <p>Let's continue & discover! </p>
          </p>
        )}
      </div>
      <div className={styles.step_count}>
        <span>
          {" "}
          <a href="#">Step {currentStep} of</a> 3
        </span>
      </div>
      {currentStep == 1
        ? getUI()
        : currentStep == 2
        ? getUIStep2()
        : getUIStep3()}

      {/* {currentStep == 1 ? "" : <button
            type="button"
            className={`${styles.dash_theem_btn} btn`}
            style = {{marginTop:"20px"}}
            onClick={previousButtonHandler}
          >
         Previous
          </button>} */}

      {/* <div className={styles.next_pre_btn}> */}
      <div
        className={`${styles.next_pre_btn} ${
          currentStep > 3 || currentStep > 1 ? styles.two_btn : ""
        } mt-4`}
      >
        {currentStep > 1 && (
          <button
            type="button"
            className={`${styles.dash_theem_btn} btn`}
            onClick={() => {
              if (currentStep == 2) {
                setNewColumnStep2(columnsStep2);
              } else if (currentStep == 3) {
                setNewColumnStep3(columnsStep3);
              }
              setCurrentStep((prev) => prev - 1);
              scroll();
            }}
            // data={console.log(previousValueUpdate)}
          >
            Previous Step
          </button>
        )}
        {showNextButtonOriginal && (
          <button
            type="button"
            className={`${styles.dash_theem_btn} btn`}
            onClick={() => {
              buttonHandler();
              scroll();
            }}
          >
            {currentStep == 3 ? "Submit" : `Next Step`}
          </button>
        )}

        {/* {currentStep >1?
        <button
            type="button"
            className={`${styles.dash_theem_btn} btn`}
            // onClick={buttonHandler}
          >
            Previous 
          </button>:""
      }
        {showNextButtonOriginal && (
          
          <button
            type="button"
            className={`${styles.dash_theem_btn} btn`}
            onClick={buttonHandler}
          >
            {currentStep == 3 ? "Submit" : `Step ${currentStep + 1} of 3`}
          </button>
        )} */}
        <Modal
          show={show}
          // onHide={handleClose}
          className="successfull_popup full_modal"
        >
          <Modal.Body>
            <div class="modal_inner">
              <div class="icon_block">
                <img src="/img/value3.png" alt="" />
              </div>
              <h2 className={styles.modal_heading}>Assessment completed</h2>
              <h3>Your skills are classified as follows:</h3>

              <div className={styles.completed_result_block}>
                <div
                  className={`${styles.inner_result_block} ${styles.top_result}`}
                >
                  <div className={styles.value_top_listing}>
                    <h2>Top 5 Motivated Skills</h2>
                    <ul>
                      {result.motivated.map((obj, idx) => (
                        <li key={obj.id}>
                          <div className={styles.value_name}>
                            <span>{idx + 1}.</span>
                            {obj.content}
                          </div>
                          <div className={styles.value_img_box}>
                            {idx < 3 && (
                              <img src={`/img/value${idx + 1}.png`} alt="" />
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className={styles.inner_result_block}>
                  <div className={styles.value_top_listing}>
                    <h2>Developmental Skills</h2>
                    <ul>
                      {result.developmental.map((obj, idx) => (
                        <li>
                          <div className={styles.value_name}>
                            <span>{idx + 1}.</span>
                            {obj.content}
                          </div>
                          <div className={styles.value_img_box}></div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div
                  className={`${styles.inner_result_block} ${styles.top_result}`}
                >
                  <div className={styles.value_top_listing}>
                    <h2>Burnout Skills</h2>
                    <ul>
                      {result.burnout.map((obj, idx) => (
                        <li>
                          <div className={styles.value_name}>
                            <span>{idx + 1}.</span>
                            {obj.content}
                          </div>
                          <div className={styles.value_img_box}></div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className={styles.inner_result_block}>
                  <div className={styles.value_top_listing}>
                    <h2>Unimportant Skills</h2>

                    <ul>
                      {result.unimportant.map((obj, idx) => (
                        <li>
                          <div className={styles.value_name}>
                            <span>{idx + 1}.</span>
                            {obj.content}
                          </div>
                          <div className={styles.value_img_box}></div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className={`${styles.modal_result} ${styles.top_space}`}>
                Results are added to your{" "}
                <Link
                  href={`/job-seeker/my-profile/#motivatedSkills?id=${
                    courseBackId + 1
                  }`}
                >
                  Profile
                </Link>
              </div>
              <button
                type="submit"
                className="btn-primary btn_w"
                onClick={() => {
                  router.push(nextLink);
                }}
              >
                Go to Next
              </button>
              <br />
              <br />
              <button
                type="submit"
                className="link_btn"
                onClick={() => {
                  router.replace(asPath);
                }}
              >
                Repeat Assessment
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default MotivatedSkills;
