import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "../styles/Header.module.css";

const Header = () => {
  const router = useRouter();
  const { pathname } = router;
  const [isEmployer, setIsEmployer] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const goToPage = (bool) => {
    if (["/", "/employer"].includes(pathname)) {
      if (bool) {
        router.push("/employer");
      } else {
        router.push("/");
      }
    }
  };

  const toggleEmployerHandler = (e) => {
    setIsEmployer((prev) => {
      localStorage.setItem("isEmployer", JSON.stringify(!prev));
      goToPage(!prev);
      return !prev;
    });
  };

  useEffect(() => {
    let bool = JSON.parse(localStorage.getItem("isEmployer"));
    goToPage(bool);
    setIsEmployer(bool);
  }, []);

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname]);

  return (
    <header id="header">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <nav className="navbar navbar-expand-lg">
              <Link className="navbar-brand" href="/">
                <img src="img/logo.svg" alt="" />
              </Link>

              <button
                className={`navbar-toggler ${
                  isMobileNavOpen ? "menu-opened" : ""
                }`}
                type="button"
                onClick={() => setIsMobileNavOpen((prev) => !prev)}
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              <div
                className="overlay"
                style={isMobileNavOpen ? {} : { display: "none" }}
              ></div>

              <div
                className={`collapse navbar-collapse ${
                  isMobileNavOpen ? "menu-show" : ""
                }`}
              >
                <ul className="navbar-nav left_nav_space">
                  <li
                    className={`nav-item ${
                      ["/", "/employer"].includes(pathname) ? "active" : ""
                    }`}
                  >
                    <Link
                      className="nav-link"
                      href="javascript:void(0);"
                      onClick={() =>
                        window.location.replace("/#ourgatessection")
                      }
                    >
                      Gates
                    </Link>
                  </li>
                  <li
                    className={`nav-item ${
                      pathname == "/pricing" ? "active" : ""
                    }`}
                  >
                    <Link
                      className="nav-link"
                      href="javascript:void(0);"
                      onClick={() =>
                        window.location.replace("/#pricingsection")
                      }
                    >
                      Pricing
                    </Link>
                  </li>
                  <li
                    className={`nav-item ${
                      pathname == "/contact-us" ? "active" : ""
                    }`}
                  >
                    <Link className="nav-link" href="/contact-us">
                      Contact Us
                    </Link>
                  </li>
                  <li
                    className={`nav-item ${
                      pathname == "/about-us" ? "active" : ""
                    }`}
                  >
                    <Link className="nav-link" href="/about-us">
                      About Us
                    </Link>
                  </li>
                </ul>

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
                            id="flexSwitchCheckChecked"
                            defaultChecked={isEmployer}
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
                    </li>
                    {isEmployer ? (
                      <>
                        <li className="nav-item login_btn">
                          <Link
                            className="nav-link extra_btn"
                            href="/dashboard"
                          >
                            Log in
                          </Link>
                        </li>
                        <li className="nav-item sign_up_btn">
                          <Link
                            className="nav-link extra_btn"
                            href="/dashboard"
                          >
                            Sign up
                          </Link>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="nav-item login_btn">
                          <Link className="nav-link extra_btn" href="/login">
                            Log in
                          </Link>
                        </li>
                        <li className="nav-item sign_up_btn">
                          <Link
                            className="nav-link extra_btn"
                            href="/signup-step-1"
                          >
                            Sign up
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
