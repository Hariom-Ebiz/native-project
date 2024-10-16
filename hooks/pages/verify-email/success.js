import Footer from "@/components/Footer";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/login_signup.module.css";

const VerificationSuccess = ({ token }) => {
  const router = useRouter();
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
                        // router.push(`/signup-step-2?token=${token}`);
                        router.push(`/login`);
                      }}
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
    props: { isProtected: false, token },
  };
}
