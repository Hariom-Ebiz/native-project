import React, { useState, useEffect } from "react";
import { destroyCookie, setCookie } from "nookies";
import Link from "next/link";
import { useForm } from "react-hook-form";
import useRequest from "@/hooks/useRequest";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

import styles from "../styles/login_signup.module.css";
import { login } from "@/store/authSlice";
import Authentication from "@/components/layout/authentication";
import { createAxiosCookies, getCookies } from "@/fn";
import Head from 'next/head'

const Login = ({ email, password }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      email,
      password,
    },
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [isRememberMe, setIsRememberMe] = useState(!!email);

  const { request, response } = useRequest();

  const dispatch = useDispatch();
  const router = useRouter();

  const onSubmit = (data) => {
    const { email, password } = data;

    request("POST", "user/job-seeker/login", {
      email,
      password,
    });
  };

  useEffect(() => {
    if (response) {
      if (response.status) {
        if (!response.isEmailVerified) {
          router.push(
            {
              pathname: "/email-send",
              query: { id: response.id, email: response.email },
            },
            "/email-send"
          );
        } else if (response.stepTwoRemaining) {
          router.push(`/signup-step-2?token=${response.token}`);
        } else {
          // toast.success(response.message);

          if (isRememberMe) {
            const [email, password] = watch(["email", "password"]);

            setCookie(null, "email", email, {
              maxAge: 30 * 24 * 60 * 60 * 100,
              path: "/",
            });

            setCookie(null, "password", password, {
              maxAge: 30 * 24 * 60 * 60 * 100,
              path: "/",
            });
          } else {
            destroyCookie(null, "email");
            destroyCookie(null, "password");
          }

          dispatch(
            login({
              token: response.token,
              userId: response?.user?.userId,
              email: response?.user?.email,
              firstName: response?.user?.firstName,
              lastName: response?.user?.lastName,
              role: response?.user?.role,
              profilePic: response?.user?.profile_picture,
              cvStep: response?.user?.cvStep || null,
              was_subscriber: response?.was_subscriber || null,
              is_subscriber: response?.is_subscriber || null,
              subscription: response?.subscription
            })
          );

          return () => {
            // router.push("/job-seeker/dashboard");
            // dispatch(
            //   login({
            //     token: response.token,
            //     userId: response?.user?.userId,
            //     email: response?.user?.email,
            //     firstName: response?.user?.firstName,
            //     lastName: response?.user?.lastName,
            //     role: response?.user?.role,
            //     profilePic: response?.user?.profile_picture,
            //   })
            // );
          };
        }
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
          <img src="/img/login_img.png" alt="" />
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
                    <h1 className={styles.login_title}>Login</h1>
                  </div>
                  <div className={styles.Login_InputBox}>
                    <div className="form-group">
                      <label className={styles.form_label}>Email Address</label>
                      <input
                        type="email"
                        className={styles.form_control}
                        placeholder="Enter email address"
                        email="email"
                        {...register("email", {
                          required: {
                            value: true,
                            message: "This field is required.",
                          },
                        })}
                      />
                      {errors?.["email"] && (
                        <div className="invalid-feedback d-block">
                          {errors?.["email"].message}
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label className={styles.form_label}>Password</label>
                      <div className="position-relative">
                        <input
                          type={isPasswordVisible ? "text" : "password"}
                          className={styles.form_control}
                          placeholder="Enter password"
                          name="password"
                          {...register("password", {
                            required: {
                              value: true,
                              message: "This field is required.",
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

                      {errors?.["password"] && (
                        <div className="invalid-feedback d-block">
                          {errors?.["password"].message}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Remember Me{" "} */}
                  <span>
                    {" "}
                    <input
                      type="checkbox"
                      checked={isRememberMe}
                      onChange={(e) => setIsRememberMe(e.target.checked)}
                    />{" "}
                  </span>
                  Remember Me
                  <div className={styles.forget_passwordBox}>
                    <Link
                      href="/forgot-password"
                      className={styles.forget_pass}
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className={styles.login_button}>
                    <button
                      type="button"
                      className={`${styles.btn_primary} w-100`}
                      onClick={handleSubmit(onSubmit)}
                    >
                      Login
                    </button>
                  </div>
                  <div className={styles.SwitchBox_SignUp}>
                    <p className={styles.Account_Switch}>
                      Don’t have an account?{" "}
                      <Link
                        href="/signup-step-1"
                        className={styles.SignUp_select}
                      >
                        Sign up
                      </Link>
                    </p>
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

export async function getServerSideProps(context) {
  createAxiosCookies(context);

  const cookies = getCookies(context);

  let email = cookies.email ?? null;
  let password = null;

  if (email) {
    password = cookies.password ?? null;
  }

  if (email && !password) {
    email = null;
  }

  return {
    props: {
      isProtected: false,
      email,
      password,
    },
  };
}

export default Login;
