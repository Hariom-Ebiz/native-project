import React, { useEffect, useState } from "react";
import styles from "../../styles/login_employee_signup.module.css";
import Link from "next/link";
import { useForm } from "react-hook-form";
import useRequest from "@/hooks/useRequest";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import useTimer from "@/hooks/useTimer";
import Authentication from "@/components/layout/authentication";
import { createAxiosCookies } from "@/fn";
import Head from "next/head";
import { setModal } from "@/store/siteSlice";
import { useDispatch } from "react-redux";
import { countriesData } from "@/services/jobSeeker/profile";
import { isBusinessEmail } from "@/utils/helper";
import { CANDIDATE_URL } from "@/api";

const SignupStep = ({ countries }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    setValue,
    watch,
  } = useForm();

  const dispatch = useDispatch();


  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [lang, setLang] = useState(null);
  const [seletedProfilePic, setSelectedProfilePic] = useState(null);

  const router = useRouter();
  // const { timer, start, isRunning } = useTimer(10);
  const { request, response } = useRequest();
  var localData =
    localStorage.getItem("data") != undefined
      ? JSON.parse(localStorage.getItem("data"))
      : {};

  useEffect(() => {
    setValue("email", "");
    setValue("password", "");
    // if (localData) {
    //   setValue("first_name", localData.first_name);
    //   setValue("last_name", localData.last_name);
    //   setValue("email", localData.email);
    //   setValue("password", localData.password);
    //   setValue("confirm_password", localData.confirm_password);
    //   localStorage.setItem("data", JSON.stringify({}));
    // }


    if (localStorage.getItem("lang")) {
      setLang(JSON.parse(localStorage.getItem("lang")).code)
    }

  }, []);
  const onSubmit = (data) => {
    const { first_name, last_name, email, password, confirm_password, country, term_condition } = data;

    if (!isBusinessEmail(email)) {
      setError("email", {
        type: "manual",
        message: "Please use a business email address.",
      });
      return;
    }

    if (password !== confirm_password) {
      setError("confirm_password", {
        type: "manual",
        message: "Confirm password do not match.",
      });
      return;
    }

    if (!term_condition) {
      setError("term_condition", {
        type: "manual",
        message: "This field is required.",
      });
      return;
    }

    // if (!term_use) {
    //   setError("term_use", {
    //     type: "manual",
    //     message: "This field is required.",
    //   });
    //   return;
    // }

    // localStorage.setItem("data", JSON.stringify(data));

    // request("POST", "user/job-seeker/signup", {
    //   first_name,
    //   last_name,
    //   email,
    //   password,
    // });

    request("POST", "user/email-verify", {
      email,
      user_role_id: 2
    });

    //   router.push(
    //   {
    //     pathname: `/signup-step-2`,
    //     query: { first_name, last_name, email, password },
    //   },
    //   "/signup-step-2"
    // );
  };

  useEffect(() => {
    if (response && response.type == "email_verify") {
      if (response?.status === true) {
        const { first_name, last_name, email, password, ...etc } = watch();
        let formData = new FormData();
        
        if (seletedProfilePic) {
          formData.append("logo", seletedProfilePic);
        }

        formData.append("country", etc.country);

        formData.append("first_name", first_name);
        formData.append("email", email);
        formData.append("password", password);
        // return
        // router.push(
        //   {
        //     pathname: `/email-send?id=${response.id}&email=${response.email}`,
        //     query: { id: response.id, email: response.email },
        //   },
        //   "/email-send"
        // );
        // router.push(`/email-send?id=${response.id}&email=${response.email}`);

        request("Post", "user/employer/signup", formData);

        // router.push(
        //   {
        //     pathname: `/signup-step-2`,
        //     query: { first_name, last_name, email, password },
        //   },
        //   "/signup-step-2"
        // );
      } else {
        // toast.error( "Email already exist.!");
        dispatch(
          setModal(
            <>
              <div className="modal_inner">
                <div className="icon_block">
                  <img src="/img/error.png" alt="" />
                </div>
                <h3>Email already exists </h3>
              </div>
            </>
          )
        );
      }
    }
  }, [response]);

  useEffect(() => {
    if (response && response.status && response.id) {
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
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <section  className={`${styles.Login_wrapper} ${(lang == "AR") ? styles.land_ar : ""}`} id="body_lang_css">
        <div className={styles.login_right_content}>
          <img src="/img/signup-bg.jpg" alt="" />
        </div>
        <div className={(styles.login_page_wrapper, styles.login_signup_pages)}>
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12"></div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className={styles.login_sign_up_block}>
                  <div className={styles.mobile_device}>
                    <Link href="/employer">
                      <img src="/img/logo.svg" alt="logo" />
                    </Link>
                  </div>
                  <div className={styles.sign_type}>
                    <input
                      type="radio"
                      className={`${styles.btn_check} btn-check`}
                      name="options"
                      id="option1"
                      autoComplete="off"

                    />
                    <Link href={""} onClick={() => {window.location.href = CANDIDATE_URL+"/signup-step-1"}}>
                      <label
                        className={`${styles.btn_secondary} ${styles.btn} btn`}
                        htmlFor="option1"
                      >
                        Career Seeker
                      </label>
                    </Link>

                    <input
                      type="radio"
                      className={`${styles.btn_check} btn-check`}
                      name="options"
                      id="option2"
                      autoComplete="off"
                      defaultChecked
                    />
                    <label
                      className={`${styles.btn_secondary} ${styles.btn} btn`}
                      htmlFor="option2"
                    >
                      Employer
                    </label>
                  </div>
                  <div className={styles.loginTitleBox}>
                    <h1 className={styles.login_title}>
                      Sign Up
                    </h1>
                  </div>

                  <div className={styles.Login_InputBox}>
                    <div className={`${styles.signup_upload} styles.form_group`}>
                      <label className={styles.form_label}>Add Logo</label>
                      <div className={styles.upload_img_block}>
                        <div className={`${styles.avatar_upload}`}>
                          <div className={`${styles.avatar_edit}`}>
                            <input type="file" id="imageUpload" onChange={(e) => {
                                setSelectedProfilePic(e.target.files[0]);
                              }} accept=".png, .jpg, .jpeg" />
                          </div>
                          <div className={styles.avatar_preview}>
                            {seletedProfilePic && (
                              <label htmlFor="imageUpload" style={{"cursor": "pointer", "zIndex": "20", "position": "relative"}}><img
                                style={{ width: "100px" }}
                                src={URL.createObjectURL(seletedProfilePic)}
                                alt=""
                              /></label>
                             
                            )}
                          </div>
                          <div className={styles.upload_btn_label}>
                            <label htmlFor="imageUpload">
                              {/* Add inline aftre upload image name inline style tag
                                                     <div className="avatar-preview">
                                                      <div className={`${styles.imagePreview}`} style={{backgroundImage: "url(img/logo.svg)"}}></div>
                                                    </div> */}
                              <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M32.4757 8.3125H27.3766L26.7829 6.53125C26.4967 5.66636 25.9449 4.9138 25.2061 4.38076C24.4673 3.84772 23.5792 3.56138 22.6682 3.5625H15.3318C14.421 3.56181 13.5333 3.84834 12.7947 4.38134C12.0562 4.91433 11.5046 5.66665 11.2183 6.53125L10.6234 8.3125H5.52425C4.37446 8.31376 3.27212 8.77107 2.45909 9.5841C1.64607 10.3971 1.18876 11.4995 1.1875 12.6493V30.1055C1.19001 31.2545 1.64788 32.3556 2.46077 33.1676C3.27366 33.9796 4.37528 34.4362 5.52425 34.4375H32.4805C33.6295 34.435 34.7306 33.9771 35.5426 33.1642C36.3546 32.3513 36.8112 31.2497 36.8125 30.1008V12.6445C36.81 11.4955 36.3521 10.3944 35.5392 9.58241C34.7263 8.77041 33.6247 8.31376 32.4757 8.3125V8.3125ZM34.4375 30.1008C34.4369 30.6208 34.23 31.1195 33.8622 31.4872C33.4945 31.855 32.9958 32.0619 32.4757 32.0625H5.52425C5.00415 32.0619 4.50554 31.855 4.13778 31.4872C3.77001 31.1195 3.56313 30.6208 3.5625 30.1008V12.6445C3.56438 12.1252 3.77182 11.6278 4.13945 11.2611C4.50708 10.8944 5.00498 10.6881 5.52425 10.6875H11.4796C11.7287 10.6873 11.9715 10.6088 12.1735 10.463C12.3755 10.3172 12.5266 10.1116 12.6053 9.87525L13.471 7.27819C13.601 6.88756 13.8507 6.5478 14.1848 6.30714C14.5188 6.06648 14.9201 5.93715 15.3318 5.9375H22.6682C23.0801 5.93705 23.4816 6.06649 23.8157 6.3074C24.1498 6.54831 24.3994 6.88843 24.529 7.27938L25.3947 9.87525C25.4734 10.1116 25.6245 10.3172 25.8265 10.463C26.0285 10.6088 26.2713 10.6873 26.5204 10.6875H32.4757C32.9958 10.6881 33.4945 10.895 33.8622 11.2628C34.23 11.6305 34.4369 12.1292 34.4375 12.6493V30.1008Z" fill="white" />
                                <path d="M19 11.875C17.2385 11.875 15.5166 12.3973 14.052 13.376C12.5873 14.3546 11.4458 15.7456 10.7717 17.373C10.0976 19.0004 9.92124 20.7911 10.2649 22.5188C10.6085 24.2464 11.4568 25.8334 12.7023 27.0789C13.9479 28.3245 15.5348 29.1727 17.2625 29.5164C18.9901 29.86 20.7809 29.6836 22.4083 29.0096C24.0357 28.3355 25.4266 27.1939 26.4053 25.7293C27.3839 24.2647 27.9063 22.5427 27.9063 20.7812C27.9037 18.4199 26.9646 16.1561 25.2949 14.4864C23.6252 12.8167 21.3613 11.8775 19 11.875V11.875ZM19 27.3125C17.7082 27.3125 16.4455 26.9294 15.3714 26.2118C14.2974 25.4941 13.4603 24.4741 12.9659 23.2807C12.4716 22.0872 12.3422 20.774 12.5943 19.5071C12.8463 18.2401 13.4683 17.0764 14.3817 16.163C15.2951 15.2495 16.4589 14.6275 17.7258 14.3755C18.9928 14.1235 20.306 14.2528 21.4994 14.7472C22.6928 15.2415 23.7129 16.0786 24.4305 17.1527C25.1482 18.2267 25.5313 19.4895 25.5313 20.7812C25.5294 22.5129 24.8406 24.173 23.6162 25.3975C22.3918 26.6219 20.7316 27.3106 19 27.3125V27.3125Z" fill="white" />
                                <path d="M30.875 15.4375C31.5308 15.4375 32.0625 14.9058 32.0625 14.25C32.0625 13.5942 31.5308 13.0625 30.875 13.0625C30.2192 13.0625 29.6875 13.5942 29.6875 14.25C29.6875 14.9058 30.2192 15.4375 30.875 15.4375Z" fill="white" />
                              </svg>
                            </label>
                          </div>
                          
                        </div>
                      </div>
                    </div>

                    <div className={styles.form_group}>
                      <label className={styles.form_label}>Company Name</label>
                      <input
                        type="text"
                        className={styles.form_control}
                        placeholder="Enter company name"
                        name="first_name"
                        {...register("first_name", {
                          required: {
                            value: true,
                            message: "This field is required.",
                          },
                        })}
                      />
                      {errors?.["first_name"] && (
                        <div className="invalid-feedback d-block">
                          {errors?.["first_name"].message}
                        </div>
                      )}
                      {errors?.first_name &&
                        errors?.first_name.type == "pattern" && (
                          <div className="invalid-feedback d-block">
                            First Name must contain only alphabets.
                          </div>
                        )}
                    </div>
                    {/* <div className={styles.form_group}>
                      <label className={styles.form_label}>Family name</label>
                      <input
                        type="text"
                        className={styles.form_control}
                        placeholder="Enter your last name"
                        name="last_name"
                        {...register("last_name", {
                          required: {
                            value: true,
                            message: "This field is required.",
                          },
                          pattern: {
                            value: /^[a-zA-Z-]*$/,
                          },
                        })}
                      />
                      {errors?.["last_name"] && (
                        <div className="invalid-feedback d-block">
                          {errors?.["last_name"].message}
                        </div>
                      )}
                      {errors?.family_name &&
                        errors?.family_name.type == "pattern" && (
                          <div className="invalid-feedback d-block">
                            Family Name must contain only alphabets.
                          </div>
                        )}
                    </div> */}
                    <div className={styles.form_group}>
                      <label className={styles.form_label}>Business Email Address</label>
                      <input
                        type="email"
                        className={styles.form_control}
                        placeholder="Enter email address"
                        name="email"
                        {...register("email", {
                          required: {
                            value: true,
                            message: "This field is required.",
                          },
                          pattern: {
                            value:
                              /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/,
                            message: "Please provide a valid email.",
                          },
                        })}
                      />
                      {errors?.["email"] && (
                        <div className="invalid-feedback d-block">
                          {errors?.["email"].message}
                        </div>
                      )}
                    </div>
                    <div className={styles.form_group}>
                      <label className={styles.form_label}>Password</label>
                      <div className="position-relative">
                        <input
                          type={isPasswordVisible ? "text" : "password"}
                          name="password"
                          className={styles.form_control}
                          placeholder="Enter password"
                          {...register("password", {
                            required: {
                              value: true,
                              message: "This field is required.",
                            },
                            pattern: {
                              value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
                              message:
                                "Password should be of 8 characters long with at least one uppercase, one lowercase and one number",
                            },
                          })}
                        />
                        {isPasswordVisible ? (
                          <span
                            className={styles.show_pass}
                            onClick={() =>
                              setIsPasswordVisible((prev) => false)
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-eye-slash"
                              viewBox="0 0 16 16"
                            >
                              <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                              <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                              <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                            </svg>
                          </span>
                        ) : (
                          <span
                            className={styles.show_pass}
                            onClick={() => setIsPasswordVisible((prev) => true)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-eye"
                              viewBox="0 0 16 16"
                            >
                              <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                              <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                            </svg>
                          </span>
                        )}
                      </div>
                      {/* <div className={styles.SignUp_select}>
                        Password must contain a combination of uppercase, lowercase, number, special charecter and must be atleast 8 charecters long.
                      </div> */}
                      {errors?.["password"] && (
                        <div className="invalid-feedback d-block">
                          {errors?.["password"].message}
                        </div>
                      )}
                    </div>
                    <div className={styles.form_group}>
                      <label className={styles.form_label}>
                        Confirm Password
                      </label>
                      <div className="position-relative">
                        <input
                          type={isConfirmPasswordVisible ? "text" : "password"}
                          name="confirm_password"
                          className={styles.form_control}
                          placeholder="Enter confirm password"
                          {...register("confirm_password", {
                            required: {
                              value: true,
                              message: "This field is required.",
                            },
                          })}
                        />
                        {isConfirmPasswordVisible ? (
                            <span
                              className={styles.show_pass}
                              onClick={() =>
                                setIsConfirmPasswordVisible((prev) => false)
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-eye-slash"
                                viewBox="0 0 16 16"
                              >
                                <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                                <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                                <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                              </svg>
                            </span>
                          ) : (
                            <span
                              className={styles.show_pass}
                              onClick={() => setIsConfirmPasswordVisible((prev) => true)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-eye"
                                viewBox="0 0 16 16"
                              >
                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                              </svg>
                            </span>
                          )}
                      </div>
                      {errors?.["confirm_password"] && (
                        <div className="invalid-feedback d-block">
                          {errors?.["confirm_password"].message}
                        </div>
                      )}
                    </div>
                    <div className={styles.form_group}>
                      <label className={styles.form_label}>Country</label>
                      <select
                        className={`form-select ${styles.form_control}`}
                        aria-label="Default select example"
                        name="country"
                        {...register("country", {
                          required: {
                            // value: true,
                            value: false,
                            message: "This field is required.",
                          },
                        })}
                      >
                        <option value="0">Select country</option>
                        {countries?.map((val) => {
                          return (
                            <option value={val.id} key={val.id}>
                              {val.name}
                            </option>
                          );
                        })}
                      </select>
                      {errors?.["country"] && (
                        <div className="invalid-feedback d-block">
                          {errors?.["country"].message}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.login_button}>
                    <button
                      type="button"
                      className={`${styles.btn_primary} w-100`}
                      onClick={handleSubmit(onSubmit)}
                    >
                      Submit
                    </button>
                  </div>
                  <div className={styles.SwitchBox_SignUp}>
                    <p className={styles.Account_text}>
                      Already have an account?{" "}
                      <Link href="/employer/login" className={styles.SignUp_select}>
                        Login
                      </Link>
                    </p>
                  </div>
                  <div className={styles.SwitchBox_SignUp}>
                  {errors?.["term_condition"] && (
                        <div className="invalid-feedback d-block">
                          {errors?.["term_condition"].message}
                        </div>
                      )}
                    <div className={styles.switchBox_policy}>
                      <span>
                        {" "}
                        <input 
                        type="checkbox" 
                        name="term_condition" 
                        className={styles.switch_checkInput}
                        {...register("term_condition", {
                          required: {
                            value: true,
                            message: "This field is required.",
                          },
                        })}
                         />{" "}
                      </span>
                      <p className={styles.Account_Switch}>
                        By clicking Create account, I agree that I have read and accepted
                        {" "}
                        <Link
                          href="/privacy-policy"
                          className={styles.SignUp_select}
                        >
                          Privacy Policy
                        </Link>
                        {" "}
                        and 
                        {" "}
                        <Link
                          href="/terms-conditions"
                          className={styles.SignUp_select}
                        >
                          Terms of Use
                        </Link>
                      </p>
                      
                    </div>
                    {/* {errors?.["term_use"] && (
                        <div className="invalid-feedback d-block">
                          {errors?.["term_use"].message}
                        </div>
                      )} */}
                    {/* <div className={styles.switchBox_policy}>
                      <span>
                        {" "}
                        <input 
                        type="checkbox"
                         name="term_use" 
                         className={styles.switch_checkInput}
                         {...register("term_use", {
                          required: {
                            value: true,
                            message: "This field is required.",
                          },
                        })}
                        />{" "}
                      </span>
                      <p className={styles.Account_Switch}>
                        By clicking Create account, I agree that I have read and accepted the
                        {" "}
                        <Link
                          href="/terms-conditions"
                          className={styles.SignUp_select}
                        >
                          Terms of Use
                        </Link>
                      </p>
                      
                    </div> */}
                  </div>

                  {/* test model */}
                  {/* <div
                    className="modal fade successfull_popup"
                    id="confirmModal"
                    tabindex="-1"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        <div className="modal-body">
                          <div className="modal_inner">
                            <div className="icon_block">
                              <img src="img/icon.png" alt="" />
                            </div>
                            <h3>
                              Email verification link is sent to your email ID
                            </h3>
                            {isRunning && <h2>{timer}</h2>}
                            {!isRunning && (
                              <button
                                type="submit"
                                onclick="location.href='login.html'"
                                className="btn-primary w-100"
                              >
                                Resend
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  {/* test model  */}
                  {/* 
                  <button
                    type="button"
                    // className="btn-primary w-100"
                    data-bs-toggle="modal"
                    data-bs-target="#confirmModal"
                    // style={{ display: "none" }}
                  >
                    Save
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Authentication>
  );
};

export async function getServerSideProps(context) {
  createAxiosCookies(context);
  const countries = await countriesData();
  return {
    props: {
      countries: countries,
      isProtected: false,
    },
  };
}

export default SignupStep;
