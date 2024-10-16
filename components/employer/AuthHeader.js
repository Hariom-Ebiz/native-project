import { openAuthSidebar } from "@/store/siteSlice";
import Link from "next/link";
import React, { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AccountActionDropdown from "./AccountActionDropdown";
import { useRouter } from "next/router";
import FlagLang from "@/components/FlagLang";
import { logout } from "@/store/authSlice";
import LogOut from "../logout";
import { IMAGEBASEURL } from "@/api";

const AuthHeader = ({data}) => {
    const { isMobileSidebarOpen } = useSelector((store) => store.site);
    const { companyProfile } = useSelector((store) => store.auth);
    const [backId, setBackId] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const { asPath } = router;
  
    useEffect(() => {
      let id;
      if (asPath) {
        id = asPath.split("=")?.[1];
        if (id && id != "true") {
          setBackId(+id);
        } else if (id) {
          setBackId("");
        }
      }
    }, []);

    return (
        <div className="dash_header">
         <div className="dash_logo">
            <Link href="/">
            <img src="/img/logo.svg" alt="" />
            <img className="logo_fold" src="/img/dash_logo_icon.svg" alt="" />
            </Link>
        </div>
        <div className="nav_dash_wrap">
          <div className="nav_dash_wrpLeft">
            <div className="company_info">
              <span className="company_logo">
                <img width="50" src={(companyProfile?.logo) ? `${IMAGEBASEURL}${companyProfile.logo}` : ""} alt="" />
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
                <Link href="/employer/post-job" className="post_btn">
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
                </Link>
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
    )
}

export default AuthHeader;