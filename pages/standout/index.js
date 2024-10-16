import React, { useEffect, useRef } from "react";
import Link from "next/link";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useSelector } from "react-redux";

import { createAxiosCookies } from "@/fn";
import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import style from "@/styles/course.module.css";
import { API } from "@/api";
import PackagePrivate from "@/components/standout/protected/Package";
import PackagePublic from "@/components/standout/public/Package";

import { getCoursePackages } from "@/services/standout";

const Course = ({ courses }) => {
  const { loggedIn } = useSelector((store) => store.auth);

  return loggedIn ? (
    <PackagePrivate
      courses={courses}
    />
  ) : (
    <PackagePublic courses={courses} />
  );
};

export async function getServerSideProps(context) {
  createAxiosCookies(context);

  let { courses } = await getCoursePackages();

  if (courses.length === 0) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  return {
    props: {
      courses,
      isProtected: null,
      roles: [1],
    },
  };
}

export default Course;
