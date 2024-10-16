import React, { useState ,useEffect} from "react";
import Link from "next/link";
import { createAxiosCookies } from "@/fn";
import styles from "../../styles/applicant_jobs.module.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import ProgressBar from "react-bootstrap/ProgressBar";
import FlagLang from "@/components/FlagLang";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import LogOut from "@/components/logout";
import Dropdown from "react-bootstrap/Dropdown";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { IMAGEBASEURL } from "@/api";

const ManageJobs = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const { companyProfile } = useSelector((store) => store.auth);
  const handleShow = () => setShow(true);
  const dispatch = useDispatch();

  useEffect(() => {
    document.querySelectorAll(".score_title").forEach(function (element) {
      element.addEventListener("click", function () {
        document.querySelectorAll(".score_show_row").forEach(function (row) {
          row.classList.toggle("show_score");
        });
      });
    });
  }, []);

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Reason
    </Tooltip>
  );

  return (
    <>
      <div className="app">
        <div className="dashBoard_overLay"></div>
        <div className="layout">
          <div className="dash_header">
            <div className="dash_logo">
              <Link href="/employer">
                <img src="/img/logo.svg" alt="" />
                <img
                  className="logo_fold"
                  src="/img/dash_logo_icon.png"
                  alt=""
                />
              </Link>
            </div>
            <div className="nav_dash_wrap">
              <div className="nav_dash_wrpLeft">
                <div className="company_info">
                  <span className="company_logo">
                    <img
                      width="50"
                      src={
                        companyProfile?.logo
                          ? `${IMAGEBASEURL}${companyProfile.logo}`
                          : "/img/company_icon.png"
                      }
                      alt=""
                    />
                  </span>
                  <span className="company_details">
                    <span className="company_text">Company</span>
                    <span className="company_coinbase">
                      <div className="btn-group company_coinbase_box">
                        <button
                          className="btn dropdown-toggle"
                          type="button"
                          id="dropdownMenuButton"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          style={{ border: "none" }}
                        >
                          {companyProfile?.company_name}
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-label="dropdownMenuButton"
                        >
                          <li className="text-center">
                            <LogOut />
                          </li>
                        </ul>
                      </div>
                    </span>
                  </span>
                </div>
              </div>

              <div className="nav-dash-right-preant">
                <FlagLang />
                <div className="nav_dash_wrpRight">
                  <a href="#" className="post_btn">
                    <span className="add_icon">
                      <svg
                        width="25"
                        height="24"
                        viewBox="0 0 25 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_103_8011)">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12.5 4C13.0523 4 13.5 4.44772 13.5 5V19C13.5 19.5523 13.0523 20 12.5 20C11.9477 20 11.5 19.5523 11.5 19V5C11.5 4.44772 11.9477 4 12.5 4Z"
                            fill="currentcolor"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.5 12C4.5 11.4477 4.94772 11 5.5 11H19.5C20.0523 11 20.5 11.4477 20.5 12C20.5 12.5523 20.0523 13 19.5 13H5.5C4.94772 13 4.5 12.5523 4.5 12Z"
                            fill="currentcolor"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_103_8011">
                            <rect
                              width="24"
                              height="24"
                              fill="currentcolor"
                              transform="translate(0.5)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </span>
                    <span className="post_btn_text">Post a Job</span>
                  </a>
                  <a href="#" className="dashIconFold" id="foldBtn">
                    <div className="notFolded">
                      <svg
                        viewBox="64 64 896 896"
                        focusable="false"
                        className=""
                        data-icon="menu-fold"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM115.4 518.9L271.7 642c5.8 4.6 14.4.5 14.4-6.9V388.9c0-7.4-8.5-11.5-14.4-6.9L115.4 505.1a8.74 8.74 0 0 0 0 13.8z"></path>
                      </svg>
                    </div>

                    <div className="folded ">
                      <svg
                        viewBox="64 64 896 896"
                        focusable="false"
                        className=""
                        data-icon="menu-unfold"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z"></path>
                      </svg>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="side_nav">
            <div className="side_nav_inner">
              <ul className="sideNav_menu">
                <li className="dash_nav_item">
                  <a href="#" className="active">
                    <span className="icon_holder">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_100_12272)">
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
                  </a>
                </li>
                <li className="dash_nav_item">
                  <a
                    href="#"
                    className="subMenuLink collapsed"
                    data-bs-toggle="collapse"
                    data-bs-target="#historySUbmenu"
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
                    <span className="title_dash_nav">Jobs Gate</span>
                    <span className="arrowIconSubmenu"></span>
                  </a>
                  <ul className="subMenuSide collapse" id="historySUbmenu">
                    <li>
                      <a href="#" className="">
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
                        Start Hiring
                      </a>
                    </li>
                    <li>
                      <a href="#">
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
                        Manage Jobs
                      </a>
                    </li>
                    <li>
                      <a href="#" className="">
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
                        Search CVs{" "}
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <span>
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clip-path="url(#clip0_102_15074)">
                              <path
                                d="M9 5H7C6.46957 5 5.96086 5.21071 5.58579 5.58579C5.21071 5.96086 5 6.46957 5 7V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V7C19 6.46957 18.7893 5.96086 18.4142 5.58579C18.0391 5.21071 17.5304 5 17 5H15"
                                stroke="currentcolor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M13 3H11C9.89543 3 9 3.89543 9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5C15 3.89543 14.1046 3 13 3Z"
                                stroke="currentcolor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M9 12H9.01"
                                stroke="currentcolor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M13 12H15"
                                stroke="currentcolor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M9 16H9.01"
                                stroke="currentcolor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M13 16H15"
                                stroke="currentcolor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_102_15074">
                                <rect
                                  width="24"
                                  height="24"
                                  fill="currentcolor"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                        </span>
                        Database
                      </a>
                    </li>
                    <li>
                      <a href="#">
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
                              d="M12 5C11.4696 5 10.9609 5.21071 10.5858 5.58579C10.2107 5.96086 10 6.46957 10 7C10 7.53043 10.2107 8.03914 10.5858 8.41421C10.9609 8.78929 11.4696 9 12 9C12.5304 9 13.0391 8.78929 13.4142 8.41421C13.7893 8.03914 14 7.53043 14 7C14 6.46957 13.7893 5.96086 13.4142 5.58579C13.0391 5.21071 12.5304 5 12 5ZM9.17157 4.17157C9.92172 3.42143 10.9391 3 12 3C13.0609 3 14.0783 3.42143 14.8284 4.17157C15.5786 4.92172 16 5.93913 16 7C16 8.06087 15.5786 9.07828 14.8284 9.82843C14.0783 10.5786 13.0609 11 12 11C10.9391 11 9.92172 10.5786 9.17157 9.82843C8.42143 9.07828 8 8.06087 8 7C8 5.93913 8.42143 4.92172 9.17157 4.17157ZM5 9C4.73478 9 4.48043 9.10536 4.29289 9.29289C4.10536 9.48043 4 9.73478 4 10C4 10.2652 4.10536 10.5196 4.29289 10.7071C4.48043 10.8946 4.73478 11 5 11C5.26522 11 5.51957 10.8946 5.70711 10.7071C5.89464 10.5196 6 10.2652 6 10C6 9.73478 5.89464 9.48043 5.70711 9.29289C5.51957 9.10536 5.26522 9 5 9ZM2.87868 7.87868C3.44129 7.31607 4.20435 7 5 7C5.79565 7 6.55871 7.31607 7.12132 7.87868C7.68393 8.44129 8 9.20435 8 10C8 10.7956 7.68393 11.5587 7.12132 12.1213C6.55871 12.6839 5.79565 13 5 13C4.20435 13 3.44129 12.6839 2.87868 12.1213C2.31607 11.5587 2 10.7956 2 10C2 9.20435 2.31607 8.44129 2.87868 7.87868ZM19 9C18.7348 9 18.4804 9.10536 18.2929 9.29289C18.1054 9.48043 18 9.73478 18 10C18 10.2652 18.1054 10.5196 18.2929 10.7071C18.4804 10.8946 18.7348 11 19 11C19.2652 11 19.5196 10.8946 19.7071 10.7071C19.8946 10.5196 20 10.2652 20 10C20 9.73478 19.8946 9.48043 19.7071 9.29289C19.5196 9.10536 19.2652 9 19 9ZM16.8787 7.87868C17.4413 7.31607 18.2043 7 19 7C19.7957 7 20.5587 7.31607 21.1213 7.87868C21.6839 8.44129 22 9.20435 22 10C22 10.7957 21.6839 11.5587 21.1213 12.1213C20.5587 12.6839 19.7957 13 19 13C18.2043 13 17.4413 12.6839 16.8787 12.1213C16.3161 11.5587 16 10.7957 16 10C16 9.20435 16.3161 8.44129 16.8787 7.87868ZM12 13.9993C11.2003 13.9993 10.4189 14.2389 9.75658 14.6872C9.13228 15.1098 8.64084 15.6996 8.33765 16.3878L8.09655 19H15.9034L15.6623 16.3878C15.3592 15.6996 14.8677 15.1098 14.2434 14.6872C13.5811 14.2389 12.7997 13.9993 12 13.9993ZM18 19H21V18.0001C21 18 21 18.0001 21 18.0001C21 17.5845 20.8704 17.1791 20.6294 16.8405C20.3884 16.5019 20.0479 16.2467 19.6552 16.1106C19.2625 15.9744 18.8371 15.964 18.4382 16.0808C18.2014 16.1501 17.981 16.2621 17.7871 16.41C17.9262 16.9175 18 17.451 18 18V19ZM16.9298 14.5776C16.51 13.9732 15.9804 13.4479 15.3646 13.031C14.3713 12.3587 13.1994 11.9993 12 11.9993C10.8006 11.9993 9.62867 12.3587 8.63543 13.031C8.01963 13.4479 7.49002 13.9732 7.07024 14.5776C6.77575 14.3995 6.45782 14.2591 6.12365 14.1613C5.32584 13.9278 4.47509 13.9486 3.68967 14.2209C2.90425 14.4932 2.22318 15.0035 1.74115 15.6808C1.25911 16.358 1.00006 17.1686 1 17.9999V20C1 20.5523 1.44772 21 2 21H22C22.5523 21 23 20.5523 23 20V18C22.9999 17.1687 22.7409 16.358 22.2589 15.6808C21.7768 15.0035 21.0958 14.4932 20.3103 14.2209C19.5249 13.9486 18.6742 13.9278 17.8763 14.1613C17.5422 14.2591 17.2242 14.3995 16.9298 14.5776ZM6.21295 16.41C6.01904 16.2621 5.79859 16.1501 5.56183 16.0808C5.16292 15.964 4.73754 15.9744 4.34483 16.1106C3.95212 16.2467 3.61159 16.5019 3.37057 16.8405C3.12957 17.1791 3.00005 17.5844 3 18C3 18 3 18 3 18V19H6V18C6 17.451 6.07383 16.9175 6.21295 16.41Z"
                              fill="currentcolor"
                            />
                          </svg>
                        </span>
                        My Company
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="dash_nav_item">
                  <a href="#">
                    <span className="icon_holder">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_102_15090)">
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
                  <a href="#">
                    <span className="icon_holder">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_102_15098)">
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
                    <span className="title_dash_nav">Help Center</span>
                  </a>
                </li>

                <li className="dash_nav_item">
                  <a href="#">
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
                    <span className="title_dash_nav">Subscription</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="page_container">
            <div
              className={`main_content ${styles.land_ar}`}
              id="body_lang_css"
            >
              <div className={styles.company_message}>
                <div className={styles.company_message_left}>
                  <a href="#" className={styles.morning_text}>
                    <span>
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 40 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_18_25084)">
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M6.6665 19.9997C6.6665 19.0792 7.4127 18.333 8.33317 18.333H31.6665C32.587 18.333 33.3332 19.0792 33.3332 19.9997C33.3332 20.9201 32.587 21.6663 31.6665 21.6663H8.33317C7.4127 21.6663 6.6665 20.9201 6.6665 19.9997Z"
                            fill="#25324B"
                          />
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M7.15466 18.8212C7.80553 18.1703 8.86081 18.1703 9.51168 18.8212L19.5117 28.8212C20.1626 29.472 20.1626 30.5273 19.5117 31.1782C18.8608 31.8291 17.8055 31.8291 17.1547 31.1782L7.15466 21.1782C6.50379 20.5273 6.50379 19.472 7.15466 18.8212Z"
                            fill="#25324B"
                          />
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M19.5117 8.82116C20.1626 9.47204 20.1626 10.5273 19.5117 11.1782L9.51168 21.1782C8.86081 21.8291 7.80553 21.8291 7.15466 21.1782C6.50379 20.5273 6.50379 19.472 7.15466 18.8212L17.1547 8.82116C17.8055 8.17029 18.8608 8.17029 19.5117 8.82116Z"
                            fill="#25324B"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_18_25084">
                            <rect width="40" height="40" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </span>
                    Social Media Assistant
                  </a>
                </div>
                <div className={styles.company_message_right}>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Search Applicants"
                  />
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="11.7666"
                      cy="11.7669"
                      r="8.98856"
                      stroke="#A8ADB7"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M18.0183 18.4854L21.5423 22.0002"
                      stroke="#A8ADB7"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="tabsBlock">
                <Tabs>
                  <Tab eventKey="applicants" title="applicants">
                    <div
                      className={`table-responsive ${styles.social_media_assistant_table}`}
                    >
                      <table className="tabel w-100">
                        <thead>
                          <tr>
                            <th>
                              <div
                                className={`custom_checkbox second_checkbox ${styles.data_group}`}
                              >
                                <input type="checkbox" />
                                <h3 className={styles.table_head_title}>
                                  Full Name
                                  <svg
                                    width="12"
                                    height="18"
                                    viewBox="0 0 12 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M5.82322 16.6772L6 16.8539L6.17678 16.6772L10.5518 12.3022L10.7286 12.1254L10.5518 11.9486L9.67053 11.0674L9.49391 10.8907L9.31713 11.0672L6 14.3784L2.68287 11.0672L2.50609 10.8907L2.32947 11.0674L1.44822 11.9486L1.27145 12.1254L1.44822 12.3022L5.82322 16.6772Z"
                                      fill="#7C8493"
                                      stroke="#7C8493"
                                      stroke-width="0.5"
                                    />
                                    <path
                                      d="M6.17678 1.32322L6 1.14645L5.82322 1.32322L1.44822 5.69822L1.27145 5.875L1.44822 6.05178L2.32947 6.93303L2.50609 7.10964L2.68287 6.93318L6 3.62199L9.31713 6.93318L9.49391 7.10964L9.67053 6.93303L10.5518 6.05178L10.7286 5.875L10.5518 5.69822L6.17678 1.32322Z"
                                      fill="#7C8493"
                                      stroke="#7C8493"
                                      stroke-width="0.5"
                                    />
                                  </svg>
                                </h3>
                              </div>
                            </th>
                            <th className="score_title">
                              <h3 className={`${styles.table_head_title}`}>
                                Score
                                <svg
                                  width="12"
                                  height="18"
                                  viewBox="0 0 12 18"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.82322 16.6772L6 16.8539L6.17678 16.6772L10.5518 12.3022L10.7286 12.1254L10.5518 11.9486L9.67053 11.0674L9.49391 10.8907L9.31713 11.0672L6 14.3784L2.68287 11.0672L2.50609 10.8907L2.32947 11.0674L1.44822 11.9486L1.27145 12.1254L1.44822 12.3022L5.82322 16.6772Z"
                                    fill="#7C8493"
                                    stroke="#7C8493"
                                    stroke-width="0.5"
                                  />
                                  <path
                                    d="M6.17678 1.32322L6 1.14645L5.82322 1.32322L1.44822 5.69822L1.27145 5.875L1.44822 6.05178L2.32947 6.93303L2.50609 7.10964L2.68287 6.93318L6 3.62199L9.31713 6.93318L9.49391 7.10964L9.67053 6.93303L10.5518 6.05178L10.7286 5.875L10.5518 5.69822L6.17678 1.32322Z"
                                    fill="#7C8493"
                                    stroke="#7C8493"
                                    stroke-width="0.5"
                                  />
                                </svg>
                              </h3>
                            </th>
                            <th className="score_show_row">
                              <h3 className={`${styles.table_head_title}`}>
                                Score 1
                                <svg
                                  width="12"
                                  height="18"
                                  viewBox="0 0 12 18"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.82322 16.6772L6 16.8539L6.17678 16.6772L10.5518 12.3022L10.7286 12.1254L10.5518 11.9486L9.67053 11.0674L9.49391 10.8907L9.31713 11.0672L6 14.3784L2.68287 11.0672L2.50609 10.8907L2.32947 11.0674L1.44822 11.9486L1.27145 12.1254L1.44822 12.3022L5.82322 16.6772Z"
                                    fill="#7C8493"
                                    stroke="#7C8493"
                                    stroke-width="0.5"
                                  />
                                  <path
                                    d="M6.17678 1.32322L6 1.14645L5.82322 1.32322L1.44822 5.69822L1.27145 5.875L1.44822 6.05178L2.32947 6.93303L2.50609 7.10964L2.68287 6.93318L6 3.62199L9.31713 6.93318L9.49391 7.10964L9.67053 6.93303L10.5518 6.05178L10.7286 5.875L10.5518 5.69822L6.17678 1.32322Z"
                                    fill="#7C8493"
                                    stroke="#7C8493"
                                    stroke-width="0.5"
                                  />
                                </svg>
                              </h3>
                            </th>
                            <th className="score_show_row">
                              <h3 className={`${styles.table_head_title}`}>
                                Score 2
                                <svg
                                  width="12"
                                  height="18"
                                  viewBox="0 0 12 18"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.82322 16.6772L6 16.8539L6.17678 16.6772L10.5518 12.3022L10.7286 12.1254L10.5518 11.9486L9.67053 11.0674L9.49391 10.8907L9.31713 11.0672L6 14.3784L2.68287 11.0672L2.50609 10.8907L2.32947 11.0674L1.44822 11.9486L1.27145 12.1254L1.44822 12.3022L5.82322 16.6772Z"
                                    fill="#7C8493"
                                    stroke="#7C8493"
                                    stroke-width="0.5"
                                  />
                                  <path
                                    d="M6.17678 1.32322L6 1.14645L5.82322 1.32322L1.44822 5.69822L1.27145 5.875L1.44822 6.05178L2.32947 6.93303L2.50609 7.10964L2.68287 6.93318L6 3.62199L9.31713 6.93318L9.49391 7.10964L9.67053 6.93303L10.5518 6.05178L10.7286 5.875L10.5518 5.69822L6.17678 1.32322Z"
                                    fill="#7C8493"
                                    stroke="#7C8493"
                                    stroke-width="0.5"
                                  />
                                </svg>
                              </h3>
                            </th>

                            <th>
                              <h3 className={`${styles.table_head_title}`}>
                                Hiring Stage
                                <svg
                                  width="12"
                                  height="18"
                                  viewBox="0 0 12 18"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.82322 16.6772L6 16.8539L6.17678 16.6772L10.5518 12.3022L10.7286 12.1254L10.5518 11.9486L9.67053 11.0674L9.49391 10.8907L9.31713 11.0672L6 14.3784L2.68287 11.0672L2.50609 10.8907L2.32947 11.0674L1.44822 11.9486L1.27145 12.1254L1.44822 12.3022L5.82322 16.6772Z"
                                    fill="#7C8493"
                                    stroke="#7C8493"
                                    stroke-width="0.5"
                                  />
                                  <path
                                    d="M6.17678 1.32322L6 1.14645L5.82322 1.32322L1.44822 5.69822L1.27145 5.875L1.44822 6.05178L2.32947 6.93303L2.50609 7.10964L2.68287 6.93318L6 3.62199L9.31713 6.93318L9.49391 7.10964L9.67053 6.93303L10.5518 6.05178L10.7286 5.875L10.5518 5.69822L6.17678 1.32322Z"
                                    fill="#7C8493"
                                    stroke="#7C8493"
                                    stroke-width="0.5"
                                  />
                                </svg>
                              </h3>
                            </th>
                            <th>
                              <h3 className={styles.table_head_title}>
                                Applied Date
                                <svg
                                  width="12"
                                  height="18"
                                  viewBox="0 0 12 18"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.82322 16.6772L6 16.8539L6.17678 16.6772L10.5518 12.3022L10.7286 12.1254L10.5518 11.9486L9.67053 11.0674L9.49391 10.8907L9.31713 11.0672L6 14.3784L2.68287 11.0672L2.50609 10.8907L2.32947 11.0674L1.44822 11.9486L1.27145 12.1254L1.44822 12.3022L5.82322 16.6772Z"
                                    fill="#7C8493"
                                    stroke="#7C8493"
                                    stroke-width="0.5"
                                  />
                                  <path
                                    d="M6.17678 1.32322L6 1.14645L5.82322 1.32322L1.44822 5.69822L1.27145 5.875L1.44822 6.05178L2.32947 6.93303L2.50609 7.10964L2.68287 6.93318L6 3.62199L9.31713 6.93318L9.49391 7.10964L9.67053 6.93303L10.5518 6.05178L10.7286 5.875L10.5518 5.69822L6.17678 1.32322Z"
                                    fill="#7C8493"
                                    stroke="#7C8493"
                                    stroke-width="0.5"
                                  />
                                </svg>
                              </h3>
                            </th>

                            <th>
                              <h3 className={styles.table_head_title}>
                                Action
                                <svg
                                  width="12"
                                  height="18"
                                  viewBox="0 0 12 18"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.82322 16.6772L6 16.8539L6.17678 16.6772L10.5518 12.3022L10.7286 12.1254L10.5518 11.9486L9.67053 11.0674L9.49391 10.8907L9.31713 11.0672L6 14.3784L2.68287 11.0672L2.50609 10.8907L2.32947 11.0674L1.44822 11.9486L1.27145 12.1254L1.44822 12.3022L5.82322 16.6772Z"
                                    fill="#7C8493"
                                    stroke="#7C8493"
                                    stroke-width="0.5"
                                  />
                                  <path
                                    d="M6.17678 1.32322L6 1.14645L5.82322 1.32322L1.44822 5.69822L1.27145 5.875L1.44822 6.05178L2.32947 6.93303L2.50609 7.10964L2.68287 6.93318L6 3.62199L9.31713 6.93318L9.49391 7.10964L9.67053 6.93303L10.5518 6.05178L10.7286 5.875L10.5518 5.69822L6.17678 1.32322Z"
                                    fill="#7C8493"
                                    stroke="#7C8493"
                                    stroke-width="0.5"
                                  />
                                </svg>
                              </h3>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <div
                                className={`custom_checkbox second_checkbox ${styles.data_group}`}
                              >
                                <input type="checkbox" />
                                <h3 className={styles.user_name_text}>
                                  <img
                                    src="/img/user.png"
                                    className={styles.user_img}
                                  />
                                  Jake Gyll
                                </h3>
                              </div>
                            </td>
                            <td>
                              <div className={styles.td_data}>
                                <svg
                                  width="23"
                                  height="21"
                                  viewBox="0 0 23 21"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M11.7927 0.00195312C12.1733 0.00195312 12.521 0.218054 12.6894 0.559392L15.5426 6.34073L21.9221 7.26529C22.299 7.31992 22.6122 7.58388 22.7298 7.94609C22.8474 8.30831 22.7491 8.70589 22.4762 8.97153L17.8532 13.4715L18.9433 19.8259C19.0077 20.2012 18.8533 20.5805 18.5451 20.8042C18.2369 21.0279 17.8284 21.0572 17.4915 20.8796L11.7991 17.88L6.09303 20.8801C5.75611 21.0572 5.34784 21.0277 5.03988 20.804C4.73193 20.5802 4.57771 20.2011 4.64207 19.8259L5.7321 13.4715L1.10916 8.97153C0.836262 8.70589 0.737937 8.30831 0.855563 7.94609C0.973189 7.58388 1.28634 7.31992 1.66324 7.26529L8.04271 6.34073L10.8959 0.559392C11.0644 0.218054 11.412 0.00195312 11.7927 0.00195312ZM11.7927 3.26153L9.60341 7.69751C9.45769 7.99278 9.17596 8.19739 8.8501 8.24461L3.95808 8.9536L7.50418 12.4054C7.74021 12.6351 7.84796 12.9664 7.79227 13.291L6.95587 18.1668L11.3343 15.8648C11.6259 15.7115 11.9744 15.7117 12.2659 15.8653L16.6291 18.1645L15.7931 13.291C15.7374 12.9664 15.8451 12.6351 16.0812 12.4054L19.6273 8.9536L14.7352 8.24461C14.4094 8.19739 14.1277 7.99278 13.9819 7.69751L11.7927 3.26153Z"
                                    fill="#25324B"
                                  />
                                </svg>
                                <span className={styles.td_data_text}>0.0</span>
                              </div>
                            </td>
                            <td className="score_show_row">
                              <div className={styles.td_data}>
                                <svg
                                  width="23"
                                  height="21"
                                  viewBox="0 0 23 21"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M11.7927 0.00195312C12.1733 0.00195312 12.521 0.218054 12.6894 0.559392L15.5426 6.34073L21.9221 7.26529C22.299 7.31992 22.6122 7.58388 22.7298 7.94609C22.8474 8.30831 22.7491 8.70589 22.4762 8.97153L17.8532 13.4715L18.9433 19.8259C19.0077 20.2012 18.8533 20.5805 18.5451 20.8042C18.2369 21.0279 17.8284 21.0572 17.4915 20.8796L11.7991 17.88L6.09303 20.8801C5.75611 21.0572 5.34784 21.0277 5.03988 20.804C4.73193 20.5802 4.57771 20.2011 4.64207 19.8259L5.7321 13.4715L1.10916 8.97153C0.836262 8.70589 0.737937 8.30831 0.855563 7.94609C0.973189 7.58388 1.28634 7.31992 1.66324 7.26529L8.04271 6.34073L10.8959 0.559392C11.0644 0.218054 11.412 0.00195312 11.7927 0.00195312ZM11.7927 3.26153L9.60341 7.69751C9.45769 7.99278 9.17596 8.19739 8.8501 8.24461L3.95808 8.9536L7.50418 12.4054C7.74021 12.6351 7.84796 12.9664 7.79227 13.291L6.95587 18.1668L11.3343 15.8648C11.6259 15.7115 11.9744 15.7117 12.2659 15.8653L16.6291 18.1645L15.7931 13.291C15.7374 12.9664 15.8451 12.6351 16.0812 12.4054L19.6273 8.9536L14.7352 8.24461C14.4094 8.19739 14.1277 7.99278 13.9819 7.69751L11.7927 3.26153Z"
                                    fill="#25324B"
                                  />
                                </svg>
                                <span className={styles.td_data_text}>0.0</span>
                              </div>
                            </td>
                            <td className="score_show_row">
                              <div className={styles.td_data}>
                                <svg
                                  width="23"
                                  height="21"
                                  viewBox="0 0 23 21"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M11.7927 0.00195312C12.1733 0.00195312 12.521 0.218054 12.6894 0.559392L15.5426 6.34073L21.9221 7.26529C22.299 7.31992 22.6122 7.58388 22.7298 7.94609C22.8474 8.30831 22.7491 8.70589 22.4762 8.97153L17.8532 13.4715L18.9433 19.8259C19.0077 20.2012 18.8533 20.5805 18.5451 20.8042C18.2369 21.0279 17.8284 21.0572 17.4915 20.8796L11.7991 17.88L6.09303 20.8801C5.75611 21.0572 5.34784 21.0277 5.03988 20.804C4.73193 20.5802 4.57771 20.2011 4.64207 19.8259L5.7321 13.4715L1.10916 8.97153C0.836262 8.70589 0.737937 8.30831 0.855563 7.94609C0.973189 7.58388 1.28634 7.31992 1.66324 7.26529L8.04271 6.34073L10.8959 0.559392C11.0644 0.218054 11.412 0.00195312 11.7927 0.00195312ZM11.7927 3.26153L9.60341 7.69751C9.45769 7.99278 9.17596 8.19739 8.8501 8.24461L3.95808 8.9536L7.50418 12.4054C7.74021 12.6351 7.84796 12.9664 7.79227 13.291L6.95587 18.1668L11.3343 15.8648C11.6259 15.7115 11.9744 15.7117 12.2659 15.8653L16.6291 18.1645L15.7931 13.291C15.7374 12.9664 15.8451 12.6351 16.0812 12.4054L19.6273 8.9536L14.7352 8.24461C14.4094 8.19739 14.1277 7.99278 13.9819 7.69751L11.7927 3.26153Z"
                                    fill="#25324B"
                                  />
                                </svg>
                                <span className={styles.td_data_text}>0.0</span>
                              </div>
                            </td>

                            <td>
                              <span className={styles.button_track}>
                                Inreview
                              </span>
                            </td>
                            <td>13 July, 2021</td>
                            <td>
                              <div className={styles.application_box}>
                                <button className={styles.application_btn}>
                                  See Application
                                </button>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div
                                className={`custom_checkbox second_checkbox ${styles.data_group}`}
                              >
                                <input type="checkbox" />
                                <h3 className={styles.user_name_text}>
                                  <img
                                    src="/img/user.png"
                                    className={styles.user_img}
                                  />
                                  Guy Hawkins
                                </h3>
                              </div>
                            </td>
                            <td>
                              <div className={styles.td_data}>
                                <svg
                                  width="23"
                                  height="21"
                                  viewBox="0 0 23 21"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M11.7927 0.00195312C12.1733 0.00195312 12.521 0.218054 12.6894 0.559392L15.5426 6.34073L21.9221 7.26529C22.299 7.31992 22.6122 7.58388 22.7298 7.94609C22.8474 8.30831 22.7491 8.70589 22.4762 8.97153L17.8532 13.4715L18.9433 19.8259C19.0077 20.2012 18.8533 20.5805 18.5451 20.8042C18.2369 21.0279 17.8284 21.0572 17.4915 20.8796L11.7991 17.88L6.09303 20.8801C5.75611 21.0572 5.34784 21.0277 5.03988 20.804C4.73193 20.5802 4.57771 20.2011 4.64207 19.8259L5.7321 13.4715L1.10916 8.97153C0.836262 8.70589 0.737937 8.30831 0.855563 7.94609C0.973189 7.58388 1.28634 7.31992 1.66324 7.26529L8.04271 6.34073L10.8959 0.559392C11.0644 0.218054 11.412 0.00195312 11.7927 0.00195312ZM11.7927 3.26153L9.60341 7.69751C9.45769 7.99278 9.17596 8.19739 8.8501 8.24461L3.95808 8.9536L7.50418 12.4054C7.74021 12.6351 7.84796 12.9664 7.79227 13.291L6.95587 18.1668L11.3343 15.8648C11.6259 15.7115 11.9744 15.7117 12.2659 15.8653L16.6291 18.1645L15.7931 13.291C15.7374 12.9664 15.8451 12.6351 16.0812 12.4054L19.6273 8.9536L14.7352 8.24461C14.4094 8.19739 14.1277 7.99278 13.9819 7.69751L11.7927 3.26153Z"
                                    fill="#25324B"
                                  />
                                </svg>
                                <span className={styles.td_data_text}>0.0</span>
                              </div>
                            </td>
                            <td className="score_show_row">
                              <div className={styles.td_data}>
                                <svg
                                  width="23"
                                  height="21"
                                  viewBox="0 0 23 21"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M11.7927 0.00195312C12.1733 0.00195312 12.521 0.218054 12.6894 0.559392L15.5426 6.34073L21.9221 7.26529C22.299 7.31992 22.6122 7.58388 22.7298 7.94609C22.8474 8.30831 22.7491 8.70589 22.4762 8.97153L17.8532 13.4715L18.9433 19.8259C19.0077 20.2012 18.8533 20.5805 18.5451 20.8042C18.2369 21.0279 17.8284 21.0572 17.4915 20.8796L11.7991 17.88L6.09303 20.8801C5.75611 21.0572 5.34784 21.0277 5.03988 20.804C4.73193 20.5802 4.57771 20.2011 4.64207 19.8259L5.7321 13.4715L1.10916 8.97153C0.836262 8.70589 0.737937 8.30831 0.855563 7.94609C0.973189 7.58388 1.28634 7.31992 1.66324 7.26529L8.04271 6.34073L10.8959 0.559392C11.0644 0.218054 11.412 0.00195312 11.7927 0.00195312ZM11.7927 3.26153L9.60341 7.69751C9.45769 7.99278 9.17596 8.19739 8.8501 8.24461L3.95808 8.9536L7.50418 12.4054C7.74021 12.6351 7.84796 12.9664 7.79227 13.291L6.95587 18.1668L11.3343 15.8648C11.6259 15.7115 11.9744 15.7117 12.2659 15.8653L16.6291 18.1645L15.7931 13.291C15.7374 12.9664 15.8451 12.6351 16.0812 12.4054L19.6273 8.9536L14.7352 8.24461C14.4094 8.19739 14.1277 7.99278 13.9819 7.69751L11.7927 3.26153Z"
                                    fill="#25324B"
                                  />
                                </svg>
                                <span className={styles.td_data_text}>0.0</span>
                              </div>
                            </td>
                            <td className="score_show_row">
                              <div className={styles.td_data}>
                                <svg
                                  width="23"
                                  height="21"
                                  viewBox="0 0 23 21"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M11.7927 0.00195312C12.1733 0.00195312 12.521 0.218054 12.6894 0.559392L15.5426 6.34073L21.9221 7.26529C22.299 7.31992 22.6122 7.58388 22.7298 7.94609C22.8474 8.30831 22.7491 8.70589 22.4762 8.97153L17.8532 13.4715L18.9433 19.8259C19.0077 20.2012 18.8533 20.5805 18.5451 20.8042C18.2369 21.0279 17.8284 21.0572 17.4915 20.8796L11.7991 17.88L6.09303 20.8801C5.75611 21.0572 5.34784 21.0277 5.03988 20.804C4.73193 20.5802 4.57771 20.2011 4.64207 19.8259L5.7321 13.4715L1.10916 8.97153C0.836262 8.70589 0.737937 8.30831 0.855563 7.94609C0.973189 7.58388 1.28634 7.31992 1.66324 7.26529L8.04271 6.34073L10.8959 0.559392C11.0644 0.218054 11.412 0.00195312 11.7927 0.00195312ZM11.7927 3.26153L9.60341 7.69751C9.45769 7.99278 9.17596 8.19739 8.8501 8.24461L3.95808 8.9536L7.50418 12.4054C7.74021 12.6351 7.84796 12.9664 7.79227 13.291L6.95587 18.1668L11.3343 15.8648C11.6259 15.7115 11.9744 15.7117 12.2659 15.8653L16.6291 18.1645L15.7931 13.291C15.7374 12.9664 15.8451 12.6351 16.0812 12.4054L19.6273 8.9536L14.7352 8.24461C14.4094 8.19739 14.1277 7.99278 13.9819 7.69751L11.7927 3.26153Z"
                                    fill="#25324B"
                                  />
                                </svg>
                                <span className={styles.td_data_text}>0.0</span>
                              </div>
                            </td>
                            <td>
                              <span className={styles.button_track}>
                                Inreview
                              </span>
                            </td>
                            <td>13 July, 2021</td>
                            <td>
                              <div className={styles.application_box}>
                                <button className={styles.application_btn}>
                                  See Application
                                </button>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div
                                className={`custom_checkbox second_checkbox ${styles.data_group}`}
                              >
                                <input type="checkbox" />
                                <h3 className={styles.user_name_text}>
                                  <img
                                    src="/img/user.png"
                                    className={styles.user_img}
                                  />
                                  Cyndy Lillibridge
                                </h3>
                              </div>
                            </td>
                            <td>
                              <div className={styles.td_data}>
                                <svg
                                  width="21"
                                  height="20"
                                  viewBox="0 0 21 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M20.0834 7.27559L14.1326 6.41075L11.4724 1.01778C11.3998 0.870126 11.2803 0.750595 11.1326 0.677938C10.7623 0.495126 10.3123 0.64747 10.1271 1.01778L7.46697 6.41075L1.51619 7.27559C1.35213 7.29903 1.20213 7.37638 1.08729 7.49356C0.948448 7.63627 0.871941 7.82825 0.874578 8.02733C0.877215 8.22642 0.958779 8.41631 1.10135 8.55528L5.40682 12.7529L4.38963 18.6803C4.36578 18.8182 4.38104 18.96 4.43368 19.0896C4.48631 19.2193 4.57423 19.3316 4.68745 19.4138C4.80067 19.496 4.93466 19.5449 5.07424 19.5549C5.21382 19.5648 5.35339 19.5355 5.47713 19.4701L10.7998 16.6717L16.1224 19.4701C16.2678 19.5475 16.4365 19.5732 16.5982 19.5451C17.006 19.4748 17.2803 19.0881 17.2099 18.6803L16.1928 12.7529L20.4982 8.55528C20.6154 8.44044 20.6928 8.29044 20.7162 8.12638C20.7795 7.71622 20.4935 7.33653 20.0834 7.27559Z"
                                    fill="#F3CF5B"
                                  />
                                </svg>

                                <span className={styles.td_data_text}>4.5</span>
                              </div>
                            </td>
                            <td className="score_show_row">
                              <div className={styles.td_data}>
                                <svg
                                  width="21"
                                  height="20"
                                  viewBox="0 0 21 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M20.0834 7.27559L14.1326 6.41075L11.4724 1.01778C11.3998 0.870126 11.2803 0.750595 11.1326 0.677938C10.7623 0.495126 10.3123 0.64747 10.1271 1.01778L7.46697 6.41075L1.51619 7.27559C1.35213 7.29903 1.20213 7.37638 1.08729 7.49356C0.948448 7.63627 0.871941 7.82825 0.874578 8.02733C0.877215 8.22642 0.958779 8.41631 1.10135 8.55528L5.40682 12.7529L4.38963 18.6803C4.36578 18.8182 4.38104 18.96 4.43368 19.0896C4.48631 19.2193 4.57423 19.3316 4.68745 19.4138C4.80067 19.496 4.93466 19.5449 5.07424 19.5549C5.21382 19.5648 5.35339 19.5355 5.47713 19.4701L10.7998 16.6717L16.1224 19.4701C16.2678 19.5475 16.4365 19.5732 16.5982 19.5451C17.006 19.4748 17.2803 19.0881 17.2099 18.6803L16.1928 12.7529L20.4982 8.55528C20.6154 8.44044 20.6928 8.29044 20.7162 8.12638C20.7795 7.71622 20.4935 7.33653 20.0834 7.27559Z"
                                    fill="#F3CF5B"
                                  />
                                </svg>

                                <span className={styles.td_data_text}>4.5</span>
                              </div>
                            </td>
                            <td className="score_show_row">
                              <div className={styles.td_data}>
                                <svg
                                  width="21"
                                  height="20"
                                  viewBox="0 0 21 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M20.0834 7.27559L14.1326 6.41075L11.4724 1.01778C11.3998 0.870126 11.2803 0.750595 11.1326 0.677938C10.7623 0.495126 10.3123 0.64747 10.1271 1.01778L7.46697 6.41075L1.51619 7.27559C1.35213 7.29903 1.20213 7.37638 1.08729 7.49356C0.948448 7.63627 0.871941 7.82825 0.874578 8.02733C0.877215 8.22642 0.958779 8.41631 1.10135 8.55528L5.40682 12.7529L4.38963 18.6803C4.36578 18.8182 4.38104 18.96 4.43368 19.0896C4.48631 19.2193 4.57423 19.3316 4.68745 19.4138C4.80067 19.496 4.93466 19.5449 5.07424 19.5549C5.21382 19.5648 5.35339 19.5355 5.47713 19.4701L10.7998 16.6717L16.1224 19.4701C16.2678 19.5475 16.4365 19.5732 16.5982 19.5451C17.006 19.4748 17.2803 19.0881 17.2099 18.6803L16.1928 12.7529L20.4982 8.55528C20.6154 8.44044 20.6928 8.29044 20.7162 8.12638C20.7795 7.71622 20.4935 7.33653 20.0834 7.27559Z"
                                    fill="#F3CF5B"
                                  />
                                </svg>

                                <span className={styles.td_data_text}>4.5</span>
                              </div>
                            </td>

                            <td>
                              <span
                                className={` ${styles.button_track} ${styles.dark_btn}`}
                              >
                                Shortlisted
                              </span>
                            </td>
                            <td>13 July, 2021</td>
                            <td>
                              <div className={styles.application_box}>
                                <button className={styles.application_btn}>
                                  See Application
                                </button>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div
                                className={`custom_checkbox second_checkbox ${styles.data_group}`}
                              >
                                <input type="checkbox" />
                                <h3 className={styles.user_name_text}>
                                  <img
                                    src="/img/user.png"
                                    className={styles.user_img}
                                  />
                                  Rodolfo Goode
                                </h3>
                              </div>
                            </td>
                            <td>
                              <div className={styles.td_data}>
                                <svg
                                  width="21"
                                  height="20"
                                  viewBox="0 0 21 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M20.0834 7.27559L14.1326 6.41075L11.4724 1.01778C11.3998 0.870126 11.2803 0.750595 11.1326 0.677938C10.7623 0.495126 10.3123 0.64747 10.1271 1.01778L7.46697 6.41075L1.51619 7.27559C1.35213 7.29903 1.20213 7.37638 1.08729 7.49356C0.948448 7.63627 0.871941 7.82825 0.874578 8.02733C0.877215 8.22642 0.958779 8.41631 1.10135 8.55528L5.40682 12.7529L4.38963 18.6803C4.36578 18.8182 4.38104 18.96 4.43368 19.0896C4.48631 19.2193 4.57423 19.3316 4.68745 19.4138C4.80067 19.496 4.93466 19.5449 5.07424 19.5549C5.21382 19.5648 5.35339 19.5355 5.47713 19.4701L10.7998 16.6717L16.1224 19.4701C16.2678 19.5475 16.4365 19.5732 16.5982 19.5451C17.006 19.4748 17.2803 19.0881 17.2099 18.6803L16.1928 12.7529L20.4982 8.55528C20.6154 8.44044 20.6928 8.29044 20.7162 8.12638C20.7795 7.71622 20.4935 7.33653 20.0834 7.27559Z"
                                    fill="#F3CF5B"
                                  />
                                </svg>

                                <span className={styles.td_data_text}>
                                  3.75
                                </span>
                              </div>
                            </td>
                            <td className="score_show_row">
                              <div className={styles.td_data}>
                                <svg
                                  width="21"
                                  height="20"
                                  viewBox="0 0 21 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M20.0834 7.27559L14.1326 6.41075L11.4724 1.01778C11.3998 0.870126 11.2803 0.750595 11.1326 0.677938C10.7623 0.495126 10.3123 0.64747 10.1271 1.01778L7.46697 6.41075L1.51619 7.27559C1.35213 7.29903 1.20213 7.37638 1.08729 7.49356C0.948448 7.63627 0.871941 7.82825 0.874578 8.02733C0.877215 8.22642 0.958779 8.41631 1.10135 8.55528L5.40682 12.7529L4.38963 18.6803C4.36578 18.8182 4.38104 18.96 4.43368 19.0896C4.48631 19.2193 4.57423 19.3316 4.68745 19.4138C4.80067 19.496 4.93466 19.5449 5.07424 19.5549C5.21382 19.5648 5.35339 19.5355 5.47713 19.4701L10.7998 16.6717L16.1224 19.4701C16.2678 19.5475 16.4365 19.5732 16.5982 19.5451C17.006 19.4748 17.2803 19.0881 17.2099 18.6803L16.1928 12.7529L20.4982 8.55528C20.6154 8.44044 20.6928 8.29044 20.7162 8.12638C20.7795 7.71622 20.4935 7.33653 20.0834 7.27559Z"
                                    fill="#F3CF5B"
                                  />
                                </svg>

                                <span className={styles.td_data_text}>
                                  3.75
                                </span>
                              </div>
                            </td>
                            <td className="score_show_row">
                              <div className={styles.td_data}>
                                <svg
                                  width="21"
                                  height="20"
                                  viewBox="0 0 21 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M20.0834 7.27559L14.1326 6.41075L11.4724 1.01778C11.3998 0.870126 11.2803 0.750595 11.1326 0.677938C10.7623 0.495126 10.3123 0.64747 10.1271 1.01778L7.46697 6.41075L1.51619 7.27559C1.35213 7.29903 1.20213 7.37638 1.08729 7.49356C0.948448 7.63627 0.871941 7.82825 0.874578 8.02733C0.877215 8.22642 0.958779 8.41631 1.10135 8.55528L5.40682 12.7529L4.38963 18.6803C4.36578 18.8182 4.38104 18.96 4.43368 19.0896C4.48631 19.2193 4.57423 19.3316 4.68745 19.4138C4.80067 19.496 4.93466 19.5449 5.07424 19.5549C5.21382 19.5648 5.35339 19.5355 5.47713 19.4701L10.7998 16.6717L16.1224 19.4701C16.2678 19.5475 16.4365 19.5732 16.5982 19.5451C17.006 19.4748 17.2803 19.0881 17.2099 18.6803L16.1928 12.7529L20.4982 8.55528C20.6154 8.44044 20.6928 8.29044 20.7162 8.12638C20.7795 7.71622 20.4935 7.33653 20.0834 7.27559Z"
                                    fill="#F3CF5B"
                                  />
                                </svg>

                                <span className={styles.td_data_text}>
                                  3.75
                                </span>
                              </div>
                            </td>
                            <td>
                              <OverlayTrigger
                                placement="top"
                                delay={{ show: 250, hide: 400 }}
                                overlay={renderTooltip}
                              >
                                <span
                                  className={` ${styles.button_track} ${styles.dark_mehrun}`}
                                >
                                  Declined
                                </span>
                              </OverlayTrigger>
                            </td>
                            <td>13 July, 2021</td>
                            <td>
                              <div className={styles.application_box}>
                                <button className={styles.application_btn}>
                                  See Application
                                </button>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div
                                className={`custom_checkbox second_checkbox ${styles.data_group}`}
                              >
                                <input type="checkbox" />
                                <h3 className={styles.user_name_text}>
                                  <img
                                    src="/img/user.png"
                                    className={styles.user_img}
                                  />
                                  Leif Floyd
                                </h3>
                              </div>
                            </td>
                            <td>
                              <div className={styles.td_data}>
                                <svg
                                  width="21"
                                  height="20"
                                  viewBox="0 0 21 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M20.0834 7.27559L14.1326 6.41075L11.4724 1.01778C11.3998 0.870126 11.2803 0.750595 11.1326 0.677938C10.7623 0.495126 10.3123 0.64747 10.1271 1.01778L7.46697 6.41075L1.51619 7.27559C1.35213 7.29903 1.20213 7.37638 1.08729 7.49356C0.948448 7.63627 0.871941 7.82825 0.874578 8.02733C0.877215 8.22642 0.958779 8.41631 1.10135 8.55528L5.40682 12.7529L4.38963 18.6803C4.36578 18.8182 4.38104 18.96 4.43368 19.0896C4.48631 19.2193 4.57423 19.3316 4.68745 19.4138C4.80067 19.496 4.93466 19.5449 5.07424 19.5549C5.21382 19.5648 5.35339 19.5355 5.47713 19.4701L10.7998 16.6717L16.1224 19.4701C16.2678 19.5475 16.4365 19.5732 16.5982 19.5451C17.006 19.4748 17.2803 19.0881 17.2099 18.6803L16.1928 12.7529L20.4982 8.55528C20.6154 8.44044 20.6928 8.29044 20.7162 8.12638C20.7795 7.71622 20.4935 7.33653 20.0834 7.27559Z"
                                    fill="#F3CF5B"
                                  />
                                </svg>

                                <span className={styles.td_data_text}>4.8</span>
                              </div>
                            </td>
                            <td className="score_show_row">
                              <div className={styles.td_data}>
                                <svg
                                  width="21"
                                  height="20"
                                  viewBox="0 0 21 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M20.0834 7.27559L14.1326 6.41075L11.4724 1.01778C11.3998 0.870126 11.2803 0.750595 11.1326 0.677938C10.7623 0.495126 10.3123 0.64747 10.1271 1.01778L7.46697 6.41075L1.51619 7.27559C1.35213 7.29903 1.20213 7.37638 1.08729 7.49356C0.948448 7.63627 0.871941 7.82825 0.874578 8.02733C0.877215 8.22642 0.958779 8.41631 1.10135 8.55528L5.40682 12.7529L4.38963 18.6803C4.36578 18.8182 4.38104 18.96 4.43368 19.0896C4.48631 19.2193 4.57423 19.3316 4.68745 19.4138C4.80067 19.496 4.93466 19.5449 5.07424 19.5549C5.21382 19.5648 5.35339 19.5355 5.47713 19.4701L10.7998 16.6717L16.1224 19.4701C16.2678 19.5475 16.4365 19.5732 16.5982 19.5451C17.006 19.4748 17.2803 19.0881 17.2099 18.6803L16.1928 12.7529L20.4982 8.55528C20.6154 8.44044 20.6928 8.29044 20.7162 8.12638C20.7795 7.71622 20.4935 7.33653 20.0834 7.27559Z"
                                    fill="#F3CF5B"
                                  />
                                </svg>

                                <span className={styles.td_data_text}>4.8</span>
                              </div>
                            </td>
                            <td className="score_show_row">
                              <div className={styles.td_data}>
                                <svg
                                  width="21"
                                  height="20"
                                  viewBox="0 0 21 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M20.0834 7.27559L14.1326 6.41075L11.4724 1.01778C11.3998 0.870126 11.2803 0.750595 11.1326 0.677938C10.7623 0.495126 10.3123 0.64747 10.1271 1.01778L7.46697 6.41075L1.51619 7.27559C1.35213 7.29903 1.20213 7.37638 1.08729 7.49356C0.948448 7.63627 0.871941 7.82825 0.874578 8.02733C0.877215 8.22642 0.958779 8.41631 1.10135 8.55528L5.40682 12.7529L4.38963 18.6803C4.36578 18.8182 4.38104 18.96 4.43368 19.0896C4.48631 19.2193 4.57423 19.3316 4.68745 19.4138C4.80067 19.496 4.93466 19.5449 5.07424 19.5549C5.21382 19.5648 5.35339 19.5355 5.47713 19.4701L10.7998 16.6717L16.1224 19.4701C16.2678 19.5475 16.4365 19.5732 16.5982 19.5451C17.006 19.4748 17.2803 19.0881 17.2099 18.6803L16.1928 12.7529L20.4982 8.55528C20.6154 8.44044 20.6928 8.29044 20.7162 8.12638C20.7795 7.71622 20.4935 7.33653 20.0834 7.27559Z"
                                    fill="#F3CF5B"
                                  />
                                </svg>

                                <span className={styles.td_data_text}>4.8</span>
                              </div>
                            </td>
                            <td>
                              <span
                                className={` ${styles.button_track} ${styles.light_green}`}
                              >
                                Hired
                              </span>
                            </td>
                            <td>13 July, 2021</td>
                            <td>
                              <div className={styles.application_box}>
                                <button className={styles.application_btn}>
                                  See Application
                                </button>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div
                                className={`custom_checkbox second_checkbox ${styles.data_group}`}
                              >
                                <input type="checkbox" />
                                <h3 className={styles.user_name_text}>
                                  <img
                                    src="/img/user.png"
                                    className={styles.user_img}
                                  />
                                  Jenny Wilson
                                </h3>
                              </div>
                            </td>
                            <td>
                              <div className={styles.td_data}>
                                <svg
                                  width="21"
                                  height="20"
                                  viewBox="0 0 21 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M20.0834 7.27559L14.1326 6.41075L11.4724 1.01778C11.3998 0.870126 11.2803 0.750595 11.1326 0.677938C10.7623 0.495126 10.3123 0.64747 10.1271 1.01778L7.46697 6.41075L1.51619 7.27559C1.35213 7.29903 1.20213 7.37638 1.08729 7.49356C0.948448 7.63627 0.871941 7.82825 0.874578 8.02733C0.877215 8.22642 0.958779 8.41631 1.10135 8.55528L5.40682 12.7529L4.38963 18.6803C4.36578 18.8182 4.38104 18.96 4.43368 19.0896C4.48631 19.2193 4.57423 19.3316 4.68745 19.4138C4.80067 19.496 4.93466 19.5449 5.07424 19.5549C5.21382 19.5648 5.35339 19.5355 5.47713 19.4701L10.7998 16.6717L16.1224 19.4701C16.2678 19.5475 16.4365 19.5732 16.5982 19.5451C17.006 19.4748 17.2803 19.0881 17.2099 18.6803L16.1928 12.7529L20.4982 8.55528C20.6154 8.44044 20.6928 8.29044 20.7162 8.12638C20.7795 7.71622 20.4935 7.33653 20.0834 7.27559Z"
                                    fill="#F3CF5B"
                                  />
                                </svg>

                                <span className={styles.td_data_text}>4.8</span>
                              </div>
                            </td>
                            <td className="score_show_row">
                              <div className={styles.td_data}>
                                <svg
                                  width="21"
                                  height="20"
                                  viewBox="0 0 21 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M20.0834 7.27559L14.1326 6.41075L11.4724 1.01778C11.3998 0.870126 11.2803 0.750595 11.1326 0.677938C10.7623 0.495126 10.3123 0.64747 10.1271 1.01778L7.46697 6.41075L1.51619 7.27559C1.35213 7.29903 1.20213 7.37638 1.08729 7.49356C0.948448 7.63627 0.871941 7.82825 0.874578 8.02733C0.877215 8.22642 0.958779 8.41631 1.10135 8.55528L5.40682 12.7529L4.38963 18.6803C4.36578 18.8182 4.38104 18.96 4.43368 19.0896C4.48631 19.2193 4.57423 19.3316 4.68745 19.4138C4.80067 19.496 4.93466 19.5449 5.07424 19.5549C5.21382 19.5648 5.35339 19.5355 5.47713 19.4701L10.7998 16.6717L16.1224 19.4701C16.2678 19.5475 16.4365 19.5732 16.5982 19.5451C17.006 19.4748 17.2803 19.0881 17.2099 18.6803L16.1928 12.7529L20.4982 8.55528C20.6154 8.44044 20.6928 8.29044 20.7162 8.12638C20.7795 7.71622 20.4935 7.33653 20.0834 7.27559Z"
                                    fill="#F3CF5B"
                                  />
                                </svg>

                                <span className={styles.td_data_text}>4.8</span>
                              </div>
                            </td>
                            <td className="score_show_row">
                              <div className={styles.td_data}>
                                <svg
                                  width="21"
                                  height="20"
                                  viewBox="0 0 21 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M20.0834 7.27559L14.1326 6.41075L11.4724 1.01778C11.3998 0.870126 11.2803 0.750595 11.1326 0.677938C10.7623 0.495126 10.3123 0.64747 10.1271 1.01778L7.46697 6.41075L1.51619 7.27559C1.35213 7.29903 1.20213 7.37638 1.08729 7.49356C0.948448 7.63627 0.871941 7.82825 0.874578 8.02733C0.877215 8.22642 0.958779 8.41631 1.10135 8.55528L5.40682 12.7529L4.38963 18.6803C4.36578 18.8182 4.38104 18.96 4.43368 19.0896C4.48631 19.2193 4.57423 19.3316 4.68745 19.4138C4.80067 19.496 4.93466 19.5449 5.07424 19.5549C5.21382 19.5648 5.35339 19.5355 5.47713 19.4701L10.7998 16.6717L16.1224 19.4701C16.2678 19.5475 16.4365 19.5732 16.5982 19.5451C17.006 19.4748 17.2803 19.0881 17.2099 18.6803L16.1928 12.7529L20.4982 8.55528C20.6154 8.44044 20.6928 8.29044 20.7162 8.12638C20.7795 7.71622 20.4935 7.33653 20.0834 7.27559Z"
                                    fill="#F3CF5B"
                                  />
                                </svg>

                                <span className={styles.td_data_text}>4.8</span>
                              </div>
                            </td>
                            <td>
                              <span
                                className={` ${styles.button_track} ${styles.light_green}`}
                              >
                                Hired
                              </span>
                            </td>
                            <td>13 July, 2021</td>
                            <td>
                              <div className={styles.application_box}>
                                <button className={styles.application_btn}>
                                  See Application
                                </button>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div
                                className={`custom_checkbox second_checkbox ${styles.data_group}`}
                              >
                                <input type="checkbox" />
                                <h3 className={styles.user_name_text}>
                                  <img
                                    src="/img/user.png"
                                    className={styles.user_img}
                                  />
                                  Jerome Bell
                                </h3>
                              </div>
                            </td>
                            <td>
                              <div className={styles.td_data}>
                                <svg
                                  width="21"
                                  height="20"
                                  viewBox="0 0 21 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M20.0834 7.27559L14.1326 6.41075L11.4724 1.01778C11.3998 0.870126 11.2803 0.750595 11.1326 0.677938C10.7623 0.495126 10.3123 0.64747 10.1271 1.01778L7.46697 6.41075L1.51619 7.27559C1.35213 7.29903 1.20213 7.37638 1.08729 7.49356C0.948448 7.63627 0.871941 7.82825 0.874578 8.02733C0.877215 8.22642 0.958779 8.41631 1.10135 8.55528L5.40682 12.7529L4.38963 18.6803C4.36578 18.8182 4.38104 18.96 4.43368 19.0896C4.48631 19.2193 4.57423 19.3316 4.68745 19.4138C4.80067 19.496 4.93466 19.5449 5.07424 19.5549C5.21382 19.5648 5.35339 19.5355 5.47713 19.4701L10.7998 16.6717L16.1224 19.4701C16.2678 19.5475 16.4365 19.5732 16.5982 19.5451C17.006 19.4748 17.2803 19.0881 17.2099 18.6803L16.1928 12.7529L20.4982 8.55528C20.6154 8.44044 20.6928 8.29044 20.7162 8.12638C20.7795 7.71622 20.4935 7.33653 20.0834 7.27559Z"
                                    fill="#F3CF5B"
                                  />
                                </svg>

                                <span className={styles.td_data_text}>4.8</span>
                              </div>
                            </td>
                            <td className="score_show_row">
                              <div className={styles.td_data}>
                                <svg
                                  width="21"
                                  height="20"
                                  viewBox="0 0 21 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M20.0834 7.27559L14.1326 6.41075L11.4724 1.01778C11.3998 0.870126 11.2803 0.750595 11.1326 0.677938C10.7623 0.495126 10.3123 0.64747 10.1271 1.01778L7.46697 6.41075L1.51619 7.27559C1.35213 7.29903 1.20213 7.37638 1.08729 7.49356C0.948448 7.63627 0.871941 7.82825 0.874578 8.02733C0.877215 8.22642 0.958779 8.41631 1.10135 8.55528L5.40682 12.7529L4.38963 18.6803C4.36578 18.8182 4.38104 18.96 4.43368 19.0896C4.48631 19.2193 4.57423 19.3316 4.68745 19.4138C4.80067 19.496 4.93466 19.5449 5.07424 19.5549C5.21382 19.5648 5.35339 19.5355 5.47713 19.4701L10.7998 16.6717L16.1224 19.4701C16.2678 19.5475 16.4365 19.5732 16.5982 19.5451C17.006 19.4748 17.2803 19.0881 17.2099 18.6803L16.1928 12.7529L20.4982 8.55528C20.6154 8.44044 20.6928 8.29044 20.7162 8.12638C20.7795 7.71622 20.4935 7.33653 20.0834 7.27559Z"
                                    fill="#F3CF5B"
                                  />
                                </svg>

                                <span className={styles.td_data_text}>4.8</span>
                              </div>
                            </td>
                            <td className="score_show_row">
                              <div className={styles.td_data}>
                                <svg
                                  width="21"
                                  height="20"
                                  viewBox="0 0 21 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M20.0834 7.27559L14.1326 6.41075L11.4724 1.01778C11.3998 0.870126 11.2803 0.750595 11.1326 0.677938C10.7623 0.495126 10.3123 0.64747 10.1271 1.01778L7.46697 6.41075L1.51619 7.27559C1.35213 7.29903 1.20213 7.37638 1.08729 7.49356C0.948448 7.63627 0.871941 7.82825 0.874578 8.02733C0.877215 8.22642 0.958779 8.41631 1.10135 8.55528L5.40682 12.7529L4.38963 18.6803C4.36578 18.8182 4.38104 18.96 4.43368 19.0896C4.48631 19.2193 4.57423 19.3316 4.68745 19.4138C4.80067 19.496 4.93466 19.5449 5.07424 19.5549C5.21382 19.5648 5.35339 19.5355 5.47713 19.4701L10.7998 16.6717L16.1224 19.4701C16.2678 19.5475 16.4365 19.5732 16.5982 19.5451C17.006 19.4748 17.2803 19.0881 17.2099 18.6803L16.1928 12.7529L20.4982 8.55528C20.6154 8.44044 20.6928 8.29044 20.7162 8.12638C20.7795 7.71622 20.4935 7.33653 20.0834 7.27559Z"
                                    fill="#F3CF5B"
                                  />
                                </svg>

                                <span className={styles.td_data_text}>4.8</span>
                              </div>
                            </td>
                            <td>
                              <span
                                className={` ${styles.button_track} ${styles.light_sky}`}
                              >
                                Interviewed
                              </span>
                            </td>
                            <td>13 July, 2021</td>
                            <td>
                              <div className={styles.application_box}>
                                <button className={styles.application_btn}>
                                  See Application
                                </button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Tab>
                  <Tab eventKey="job details" title="job details">
                    <div className={styles.social_head}>
                      <div className={styles.left_box}>
                        <div className={styles.icon_wrapper}>
                          <img src="/img/social.png" alt="social-icon" />
                          <span className={styles.user_name_later}>s</span>
                        </div>

                        <h4 className={styles.social_head_title}>
                          Social Media Assistant
                        </h4>
                      </div>
                    </div>

                    <div className={styles.next_step_btn_block}>
                      <a href="#" className={styles.save_post_btn}>
                        Save & Post Later
                      </a>
                      <a
                        href="#"
                        className={`${styles.next_btn} ${styles.post_now_btn}`}
                      >
                        Post Now
                      </a>
                    </div>

                    <div className={styles.details_page_main}>
                      <div className="row">
                        <div className="col-md-8">
                          <div className={styles.details_page_left}>
                            <div className={styles.details_content_box}>
                              <h2 className={styles.box_title}>
                                Job Description
                              </h2>
                              <p className={styles.description}>
                                Stripe is looking for Social Media Marketing
                                expert to help manage our online networks. You
                                will be responsible for monitoring our social
                                media channels, creating content, finding
                                effective ways to engage the community and
                                incentivize others to engage on our channels.
                              </p>
                            </div>
                            <div className={styles.details_content_box}>
                              <h2 className={styles.box_title}>Requirements</h2>
                              <ul className={styles.requirements_list}>
                                <li className={styles.requirements_list_items}>
                                  <svg
                                    width="20"
                                    height="21"
                                    viewBox="0 0 20 21"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g clip-path="url(#clip0_1397_9362)">
                                      <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M9.99999 3.57389C6.31809 3.57389 3.33332 6.55866 3.33332 10.2406C3.33332 13.9225 6.31809 16.9072 9.99999 16.9072C13.6819 16.9072 16.6667 13.9225 16.6667 10.2406C16.6667 6.55866 13.6819 3.57389 9.99999 3.57389ZM1.66666 10.2406C1.66666 5.63819 5.39762 1.90723 9.99999 1.90723C14.6024 1.90723 18.3333 5.63819 18.3333 10.2406C18.3333 14.8429 14.6024 18.5739 9.99999 18.5739C5.39762 18.5739 1.66666 14.8429 1.66666 10.2406Z"
                                        fill="#56CDAD"
                                      />
                                      <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M13.0892 7.98431C13.4147 8.30975 13.4147 8.83739 13.0892 9.16282L9.75591 12.4962C9.43048 12.8216 8.90284 12.8216 8.5774 12.4962L6.91073 10.8295C6.5853 10.5041 6.5853 9.97642 6.91073 9.65098C7.23617 9.32554 7.76381 9.32554 8.08925 9.65098L9.16666 10.7284L11.9107 7.98431C12.2362 7.65888 12.7638 7.65888 13.0892 7.98431Z"
                                        fill="#56CDAD"
                                      />
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_1397_9362">
                                        <rect
                                          width="20"
                                          height="20"
                                          fill="white"
                                          transform="translate(0 0.240234)"
                                        />
                                      </clipPath>
                                    </defs>
                                  </svg>
                                  Community engagement to ensure that is
                                  supported and actively represented online
                                </li>
                                <li className={styles.requirements_list_items}>
                                  <svg
                                    width="20"
                                    height="21"
                                    viewBox="0 0 20 21"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g clip-path="url(#clip0_1397_9362)">
                                      <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M9.99999 3.57389C6.31809 3.57389 3.33332 6.55866 3.33332 10.2406C3.33332 13.9225 6.31809 16.9072 9.99999 16.9072C13.6819 16.9072 16.6667 13.9225 16.6667 10.2406C16.6667 6.55866 13.6819 3.57389 9.99999 3.57389ZM1.66666 10.2406C1.66666 5.63819 5.39762 1.90723 9.99999 1.90723C14.6024 1.90723 18.3333 5.63819 18.3333 10.2406C18.3333 14.8429 14.6024 18.5739 9.99999 18.5739C5.39762 18.5739 1.66666 14.8429 1.66666 10.2406Z"
                                        fill="#56CDAD"
                                      />
                                      <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M13.0892 7.98431C13.4147 8.30975 13.4147 8.83739 13.0892 9.16282L9.75591 12.4962C9.43048 12.8216 8.90284 12.8216 8.5774 12.4962L6.91073 10.8295C6.5853 10.5041 6.5853 9.97642 6.91073 9.65098C7.23617 9.32554 7.76381 9.32554 8.08925 9.65098L9.16666 10.7284L11.9107 7.98431C12.2362 7.65888 12.7638 7.65888 13.0892 7.98431Z"
                                        fill="#56CDAD"
                                      />
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_1397_9362">
                                        <rect
                                          width="20"
                                          height="20"
                                          fill="white"
                                          transform="translate(0 0.240234)"
                                        />
                                      </clipPath>
                                    </defs>
                                  </svg>
                                  Focus on social media content development and
                                  publication
                                </li>
                                <li className={styles.requirements_list_items}>
                                  <svg
                                    width="20"
                                    height="21"
                                    viewBox="0 0 20 21"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g clip-path="url(#clip0_1397_9362)">
                                      <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M9.99999 3.57389C6.31809 3.57389 3.33332 6.55866 3.33332 10.2406C3.33332 13.9225 6.31809 16.9072 9.99999 16.9072C13.6819 16.9072 16.6667 13.9225 16.6667 10.2406C16.6667 6.55866 13.6819 3.57389 9.99999 3.57389ZM1.66666 10.2406C1.66666 5.63819 5.39762 1.90723 9.99999 1.90723C14.6024 1.90723 18.3333 5.63819 18.3333 10.2406C18.3333 14.8429 14.6024 18.5739 9.99999 18.5739C5.39762 18.5739 1.66666 14.8429 1.66666 10.2406Z"
                                        fill="#56CDAD"
                                      />
                                      <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M13.0892 7.98431C13.4147 8.30975 13.4147 8.83739 13.0892 9.16282L9.75591 12.4962C9.43048 12.8216 8.90284 12.8216 8.5774 12.4962L6.91073 10.8295C6.5853 10.5041 6.5853 9.97642 6.91073 9.65098C7.23617 9.32554 7.76381 9.32554 8.08925 9.65098L9.16666 10.7284L11.9107 7.98431C12.2362 7.65888 12.7638 7.65888 13.0892 7.98431Z"
                                        fill="#56CDAD"
                                      />
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_1397_9362">
                                        <rect
                                          width="20"
                                          height="20"
                                          fill="white"
                                          transform="translate(0 0.240234)"
                                        />
                                      </clipPath>
                                    </defs>
                                  </svg>
                                  Stay on top of trends on social media
                                  platforms, and suggest content ideas to the
                                  team
                                </li>
                                <li className={styles.requirements_list_items}>
                                  <svg
                                    width="20"
                                    height="21"
                                    viewBox="0 0 20 21"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g clip-path="url(#clip0_1397_9362)">
                                      <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M9.99999 3.57389C6.31809 3.57389 3.33332 6.55866 3.33332 10.2406C3.33332 13.9225 6.31809 16.9072 9.99999 16.9072C13.6819 16.9072 16.6667 13.9225 16.6667 10.2406C16.6667 6.55866 13.6819 3.57389 9.99999 3.57389ZM1.66666 10.2406C1.66666 5.63819 5.39762 1.90723 9.99999 1.90723C14.6024 1.90723 18.3333 5.63819 18.3333 10.2406C18.3333 14.8429 14.6024 18.5739 9.99999 18.5739C5.39762 18.5739 1.66666 14.8429 1.66666 10.2406Z"
                                        fill="#56CDAD"
                                      />
                                      <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M13.0892 7.98431C13.4147 8.30975 13.4147 8.83739 13.0892 9.16282L9.75591 12.4962C9.43048 12.8216 8.90284 12.8216 8.5774 12.4962L6.91073 10.8295C6.5853 10.5041 6.5853 9.97642 6.91073 9.65098C7.23617 9.32554 7.76381 9.32554 8.08925 9.65098L9.16666 10.7284L11.9107 7.98431C12.2362 7.65888 12.7638 7.65888 13.0892 7.98431Z"
                                        fill="#56CDAD"
                                      />
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_1397_9362">
                                        <rect
                                          width="20"
                                          height="20"
                                          fill="white"
                                          transform="translate(0 0.240234)"
                                        />
                                      </clipPath>
                                    </defs>
                                  </svg>
                                  Engage with online communities
                                </li>
                              </ul>
                            </div>

                            <div className={styles.details_content_box}>
                              <h2 className={styles.box_title}>
                                Nice-To-Haves
                              </h2>
                              <ul className={styles.requirements_list}>
                                <li className={styles.requirements_list_items}>
                                  <svg
                                    width="20"
                                    height="21"
                                    viewBox="0 0 20 21"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g clip-path="url(#clip0_1397_9362)">
                                      <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M9.99999 3.57389C6.31809 3.57389 3.33332 6.55866 3.33332 10.2406C3.33332 13.9225 6.31809 16.9072 9.99999 16.9072C13.6819 16.9072 16.6667 13.9225 16.6667 10.2406C16.6667 6.55866 13.6819 3.57389 9.99999 3.57389ZM1.66666 10.2406C1.66666 5.63819 5.39762 1.90723 9.99999 1.90723C14.6024 1.90723 18.3333 5.63819 18.3333 10.2406C18.3333 14.8429 14.6024 18.5739 9.99999 18.5739C5.39762 18.5739 1.66666 14.8429 1.66666 10.2406Z"
                                        fill="#56CDAD"
                                      />
                                      <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M13.0892 7.98431C13.4147 8.30975 13.4147 8.83739 13.0892 9.16282L9.75591 12.4962C9.43048 12.8216 8.90284 12.8216 8.5774 12.4962L6.91073 10.8295C6.5853 10.5041 6.5853 9.97642 6.91073 9.65098C7.23617 9.32554 7.76381 9.32554 8.08925 9.65098L9.16666 10.7284L11.9107 7.98431C12.2362 7.65888 12.7638 7.65888 13.0892 7.98431Z"
                                        fill="#56CDAD"
                                      />
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_1397_9362">
                                        <rect
                                          width="20"
                                          height="20"
                                          fill="white"
                                          transform="translate(0 0.240234)"
                                        />
                                      </clipPath>
                                    </defs>
                                  </svg>
                                  Fluent in English
                                </li>
                                <li className={styles.requirements_list_items}>
                                  <svg
                                    width="20"
                                    height="21"
                                    viewBox="0 0 20 21"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g clip-path="url(#clip0_1397_9362)">
                                      <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M9.99999 3.57389C6.31809 3.57389 3.33332 6.55866 3.33332 10.2406C3.33332 13.9225 6.31809 16.9072 9.99999 16.9072C13.6819 16.9072 16.6667 13.9225 16.6667 10.2406C16.6667 6.55866 13.6819 3.57389 9.99999 3.57389ZM1.66666 10.2406C1.66666 5.63819 5.39762 1.90723 9.99999 1.90723C14.6024 1.90723 18.3333 5.63819 18.3333 10.2406C18.3333 14.8429 14.6024 18.5739 9.99999 18.5739C5.39762 18.5739 1.66666 14.8429 1.66666 10.2406Z"
                                        fill="#56CDAD"
                                      />
                                      <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M13.0892 7.98431C13.4147 8.30975 13.4147 8.83739 13.0892 9.16282L9.75591 12.4962C9.43048 12.8216 8.90284 12.8216 8.5774 12.4962L6.91073 10.8295C6.5853 10.5041 6.5853 9.97642 6.91073 9.65098C7.23617 9.32554 7.76381 9.32554 8.08925 9.65098L9.16666 10.7284L11.9107 7.98431C12.2362 7.65888 12.7638 7.65888 13.0892 7.98431Z"
                                        fill="#56CDAD"
                                      />
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_1397_9362">
                                        <rect
                                          width="20"
                                          height="20"
                                          fill="white"
                                          transform="translate(0 0.240234)"
                                        />
                                      </clipPath>
                                    </defs>
                                  </svg>
                                  Project management skills
                                </li>
                                <li className={styles.requirements_list_items}>
                                  <svg
                                    width="20"
                                    height="21"
                                    viewBox="0 0 20 21"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g clip-path="url(#clip0_1397_9362)">
                                      <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M9.99999 3.57389C6.31809 3.57389 3.33332 6.55866 3.33332 10.2406C3.33332 13.9225 6.31809 16.9072 9.99999 16.9072C13.6819 16.9072 16.6667 13.9225 16.6667 10.2406C16.6667 6.55866 13.6819 3.57389 9.99999 3.57389ZM1.66666 10.2406C1.66666 5.63819 5.39762 1.90723 9.99999 1.90723C14.6024 1.90723 18.3333 5.63819 18.3333 10.2406C18.3333 14.8429 14.6024 18.5739 9.99999 18.5739C5.39762 18.5739 1.66666 14.8429 1.66666 10.2406Z"
                                        fill="#56CDAD"
                                      />
                                      <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M13.0892 7.98431C13.4147 8.30975 13.4147 8.83739 13.0892 9.16282L9.75591 12.4962C9.43048 12.8216 8.90284 12.8216 8.5774 12.4962L6.91073 10.8295C6.5853 10.5041 6.5853 9.97642 6.91073 9.65098C7.23617 9.32554 7.76381 9.32554 8.08925 9.65098L9.16666 10.7284L11.9107 7.98431C12.2362 7.65888 12.7638 7.65888 13.0892 7.98431Z"
                                        fill="#56CDAD"
                                      />
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_1397_9362">
                                        <rect
                                          width="20"
                                          height="20"
                                          fill="white"
                                          transform="translate(0 0.240234)"
                                        />
                                      </clipPath>
                                    </defs>
                                  </svg>
                                  Copy editing skills
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className={styles.details_page_right}>
                            <div className={styles.job_about_box}>
                              <h2 class={styles.box_title}>About this role</h2>

                              <div>
                                <ul className={styles.role_list}>
                                  <li className={styles.role_list_items}>
                                    <span className={styles.job_tag}>
                                      Apply Before
                                    </span>
                                    <span className={styles.job_sub_tag}>
                                      July 31, 2021
                                    </span>
                                  </li>
                                  <li className={styles.role_list_items}>
                                    <span className={styles.job_tag}>
                                      Job Posted On
                                    </span>
                                    <span className={styles.job_sub_tag}>
                                      July 1, 2021
                                    </span>
                                  </li>
                                  <li className={styles.role_list_items}>
                                    <span className={styles.job_tag}>
                                      Job Type
                                    </span>
                                    <span className={styles.job_sub_tag}>
                                      Full-Time
                                    </span>
                                  </li>
                                  <li className={styles.role_list_items}>
                                    <span className={styles.job_tag}>
                                      Experiences{" "}
                                    </span>
                                    <span className={styles.job_sub_tag}>
                                      <span
                                        className={` w-100 d-block text-right ${styles.job_sub_tag}`}
                                      >
                                        Experienced{" "}
                                      </span>
                                      4+ years
                                    </span>
                                  </li>
                                  <li className={styles.role_list_items}>
                                    <span className={styles.job_tag}>
                                      Salary
                                    </span>
                                    <span className={styles.job_sub_tag}>
                                      $75k-$85k USD
                                    </span>
                                  </li>
                                  <li className={styles.role_list_items}>
                                    <span className={styles.job_tag}>
                                      Location
                                    </span>
                                    <span className={styles.job_sub_tag}>
                                      Moonshine St. 14/05 Light City, London,
                                      United Kingdom
                                    </span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className={styles.job_about_box}>
                              <h2 class={styles.box_title}>Categories</h2>
                              <ul className={styles.statusBox}>
                                <li
                                  className={`${styles.statusItems} ${styles.greenBtn}`}
                                >
                                  Full-Time
                                </li>
                                <li
                                  className={`${styles.statusItems} ${styles.yellowBtn}`}
                                >
                                  Marketing
                                </li>
                              </ul>
                            </div>
                            <div className={styles.job_about_box}>
                              <h2 class={styles.box_title}>Required Skills</h2>
                              <div className={styles.skills_tags_box}>
                                <span className={styles.skills_tags}>
                                  Project Management
                                </span>
                                <span className={styles.skills_tags}>
                                  Copywriting
                                </span>
                                <span className={styles.skills_tags}>
                                  English
                                </span>
                                <span className={styles.skills_tags}>
                                  Social Media Marketing
                                </span>
                                <span className={styles.skills_tags}>
                                  Copy Editing
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  createAxiosCookies(context);

  return {
    props: {
      publicHeader: false,
      publicFooter: false,
    },
  };
}

export default ManageJobs;
