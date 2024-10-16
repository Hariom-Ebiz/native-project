import { openAuthSidebar, updateLoading } from "@/store/siteSlice";
import Link from "next/link";
import React, { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dropdown from 'react-bootstrap/Dropdown';

import AccountActionDropdown from "./AccountActionDropdown";
import { useRouter } from "next/router";
import FlagLang from "../FlagLang";

import useRequest from "@/hooks/useRequest";
import moment from "moment";
import { useTranslation } from 'react-i18next';


const AuthHeader = ({ data }) => {
  const { t } = useTranslation("common");
  const { isMobileSidebarOpen,loading } = useSelector((store) => store.site);
  const { request } = useRequest()
  const [backId, setBackId] = useState(false);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [notificationsList, setNotificationsList] = useState([]);
  const router = useRouter();
  const dispatch = useDispatch();
  const { asPath } = router;

  router.events.on('routeChangeStart', ()=> {
    if(!loading){
      dispatch(updateLoading(true));
    }
  })

  router.events.on('routeChangeComplete', ()=> {
    if(loading){
      dispatch(updateLoading(false));
    }
  });

  const { request: requestNotifications, response: responseNotifications } = useRequest()
  const { request: requestNotificationsCount, response: responseNotificationsCount } = useRequest()

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
    requestNotifications("get", "notification/all?page=1&per_page=10")
    requestNotificationsCount("get", "notification/unseen-notification-count")
  }, []);

  useEffect(() => {
    if (responseNotifications) {
      const { status, totalDocuments, notificationsData, message } = responseNotifications;
      // console.log("responseNotifications",responseNotifications)
      // setTotalNotifications(totalDocuments)
      setNotificationsList(notificationsData);
    }
  }, [responseNotifications])

  useEffect(() => {
    if (responseNotificationsCount) {
      setTotalNotifications(responseNotificationsCount.count);
    }
  }, [responseNotificationsCount])

  const seeNotification = (notifId) => {
    request("GET", `notification/read-one?notifId=${notifId}`)
  }

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
              ) : data.isRedirecttoPreviousPage ? (
                <button className="back_arrow" style={{ background: "transparent", border: "0" }} onClick={() => router.back()}>
                  {data.isRedirecttoPreviousPage && window.history.length <= 1 ? "" : <svg
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
                  </svg>}

                </button>
              ) : (
                ""
              )}
              {/* {t("Job’s Roadway")} */}
              {t(data?.title)}
            </h1>
          </div>
        </div>
        <div className="nav-dash-right-preant">
          <FlagLang />

          <div className="notification_block">
            <Dropdown>
              <Dropdown.Toggle className="notification_btn" id="dropdown-basic">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                  <path d="M13.7295 21C13.5537 21.3031 13.3014 21.5547 12.9978 21.7295C12.6941 21.9044 12.3499 21.9965 11.9995 21.9965C11.6492 21.9965 11.3049 21.9044 11.0013 21.7295C10.6977 21.5547 10.4453 21.3031 10.2695 21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                {totalNotifications > 0 && <span className="notification_counter">{totalNotifications}</span>}
              </Dropdown.Toggle>
              <Dropdown.Menu>

                <div className="notiHeader_top">
                  <div className="notiHeaderTopHeading">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
                        stroke="black" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                      <path
                        d="M13.7295 21C13.5537 21.3031 13.3014 21.5547 12.9978 21.7295C12.6941 21.9044 12.3499 21.9965 11.9995 21.9965C11.6492 21.9965 11.3049 21.9044 11.0013 21.7295C10.6977 21.5547 10.4453 21.3031 10.2695 21"
                        stroke="black" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                    </svg>
                    <span className="">{t("Notifications")}</span>
                  </div>
                  {notificationsList.length > 0 && <Link className="viewBtn" href="/job-seeker/notifications">
                    <small>{t("View All")}</small>
                  </Link>}

                </div>

                <div className="notification_track" style={{ height: notificationsList.length == 0 ? "100%" : "250px" }}>
                  {notificationsList?.map(notif => {
                    return <Dropdown.Item href={(notif.redirect_link) ? notif.redirect_link : ""}>
                      <div className="notiListCard">
                        <Link href={(notif.redirect_link) ? notif.redirect_link : ""} onClick={() => seeNotification(notif.id)} className="notiListContent">
                          <p style={{textTransform: "capitalize"}}>
                            {notif.title}
                          </p>
                          <small>{moment(notif.created_at).format('DD MMMM, YYYY | hh:mm A')}</small>
                        </Link>
                      </div>
                    </Dropdown.Item>
                  })}
                  {notificationsList.length == 0 && <p style={{ padding: "15px 25px" }}>{t("No Notification Found!")}</p>}
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="nav_dash_wrpRight">
            {backId != "" && backId != undefined && !isNaN(backId) && (
              <div className="right_btn_head">
                {/* <button className="btn btn-primary header_btnNew">Skip Now</button> */}
                <Link href={`/course/lesson/${backId}`}>
                  <button className="btn btn-primary header_btnNew">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_1_10)">
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M7.93999 13.06C7.65909 12.7787 7.50131 12.3975 7.50131 12C7.50131 11.6025 7.65909 11.2212 7.93999 10.94L13.596 5.282C13.8774 5.00074 14.259 4.84278 14.6568 4.84287C14.8538 4.84292 15.0489 4.88177 15.2309 4.9572C15.4129 5.03263 15.5782 5.14317 15.7175 5.2825C15.8568 5.42183 15.9672 5.58723 16.0426 5.76925C16.1179 5.95127 16.1567 6.14635 16.1566 6.34335C16.1566 6.54035 16.1177 6.73541 16.0423 6.9174C15.9669 7.09939 15.8563 7.26473 15.717 7.404L11.122 12L15.718 16.596C15.8613 16.7343 15.9757 16.8998 16.0544 17.0827C16.1331 17.2657 16.1745 17.4625 16.1764 17.6617C16.1782 17.8608 16.1403 18.0584 16.065 18.2428C15.9897 18.4271 15.8784 18.5947 15.7376 18.7356C15.5968 18.8765 15.4294 18.9879 15.2451 19.0634C15.0608 19.139 14.8633 19.177 14.6641 19.1754C14.4649 19.1737 14.2681 19.1324 14.085 19.0539C13.902 18.9754 13.7364 18.8612 13.598 18.718L7.93999 13.06Z"
                          fill="currentcolor"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_1_10">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    {t("Back To Journey")}
                  </button>
                </Link>
              </div>
            )}

            <AccountActionDropdown data={data}/>
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
    </div>
  );
};

export default AuthHeader;
