import React from "react";
import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import { createAxiosCookies } from "@/fn";
import { axiosInstance } from "@/api";
import CvStep5 from "@/components/create-cv/CvStep5";

const Index = ({
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
    <JobSeekerAuth data={{ title: "My CV" }}>
      <div className="page_container">
        <div className="main_content main_bg" id="body_lang_css">
          <CvStep5
            generalData={generalData}
            languagesData={languagesData}
            careerPrefrenceData={careerPrefrenceData}
            certificationData={certificationData}
            educationData={educationData}
            postGraduationData={postGraduationData}
            skillsData={skillsData}
            universityData={universityData}
            workExperienceData={workExperienceData}
            mode="edit"
          />
        </div>
      </div>
    </JobSeekerAuth>
  );
};

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

export default Index;
