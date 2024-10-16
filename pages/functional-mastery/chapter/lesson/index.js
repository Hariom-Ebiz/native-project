import React from "react";
import { createAxiosCookies } from "@/fn";
import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import style from "@/styles/lesson.module.css";
import { CircularProgressbar } from "react-circular-progressbar";

const Lesson = () => {
  console.log("this ");
  return (
    <JobSeekerAuth data={{ title: "Course 1" }}>
      <div className="page_container">
        <div className="main_content main_bg" id="body_lang_css">
          <div className={style.lesson_wrapper}>
         
            <ul className={style.lesson_list_block}>
              <li className="theem_progress">
                <div className={style.points_text}>
                  <span className={style.count_box}>1</span>
                </div>
                <div className={style.lesson_details}>
                  <div className={style.lesson_img}>
                    <img src="../img/working.png" alt="working" />
                  </div>
                  <div className={style.lesson_dis}>
                    <h3 className={style.lesson_tittle}>Lesson Name</h3>
                    <p className={style.lesson_text}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Morbi sed lorem tristique, vehicula nulla ac, pellentesque
                      nunc. Donec vel tellus egestas, vestibulum risus et,
                      auctor erat. Mauris nec placerat elit. In hac
                    </p>
                    <div className={style.top_btn}>
                      <a className={style.book_btn} href="javascript:void(0)">
                        <svg
                          width="14"
                          height="18"
                          viewBox="0 0 14 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.76189 1.37562L3.76143 1.37529C3.05852 0.882131 2.3312 0.760807 1.7101 1.10028C1.14118 1.39072 0.81437 2.07032 0.81437 2.8934V15.1292C0.81437 15.9529 1.14166 16.6328 1.71133 16.9229L1.71158 16.923C1.93438 17.0357 2.16234 17.0919 2.43852 17.0919C2.83071 17.0919 3.32182 16.9256 3.75045 16.7069L3.7509 16.7077L3.76192 16.6999L11.9546 10.8761C12.6087 10.4335 12.9981 9.76706 12.9981 9.03571C12.9981 8.30453 12.6088 7.63795 11.9544 7.19935L3.76189 1.37562ZM3.01834 15.6412L3.01816 15.641L3.0123 15.6459C2.70855 15.9024 2.43421 15.9326 2.26688 15.8463L2.26625 15.846C2.18943 15.8072 2.1217 15.7235 2.07279 15.5948C2.0243 15.4672 1.99814 15.3045 1.99814 15.1251V2.88933C1.99814 2.46808 2.10234 2.25281 2.26688 2.16805L2.27985 2.16136L2.29012 2.15099C2.29598 2.14506 2.31209 2.13614 2.34489 2.13062C2.37564 2.12544 2.40773 2.12527 2.43446 2.12527C2.57286 2.12527 2.81767 2.17232 3.06149 2.37327L3.06134 2.37346L3.06669 2.37726L11.2603 8.20171L11.2602 8.20175L11.2626 8.20332C11.5639 8.40377 11.7498 8.70032 11.7498 8.98276L11.7499 8.98507C11.7568 9.26282 11.5718 9.55571 11.2115 9.81703C11.2114 9.81711 11.2113 9.81718 11.2112 9.81726L3.01834 15.6412Z"
                            fill="white"
                            stroke="Currentcolor"
                            stroke-width="0.183759"
                          />
                        </svg>
                        Play
                      </a>
                    </div>
                  </div>
                  <div className={style.chart_block}>
                    <CircularProgressbar value={66} text={`${66}%`} />
                  </div>
                </div>
              </li>
              <li className="brown_progress">
                <div className={style.points_text}>
                  <span className={`${style.count_box} ${style.brown_box}`}>
                    2
                  </span>
                </div>
                <div className={style.lesson_details}>
                  <div className={style.lesson_img}>
                    <img src="../img/working-1.png" alt="working" />
                  </div>
                  <div className={style.lesson_dis}>
                    <h3 className={style.lesson_tittle}>Lesson Name</h3>
                    <p className={style.lesson_text}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Morbi sed lorem tristique, vehicula nulla ac, pellentesque
                      nunc. Donec vel tellus egestas, vestibulum risus et,
                      auctor erat. Mauris nec placerat elit. In hac
                    </p>
                    <div className={style.top_btn}>
                      <a className={style.book_btn} href="javascript:void(0)">
                        <svg
                          width="14"
                          height="18"
                          viewBox="0 0 14 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.76189 1.37562L3.76143 1.37529C3.05852 0.882131 2.3312 0.760807 1.7101 1.10028C1.14118 1.39072 0.81437 2.07032 0.81437 2.8934V15.1292C0.81437 15.9529 1.14166 16.6328 1.71133 16.9229L1.71158 16.923C1.93438 17.0357 2.16234 17.0919 2.43852 17.0919C2.83071 17.0919 3.32182 16.9256 3.75045 16.7069L3.7509 16.7077L3.76192 16.6999L11.9546 10.8761C12.6087 10.4335 12.9981 9.76706 12.9981 9.03571C12.9981 8.30453 12.6088 7.63795 11.9544 7.19935L3.76189 1.37562ZM3.01834 15.6412L3.01816 15.641L3.0123 15.6459C2.70855 15.9024 2.43421 15.9326 2.26688 15.8463L2.26625 15.846C2.18943 15.8072 2.1217 15.7235 2.07279 15.5948C2.0243 15.4672 1.99814 15.3045 1.99814 15.1251V2.88933C1.99814 2.46808 2.10234 2.25281 2.26688 2.16805L2.27985 2.16136L2.29012 2.15099C2.29598 2.14506 2.31209 2.13614 2.34489 2.13062C2.37564 2.12544 2.40773 2.12527 2.43446 2.12527C2.57286 2.12527 2.81767 2.17232 3.06149 2.37327L3.06134 2.37346L3.06669 2.37726L11.2603 8.20171L11.2602 8.20175L11.2626 8.20332C11.5639 8.40377 11.7498 8.70032 11.7498 8.98276L11.7499 8.98507C11.7568 9.26282 11.5718 9.55571 11.2115 9.81703C11.2114 9.81711 11.2113 9.81718 11.2112 9.81726L3.01834 15.6412Z"
                            fill="white"
                            stroke="Currentcolor"
                            stroke-width="0.183759"
                          />
                        </svg>
                        Play
                      </a>
                    </div>
                  </div>
                  <div className={style.chart_block}>
                    <div className={style.chart_block}>
                      <CircularProgressbar
                        value={66}
                        text={`${66}%`}
                        className=""
                      />
                    </div>
                  </div>
                </div>
              </li>
              <li className="theem_blue_progress">
                <div className={style.points_text}>
                  <span className={`${style.count_box} ${style.blue_box}`}>
                    3
                  </span>
                </div>
                <div className={style.lesson_details}>
                  <div className={style.lesson_img}>
                    <img src="../img/working-2.png" alt="working" />
                  </div>
                  <div className={style.lesson_dis}>
                    <h3 className={style.lesson_tittle}>Lesson Name</h3>
                    <p className={style.lesson_text}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Morbi sed lorem tristique, vehicula nulla ac, pellentesque
                      nunc. Donec vel tellus egestas, vestibulum risus et,
                      auctor erat. Mauris nec placerat elit. In hac
                    </p>
                    <div className={style.top_btn}>
                      <a className={style.book_btn} href="javascript:void(0)">
                        <svg
                          width="14"
                          height="18"
                          viewBox="0 0 14 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.76189 1.37562L3.76143 1.37529C3.05852 0.882131 2.3312 0.760807 1.7101 1.10028C1.14118 1.39072 0.81437 2.07032 0.81437 2.8934V15.1292C0.81437 15.9529 1.14166 16.6328 1.71133 16.9229L1.71158 16.923C1.93438 17.0357 2.16234 17.0919 2.43852 17.0919C2.83071 17.0919 3.32182 16.9256 3.75045 16.7069L3.7509 16.7077L3.76192 16.6999L11.9546 10.8761C12.6087 10.4335 12.9981 9.76706 12.9981 9.03571C12.9981 8.30453 12.6088 7.63795 11.9544 7.19935L3.76189 1.37562ZM3.01834 15.6412L3.01816 15.641L3.0123 15.6459C2.70855 15.9024 2.43421 15.9326 2.26688 15.8463L2.26625 15.846C2.18943 15.8072 2.1217 15.7235 2.07279 15.5948C2.0243 15.4672 1.99814 15.3045 1.99814 15.1251V2.88933C1.99814 2.46808 2.10234 2.25281 2.26688 2.16805L2.27985 2.16136L2.29012 2.15099C2.29598 2.14506 2.31209 2.13614 2.34489 2.13062C2.37564 2.12544 2.40773 2.12527 2.43446 2.12527C2.57286 2.12527 2.81767 2.17232 3.06149 2.37327L3.06134 2.37346L3.06669 2.37726L11.2603 8.20171L11.2602 8.20175L11.2626 8.20332C11.5639 8.40377 11.7498 8.70032 11.7498 8.98276L11.7499 8.98507C11.7568 9.26282 11.5718 9.55571 11.2115 9.81703C11.2114 9.81711 11.2113 9.81718 11.2112 9.81726L3.01834 15.6412Z"
                            fill="white"
                            stroke="Currentcolor"
                            stroke-width="0.183759"
                          />
                        </svg>
                        Play
                      </a>
                    </div>
                  </div>
                  <div className={style.chart_block}>
                    <CircularProgressbar value={66} text={`${66}%`} />
                  </div>
                </div>
              </li>
              <li className="yellow_progress">
                <div className={style.points_text}>
                  <span className={`${style.count_box} ${style.yellow_box}`}>
                    4
                  </span>
                </div>
                <div className={style.lesson_details}>
                  <div className={style.lesson_img}>
                    <img src="../img/working-3.png" alt="working" />
                  </div>
                  <div className={style.lesson_dis}>
                    <h3 className={style.lesson_tittle}>Lesson Name</h3>
                    <p className={style.lesson_text}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Morbi sed lorem tristique, vehicula nulla ac, pellentesque
                      nunc. Donec vel tellus egestas, vestibulum risus et,
                      auctor erat. Mauris nec placerat elit. In hac
                    </p>
                    <div className={style.top_btn}>
                      <a className={style.book_btn} href="javascript:void(0)">
                        <svg
                          width="14"
                          height="18"
                          viewBox="0 0 14 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.76189 1.37562L3.76143 1.37529C3.05852 0.882131 2.3312 0.760807 1.7101 1.10028C1.14118 1.39072 0.81437 2.07032 0.81437 2.8934V15.1292C0.81437 15.9529 1.14166 16.6328 1.71133 16.9229L1.71158 16.923C1.93438 17.0357 2.16234 17.0919 2.43852 17.0919C2.83071 17.0919 3.32182 16.9256 3.75045 16.7069L3.7509 16.7077L3.76192 16.6999L11.9546 10.8761C12.6087 10.4335 12.9981 9.76706 12.9981 9.03571C12.9981 8.30453 12.6088 7.63795 11.9544 7.19935L3.76189 1.37562ZM3.01834 15.6412L3.01816 15.641L3.0123 15.6459C2.70855 15.9024 2.43421 15.9326 2.26688 15.8463L2.26625 15.846C2.18943 15.8072 2.1217 15.7235 2.07279 15.5948C2.0243 15.4672 1.99814 15.3045 1.99814 15.1251V2.88933C1.99814 2.46808 2.10234 2.25281 2.26688 2.16805L2.27985 2.16136L2.29012 2.15099C2.29598 2.14506 2.31209 2.13614 2.34489 2.13062C2.37564 2.12544 2.40773 2.12527 2.43446 2.12527C2.57286 2.12527 2.81767 2.17232 3.06149 2.37327L3.06134 2.37346L3.06669 2.37726L11.2603 8.20171L11.2602 8.20175L11.2626 8.20332C11.5639 8.40377 11.7498 8.70032 11.7498 8.98276L11.7499 8.98507C11.7568 9.26282 11.5718 9.55571 11.2115 9.81703C11.2114 9.81711 11.2113 9.81718 11.2112 9.81726L3.01834 15.6412Z"
                            fill="white"
                            stroke="Currentcolor"
                            stroke-width="0.183759"
                          />
                        </svg>
                        Play
                      </a>
                    </div>
                  </div>
                  <div className={style.chart_block}>
                    <CircularProgressbar value={66} text={`${66}%`} />
                  </div>
                </div>
              </li>
              <li className="theem_progress">
                <div className={style.points_text}>
                  <span className={style.count_box}>5</span>
                </div>
                <div className={style.lesson_details}>
                  <div className={style.lesson_img}>
                    <img src="../img/working-4.png" alt="working" />
                  </div>
                  <div className={style.lesson_dis}>
                    <h3 className={style.lesson_tittle}>Lesson Name</h3>
                    <p className={style.lesson_text}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Morbi sed lorem tristique, vehicula nulla ac, pellentesque
                      nunc. Donec vel tellus egestas, vestibulum risus et,
                      auctor erat. Mauris nec placerat elit. In hac
                    </p>
                    <div className={style.top_btn}>
                      <a className={style.book_btn} href="javascript:void(0)">
                        <svg
                          width="14"
                          height="18"
                          viewBox="0 0 14 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.76189 1.37562L3.76143 1.37529C3.05852 0.882131 2.3312 0.760807 1.7101 1.10028C1.14118 1.39072 0.81437 2.07032 0.81437 2.8934V15.1292C0.81437 15.9529 1.14166 16.6328 1.71133 16.9229L1.71158 16.923C1.93438 17.0357 2.16234 17.0919 2.43852 17.0919C2.83071 17.0919 3.32182 16.9256 3.75045 16.7069L3.7509 16.7077L3.76192 16.6999L11.9546 10.8761C12.6087 10.4335 12.9981 9.76706 12.9981 9.03571C12.9981 8.30453 12.6088 7.63795 11.9544 7.19935L3.76189 1.37562ZM3.01834 15.6412L3.01816 15.641L3.0123 15.6459C2.70855 15.9024 2.43421 15.9326 2.26688 15.8463L2.26625 15.846C2.18943 15.8072 2.1217 15.7235 2.07279 15.5948C2.0243 15.4672 1.99814 15.3045 1.99814 15.1251V2.88933C1.99814 2.46808 2.10234 2.25281 2.26688 2.16805L2.27985 2.16136L2.29012 2.15099C2.29598 2.14506 2.31209 2.13614 2.34489 2.13062C2.37564 2.12544 2.40773 2.12527 2.43446 2.12527C2.57286 2.12527 2.81767 2.17232 3.06149 2.37327L3.06134 2.37346L3.06669 2.37726L11.2603 8.20171L11.2602 8.20175L11.2626 8.20332C11.5639 8.40377 11.7498 8.70032 11.7498 8.98276L11.7499 8.98507C11.7568 9.26282 11.5718 9.55571 11.2115 9.81703C11.2114 9.81711 11.2113 9.81718 11.2112 9.81726L3.01834 15.6412Z"
                            fill="white"
                            stroke="Currentcolor"
                            stroke-width="0.183759"
                          />
                        </svg>
                        Play
                      </a>
                    </div>
                  </div>
                  <div className={style.chart_block}>
                    <CircularProgressbar value={66} text={`${66}%`} />
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </JobSeekerAuth>
  );
};

export async function getServerSideProps(context) {
  createAxiosCookies(context);
  return {
    props: {
      isProtected: true,
      roles: [1],
    },
  };
}

export default Lesson;
