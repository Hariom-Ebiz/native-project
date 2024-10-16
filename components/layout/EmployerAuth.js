import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import AuthHeader from "../employer/AuthHeader";
import Sidebar from "../employer/sidebar";

const EmployerAuth = ({ data, children }) => {
  const { isMobileSidebarOpen } = useSelector((store) => store.site);

  return (
    <>
      <div
        id="layout_app"
        // className={`app ${isMobileSidebarOpen ? "is-folded" : ""}`}
        className="app"
      >
        <div className="dashBoard_overLay"></div>
        <div className="layout">
          <AuthHeader data={data} />
          <Sidebar />
          {children}
        </div>
      </div>
    </>
  );
};

export default EmployerAuth;
