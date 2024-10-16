import React, { useEffect, useState } from "react";
import Header from "@/components/user/Header";
import SidebarCreateCv from "@/components/user/SidebarCreateCv";
import styles from "@/styles/create_cv_steps.module.css";
import { createAxiosCookies } from "@/fn";
import { useForm } from "react-hook-form";
import useRequest from "@/hooks/useRequest";
import Link from "next/link";
import Certification from "@/components/create-cv/Certification";
import PostGraduation from "@/components/create-cv/PostGraduation";
import University from "@/components/create-cv/University";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { generateOtp, scrollToThis } from "@/utils/helper";
import { axiosInstance } from "@/api";
import { updateCvStep } from "@/store/authSlice";
import CvStep2 from "@/components/create-cv/CvStep2";

const Step2 = ({
  profile,
  country,
  graduationCertificate,
  grade,
  degreeLevel,
  studyField,
  studyTopic,
  postDegreeLevel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    unregister,
    setError,
  } = useForm();

  const router = useRouter();
  const dispatch = useDispatch();
  const { loggedIn, userId, cvStep } = useSelector((store) => store.auth);
  const [certificationArray, setCertificationArray] = useState([generateOtp()]);
  const [postGraduationArray, setPostGraduationArray] = useState([
    generateOtp(),
  ]);
  const [universityArray, setUniversityArray] = useState([generateOtp()]);
  const [isEditMode, setIsEditMode] = useState(false);
  const { request, response } = useRequest();
  const { request: getCvReq, response: getCvDRes } = useRequest();

  const [renderStepComponent, setRenderStepComponent] = useState(false);

  useEffect(() => {
    if (cvStep == 5) {
      router.push("/job-seeker/edit-cv/step2");
    }
  }, [cvStep]);

  useEffect(() => {
    let body = document.getElementsByTagName("body")[0];
    body.classList.add("create_cv_page_sidebar");
    return () => {
      body.classList.remove("create_cv_page_sidebar");
    };
  }, []);

  // useEffect(() => {
  //   if (!loggedIn || !userId) return;
  //   getCvReq("GET", "job-seeker-cv/get-step-2");
  // }, [loggedIn]);

  useEffect(() => {
    if (profile) {
      let { certification, education, postGraduation, university } = profile;

      if (education) {
        setValue(`school_name`, education.high_school_name);
        setValue(`country`, education.country);
        if (education.graduation_certificate) {
          setValue(`graduation_certificate`, education.graduation_certificate);
        } else {
          setValue(`graduation_certificate`, "other");
          setValue(
            `graduation_other_certificate`,
            education.graduation_other_certificate
          );
        }

        setValue(`graduation_year`, education.graduation_year);
        if (education.grade) {
          setValue(`graduation_grade`, education.grade);
        } else {
          setValue(`graduation_grade`, "other");
          setValue(`graduation_other_grade`, education.graduation_other_grade);
        }
        setIsEditMode(true);
      }

      if (university && university.length > 0) {
        let uniArr = [];
        university.forEach((elem) => {
          let uuid = elem.id;
          uniArr.push(uuid);
          setValue(`graduation_university_name_${uuid}`, elem.university_name);
          setValue(`university_country_${uuid}`, elem.country);
          if (elem.grade) {
            setValue(`graduation_grade_${uuid}`, elem.grade);
          } else {
            setValue(`graduation_grade_${uuid}`, "other");
            setValue(`graduation_other_grade_${uuid}`, elem.other_grade);
          }
          if (elem.degree_level) {
            setValue(`graduation_degree_level_${uuid}`, elem.degree_level);
          } else {
            setValue(`graduation_degree_level_${uuid}`, "other");
            setValue(
              `graduation_other_degree_level_${uuid}`,
              elem.other_degree_level
            );
          }
          if (elem.field_of_study) {
            setValue(`graduation_study_field_${uuid}`, elem.field_of_study);
          } else {
            setValue(`graduation_study_field_${uuid}`, "other");
            setValue(
              `graduation_other_study_field_${uuid}`,
              elem.other_field_of_study
            );
          }
          setValue(`graduation_start_year_${uuid}`, elem.start_year);
          setValue(`graduation_end_year_${uuid}`, elem.end_year);
        });
        setUniversityArray(uniArr);
        setIsEditMode(true);
      }

      if (postGraduation && postGraduation.length > 0) {
        let uniArr = [];
        postGraduation.forEach((elem) => {
          let uuid = elem.id;
          uniArr.push(uuid);
          setValue(`post_university_name_${uuid}`, elem.university_name);
          setValue(`post_country_${uuid}`, elem.country);
          if (elem.grade) {
            setValue(`post_grade_${uuid}`, elem.grade);
          } else {
            setValue(`post_grade_${uuid}`, "other");
            setValue(`post_other_grade_${uuid}`, elem.other_grade);
          }

          if (elem.degree_level) {
            setValue(`post_degree_level_${uuid}`, elem.degree_level);
          } else {
            setValue(`post_degree_level_${uuid}`, "other");
            setValue(
              `post_other_degree_level_${uuid}`,
              elem.other_degree_level
            );
          }
          setValue(`post_start_year_${uuid}`, elem.start_year);
          setValue(`post_end_year_${uuid}`, elem.end_year);
          if (elem.field_of_study) {
            setValue(`post_study_field_${uuid}`, elem.field_of_study);
          } else {
            setValue(`post_study_field_${uuid}`, "other");
            setValue(
              `post_other_study_field_${uuid}`,
              elem.other_field_of_study
            );
          }
        });
        setPostGraduationArray(uniArr);
        setIsEditMode(true);
      }
      if (certification && certification.length > 0) {
        let uniArr = [];
        certification.forEach((elem) => {
          let uuid = elem.id;
          uniArr.push(uuid);
          setValue(
            `certification_institution_name_${uuid}`,
            elem.organisation_name
          );
          setValue(`certification_country_${uuid}`, elem.country);
          if (elem.field_of_study) {
            setValue(`certification_study_field_${uuid}`, elem.field_of_study);
          } else {
            setValue(`certification_study_field_${uuid}`, "other");
            setValue(
              `certification_other_study_field_${uuid}`,
              elem.other_field_of_study
            );
          }

          if (elem.topic) {
            setValue(`certification_topic_${uuid}`, elem.topic);
          } else {
            setValue(`certification_topic_${uuid}`, elem.topic);
            setValue(`certification_other_topic_${uuid}`, elem.other_topic);
          }
          setValue(`certification_year_${uuid}`, elem.graduation_year);
        });
        setCertificationArray(uniArr);
        setIsEditMode(true);
      }
      setRenderStepComponent(true);
    }
  }, [profile]);

  useEffect(() => {
    if (response && response.status) {
      toast.success(response.message);
      dispatch(updateCvStep(3));
      router.push("/job-seeker/create-cv/step3");
    }
  }, [response]);

  const universityAddHandler = () => {
    setUniversityArray((prev) => [...prev, generateOtp()]);
  };

  const postGraduationAddHandler = () => {
    setPostGraduationArray((prev) => [...prev, generateOtp()]);
  };

  const certificationAddHandler = () => {
    setCertificationArray((prev) => [...prev, generateOtp()]);
  };

  const onSubmit = (data) => {
    let hasError = false;
    const {
      school_name,
      country,
      graduation_certificate,
      graduation_other_certificate,
      graduation_year,
      graduation_grade,
      graduation_other_grade,
    } = data;

    const education = {
      high_school_name: school_name,
      country: country,
      graduation_certificate:
        graduation_certificate === "other" ? null : graduation_certificate,
      graduation_other_certificate: graduation_other_certificate
        ? graduation_other_certificate
        : null,
      graduation_year: graduation_year,
      grade: graduation_grade === "other" ? null : graduation_grade,
      graduation_other_grade: graduation_other_grade
        ? graduation_other_grade
        : null,
    };

    const university = [];
    universityArray.forEach((uuid) => {
      let obj = {
        university_name: data[`graduation_university_name_${uuid}`],
        country: data[`university_country_${uuid}`],
        grade:
          data[`graduation_grade_${uuid}`] === "other"
            ? null
            : data[`graduation_grade_${uuid}`],
        other_grade: data[`graduation_other_grade_${uuid}`]
          ? data[`graduation_other_grade_${uuid}`]
          : null,
        degree_level:
          data[`graduation_degree_level_${uuid}`] === "other"
            ? null
            : data[`graduation_degree_level_${uuid}`],
        other_degree_level: data[`graduation_other_degree_level_${uuid}`]
          ? data[`graduation_other_degree_level_${uuid}`]
          : null,

        field_of_study:
          data[`graduation_study_field_${uuid}`] === "other"
            ? null
            : data[`graduation_study_field_${uuid}`],
        other_field_of_study: data[`graduation_other_study_field_${uuid}`]
          ? data[`graduation_other_study_field_${uuid}`]
          : null,
        start_year: data[`graduation_start_year_${uuid}`],
        end_year: data[`graduation_end_year_${uuid}`],
      };
      if (+obj.start_year > +obj.end_year) {
        setError(`graduation_end_year_${uuid}`, {
          type: "manual",
          message: "End year cannot be less than start year.",
        });
        hasError = true;
        scrollToThis(`graduation_end_year_${uuid}`);
      }
      university.push(obj);
    });

    const postgraduation = [];
    postGraduationArray.forEach((uuid) => {
      let obj = {
        university_name: data[`post_university_name_${uuid}`],
        country: data[`post_country_${uuid}`],
        grade:
          data[`post_grade_${uuid}`] === "other"
            ? null
            : data[`post_grade_${uuid}`],
        other_grade: data[`post_other_grade_${uuid}`]
          ? data[`post_other_grade_${uuid}`]
          : null,

        degree_level:
          data[`post_degree_level_${uuid}`] === "other"
            ? null
            : data[`post_degree_level_${uuid}`],
        other_degree_level: data[`post_other_degree_level_${uuid}`]
          ? data[`post_other_degree_level_${uuid}`]
          : null,
        start_year: data[`post_start_year_${uuid}`],
        end_year: data[`post_end_year_${uuid}`],
        field_of_study:
          data[`post_study_field_${uuid}`] === "other"
            ? null
            : data[`post_study_field_${uuid}`],
        other_field_of_study: data[`post_other_study_field_${uuid}`]
          ? data[`post_other_study_field_${uuid}`]
          : null,
      };

      if (+obj.start_year > +obj.end_year) {
        setError(`post_end_year_${uuid}`, {
          type: "manual",
          message: "End year cannot be less than start year.",
        });
        hasError = true;
        scrollToThis(`post_end_year_${uuid}`);
      }
      postgraduation.push(obj);
    });

    const certification = [];
    certificationArray.forEach((uuid) => {
      let obj = {
        organisation_name: data[`certification_institution_name_${uuid}`],
        country: parseInt(data[`certification_country_${uuid}`]),
        field_of_study:
          data[`certification_study_field_${uuid}`] === "other"
            ? null
            : data[`certification_study_field_${uuid}`],
        other_field_of_study: data[`certification_other_study_field_${uuid}`]
          ? data[`certification_other_study_field_${uuid}`]
          : null,
        topic: data[`certification_topic_${uuid}`]
          ? data[`certification_topic_${uuid}`]
          : null,
        other_topic: data[`certification_other_topic_${uuid}`]
          ? data[`certification_other_topic_${uuid}`]
          : null,
        graduation_year: data[`certification_year_${uuid}`],
      };
      certification.push(obj);
    });
    if (hasError) return;
    if (isEditMode) {
      request("PUT", "job-seeker-cv/edit-step-2", {
        education: education,
        certification: certification,
        postGraduation: postgraduation,
        university: university,
      });
    } else {
      request("POST", "job-seeker-cv/create-step-2", {
        education: education,
        certification: certification,
        postGraduation: postgraduation,
        university: university,
      });
      // DegreeLevel;
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
                {renderStepComponent && (
                  <CvStep2
                    mode="create"
                    register={register}
                    errors={errors}
                    country={country}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    graduationCertificate={graduationCertificate}
                    grade={grade}
                    universityArray={universityArray}
                    unregister={unregister}
                    degreeLevel={degreeLevel}
                    studyField={studyField}
                    setUniversityArray={setUniversityArray}
                    getValues={getValues}
                    postGraduationArray={postGraduationArray}
                    postDegreeLevel={postDegreeLevel}
                    setPostGraduationArray={setPostGraduationArray}
                    certificationArray={certificationArray}
                    studyTopic={studyTopic}
                    setCertificationArray={setCertificationArray}
                    universityAddHandler={universityAddHandler}
                    postGraduationAddHandler={postGraduationAddHandler}
                    certificationAddHandler={certificationAddHandler}
                  />
                )}
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

  let res, res1, res2, res3, res4, res5, res6, res7;
  res = await axiosInstance.get("job-seeker-cv/get-step-2");
  res1 = await axiosInstance.get("master/graduation-certificate-list");
  res2 = await axiosInstance.get("master/grade-list");
  res3 = await axiosInstance.get("master/degree-level-list");
  res4 = await axiosInstance.get("master/study-field-list");
  res5 = await axiosInstance.get("master/study-topic-list");
  res6 = await axiosInstance.get("master/countries");
  res7 = await axiosInstance.get("master/post-grad-degree-level-list");

  return {
    props: {
      isProtected: true,
      roles: [1],
      profile: res?.data?.data || {},
      graduationCertificate: res1?.data?.list || {},
      grade: res2?.data?.list || {},
      degreeLevel: res3?.data?.list || {},
      studyField: res4?.data?.list || {},
      studyTopic: res5?.data?.list || {},
      country: res6?.data?.list?.record || {},
      postDegreeLevel: res7?.data?.list || {},
    },
  };
}

export default Step2;
