import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useRouter } from "next/router";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { elementScrollIntoViewPolyfill } from "seamless-scroll-polyfill";

import styles from "@/styles/assesment.module.css";
import useRequest from "@/hooks/useRequest";
import { setModal, unsetModal } from "@/store/siteSlice";

const CareerInterests = ({
  statements,
  categories,
  progressId,
  lessonId,
  nextLink,
  courseBackId,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm();

  const [topCategories, setTopCategories] = useState([]);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const router = useRouter();
  const { asPath } = useRouter();

  const dispatch = useDispatch();
  const { request } = useRequest(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [newStatementData, setNewStatementData] = useState([
    statements[0],
    statements[1],
    statements[2],
    statements[3],
    statements[4],
    statements[5],
  ]);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 10);
    return () => {
      clearTimeout();
    };
  }, []);

  // function scroll(element){
  //   var ele = document.getElementById(element);
  //   window.scrollTo(ele.offsetLeft,ele.offsetTop); }

  const onSubmit = (data) => {
    const statementsObj = {};

    statements.forEach((st) => {
      statementsObj[st.id] = st.category_id;
    });

    const categoriesObj = {};

    categories.forEach((cat) => {
      categoriesObj[cat.id] = {
        title: cat.title,
        count: 0,
      };
    });

    for (let key in data) {
      if (data[key] == "true") {
        const id = +key.split("statementChoice")[1];
        categoriesObj[statementsObj[id]].count++;
      }
    }

    let categoriesArr = [];

    for (let key in categoriesObj) {
      if (categoriesObj[key].count !== 0) {
        categoriesArr.push({ id: key, ...categoriesObj[key] });
      }
    }

    if (categoriesArr.length == 0) {
      dispatch(
        setModal(
          <div className="modal_inner">
            <div className="icon_block">
              <img src="/img/error.png" alt="" />
            </div>
            <h3>
              All interests are having the same score, accordingly Interest
              Profile can’t be determined.
            </h3>

            {/* <h3>accordingly interest profile can’t be determined</h3> */}
            <button
              type="submit"
              className="link_btn"
              aria-label="Close"
              onClick={() => {
                dispatch(unsetModal(false));
                router.replace(asPath);
              }}
            >
              Repeat Assessment
            </button>
          </div>
        )
      );
      return;
    }

    categoriesArr = categoriesArr.sort((a, b) => b.count - a.count);

    let allLike = categoriesArr.every((item) => item.count == 7);
    let allEqual = categoriesArr.every(
      (item) => item.count === categoriesArr[0].count
    );

    if (allEqual && categoriesArr.length != 6) {
      allEqual = false;
    }

    if (allLike && categoriesArr.length != 6) {
      allLike = false;
    }

    if (allLike || allEqual) {
      dispatch(
        setModal(
          <div className="modal_inner">
            <div className="icon_block">
              <img src="/img/error.png" alt="" />
            </div>
            <h3>
              All interests are having the same score, accordingly Interest
              Profile can’t be determined.
            </h3>

            <button
              type="submit"
              className="link_btn"
              aria-label="Close"
              onClick={() => {
                dispatch(unsetModal(false));

                router.replace(asPath);
              }}
            >
              Repeat Assessment
            </button>
            {/* <h3>accordingly interest profile can’t be determined</h3> */}
          </div>
        )
      );
      return;
    }
    categoriesArr = categoriesArr.slice(0, 3);
    setTopCategories(categoriesArr);

    request("POST", "assessment-result", {
      type: "career_interests",
      result: categoriesArr.map((c) => +c.id),
      progressId,
      lessonId,
    });

    handleShow();
  };

  const pageChangeHandler = (pageNumber) => {
    // scroll("target1");
    let isError = false;
    newStatementData.map((item) => {
      if (watch(`statementChoice${item.id}`) == null) {
        isError = true;
        setError(`statementChoice${item.id}`, {
          type: "required",
          message: "this field is required",
        });
        return;
      }
    });
    if (!isError) {
      // if(pageNumber == 1){
      //   setNewStatementData([statements[0],statements[1],statements[2],statements[3],statements[4],statements[5]])
      // }
      // else
      if (pageNumber == 2) {
        setNewStatementData([
          statements[6],
          statements[7],
          statements[8],
          statements[9],
          statements[10],
          statements[11],
        ]);
      } else if (pageNumber == 3) {
        setNewStatementData([
          statements[12],
          statements[13],
          statements[14],
          statements[15],
          statements[16],
          statements[17],
        ]);
      } else if (pageNumber == 4) {
        setNewStatementData([
          statements[18],
          statements[19],
          statements[20],
          statements[21],
          statements[22],
          statements[23],
        ]);
      } else if (pageNumber == 5) {
        setNewStatementData([
          statements[24],
          statements[25],
          statements[26],
          statements[27],
          statements[28],
          statements[29],
        ]);
      } else if (pageNumber == 6) {
        setNewStatementData([
          statements[30],
          statements[31],
          statements[32],
          statements[33],
          statements[34],
          statements[35],
        ]);
      } else if (pageNumber == 7) {
        setNewStatementData([
          statements[36],
          statements[37],
          statements[38],
          statements[39],
          statements[40],
          statements[41],
        ]);
      }
      setCurrentPage((prev) => prev + 1);
    }
    scrollChange();
  };

  const pageBackHandler = (pageNumber) => {
    if (pageNumber == 2) {
      setNewStatementData([
        statements[6],
        statements[7],
        statements[8],
        statements[9],
        statements[10],
        statements[11],
      ]);
    } else if (pageNumber == 3) {
      setNewStatementData([
        statements[12],
        statements[13],
        statements[14],
        statements[15],
        statements[16],
        statements[17],
      ]);
    } else if (pageNumber == 4) {
      setNewStatementData([
        statements[18],
        statements[19],
        statements[20],
        statements[21],
        statements[22],
        statements[23],
      ]);
    } else if (pageNumber == 5) {
      setNewStatementData([
        statements[24],
        statements[25],
        statements[26],
        statements[27],
        statements[28],
        statements[29],
      ]);
    } else if (pageNumber == 6) {
      setNewStatementData([
        statements[30],
        statements[31],
        statements[32],
        statements[33],
        statements[34],
        statements[35],
      ]);
    } else if (pageNumber == 7) {
      setNewStatementData([
        statements[36],
        statements[37],
        statements[38],
        statements[39],
        statements[40],
        statements[41],
      ]);
    } else {
      setNewStatementData([
        statements[0],
        statements[1],
        statements[2],
        statements[3],
        statements[4],
        statements[5],
      ]);
    }
    setCurrentPage((prev) => prev - 1);
    scrollChange();
  };

  // const changeTop = () => {
  //   const ele = document.getElementById("order-scroll");
  //   if (ele) {
  //     // console.log(ele);
  //     elementScrollIntoViewPolyfill({ forcePolyfill: true });
  //     // elementScrollIntoViewPolyfill({})
  //     ele.scrollIntoView({ smooth: true });
  //   }
  // };

  const scrollChange = () => {
    // document.getElementById("target1").scrollIntoView();
    const ele = document.getElementById("target1");
    setTimeout(() => {
      if (ele) {
        ele.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  };

  return (
    <>
      <div id="order-scroll"></div>
      <div
        className={`${styles.instructions_wrapper} ${styles.careerintrests_wrapper}`}
      >
        <h3>
          Welcome to our Career Interests Assessment. Please follow these steps
          to complete this assessment effectively :
        </h3>
        <p>
          <span>Step 1 :</span> Read each question carefully and decide how you
          feel about each type of activity. Choose either 'Like' or 'Dislike' to
          indicate your preference.
        </p>
        <p>
          <span> Step 2 :</span> Click the 'Next' button at the bottom of each
          screen to move on to the next section.
        </p>
        <p>
          <span>Step 3 :</span> After completing the assessment, you will
          discover your Interest Profile and its relevance to potential career
          paths.
        </p>
        <p>Let's begin!</p>
      </div>
      <div style={{ position: "relative", bottom: "100px" }} id="target1"></div>
      <div className={styles.inner_wrapper}>
        <h2 className={styles.inner_heading}>
          Career Interest
          {/* <p style={{textAlign:"right"}}>Step {currentPage}</p> */}
          <div className={styles.step_count}>
            <span>
              {" "}
              <a href="#">Step {currentPage} of</a> 7
            </span>
          </div>
        </h2>

        <div className={`${styles.career_block} ${styles.evenOddBg}`}>
          <ul>
            {newStatementData.map((statement, idx) => (
              <li key={statement.id}>
                <div className={styles.question_block}>
                  <span>{statement.id}.</span>{" "}
                  <span>{statement.statement}</span>
                </div>
                <div>
                  <div className={`${styles.choose_option} custom_radio_dash`}>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        // name={`flexRadioDefault${idx}`}
                        id={`flexRadioDefault${idx}`}
                        {...register(`statementChoice${statement.id}`, {
                          required: true,
                        })}
                        value={true}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`flexRadioDefault${idx}`}
                      >
                        Like
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        // name={`flexRadioDefault${idx}`}
                        id={`flexRadioDefaultTWO${idx}`}
                        {...register(`statementChoice${statement.id}`, {
                          required: true,
                        })}
                        value={false}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`flexRadioDefaultTWO${idx}`}
                      >
                        Dislike
                      </label>
                    </div>
                  </div>
                  <div>
                    {errors?.[`statementChoice${statement.id}`] && (
                      <div className="invalid-feedback d-block">
                        This field is required.
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div
          className={`${styles.next_pre_btn} ${
            currentPage == 7 || currentPage >= 2 ? styles.two_btn : ""
          }`}
        >
          {currentPage >= 2 && (
            <button
              type="button"
              className={`${styles.dash_theem_btn} btn btn_hover_blue`}
              // onClick={handleShow}

              onClick={() => {
                pageBackHandler(currentPage - 1);
                // changeTop();
                // scrollChange();
              }}
            >
              Previous Step
            </button>
          )}
          {currentPage == 7 ? (
            <button
              type="button"
              className={`${styles.dash_theem_btn} btn btn_hover_blue`}
              // onClick={handleShow}
              onClick={handleSubmit(onSubmit)}
            >
              Submit
            </button>
          ) : (
            <button
              type="button"
              className={`${styles.dash_theem_btn} btn btn_hover_blue`}
              // onClick={handleShow}

              onClick={() => {
                pageChangeHandler(currentPage + 1);
                // scrollChange();
              }}
            >
              Next Step
            </button>
          )}
        </div>
      </div>
      <Modal
        className="successfull_popup result_modal"
        show={show}
        // onHide={handleClose}
        centered
      >
        <Modal.Body>
          <div className="modal_inner">
            <div className="icon_block">
              <img src="/img/assessment-img-e.png" alt="" />
            </div>
            <h2 className={styles.modal_heading}>Assessment completed</h2>
            <h3>Your Career Interest Profile is</h3>
            <div className={styles.value_top_listing}>
              <ul>
                {topCategories.map((category, idx) => (
                  <li key={category.id}>
                    <div className={styles.value_name}>
                      <span>{idx + 1}.</span>
                      {category.title}
                    </div>
                    <div className={styles.value_img_box}>
                      <img src={`/img/value${idx + 1}.png`} alt="" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.modal_result}>
              Results are added to{" "}
              <Link
                href={`/job-seeker/my-profile/#careerInterests?id=${
                  courseBackId + 1
                }`}
              >
                Profile
              </Link>
            </div>
            <button
              type="submit"
              className="btn-primary w-100"
              onClick={() => {
                router.push(nextLink);
              }}
            >
              Go to Next
            </button>
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
    </>
  );
};

export default CareerInterests;
