import React, { useState, useEffect } from "react";
import styles from "@/styles/assesment.module.css";
import { useRouter } from "next/router";
import useRequest from "@/hooks/useRequest";
import Modal from "react-bootstrap/Modal";
import Link from "next/link";

const LifePurpose = ({ progressId, lessonId, nextLink }) => {
  const [purpose, setPurpose] = useState({
    part1: "",
    part2: "",
  });
  const [show, setShow] = useState(false);

  const router = useRouter();
  const { asPath } = useRouter();

  const { request, response } = useRequest(true);

  useEffect(() => {
    if (response) {
      // router.push(nextLink);
      handleShow();
    }
  }, [response]);

  const handleShow = () => setShow(true);

  const onSubmit = () => {
    let combined = `<span>My life purpose is to ${purpose.part1} <u><i>through</i></u> ${purpose.part2}</span>`;
    request("POST", "assessment-result", {
      type: "life_purpose",
      result: combined,
      progressId,
      lessonId,
    });
  };

  const handleChange = (value, name) => {
    setPurpose((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className={styles.instructions_wrapper}>
        {/* <h3>Instructions</h3> */}
        <p>
        In the upcoming Life Purpose statement, you will be guided to complete two distinct parts: the
first one relates to Essence, while the second focuses on Expression.

        </p>
        <p>Let's begin!</p>

        {/* <p>
          There is no limit on how many cards you can place in any one column.
          However we recommend that you try to place some values in each column
          – this will help you to decide what really is most and least important
          to you.
        </p>
        <p>
          We understand that it can sometimes be difficult to decide exactly
          where to place each card and suggest you place it in the 'best fit'
          column. You can change their order and column as many times as you
          like.
        </p> */}
      </div>
      <div className={`${styles.inner_wrapper} ${styles.top_space_wrapper}`}>
        <h2 className={styles.wrapper_heading}>My Life Purpose</h2>
        <label className="m-2">My life purpose is to ....</label>
        <div class="mb-3">
          <textarea
            className="form-control text_aera"
            id="exampleFormControlTextarea1"
            rows="3"
            name="part1"
            placeholder="Some text will be here"
            value={purpose.part1}
            onChange={(e) => handleChange(e.target.value, e.target.name)}
          ></textarea>
        </div>
        <label className="m-2">Through ....</label>
        <div class="mb-3">
          <textarea
            className="form-control text_aera"
            id="exampleFormControlTextarea1"
            rows="3"
            name="part2"
            placeholder="Some text will be here"
            value={purpose.part2}
            onChange={(e) => handleChange(e.target.value, e.target.name)}
          ></textarea>
        </div>
        {/* <div className={`${styles.next_pre_btn} justify-content-start`}>
          <button
            onClick={onSubmit}
            type="button"
            className={`${styles.dash_theem_btn} btn`}
          >
            OK
          </button>
        </div> */}
        {purpose.part1 && purpose.part2 && (
          <div className={`${styles.next_pre_btn} justify-content-end`}>
            <button
              onClick={onSubmit}
              type="button"
              className={`${styles.dash_theem_btn} btn`}
            >
              Submit
            </button>
          </div>
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
              <img src="/img/5.png" alt="" />
            </div>
            <h2 className={styles.modal_heading}>Assessment completed</h2>
            <h3>My Life Purpose</h3>
            <div className={styles.value_top_listing}>
              {/* <div className={styles.value_name}>{personalityType.title}</div> */}
              <div className="text-start">
                {`My life purpose is to ${purpose.part1.replaceAll(
                  ".",
                  ""
                )}`}  <i><u>through</u></i>  {purpose.part2.replaceAll(".", "")}
              </div>
            </div>

            <div className={styles.modal_result}>
              Results are added to{" "}
              <Link href="/job-seeker/my-profile/#lifePurpose">Profile</Link>
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

export default LifePurpose;
