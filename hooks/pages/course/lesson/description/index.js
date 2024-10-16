import React from "react";
import { createAxiosCookies } from "@/fn";
import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import style from "@/styles/description.module.css";

const Description = () => {
  return (
    <JobSeekerAuth data={{ title: "Course 1" }}>
      <div className="page_container">
        <div className="main_content main_bg" id="body_lang_css">
          <div className={style.heading_block}>
            <p>
              <a href="javascript:void(0)">
                <svg
                  width="38"
                  height="37"
                  viewBox="0 0 38 37"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_1026_163)">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M6.77734 18.5002C6.77734 17.6487 7.46757 16.9585 8.31901 16.9585H29.9023C30.7538 16.9585 31.444 17.6487 31.444 18.5002C31.444 19.3516 30.7538 20.0418 29.9023 20.0418H8.31901C7.46757 20.0418 6.77734 19.3516 6.77734 18.5002Z"
                      fill="#25324B"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M7.22889 17.41C7.83095 16.808 8.80708 16.808 9.40913 17.41L18.6591 26.66C19.2612 27.2621 19.2612 28.2382 18.6591 28.8403C18.0571 29.4423 17.0809 29.4423 16.4789 28.8403L7.22889 19.5903C6.62683 18.9882 6.62683 18.0121 7.22889 17.41Z"
                      fill="#25324B"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M18.6591 8.16004C19.2612 8.7621 19.2612 9.73823 18.6591 10.3403L9.40913 19.5903C8.80708 20.1923 7.83095 20.1923 7.22889 19.5903C6.62683 18.9882 6.62683 18.0121 7.22889 17.41L16.4789 8.16004C17.0809 7.55798 18.0571 7.55798 18.6591 8.16004Z"
                      fill="#25324B"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1026_163">
                      <rect
                        width="37"
                        height="37"
                        fill="white"
                        transform="translate(0.61084)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </a>
              Build your profile and attract more emploers.{" "}
              <span>Lesson 1</span>
            </p>
            <div className={style.right_block_top}>
              <div className={style.next_btn}>
              <a href="#!">Next</a>
            </div> 
            </div>

          </div>
          <div className={style.main_wrapper}>
            <div className={style.vedio_block}>
              <video width="100%" height="509" controls>
                <source src="/img/demo-vedio.mp4" type="video/mp4" />
              </video>
              <a className={style.play_btn}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-play-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
                </svg>
              </a>
            </div>
          </div>
          <div className={style.vedio_dis}>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Vestibulum laoreet sagittis purus eget rutrum. Vestibulum quam
              risus, ultrices tempus sollicitudin id, aliquet et tortor. Aliquam
              vestibulum vestibulum erat, tempor hendrerit augue bibendum id.
              Nullam in velit dui. Aenean in diam vitae nisi semper suscipit.
              Class aptent taciti sociosqu ad litora torquent per conubia
              nostra, per inceptos himenaeos. Nulla gravida libero non purus
              aliquam, vitae semper mi tempor. Mauris pharetra orci at nibh
              pretium rhoncus. Fusce dignissim hendrerit ipsum, in feugiat
              mauris gravida eget. Phasellus congue nibh dui, sit amet dapibus
              dui mollis eget. Vivamus condimentum rutrum auctor. Nam eget
              aliquam nisl. Proin dignissim libero ut ligula imperdiet, tempor
              suscipit nisl tempus. Suspendisse sollicitudin nec sem in
              eleifend. In non libero placerat, sagittis ipsum nec, aliquam
              turpis. In ac velit nec dui aliquet luctus at vel purus.
              Vestibulum in dolor bibendum, dapibus sem ac, mollis tortor.
              Aliquam vel interdum dolor. Sed quis enim quis neque ornare
              blandit et in risus. Phasellus vitae mauris a libero luctus
              laoreet. Etiam ornare non justo id porttitor. Nunc porttitor
              dignissim tortor, a tristique ante rutrum eget. Morbi elementum
              metus ac velit euismod pulvinar. Nam a neque dolor. Suspendisse
              nec volutpat nibh. Etiam eu risus laoreet, tristique ipsum in,
              tincidunt lacus. Proin malesuada semper ex vitae egestas. Donec
              imperdiet odio ante, quis auctor erat faucibus ac.
            </p>
          </div>
          <div className={style.next_btn}>
            <a href="javascript:void(0)">Next</a>
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

export default Description;
