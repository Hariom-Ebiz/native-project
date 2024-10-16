import useOutsideAlerter from "@/hooks/useOutsideAlerter";
import { openAuthSidebar, setModal } from "@/store/siteSlice";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FlagLang from "../FlagLang";
import { EMPLOYER_URL } from "@/api";

const Header = () => {
  const wrapperRef = useRef(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const { pathname, asPath, query } = router;
  const [isEmployer, setIsEmployer] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { isMobileSidebarOpen } = useSelector((store) => store.site);

  const { trigger } = useOutsideAlerter(wrapperRef);

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
    // setIsEmployer((prev) => {
    //   localStorage.setItem("isEmployer", JSON.stringify(!prev));
    //   goToPage(!prev);
    // //   dispatch(openAuthSidebar(!isMobileSidebarOpen));
    //   return !prev;
    // });
  };

  useEffect(() => {
    // let bool = JSON.parse(localStorage.getItem("isEmployer"));
    goToPage(false);
    setIsEmployer(false);
  }, []);

  const employerToggleCloseHandler = () => {
    // localStorage.setItem("isEmployer", JSON.stringify(false));
    setIsEmployer(false);
  };

  return (
    <header id="header">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <nav className="navbar navbar-expand-lg">
              <Link
                onClick={() => {
                //   dispatch(openAuthSidebar(!isMobileSidebarOpen));
                  employerToggleCloseHandler();
                }}
                className="navbar-brand"
                href="/"
              >
                <img src="/img/logo.svg" alt="" />
              </Link>
              <div className="nav_switch_box d-lg-none mobile_swicth">
                <div className="form-check form-switch">
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
                    // checked={false}
                    defaultChecked={false}
                    onClick={toggleEmployerHandler}
                  />
                  <label
                    className="form-check-label p-sm-0 pe-0 pe-xl-0"
                    htmlFor="flexSwitchCheckChecked"
                  >
                    Employer
                  </label>
                </div>
              </div>
              <button
                className={`navbar-toggler navDetect ${
                  isMobileSidebarOpen ? "menu-opened" : ""
                }`}
                type="button"
                onClick={() => {
                  if (isMobileSidebarOpen) {
                    dispatch(openAuthSidebar(false));
                  } else if (!isMobileSidebarOpen) {
                    dispatch(openAuthSidebar(true));
                  }
                }
            }
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
                    className={`nav-item ${
                      ["/#ourstory"].includes(asPath) ? "active" : ""
                    }`}
                  >
                    <Link
                      className="nav-link"
                      href="/#ourstory"
                      onClick={() => {
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
                  >
                    <Link
                      className="nav-link"
                      href="/#ourgates"
                      onClick={() => {
                        dispatch(openAuthSidebar(!isMobileSidebarOpen));
                        if (pathname === "/employer") {
                          employerToggleCloseHandler();
                        }
                      }}
                    >
                      Our Gates
                    </Link>
                  </li>
                  <li
                    className={`nav-item ${
                      // pathname == "/contact-us" ? "active" : ""
                      ["/contact-us"].includes(asPath) ? "active" : ""
                    }`}
                  >
                    <Link
                      className="nav-link"
                      href="/contact-us"
                      onClick={() => {
                        dispatch(openAuthSidebar(!isMobileSidebarOpen));
                        if (pathname === "/employer") {
                          employerToggleCloseHandler();
                        }
                      }}
                    >
                      Contact Us
                    </Link>
                  </li>
                  {/* <li
                    className={`nav-item ${
                      // pathname == "/pricing" ? "active" : ""
                      ["/#pricingsection", "/pricing"].includes(asPath) ? "active" : ""
                      
                    }`}
                  >
                    <Link
                      href="/#pricingsection"
                      className="nav-link"
                      onClick={() => {
                        // window.location.replace("/#pricingsection");
                        // // setIsMobileNavOpen((prev) => !prev);
                        dispatch(openAuthSidebar(!isMobileSidebarOpen));
                      }}
                    >
                      Pricing
                    </Link>
                  </li> */}

                </ul>
                <div class="mobile_logo">
                  <Link href="/"     
                //   onClick={() => {
                // //   dispatch(openAuthSidebar(!isMobileSidebarOpen));
                //   employerToggleCloseHandler();
                // }}
                >
                    {" "}
                    <img src="/img/logo.svg" alt="" />
                  </Link>
                </div>
                <div className="extra_nav">
                  <ul className="navbar-nav ms-auto">
                    <li className="nav-item login_btn">
                      <div className="nav_switch_box">
                        <div className="form-check form-switch">
                          <label
                            className="form-check-label"
                            htmlFor="flexSwitchCheckChecked"
                          >
                            Career Seeker
                          </label>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            // checked = {false}
                            id="flexSwitchCheckChecked"
                            defaultChecked={false}
                            // defaultChecked={Boolean(isEmployer)}
                            onClick={()=>{
                                toggleEmployerHandler();
                                dispatch(openAuthSidebar(!isMobileSidebarOpen));
                            }}
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
                    {isEmployer ? (
                      <>
                        <li className="nav-item login_btn">
                          <Link
                            className="nav-link extra_btn"
                            href="/employer/login"
                            onClick={() => {
                              // setIsMobileNavOpen((prev) => !prev)
                              dispatch(openAuthSidebar(!isMobileSidebarOpen));
                            }}
                          >
                            Log in
                          </Link>
                        </li>
                        <li className="nav-item sign_up_btn sign_up_mobiles">
                          <Link
                            className="nav-link extra_btn"
                            href="/employer/sign-up"
                            onClick={() => {
                              // setIsMobileNavOpen((prev) => !prev)
                              dispatch(openAuthSidebar(!isMobileSidebarOpen));
                            }}
                          >
                            Sign up
                          </Link>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="nav-item  login_btn">
                          <Link
                            className="nav-link extra_btn"
                            href="/signup-step-1"
                            onClick={() => {
                              // setIsMobileNavOpen((prev) => !prev)
                              dispatch(openAuthSidebar(!isMobileSidebarOpen));
                            }}
                          >
                            Register
                          </Link>
                        </li>
                        <li className="nav-item sign_up_btn">
                          <Link
                            className="nav-link extra_btn"
                            href="/login"
                            onClick={() => {
                              // setIsMobileNavOpen((prev) => !prev)
                              dispatch(openAuthSidebar(!isMobileSidebarOpen));
                            }}
                          >
                            Log in
                          </Link>
                        </li>
                      </>
                    )}

                    {/* <li className="nav-item langugae_filter for_desktop">
                                    <a className="nav-link extra_btn dropdown-toggle lang_drop"
                                        href="javascript:void(0);">
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
                                </li>  */}
                  </ul>
                </div>
              </div>

              {/* For Mobile  */}

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
                    </div>  */}

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
                    </div>  */}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
