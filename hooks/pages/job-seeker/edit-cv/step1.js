import React, { useEffect, useState } from "react";
import { createAxiosCookies } from "@/fn";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { API, axiosInstance } from "@/api";
import moment from "moment";
import useRequest from "@/hooks/useRequest";
import {
  countryListData,
  editCVData,
} from "../../../services/jobSeeker/profile";
import { toast } from "react-toastify";
import Link from "next/link";
import { useSelector } from "react-redux";
import { TextInput } from "@/components/cv/inputFields";
import CvStep1 from "@/components/create-cv/CvStep1";
import CvParent from "@/components/create-cv/CvParent";

const Step1 = ({ profile, country, nationalityList }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
    unregister,
    reset,
    watch
  } = useForm();

  const router = useRouter();
  const { loggedIn, userId, cvStep } = useSelector((store) => store.auth);
  const [cities, setCities] = useState([]);
  const [areas, setArea] = useState([]);

  const [seletedProfilePic, setSelectedProfilePic] = useState(null);
  const [seletedCoverPic, setSelectedCoverPic] = useState(null);

  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [coverPicUrl, setCoverPicUrl] = useState("");

  const [toRemoveProfilePic, setToRemoveProfilePic] = useState(false);
  const [toRemoveCoverPic, setToRemoveCoverPic] = useState(false);

  const { request, response } = useRequest();
  const { request: requestCity, response: responseCity } = useRequest();

  const { request: requestArea, response: responseArea } = useRequest();

  useEffect(() => {
    if (cvStep != 5) {
      router.push("/job-seeker/create-cv/step1");
    }
  }, [cvStep]);

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
      setCities(cityList);

      setProfilePicUrl(profile_pic ? `${API}/${profile_pic}` : null);
      setCoverPicUrl(cover_pic ? `${API}/${cover_pic}` : null);

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
    }
  }, [profile]);

  const onSubmit = (data) => {
    console.log(">>>>>>ddd", data);
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
      current_other_area,
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
    formData.append("current_other_area", current_other_area);
    formData.append("want_to_relocate", want_to_relocate);
    formData.append("contact_mobile", contact_mobile);
    formData.append("contact_alt_mobile", contact_alt_mobile);
    formData.append("contact_email", contact_email);
    formData.append("about", about);

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

    request("PUT", "job-seeker-cv/edit-step-1", formData);
  };

  useEffect(() => {
    if (response && response.status) {
      toast.success(response.message);
      router.push("/job-seeker/edit-cv/step2");
    }
  }, [response]);

  useEffect(() => {
    if (responseArea && responseArea.status) {
      setArea(responseArea?.list); 
    }
  }, [responseArea])

  const areaSelectHandler = (data) => {
    if (data) {
      requestArea("GET", `master/areas?city=${data}`)
    }
  }

  return (
    <CvParent>
      <CvStep1
        mode="edit"
        profilePicUrl={profilePicUrl}
        coverPicUrl={coverPicUrl}
        setSelectedProfilePic={setSelectedProfilePic}
        setProfilePicUrl={setProfilePicUrl}
        setSelectedCoverPic={setSelectedCoverPic}
        setCoverPicUrl={setCoverPicUrl}
        register={register}
        errors={errors}
        country={country}
        nationality={nationalityList}
        areas={areas}
        cities={cities}
        handleSubmit={handleSubmit}
        areaSelecetHandler={areaSelectHandler}
        onSubmit={onSubmit}
        countrySelectedHandler={countrySelectedHandler}
        setToRemoveProfilePic={setToRemoveProfilePic}
        setToRemoveCoverPic={setToRemoveCoverPic}
        watch={watch}
        setValue={setValue}
      />
    </CvParent>
  );
};

export async function getServerSideProps(context) {
  createAxiosCookies(context);
  let res, res2;

  let profile = await editCVData();
  res = await axiosInstance.get("master/countries");
  res2 = await axiosInstance.get("master/nationality");
  return {
    props: {
      isProtected: true,
      roles: [1],
      profile: profile ? profile : {},
      country: res?.data?.list?.record || {},
      nationalityList: res2?.data?.list?.record || [],
    },
  };
}

export default Step1;
