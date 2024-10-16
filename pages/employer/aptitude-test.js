import React from "react";

import EmployerAuth from "@/components/layout/EmployerAuth";
import styles from "@/styles/aptitude_test.module.css"

const AptitudeTest = () => {
  return (
    <>
      <EmployerAuth data={{ title: "Aptitude Test" }} />
      <div className="page_container">
        <div className="main_content" id="body_lang_css">
          <div className={styles.page_head_block}>
              <h2 className={styles.page_title}>Aptitude Test</h2>
          </div>
         <div className={styles.test_main_box}>
          <div className="row gy-4">
              <div className="col-lg-6 col-md-6 ">
                  <div className={styles.test_inner}>
                      <h2 className={styles.section_title}>Logical</h2>
                      <div className={styles.date_box}>
                          <p className={styles.date_track}>Last Test Date : <span>01 Aug 2024 </span> |</p>
                          <p className={styles.date_track}>Next Trial Date :  <span>01 Feb 2025</span> </p>
                      </div>
                      <div className={styles.score_block}>
                          <p className={styles.score_content}>Score : <span className={styles.score_text}>90%</span></p>
                          <button className={`${styles.exam_btn} ${styles.exam_disabled}`}>Take Exam</button>
                      </div>
                 </div>
              </div>
              <div className="col-lg-6 col-md-6 ">
                  <div className={styles.test_inner}>
                      <h2 className={styles.section_title}>Verbal</h2>
                      <div className={styles.date_box}>
                          <p className={styles.date_track}>Test Date : <span>01 Feb 2024 </span> | </p>
                          <p className={styles.date_track}>Next Trial Date  :  <span>01 Aug 2024</span> </p>
                      </div>
                      <div className={styles.score_block}>
                          <p className={styles.score_content}>Score : <span className={styles.score_text}>63%</span></p>
                          <button className={`${styles.exam_btn} ${styles.exam_disabled}`}>Take Exam</button>
                      </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 ">
                  <div className={styles.test_inner}>
                      <h2 className={styles.section_title}>Numerical</h2>
                      <div className={styles.date_box}>
                          <p className={styles.date_track}>Start your test now to know your level. </p>
                      </div>
                      <div className={styles.score_block}>
                          
                          <button className={`${styles.exam_btn} ${styles.exam_active}`}>Take Exam</button>
                      </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 ">
                  <div className={styles.test_inner}>
                      <h2 className={styles.section_title}>Situational</h2>
                      <div className={styles.date_box}>
                          <p className={styles.date_track}>Last Test Date : <span>01 Aug 2024 </span> | </p>
                          <p className={styles.date_track}>Last Test Date :  <span>01 Feb 2025</span> </p>
                      </div>
                      <div className={styles.score_block}>
                          <p className={styles.score_content}>Score : <span className={styles.score_text}>87%</span></p>
                          <button className={`${styles.exam_btn} ${styles.exam_disabled}`}>Take Exam</button>
                      </div>
                </div>
              </div>
          </div>
        </div>
        </div>
      </div>

    </>
  );
};

export default AptitudeTest;
