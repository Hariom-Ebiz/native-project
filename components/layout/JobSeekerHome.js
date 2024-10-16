import React from "react";
import HomeHeader from "../jobSeeker/HomeHeader";


const JobSeekerHome = ({data}) => {
  return (
    <>
      <div className="app">
        <div className="dashBoard_overLay"></div>
        <div className="layout">
          <HomeHeader/>
        </div>
      </div>
    </>
  );
};

export default JobSeekerHome;
