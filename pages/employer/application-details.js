import React, { useState } from "react";
import Link from "next/link";
import { createAxiosCookies } from "@/fn";
import styles from "../../styles/application_details.module.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import ProgressBar from 'react-bootstrap/ProgressBar';
import FlagLang from "@/components/FlagLang";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import LogOut from "@/components/logout";
import { IMAGEBASEURL } from "@/api";

const ManageJobs = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const { companyProfile } = useSelector((store) => store.auth);
  const handleShow = () => setShow(true);
  const dispatch = useDispatch()
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
                    <img width="50" src={(companyProfile?.logo) ? `${IMAGEBASEURL}${companyProfile.logo}` : "/img/company_icon.png"} alt="" />
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
                          style={{"border": "none"}}
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
              <div className={`main_content ${styles.land_ar}`}  id="body_lang_css">
              <div className={styles.applicant_details_head}>
                <div className={styles.applicant_details_text}>
                  <a href="#" className={styles.applicant_details_heading}>
                    <span className={styles.LeftarrowIcon}>
                      <svg
                        width="28"
                        height="24"
                        viewBox="0 0 28 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M0.666504 12C0.666504 11.0795 1.4127 10.3333 2.33317 10.3333H25.6665C26.587 10.3333 27.3332 11.0795 27.3332 12C27.3332 12.9205 26.587 13.6666 25.6665 13.6666H2.33317C1.4127 13.6666 0.666504 12.9205 0.666504 12Z"
                          fill="#25324B"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M1.15466 10.8215C1.80553 10.1706 2.86081 10.1706 3.51168 10.8215L13.5117 20.8215C14.1626 21.4723 14.1626 22.5276 13.5117 23.1785C12.8608 23.8294 11.8055 23.8294 11.1547 23.1785L1.15466 13.1785C0.503785 12.5276 0.503785 11.4723 1.15466 10.8215Z"
                          fill="#25324B"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M13.5117 0.821468C14.1626 1.47234 14.1626 2.52762 13.5117 3.17849L3.51168 13.1785C2.86081 13.8294 1.80553 13.8294 1.15466 13.1785C0.503785 12.5276 0.503785 11.4723 1.15466 10.8215L11.1547 0.821468C11.8055 0.170594 12.8608 0.170594 13.5117 0.821468Z"
                          fill="#25324B"
                        />
                      </svg>
                    </span>
                    Applicant Details
                  </a>
                </div>
                <div className={styles.applicant_details_btn_box}>
                  <a href="#" className={styles.applyBtn}>
                    Invite to Apply
                  </a>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 col-md-4">
                  <div className={styles.user_details_block}>
                    <div className={styles.user_details_inner}>
                      <figure className={styles.userImg}>
                        <img src="/img/user.png" alt="user" />
                      </figure>
                      <div className={styles.userFullDetails}>
                        <h3 className={styles.username}>Kate Witmer</h3>
                        <p className={styles.designationname}>
                          Product Designer
                        </p>
                        <p className={styles.ratingbox}>
                          <span className={styles.starIcon}>
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M19.2836 7.27584L13.3328 6.411L10.6726 1.01803C10.6 0.87037 10.4805 0.750839 10.3328 0.678183C9.96248 0.49537 9.51248 0.647714 9.32733 1.01803L6.66717 6.411L0.716389 7.27584C0.552327 7.29928 0.402327 7.37662 0.287483 7.49381C0.148643 7.63651 0.0721362 7.8285 0.074773 8.02758C0.0774098 8.22666 0.158975 8.41655 0.301545 8.55553L4.60701 12.7532L3.58983 18.6805C3.56597 18.8184 3.58123 18.9602 3.63387 19.0899C3.68651 19.2195 3.77442 19.3318 3.88764 19.4141C4.00086 19.4963 4.13486 19.5452 4.27444 19.5551C4.41401 19.5651 4.55358 19.5357 4.67733 19.4704L9.99998 16.6719L15.3226 19.4704C15.468 19.5477 15.6367 19.5735 15.7984 19.5454C16.2062 19.4751 16.4805 19.0883 16.4101 18.6805L15.393 12.7532L19.6984 8.55553C19.8156 8.44068 19.893 8.29068 19.9164 8.12662C19.9797 7.71646 19.6937 7.33678 19.2836 7.27584Z"
                                fill="#F3CF5B"
                              />
                            </svg>
                          </span>
                          4.0
                        </p>
                      </div>
                    </div>

                    <div className={styles.appliedJobBox}>
                      <div className={styles.appliedJobStatus}>
                        <h3 className={styles.statustitle}>Previous Applications</h3>
                        <p className={styles.statusday}>2 days ago</p>
                      </div>
                      <h2 className={styles.appliedJobBoxTitle}>
                        Product Development
                      </h2>
                      <ul className={styles.jobstatus}>
                        <li className={styles.jobItems}>Marketing</li>
                        <li className={styles.jobItems}>Full-Time</li>
                      </ul>
                    </div>
                    <div className={styles.customer_persona_details}>
                        <div className={styles.StageBox}>
                            <h4 className={styles.StageTitle}>Stage</h4>
                            <h4 className={styles.FinalTitle}>
                            <span className={styles.Dot}></span>Final Interview</h4>
                        </div>
                      <ProgressBar className="progressBar_box">
                          <ProgressBar variant="success" now={25} key={1} />
                          <ProgressBar variant="success" now={25} key={2} />
                          <ProgressBar variant="success" now={25} key={3} />
                          <ProgressBar variant="" now={25} key={4} />
                      </ProgressBar>
                      <Modal
                        className={styles.modalBox}
                        show={show}
                        onHide={handleClose}
                      >
                        <Modal.Body className="p-0 border-0">
                          <div className={styles.unlockPopupContent}>
                            <h2 className={styles.popupTitle}>
                              Are you sure you want to unlock?
                            </h2>
                            <p className={styles.subText}>
                              Remaining CV for this month: 15
                            </p>
                            <button className={styles.confirmBtn}>
                              Confirm
                            </button>
                            <button className={styles.cancelBtn}>Cancel</button>
                          </div>
                        </Modal.Body>
                      </Modal>
                    </div>

                    <div className={`${styles.contact_box} ${styles.main_box}`}>


                      <div className={styles.blurblock}>
                          <img src="/assets/img/contact-details.png" alt="blur-img" />
                      </div>



                      <h3 className={styles.contact_title}>Contact</h3>
                      <ul className={styles.contact_list}>
                        <li className={styles.contact_Items}>
                          <span className={styles.contact_Icon}>
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clip-path="url(#clip0_775_8219)">
                                <path
                                  d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z"
                                  stroke="#7C8493"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M3 7L12 13L21 7"
                                  stroke="#7C8493"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_775_8219">
                                  <rect width="24" height="24" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </span>
                          <div className={styles.contact_content}>
                            <p className={styles.contact_heading}>Email</p>
                            <p className={styles.contact_link}>
                              email@email.com
                            </p>
                          </div>
                        </li>
                        <li className={styles.contact_Items}>
                          <span className={styles.contact_Icon}>
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clip-path="url(#clip0_775_8227)">
                                <path
                                  d="M16 4H8C7.44772 4 7 4.44772 7 5V19C7 19.5523 7.44772 20 8 20H16C16.5523 20 17 19.5523 17 19V5C17 4.44772 16.5523 4 16 4Z"
                                  stroke="#7C8493"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M11 5H13"
                                  stroke="#7C8493"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M12 17V17.01"
                                  stroke="#25324B"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_775_8227">
                                  <rect width="24" height="24" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </span>
                          <div className={styles.contact_content}>
                            <p className={styles.contact_heading}>Phone</p>
                            <p className={styles.contact_link}>
                              +44 1111 372 135
                            </p>
                          </div>
                        </li>
                        <li className={styles.contact_Items}>
                          <span className={styles.contact_Icon}>
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clip-path="url(#clip0_775_8236)">
                                <path
                                  d="M16 4H8C5.79086 4 4 5.79086 4 8V16C4 18.2091 5.79086 20 8 20H16C18.2091 20 20 18.2091 20 16V8C20 5.79086 18.2091 4 16 4Z"
                                  stroke="#7C8493"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                                  stroke="#7C8493"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M16.5 7.5V7.501"
                                  stroke="#7C8493"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_775_8236">
                                  <rect width="24" height="24" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </span>
                          <div className={styles.contact_content}>
                            <p className={styles.contact_heading}>Instagram</p>
                            <p className={styles.contact_link}>
                              instagram.com/link
                            </p>
                          </div>
                        </li>
                        <li className={styles.contact_Items}>
                          <span className={styles.contact_Icon}>
                            <svg
                              width="22"
                              height="19"
                              viewBox="0 0 22 19"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M21 2.01001C20 2.50001 19.02 2.69901 18 3.00001C16.879 1.73501 15.217 1.66501 13.62 2.26301C12.023 2.86101 10.977 4.32301 11 6.00001V7.00001C7.755 7.08301 4.865 5.60501 3 3.00001C3 3.00001 -1.182 10.433 7 14C5.128 15.247 3.261 16.088 1 16C4.308 17.803 7.913 18.423 11.034 17.517C14.614 16.477 17.556 13.794 18.685 9.77501C19.0218 8.55268 19.189 7.28987 19.182 6.02201C19.18 5.77301 20.692 3.25001 21 2.00901V2.01001Z"
                                stroke="#7C8493"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </span>
                          <div className={styles.contact_content}>
                            <p className={styles.contact_heading}>Twitter</p>
                            <p className={styles.contact_link}>
                              twitter.com/link
                            </p>
                          </div>
                        </li>
                        <li className={`${styles.contact_Items} mb-0`}>
                          <span className={styles.contact_Icon}>
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clip-path="url(#clip0_775_8252)">
                                <path
                                  d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                                  stroke="#7C8493"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M3.60001 9H20.4"
                                  stroke="#7C8493"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M3.60001 15H20.4"
                                  stroke="#7C8493"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M11.5 3C9.81535 5.69961 8.92221 8.81787 8.92221 12C8.92221 15.1821 9.81535 18.3004 11.5 21"
                                  stroke="#7C8493"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M12.5 3C14.1847 5.69961 15.0778 8.81787 15.0778 12C15.0778 15.1821 14.1847 18.3004 12.5 21"
                                  stroke="#7C8493"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_775_8252">
                                  <rect width="24" height="24" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </span>
                          <div className={styles.contact_content}>
                            <p className={styles.contact_heading}>Website</p>
                            <p className={styles.contact_link}>
                              www.google.com
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-8 col-md-8">
                  <div className={styles.right_box}>
                    <Tabs
                      defaultActiveKey="home"
                      className={`${styles.tabs_box} tabsBlock`}
                    >
                      <Tab eventKey="home" title="Applicant Profile">
                        <div className={styles.tabs_main_bx}>
                            <div className={styles.userProfileDetailsBox}>
                              <h2 className={styles.userProfileDetailsHeading}>
                                Personal Info
                              </h2>
                              <div className={`${styles.rowGap} row`}>
                                <div className="col-md-6">
                                  <div className={styles.PersonalInfo}>
                                    <h3 className={styles.PersonalInfo_Title}>
                                      Full Name
                                    </h3>
                                    <h3 className={styles.PersonalInfo_Detail}>
                                      Anna Asol
                                    </h3>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className={styles.PersonalInfo}>
                                    <h3 className={styles.PersonalInfo_Title}>
                                      Gender
                                    </h3>
                                    <h3 className={styles.PersonalInfo_Detail}>
                                      Female
                                    </h3>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className={styles.PersonalInfo}>
                                    <h3 className={styles.PersonalInfo_Title}>
                                      Date of Birth
                                    </h3>
                                    <h3 className={styles.PersonalInfo_Detail}>
                                      March 23, 1997{" "}
                                      <span className={styles.PersonalInfo_Title}>
                                        {" "}
                                        (26 y.o)
                                      </span>{" "}
                                    </h3>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className={styles.PersonalInfo}>
                                    <h3 className={styles.PersonalInfo_Title}>
                                      Language
                                    </h3>
                                    <h3 className={styles.PersonalInfo_Detail}>
                                      English, French,{" "}
                                    </h3>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className={styles.userProfileDetailsAbout}>
                              <h2 className={styles.userProfileDetailsHeading}>
                                Personal Info
                              </h2>

                              <h4 className={styles.sub_title}>About Me</h4>
                              <p className={styles.descriptionTrack}>
                                I’m a product designer + filmmaker currently working
                                remotely at Twitter from beautiful Manchester,
                                United Kingdom. I’m passionate about designing
                                digital products that have a positive impact on the
                                world.
                              </p>
                              <p className={styles.descriptionTrack}>
                                For 10 years, I’ve specialised in interface,
                                experience & interaction design as well as working
                                in user research and product strategy for product
                                agencies, big tech companies & start-ups.
                              </p>

                              <div className={`${styles.rowGap} row border-0`}>
                                <div className="col-md-6">
                                  <div className={styles.PersonalInfo}>
                                    <h3 className={styles.PersonalInfo_Title}>
                                      Current Job
                                    </h3>
                                    <h3 className={styles.PersonalInfo_Detail}>
                                      Product Designer
                                    </h3>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className={styles.PersonalInfo}>
                                    <h3 className={styles.PersonalInfo_Title}>
                                      Experience in Years
                                    </h3>
                                    <h3 className={styles.PersonalInfo_Detail}>
                                      4 Years
                                    </h3>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className={styles.PersonalInfo}>
                                    <h3 className={styles.PersonalInfo_Title}>
                                      Company name
                                    </h3>
                                    <h3 className={styles.PersonalInfo_Detail}>
                                      Facebook{" "}
                                    </h3>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className={styles.PersonalInfo}>
                                    <h3 className={styles.PersonalInfo_Title}>
                                      Skill set
                                    </h3>
                                    <ul className={styles.skillBox}>
                                      <li className={styles.skillsItems}>
                                        Project Management
                                      </li>
                                      <li className={styles.skillsItems}>
                                        Copywritingt
                                      </li>
                                      <li className={styles.skillsItems}>
                                        English
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                                <div className={`col-md-6 ${styles.marginTop}`}>
                                  <div className={styles.PersonalInfo}>
                                    <h3 className={styles.PersonalInfo_Title}>
                                      Highest Qualification Held
                                    </h3>
                                    <h3 className={styles.PersonalInfo_Detail}>
                                      Bachelors in Engineering
                                    </h3>
                                  </div>
                                </div>
                              </div>
                            </div>
                        </div>
                      </Tab>
                      <Tab eventKey="cv" title="CV">

                      <div className={styles.tabs_main_bx}>
                          <div className={styles.blurblock}>
                              <img src="/assets/img/cv-blur-img.png" alt="blur-img" />
                          </div>
                          <div className={styles.userProfileDetailsBox}>
                            <h2 className={styles.userProfileDetailsHeading}>
                              Personal Info
                            </h2>
                            <div className={`${styles.rowGap} row`}>
                              <div className="col-md-6">
                                <div className={styles.PersonalInfo}>
                                  <h3 className={styles.PersonalInfo_Title}>
                                    Full Name
                                  </h3>
                                  <h3 className={styles.PersonalInfo_Detail}>
                                    Anna Asol
                                  </h3>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className={styles.PersonalInfo}>
                                  <h3 className={styles.PersonalInfo_Title}>
                                    Gender
                                  </h3>
                                  <h3 className={styles.PersonalInfo_Detail}>
                                    Female
                                  </h3>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className={styles.PersonalInfo}>
                                  <h3 className={styles.PersonalInfo_Title}>
                                    Date of Birth
                                  </h3>
                                  <h3 className={styles.PersonalInfo_Detail}>
                                    March 23, 1997{" "}
                                    <span className={styles.PersonalInfo_Title}>
                                      {" "}
                                      (26 y.o)
                                    </span>{" "}
                                  </h3>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className={styles.PersonalInfo}>
                                  <h3 className={styles.PersonalInfo_Title}>
                                    Language
                                  </h3>
                                  <h3 className={styles.PersonalInfo_Detail}>
                                    English, French,{" "}
                                  </h3>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className={styles.userProfileDetailsAbout}>
                            <h2 className={styles.userProfileDetailsHeading}>
                              Personal Info
                            </h2>

                            <h4 className={styles.sub_title}>About Me</h4>
                            <p className={styles.descriptionTrack}>
                              I’m a product designer + filmmaker currently working
                              remotely at Twitter from beautiful Manchester,
                              United Kingdom. I’m passionate about designing
                              digital products that have a positive impact on the
                              world.
                            </p>
                            <p className={styles.descriptionTrack}>
                              For 10 years, I’ve specialised in interface,
                              experience & interaction design as well as working
                              in user research and product strategy for product
                              agencies, big tech companies & start-ups.
                            </p>

                            <div className={`${styles.rowGap} row border-0`}>
                              <div className="col-md-6">
                                <div className={styles.PersonalInfo}>
                                  <h3 className={styles.PersonalInfo_Title}>
                                    Current Job
                                  </h3>
                                  <h3 className={styles.PersonalInfo_Detail}>
                                    Product Designer
                                  </h3>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className={styles.PersonalInfo}>
                                  <h3 className={styles.PersonalInfo_Title}>
                                    Experience in Years
                                  </h3>
                                  <h3 className={styles.PersonalInfo_Detail}>
                                    4 Years
                                  </h3>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className={styles.PersonalInfo}>
                                  <h3 className={styles.PersonalInfo_Title}>
                                    Company name
                                  </h3>
                                  <h3 className={styles.PersonalInfo_Detail}>
                                    Facebook{" "}
                                  </h3>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className={styles.PersonalInfo}>
                                  <h3 className={styles.PersonalInfo_Title}>
                                    Skill set
                                  </h3>
                                  <ul className={styles.skillBox}>
                                    <li className={styles.skillsItems}>
                                      Project Management
                                    </li>
                                    <li className={styles.skillsItems}>
                                      Copywritingt
                                    </li>
                                    <li className={styles.skillsItems}>
                                      English
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className={styles.PersonalInfo}>
                                  <h3 className={styles.PersonalInfo_Title}>
                                    Highest Qualification Held
                                  </h3>
                                  <h3 className={styles.PersonalInfo_Detail}>
                                    Bachelors in Engineering
                                  </h3>
                                </div>
                              </div>
                            </div>
                          </div>
                      </div> 

                      </Tab>
                      <Tab eventKey="profile" title="Hiring Progress">
                        <div className={styles.tabs_main_bx}>
                            <div className={styles.userProfileDetailsBox}>
                              <h2 className={styles.userProfileDetailsHeading}>
                                Personal Info
                              </h2>
                              <div className={`${styles.rowGap} row`}>
                                <div className="col-md-6">
                                  <div className={styles.PersonalInfo}>
                                    <h3 className={styles.PersonalInfo_Title}>
                                      Full Name
                                    </h3>
                                    <h3 className={styles.PersonalInfo_Detail}>
                                      Anna Asol
                                    </h3>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className={styles.PersonalInfo}>
                                    <h3 className={styles.PersonalInfo_Title}>
                                      Gender
                                    </h3>
                                    <h3 className={styles.PersonalInfo_Detail}>
                                      Female
                                    </h3>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className={styles.PersonalInfo}>
                                    <h3 className={styles.PersonalInfo_Title}>
                                      Date of Birth
                                    </h3>
                                    <h3 className={styles.PersonalInfo_Detail}>
                                      March 23, 1997{" "}
                                      <span className={styles.PersonalInfo_Title}>
                                        {" "}
                                        (26 y.o)
                                      </span>{" "}
                                    </h3>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className={styles.PersonalInfo}>
                                    <h3 className={styles.PersonalInfo_Title}>
                                      Language
                                    </h3>
                                    <h3 className={styles.PersonalInfo_Detail}>
                                      English, French,{" "}
                                    </h3>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className={styles.userProfileDetailsAbout}>
                              <h2 className={styles.userProfileDetailsHeading}>
                                Personal Info
                              </h2>

                              <h4 className={styles.sub_title}>About Me</h4>
                              <p className={styles.descriptionTrack}>
                                I’m a product designer + filmmaker currently working
                                remotely at Twitter from beautiful Manchester,
                                United Kingdom. I’m passionate about designing
                                digital products that have a positive impact on the
                                world.
                              </p>
                              <p className={styles.descriptionTrack}>
                                For 10 years, I’ve specialised in interface,
                                experience & interaction design as well as working
                                in user research and product strategy for product
                                agencies, big tech companies & start-ups.
                              </p>

                              <div className={`${styles.rowGap} row border-0`}>
                                <div className="col-md-6">
                                  <div className={styles.PersonalInfo}>
                                    <h3 className={styles.PersonalInfo_Title}>
                                      Current Job
                                    </h3>
                                    <h3 className={styles.PersonalInfo_Detail}>
                                      Product Designer
                                    </h3>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className={styles.PersonalInfo}>
                                    <h3 className={styles.PersonalInfo_Title}>
                                      Experience in Years
                                    </h3>
                                    <h3 className={styles.PersonalInfo_Detail}>
                                      4 Years
                                    </h3>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className={styles.PersonalInfo}>
                                    <h3 className={styles.PersonalInfo_Title}>
                                      Company name
                                    </h3>
                                    <h3 className={styles.PersonalInfo_Detail}>
                                      Facebook{" "}
                                    </h3>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className={styles.PersonalInfo}>
                                    <h3 className={styles.PersonalInfo_Title}>
                                      Skill set
                                    </h3>
                                    <ul className={styles.skillBox}>
                                      <li className={styles.skillsItems}>
                                        Project Management
                                      </li>
                                      <li className={styles.skillsItems}>
                                        Copywritingt
                                      </li>
                                      <li className={styles.skillsItems}>
                                        English
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                                <div className={`col-md-6 ${styles.marginTop}`}>
                                  <div className={styles.PersonalInfo}>
                                    <h3 className={styles.PersonalInfo_Title}>
                                      Highest Qualification Held
                                    </h3>
                                    <h3 className={styles.PersonalInfo_Detail}>
                                      Bachelors in Engineering
                                    </h3>
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
      isProtected: true
    },
  };
}

export default ManageJobs;
