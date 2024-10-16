import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ReactPlayer from "react-player";

import { createAxiosCookies } from "@/fn";
import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import style from "@/styles/description.module.css";
import { API } from "@/api";
import useRequest from "@/hooks/useRequest";

import { getLessonData } from "@/services/course";

import DescriptionPrivate from "@/components/course/protected/Description";

const Description = ({ lesson, id }) => {
  return <DescriptionPrivate lesson={lesson} id={id} />;
};

export async function getServerSideProps(context) {
  createAxiosCookies(context);
  const {
    query: { id },
  } = context;

  let lesson = await getLessonData(id);
  if (Object.keys(lesson).length === 0) {
    return {
      redirect: {
        permanent: false,
        destination: "/course",
      },
    };
  }

  return {
    props: {
      isProtected: null,
      roles: [1],
      lesson,
      key: Date.now().toString(),
      id,
    },
  };
}

export default Description;
