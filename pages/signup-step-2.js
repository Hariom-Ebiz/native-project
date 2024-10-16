import React, { useEffect, useState } from "react";
import styles from "../styles/login_signup.module.css";
import Link from "next/link";
import { useForm } from "react-hook-form";
import useRequest from "@/hooks/useRequest";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Authentication from "@/components/layout/authentication";
import { useDispatch } from "react-redux";
import { setModal } from "@/store/siteSlice";
import { axiosInstance } from "@/api";

const SignupStepTwo = ({
  first_name,
  last_name,
  email,
  password,
  token,
  statusData,
  liveInData,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [seletedProfilePic, setSelectedProfilePic] = useState(null);
  const [status, setStatus] = useState(statusData);
  const [livesIn, setLivesIn] = useState(liveInData);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { request, response } = useRequest();

  const onSubmit = (data) => {
    let { gender, status, lives_in, yob } = data;

    let formData = new FormData();
    // formData.append("token", token);
    formData.append("gender", gender);
    formData.append("status", status);
    formData.append("lives_in", lives_in);
    formData.append("yob", yob);

    formData.append("first_name", first_name);
    formData.append("last_name", last_name);
    formData.append("email", email);
    formData.append("password", password);

    if (seletedProfilePic) {
      formData.append("profile_picture", seletedProfilePic);
    }

    // request("Post", "user/job-seeker/add-more-info", formData);

    request("Post", "user/job-seeker/signup-combined", formData);
  };

  useEffect(() => {
    if (response && response.status) {
      // dispatch(
      //   setModal(
      //     <>
      //       <div className="modal_inner">
      //         <div className="icon_block">
      //           <img src="/img/icon.png" alt="" />
      //         </div>
      //         <h3>{response.message}</h3>
      //       </div>
      //     </>
      //   )
      // );
      // router.push("/login");
      router.push(`/email-send?id=${response.id}&email=${response.email}`);
    }
  }, [response]);

  return (
    <Authentication>
      <section className={styles.Login_wrapper}>
        <div className={styles.login_right_content}>
          <img src="img/2.png" alt="" />
        </div>
        <div className={(styles.login_page_wrapper, styles.login_signup_pages)}>
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12"></div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className={styles.login_sign_up_block}>
                  <div className={styles.loginTitleBox}>
                    <div className={styles.mobile_device}>
                      <Link href="/">
                        <img src="/img/logo.svg" alt="logo" />
                      </Link>
                    </div>
                    <h1 className={`${styles.login_title} `}>
                      <Link
                        href="signup-step-1"
                        className={styles.history_back}
                      >
                        <i className="far fa-arrow-left"></i>
                      </Link>{" "}
                      Add More Information{" "}
                    </h1>
                  </div>
                  <div className={styles.Login_InputBox}>
                    <div className={styles.form_group}>
                      <label className={styles.form_label}>Add Photo</label>
                      <div className={`${styles.upload_img_block} ${styles.signup_upload}`} >
                        <div className={styles.avatar_upload}>
                          <div className={styles.avatar_edit}>
                            {/* <img
                              style={{ width: "100px" }}
                              src={
                                seletedProfilePic
                                  ? URL.createObjectURL(seletedProfilePic)
                                  : "/img/profile-upload-img.png"
                              }
                              alt=""
                            /> */}
                            <input
                              type="file"
                              id="imageUpload"
                              accept=".png, .jpg, .jpeg"
                              name="profile_picture"
                              onChange={(e) => {
                                setSelectedProfilePic(e.target.files[0]);
                              }}
                            />
                          </div>
                          <div className={styles.avatar_preview}>
                            {seletedProfilePic && (
                              <img
                                style={{ width: "100px" }}
                                src={URL.createObjectURL(seletedProfilePic)}
                                alt=""
                              />
                            )}

                            {/* <div
                              id="imagePreview"
                              style={{
                                backgroundImage:
                                  `url(${seletedProfilePic
                                    ? URL.createObjectURL(seletedProfilePic)
                                    : "/img/profile-upload-img.png"})`,
                              }}
                            ></div> */}
                          </div>
                          <div className={styles.upload_btn_label}>
                            <label htmlFor="imageUpload">
                              {/* <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M32.4757 8.3125H27.3766L26.7829 6.53125C26.4967 5.66636 25.9449 4.9138 25.2061 4.38076C24.4673 3.84772 23.5792 3.56138 22.6682 3.5625H15.3318C14.421 3.56181 13.5333 3.84834 12.7947 4.38134C12.0562 4.91433 11.5046 5.66665 11.2183 6.53125L10.6234 8.3125H5.52425C4.37446 8.31376 3.27212 8.77107 2.45909 9.5841C1.64607 10.3971 1.18876 11.4995 1.1875 12.6493V30.1055C1.19001 31.2545 1.64788 32.3556 2.46077 33.1676C3.27366 33.9796 4.37528 34.4362 5.52425 34.4375H32.4805C33.6295 34.435 34.7306 33.9771 35.5426 33.1642C36.3546 32.3513 36.8112 31.2497 36.8125 30.1008V12.6445C36.81 11.4955 36.3521 10.3944 35.5392 9.58241C34.7263 8.77041 33.6247 8.31376 32.4757 8.3125V8.3125ZM34.4375 30.1008C34.4369 30.6208 34.23 31.1195 33.8622 31.4872C33.4945 31.855 32.9958 32.0619 32.4757 32.0625H5.52425C5.00415 32.0619 4.50554 31.855 4.13778 31.4872C3.77001 31.1195 3.56313 30.6208 3.5625 30.1008V12.6445C3.56438 12.1252 3.77182 11.6278 4.13945 11.2611C4.50708 10.8944 5.00498 10.6881 5.52425 10.6875H11.4796C11.7287 10.6873 11.9715 10.6088 12.1735 10.463C12.3755 10.3172 12.5266 10.1116 12.6053 9.87525L13.471 7.27819C13.601 6.88756 13.8507 6.5478 14.1848 6.30714C14.5188 6.06648 14.9201 5.93715 15.3318 5.9375H22.6682C23.0801 5.93705 23.4816 6.06649 23.8157 6.3074C24.1498 6.54831 24.3994 6.88843 24.529 7.27938L25.3947 9.87525C25.4734 10.1116 25.6245 10.3172 25.8265 10.463C26.0285 10.6088 26.2713 10.6873 26.5204 10.6875H32.4757C32.9958 10.6881 33.4945 10.895 33.8622 11.2628C34.23 11.6305 34.4369 12.1292 34.4375 12.6493V30.1008Z" fill="white"/>
                                                        <path d="M19 11.875C17.2385 11.875 15.5166 12.3973 14.052 13.376C12.5873 14.3546 11.4458 15.7456 10.7717 17.373C10.0976 19.0004 9.92124 20.7911 10.2649 22.5188C10.6085 24.2464 11.4568 25.8334 12.7023 27.0789C13.9479 28.3245 15.5348 29.1727 17.2625 29.5164C18.9901 29.86 20.7809 29.6836 22.4083 29.0096C24.0357 28.3355 25.4266 27.1939 26.4053 25.7293C27.3839 24.2647 27.9063 22.5427 27.9063 20.7812C27.9037 18.4199 26.9646 16.1561 25.2949 14.4864C23.6252 12.8167 21.3613 11.8775 19 11.875V11.875ZM19 27.3125C17.7082 27.3125 16.4455 26.9294 15.3714 26.2118C14.2974 25.4941 13.4603 24.4741 12.9659 23.2807C12.4716 22.0872 12.3422 20.774 12.5943 19.5071C12.8463 18.2401 13.4683 17.0764 14.3817 16.163C15.2951 15.2495 16.4589 14.6275 17.7258 14.3755C18.9928 14.1235 20.306 14.2528 21.4994 14.7472C22.6928 15.2415 23.7129 16.0786 24.4305 17.1527C25.1482 18.2267 25.5313 19.4895 25.5313 20.7812C25.5294 22.5129 24.8406 24.173 23.6162 25.3975C22.3918 26.6219 20.7316 27.3106 19 27.3125V27.3125Z" fill="white"/>
                                                        <path d="M30.875 15.4375C31.5308 15.4375 32.0625 14.9058 32.0625 14.25C32.0625 13.5942 31.5308 13.0625 30.875 13.0625C30.2192 13.0625 29.6875 13.5942 29.6875 14.25C29.6875 14.9058 30.2192 15.4375 30.875 15.4375Z" fill="white"/>
                                                        </svg> */}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.form_group}>
                      <label className={styles.form_label}>Gender</label>

                      <div className={styles.custom_radio}>
                        <div className={styles.form_check}>
                          <input
                            className="form-check-input"
                            type="radio"
                            value="male"
                            id="flexRadioDefault1"
                            {...register("gender", {
                              required: {
                                value: true,
                                message: "Gender is required",
                                defaultValue: "male",
                              },
                            })}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexRadioDefault1"
                          >
                            Male
                          </label>
                        </div>
                        <div className={styles.form_check}>
                          <input
                            className="form-check-input"
                            type="radio"
                            value="female"
                            id="flexRadioDefault2"
                            {...register("gender", {
                              required: {
                                value: true,
                                message: "Gender is required",
                              },
                            })}
                          />
                          <label
                            className="form-check-label"
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
                    <div className={styles.form_group}>
                      <label className={styles.form_label}>Status</label>
                      <select
                        className={`form-select ${styles.form_control}`}
                        aria-label="Default select example"
                        name="status"
                        {...register("status", {
                          required: {
                            // value: true,
                            value: false,
                            message: "This field is required.",
                          },
                        })}
                      >
                        <option value="">Select status</option>
                        {status?.map((val) => {
                          return (
                            <option value={val.id} key={val.id}>
                              {val.name}
                            </option>
                          );
                        })}
                      </select>
                      {errors?.["status"] && (
                        <div className="invalid-feedback d-block">
                          {errors?.["status"].message}
                        </div>
                      )}
                    </div>
                    <div className={styles.form_group}>
                      <label className={styles.form_label}>Lives In</label>
                      <select
                        className={`form-select ${styles.form_control}`}
                        aria-label="Default select example"
                        name="lives_in"
                        {...register("lives_in", {
                          required: {
                            // value: true,
                            value: false,
                            message: "This field is required.",
                          },
                        })}
                      >
                        <option value="">Select lives in</option>
                        {livesIn?.map((val) => {
                          return (
                            <option value={val.id} key={val.id}>
                              {val.name}
                            </option>
                          );
                        })}
                      </select>
                      {errors?.["lives_in"] && (
                        <div className="invalid-feedback d-block">
                          {errors?.["lives_in"].message}
                        </div>
                      )}
                    </div>
                    <div className={styles.form_group}>
                      <label className={styles.form_label}>Birth Year</label>
                      <input
                        type="number"
                        className={styles.form_control}
                        placeholder="1996"
                        name="yob"
                        {...register("yob", {
                          required: {
                            value: true,
                            message: "This field is required.",
                          },
                        })}
                      />
                      {errors?.["yob"] && (
                        <div className="invalid-feedback d-block">
                          {errors?.["yob"].message}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="login_button">
                    <button
                      type="button"
                      className={`${styles.btn_primary} w-100`}
                      onClick={handleSubmit(onSubmit)}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Authentication>
  );
};

export default SignupStepTwo;

export async function getServerSideProps(context) {
  // const {
  //   query: { token },
  // } = context;

  // if (!token) {
  //   return {
  //     redirect: {
  //       permanent: false,
  //       destination: "/",
  //     },
  //   };
  // }

  const {
    query: { first_name, last_name, email, password },
  } = context;

  if (!first_name || !last_name || !email || !password) {
    return {
      redirect: {
        permanent: false,
        destination: "/signup-step-1",
      },
    };
  }

  let res1, res2;

  res1 = await axiosInstance.get("master/user-status");
  res2 = await axiosInstance.get("master/lives-in-list");

  return {
    props: {
      isProtected: false,
      first_name,
      last_name,
      email,
      password,
      // token,
      statusData: res1?.data?.list || {},
      liveInData: res2?.data?.list || {},
    },
  };
}
