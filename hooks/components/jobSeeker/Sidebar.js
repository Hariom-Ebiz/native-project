import React, { useRef, useEffect, useState } from "react";
import useOutsideAlerter from "@/hooks/useOutsideAlerter";
import modalStyles from "@/styles/login_signup.module.css";
import { openAuthSidebar, setModal, unsetModal } from "@/store/siteSlice";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

const Sidebar = () => {
  const wrapperRef = useRef(null);

  const [menuState, setMenuState] = useState({
    jobs: false,
    career: false,
  });

  const [lang, setLang] = useState(null);

  const dispatch = useDispatch();
  const { loggedIn, userId, cvStep, firstName, lastName } = useSelector(
    (store) => store.auth
  );
  const router = useRouter();
  const { pathname } = router;
  useOutsideAlerter(wrapperRef);

  useEffect(() => {
    if (
      pathname === "/job-seeker/view-cv" ||
      pathname == "/job-seeker/edit-cv/step1" ||
      pathname == "/job-seeker/edit-cv/step2" ||
      pathname == "/job-seeker/edit-cv/step3" ||
      pathname == "/job-seeker/edit-cv/step4" ||
      pathname == "/job-seeker/edit-cv/step5"
    ) {
      setMenuState({
        jobs: true,
        career: false,
      });
    } else if (
      pathname === "/course" ||
      pathname == "/course/lesson/description/[id]" ||
      pathname == "/course/lesson/[id]"
    ) {
      setMenuState({
        jobs: false,
        career: true,
      });
    } else {
      setMenuState({
        jobs: false,
        career: false,
      });
    }

    if (localStorage.getItem("lang")) {
      setLang(JSON.parse(localStorage.getItem("lang")).code)
    }
  }, [pathname]);

  const ShowPopUp = () => {
    dispatch(
      setModal(
        <>
          <div className="modal_inner">
            <div className={modalStyles.icon_block}>
              <img src="/img/error.png" alt="" />
            </div>
            <h3 className="modal_heading_formate">
              “We are now in the <strong>Testing Phase!</strong> so only{" "}
              <a
                href="#!"
                onClick={() => {
                  router.replace("/course?query=true");
                  dispatch(unsetModal());
                }}
              >
                Career Coaching
              </a>{" "}
              &amp;
              <a
                href="#!"
                onClick={() => {
                  cvStep === 5
                    ? router.replace("/job-seeker/view-cv")
                    : router.replace("/job-seeker/create-cv/step1");
                      dispatch(unsetModal());
                }}
              >
                {" "}
                CV Builder
              </a>{" "}
              sections are currently working”
            </h3>
            <div className="popup_btn_bottom">
              <button
                type="submit"
                // className="link_btn"
                className="btn-primary w-100"
                onClick={() => {
                  router.replace("/course?query=true");
                  dispatch(unsetModal());
                }}
              >
                Career Coaching
              </button>
              <button
                type="submit"
                // className="link_btn"
                className="btn-primary w-100 "
                onClick={() => {
                  cvStep === 5
                    ? router.replace("/job-seeker/view-cv")
                    : router.replace("/job-seeker/create-cv/step1");
                  dispatch(unsetModal());
                }}
              >
                CV Builder
              </button>
            </div>
          </div>
        </>
      )
    );
  };

  return (
    <>
      <div className={`side_nav ${(lang == "AR") ? modalStyles.land_ar : ""}`} ref={wrapperRef} id="body_lang_css">
        <div className="side_nav_inner">
          <ul className="sideNav_menu">
            <li className="dash_nav_item desktop_hide">
              <h5>
                Hello! {firstName} {lastName}
              </h5>
            </li>
            <li className="dash_nav_item">
              <Link
                href="/job-seeker/dashboard"
                onClick={() => dispatch(openAuthSidebar(false))}
                className={`${
                  pathname == "/job-seeker/dashboard" ? "active" : ""
                }`}
              >
                <span className="icon_holder">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_100_12272)">
                      <path
                        d="M5 12H3L12 3L21 12H19"
                        stroke="Currentcolor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5 12V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V12"
                        stroke="Currentcolor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_100_12272">
                        <rect width="24" height="24" fill="Currentcolor" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                <span className="title_dash_nav">Dashboard</span>
              </Link>
            </li>

            <li className="dash_nav_item">
              <Link
                href="/job-seeker/my-profile"
                onClick={() => dispatch(openAuthSidebar(false))}
                className={`${
                  pathname == "/job-seeker/my-profile" ? "active" : ""
                }`}
              >
                <span className="icon_holder svg_icon_size">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-person-circle"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    <path
                      fill-rule="evenodd"
                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                    />
                    <defs>
                      <clipPath id="clip0_100_12272">
                        <rect width="24" height="24" fill="Currentcolor" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                <span className="title_dash_nav">Profile</span>
              </Link>
            </li>

            <li className="dash_nav_item">
              <a
                href="javascript:void(0);"
                // className="subMenuLink collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#historySUbmenu"
                // className={`subMenuLink ${
                //   menuState.jobs ? "active" : "collapsed"
                // }`}
                className={`subMenuLink collapsed`}
              >
                {/*  ${pathname == `/job-seeker/view-cv` ? "active" : ""} */}
                <span className="icon_holder">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7 4C6.73478 4 6.48043 4.10536 6.29289 4.29289C6.10536 4.48043 6 4.73478 6 5V19C6 19.2652 6.10536 19.5196 6.29289 19.7071C6.48043 19.8946 6.73478 20 7 20H17C17.2652 20 17.5196 19.8946 17.7071 19.7071C17.8946 19.5196 18 19.2652 18 19L18 9.41421L12.5859 4.00011L7 4ZM4.87868 2.87868C5.44129 2.31607 6.20435 2 7 2H12.586C13.1163 2.00011 13.6251 2.21086 14.0001 2.58589M14.0001 2.58589L19.414 7.99979C19.414 7.99975 19.414 7.99982 19.414 7.99979C19.789 8.37476 19.9999 8.88345 20 9.41379V19C20 19.7957 19.6839 20.5587 19.1213 21.1213C18.5587 21.6839 17.7957 22 17 22H7C6.20435 22 5.44129 21.6839 4.87868 21.1213C4.31607 20.5587 4 19.7957 4 19V5C4 4.20435 4.31607 3.44129 4.87868 2.87868M8 12C8 11.4477 8.44772 11 9 11H15C15.5523 11 16 11.4477 16 12C16 12.5523 15.5523 13 15 13H9C8.44772 13 8 12.5523 8 12ZM8 16C8 15.4477 8.44772 15 9 15H15C15.5523 15 16 15.4477 16 16C16 16.5523 15.5523 17 15 17H9C8.44772 17 8 16.5523 8 16Z"
                      fill="currentcolor"
                    />
                    <rect
                      x="8"
                      y="11"
                      width="8"
                      height="2"
                      rx="1"
                      fill="currentcolor"
                    />
                    <rect
                      x="8"
                      y="15"
                      width="8"
                      height="2"
                      rx="1"
                      fill="currentcolor"
                    />
                  </svg>
                </span>
                <span className="title_dash_nav">Jobs Gate</span>
                <span className="arrowIconSubmenu"></span>
              </a>
              <ul
                className={`subMenuSide collapse ${
                  menuState.jobs ? "show" : ""
                }`}
                id="historySUbmenu"
              >
                <li>
                  <Link
                    href={
                      cvStep == 5
                        ? `/job-seeker/view-cv`
                        : `/job-seeker/create-cv/step${cvStep ? cvStep : "1"}`
                    }
                    onClick={() => dispatch(openAuthSidebar(false))}
                    className={`${
                      cvStep == 5
                        ? pathname == `/job-seeker/view-cv` ||
                          pathname == `/job-seeker/edit-cv/step1` ||
                          pathname == `/job-seeker/edit-cv/step2` ||
                          pathname == `/job-seeker/edit-cv/step3` ||
                          pathname == `/job-seeker/edit-cv/step4` ||
                          pathname == `/job-seeker/edit-cv/step5`
                          ? "active"
                          : ""
                        : pathname ==
                          `/job-seeker/create-cv/step${cvStep ? cvStep : "1"}`
                        ? "active"
                        : ""
                    }`}
                  >
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <g clipPath="url(#clip0_880_7518)">
                          <path
                            d="M3 21.0003H7L20 8.0003C20.5304 7.46987 20.8284 6.75045 20.8284 6.0003C20.8284 5.25016 20.5304 4.53074 20 4.0003C19.4696 3.46987 18.7501 3.17188 18 3.17188C17.2499 3.17188 16.5304 3.46987 16 4.0003L3 17.0003V21.0003Z"
                            stroke="Currentcolor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14.5 5.5L18.5 9.5"
                            stroke="Currentcolor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 8L7 3L3 7L8 12"
                            stroke="Currentcolor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M7 8L5.5 9.5"
                            stroke="Currentcolor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M16 12L21 17L17 21L12 16"
                            stroke="Currentcolor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M16 17L14.5 18.5"
                            stroke="Currentcolor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_880_7518">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </span>
                    {cvStep === 5 ? (
                      <span className="cv_link">CV Builder</span>
                    ) : (
                      <span className="cv_link">Create CV</span>
                    )}
                  </Link>
                </li>
                <li>
                  <a
                    href="javascript:void(0);"
                    className=""
                    onClick={ShowPopUp}
                  >
                    <span>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="11.7664"
                          cy="11.7659"
                          r="8.98856"
                          stroke="currentcolor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M18.0181 18.4844L21.5421 21.9992"
                          stroke="currentcolor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    Find Jobs{" "}
                  </a>
                </li>
                <li>
                  <a href="#!" className="" onClick={ShowPopUp}>
                    <span>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M7 4C6.73478 4 6.48043 4.10536 6.29289 4.29289C6.10536 4.48043 6 4.73478 6 5V19C6 19.2652 6.10536 19.5196 6.29289 19.7071C6.48043 19.8946 6.73478 20 7 20H17C17.2652 20 17.5196 19.8946 17.7071 19.7071C17.8946 19.5196 18 19.2652 18 19L18 9.41421L12.5859 4.00011L7 4ZM4.87868 2.87868C5.44129 2.31607 6.20435 2 7 2H12.586C13.1163 2.00011 13.6251 2.21086 14.0001 2.58589M14.0001 2.58589L19.414 7.99979C19.414 7.99982 19.414 7.99975 19.414 7.99979C19.789 8.37476 19.9999 8.88345 20 9.41379V19C20 19.7957 19.6839 20.5587 19.1213 21.1213C18.5587 21.6839 17.7957 22 17 22H7C6.20435 22 5.44129 21.6839 4.87868 21.1213C4.31607 20.5587 4 19.7957 4 19V5C4 4.20435 4.31607 3.44129 4.87868 2.87868M8 12C8 11.4477 8.44772 11 9 11H15C15.5523 11 16 11.4477 16 12C16 12.5523 15.5523 13 15 13H9C8.44772 13 8 12.5523 8 12ZM8 16C8 15.4477 8.44772 15 9 15H15C15.5523 15 16 15.4477 16 16C16 16.5523 15.5523 17 15 17H9C8.44772 17 8 16.5523 8 16Z"
                          fill="currentcolor"
                        />
                        <rect
                          x="8"
                          y="11"
                          width="8"
                          height="2"
                          rx="1"
                          fill="currentcolor"
                        />
                        <rect
                          x="8"
                          y="15"
                          width="8"
                          height="2"
                          rx="1"
                          fill="currentcolor"
                        />
                      </svg>{" "}
                    </span>
                    My Applications
                  </a>
                </li>
                
                <li>
                  <a
                    href="javascript:void(0);"
                    className=""
                    onClick={ShowPopUp}
                  >
                    <span>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_880_7530)">
                          <path
                            d="M18 4H6C4.89543 4 4 4.89543 4 6V8C4 9.10457 4.89543 10 6 10H18C19.1046 10 20 9.10457 20 8V6C20 4.89543 19.1046 4 18 4Z"
                            stroke="Currentcolor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M18 14H6C4.89543 14 4 14.8954 4 16V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V16C20 14.8954 19.1046 14 18 14Z"
                            stroke="Currentcolor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_880_7530">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </span>
                    Invitations
                  </a>
                </li>
              </ul>
            </li>

            {/* <li className="dash_nav_item">
              <a
                href="javascript:void(0);"
                className="subMenuLink collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#historySUbmenu1"
              >
                <span className="icon_holder">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M7 4C6.73478 4 6.48043 4.10536 6.29289 4.29289C6.10536 4.48043 6 4.73478 6 5V19C6 19.2652 6.10536 19.5196 6.29289 19.7071C6.48043 19.8946 6.73478 20 7 20H17C17.2652 20 17.5196 19.8946 17.7071 19.7071C17.8946 19.5196 18 19.2652 18 19L18 9.41421L12.5859 4.00011L7 4ZM4.87868 2.87868C5.44129 2.31607 6.20435 2 7 2H12.586C13.1163 2.00011 13.6251 2.21086 14.0001 2.58589M14.0001 2.58589L19.414 7.99979C19.414 7.99975 19.414 7.99982 19.414 7.99979C19.789 8.37476 19.9999 8.88345 20 9.41379V19C20 19.7957 19.6839 20.5587 19.1213 21.1213C18.5587 21.6839 17.7957 22 17 22H7C6.20435 22 5.44129 21.6839 4.87868 21.1213C4.31607 20.5587 4 19.7957 4 19V5C4 4.20435 4.31607 3.44129 4.87868 2.87868M8 12C8 11.4477 8.44772 11 9 11H15C15.5523 11 16 11.4477 16 12C16 12.5523 15.5523 13 15 13H9C8.44772 13 8 12.5523 8 12ZM8 16C8 15.4477 8.44772 15 9 15H15C15.5523 15 16 15.4477 16 16C16 16.5523 15.5523 17 15 17H9C8.44772 17 8 16.5523 8 16Z"
                      fill="currentcolor"
                    />
                    <rect
                      x="8"
                      y="11"
                      width="8"
                      height="2"
                      rx="1"
                      fill="currentcolor"
                    />
                    <rect
                      x="8"
                      y="15"
                      width="8"
                      height="2"
                      rx="1"
                      fill="currentcolor"
                    />
                  </svg>
                </span>
                <span className="title_dash_nav">My CV</span>
                <span className="arrowIconSubmenu"></span>
              </a>
              <ul className="subMenuSide collapse" id="historySUbmenu1">
                <li>
                  <Link
                    href={
                      cvStep == 5
                        ? `/job-seeker/view-cv`
                        : `/job-seeker/create-cv/step${cvStep ? cvStep : "1"}`
                    }
                    className={`${
                      cvStep == 5
                        ? pathname == `/job-seeker/view-cv`
                          ? "active"
                          : ""
                        : pathname ==
                          `/job-seeker/create-cv/step${cvStep ? cvStep : "1"}`
                        ? "active"
                        : ""
                    }`}
                  >
                    <span>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21 13.255C18.1405 14.4112 15.0844 15.0038 12 15C8.817 15 5.78 14.38 3 13.255M12 12H12.01M16 6V4C16 3.46957 15.7893 2.96086 15.4142 2.58579C15.0391 2.21071 14.5304 2 14 2H10C9.46957 2 8.96086 2.21071 8.58579 2.58579C8.21071 2.96086 8 3.46957 8 4V6H16ZM5 20H19C19.5304 20 20.0391 19.7893 20.4142 19.4142C20.7893 19.0391 21 18.5304 21 18V8C21 7.46957 20.7893 6.96086 20.4142 6.58579C20.0391 6.21071 19.5304 6 19 6H5C4.46957 6 3.96086 6.21071 3.58579 6.58579C3.21071 6.96086 3 7.46957 3 8V18C3 18.5304 3.21071 19.0391 3.58579 19.4142C3.96086 19.7893 4.46957 20 5 20Z"
                          stroke="currentcolor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {cvStep === 5 ? (
                      <span>View CV</span>
                    ) : (
                      <span>Create CV</span>
                    )}
                  </Link>
                </li>
                <li>
                  <a href="javascript:void(0);">
                    <span>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21 13.255C18.1405 14.4112 15.0844 15.0038 12 15C8.817 15 5.78 14.38 3 13.255M12 12H12.01M16 6V4C16 3.46957 15.7893 2.96086 15.4142 2.58579C15.0391 2.21071 14.5304 2 14 2H10C9.46957 2 8.96086 2.21071 8.58579 2.58579C8.21071 2.96086 8 3.46957 8 4V6H16ZM5 20H19C19.5304 20 20.0391 19.7893 20.4142 19.4142C20.7893 19.0391 21 18.5304 21 18V8C21 7.46957 20.7893 6.96086 20.4142 6.58579C20.0391 6.21071 19.5304 6 19 6H5C4.46957 6 3.96086 6.21071 3.58579 6.58579C3.21071 6.96086 3 7.46957 3 8V18C3 18.5304 3.21071 19.0391 3.58579 19.4142C3.96086 19.7893 4.46957 20 5 20Z"
                          stroke="currentcolor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    Job Hunting
                  </a>
                </li>
              </ul>
            </li> */}

            <li className="dash_nav_item">
              <a
                href="#!"
                // className={`subMenuLink ${
                //   menuState.career ? "active" : "collapsed"
                // } `}
                className={`subMenuLink collapsed`}
                data-bs-toggle="collapse"
                data-bs-target="#historySUbmenu2"
                // className={`subMenuLink collapsed ${
                //   pathname == `/course` ? "active" : ""
                // }`}
              >
                <span className="icon_holder">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7 4C6.73478 4 6.48043 4.10536 6.29289 4.29289C6.10536 4.48043 6 4.73478 6 5V19C6 19.2652 6.10536 19.5196 6.29289 19.7071C6.48043 19.8946 6.73478 20 7 20H17C17.2652 20 17.5196 19.8946 17.7071 19.7071C17.8946 19.5196 18 19.2652 18 19L18 9.41421L12.5859 4.00011L7 4ZM4.87868 2.87868C5.44129 2.31607 6.20435 2 7 2H12.586C13.1163 2.00011 13.6251 2.21086 14.0001 2.58589M14.0001 2.58589L19.414 7.99979C19.414 7.99975 19.414 7.99982 19.414 7.99979C19.789 8.37476 19.9999 8.88345 20 9.41379V19C20 19.7957 19.6839 20.5587 19.1213 21.1213C18.5587 21.6839 17.7957 22 17 22H7C6.20435 22 5.44129 21.6839 4.87868 21.1213C4.31607 20.5587 4 19.7957 4 19V5C4 4.20435 4.31607 3.44129 4.87868 2.87868M8 12C8 11.4477 8.44772 11 9 11H15C15.5523 11 16 11.4477 16 12C16 12.5523 15.5523 13 15 13H9C8.44772 13 8 12.5523 8 12ZM8 16C8 15.4477 8.44772 15 9 15H15C15.5523 15 16 15.4477 16 16C16 16.5523 15.5523 17 15 17H9C8.44772 17 8 16.5523 8 16Z"
                      fill="currentcolor"
                    />
                    <rect
                      x="8"
                      y="11"
                      width="8"
                      height="2"
                      rx="1"
                      fill="currentcolor"
                    />
                    <rect
                      x="8"
                      y="15"
                      width="8"
                      height="2"
                      rx="1"
                      fill="currentcolor"
                    />
                  </svg>
                </span>
                <span className="title_dash_nav">Career Roadway Gate</span>
                <span className="arrowIconSubmenu"></span>
              </a>
              <ul
                className={`subMenuSide collapse ${
                  menuState.career ? "show" : ""
                }`}
                id="historySUbmenu2"
              >
                <li>
                  <Link
                    href="/course?query=true"
                    onClick={() => dispatch(openAuthSidebar(false))}
                    className={
                      pathname == `/course` ||
                      pathname == "/course/lesson/description/[id]" ||
                      pathname == "/course/lesson/[id]"
                        ? "active"
                        : ""
                    }
                  >
                    <span>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_880_7530)">
                          <path
                            d="M18 4H6C4.89543 4 4 4.89543 4 6V8C4 9.10457 4.89543 10 6 10H18C19.1046 10 20 9.10457 20 8V6C20 4.89543 19.1046 4 18 4Z"
                            stroke="Currentcolor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M18 14H6C4.89543 14 4 14.8954 4 16V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V16C20 14.8954 19.1046 14 18 14Z"
                            stroke="Currentcolor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_880_7530">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </span>
                    Coaching Journey
                  </Link>
                </li>
                <li>
                  <a href="#!" onClick={ShowPopUp}>
                    <span>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_880_7530)">
                          <path
                            d="M18 4H6C4.89543 4 4 4.89543 4 6V8C4 9.10457 4.89543 10 6 10H18C19.1046 10 20 9.10457 20 8V6C20 4.89543 19.1046 4 18 4Z"
                            stroke="Currentcolor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M18 14H6C4.89543 14 4 14.8954 4 16V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V16C20 14.8954 19.1046 14 18 14Z"
                            stroke="Currentcolor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_880_7530">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </span>
                    Standout Journey
                  </a>
                </li>
              </ul>
            </li>

            <li className="dash_nav_item">
              <a href="#!" onClick={ShowPopUp}>
                <span className="icon_holder">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_102_15090)">
                      <path
                        d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                        stroke="currentcolor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 10H9.01"
                        stroke="currentcolor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15 10H15.01"
                        stroke="currentcolor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.5 15C9.82588 15.3326 10.2148 15.5968 10.6441 15.7772C11.0734 15.9576 11.5344 16.0505 12 16.0505C12.4656 16.0505 12.9266 15.9576 13.3559 15.7772C13.7852 15.5968 14.1741 15.3326 14.5 15"
                        stroke="currentcolor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_102_15090">
                        <rect width="24" height="24" fill="currentcolor" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                <span className="title_dash_nav">Community Gate</span>
              </a>
            </li>

            <li className="dash_nav_item">
              <a href="#!" onClick={ShowPopUp}>
                <span className="icon_holder">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17 9V7C17 6.46957 16.7893 5.96086 16.4142 5.58579C16.0391 5.21071 15.5304 5 15 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V13C3 13.5304 3.21071 14.0391 3.58579 14.4142C3.96086 14.7893 4.46957 15 5 15H7M9 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V11C21 10.4696 20.7893 9.96086 20.4142 9.58579C20.0391 9.21071 19.5304 9 19 9H9C8.46957 9 7.96086 9.21071 7.58579 9.58579C7.21071 9.96086 7 10.4696 7 11V17C7 17.5304 7.21071 18.0391 7.58579 18.4142C7.96086 18.7893 8.46957 19 9 19ZM16 14C16 14.5304 15.7893 15.0391 15.4142 15.4142C15.0391 15.7893 14.5304 16 14 16C13.4696 16 12.9609 15.7893 12.5858 15.4142C12.2107 15.0391 12 14.5304 12 14C12 13.4696 12.2107 12.9609 12.5858 12.5858C12.9609 12.2107 13.4696 12 14 12C14.5304 12 15.0391 12.2107 15.4142 12.5858C15.7893 12.9609 16 13.4696 16 14Z"
                      stroke="currentcolor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="title_dash_nav" onClick={ShowPopUp}>
                  Subscription
                </span>
              </a>
            </li>

            <li className="dash_nav_item">
              <a href="#!" onClick={ShowPopUp}>
                <span className="icon_holder">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_102_15098)">
                      <path
                        d="M5 5V21"
                        stroke="currentcolor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M19 5V14"
                        stroke="currentcolor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5 4.9996C5.93464 4.08346 7.19124 3.57031 8.5 3.57031C9.80876 3.57031 11.0654 4.08346 12 4.9996C12.9346 5.91573 14.1912 6.42888 15.5 6.42888C16.8088 6.42888 18.0654 5.91573 19 4.9996"
                        stroke="currentcolor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5 13.9996C5.93464 13.0835 7.19124 12.5703 8.5 12.5703C9.80876 12.5703 11.0654 13.0835 12 13.9996C12.9346 14.9157 14.1912 15.4289 15.5 15.4289C16.8088 15.4289 18.0654 14.9157 19 13.9996"
                        stroke="currentcolor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_102_15098">
                        <rect width="24" height="24" fill="currentcolor" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                <span className="title_dash_nav" >
                  Help/FAQ
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
