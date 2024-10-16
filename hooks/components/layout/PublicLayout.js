import React from "react";
import { useSelector } from "react-redux";
import Footer from "../common/Footer";
import Header from "../common/Header";
import HomeHeader from "../jobSeeker/HomeHeader";

const PublicLayout = ({ data, children }) => {
  const { loading, loggedIn, role } = useSelector((store) => store.auth);
  return (
    <>
      {loggedIn ? <HomeHeader /> : <Header />}     
      {children}
      <Footer />
    </>
  );
};

export default PublicLayout;
