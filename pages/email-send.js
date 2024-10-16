import React, { useEffect, useState } from "react";
// import { axiosInstance, BASEURL } from "../../api";
import { toast } from "react-toastify";
import useRequest from "@/hooks/useRequest";
import useTimer from "@/hooks/useTimer";
import { axiosInstance } from "@/api";
import styles from "../styles/login_signup.module.css";


const EmailSend = ({ email, id }) => {
  const { timer, start, isRunning } = useTimer(10);
  const { request: resendReq, response: resendRes } = useRequest();

  const resendEmail = () => {
    resendReq("POST", "user/resend-token", { id });
  };

  useEffect(() => {
    if (resendRes) {
      if (resendRes?.status === true) {
        toast.success("Email resend successfully.");
        start();
      } else {
        toast.error("Couldn't resend the email.");
      }
    }
  }, [resendRes]);

  useEffect(() => {
    start();
  }, []);
  return (
    <>
      <section className="verify_Email_wrapper">
        <div className="container">
          {/* <div className="verify_Email_block">
            <div className="Email_content_box">
              <h1 className="Email_box_title">Verify Your Email</h1>
              <div className="sent_Email_box">
                <img src="../img/verify-email-img1.png" alt="" />
                <span className="EmailDisTitle">
                  An email has been sent to {email}, please click the link in
                  the email to continue
                </span>
                <div className="chengeEmailBox">
                  {isRunning && <h2>{timer}</h2>}
                  {!isRunning && (
                    <a style={{ cursor: "pointer" }} className={`${styles.btn_primary}`} onClick={resendEmail}>
                      Resend Email
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div> */}
          <div
                className={` ${styles.successfull_popup}`}
            style={{
              boxShadow: "0px 0px 10px 1px rgba(0,0,0,0.75)",
              maxWidth: "510px",
              margin: "100px auto",
            }}
          >
            <div className="">
              <div lassName={`${styles.modal_content} modal-content`}>
                <div className={`${styles.modal_body} modal-body`}>
                  <div className={styles.modal_inner}>
                    <div className={styles.icon_block}>
                      <img src="img/icon.png" alt="" />
                    </div>
                    
                    <h3>Email verification link is sent to {email}</h3>
                    {isRunning && <h2>{timer}</h2>}
                    {!isRunning && (
                      <a
                        href="#"
                        onClick={() => resendEmail()}
                        style={{ cursor: "pointer" }}
                        className={`${styles.btn_primary} w-100`}
                      >
                        Resend
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EmailSend;

export async function getServerSideProps(context) {
  const {
    query: { id, email },
  } = context;

  if (!id || !email) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
  const res = await axiosInstance.post("user/ckeck-token-exists", { id: id });
  if (!res?.data?.status) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
        isProtected : null,
      },
    };
  }

  return {
    props: { email, id, protected: false },
  };
}
