import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = ({data}) => {
  return (
    <>
      <div className="app">
        <div className="dashBoard_overLay"></div>
        <div className="layout">
          <Header data ={data}/>
          <Sidebar />
        </div>
      </div>
    </>
  );
};

export default Layout;
