import React, { useEffect, useRef, useState } from "react";
import { createAxiosCookies, getCookies } from "@/fn";
import styles from "../../styles/help_center.module.css";
import Dropdown from 'react-bootstrap/Dropdown';
import { faqPageData, getFaqByCategory, likeOrDislike, searchQuestion } from "@/services/faq";
import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import Link from "next/link";
import useRequest from "@/hooks/useRequest";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { emailPattern } from "@/utils/helper";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const HelpCenter = ({ faqs, faqCategory,lang_id }) => {
  const { t } = useTranslation('common');
  const [show, setShow] = useState(false);
  const [FAQs, setFaqs] = useState(faqs);
  const [DuplicateFAQs, setDuplicateFaqs] = useState(faqs);
  const [FaqCategories, setFaqsCategories] = useState(faqCategory);

  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);
  const { request, response } = useRequest();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

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
      setShowModal(false);
      //  router.push("/");
    }
  }, [response]);

  const getByCategory = async (category_id) => {
    
    try {
      const getFaqs = await getFaqByCategory(category_id, 1, lang_id);
      setFaqs(getFaqs.faqs)
    } catch (error) {
      alert(error)
    }
  }

  const searchQues = async (e) => {
    try {

      if (e.target.value) {
        if (e.target.value.length > 2) {
          const getVal = await searchQuestion(e.target.value, 1, lang_id);
          setFaqs(getVal.faqs)
        } else if (e.target.value.length < 3) {
          setFaqs(DuplicateFAQs)
        }
      }
    } catch (error) {
      alert(error)
    }
  }

  const questionLikesDislikes = async (id, like, dislike) => {
    try {
      setShow(true)
      const res = await likeOrDislike(id, like, dislike);
      setFaqs((prev) => {
        return prev.map((faq) => {
          if (faq.id === res.faqId) {
            if (like) {
              return { ...faq, likes: faq.likes + 1 };
            } else {
              return { ...faq, dislikes: faq.dislikes + 1 };
            }
          }
          return faq;
        });
      })
      setTimeout(() => { setDuplicateFaqs(FAQs) }, 500)
      setShow(false)
    } catch (error) {
      setShow(false)
      alert(error)
    }
  }

  return (
    <>
      <JobSeekerAuth data={{ title: "Help Center" }} />
      <div className="page_container">
        <div className="main_content" id="body_lang_css">
          <div className="page-title-track">
            <h2 className={styles.page_title}>{t("Help Center")}</h2>

            <div className="row">
              <div className="col-lg-5 col-xl-4 col-md-5">
                <div className={styles.left_box}>

                  <div className={styles.left_content_box}>
                    <span className={styles.question_lebal}>{t("Type your question or search keyword")}</span>
                    <div className={styles.search_box}>
                      <input className={styles.form_control} onChange={(e) => searchQues(e)} placeholder="Search" />
                      <span className={styles.input_icon}>
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="10.7664" cy="10.7659" r="8.98856" stroke="#515B6F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M17.0181 17.4844L20.5421 20.9992" stroke="#515B6F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </span>
                    </div>


                    <div className={styles.question_categories}>
                      <h3 className={styles.question_categories_title}>{t("Subscribed")}</h3>


                      <ul className={styles.all_pages}>
                        {
                          FaqCategories.map(m => (
                            <li className={styles.page_items}>
                              <span className={styles.list_pages_link} style={{ "cursor": "pointer" }} onClick={() => getByCategory(m.category_id)} >{m.category}</span>
                            </li>
                          ))
                        }

                        {/* <li className={styles.page_items}><a className={styles.list_pages_link} href="#!">Applying for a job</a></li>
                            <li className={styles.page_items}><a className={styles.list_pages_link} href="#!">Job Search Tips</a></li>
                            <li className={styles.page_items}><a className={styles.list_pages_link} href="#!">Job Alerts</a></li> */}
                      </ul>
                    </div>
                  </div>

                  <div className={styles.bottom_box}>
                    <h3 className={styles.box_title}>{t("Didn't find what you were looking for?")}</h3>
                    <p className={styles.description}>{t("Contact our customer service")} </p>
                    <button className={styles.contact_btn} onClick={() => setShowModal(true)} >{t("Contact Us")}</button>
                    {/* <figure className={styles.vactor_img}>
                      <img src="/img/vector.png" alt="vector" />
                    </figure> */}
                  </div>

                </div>
              </div>
              <div className="col-lg-7 col-xl-8 col-md-7">
                {
                  FAQs.map((f) => (
                    <div className={styles.right_box}>
                      <div className={styles.question_main_box}>
                        <div className={styles.question_head}>
                          <h3 className={styles.question_text}>{f.question}</h3>
                          {/* <Dropdown>
                            <Dropdown.Toggle id="dropdown-basic" className={styles.dropBtn}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_939_27520)">
                                  <path d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z" stroke="#25324B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                  <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="#25324B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                  <path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z" stroke="#25324B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </g>
                                <defs>
                                  <clipPath id="clip0_939_27520">
                                    <rect width="24" height="24" fill="white" />
                                  </clipPath>
                                </defs>
                              </svg>

                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                              <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                              <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown> */}
                        </div>
                        <p className={styles.question_ans}>{f.answer}</p>
                      </div>

                      <div className={styles.like_box}>
                        <p className={styles.article_helpful}>{t("Was this article helpful?")}</p>
                        <span className={styles.Like_desLink} style={{ "cursor": "pointer" }} onClick={(e) => questionLikesDislikes(f.id, true, "")}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.66667 6.33268V11.666C3.66667 11.8428 3.59643 12.0124 3.4714 12.1374C3.34638 12.2624 3.17681 12.3327 3 12.3327H1.66667C1.48986 12.3327 1.32029 12.2624 1.19526 12.1374C1.07024 12.0124 1 11.8428 1 11.666V6.99935C1 6.82254 1.07024 6.65297 1.19526 6.52794C1.32029 6.40292 1.48986 6.33268 1.66667 6.33268H3.66667ZM3.66667 6.33268C4.37391 6.33268 5.05219 6.05173 5.55228 5.55163C6.05238 5.05154 6.33333 4.37326 6.33333 3.66602V2.99935C6.33333 2.64573 6.47381 2.30659 6.72386 2.05654C6.97391 1.80649 7.31304 1.66602 7.66667 1.66602C8.02029 1.66602 8.35943 1.80649 8.60948 2.05654C8.85952 2.30659 9 2.64573 9 2.99935V6.33268H11C11.3536 6.33268 11.6928 6.47316 11.9428 6.72321C12.1929 6.97326 12.3333 7.31239 12.3333 7.66602L11.6667 10.9993C11.5708 11.4083 11.3889 11.7595 11.1484 12C10.908 12.2405 10.6219 12.3572 10.3333 12.3327H5.66667C5.13623 12.3327 4.62753 12.122 4.25245 11.7469C3.87738 11.3718 3.66667 10.8631 3.66667 10.3327" stroke="#2A3858" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                          yes {f.likes ? `(${f.likes})` : ""}
                        </span>
                        <span className={styles.Like_desLink} style={{ "cursor": "pointer" }} onClick={(e) => questionLikesDislikes(f.id, "", true)}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_939_23193)">
                              <path d="M4.66667 8.66727V3.33394C4.66667 3.15713 4.59643 2.98756 4.4714 2.86253C4.34638 2.73751 4.17681 2.66727 4 2.66727H2.66667C2.48986 2.66727 2.32029 2.73751 2.19526 2.86253C2.07024 2.98756 2 3.15713 2 3.33394V8.00061C2 8.17742 2.07024 8.34699 2.19526 8.47201C2.32029 8.59703 2.48986 8.66727 2.66667 8.66727H4.66667ZM4.66667 8.66727C5.37391 8.66727 6.05219 8.94822 6.55228 9.44832C7.05238 9.94842 7.33333 10.6267 7.33333 11.3339V12.0006C7.33333 12.3542 7.47381 12.6934 7.72386 12.9434C7.97391 13.1935 8.31304 13.3339 8.66667 13.3339C9.02029 13.3339 9.35943 13.1935 9.60948 12.9434C9.85952 12.6934 10 12.3542 10 12.0006V8.66727H12C12.3536 8.66727 12.6928 8.5268 12.9428 8.27675C13.1929 8.0267 13.3333 7.68756 13.3333 7.33394L12.6667 4.00061C12.5708 3.59162 12.3889 3.24044 12.1484 2.99996C11.908 2.75948 11.6219 2.64272 11.3333 2.66727H6.66667C6.13623 2.66727 5.62753 2.87799 5.25245 3.25306C4.87738 3.62813 4.66667 4.13684 4.66667 4.66727" stroke="#2A3858" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                            <defs>
                              <clipPath id="clip0_939_23193">
                                <rect width="16" height="16" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>

                          no {f.dislikes ? `(${f.dislikes})` : ""}
                        </span>

                      </div>
                    </div>
                  ))
                }

              </div>


              <div className="contact_popup_box">
                <div
                  className={`modal fade ${showModal ? "show" : ""}`}
                  id="exampleModal"
                  tabIndex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                  style={{ "display": (showModal) ? "block" : "none" }}
                >
                  <div className="modal-dialog modal-dialog-centered modal-lg" >
                    <div className="modal-content" ref={modalRef}>
                      <div className="modal-header">
                        <h5 className="modal-title">{t("Contact Us")}</h5>
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
                                <label className="form-label">{t("Name")}*</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="name"
                                  placeholder={t("Enter your name")}
                                  {...register("name", {
                                    required: {
                                      value: true,
                                      message: t("This field is required."),
                                    },
                                    pattern: {
                                      value: /^[a-zA-Z ]*$/,
                                      message: t("Please enter only letters"),
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
                                <label className="form-label">{t("Email")}*</label>
                                <input
                                  type="email"
                                  className="form-control"
                                  name="email"
                                  placeholder={t("Enter your email")}
                                  {...register("email", {
                                    required: {
                                      value: true,
                                      message: t("This field is required."),
                                    },
                                    pattern: {
                                      value: emailPattern,
                                      message: t("Please provide a valid email Id."),
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
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label className="form-label">{t("Company Name")}</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="company_name"
                                  placeholder={t("Enter your company name")}
                                  {...register("company_name", {
                                    required: {
                                      value: false,
                                      message: t("This field is required."),
                                    },
                                    pattern: {
                                      value: /^[a-zA-Z ]*$/,
                                      message: t("Please enter only letters"),
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
                                <label className="form-label">{t("Company Size")}</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder={t("Enter your company size")}
                                  name="company_size"
                                  {...register("company_size", {
                                    required: {
                                      value: false,
                                      message: t("This field is required."),
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
                                  {t("Write Question")}*
                                </label>
                                <textarea
                                  className="form-control"
                                  cols="30"
                                  rows="10"
                                  name="question"
                                  placeholder={t("Type anything")}
                                  {...register("question", {
                                    required: true,
                                  })}
                                />
                                {errors?.question &&
                                  errors?.question?.type == "required" && (
                                    <div className="invalid-feedback d-block">
                                      {t("This field is required.")}
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
                            {t("I agree to Native")}
                            {/* <Link
                            href="https://nativessr.stage04.obdemo.com/terms-conditions"
                            target="__blank"
                          > */}{" "}
                            {t("Terms of Service and")}
                            {/* <Link
                            href="https://nativessr.stage04.obdemo.com/privacy-policy"
                            target="__blank"
                          > */}{" "}
                            {t("Privacy Policy")}*
                            {/* </Link> */}
                          </label>
                        </div>
                        {errors?.tnc_accepted &&
                          errors?.tnc_accepted.type == "required" && (
                            <div
                              className="invalid-feedback d-block"
                              style={{ width: "50%" }}
                            >
                              {t("Please Accept Native Terms of Service and Privacy Policy.")}
                            </div>
                          )}
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleSubmit(onSubmit)}
                        >
                          {t("Contact Us")}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                          id="contactCloseModel"
                          style={{ display: "none" }}
                        >
                          {t("Close")}
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
    </>
  );
};

export async function getServerSideProps(context) {
  createAxiosCookies(context);
  const { lang } = getCookies(context);
  let lang_code = "en";
  let lang_id = 1;

  try {
    const language = JSON.parse(lang)

    lang_code = String(language.code).toLowerCase()
    lang_id = language.id;
  } catch (error) {
    lang_code = "en"
    lang_id = 1;
  }

  let data = await faqPageData(1, lang_id);
  return {
    props: {
      ...data,
      isProtected: null,
      ...(await serverSideTranslations(lang_code, [
        'common',
      ])),
      lang_id
    },
  };
}

export default HelpCenter;
