import React from "react";

import EmployerAuth from "@/components/layout/EmployerAuth";
import styles from "@/styles/aptitude_test.module.css"

const AptitudeTest1 = () => {
  return (
    <>
      <EmployerAuth data={{ title: "Aptitude Test" }} />
      <div className="page_container">
        <div className="main_content" id="body_lang_css">
          <div className={styles.page_head}>
              <h2 className={styles.page_title}>Aptitude Test</h2>
              <button className={styles.next_btn}>next</button>
          </div>
          <div className={styles.question_inner_box}>
                <p className={styles.question_title}><span className={styles.question_sub_title}>Question 1</span> of 16</p>
                <p className={styles.question_time}>
                    <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="1" y="1" width="31" height="31" rx="15.5" fill="white" stroke="#2A3858" stroke-width="2"/>
                      <path d="M16.557 18.306L16.85 1.41122L24.2707 3.12578L29.184 7.13669L16.557 18.306Z" fill="#2A3858"/>
                    </svg>
                   5:25             
                </p>
          </div>

          <div className={styles.question_inner_block}>
              <p className={styles.question_inner_track}>   
                    <span className={styles.question_icon} >
                        Q
                    </span>
                    If all soccer players are fit and healthy and if all famous sports players are soccer players, then
              </p>


            <div className={styles.question_ans_box}>
                <div className={styles.ans_list_main}>
                  <input type="radio" name="question_input" className={styles.ans_checkbox} id="question1" />
                    <label className={styles.ans_label} for="question1">
                        <span className={styles.question_number}>A</span>
                        <span className={styles.ans_track}>All soccer players are famous sports people</span>
                    </label>
              </div>

              <div className={styles.ans_list_main}>
                  <input type="radio" name="question_input" className={styles.ans_checkbox} id="question2" />
                    <label className={styles.ans_label} for="question2">
                        <span className={styles.question_number}>b</span>
                        <span className={styles.ans_track}>All famous people are fit and healthy</span>
                    </label>
              </div>
              <div className={styles.ans_list_main}>
                <input type="radio" name="question_input" className={styles.ans_checkbox} checked />
                <label className={styles.ans_label} for="question3">
                    <span className={styles.question_number}>c</span>
                    <span className={styles.ans_track}>All famous sports players are fit and healthy</span>
                </label>
          </div>
          <div className={styles.ans_list_main}>
          <input type="radio" name="question_input" className={styles.ans_checkbox} id="question4" />
          <label className={styles.ans_label} for="question4">
              <span className={styles.question_number}>d</span>
              <span className={styles.ans_track}>All fit and healthy people are soccer players</span>
          </label>
    </div>
    <div className={styles.ans_list_main}>
    <input type="radio" name="question_input" className={styles.ans_checkbox} id="question5" />
    <label className={styles.ans_label} for="question5">
        <span className={styles.question_number}>e</span>
        <span className={styles.ans_track}>All soccer players are men</span>
    </label>
</div>
          </div>
        </div>
        </div>
      </div>


    </>
  );
};

export default AptitudeTest1;
