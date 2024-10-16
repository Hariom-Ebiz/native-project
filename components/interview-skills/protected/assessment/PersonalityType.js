import React, { useEffect, useState, useRef } from "react";
import styles from "@/styles/assesment.module.css";
import { useRouter } from "next/router";
import Modal from "react-bootstrap/Modal";
import Link from "next/link";
import { elementScrollIntoViewPolyfill } from "seamless-scroll-polyfill";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import useRequest from "@/hooks/useRequest";

const Row = ({
  type,
  idx,
  updateResultHandler,
  updateResultHandlerForReset,
  previousValue,
}) => {
  const [optionsObj, setOptionsObj] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
  });
  const [idsObj, setIdsObj] = useState({});
  const [rowValues, setRowValues] = useState([0, 0, 0, 0]);
  const [selected, setSelected] = useState(0);

  // useEffect(() =>{
  //     if(previousValue){
  //       setOptionsObj({

  //       })
  //     }
  // },[previousValue])

  useEffect(() => {
    if (previousValue) {
      setOptionsObj({
        1: true,
        2: true,
        3: true,
        4: true,
      });

      const idsObj = {};
      type.forEach((t, idx) => {
        idsObj[t.id] = previousValue[idx];
      });
      setIdsObj(idsObj);

      setRowValues(previousValue);
      setSelected(4);
    } else {
      const idsObj = {};
      type.forEach((t) => {
        idsObj[t.id] = null;
      });
      setIdsObj(idsObj);
    }
  }, []);

  useEffect(() => {
    if (selected == 4) {
      updateResultHandler(idx, rowValues);
    }
  }, [selected]);

  const resetHandler = () => {
    if (selected == 4) {
      updateResultHandlerForReset(idx, rowValues);
    }

    const idsObj = {};

    type.forEach((item) => {
      idsObj[item.id] = null;
    });

    setIdsObj(idsObj);
    setOptionsObj({
      1: false,
      2: false,
      3: false,
      4: false,
    });
    setRowValues([0, 0, 0, 0]);
    setSelected(0);
  };

  const selectHandler = (id, value, index) => {
    // setValue(`selected${id}`, +value);

    if (idsObj[id]) {
      const oldValue = idsObj[id];
      setIdsObj((prev) => ({ ...prev, [id]: value }));
      setOptionsObj((prev) => ({ ...prev, [+value]: true, [oldValue]: false }));
    } else {
      setIdsObj((prev) => ({ ...prev, [id]: value }));
      setOptionsObj((prev) => ({ ...prev, [+value]: true }));
      setSelected((prev) => prev + 1);
    }

    const newRowValues = [...rowValues];
    newRowValues[index] = +value;
    setRowValues(newRowValues);

    // if (selected + 1 == 4) {
    //   updateResultHandler(idx, newRowValues);
    // }
  };

  return (
    <>
      {selected > 0 && (
        <button
          className="btn btn-primary "
          style={{ marginLeft: "auto", display: "block" }}
          onClick={resetHandler}
        >
          Reset
        </button>
      )}

      <ul>
        {type.map((obj, index) => (
          <li key={obj.id}>
            <h2>{obj.word.split("~")[0].trim()}</h2>
            <p>{obj.definition}</p>
            <div className={styles.rating_select}>
              <div className="check_item_box size_select_box">
                <div className="form-check">
                  <input
                    className={`form-check-input ${
                      idsObj[obj.id] == "1" ? "radio-checked" : ""
                    }`}
                    type="radio"
                    name="ProSizeselectBox"
                    id={`ProSizeselectBox1${obj.id}`}
                    checked={idsObj[obj.id] == "1"}
                    onChange={(e) =>
                      selectHandler(obj.id, e.target.value, index)
                    }
                    value="1"
                    disabled={optionsObj[1]}
                  />
                  <label
                    className="form-check-label size_box"
                    htmlFor={`ProSizeselectBox1${obj.id}`}
                  >
                    1
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className={`form-check-input ${
                      idsObj[obj.id] == "2" ? "radio-checked" : ""
                    }`}
                    type="radio"
                    name="ProSizeselectBox"
                    id={`ProSizeselectBox2${obj.id}`}
                    checked={idsObj[obj.id] == "2"}
                    onChange={(e) =>
                      selectHandler(obj.id, e.target.value, index)
                    }
                    value="2"
                    disabled={optionsObj[2]}
                  />
                  <label
                    className="form-check-label size_box"
                    htmlFor={`ProSizeselectBox2${obj.id}`}
                  >
                    2
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className={`form-check-input ${
                      idsObj[obj.id] == "3" ? "radio-checked" : ""
                    }`}
                    type="radio"
                    name="ProSizeselectBox"
                    id={`ProSizeselectBox4${obj.id}`}
                    checked={idsObj[obj.id] == "3"}
                    onChange={(e) =>
                      selectHandler(obj.id, e.target.value, index)
                    }
                    value="3"
                    disabled={optionsObj[3]}
                  />
                  <label
                    className="form-check-label size_box"
                    htmlFor={`ProSizeselectBox4${obj.id}`}
                  >
                    3
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className={`form-check-input ${
                      idsObj[obj.id] == "4" ? "radio-checked" : ""
                    }`}
                    type="radio"
                    name="ProSizeselectBox"
                    id={`ProSizeselectBox5${obj.id}`}
                    checked={idsObj[obj.id] == "4"}
                    onChange={(e) =>
                      selectHandler(obj.id, e.target.value, index)
                    }
                    value="4"
                    disabled={optionsObj[4]}
                  />
                  <label
                    className="form-check-label size_box "
                    htmlFor={`ProSizeselectBox5${obj.id}`}
                  >
                    4
                  </label>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

const PersonalityType = ({
  types,
  progressId,
  lessonId,
  nextLink,
  courseBackId,
}) => {
  const [result, setResult] = useState(types.map((t) => false));
  const [columnSum, setColumnSum] = useState([0, 0, 0, 0]);
  const [show, setShow] = useState(false);
  const [personalityType, setPersonalityType] = useState({
    title: "",
    description: [],
  });

  const [newTypes, setNewTypes] = useState(types.slice(0, 4));
  const [currentTypeIdx, setCurrentTypeIdx] = useState(0);
  const [previousValueUpdate, setPreviousValueUpdate] = useState({});
  const containerRef = useRef();
  const router = useRouter();
  const { asPath } = useRouter();

  const { request, response } = useRequest(true);

  // const changeTop = () => {
  //   const ele = document.getElementById("order-scroll");
  //   // window.scrollTo({ top: 0, behavior: "smooth" });
  //   if (ele) {
  //     // console.log(ele);
  //     elementScrollIntoViewPolyfill({ forcePolyfill: true });
  //     ele.scrollIntoView({ smooth: true });
  //   }
  // };

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);
    return () => {
      clearTimeout();
    };
  }, []);

  // const scroll = ()=>{
  //   var ele = document.getElementById("target");
  //   // window.scrollTo(ele.offsetLeft)
  //   // window.scrollTo(ele.offsetTop)
  //   if(ele){
  //     // ele.offsetLeft = ele.offsetLeft
  //     // ele.offsetTop=ele.offsetTop
  //     // console.log("offsetLeft>>>>>",ele.offsetLeft,ele.offsetTop);
  //   }
  //  }

  const scroll = () => {
    var ele = document.getElementById("target");
    var ele1 = document.getElementById("scroll-div");
    // const scrollableDiv = document.querySelector('.scrollable-div');
    let scrollPosition = 0; // Reset the scroll position to 0
    ele1.scrollLeft = scrollPosition;

    ele.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });

    // var ele = document.getElementById("target");
    // ele.scrollTo(0, 0);
  };

  useEffect(() => {
    if (response) {
      if (response.resultToSend) {
        setPersonalityType({
          title: response.resultToSend.title,
          description: JSON.parse(response.resultToSend.description),
        });
      }

      handleShow();
      // router.push(nextLink);
    }
  }, [response]);

  const handleShow = () => setShow(true);

  const onSubmit = () => {
    const traits = ["Supreme", "Logical", "Friendly", "Intuitive"];
    let columnSumFiltered = [];

    columnSum.forEach((c, idx) => {
      if (c >= 40) {
        columnSumFiltered.push({
          sum: c,
          trait: traits[idx],
        });
      }
    });

    if (columnSumFiltered.length < 3) {
      columnSumFiltered = columnSumFiltered
        .sort((a, b) => b.sum - a.sum)
        .map((c) => c.trait)
        .join(",");
    } else {
      columnSumFiltered = columnSumFiltered
        .map((c) => c.trait)
        .sort()
        .join(",");
    }

    const filteredColumn = columnSum.filter((c) => c >= 36 && c <= 44);

    if (filteredColumn.length == 4) {
      columnSumFiltered = traits.sort().join(",");
    }

    request("POST", "assessment-result", {
      type: "personality_type",
      result: columnSumFiltered,
      progressId,
      lessonId,
    });
  };

  const updateResultHandler = (idx, rowValues) => {
    let newResult = [...result];
    newResult[idx] = true;
    setResult(newResult);
    setColumnSum((prev) => prev.map((p, index) => p + rowValues[index]));
    setPreviousValueUpdate((prev) => ({ ...prev, [idx]: rowValues }));
  };

  const updateResultHandlerForReset = (idx, rowValues) => {
    let newResult = [...result];
    newResult[idx] = false;
    setResult(newResult);

    setColumnSum((prev) => prev.map((p, index) => p - rowValues[index]));
  };

  const updateTypeHandler = () => {
    const newTypeIdx = currentTypeIdx + 1;
    setNewTypes(types.slice(newTypeIdx * 4, (newTypeIdx + 1) * 4));
    setCurrentTypeIdx((prev) => prev + 1);
  };

  const isButtonVisible = result.every((a) => a);

  const currentIdxButtonVisible = result
    .slice(currentTypeIdx * 4, (currentTypeIdx + 1) * 4)
    .every((a) => a);

  const previousStep = () => {
    const newTypeIdx = currentTypeIdx - 1;
    setNewTypes(types.slice(newTypeIdx * 4, (newTypeIdx + 1) * 4));
    setCurrentTypeIdx((prev) => prev - 1);
  };

  return (
    <>
      <div id="order-scroll"></div>
      <div
        className={`${styles.instructions_wrapper} ${styles.personalitytype_wrapper}`}
      >
        <h3>
          Welcome to the Personality Assessment. Please follow these steps to
          complete it effectively:
        </h3>
        <p>
          <span>Step 1:</span> You will see 16 sets (rows) of words, with four
          descriptive words accompanied by clarifying definitions. Your
          objective is to utilize these words to describe the way you perceive
          yourself in most situations, with most people, most of the time.
        </p>
        <p>
          <span>Step 2:</span> For each row, assign a number (4, 3, 2, or 1) to
          rank the words based on how well they represent you. Place a '4' next
          to the word that aligns best with you, even if none are a perfect fit.
          Then, assign a '3' to the next-best word, '2' to the one after that,
          and '1' to the word that least describes you.
        </p>
        <p>
          <span>Step 3:</span> It is worth mentioning that you can use each
          number only once per row.
        </p>
        <p>
          <span>Step 4:</span> Click the &#39;Next&#39; button at the bottom of
          each screen to move on to the next section.
        </p>
        <p>
          <span>Step 5:</span> Upon completing the assessment, you will receive
          valuable insights into your personality type &amp; traits.
          <p>
            <span style={{ fontSize: "medium" }}>
              <em>
                <strong>
                  Key Insights for Understanding Your Personality Type
                </strong>
              </em>
            </span>
          </p>
          <p>1. Each of us has all four dimensions, in varying intensities.</p>
          <p>
            2. The higher your score in one of SLFI dimensions, the more likely
            this dimension is influencing the way you perceive, approach, and
            interact with the environment, and vice versa.
          </p>
          <p>Let's begin!</p>
        </p>
      </div>

      <div id="target" style={{ position: "relative", bottom: "100px" }}></div>
      <div className={styles.personality_wrapper}>
        <div className={styles.line_br}></div>
        <div className={` ${styles.inner_block_question}`}>
          <div className={styles.step_count}>
            <span>
              {" "}
              <a href="#">Step {currentTypeIdx + 1} of</a> 4
            </span>
          </div>
          <div
            className={`${styles.evenOddRow} ${styles.mobile_auto}`}
            id="scroll-div"
          >
            {newTypes.map((type, idx) => (
              <div key={type[0].id} className={styles.question_block}>
                <span className={styles.question_count}>
                  {4 * currentTypeIdx + idx + 1}
                </span>
                <Row
                  type={type}
                  idx={4 * currentTypeIdx + idx}
                  updateResultHandler={updateResultHandler}
                  updateResultHandlerForReset={updateResultHandlerForReset}
                  previousValue={previousValueUpdate[4 * currentTypeIdx + idx]}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`${styles.next_pre_btn} ${
          currentTypeIdx > 3 || currentTypeIdx >= 1 ? styles.two_btn : ""
        } mt-4`}
      >
        {currentTypeIdx >= 1 && (
          <button
            type="button"
            className={`${styles.dash_theem_btn} btn`}
            onClick={() => {
              previousStep();
              // changeTop();
              scroll(containerRef.current?.scrollIntoView());
            }}
            // data={console.log(previousValueUpdate)}
          >
            Previous Step
          </button>
        )}
        {currentTypeIdx < 3 && currentIdxButtonVisible && (
          <button
            type="button"
            className={`${styles.dash_theem_btn} btn`}
            onClick={() => {
              updateTypeHandler();
              // changeTop();
              scroll(containerRef.current?.scrollIntoView());
            }}
          >
            Next Step
          </button>
        )}
        {isButtonVisible && currentTypeIdx >= 3 && currentIdxButtonVisible && (
          <button
            type="button"
            className={`${styles.dash_theem_btn} btn`}
            onClick={onSubmit}
          >
            Submit
          </button>
        )}
      </div>

      <Modal
        className="successfull_popup dis_modal"
        show={show}
        centered
        size="lg"
      >
        <Modal.Body>
          <div className="modal_inner">
            <div className="icon_block">
              <img src="/img/4.png" alt="" />
            </div>
            <h2 className={styles.modal_heading}>Assessment completed</h2>
            {/* <h3>{personalityType.title} Personality Type</h3> */}
            {/* <div className={styles.top_bar_box}>
                <h3
                  className={`${styles.card_heading} ${styles.text_blue}`}
                >
                  My Personality Type is
                  
                </h3>
                  <div className={`${styles.value_name} ${styles.text_style}`}>
                    {'"' + personalityType.title + '"' || <>&nbsp;</>}
                  </div>
              </div> */}
            <div className={styles.top_bar_box}>
              <h3 className={`${styles.card_heading} ${styles.text_blue}`}>
                My Personality Type is{" "}
                <span
                  className={`${styles.value_name_second} ${styles.text_style} ${styles.same_font}`}
                >
                  {/* <span>1.</span> */}
                  {'"' + personalityType.title.split("~")[0].trim() + '"' || (
                    <>&nbsp;</>
                  )}
                </span>
              </h3>
              <OverlayTrigger
                delay={{ hide: 450, show: 300 }}
                overlay={(props) => (
                  <Tooltip {...props}>
                    {"" + personalityType.title + "" || <>&nbsp;</>}
                  </Tooltip>
                )}
                placement="top"
              >
                <Button
                  className={`${styles.info_icon} ${styles.other_icon_info}`}
                >
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-info-circle"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                  </svg>
                </Button>
              </OverlayTrigger>
            </div>
            <div className={styles.value_top_listing}>
              {/* <div className={styles.value_name}>{personalityType.title}</div> */}

              {/* <div className="text-start"> */}
              <div className={`${styles.dis_block} ${styles.left_align_dis}`}>
                <ol>
                  {personalityType.description &&
                    personalityType.description.map((val, i) => {
                      return <li key={i}>{val}</li>;
                    })}
                </ol>
              </div>
            </div>

            <div className={styles.modal_result}>
              Results are added to{" "}
              <Link
                href={`/job-seeker/my-profile/#personalityType?id=${
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

export default PersonalityType;
