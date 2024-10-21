import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "../styles/login_signup.module.css";
import useRequest from "@/hooks/useRequest";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Link from "next/link";
import Authentication from "@/components/layout/authentication";

const ResetPaswword = ({ token }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    setValue,
  } = useForm();

  const { request, response } = useRequest();

  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, []);
  let bool = JSON.parse(localStorage.getItem("isEmployer"));
  const onSubmit = (data) => {
    const { newPassword, newConfirmPassword } = data;
    if (newPassword !== newConfirmPassword) {
      setError("newConfirmPassword", {
        type: "manual",
        message: "Confirm password doesn't match with New Password .",
      });
      return;
    }
    let user_role_id = 1;

    if (bool) {
      user_role_id = 2;
    }
    request("POST", "user/job-seeker/reset-password", { newPassword, token, user_role_id });
  };

  useEffect(() => {
    if (response) {
      if (response.status) {
        toast.success(response.message);
        if (bool) {

          router.push("/employer/login");
        } else {
          router.push("/login");
        }
      }
    }
  }, [response]);

  return (
    <Authentication>
      <section className={styles.Login_wrapper}>
        <div className={styles.login_right_content}>
          <img src="img/login_img.png" alt="" />
        </div>
        <div className={(styles.login_page_wrapper, styles.login_signup_pages)}>
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12"></div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className={styles.login_sign_up_block}>
                  <div className={styles.loginTitleBox}>
                    <h1 className={`${styles.login_title} text-start`}>
                      <Link
                        href="forgot-password"
                        className={styles.history_back}
                      >
                        <i className="far fa-arrow-left"></i>
                      </Link>{" "}
                      Reset Password
                    </h1>
                  </div>

                  <div className={styles.short_desc}>
                    Some text will be here
                  </div>

                  <div className={styles.Login_InputBox}>
                    <div className={styles.form_group}>
                      <label className={styles.form_label}>New Password</label>
                      <input
                        type="password"
                        className={styles.form_control}
                        placeholder="Enter password"
                        name="newPassword"
                        {...register("newPassword", {
                          required: {
                            value: true,
                            message: "This field is required.",
                          },
                          pattern: {
                            value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
                            message:
                              "Password must be of 8 characters long with atleast one Uppercase, one Lowercase and one Number",
                          },
                        })}
                      />
                      {errors?.["newPassword"] && (
                        <div className="invalid-feedback d-block">
                          {errors?.["newPassword"].message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="Login_InputBox">
                    <div className={styles.form_group}>
                      <label className={styles.form_label}>
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        className={styles.form_control}
                        placeholder="Enter password"
                        name="newConfirmPassword"
                        {...register("newConfirmPassword", {
                          required: {
                            value: true,
                            message: "This field is required.",
                          },
                        })}
                      />
                      {errors?.["newConfirmPassword"] && (
                        <div className="invalid-feedback d-block">
                          {errors?.["newConfirmPassword"].message}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="login_button">
                    <button
                      type="button"
                      className={`${styles.btn_primary} w-100`}
                      // data-bs-toggle="modal"
                      // data-bs-toggle={`${show}`}
                      // data-bs-target="#confirmModal"
                      onClick={handleSubmit(onSubmit)}
                    >
                      Save
                    </button>
                  </div>

                  {/* <!-- Modal --> */}

                  <div
                    className={`modal fade ${styles.successfull_popup}`}
                    id="confirmModal"
                    tabIndex="-1"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered">
                      <div className={`${styles.modal_content} modal-content`}>
                        <div className={`${styles.modal_body} modal-body`}>
                          <div className={styles.modal_inner}>
                            <div className={styles.icon_block}>
                              <img src="img/icon.png" alt="" />
                            </div>
                            <h3>Password has been successfully changed</h3>
                            <button
                              type="button"
                              //onClick={routeGoToLogin}
                              className={`${styles.btn_primary} w-100`}
                            >
                              Go To Login
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
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
  const {query: { token }} = context;

  return {
    props: {
      token: token ? token : null,
      isProtected: false,
    },
  };
}

export default ResetPaswword;
