import React, { useEffect, useState } from "react";
import Header from "@/components/user/Header";
import SidebarCreateCv from "@/components/user/SidebarCreateCv";
import { createAxiosCookies } from "@/fn";
import useRequest from "@/hooks/useRequest";
import { axiosInstance } from "@/api";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import CvStep4 from "@/components/create-cv/CvStep4";

const Step4 = ({ skillData, languageData }) => {
  const router = useRouter();
  const { loggedIn, userId, cvStep } = useSelector((store) => store.auth);
  const [skillList, setSkillList] = useState(skillData);
  const [languageList, setLanguageList] = useState(languageData);
  const [isEditMode, setIsEditMode] = useState(false);
  const [skillsError, setSkillsError] = useState(0);
  const [languageError, setLanguageError] = useState(0);
  const { request, response } = useRequest();
  const { request: getCvReq, response: getCvDRes } = useRequest();

  useEffect(() => {
    if (cvStep == 5) {
      router.push("/job-seeker/edit-cv/step4");
    }
  }, [cvStep]);

  useEffect(() => {
    let body = document.getElementsByTagName("body")[0];
    body.classList.add("create_cv_page_sidebar");
    return () => {
      body.classList.remove("create_cv_page_sidebar");
    };
  }, []);

  useEffect(() => {
    if (!loggedIn || !userId) return;
    getCvReq("GET", "job-seeker-cv/get-step-4");
  }, [loggedIn]);

  useEffect(() => {
    if (getCvDRes && getCvDRes?.data) {
      console.log("profile", getCvDRes.data);
      let { skills, languages } = getCvDRes.data;

      let skillObj = {};
      if (skills && skills?.length) {
        skills.forEach((elem) => {
          skillObj[elem.skill_name] = elem.level || "average";
        });
        setIsEditMode(true);
      }
      let langObj = {};
      if (languages && languages?.length) {
        languages.forEach((elem) => {
          langObj[elem.language_name] = elem.level || "average";
        });
        setIsEditMode(true);
      }

      setSkillList((prev) => {
        let onlyNamesMaster = prev.map((elem) => elem.name);
        let customSkills = skills.filter(
          (elem) => !onlyNamesMaster.includes(elem.skill_name)
        );

        let updatedCustom = customSkills.map((elem) => ({
          id: elem.skill_name,
          name: elem.skill_name,
          selected: true,
          level: elem.level,
        }));

        let updatedMasted = prev.map((elem) => {
          if (skillObj[elem.name]) {
            return { ...elem, selected: true, level: skillObj[elem.name] };
          } else {
            return { ...elem, selected: false };
          }
        });

        return [...updatedCustom, ...updatedMasted];
      });

      setLanguageList((prev) => {
        let onlyNamesMaster = prev.map((elem) => elem.name);
        let customLanguages = languages.filter(
          (elem) => !onlyNamesMaster.includes(elem.language_name)
        );

        let updatedCustom = customLanguages.map((elem) => ({
          id: elem.language_name,
          name: elem.language_name,
          selected: true,
          level: elem.level,
        }));

        let updatedMasted = prev.map((elem) => {
          if (langObj[elem.name]) {
            return { ...elem, selected: true, level: langObj[elem.name] };
          } else {
            return { ...elem, selected: false };
          }
        });

        return [...updatedCustom, ...updatedMasted];


        // return prev.map((elem) => {
        //   if (langObj[elem.id]) {
        //     return { ...elem, selected: true, level: langObj[elem.id] };
        //   } else {
        //     return { ...elem, selected: false };
        //   }
        // });
      });
    }
  }, [getCvDRes]);

  useEffect(() => {
    if (response && response.status) {
      toast.success(response.message);
      router.push("/job-seeker/create-cv/step5");
    }
  }, [response]);

  const skillAddHandler = (name) => {
    setSkillsError(0);
    setSkillList((prev) => {
      return prev.map((elem) => {
        if (elem.name == name) {
          return {
            ...elem,
            selected: elem.selected ? false : true,
            level: "average",
          };
        } else {
          return elem;
        }
      });
    });
  };

  const languageAddHandler = (name) => {
    setLanguageError(0);
    setLanguageList((prev) => {
      return prev.map((elem) => {
        if (elem.name == name) {
          return {
            ...elem,
            selected: elem.selected ? false : true,
            level: "average",
          };
        } else {
          return elem;
        }
      });
    });
  };

  const skillLevelChanged = (name, level) => {
    setSkillsError(0);
    setSkillList((prev) => {
      return prev.map((elem) => {
        if (elem.name == name) {
          return {
            ...elem,
            level,
          };
        } else {
          return elem;
        }
      });
    });
  };

  const languageLevelChanged = (name, level) => {
    setLanguageError(0);
    setLanguageList((prev) => {
      return prev.map((elem) => {
        if (elem.name == name) {
          return {
            ...elem,
            level,
          };
        } else {
          return elem;
        }
      });
    });
  };

  const onSubmit = () => {
    let skills = [];
    let languages = [];

    skillList.forEach((elem) => {
      if (elem.selected) {
        skills.push({ skill_name: elem.name, level: elem.level });
      }
    });
    if (skills.length > 0) {
      setSkillsError(0);
    } else {
      setSkillsError(1);
      return;
    }
    languageList.forEach((elem) => {
      if (elem.selected) {
        languages.push({ language_name: elem.name, level: elem.level });
      }
    });
    if (languages.length > 0) {
      setLanguageError(0);
    } else {
      setLanguageError(1);
      return;
    }

    if (isEditMode) {
      request("PUT", "job-seeker-cv/edit-step-4", {
        skills,
        languages,
      });
    } else {
      request("POST", "job-seeker-cv/create-step-4", {
        skills,
        languages,
      });
    }
  };

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
                <CvStep4
                mode="create"
                  onSubmit={onSubmit}
                  skillList={skillList}
                  skillsError={skillsError}
                  languageList={languageList}
                  languageError={languageError}
                  skillLevelChanged={skillLevelChanged}
                  languageLevelChanged={languageLevelChanged}
                  skillAddHandler={skillAddHandler}
                  languageAddHandler={languageAddHandler}
                  setSkillList={setSkillList}
                  setLanguageList={setLanguageList}
                  setSkillsError={setSkillsError}
                  setLanguageError={setLanguageError}
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
  let res, res1;
  try {
    res = await axiosInstance.get("master/skill-list");
    res1 = await axiosInstance.get("master/language-list");
  } catch (err) {
    return false;
  }
  return {
    props: {
      isProtected: true,
      roles: [1],
      skillData: res?.data?.list,
      languageData: res1?.data?.list,
    },
  };
}

export default Step4;
