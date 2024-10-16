import React, { useEffect, useRef } from "react";
import Link from "next/link";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useSelector } from "react-redux";

import { createAxiosCookies } from "@/fn";
import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import style from "@/styles/course.module.css";
import { API } from "@/api";
import CoursePrivate from "@/components/functional-mastery/protected/Course";
import CoursePublic from "@/components/functional-mastery/public/Course";

import { getCourses } from "@/services/functional-mastery";

const Course = ({ id,categories, progress, thirdCompleted,course_package_details }) => {
  const { loggedIn } = useSelector((store) => store.auth);

  return loggedIn ? (
    <CoursePrivate
      categories={categories}
      progress={progress}
      thirdCompleted={thirdCompleted}
      course_package_details={course_package_details}
    />
  ) : (
    <CoursePublic categories={categories} />
  );
};

export async function getServerSideProps(context) {
  createAxiosCookies(context);
  const {
    query: { id },
  } = context;

  let { categories, progress, thirdCompleted,course_package_details } = await getCourses(id);

  if (categories.length === 0) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  categories = categories.filter(category => {
    return category.courses && category.courses.length > 0 && category.courses[0].id
  })

  return {
    props: {
      id,
      categories,
      progress,
      thirdCompleted,
      course_package_details,
      isProtected: null,
      roles: [1],
    },
  };
}

export default Course;
