import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { createAxiosCookies } from "@/fn";
import { useRouter } from "next/router";
import { API, axiosInstance } from "@/api";
import { useSelector } from "react-redux";
import { getLatestCompany } from "@/utils/helper";

import CvTemplate from "../../../../components/cv/cvTemplate";

const Download = ({
  generalData,
  languagesData,
  careerPrefrenceData,
  certificationData,
  educationData,
  postGraduationData,
  skillsData,
  universityData,
  workExperienceData,
}) => {
  return (
    <CvTemplate
      data={{
        generalData,
        languagesData,
        careerPrefrenceData,
        certificationData,
        educationData,
        postGraduationData,
        skillsData,
        universityData,
        workExperienceData,
      }}
    />
  );
};

export default Download;

export async function getServerSideProps(context) {
  createAxiosCookies(context);

  const {
    query: { id },
  } = context;

  let res, profileData;
  try {
    res = await axiosInstance.get("job-seeker-cv/get-complete");
    profileData = res?.data?.data;
    if (!profileData) {
      return false;
    }
  } catch (err) {
    return false;
  }

  const generalData = profileData.general;
  const languagesData = profileData.languages;
  const careerPrefrenceData = profileData.careerPrefrence;
  const certificationData = profileData.certification;
  const educationData = profileData.education;
  const postGraduationData = profileData.postGraduation;
  const skillsData = profileData.skills;
  const universityData = profileData.university;
  const workExperienceData = profileData.workExperience;

  return {
    props: {
      isProtected: true,
      roles: [1],
      generalData,
      languagesData,
      careerPrefrenceData,
      certificationData,
      educationData,
      postGraduationData,
      skillsData,
      universityData,
      workExperienceData,
    },
  };
}
