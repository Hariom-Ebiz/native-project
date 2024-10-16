import Header from "@/components/user/Header";
import SidebarCreateCv from "@/components/user/SidebarCreateCv";
import React, { useEffect, useState } from "react";
import { createAxiosCookies } from "@/fn";
import { useSelector,useDispatch } from "react-redux";
import useRequest from "@/hooks/useRequest";
import CvStep5 from "@/components/create-cv/CvStep5";
import { updateCvStep } from "@/store/authSlice";

const Step5 = () => {
  const { loggedIn, userId } = useSelector((store) => store.auth);
  const [generalData, setGeneralData] = useState([]);
  const [languagesData, setLanguagesData] = useState([]);
  const [careerPrefrenceData, setCareerPrefrenceData] = useState([]);
  const [certificationData, setCertificationData] = useState([]);
  const [educationData, setEducationData] = useState({});
  const [postGraduationData, setPostGraduationData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [universityData, setUniversityData] = useState([]);
  const [workExperienceData, setWorkExperienceData] = useState([]);
  const { request, response } = useRequest();
  const dispatch = useDispatch();



  useEffect(() => {
    if (!loggedIn || !userId) return;
    request("GET", "job-seeker-cv/get-complete");
  }, [loggedIn]);

  useEffect(() => {
    if (response && response.status);
    setGeneralData(response?.data?.general);
    setLanguagesData(response?.data?.languages);
    setCareerPrefrenceData(response?.data?.careerPrefrence);
    setCertificationData(response?.data?.certification);
    setEducationData(response?.data?.education);
    setPostGraduationData(response?.data?.postGraduation);
    setSkillsData(response?.data?.skills);
    setUniversityData(response?.data?.university);
    setWorkExperienceData(response?.data?.workExperience);
        dispatch(updateCvStep(5));

  }, [response]);

  useEffect(() => {
    let body = document.getElementsByTagName("body")[0];
    body.classList.add("create_cv_page_sidebar");
    return () => {
      body.classList.remove("create_cv_page_sidebar");
    };
  }, []);



  return (
    <div className="app">
      <div className="dashBoard_overLay"></div>
      <div className="layout">
        <Header data={{ title: "Create Your CV" }} />
        <div className="page_container">
          <div className="main_content main_bg" id="body_lang_css">
            <div className="row">
              <SidebarCreateCv />
              <div className="col-md-12 col-lg-9">
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
                  mode="create"
                />
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  createAxiosCookies(context);

  return {
    props: {
      isProtected: true,
      roles: [1],
    },
  };
}

export default Step5;
