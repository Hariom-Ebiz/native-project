import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ReactPlayer from "react-player";

import { createAxiosCookies } from "@/fn";
import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import style from "@/styles/description.module.css";
import { API } from "@/api";
import useRequest from "@/hooks/useRequest";

import { getLessonData } from "@/services/functional-mastery";

import DescriptionPrivate from "@/components/functional-mastery/protected/Description";
import { useRouter } from "next/router";

const Description = ({ id }) => {
  const router = useRouter();
  const [lesson, setLesson] = useState({});
  console.log("request Lesson DAta ");
  const {request: requestLessonData, response: responseLessonData, loading: isFetchingLesson} = useRequest();

  useEffect(()=> {
    requestLessonData("get", `functional-mastery/lesson/${id}`)
  },[])

  useEffect(()=> {
    if(responseLessonData){
      if (Object.keys(responseLessonData.lesson).length === 0) {
        router.push("/functional-mastery");
        return;
      }
      setLesson(responseLessonData.lesson)
    }
  },[responseLessonData])

  return Object.keys(lesson).length > 0 ? <DescriptionPrivate lesson={lesson} id={id} /> : <>ksldf</>;
};

export async function getServerSideProps(context) {

  
  createAxiosCookies(context);
  const {
    query: { id },
  } = context;
  
  // let lesson = await getLessonData(id);
  // console.log(">>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<",lesson);
  // if (Object.keys(lesson).length === 0) {
  //   return {
  //     redirect: {
  //       permanent: false,
  //       destination: "/functional-mastery",
  //     },
  //   };
  // }

  return {
    props: {
      isProtected: null,
      roles: [1],
      // lesson,
      key: Date.now().toString(),
      id,
    },
  };
}

export default Description;
