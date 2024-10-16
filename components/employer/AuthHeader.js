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
import { updateLoading, setModal } from "@/store/siteSlice";
import useRequest from "@/hooks/useRequest";
import Dropdown from 'react-bootstrap/Dropdown';
import moment from "moment"
import { useTranslation } from 'react-i18next';
import nookies from "nookies";

const AuthHeader = ({data}) => {
  const { t,i18n } = useTranslation("common");
  // console.log("language : ", i18n.changeLanguage("ar"))
  // useEffect(()=>{
  //   i18n.changeLanguage("ar").then(()=>{
  //     console.log("changed");
  //   }).catch(err => {
  //     console.log("err",err);
  //   })
  // },[])
    const { isMobileSidebarOpen,loading } = useSelector((store) => store.site);
    const { request } = useRequest();
    const { companyProfile, token } = useSelector((store) => store.auth);
    const [backId, setBackId] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const { asPath } = router;
    const [totalNotifications, setTotalNotifications] = useState(0);
    const [notificationsList, setNotificationsList] = useState([]);

    const cookies = nookies.get()
  console.log("cookies : ", cookies);

  useEffect(()=> {
    
    if(token && cookies.token && cookies.token != token){
      window.location.reload()
    }
  },[])

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

    router.events.on('routeChangeError', ()=> {
      if(!loading){
        dispatch(updateLoading(true));
      }
    });

  const {request: requestNotifications, response: responseNotifications} = useRequest()
  const {request: requestNotificationsCount, response: responseNotificationsCount} = useRequest()
  
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

    useEffect(()=>{
      if(responseNotifications){
        const {status, totalDocuments, notificationsData, message} = responseNotifications;
        // console.log("responseNotifications",responseNotifications)
        // setTotalNotifications(totalDocuments)
        setNotificationsList(notificationsData);
      }
    },[responseNotifications])
  
    useEffect(()=>{
      if(responseNotificationsCount){
        setTotalNotifications(responseNotificationsCount.count);
      }
    },[responseNotificationsCount])

    const seeNotification = (notifId) => {
      request("GET", `notification/read-one?notifId=${notifId}`)
    }

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

                      <div class="notiHeader_top">
                          <div class="notiHeaderTopHeading">
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
                              <span class="">Notifications</span>
                          </div>
                          {notificationsList.length > 0 && <Link class="viewBtn" href="/employer/notifications">
                              <small>View All</small>
                          </Link>}
                          
                      </div>

                      <div className="notification_track" style={{height:notificationsList.length == 0 ? "100%" : "250px"}}>
                          {notificationsList?.map(notif => {
                            return <Dropdown.Item href={(notif.redirect_link) ? notif.redirect_link : ""}>
                              <div class="notiListCard">
                                  <Link href={(notif.redirect_link) ? notif.redirect_link : ""} onClick={() => seeNotification(notif.id)} class="notiListContent">
                                      <p>
                                          {notif.title}
                                      </p>
                                      <small>{moment(notif.created_at).format('DD MMMM, YYYY | hh:mm A')}</small>
                                  </Link>
                              </div>
                            </Dropdown.Item>
                          })}
                          {notificationsList.length == 0 && <p style={{padding:"15px 25px"}}>No Notification Found!</p>}
                        </div>
                      </Dropdown.Menu>
                </Dropdown>
            </div>  
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
                  <span className="post_btn_text">{t("Post a Job")}</span>
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