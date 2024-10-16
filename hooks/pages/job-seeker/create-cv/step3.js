import React, { useEffect, useState } from "react";
import Header from "@/components/user/Header";
import SidebarCreateCv from "@/components/user/SidebarCreateCv";
import styles from "@/styles/create_cv_steps.module.css";
import { createAxiosCookies } from "@/fn";
import { useForm } from "react-hook-form";
import Job from "@/components/create-cv/Job";
import useRequest from "@/hooks/useRequest";
import moment from "moment";
import { axiosInstance } from "@/api";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { generateOtp, scrollToThis } from "@/utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { updateCvStep } from "@/store/authSlice";
import CvStep3 from "@/components/create-cv/CvStep3";

const Step3 = ({
  profile,
  country,
  jobType,
  jobCategory,
  jobIndustry,
  careerLevel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    unregister,
    watch,
    control,
    getValues,
    setError,
  } = useForm();
  const watch1 = watch();

  const [renderStepComponent, setRenderStepComponent] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const { loggedIn, userId, cvStep } = useSelector((store) => store.auth);
  const [jobArray, setJobArray] = useState([1]);
  // const [cities, setCities] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [workExpCities, setWorkExpCities] = useState({});

  const { request, response } = useRequest();

  // const { request: requestCity, response: responseCity } = useRequest();

  useEffect(() => {
    if (cvStep == 5) {
      router.push("/job-seeker/edit-cv/step3");
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
  //   getCvReq("GET", "job-seeker-cv/get-step-3");
  // }, [loggedIn]);

  useEffect(() => {
    if (profile) {
      let { careerPrefrence, workExperience } = profile;

      if (careerPrefrence) {
        if (careerPrefrence.career_level) {
          setValue(`career_level`, careerPrefrence.career_level);
        } else {
          setValue(`career_level`, "other");
          setValue(`other_career_level`, careerPrefrence.other_career_level);
        }

        setValue(`job_type`, careerPrefrence.job_type);
        setValue(`job_category`, careerPrefrence.job_category);
        // setValue(`country`, careerPrefrence.country);
        setValue(`min_expected_salary`, careerPrefrence.min_expected_salary);
        setValue(`make_profile_public`, careerPrefrence.make_profile_public);

        careerPrefrence.locations.forEach((location, idx) => {
          setValue(`location[${idx}].country`, location.country);
        });

        // requestCity("GET", `master/cities?country=${careerPrefrence.country}`);
        // setTimeout(() => {
        //   setValue(`city`, careerPrefrence.city);
        // }, 1000);
        setIsEditMode(true);
      }

      if (workExperience && workExperience.length > 0) {
        const workExpCities = {};

        let uniArr = [];
        workExperience.forEach((elem) => {
          let uuid = elem.id;
          uniArr.push(uuid);

          workExpCities[uuid] = elem.cityList;

          if (elem.job_type) {
            setValue(`job_type_${uuid}`, elem.job_type);
          } else {
            setValue(`job_type_${uuid}`, "other");
            setValue(`other_job_type_${uuid}`, elem.other_job_type);
          }

          setValue(`job_title_${uuid}`, elem.job_title);

          if (elem.job_category) {
            setValue(`job_category_${uuid}`, elem.job_category);
          } else {
            setValue(`job_category_${uuid}`, "other");
            setValue(`other_job_category_${uuid}`, elem.other_job_category);
          }

          if (elem.industry) {
            setValue(`industry_${uuid}`, elem.industry);
          } else {
            setValue(`industry_${uuid}`, "other");
            setValue(`other_industry_${uuid}`, elem.other_industry);
          }

          setValue(`company_name_${uuid}`, elem.company_name);
          setValue(`job_country_${uuid}`, elem.country);
          setValue(`job_city_${uuid}`, elem.city);
          setValue(
            `start_date_${uuid}`,
            moment(elem.start_date).format("YYYY-MM-DD")
          );
          if (elem.is_currently_working) {
            setValue(`is_currently_working_${uuid}`, "1");
          } else {
            setValue(
              `end_date_${uuid}`,
              moment(elem.end_date).format("YYYY-MM-DD")
            );
          }
          setValue(`responsibilities_${uuid}`, elem.responsibilities);
          setValue(`achievements_${uuid}`, elem.achievements);
        });
        setJobArray(uniArr);
        setIsEditMode(true);
        setWorkExpCities(workExpCities);
      }
      setRenderStepComponent(true);
    }
  }, [profile]);

  useEffect(() => {
    if (response && response.status) {
      toast.success(response.message);
      dispatch(updateCvStep(4));
      router.push("/job-seeker/create-cv/step4");
    }
  }, [response]);

  // useEffect(() => {
  //   if (responseCity && responseCity.status) {
  //     setCities(responseCity?.list);
  //   }
  // }, [responseCity]);

  const jobAddHandler = () => {
    setJobArray((prev) => [...prev, prev[prev.length - 1] + 1]);
  };

  const onSubmit = (data) => {
    let hasError = false;
    let {
      career_level,
      other_career_level,
      job_type,
      job_category,
      // country,
      // city,
      min_expected_salary,
      make_profile_public,
      location,
    } = data;

    let careerPrefrence = {
      career_level: career_level === "other" ? null : career_level,
      other_career_level: other_career_level ? other_career_level : null,
      job_type: job_type.map((data) => data.value),
      job_category: job_category.map((data) => data.value),
      // job_type,
      // job_category,
      // country,
      // city,
      min_expected_salary,
      make_profile_public,
      locations: location,
    };

    const workExperience = [];
    jobArray.forEach((uuid) => {
      if (
        data[`end_date_${uuid}`] &&
        moment(data[`end_date_${uuid}`]) < moment(data[`start_date_${uuid}`])
      ) {
        hasError = true;
        setError(`end_date_${uuid}`, {
          type: "manual",
          message: "Finish date cannot be less then start date.",
        });
        scrollToThis(`end_date_${uuid}`);
      }
      let obj = {
        job_type:
          data[`job_type_${uuid}`] === "other"
            ? null
            : data[`job_type_${uuid}`],
        other_job_type: data[`other_job_type_${uuid}`]
          ? data[`other_job_type_${uuid}`]
          : null,

        job_title: data[`job_title_${uuid}`],
        job_category:
          data[`job_category_${uuid}`] === "other"
            ? null
            : data[`job_category_${uuid}`],
        other_job_category: data[`other_job_category_${uuid}`]
          ? data[`other_job_category_${uuid}`]
          : null,

        industry:
          data[`industry_${uuid}`] === "other"
            ? null
            : data[`industry_${uuid}`],
        other_industry: data[`other_industry_${uuid}`]
          ? data[`other_industry_${uuid}`]
          : null,

        company_name: data[`company_name_${uuid}`],
        country: data[`job_country_${uuid}`],
        city: data[`job_city_${uuid}`],
        start_date: data[`start_date_${uuid}`],
        end_date: data[`end_date_${uuid}`] || null,
        is_currently_working: data[`is_currently_working_${uuid}`],
        responsibilities: data[`responsibilities_${uuid}`],
        achievements: data[`achievements_${uuid}`],
      };
      workExperience.push(obj);
    });

    if (hasError) {
      return;
    }

    if (isEditMode) {
      request("PUT", "job-seeker-cv/edit-step-3", {
        workExperience,
        careerPrefrence,
      });
    } else {
      request("POST", "job-seeker-cv/create-step-3", {
        workExperience,
        careerPrefrence,
      });
    }
  };

  return (
    <div classNameName="app">
      <div className="dashBoard_overLay"></div>
      <div className="layout">
        <Header data={{ title: "Create Your CV" }} />
        <div className="page_container">
          <div className="main_content main_bg" id="body_lang_css">
            <div className="row">
              <SidebarCreateCv />
              <div className="col-md-12 col-lg-9">
                {renderStepComponent && (
                  <CvStep3
                    mode="create"
                    register={register}
                    errors={errors}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    jobArray={jobArray}
                    jobIndustry={jobIndustry}
                    jobCategory={jobCategory}
                    jobType={jobType}
                    setJobArray={setJobArray}
                    careerLevel={careerLevel}
                    country={country}
                    jobAddHandler={jobAddHandler}
                    unregister={unregister}
                    setValue={setValue}
                    control={control}
                    careerPrefrence={profile.careerPrefrence}
                    getValues={getValues}
                    workExpCities={workExpCities}
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

  let res, res1, res2, res3, res4, res5;
  try {
    res = await axiosInstance.get("job-seeker-cv/get-step-3");
    res1 = await axiosInstance.get("master/job-industry-list");
    res2 = await axiosInstance.get("master/job-category-list");
    res3 = await axiosInstance.get("master/job-type-list");
    res4 = await axiosInstance.get("master/countries");
    res5 = await axiosInstance.get("master/carrier-level-list");
  } catch (err) {
    return false;
  }
  return {
    props: {
      isProtected: true,
      roles: [1],
      profile: res?.data?.data,
      jobIndustry: res1?.data?.list,
      jobCategory: res2?.data?.list,
      jobType: res3?.data?.list,
      country: res4?.data?.list?.record,
      careerLevel: res5?.data?.list,
    },
  };
}

export default Step3;
