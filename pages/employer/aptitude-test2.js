import React from "react";
import EmployerAuth from "@/components/layout/EmployerAuth";
import styles from "@/styles/aptitude_test.module.css"

const AptitudeTest2 = () => {
  return (
    <>
      <EmployerAuth data={{ title: "Aptitude Test" }} />
      <div className="page_container">
      <div className="main_content" id="body_lang_css">
      <div className={styles.page_head}>
          <h2 className={styles.page_title}>Aptitude Test</h2>
          <button className={styles.next_btn} data-bs-toggle="modal" data-bs-target="#test_complete_modal" id="question3">next</button>
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

      <div className={`${styles.question_inner_block}`}>
          <p className={styles.question_inner_track}>   
                <span className={styles.question_icon} >
                    Q
                </span>
                How many squares in the 6th shape?
          </p>
      <div className={`${styles.question_ans_box} ${styles.question_img_block}`}>
          <div className={styles.question_img_track}>
              <img src="../img/question_img.png"/>
          </div>
        <div className={styles.question_img_box}>
              <div className={styles.ans_list_main}>
          <input type="radio" name="question_input" className={styles.ans_checkbox} id="question1" />
            <label className={styles.ans_label} for="question1">
                <span className={styles.question_number}>A</span>
                <span className={styles.ans_track}>5</span>
            </label>
              </div>  
              <div className={styles.ans_list_main}>
                  <input type="radio" name="question_input" className={styles.ans_checkbox} id="question2" />
                    <label className={styles.ans_label} for="question2">
                        <span className={styles.question_number}>b</span>
                        <span className={styles.ans_track}>6</span>
                    </label>
              </div>
              <div className={styles.ans_list_main}>
                <input type="radio" name="question_input" className={styles.ans_checkbox} id="question3" checked />
                <label className={styles.ans_label} for="question3">
                    <span className={styles.question_number}>c</span>
                    <span className={styles.ans_track}>7</span>
                </label>
              </div>
              <div className={styles.ans_list_main}>
          <input type="radio" name="question_input" className={styles.ans_checkbox} id="question4" />
          <label className={styles.ans_label} for="question4">
              <span className={styles.question_number}>d</span>
              <span className={styles.ans_track}>8</span>
          </label>
              </div>
              <div className={styles.ans_list_main}>
              <input type="radio" name="question_input" className={styles.ans_checkbox} id="question5" />
              <label className={styles.ans_label} for="question5">
                  <span className={styles.question_number}>e</span>
                  <span className={styles.ans_track}>9</span>
              </label>
              </div>
          </div>
      </div>
      </div>
    </div>
      </div>

      
{/* -------------Modal---------------  */}
<div className="modal fade successfull_popup" id="test_complete_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
<div className={`modal-dialog modal-dialog-centered ${styles.modal_dialog}`}>
  <div className="modal-content">
    <div className={`modal-body ${styles.modal_box}`}>
      <div className={styles.test_complete_box}>
          <div className={styles.icon_box}>
              <svg width="116" height="115" viewBox="0 0 116 115" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="57.9999" cy="57.6134" r="57.0353" fill="#5FA9C0"/>
                  <path d="M80.1167 48.4185L54.9778 73.5575C54.0635 74.4739 52.8242 74.9921 51.5297 74.9993C51.5181 74.9993 51.5066 75 51.4951 75C51.4836 75 51.472 74.9993 51.4604 74.9992C51.3509 74.9982 51.2414 74.9936 51.1322 74.9853C51.0455 74.9791 50.9588 74.9705 50.8721 74.9594C50.7657 74.9463 50.6598 74.9298 50.5545 74.9099C50.5452 74.908 50.5359 74.9056 50.5266 74.9039C50.4178 74.8818 50.3097 74.8561 50.2026 74.8269C50.0965 74.7984 49.9913 74.7664 49.8873 74.7309C49.8801 74.7284 49.8729 74.7264 49.8657 74.7239C49.8513 74.7189 49.8371 74.713 49.8228 74.7078C49.6107 74.6317 49.4042 74.5411 49.2046 74.4365C49.1043 74.3833 49.0058 74.3265 48.9094 74.2664C48.7272 74.1543 48.5525 74.0305 48.3865 73.8955C48.322 73.843 48.2585 73.7885 48.1961 73.7322C48.1337 73.6758 48.0725 73.6176 48.0124 73.5575L35.4425 60.9881C34.5189 60.0645 34 58.8117 34 57.5055C34 56.1992 34.5189 54.9465 35.4426 54.0229C36.3662 53.0992 37.619 52.5803 38.9252 52.5803C40.2314 52.5803 41.4842 53.0993 42.4078 54.0229L51.4948 63.1098L73.1514 41.4531C73.6082 40.9935 74.1513 40.6286 74.7495 40.3792C75.3476 40.1298 75.9891 40.001 76.6372 40C77.2852 39.999 77.9271 40.1259 78.526 40.3735C79.1249 40.621 79.6691 40.9844 80.1273 41.4426C80.5856 41.9008 80.9489 42.445 81.1964 43.0439C81.4439 43.6428 81.5709 44.2847 81.5699 44.9328C81.5689 45.5808 81.44 46.2223 81.1906 46.8205C80.9413 47.4186 80.5763 47.9617 80.1167 48.4185Z" fill="white"/>
              </svg>
          </div>
          <h2 className={styles.modal_title}>Test Completed</h2>
          <p className={styles.modal_description}>Your test has been completed.</p>

          <div className={styles.score_box}>
              <span className={styles.score_track}>Your Score </span>
              <span className={styles.score_track}>50%</span>
          </div>
              <p className={styles.add_results}>Results are added to Profile</p>
          <div className={styles.btn_box}>
              <button className={`post_btn ${styles.pay_now}`}>Go to Profile</button>
          </div>
      </div>
      
    </div>
    
  </div>
</div>
</div>
    </>
  );
};

export default AptitudeTest2;
