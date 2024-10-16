import React, { useEffect } from "react";
import styles from "@/styles/edit_cv_steps.module.css";
import Link from "next/link";
import { useRouter } from "next/router";

const Topbar = () => {
  const router = useRouter();
  const { pathname } = router;

  useEffect(() => {
    let id = "";
    switch (pathname) {
      case "/job-seeker/edit-cv/step1":
        {
          id = "generalInfo";
        }
        break;
      case "/job-seeker/edit-cv/step2":
        {
          id = "education";
        }
        break;
      case "/job-seeker/edit-cv/step3":
        {
          id = "workExp";
        }
        break;
      case "/job-seeker/edit-cv/step4":
        {
          id = "skills";
        }
        break;
      default:
    }

    if (id) {
      const ele = document.getElementById(id);
      if (ele) {
        ele.scrollIntoView();
        window.scroll(0, 0);
      }
    }
  }, [pathname]);

  return (
    <>
      <ul>
        <li id="generalInfo">
          <Link
            href="/job-seeker/edit-cv/step1"
            className={`${
              pathname == "/job-seeker/edit-cv/step1" ? `${styles.active}` : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
            >
              <path
                d="M10.6949 9.9425C10.6693 9.9425 10.6522 9.9425 10.6266 9.9425C10.5839 9.93396 10.5241 9.93396 10.4729 9.9425C7.99738 9.86567 6.12793 7.91939 6.12793 5.52068C6.12793 3.0793 8.11689 1.09033 10.5583 1.09033C12.9997 1.09033 14.9886 3.0793 14.9886 5.52068C14.9801 7.91939 13.1021 9.86567 10.7205 9.9425C10.7119 9.9425 10.7034 9.9425 10.6949 9.9425ZM10.5583 2.37078C8.82541 2.37078 7.40838 3.78781 7.40838 5.52068C7.40838 7.22795 8.74004 8.6023 10.4388 8.66205C10.4815 8.65352 10.601 8.65352 10.7119 8.66205C12.3851 8.58523 13.6996 7.21088 13.7082 5.52068C13.7082 3.78781 12.2912 2.37078 10.5583 2.37078Z"
                fill="Currentcolor"
              />
              <path
                d="M10.7042 19.273C9.03107 19.273 7.34941 18.8462 6.0775 17.9925C4.89095 17.2072 4.24219 16.1316 4.24219 14.9621C4.24219 13.7927 4.89095 12.7085 6.0775 11.9147C8.63839 10.2159 12.787 10.2159 15.3309 11.9147C16.5089 12.7 17.1662 13.7756 17.1662 14.9451C17.1662 16.1145 16.5174 17.1987 15.3309 17.9925C14.0504 18.8462 12.3773 19.273 10.7042 19.273ZM6.78601 12.9902C5.96653 13.5366 5.52264 14.2366 5.52264 14.9707C5.52264 15.6963 5.97506 16.3962 6.78601 16.934C8.91156 18.3596 12.4968 18.3596 14.6224 16.934C15.4418 16.3877 15.8857 15.6877 15.8857 14.9536C15.8857 14.228 15.4333 13.528 14.6224 12.9902C12.4968 11.5732 8.91156 11.5732 6.78601 12.9902Z"
                fill="Currentcolor"
              />
            </svg>
            General Information
            <span className={styles.arrow_next}>
              <i className="far fa-angle-right"></i>
            </span>
          </Link>
        </li>
        <li id="education">
          <Link
            href="/job-seeker/edit-cv/step2"
            className={`${
              pathname == "/job-seeker/edit-cv/step2" ? `${styles.active}` : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
            >
              <path
                d="M9.0161 2.18299L3.87723 5.53777C2.22972 6.61334 2.22972 9.02059 3.87723 10.0962L9.0161 13.4509C9.93802 14.057 11.4575 14.057 12.3794 13.4509L17.4927 10.0962C19.1316 9.02059 19.1316 6.62188 17.4927 5.5463L12.3794 2.19153C11.4575 1.57691 9.93802 1.57691 9.0161 2.18299Z"
                stroke="Currentcolor"
                strokeWidth="1.28045"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.24389 11.189L5.23535 15.1925C5.23535 16.2766 6.07191 17.4376 7.09627 17.779L9.81936 18.6839C10.2889 18.8375 11.0657 18.8375 11.5437 18.6839L14.2668 17.779C15.2911 17.4376 16.1277 16.2766 16.1277 15.1925V11.2316"
                stroke="Currentcolor"
                strokeWidth="1.28045"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.7061 12.8278V7.70605"
                stroke="Currentcolor"
                strokeWidth="1.28045"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Education
            <span className={styles.arrow_next}>
              <i className="far fa-angle-right"></i>
            </span>
          </Link>
        </li>
        <li id="workExp">
          <Link
            href="/job-seeker/edit-cv/step3"
            className={`${
              pathname == "/job-seeker/edit-cv/step3" ? `${styles.active}` : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="21"
              viewBox="0 0 22 21"
              fill="none"
            >
              <path
                d="M7.57607 18.8036H14.4051C17.8367 18.8036 18.4513 17.4293 18.6306 15.7562L19.2708 8.9271C19.5013 6.84424 18.9038 5.14551 15.2588 5.14551H6.72243C3.07742 5.14551 2.47988 6.84424 2.71036 8.9271L3.35058 15.7562C3.52985 17.4293 4.14446 18.8036 7.57607 18.8036Z"
                stroke="Currentcolor"
                strokeWidth="1.28045"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.57617 5.14549V4.46258C7.57617 2.95165 7.57617 1.73096 10.3078 1.73096H11.6736C14.4052 1.73096 14.4052 2.95165 14.4052 4.46258V5.14549"
                stroke="Currentcolor"
                strokeWidth="1.28045"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.6977 11.1212V11.9748C12.6977 11.9834 12.6977 11.9834 12.6977 11.9919C12.6977 12.9224 12.6892 13.6821 10.9905 13.6821C9.30028 13.6821 9.2832 12.9309 9.2832 12.0005V11.1212C9.2832 10.2676 9.2832 10.2676 10.1368 10.2676H11.8441C12.6977 10.2676 12.6977 10.2676 12.6977 11.1212Z"
                stroke="Currentcolor"
                strokeWidth="1.28045"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.2285 9.41406C17.2566 10.8482 15.0031 11.7018 12.6982 11.992"
                stroke="Currentcolor"
                strokeWidth="1.28045"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2.9834 9.64453C4.90407 10.9591 7.0723 11.753 9.28321 12.0006"
                stroke="Currentcolor"
                strokeWidth="1.28045"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Career Insights
            <span className={styles.arrow_next}>
              <i className="far fa-angle-right"></i>
            </span>
          </Link>
        </li>
        <li id="skills">
          <Link
            href="/job-seeker/edit-cv/step4"
            className={`${
              pathname == "/job-seeker/edit-cv/step4" ? `${styles.active}` : ""
            }`}
          >
            <svg
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.3001 12.8277C13.4824 12.8277 16.0621 10.3435 16.0621 7.27908C16.0621 4.21467 13.4824 1.73047 10.3001 1.73047C7.11783 1.73047 4.53809 4.21467 4.53809 7.27908C4.53809 10.3435 7.11783 12.8277 10.3001 12.8277Z"
                stroke="Currentcolor"
                strokeWidth="1.28045"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.47532 11.5643L6.4668 17.8641C6.4668 18.6324 7.00459 19.008 7.67042 18.6921L9.95815 17.608C10.1459 17.5141 10.4618 17.5141 10.6496 17.608L12.9459 18.6921C13.6032 18.9994 14.1495 18.6324 14.1495 17.8641V11.4106"
                stroke="Currentcolor"
                strokeWidth="1.28045"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Skills
            <span className={styles.arrow_next}>
              <i className="far fa-angle-right"></i>
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="/job-seeker/view-cv"
            className={`${
              pathname == "/job-seeker/view-cv" ? `${styles.active}` : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
            >
              <path
                d="M18.2931 5.99912V14.5354C18.2931 17.0963 17.0127 18.8036 14.025 18.8036H7.1959C4.20818 18.8036 2.92773 17.0963 2.92773 14.5354V5.99912C2.92773 3.43822 4.20818 1.73096 7.1959 1.73096H14.025C17.0127 1.73096 18.2931 3.43822 18.2931 5.99912Z"
                stroke="Currentcolor"
                strokeWidth="1.28045"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.7441 3.86523V5.5725C12.7441 6.5115 13.5124 7.27976 14.4514 7.27976H16.1587"
                stroke="Currentcolor"
                strokeWidth="1.28045"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.1958 11.1211H10.6103"
                stroke="Currentcolor"
                strokeWidth="1.28045"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.1958 14.5356H14.0249"
                stroke="Currentcolor"
                strokeWidth="1.28045"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Save & Preview
          </Link>
        </li>
      </ul>
    </>
  );
};

export default Topbar;
