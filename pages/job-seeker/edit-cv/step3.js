import React, { useEffect, useState } from "react";
import { createAxiosCookies,getCookies } from "@/fn";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { axiosInstance } from "@/api";
import { editCv3Data } from "@/services/jobSeeker/profile";
import Link from "next/link";
import useRequest from "@/hooks/useRequest";
import moment from "moment";
import Job from "@/components/create-cv/Job";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import CvStep3 from "@/components/create-cv/CvStep3";
import CvParent from "@/components/create-cv/CvParent";
import { scrollToThis } from "@/utils/helper";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const Step3 = ({
  profile,
  country,
  jobType,
  jobCategory,
  jobIndustry,
  careerLevel,
}) => {
  const { t } = useTranslation('common');
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
    unregister,
    control,
    getValues,
    setError,
  } = useForm();

  const router = useRouter();
  const { cvStep } = useSelector((store) => store.auth);
  const [jobArray, setJobArray] = useState([1]);
  // const [cities, setCities] = useState([]);
  const [renderStepComponent, setRenderStepComponent] = useState(false);
  const [workExpCities, setWorkExpCities] = useState({});

  const { request, response } = useRequest();
  // const { request: requestCity, response: responseCity } = useRequest();

  useEffect(() => {
    if (cvStep != 5) {
      router.push("/job-seeker/create-cv/step1");
    }
  }, [cvStep]);

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
            setValue(`job_type_${uuid}`, "0");
            setValue(`other_job_type_${uuid}`, elem.other_job_type);
          }

          setValue(`job_title_${uuid}`, elem.job_title);

          if (elem.job_category) {
            setValue(`job_category_${uuid}`, elem.job_category);
          } else {
            setValue(`job_category_${uuid}`, "0");
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

          setValue(
            `start_month_${uuid}`,
            moment(elem.start_date).month()+1
          );

          setValue(
            `start_year_${uuid}`,
            moment(elem.start_date).year()
          );

          if (elem.is_currently_working) {
            setValue(`is_currently_working_${uuid}`, "1");
          } else {
            setValue(
              `end_date_${uuid}`,
              moment(elem.end_date).format("YYYY-MM-DD")
            );
            setValue(
              `end_month_${uuid}`,
              moment(elem.end_date).month()+1
            );
            setValue(
              `end_year_${uuid}`,
              moment(elem.end_date).year()
            );
          }
          // if (elem.end_date) {
          // }

          setValue(`responsibilities_${uuid}`, elem.responsibilities);
          setValue(`achievements_${uuid}`, elem.achievements);
        });
        setJobArray(uniArr);

        setWorkExpCities(workExpCities);
      }
      setRenderStepComponent(true);
    }
  }, [profile]);

  useEffect(() => {
    if (response && response.status) {
      toast.success(response.message);
      router.push("/job-seeker/edit-cv/step4");
    }
  }, [response]);

  // useEffect(() => {
  //   if (responseCity && responseCity.status) {
  //     setCities(responseCity?.list);
  //   }
  // }, [responseCity]);

  // const countrySelectedHandler = (data) => {
  //   if (data) {
  //     requestCity("GET", `master/cities?country=${data}`);
  //   }
  // };

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
          message: t("Finish date cannot be less then start date."),
        });
        scrollToThis(`end_date_${uuid}`);
      }

      let startMonth = data[`start_month_${uuid}`]
      let startYear = data[`start_year_${uuid}`]
      let endMonth = data[`end_month_${uuid}`]
      let endYear = data[`end_year_${uuid}`]


      let startExp = new Date(`${startYear}/${startMonth}/01`);
      let endExp = (endYear && endMonth && endYear != 0 && endMonth != 0) ? new Date(`${endYear}/${endMonth}/01`) : null;

      if (endMonth && endYear && endYear != 0 && endMonth != 0 &&
      (endExp.valueOf() < startExp.valueOf() ) ) {
        hasError = true;
        setError(`end_month_${uuid}`, {
          type: "manual",
          message: "Finish date cannot be less then start date.",
        });
        scrollToThis(`end_month_${uuid}`);
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
          data[`job_category_${uuid}`] === "0"
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
        start_date: `${startYear}/${startMonth}/01`,
        end_date: (endExp) ? `${endYear}/${endMonth}/01` : null,
        is_currently_working: data[`is_currently_working_${uuid}`],
        // (a.split("\n").filter(a => a.trim().length > 0)
        responsibilities: data[`responsibilities_${uuid}`],

        achievements: data[`achievements_${uuid}`],
      };
      workExperience.push(obj);
    });

    if (hasError) {
      return;
    }
    request("PUT", "job-seeker-cv/edit-step-3", {
      workExperience,
      careerPrefrence,
    });
  };

  return (
    <CvParent>
      {renderStepComponent && (
        <CvStep3
          mode="edit"
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
          // cities={cities}
          // countrySelectedHandler={countrySelectedHandler}
          jobAddHandler={jobAddHandler}
          unregister={unregister}
          setValue={setValue}
          control={control}
          careerPrefrence={profile.careerPrefrence}
          getValues={getValues}
          workExpCities={workExpCities}
        />
      )}
    </CvParent>
  );
};

export async function getServerSideProps(context) {
  createAxiosCookies(context);
  const { lang } = getCookies(context);
    let lang_code = "en";

    try {
        const language = JSON.parse(lang)
        
        lang_code = String(language.code).toLowerCase()
    } catch (error) {
        lang_code = "en"
    }

  let profile = await editCv3Data();
  let res, res1, res2, res3, res4;
  try {
    res = await axiosInstance.get("master/countries");
    res1 = await axiosInstance.get("master/job-industry-list");
    res2 = await axiosInstance.get("master/job-category-list");
    res3 = await axiosInstance.get("master/job-type-list");
    res4 = await axiosInstance.get("master/carrier-level-list");
  } catch (err) {
    return false;
  }
  return {
    props: {
      isProtected: true,
      roles: [1],
      profile: profile ? profile : {},
      country: res?.data?.list?.record,
      jobIndustry: res1?.data?.list,
      jobCategory: res2?.data?.list,
      jobType: res3?.data?.list,
      careerLevel: res4?.data?.list,
      ...(await serverSideTranslations(lang_code, [
        'common',
      ])),
    },
  };
}

export default Step3;
