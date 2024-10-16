import { openAuthSidebar } from "@/store/siteSlice";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AccountActionDropdown from "./AccountActionDropdown";

const AuthHeader = ({ data }) => {
  const { isMobileSidebarOpen } = useSelector((store) => store.site);
  const dispatch = useDispatch();

  return (
    <div className="dash_header">
      <div className="dash_logo">
        <Link href="/employer">
          <img src="/img/logo.svg" alt="" />
          <img className="logo_fold" src="/img/dash_logo_icon.svg" alt="" />
        </Link>
      </div>
      <div className="nav_dash_wrap">
        <div className="nav_dash_wrpLeft">
          <div className="page_heading">
            <h1 className="dash_page_heading">
              {data?.backArrow ? (
                <Link className="back_arrow" href={data.backArrow || "/course"}>
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_543_19418)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M6.66699 20.0002C6.66699 19.0797 7.41318 18.3335 8.33366 18.3335H31.667C32.5875 18.3335 33.3337 19.0797 33.3337 20.0002C33.3337 20.9206 32.5875 21.6668 31.667 21.6668H8.33366C7.41318 21.6668 6.66699 20.9206 6.66699 20.0002Z"
                        fill="Currentcolor"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M7.15515 18.8217C7.80602 18.1708 8.8613 18.1708 9.51217 18.8217L19.5122 28.8217C20.163 29.4725 20.163 30.5278 19.5122 31.1787C18.8613 31.8295 17.806 31.8295 17.1551 31.1787L7.15515 21.1787C6.50427 20.5278 6.50427 19.4725 7.15515 18.8217Z"
                        fill="Currentcolor"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M19.5122 8.82165C20.163 9.47253 20.163 10.5278 19.5122 11.1787L9.51217 21.1787C8.8613 21.8295 7.80602 21.8295 7.15515 21.1787C6.50427 20.5278 6.50427 19.4725 7.15515 18.8217L17.1551 8.82165C17.806 8.17078 18.8613 8.17078 19.5122 8.82165Z"
                        fill="Currentcolor"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_543_19418">
                        <rect width="40" height="40" fill="Currentcolor" />
                      </clipPath>
                    </defs>
                  </svg>
                </Link>
              ) : (
                ""
              )}
              {data?.title}
            </h1>
          </div>
        </div>
        <div className="nav_dash_wrpRight">
          {/* <div className="btn-group company_coinbase_box user_dropdown">
            <a
              className="dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span className="user_img">
                <img src="/img/profile-img.png" alt="" />
                <span className="dot_user"></span>
              </span>
              <span className="mobile_none">Username</span>
            </a>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li>
                <a className="dropdown-item" href="#">
                  Profile
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  {" "}
                  Subscription
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Log Out
                </a>
              </li>
            </ul>
          </div> */}
          <AccountActionDropdown />
          <a
            href="javascript:void(0);"
            onClick={() => dispatch(openAuthSidebar(!isMobileSidebarOpen))}
            className="dashIconFold"
            id="foldBtn"
          >
            <div className="notFolded navDetect">
              <svg
                viewBox="64 64 896 896"
                focusable="false"
                className="navDetect"
                data-icon="menu-fold"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  className="navDetect"
                  d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM115.4 518.9L271.7 642c5.8 4.6 14.4.5 14.4-6.9V388.9c0-7.4-8.5-11.5-14.4-6.9L115.4 505.1a8.74 8.74 0 0 0 0 13.8z"
                ></path>
              </svg>
            </div>

            <div className="folded navDetect">
              <svg
                viewBox="64 64 896 896"
                focusable="false"
                className="navDetect"
                data-icon="menu-unfold"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  className="navDetect"
                  d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z"
                ></path>
              </svg>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthHeader;
