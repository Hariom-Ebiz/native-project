import React, { useEffect, useState } from "react";
import styles from "@/styles/profile.module.css";
import useRequest from "@/hooks/useRequest";
import { createAxiosCookies } from "@/fn";
import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import { Controller, useForm } from "react-hook-form";
import { API, axiosInstance } from "@/api";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { update } from "@/store/authSlice";
import {
  NumberInput,
  SelectInput,
  TextInput,
} from "@/components/cv/inputFields";
import ChangePassword from "@/components/jobSeeker/ChangePassword";

const EditProfile = ({ profileData, statusData, liveInData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    control,
  } = useForm();

  const dispatch = useDispatch();

  const [profile, setProfile] = useState(profileData.user);
  const [details, setDetails] = useState(profileData.details);
  const [image, setImage] = useState();
  const [displayImage, setDisplayImage] = useState();
  const [status, setStatus] = useState(statusData);
  const [livesIn, setLivesIn] = useState(liveInData);

  const { request: requestUpdateProfile, response: responseUpdateProfile } =
    useRequest();

  useEffect(() => {
    const { first_name, last_name, email } = profile;
    const { gender, status, lives_in, yob, profile_picture } = details;
    setImage(profile_picture ? profile_picture : "");
    setValue("first_name", first_name);
    setValue("last_name", last_name);
    setValue("email", email);
    setValue("gender", gender);
    setValue("status", status);
    setValue("lives_in", lives_in);
    setValue("yob", yob);
  }, [profile, details]);

  const onSubmit = (data) => {
    const { first_name, last_name, gender, status, lives_in, yob } = data;
    let fd = new FormData();
    fd.append("first_name", first_name);
    fd.append("last_name", last_name);
    fd.append("gender", gender);
    fd.append("status", status);
    fd.append("lives_in", lives_in);
    fd.append("yob", yob);

    let error = 0;
    if (displayImage) {
      if (data.profile_picture && data.profile_picture.type) {
        const typeArr = data.profile_picture.type.split("/");

        if (typeArr.length > 0 && typeArr[0] && typeArr[0] != "image") {
          error = 1;
          setError("profile_picture", { type: "manual" });
        } else {
          fd.append("file", data.profile_picture);
        }
      }
    } else {
      if (data.profile_picture && data.profile_picture.type) {
        const typeArr = data.profile_picture.type.split("/");

        if (typeArr.length > 0 && typeArr[0] && typeArr[0] != "image") {
          error = 1;
          setError("profile_picture", { type: "manual" });
        } else {
          fd.append("file", data.profile_picture);
        }
      } else {
        if (image == null || image == "undefined") {
          fd.append("old_image", "");
        } else {
          fd.append("old_image", image);
        }
      }
    }
    if (error == 1) {
      return;
    }
    requestUpdateProfile("PUT", "user/job-seeker/update-profile", fd);
  };

  useEffect(() => {
    if (responseUpdateProfile) {
      if (responseUpdateProfile.status) {
        toast.success(responseUpdateProfile.message);
        if (responseUpdateProfile.data) {
          dispatch(
            update({
              firstName: responseUpdateProfile?.data?.first_name,
              lastName: responseUpdateProfile?.data?.last_name,
              profilePic: responseUpdateProfile?.data?.profile_picture,
            })
          );
          setImage(
            responseUpdateProfile?.data?.profile_picture
              ? responseUpdateProfile.data.profile_picture
              : ""
          );
          setDisplayImage("");
        }
      }
    }
  }, [responseUpdateProfile]);

  const handleImage = (event) => {
    event.preventDefault();
    if (event.target.files[0] && event.target.files[0].type) {
      const typeArr = event.target.files[0].type.split("/");
      if (typeArr.length > 0 && typeArr[0] && typeArr[0] != "image") {
        setDisplayImage();
        setError("profile_picture", { type: "manual" });
        setValue("profile_picture", event.target.files[0]);
        return;
      }
      setDisplayImage(URL.createObjectURL(event.target.files[0]));
      setValue("profile_picture", event.target.files[0]);
      setError("profile_picture", "");
    }
  };

  return (
    <JobSeekerAuth data={{ title:`Account`}} >
      <div className="page_container">
        <div className="main_content main_bg" id="body_lang_css">
          <div className={styles.dash_wrapper}>
            <h2 className={styles.inner_heading}>Edit Basic Info</h2>
            <div className={styles.form_wrapper}>
              <div className="row g-4">
                <div className="col-sm-12 col-md-12">
                  <div className={styles.manage_content_box}>
                    <div className={styles.upload_img_block}>
                      <div className={styles.avatar_upload}>
                        <div className={styles.avatar_edit}>
                          <Controller
                            control={control}
                            name="profile_picture"
                            render={({ field: { onChange, value, ref } }) => (
                              <input
                                type="file"
                                id="imageUpload"
                                onChange={handleImage}
                               // inputref={ref}
                                accept="image/*"
                              />
                            )}
                          />
                        </div>

                        {displayImage || image ? (
                          <div className={styles.avatar_preview}>
                            <div
                              id="imagePreview"
                              style={{
                                backgroundImage: `url(${
                                  displayImage
                                    ? displayImage
                                    : image
                                    ? API + "/" + image
                                    : "/img/profile.png"
                                })`,
                              }}
                            ></div>
                          </div>
                        ) : (
                          <img src="/img/user-icon.png" alt="image" />
                        )}

                        <div className={styles.upload_btn_label}>
                          <label htmlFor="imageUpload">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-pencil-square"
                              viewBox="0 0 16 16"
                            >
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                              <path
                                fillRule="evenodd"
                                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                              />
                            </svg>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <TextInput
                  label="First Name"
                  placeholder="First Name"
                  name="first_name"
                  register={register}
                  errors={errors}
                  registerFields={{
                    required: {
                      value: true,
                      message: "This field is required.",
                    },
                    pattern: {
                      value: /^[a-zA-Z-]*$/,
                      message: "First Name must contain only alphabets.",
                    },
                  }}
                  otherFields={{}}
                  colClass="col-sm-12 col-md-4"
                />

                <TextInput
                  label="Family Name"
                  placeholder="Family Name"
                  name="last_name"
                  register={register}
                  errors={errors}
                  registerFields={{
                    required: {
                      value: true,
                      message: "This field is required.",
                    },
                    pattern: {
                      value: /^[a-zA-Z-]*$/,
                      message: "First Name must contain only alphabets.",
                    },
                  }}
                  otherFields={{}}
                  colClass="col-sm-12 col-md-4"
                />

                <TextInput
                  label="Email Address"
                  placeholder="Enter email address"
                  name="email"
                  register={register}
                  errors={errors}
                  registerFields={{
                    required: {
                      value: true,
                      message: "This field is required.",
                    },
                    pattern: {
                      value:
                        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                      message: "Please provide a valid email.",
                    },
                  }}
                  otherFields={{
                    disabled: true,
                  }}
                  colClass="col-sm-12 col-md-4"
                />

                <div className="col-sm-12 col-md-4">
                  <div className="input_block">
                    <label className={styles.form_label}>Gender</label>
                    <div className={styles.radio_block}>
                      <div className={`${styles.form_check} form-check`}>
                        <input
                          className={`${styles.form_check_input} form-check-input`}
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault1"
                          value="male"
                          {...register("gender", {
                            required: {
                              value: true,
                              message: "Gender is required",
                              defaultValue: "male",
                            },
                          })}
                        />
                        <label
                          className={`${styles.form_check_label} form-check-label`}
                          htmlFor="flexRadioDefault1"
                        >
                          Male
                        </label>
                      </div>
                      <div className={`${styles.form_check} form-check`}>
                        <input
                          className={`${styles.form_check_input} form-check-input`}
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault2"
                          value="female"
                          {...register("gender", {
                            required: {
                              value: true,
                              message: "Gender is required",
                            },
                          })}
                        />
                        <label
                          className={`${styles.form_check_label} form-check-label`}
                          htmlFor="flexRadioDefault2"
                        >
                          Female
                        </label>
                      </div>
                    </div>
                    {errors?.["gender"] && (
                      <div className="invalid-feedback d-block">
                        {errors?.["gender"].message}
                      </div>
                    )}
                  </div>
                </div>
                <SelectInput
                  label="Status"
                  name="status"
                  register={register}
                  errors={errors}
                  registerFields={{
                    required: {
                      value: true,
                      message: "This field is required.",
                    },
                  }}
                  options={
                    <>
                      <option value="">Select status</option>
                      {status?.map((val) => {
                        return (
                          <option value={val.id} key={val.id}>
                            {val.name}
                          </option>
                        );
                      })}
                    </>
                  }
                  colClass="col-sm-12 col-md-4"
                />

                <SelectInput
                  label="Lives In"
                  name="lives_in"
                  register={register}
                  errors={errors}
                  registerFields={{
                    required: {
                      value: true,
                      message: "This field is required.",
                    },
                  }}
                  options={
                    <>
                      <option value="">Select lives in</option>
                      {livesIn?.map((val) => {
                        return (
                          <option value={val.id} key={val.id}>
                            {val.name}
                          </option>
                        );
                      })}
                    </>
                  }
                  colClass="col-sm-12 col-md-4"
                />

                <NumberInput
                  label="Birth Year"
                  name="yob"
                  placeholder="1998"
                  register={register}
                  errors={errors}
                  registerFields={{
                    required: {
                      value: true,
                      message: "This field is required.",
                    },
                    pattern: {
                      value: /^\d{4}$/,
                      message: "please enter only four digit",
                    },
                  }}
                  colClass="col-sm-12 col-md-4"
                />

                <div className="col-sm-12 col-md-12">
                  <div className={styles.next_pre_btn}>
                    <button
                      type="button"
                      className={`btn btn-primary ${styles.dash_theem_btn}`}
                      onClick={handleSubmit(onSubmit)}
                    >
                      save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ChangePassword />
        </div>
      </div>
    </JobSeekerAuth>
  );
};
export async function getServerSideProps(context) {
  createAxiosCookies(context);
  let res, res1, res2;

  res = await axiosInstance.get("user/job-seeker/profile");
  res1 = await axiosInstance.get("master/user-status");
  res2 = await axiosInstance.get("master/lives-in-list");
  return {
    props: {
      isProtected: true,
      roles: [1],
      profileData: res?.data?.data || {},
      statusData: res1?.data?.list || {},
      liveInData: res2?.data?.list || {},
    },
  };
}

export default EditProfile;
