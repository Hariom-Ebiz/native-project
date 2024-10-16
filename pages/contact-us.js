import urlencode from "urlencode";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getContactUsData } from "@/services/cms";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useRequest from "@/hooks/useRequest";
import { emailPattern, isBusinessEmail } from "../utils/helper";
import { useRouter } from "next/router";
import { createAxiosCookies } from "@/fn";
import PublicLayout from "@/components/layout/PublicLayout";
import Link from "next/link";
import { PopupButton } from "react-calendly";

const ContactUs = ({ contactPageBlocks }) => {
  const { setting } = useSelector((store) => store.site);
  const { request, response } = useRequest();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm();

  const onSubmit = (data) => {
    if (!data.tnc_accepted) {
      setError("tnc_accepted", {
        type: "manual",
        message: "Please Accept Native Terms of Service and Privacy Policy.",
      });
      return;
    }
    request("POST", "contact/ ", data);
  };

  useEffect(() => {
    if (response && response.status) {
      toast.success(response?.message);
      reset({
        name: "",
        email: "",
        company_name: "",
        company_size: "",
        question: "",
      });
      document.getElementById("contactCloseModel").click();
      //  router.push("/");
    }
  }, [response]);

  // const navigateToTerm = () => {
  //   document.getElementById("contactCloseModel").click();
  //   router.push("/terms-conditions");
  // };

  // const navigateToPolicy = () => {
  //   document.getElementById("contactCloseModel").click();
  //   router.push("/privacy-policy");
  // };

  return (
    <PublicLayout>
      {/* <Header /> */}
      <section className="section-padding">
        <div className="container">
          <div className="page_heading_Box">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  contactPageBlocks?.["contactus-page"]?.description || "",
              }}
            />

            <PopupButton
              url="https://calendly.com/projectonqa-yez"
              rootElement={document.getElementById('__next')}
              text="Click here to schedule!"
              textColor="#ffffff"
              color="#00a2ff"
              className="btn btn-primary "
              marginTop="0"
            />
            {/* <button
              type="button"
              className="btn btn-primary "
             
            >
              Book A Free Info Call
            </button> */}
          </div>

          {/* <!-- Button trigger modal --> */}
          <div className="contact_block">
            <div className="contact_map_box">
              <iframe
                // src={setting?.google_map_iframe_src}
                src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Katamey%20Plaza%20Mall,%20SODIC,%20North%2090%20Street,%20New%20Cairo+(My%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                // frameborder="0"
                style={{ border: "0" }}
              ></iframe>
            </div>
            <div className="contact_category_box">
              <div className="row g-4">
                <div className="col-lg-4 col-md-4">
                  <div className="contact_card_box">
                    <span className="contact_card_icon">
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 26 26"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.417 22.2087H7.58366C4.33366 22.2087 2.16699 20.5837 2.16699 16.792V9.20866C2.16699 5.41699 4.33366 3.79199 7.58366 3.79199H18.417C21.667 3.79199 23.8337 5.41699 23.8337 9.20866V16.792C23.8337 20.5837 21.667 22.2087 18.417 22.2087Z"
                          stroke="#2A3858"
                          strokeWidth="2"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M18.4163 9.75L15.0255 12.4583C13.9097 13.3467 12.0788 13.3467 10.963 12.4583L7.58301 9.75"
                          stroke="#2A3858"
                          strokeWidth="2"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <h4 className="contact_category_name">Email Us</h4>
                    <p className="contact_category_desc">
                      Ask us a question by email and we will respond within few
                      days.
                    </p>
                    <div className="contact_number_box">
                      {setting?.email}{" "}
                      <button
                        onClick={() => {
                          // console.log(window.navigator.clipboard)
                          window.navigator?.clipboard?.writeText(
                            setting?.email || ""
                          );
                        }}
                        type="button"
                      >
                        <svg
                          width="16"
                          height="15"
                          viewBox="0 0 16 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.1531 2.62305H3.17989C2.52558 2.62305 1.99414 3.15448 1.99414 3.80879V13.8139C1.99414 14.4682 2.52558 14.9997 3.17989 14.9997H10.1531C10.8074 14.9997 11.3388 14.4682 11.3388 13.8139V3.80879C11.3357 3.15448 10.8043 2.62305 10.1531 2.62305ZM10.5063 13.8108C10.5063 14.0074 10.3466 14.1672 10.15 14.1672H3.17682C2.98021 14.1672 2.82048 14.0074 2.82048 13.8108V3.80879C2.82048 3.61219 2.98021 3.45246 3.17682 3.45246H10.15C10.3466 3.45246 10.5063 3.61219 10.5063 3.80879V13.8108Z"
                            fill="black"
                          />
                          <path
                            d="M12.8191 0H5.8459C5.19159 0 4.66016 0.531436 4.66016 1.18575C4.66016 1.41614 4.84447 1.60045 5.07486 1.60045C5.30525 1.60045 5.48956 1.41614 5.48956 1.18575C5.48956 0.989146 5.6493 0.829408 5.8459 0.829408H12.8191C13.0157 0.829408 13.1754 0.989146 13.1754 1.18575V11.1909C13.1754 11.3875 13.0157 11.5472 12.8191 11.5472C12.5887 11.5472 12.4044 11.7315 12.4044 11.9619C12.4044 12.1923 12.5887 12.3766 12.8191 12.3766C13.4734 12.3766 14.0048 11.8452 14.0048 11.1909V1.18575C14.0048 0.531436 13.4734 0 12.8191 0Z"
                            fill="black"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4">
                  <div className="contact_card_box">
                    <span className="contact_card_icon">
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 26 26"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.0001 14.5491C14.8668 14.5491 16.3801 13.0358 16.3801 11.1691C16.3801 9.30234 14.8668 7.78906 13.0001 7.78906C11.1334 7.78906 9.62012 9.30234 9.62012 11.1691C9.62012 13.0358 11.1334 14.5491 13.0001 14.5491Z"
                          stroke="#2A3858"
                          strokeWidth="2"
                        />
                        <path
                          d="M3.92119 9.19783C6.05536 -0.183839 19.9545 -0.173005 22.0779 9.20866C23.3237 14.712 19.9004 19.3703 16.8995 22.252C14.722 24.3537 11.277 24.3537 9.08869 22.252C6.09869 19.3703 2.67536 14.7012 3.92119 9.19783Z"
                          stroke="#2A3858"
                          strokeWidth="2"
                        />
                      </svg>
                    </span>
                    <h4 className="contact_category_name">Official Office</h4>
                    <p className="contact_category_desc">
                      {/* You can meet us at our office and discuss the details of
                      your question. */}
                      Discover the heart of our operations at our official
                      office
                    </p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${urlencode(
                        setting?.address
                      )}`}
                      target="__blank"
                      className="contact_number_box"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4">
                  <div className="contact_card_box">
                    <span className="contact_card_icon">
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 26 26"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19.5 20.4319H18.6767C17.81 20.4319 16.9867 20.7677 16.38 21.3744L14.5275 23.2053C13.6825 24.0394 12.3067 24.0394 11.4617 23.2053L9.60916 21.3744C9.00249 20.7677 8.16833 20.4319 7.3125 20.4319H6.5C4.70167 20.4319 3.25 18.9911 3.25 17.2144V5.3952C3.25 3.61854 4.70167 2.17773 6.5 2.17773H19.5C21.2983 2.17773 22.75 3.61854 22.75 5.3952V17.2144C22.75 18.9802 21.2983 20.4319 19.5 20.4319Z"
                          stroke="#2A3858"
                          strokeWidth="2"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.58301 9.9227C7.58301 8.9152 8.40634 8.0918 9.41384 8.0918C10.4213 8.0918 11.2447 8.9152 11.2447 9.9227C11.2447 11.9594 8.35217 12.176 7.713 14.1152C7.583 14.516 7.91884 14.9169 8.34134 14.9169H11.2447"
                          stroke="#2A3858"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17.3759 14.9063V8.72049C17.3759 8.43882 17.1918 8.18959 16.9209 8.11376C16.6501 8.03793 16.3576 8.14626 16.2059 8.38459C15.4259 9.64126 14.5809 11.0713 13.8443 12.3279C13.7251 12.5338 13.7251 12.8046 13.8443 13.0104C13.9634 13.2163 14.1909 13.3462 14.4401 13.3462H18.4159"
                          stroke="#2A3858"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <h4 className="contact_category_name">Customer Support</h4>
                    <p className="contact_category_desc">
                      Drop us a message, and we’ll get back to you shortly.
                    </p>
                    <div className="contact_number_box" data-bs-toggle="modal"
                      data-bs-target="#exampleModal">
                      <a href="#">Leave a Message</a>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Modal --> */}
          <div className="contact_popup_box">
            <div
              className="modal fade"
              id="exampleModal"
              tabIndex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Contact Us</h5>
                    <p className="modal-desc">
                      {/* Built for every team across your company, Jobify
                      Enterprise boosts productivity with upgraded security and
                      account support. Contact us today to unlock: */}
                    </p>
                  </div>
                  <div className="modal-body">
                    <div className="contact_form_box">
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="form-group">
                            <label className="form-label">Name*</label>
                            <input
                              type="text"
                              className="form-control"
                              name="name"
                              placeholder="Enter your name"
                              {...register("name", {
                                required: {
                                  value: true,
                                  message: "This field is required.",
                                },
                                pattern: {
                                  value: /^[a-zA-Z ]*$/,
                                  message: "Please enter only letters",
                                },
                              })}
                            />
                            {errors?.["name"] && (
                              <div className="invalid-feedback d-block">
                                {errors?.["name"].message}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group">
                            <label className="form-label">Company Email*</label>
                            <input
                              type="email"
                              className="form-control"
                              name="email"
                              placeholder="Enter your company email"
                              {...register("email", {
                                required: {
                                  value: true,
                                  message: "This field is required.",
                                },
                                pattern: {
                                  value: emailPattern,
                                  message: "Please provide a valid email Id.",
                                },
                                validate: {
                                  shouldBusinessEmail: value => isBusinessEmail(value) || "Please enter valid business email address."
                                }
                              })}
                            />
                            {errors?.["email"] && (
                              <div className="invalid-feedback d-block">
                                {errors?.["email"].message}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group">
                            <label className="form-label">Company Name*</label>
                            <input
                              type="text"
                              className="form-control"
                              name="company_name"
                              placeholder="Enter your company name"
                              {...register("company_name", {
                                required: {
                                  value: true,
                                  message: "This field is required.",
                                },
                                pattern: {
                                  value: /^[a-zA-Z ]*$/,
                                  message: "Please enter only letters",
                                },
                              })}
                            />
                            {errors?.["company_name"] && (
                              <div className="invalid-feedback d-block">
                                {errors?.["company_name"].message}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group">
                            <label className="form-label">Company Size</label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Enter your company size"
                              name="company_size"
                              {...register("company_size", {
                                required: {
                                  value: false,
                                  message: "This field is required.",
                                },
                                // pattern: {
                                //   value: /^[0-9]*$/,
                                //   message: "Please enter only numbers",
                                // },
                              })}
                            />
                            {errors?.["company_size"] && (
                              <div className="invalid-feedback d-block">
                                {errors?.["company_size"].message}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="form-group">
                            <label className="form-label">
                              Write Question*
                            </label>
                            <textarea
                              className="form-control"
                              cols="30"
                              rows="10"
                              name="question"
                              placeholder="Type anything"
                              {...register("question", {
                                required: true,
                              })}
                            />
                            {errors?.question &&
                              errors?.question?.type == "required" && (
                                <div className="invalid-feedback d-block">
                                  This field is required.
                                </div>
                              )}

                            {/* {errors?.question &&
                              errors?.question?.type == "manual" && (
                                <div className="invalid-feedback d-block">
                                  The field question must include max 500
                                  characters.
                                </div>
                              )} */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <div className="form-group custom_checkbox d-flex m-0">
                      <input
                        type="checkbox"
                        name="tnc_accepted"
                        id="check1"
                        {...register("tnc_accepted", {
                          required: true,
                        })}
                      />
                      <label htmlFor="check1">
                        I agree to Native
                        {/* <Link
                          href="https://nativessr.stage04.obdemo.com/terms-conditions"
                          target="__blank"
                        > */}{" "}
                        Terms of Service {/* </Link> */}
                        and{" "}
                        {/* <Link
                          href="https://nativessr.stage04.obdemo.com/privacy-policy"
                          target="__blank"
                        > */}{" "}
                        Privacy Policy.*
                        {/* </Link> */}
                      </label>
                    </div>
                    {errors?.tnc_accepted &&
                      errors?.tnc_accepted.type == "required" && (
                        <div
                          className="invalid-feedback d-block"
                          style={{ width: "50%" }}
                        >
                          Please Accept Native Terms of Service and Privacy
                          Policy.
                        </div>
                      )}
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSubmit(onSubmit)}
                    >
                      Contact Us
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                      id="contactCloseModel"
                      style={{ display: "none" }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <Footer /> */}
    </PublicLayout>
  );
};

export async function getServerSideProps(context) {
  createAxiosCookies(context);
  let data = await getContactUsData();
  return {
    props: {
      ...data,
      isProtected: null,
    },
  };
}

export default ContactUs;
