import useOutsideAlerter from "@/hooks/useOutsideAlerter";
import { logout } from "@/store/authSlice";
import { openAuthSidebar, setModal } from "@/store/siteSlice";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AccountActionDropdown from "./AccountActionDropdown";
import FlagLang from "../FlagLang";
import { EMPLOYER_URL } from "@/api";
// import styles from "../styles/HomeHeader.module.css"

const HomeHeader = () => {
  const wrapperRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const { pathname, asPath } = router;
  const { firstName, lastName } = useSelector((store) => store.auth);
  const { isMobileSidebarOpen } = useSelector((store) => store.site);
  const [isEmployer, setIsEmployer] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  useOutsideAlerter(wrapperRef);

  const goToPage = (bool) => {
    if (["/", "/employer", "/contact-us", "/course"].includes(pathname)) {
      if (bool) {
        router.replace("/employer");
      } else {
        router.replace(asPath == "/employer" ? "/" : `/${asPath}`);
      }
    }
  };

  const toggleEmployerHandler = (e) => {
    window.location.href = EMPLOYER_URL;
    // setIsEmployer(false);
    // goToPage(false);
  };

  useEffect(() => {
    goToPage(false);
    setIsEmployer(false);
   
  }, []);

  const employerToggleCloseHandler = (e) => {
    localStorage.setItem("isEmployer", JSON.stringify(false));
    setIsEmployer(false);
  };

  return (
    <header id="header" className="login_header">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <nav className="navbar navbar-expand-lg">
              <Link
                onClick={() => {
                  // setIsMobileNavOpen((prev) => !prev)
                  // dispatch(openAuthSidebar(!isMobileSidebarOpen));
                  employerToggleCloseHandler();
                }}
                className="navbar-brand"
                href="/"
              >
                <img src="img/logo.svg" alt="" />
              </Link>

              <button
                className={`navbar-toggler navDetect ${
                  isMobileSidebarOpen ? "menu-opened" : ""
                }`}
                type="button"
                onClick={() => {
                  // setIsMobileNavOpen((prev) => !prev)
                  dispatch(openAuthSidebar(!isMobileSidebarOpen));
                }}
              >
                <span className="navbar-toggler-icon navDetect"></span>
              </button>

              <div
                className="overlay"
                style={isMobileSidebarOpen ? {} : { display: "none" }}
              ></div>

              <div
                ref={wrapperRef}
                className={`collapse navbar-collapse ${
                  isMobileSidebarOpen ? "menu-show" : ""
                }`}
              >
                <ul className="navbar-nav left_nav_space">
                  <li
                    className={`nav-item desktop_hide ${
                      ["/", "/employer"].includes(pathname) ? "active" : ""
                    }`}
                  >
                    <h5>
                      Hello! {firstName} {lastName}
                    </h5>
                  </li>
                  <li
                    className={`nav-item ${
                      ["/#ourstory"].includes(asPath) ? "active" : ""
                    }`}
                    // className={`nav-item ${
                    //   pathname == "/#ourstory" ? "active" : ""
                    // }`}
                  >
                    <Link
                      className="nav-link"
                      href="/#ourstory"
                      onClick={() => {
                        // // setIsMobileNavOpen((prev) => !prev);
                        dispatch(openAuthSidebar(!isMobileSidebarOpen));
                        if (pathname === "/employer") {
                          employerToggleCloseHandler();
                        }
                      }}
                    >
                      Our Story
                    </Link>
                  </li>
                  <li
                    className={`nav-item ${
                      ["/#ourgates"].includes(asPath) ? "active" : ""
                    }`}

                    // className={`nav-item ${
                    //   pathname == "/#ourgates" ? "active" : ""
                    // }`}
                  >
                    <Link
                      className="nav-link"
                      href="/#ourgates"
                      onClick={() => {
                        // // setIsMobileNavOpen((prev) => !prev);
                        dispatch(openAuthSidebar(!isMobileSidebarOpen));
                        if (isEmployer == false) {
                          employerToggleCloseHandler();
                        }
                      }}
                    >
                      Our Gates
                    </Link>
                  </li>
                  {/* <li
                               className={`nav-item ${
                                   asPath == "/#pricingsection" ? "active" : ""
                                    }`}
                                 >
                                 <Link
                               className="nav-link"
                                href="/#pricingsection"
                                 onClick={() => {
                            dispatch(openAuthSidebar(!isMobileSidebarOpen));
                             // window.location.replace("/#pricingsection");
                       // setIsMobileNavOpen((prev) => !prev);
                           }}
                        >
                        Pricing
                     </Link>
                  </li> */}
                  <li
                    className={`nav-item ${
                      pathname.includes("/contact-us") ? "active" : ""
                    }`}
                  >
                    <Link
                      onClick={() => {
                        // setIsMobileNavOpen((prev) => !prev)
                        dispatch(openAuthSidebar(!isMobileSidebarOpen));
                        if (isEmployer == false) {
                          employerToggleCloseHandler();
                        }
                      }}
                      className="nav-link"
                      href="/contact-us"
                    >
                      Contact Us
                    </Link>
                  </li>

                  <li className="nav-item login_btn">
                    <div className="nav_switch_box">
                      <div className="form-check form-switch ps-0">
                        <label
                          className="form-check-label"
                          htmlFor="flexSwitchCheckChecked"
                       
                        >
                          Career Seeker
                        </label>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="flexSwitchCheckChecked"
                          // defaultChecked={isEmployer}
                          defaultChecked={false}
                          onClick={toggleEmployerHandler}
                          style={{cursor: "pointer"}}
                        />
                        <label
                          className="form-check-label p-sm-0 pe-0 pe-xl-0"
                          htmlFor="flexSwitchCheckChecked"
                        >
                          Employer
                        </label>
                      </div>
                    </div>
                  </li>

                  <li>
                    <FlagLang />
                  </li>
                </ul>
                <div class="mobile_logo">
                  <Link
                    href="/"
                    onClick={() => {
                      // dispatch(openAuthSidebar(!isMobileSidebarOpen));
                      employerToggleCloseHandler();
                    }}
                  >
                    {" "}
                    <img src="/img/logo.svg" alt="" />
                  </Link>
                </div>
              </div>
              <AccountActionDropdown />

              {/* For Mobile */}

              {/* <div className="extra_nav for_mobile">
<ul className="navbar-nav ms-auto">
<li className="nav-item langugae_filter">
<a className="nav-link extra_btn dropdown-toggle lang_drop" href="javascript:void(0);">
<span className="flag_ico"><img src="img/en_flag.png" alt=""/></span> En
</a>
<div className="lang_dropdown">
<div className="lang_country">
<span className="flag_ico">
<img src="img/en_flag.png" alt=""/>
</span> En
</div>
<div className="lang_country">
<span className="flag_ico">
<img src="img/fr_flag.png" alt=""/>
</span> Fr
</div>
</div>
</li>
</ul>
</div> */}

              {/* <div className="nav-item dropdown user_dropdown">
<a className="nav-link dropdown-toggle" href="javascript:void(0);" id="user-drop" role="button"
data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
<img src="img/user.png" alt=""/>
</a>
<div className="dropdown-menu" aria-labelledby="user-drop">
<div className="user_info">
<div className="user_name">
<div>Sandeep Prajapati</div>
<div className="user_email">
<small>Sandeep@gmail.com</small>
</div>
</div>
<ul>
<li>
<a href="javascript:void(0);"><i className="ion-android-person"></i> My Profile</a>
</li>
<li>
<a href="javascript:void(0);"><i className="ion-log-out"></i> Logout</a>
</li>
</ul>
</div>
</div>
</div> */}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
