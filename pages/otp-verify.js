import { useRouter } from "next/router";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import useRequest from "@/hooks/useRequest";

const OtpVerify = ({ token, email }) => {
  const [otp, setOtp] = useState("");

  const router = useRouter();

  const { request, response } = useRequest();

  const { request: resendOtpRequest, response: resendOtpResponse } =
    useRequest();

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm();

  useEffect(() => {
    otpInput();
    document.body.classList.add("main_wrapper");

    return () => {
      document.body.classList.remove("main_wrapper");
    };
  }, []);

  const otpInput = () => {
    clearErrors("otp1");
    const inputs = document.querySelectorAll("#otp-field > *[id]");
    console.log("inputs", inputs);
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener("keydown", function (event) {
        if (event.key === "Backspace" || event.key === "Delete") {
          inputs[i].value = "";
          if (i !== 0) inputs[i - 1].focus();
        } else {
          if (
            (event.keyCode > 47 && event.keyCode < 58) ||
            (event.keyCode > 95 && event.keyCode < 106)
          ) {
            inputs[i].value = event.key;
            if (i !== inputs.length - 1) inputs[i + 1].focus();
            event.preventDefault();
          } else if (event.keyCode > 64 && event.keyCode < 91) {
            event.preventDefault();
          } else if (i === inputs.length - 1 && inputs[i].value !== "") {
            return true;
          }
        }
      });
    }
  };

  useEffect(() => {
    if (response) {
      router.push({
        pathname: "/reset-password",
        query: { token, otp },
      });
    }
  }, [response]);

  useEffect(() => {
    if (resendOtpResponse && resendOtpResponse.status) {
      reset({ otp1: null, otp2: null, otp3: null, otp4: null });
    }
  }, [resendOtpResponse]);

  const onSubmit = async (data) => {
    const { otp1, otp2, otp3, otp4 } = data;

    const otp = `${otp1}${otp2}${otp3}${otp4}`;

    setOtp(otp);
    request("POST", "user/reset-otp-verify", {
      token,
      otp,
    });
  };

  const resendOtpHandler = async () => {
    resendOtpRequest("POST", "user/resend-otp", {
      token,
    });
  };

  return (
    <div className="login_pages_block login_right_Box">
      <div className="container">
        <div className="d-flex flex-column flex-root">
          <section className="login_page_wrapper">
            <div className="row">
              <div className="col-md-6 col-sm-12 col-lg-6">
                <div className="login_sign_up_block">
                  <div className="login_InnerHeader">
                    <Link href="/employer">
                      <span className="logo-box-hide">
                        <img src="/assets/img/logo-icon.png" alt="logo-1" />
                        <span className="logo-titel">Notable Unique</span>
                      </span>
                    </Link>
                  </div>
                  <div className="formBlock">
                    <h1 className="Telant_login_title">
                      <a href="javascript:void(0);" className="arrow-back">
                        <i className="far fa-arrow-left" />
                      </a>
                      Enter the OTP
                    </h1>
                    <p className="login_text">
                      We’ve send you the verification code on
                      <b>{email} </b>
                    </p>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="loginform">
                        <div className="verification-code " id="otp-field">
                          <input
                            id="otp1"
                            type="text"
                            maxLength="1"
                            {...register("otp1", {
                              required: true,
                              maxLength: 1,
                            })}
                          />
                          <input
                            id="otp2"
                            type="text"
                            maxLength="1"
                            {...register("otp2", {
                              required: true,
                              maxLength: 1,
                            })}
                          />
                          <input
                            id="otp3"
                            type="text"
                            maxLength="1"
                            {...register("otp3", {
                              required: true,
                              maxLength: 1,
                            })}
                          />
                          <input
                            id="otp4"
                            type="text"
                            maxLength="1"
                            {...register("otp4", {
                              required: true,
                              maxLength: 1,
                            })}
                          />
                        </div>
                        <a
                          href="javascript:void(0);"
                          className="otp-link"
                          onClick={resendOtpHandler}
                        >
                          Resend OTP
                        </a>
                      </div>
                      <div className="Login_Telanat_Button">
                        <button type="submit" className="btn btn-primary w-100">
                          Send
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-sm-12 col-lg-6">
                <div className="login_right_content">
                  <img src="/assets/img/login-right-img.jpg" alt="" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  // createAxiosCookies(context);
  const {
    query: { token, email },
  } = context;
  if (!token || !email) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
  return {
    props: {
      protected: false,
      token,
      email,
    },
  };
}

export default OtpVerify;
