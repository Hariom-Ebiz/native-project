import useRequest from "@/hooks/useRequest";
import Link from "next/link";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import styles from "../styles/login_signup.module.css";
import { toast } from "react-toastify";
import Authentication from "@/components/layout/authentication";
import { createAxiosCookies } from "@/fn";
import { useDispatch } from "react-redux";
import { setModal } from "@/store/siteSlice";
import Head from 'next/head'

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
    setError,
    clearErrors,
    setValue,
  } = useForm();

  const { response, request } = useRequest();

  const onSubmit = (data) => {
    const { email } = data;
    request("POST", "user/job-seeker/forgot-password", { email, user_role_id: 2 });

  };

  useEffect(() => {
    if (response) {
      if (response.status) {
        resetField("email");
        // toast.success(
        //   "Reset password link has been sent to your email address successfully."
        // );
        dispatch(
          setModal(
            <>
              <div className="modal_inner">
                <div className="icon_block">
                  <img src="/img/icon.png" alt="" />
                </div>
                <h3>
                  Reset password link has been sent to your email address
                  successfully.
                </h3>
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
                      <Link href="/login" className={styles.history_back}>
                        <i className="far fa-arrow-left"></i>
                      </Link>{" "}
                      Forgot Password
                    </h1>
                  </div>

                  <div className={styles.short_desc}>
                    Enter your email we send you code
                  </div>

                  <div className={styles.Login_InputBox}>
                    <div className={styles.form_group}>
                      <label className={styles.form_label}>Email Address</label>
                      <input
                        type="email"
                        className={styles.form_control}
                        placeholder="Enter email address"
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
                  </div>

                  <div className={styles.login_button}>
                    <button
                      type="submit"
                      className={`${styles.btn_primary} w-100`}
                      onClick={handleSubmit(onSubmit)}
                    >
                      Send
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

export async function getServerSideProps(context) {
  createAxiosCookies(context);
  return {
    props: {
      isProtected: false,
    },
  };
}

export default ForgotPassword;
