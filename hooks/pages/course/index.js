import React, { useEffect, useRef } from "react";
import Link from "next/link";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useSelector } from "react-redux";

import { createAxiosCookies } from "@/fn";
import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import style from "@/styles/course.module.css";
import { API } from "@/api";
import CoursePrivate from "@/components/course/protected/Course";
import CoursePublic from "@/components/course/public/Course";

import { getCourses } from "@/services/course";

const Course = ({ categories, progress, thirdCompleted }) => {
  const { loggedIn } = useSelector((store) => store.auth);

  return loggedIn ? (
    <CoursePrivate
      categories={categories}
      progress={progress}
      thirdCompleted={thirdCompleted}
    />
  ) : (
    <CoursePublic categories={categories} />
  );
};

export async function getServerSideProps(context) {
  createAxiosCookies(context);

  let { categories, progress, thirdCompleted } = await getCourses();

  if (categories.length === 0) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  return {
    props: {
      categories,
      progress,
      thirdCompleted,
      isProtected: null,
      roles: [1],
    },
  };
}

export default Course;
