import React, { useEffect, useRef } from "react";
import Link from "next/link";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useSelector } from "react-redux";

import { createAxiosCookies } from "@/fn";
import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import style from "@/styles/course.module.css";
import { API } from "@/api";
import CoursePrivate from "@/components/interview-skills/protected/Course";
import CoursePublic from "@/components/interview-skills/public/Course";

import { getCourses } from "@/services/interview-skills";

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
  console.log("categories : ", categories);

  categories = categories.filter(category => {
    return category.courses && category.courses.length > 0 && category.courses[0].id
  })
  

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
