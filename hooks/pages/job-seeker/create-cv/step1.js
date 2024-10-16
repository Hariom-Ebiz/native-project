import React, { useEffect, useState } from "react";
import Header from "@/components/user/Header";
import SidebarCreateCv from "@/components/user/SidebarCreateCv";
import styles from "@/styles/create_cv_steps.module.css";
import { createAxiosCookies } from "@/fn";
import { useForm } from "react-hook-form";
import useRequest from "@/hooks/useRequest";
import moment from "moment";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { API, axiosInstance } from "@/api";
import { useRouter } from "next/router";
import { updateCvStep } from "@/store/authSlice";
import {
  NumberInput,
  SelectInput,
  TextAreaInput,
  TextInput,
} from "@/components/cv/inputFields";
import CvStep1 from "@/components/create-cv/CvStep1";

const Step1 = ({ country, profile }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    setValue,
    reset,
    watch
  } = useForm();

  const dispatch = useDispatch();
  const router = useRouter();
  const { loggedIn, userId, cvStep, firstName, lastName, email } = useSelector(
    (store) => store.auth
  );
  const [seletedProfilePic, setSelectedProfilePic] = useState(null);
  const [seletedCoverPic, setSelectedCoverPic] = useState(null);
  const [cities, setCities] = useState([]);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [coverPicUrl, setCoverPicUrl] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [disableField, setDisableField] = useState(false);
  const [toRemoveProfilePic, setToRemoveProfilePic] = useState(false);
  const [toRemoveCoverPic, setToRemoveCoverPic] = useState(false);
  const { request, response } = useRequest();
  // const { request: getCvReq, response: getCvRes } = useRequest();
  const { request: requestCity, response: responseCity } = useRequest();

  useEffect(() => {
    if (cvStep == 5) {
      router.push("/job-seeker/edit-cv/step1");
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
    if (loggedIn) {
      setValue("first_name", firstName);
      setValue("last_name", lastName);
      setValue("contact_email", email);
    }
    if (firstName && lastName) {
      document.getElementById(`first_name`).disabled = true;
      document.getElementById(`last_name`).disabled = true;
    }
  }, []);

  // useEffect(() => {
  //   if (!loggedIn || !userId) return;
  //   getCvReq("GET", "job-seeker-cv/get-step-1");
  // }, [loggedIn]);

  useEffect(() => {
    if (responseCity && responseCity.status) {
      if (responseCity.list && responseCity.list.length > 0) {
        setCities(responseCity?.list);
      }
    }
  }, [responseCity]);

  const countrySelectedHandler = (data) => {
    if (data) {
      requestCity("GET", `master/cities?country=${data}`);
    }
  };

  useEffect(() => {
    if (profile) {
      let {
        profile_pic,
        cover_pic,
        dob,
        current_country,
        have_driving_licence,
        want_to_relocate,
        cityList,
      } = profile;
      // requestCity("GET", `master/cities?country=${current_country}`);
      const day = moment(dob, "YYYY-MM-DD").format("DD");
      const month = moment(dob, "YYYY-MM-DD").format("MM");
      const year = moment(dob, "YYYY-MM-DD").format("YYYY");
      const formattedDob = moment(dob).format("YYYY-MM-DD");

      setProfilePicUrl(profile_pic ? `${API}/${profile_pic}` : null);
      setCoverPicUrl(cover_pic ? `${API}/${cover_pic}` : null);
      setCities(cityList);

      setTimeout(() => {
        reset({
          ...profile,
          day,
          month,
          year,
          dob: formattedDob,
          have_driving_licence: have_driving_licence ? "1" : "0",
          want_to_relocate: want_to_relocate ? "1" : "0",
        });
      }, 1000);
      setIsEditMode(true);
    }
  }, [profile]);

  const onSubmit = (data) => {
    let {
      first_name,
      last_name,
      middle_name,
      day,
      month,
      year,
      dob,
      nationality,
      martial_status,
      have_driving_licence,
      current_country,
      current_city,
      current_area,
      want_to_relocate,
      contact_mobile,
      contact_alt_mobile,
      contact_email,
      about,
    } = data;
    // let date = day + "-" + month + "-" + year;
    // let newDate = date.toString();
    // let dob = moment(newDate, "DD-MM-YYYY").format("YYYY-MM-DD");

    let formData = new FormData();
    formData.append("first_name", first_name);
    formData.append("last_name", last_name);
    formData.append("middle_name", middle_name);
    formData.append("dob", dob);
    formData.append("nationality", nationality);
    formData.append("martial_status", martial_status);
    formData.append("have_driving_licence", have_driving_licence);
    formData.append("current_country", current_country);
    formData.append("current_city", current_city);
    formData.append("current_area", current_area);
    formData.append("want_to_relocate", want_to_relocate);
    formData.append("contact_mobile", contact_mobile);
    formData.append("contact_alt_mobile", contact_alt_mobile);
    formData.append("contact_email", contact_email);
    formData.append("about", about);
    // if (seletedProfilePic) {
    //   formData.append("profile_pic", seletedProfilePic);
    // }
    // if (seletedCoverPic) {
    //   formData.append("cover_pic", seletedCoverPic);
    // }

    if (toRemoveProfilePic && profile.profile_pic) {
      formData.append("to_remove_profile_pic", true);
    } else if (seletedProfilePic) {
      formData.append("profile_pic", seletedProfilePic);
    }

    if (toRemoveCoverPic && profile.cover_pic) {
      formData.append("to_remove_cover_pic", true);
    } else if (seletedCoverPic) {
      formData.append("cover_pic", seletedCoverPic);
    }
    if (isEditMode) {
      request("PUT", "job-seeker-cv/edit-step-1", formData);
    } else {
      request("POST", "job-seeker-cv/create-step-1", formData);
    }
  };

  useEffect(() => {
    if (response && response.status) {
      toast.success(response.message);
      dispatch(updateCvStep(2));
      router.push("/job-seeker/create-cv/step2");
    }
  }, [response]);

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
                <CvStep1
                  mode="create"
                  profilePicUrl={profilePicUrl}
                  coverPicUrl={coverPicUrl}
                  setSelectedProfilePic={setSelectedProfilePic}
                  setProfilePicUrl={setProfilePicUrl}
                  setSelectedCoverPic={setSelectedCoverPic}
                  setCoverPicUrl={setCoverPicUrl}
                  register={register}
                  errors={errors}
                  disableField={disableField}
                  country={country}
                  cities={cities}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  countrySelectedHandler={countrySelectedHandler}
                  setToRemoveProfilePic={setToRemoveProfilePic}
                  setToRemoveCoverPic={setToRemoveCoverPic}
                  watch={watch}
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
  res = await axiosInstance.get("master/countries");
  res1 = await axiosInstance.get(`job-seeker-cv/get-step-1`);
  return {
    props: {
      isProtected: true,
      roles: [1],
      country: res?.data?.list?.record || {},
      profile: res1?.data?.data || null,
    },
  };
}

export default Step1;
