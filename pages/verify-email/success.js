import Footer from "@/components/Footer";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/login_signup.module.css";
import useRequest from "@/hooks/useRequest";
import { login } from "@/store/authSlice";
import { useDispatch } from "react-redux";

const VerificationSuccess = ({ token }) => {
  const router = useRouter();
  const [buttonState, setButtonState] = useState(false);
  const { request, response } = useRequest();
  const dispatch = useDispatch();

  useEffect(() => {
    request("POST", "user/verify-token", { token: token });
  }, []);

  useEffect(() => {
    if (response) {
      if (response?.status) {
        // dispatch(
        //   login({
        //     token: response.token,
        //     userId: response?.user?.userId,
        //     email: response?.user?.email,
        //     firstName: response?.user?.firstName,
        //     lastName: response?.user?.lastName,
        //     role: response?.user?.role,
        //     profilePic: response?.user?.profile_picture,
        //     cvStep: response?.user?.cvStep || null,
        //   })
        // );
        setButtonState(true);
      }
    }
  }, []);

  return (
    <>
      <section className="verify_Email_wrapper">
        <div className="container">
          <div
            className={` ${styles.successfull_popup}`}
            style={{
              boxShadow: "0px 0px 10px 1px rgba(0,0,0,0.75)",
              maxWidth: "510px",
              margin: "100px auto",
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className={`${styles.modal_content} modal-content`}>
                <div className={`${styles.modal_body} modal-body`}>
                  <div className={styles.modal_inner}>
                    <div className={styles.icon_block}>
                      <img src="/img/icon.png" alt="" />
                    </div>
                    <h3>You have been successfully registered</h3>
                    <button
                      type="button"
                      onClick={() => {
                        // router.push(
                        //   buttonState ? "/job-seeker/dashboard" : "/login"
                        // );
                        router.push((localStorage.getItem("isEmployer") == "true") ? '/employer/login' : `/login`);
                      }}
                      className={`${styles.btn_primary} w-100`}
                    >
                      {/* {buttonState ? "Go To Dashboard" : "Go To Login"} */}
                      Go To Login
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default VerificationSuccess;

export async function getServerSideProps(context) {
  const {
    query: { token },
  } = context;
  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  return {
    props: { isProtected: null, token },
  };
}
