import React from "react";
import Link from "next/link";

import { createAxiosCookies } from "@/fn";
import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import style from "@/styles/lesson.module.css";
import { CircularProgressbar } from "react-circular-progressbar";
import { API } from "@/api";
import { getLessons } from "@/services/interview-skills";

import LessonPrivate from "@/components/interview-skills/protected/Lesson";
import LessonPublic from "@/components/interview-skills/public/Lesson";
import { useSelector } from "react-redux";

const colours = [
  "theem_progress",
  "brown_progress",
  "theem_blue_progress",
  "yellow_progress",
];

const colourClass = ["", "brown_box", "blue_box", "yellow_box"];

const Lesson = ({ lessons, course, progress }) => {
  const { loggedIn } = useSelector((store) => store.auth);
  return loggedIn ? (
    <LessonPrivate lessons={lessons} course={course} progress={progress} />
  ) : (
     <LessonPublic lessons={lessons} course={course} />
  );
};

export async function getServerSideProps(context) {
  createAxiosCookies(context);

  const {
    query: { id },
  } = context;

  let { lessons, course, progress } = await getLessons(id);

  if (lessons.length == 0) {
    return {
      redirect: {
        permanent: false,
        destination: "/standout",
      },
    };
  }

  return {
    props: {
      isProtected: null,
      roles: [1],
      lessons,
      course,
      progress,
    },
  };
}

export default Lesson;
