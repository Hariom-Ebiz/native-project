import React, { useEffect, useState } from "react";
import styles from "../styles/login_signup.module.css";
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

const SignupStepOne = () => {
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

  const router = useRouter();
  // const { timer, start, isRunning } = useTimer(10);
  const { request, response } = useRequest();
  var localData =
    localStorage.getItem("data") != undefined
      ? JSON.parse(localStorage.getItem("data"))
      : {};

  useEffect(() => {
    if (localData) {
      setValue("first_name", localData.first_name);
      setValue("last_name", localData.last_name);
      setValue("email", localData.email);
      setValue("password", localData.password);
      setValue("confirm_password", localData.confirm_password);
      localStorage.setItem("data", JSON.stringify({}));
    }
  }, []);
  const onSubmit = (data) => {
    const { first_name, last_name, email, password, confirm_password } = data;

    if (password !== confirm_password) {
      setError("confirm_password", {
        type: "manual",
        message: "Confirm password do not match.",
      });
      return;
    }
    localStorage.setItem("data", JSON.stringify(data));

    // request("POST", "user/job-seeker/signup", {
    //   first_name,
    //   last_name,
    //   email,
    //   password,
    // });

    request("POST", "user/email-verify", {
      email,
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
    if (response) {
      console.log(response);
      if (response?.status === true) {
        const { first_name, last_name, email, password } = watch();
        // return
        // router.push(
        //   {
        //     pathname: `/email-send?id=${response.id}&email=${response.email}`,
        //     query: { id: response.id, email: response.email },
        //   },
        //   "/email-send"
        // );
        // router.push(`/email-send?id=${response.id}&email=${response.email}`);

        router.push(
          {
            pathname: `/signup-step-2`,
            query: { first_name, last_name, email, password },
          },
          "/signup-step-2"
        );
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

  return (
    <Authentication>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <section className={styles.Login_wrapper}>
        <div className={styles.login_right_content}>
          <img src="img/find your destination with us.png" alt="" />
        </div>
        <div className={(styles.login_page_wrapper, styles.login_signup_pages)}>
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12"></div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className={styles.login_sign_up_block}>
                  <div className={styles.mobile_device}>
                    <Link href="/">
                      <img src="img/logo.svg" alt="logo" />
                    </Link>
                  </div>
                  <div className={styles.sign_type}>
                    <input
                      type="radio"
                      className={`${styles.btn_check} btn-check`}
                      name="options"
                      id="option1"
                      autoComplete="off"
                      defaultChecked
                    />
                    <label
                      className={`${styles.btn_secondary} ${styles.btn} btn`}
                      htmlFor="option1"
                    >
                      Career Seeker
                    </label>

                    <input
                      type="radio"
                      className={`${styles.btn_check} btn-check`}
                      name="options"
                      id="option2"
                      autoComplete="off"
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
                      Get more opportunities
                    </h1>
                  </div>
                  <div className={styles.Login_InputBox}>
                    <div className={styles.form_group}>
                      <label className={styles.form_label}>First Name</label>
                      <input
                        type="text"
                        className={styles.form_control}
                        placeholder="Enter your full name"
                        name="first_name"
                        {...register("first_name", {
                          required: {
                            value: true,
                            message: "This field is required.",
                          },
                          pattern: {
                            value: /^[a-zA-Z-]*$/,
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
                    <div className={styles.form_group}>
                      <label className={styles.form_label}>Family name</label>
                      <input
                        type="text"
                        className={styles.form_control}
                        placeholder="Enter your full name"
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
                    </div>
                    <div className={styles.form_group}>
                      <label className={styles.form_label}>Email Address</label>
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

                      {errors?.["confirm_password"] && (
                        <div className="invalid-feedback d-block">
                          {errors?.["confirm_password"].message}
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
                      Continue
                    </button>
                  </div>
                  <div className={styles.SwitchBox_SignUp}>
                    <p className={styles.Account_Switch}>
                      Already have an account?{" "}
                      <Link href="/login" className={styles.SignUp_select}>
                        Login
                      </Link>
                    </p>
                  </div>
                  <div className={styles.SwitchBox_SignUp}>
                    <p className={styles.Account_Switch}>
                      By clicking 'Continue', you acknowledge that you have read
                      and accept the{" "}
                      <Link
                        href="/terms-conditions"
                        className={styles.SignUp_select}
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy-policy"
                        className={styles.SignUp_select}
                      >
                        Privacy Policy.
                      </Link>
                    </p>
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
  return {
    props: {
      isProtected: false,
    },
  };
}

export default SignupStepOne;
