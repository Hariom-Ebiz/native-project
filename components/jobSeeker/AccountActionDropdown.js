import { API } from "@/api";
import { logout } from "@/store/authSlice";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { createAxiosCookies, getCookies } from "@/fn";
import { useDispatch, useSelector } from "react-redux";
import FlagLang from "../FlagLang";
import LogOut from "../logout";
import { useTranslation } from 'react-i18next';
import { useRouter } from "next/router";
import nookies from "nookies";

const AccountActionDropdown = ({}) => {
  const { t } = useTranslation("common");
  const route = useRouter()
  const { loggedIn, firstName, lastName, profilePic, role, token } = useSelector(
    (store) => store.auth
  );
  const cookies = nookies.get()
  console.log("cookies : ", cookies);
  
  const [firstname, setFirstName] = useState(firstName)
  const dispatch = useDispatch();

  const logOutUser = () => {
    dispatch(logout());
  }

  useEffect(()=> {
    
    if(token && cookies.token && cookies.token != token){
      window.location.reload()
    }
  },[])

  return (
    <div className="btn-group company_coinbase_box user_dropdown dash_dropdown">

      <a
        className="dropdown-toggle"
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {profilePic && firstname ? (
          <>
            <span className="user_img">
              <img
                src={`${API}/${profilePic}`}
                alt=""
                style={{ width: "40px", height: "40px" }}
              />
              {firstname}
            </span>
          </>
        ) : (
          <>
            <span className="user_img">
              <img
                src="/img/user-icon.png"
                alt=""
                style={{ width: "40px", height: "40px" }}
              />
              {firstName}
            </span>
          </>
        )}
      </a>

      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        {/* <li>
          <Link className="dropdown-item" href="/job-seeker/my-profile">
            Dashboard
          </Link>
        </li> */}
        {/* language changer */}
        <li>
          <Link className="dropdown-item" href={(role == 2) ? "/employer/company-profile" : "/job-seeker/my-profile"}>
            <span className="dropitem_icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
              </svg>
            </span>
            {t("Profile")}
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" href={(role == 2) ? "/employer/account" : "/job-seeker/edit-profile"}>
            <span className="dropitem_icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill-check" viewBox="0 0 16 16">
                <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514ZM11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path d="M2 13c0 1 1 1 1 1h5.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4Z" />
              </svg>
            </span>
            {" "}
            {t("Account")}
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" href="/" onClick={() => {
                logOutUser()
            }}>
            <span className="dropitem_icon">
              <LogOut />
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

// export async function getServerSideProps(context) {
//   createAxiosCookies(context);
//   const { token } = getCookies(context);
//   console.log("token : ", token);
  
    
//   return {
//     props: {
//       token
//     }
//   }
// }

export default AccountActionDropdown;
