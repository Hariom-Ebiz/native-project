import React from "react";
import EmployerAuth from "@/components/layout/EmployerAuth";
import styles from "../../styles/logical-aptitude-test.module.css";


const LogicalAptitudeTest = () => {
  return (
    <>
      <EmployerAuth data={{ title: "Aptitude Test" }} />
      <div className="page_container">
          <div className="main_content" id="body_lang_css">
                <div className={styles.main_box}>
                    <h2 className={styles.page_title}>What is a logical reasoning test?</h2>
                    <p className={styles.page_des}>
                        A logical reasoning test is an assessment that measures your ability to interpret information, apply logic to solve problems and draw relevant conclusions. The test is timed and in a multiple-choice format.
                    </p>


                    <div className={styles.logical_reasoning_inner}>
                          <h3 className={styles.section_title}>Tips for logical reasoning test</h3>

                          <div className={styles.ans_label}>
                              <span className={styles.question_number}>1</span>
                              <p className={styles.logical_reasoning_items}>Practice before the test</p>
                          </div>

                          <div className={styles.ans_label}>
                          <span className={styles.question_number}>2</span>
                              <p className={styles.logical_reasoning_items}>Prior the start button, make sure you are comfortable, not distracted by mobile, friends or others</p>
                          </div>

                          <div className={styles.ans_label}>
                          <span className={styles.question_number}>3</span>
                              <p className={styles.logical_reasoning_items}>Bring a pencil and a white paper just in case</p>
                          </div>
                    </div>
                </div>
                <div className={styles.btn_track}>
                        <button className={`post_btn ${styles.exam_btn}`}>Start Exam</button>
                    </div>
          </div>
      </div>
    </>
  );
};

export default LogicalAptitudeTest;
