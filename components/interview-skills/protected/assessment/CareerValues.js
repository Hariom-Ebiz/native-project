import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useRouter } from "next/router";
import Link from "next/link";

import styles from "@/styles/assesment.module.css";
import useDnd from "@/hooks/useDnd2";
import useRequest from "@/hooks/useRequest";

const CareerValues = ({
  values,
  titles,
  bgColours,
  maxLimit,
  nextLink,
  progressId,
  lessonId,
  courseBackId,
}) => {
  const [show, setShow] = useState(false);
  const [alwaysValued, setAlwaysValued] = useState([]);

  const router = useRouter();
  const { asPath } = useRouter();

  const { showNextButton, getUI, columns } = useDnd({
    values: [values, [], [], [], [], []],
    titles,
    bgColours,
    maxLimit,
  });

  const { request } = useRequest(true);

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  // const sortingValues = (arrays) => {
  //   let submitArray = [];
  //   arrays.sort((a, b) => {
  //     return a.content - b.content;
  //   });
  //   console.log(arrays, "lopp");
  // };

  const onSubmit = () => {
    const result = [];

    columns.forEach((column) => {
      const subArr = [];
      column.forEach((c) => {
        subArr.push(+c.id);
      });
      if (subArr.length > 0) {
        result.push(subArr);
      }
    });

    request("POST", "assessment-result", {
      type: "carrer_value",
      result: result,
      progressId,
      lessonId,
    });
    setAlwaysValued(columns[1]);
    handleShow();
  };

  return (
    <>
      <div className={styles.instructions_wrapper}>
        <h3>
          Welcome to our Career Values Assessment. To complete this assessment
          effectively, please follow these instructions
        </h3>
        <p>
          1.<span>Sorting Values: </span>You will find a list of values. Your
          task is to sort these values into five categories based on their
          importance to you as follows:
        </p>
        <ul>
          <li>
            <span>Always Valued:</span> Place the values that are of the utmost
            importance to you in this category.
          </li>
          <li>
            <span>Often Valued:</span> These values are significant to you but
            not as critical as those in the Always Valued category.
          </li>
          <li>
            <span>Sometimes Valued:</span> Values in this category hold some
            importance, although they may not be top priorities.
          </li>
          <li>
            <span>Seldom Valued:</span> Values here are rarely important to you.
          </li>
          <li>
            <span>Never Valued:</span> These are the values you don&#39;t care
            to have or prioritize.
          </li>
        </ul>

        <p>
          2.<span>Reading Descriptions:</span> Before assigning values to
          categories, we strongly recommend reading the description of each
          value carefully to ensure you fully understand its meaning and
          relevance.
        </p>
        <p>
          3.<span>Category Limits:</span> Please note that each category can
          include a maximum of 5 values.
        </p>
        <p>
          4.<span>Top 5 Career Values:</span> Values placed in the 'Always
          Valued' category will represent your 'Top 5 Career Values,' which are
          the most significant to you in a career context.
        </p>
        <p>Let's begin!</p>
      </div>

      <div className={styles.inner_wrapper_corevalue}>
        {/* <h2 className={styles.inner_heading}>Core Values</h2> */}
        {/* <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum laoreet sagittis purus eget rutrum. Vestibulum quam risus, ultrices tempus sollicitudin id, aliquet et tortor. </p> */}
        {getUI()}

        <div className={styles.next_pre_btn}>
          {showNextButton && (
            <button
              type="button"
              className={`${styles.dash_theem_btn} btn`}
              // onClick={handleShow}
              onClick={onSubmit}
            >
              Submit
            </button>
          )}

          <Modal
            className="successfull_popup result_modal"
            show={show}
            // onHide={handleClose}
            centered
          >
            <Modal.Body>
              <div className="modal_inner">
                <div className="icon_block">
                  <img src="/img/assessment-img.png" alt="" />
                </div>
                <h2 className={styles.modal_heading}>Assessment completed</h2>
                <h3>Your Top Career Values are:</h3>
                <div className={styles.value_top_listing}>
                  <ul>
                    {alwaysValued.map((category, idx) => (
                      <li key={category.id}>
                        <div className={styles.value_name}>
                          <span>{idx + 1}.</span>
                          {category.content}
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
                    href={`/job-seeker/my-profile/#carrervalues?id=${
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
        </div>
      </div>
    </>
  );
};

export default CareerValues;
