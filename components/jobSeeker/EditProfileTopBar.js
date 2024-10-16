import React, { useEffect, useState } from "react";
import styles from "@/styles/editProfileTopbar.module.css";
// import styles from "@/styles/edit_cv_steps.module.css";

import Link from "next/link";
import { useRouter } from "next/router";

const EditProfileTopBar = () => {
  const router = useRouter();
  const { pathname } = router;

  const [lang, setLang] = useState(null);

  useEffect(() => {
    let id = "";
    switch (pathname) {
      case "/employer/edit-profile/step-1":
        {
          id = "generalInfo";
        }
        break;
      case "/employer/edit-profile/step-2":
        {
          id = "education";
        }
        break;
      case "/employer/edit-profile/step-3":
        {
          id = "workExp";
        }
        break;
      case "/employer/edit-profile/step-4":
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

    if (localStorage.getItem("lang")) {
      setLang(JSON.parse(localStorage.getItem("lang")).code)
    }
  }, [pathname]);

  return (
    <>


    <div className={`${styles.step_wrapper} ${styles.bgLight} ${(lang == "AR") ? styles.land_ar : ""}`} id="body_lang_css">
    <ul>
        <li id="generalInfo">
          <Link
            // href="/job-seeker/edit-cv/step1"
            href={'/employer/edit-profile/step-1'}
            className={`${
              pathname == "/employer/edit-profile/step-1" ? `${styles.active}` : ""
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
            Company Media
            <span className={styles.arrow_next}>
            <i className="far fa-angle-right"></i>
          </span>
          </Link>
        </li>
        <li id="education">
          <Link
            href="/employer/edit-profile/step-2"
            className={`${
              pathname == "/employer/edit-profile/step-2" ? `${styles.active}` : ""
            }`}
          >
          <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.63905 18.8027H14.4681C17.8997 18.8027 18.5143 17.4283 18.6936 15.7552L19.3338 8.92612C19.5643 6.84326 18.9668 5.14453 15.3217 5.14453H6.78542C3.14041 5.14453 2.54287 6.84326 2.77335 8.92612L3.41357 15.7552C3.59284 17.4283 4.20745 18.8027 7.63905 18.8027Z" stroke="#515B6F" stroke-width="1.28045" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M7.63916 5.145V4.46209C7.63916 2.95116 7.63916 1.73047 10.3708 1.73047H11.7366C14.4682 1.73047 14.4682 2.95116 14.4682 4.46209V5.145" stroke="#515B6F" stroke-width="1.28045" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12.7607 11.1212V11.9748C12.7607 11.9834 12.7607 11.9834 12.7607 11.9919C12.7607 12.9224 12.7522 13.6821 11.0535 13.6821C9.36326 13.6821 9.34619 12.9309 9.34619 12.0005V11.1212C9.34619 10.2676 9.34619 10.2676 10.1998 10.2676H11.9071C12.7607 10.2676 12.7607 10.2676 12.7607 11.1212Z" stroke="#515B6F" stroke-width="1.28045" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M19.291 9.41406C17.3191 10.8482 15.0656 11.7018 12.7607 11.992" stroke="#515B6F" stroke-width="1.28045" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M3.04688 9.64258C4.96755 10.9572 7.13577 11.751 9.34668 11.9986" stroke="#515B6F" stroke-width="1.28045" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          
            General Information
            <span className={styles.arrow_next}>
              <i className="far fa-angle-right"></i>
            </span>
          </Link>
        </li>
        <li id="workExp">
          <Link
            href="/employer/edit-profile/step-3"
            className={`${
              pathname == "/employer/edit-profile/step-3" ? `${styles.active}` : ""
            }`}
          >
          <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.38329 2.18201L4.24442 5.53679C2.59691 6.61237 2.59691 9.01961 4.24442 10.0952L9.38329 13.45C10.3052 14.056 11.8247 14.056 12.7466 13.45L17.8599 10.0952C19.4988 9.01961 19.4988 6.6209 17.8599 5.54533L12.7466 2.19055C11.8247 1.57593 10.3052 1.57593 9.38329 2.18201Z" stroke="#515B6F" stroke-width="1.28045" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M5.6101 11.1895L5.60156 15.193C5.60156 16.2771 6.43812 17.438 7.46248 17.7795L10.1856 18.6843C10.6551 18.838 11.4319 18.838 11.9099 18.6843L14.633 17.7795C15.6574 17.438 16.4939 16.2771 16.4939 15.193V11.2321" stroke="#515B6F" stroke-width="1.28045" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M19.0718 12.8288V7.70703" stroke="#515B6F" stroke-width="1.28045" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          
            About Company 
            <span className={styles.arrow_next}>
              <i className="far fa-angle-right"></i>
            </span>
          </Link>
        </li>
        <li id="skills">
          <Link
            href="/employer/edit-profile/step-4"
            className={`${
              pathname == "/employer/edit-profile/step-4" ? `${styles.active}` : ""
            }`}
          >
          <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.0418 12.8277C14.2241 12.8277 16.8038 10.3435 16.8038 7.27908C16.8038 4.21467 14.2241 1.73047 11.0418 1.73047C7.85953 1.73047 5.27979 4.21467 5.27979 7.27908C5.27979 10.3435 7.85953 12.8277 11.0418 12.8277Z" stroke="#515B6F" stroke-width="1.28045" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M7.21799 11.5638L7.20947 17.8636C7.20947 18.6319 7.74726 19.0075 8.4131 18.6916L10.7008 17.6075C10.8886 17.5136 11.2045 17.5136 11.3923 17.6075L13.6885 18.6916C14.3458 18.9989 14.8922 18.6319 14.8922 17.8636V11.4102" stroke="#515B6F" stroke-width="1.28045" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          
            Contacts
            <span className={styles.arrow_next}>
              <i className="far fa-angle-right"></i>
            </span>
          </Link>
        </li>
       {/*  <li>
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
        </li>*/}
      </ul>
    </div>
      
    </>
  );
};

export default EditProfileTopBar;
