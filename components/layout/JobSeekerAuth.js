import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import AuthHeader from "../jobSeeker/AuthHeader";
import Sidebar from "../jobSeeker/Sidebar";

const JobSeekerAuth = ({ data, children }) => {
  const { isMobileSidebarOpen } = useSelector((store) => store.site);

  return (
    <>
      <div
        id="layout_app"
        // className={`app ${isMobileSidebarOpen ? "is-folded" : ""}`}
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

export default JobSeekerAuth;
