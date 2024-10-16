import React from "react";
import AuthHeader from "../jobSeeker/AuthHeader";
import Sidebar from "../jobSeeker/Sidebar";

const JobSeekerAuth = ({data, children}) => {
  return (
    <>
      <div className="app">
        <div className="dashBoard_overLay"></div>
        <div className="layout">
          <AuthHeader data ={data}/>          
          {children}
        </div>
      </div>
    </>
  );
};

export default JobSeekerAuth;
