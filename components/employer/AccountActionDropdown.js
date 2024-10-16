import { API } from "@/api";
import { logout } from "@/store/authSlice";
import Link from "next/link";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const AccountActionDropdown = () => {
  const { loggedIn, firstName, lastName, profilePic } = useSelector(
    (store) => store.auth
  );
  const dispatch = useDispatch();
  return (
    <div className="btn-group company_coinbase_box user_dropdown dash_dropdown">
      <a
        className="dropdown-toggle"
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {profilePic && firstName ? (
          <>
            <span className="user_img">
              <img
                src={`${API}/${profilePic}`}
                alt=""
                style={{ width: "40px", height: "40px" }}
              />
              {firstName}
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
        <li>
          <Link className="dropdown-item" href="/employer/company-profile">
            <span className="dropitem_icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                  <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                </svg>
            </span>
            Profile
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" href="#">
            <span className="dropitem_icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill-check" viewBox="0 0 16 16">
                <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514ZM11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                <path d="M2 13c0 1 1 1 1 1h5.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4Z"/>
              </svg>
            </span>
            {" "}
            Account
          </Link>
        </li>
        <li
          onClick={() => {
            dispatch(logout());
          }}
        >
          <Link className="dropdown-item" href="/">
            <span className="dropitem_icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
              </svg>
            </span>
            Log Out
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AccountActionDropdown;
