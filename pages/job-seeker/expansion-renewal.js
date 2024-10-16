import React, { useEffect, useState,useRef } from "react";
import Link from "next/link";
import { createAxiosCookies } from "@/fn";
import FlagLang from "@/components/FlagLang";

import { useSelector } from "react-redux";
import { logout, updateSubscription } from "@/store/authSlice";
import { useDispatch } from "react-redux";
import LogOut from "@/components/logout";
import { IMAGEBASEURL } from "@/api";
import styles from "@/styles/subscriptions.module.css";


import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import { getAllFunctionMasteryPackages, getAllSubscriptions } from "@/services/jobSeeker/subscription";
import { Modal } from "react-bootstrap";
import useRequest from "@/hooks/useRequest";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";


const ExploreOurPackages = ({ subscriptionList, packagesList }) => {
  const sliderRef = useRef();
  const {
    getValues,
    register,
    formState: { errors },
    handleSubmit, reset
  } = useForm()

  const { companyProfile, subscription, was_subscriber, is_subscriber } = useSelector((store) => store.auth);
  const { request, response } = useRequest();

  const [isShowAllPackages, setIsShowAllPackages] = useState(false);
  const [modalContent, setModalContent] = useState({})
  console.log("modal Content : ", modalContent);

  const [subsPopup, setSubspopup] = useState(false);
  const handleWelcomeClose = () => { setSubspopup(false); setModalContent({}) }
  const handleWelcomeShow = () => setSubspopup(true);

  const [subsDone, setSubsDone] = useState(false);
  const handleSubsDoneOpen = () => setSubsDone(true);
  const handleSubsDoneClose = () => { setSubsDone(false); setModalContent({}) };

  const [courseTypeModal, setCourseTypeModal] = useState(false);
  const handleShowCourseType = () => setCourseTypeModal(true);
  const handleCloseCourseType = () => setCourseTypeModal(false);

  const [alertShow, setAlertShow] = useState(!was_subscriber ? true : false);
  const closeAlertShow = () => setAlertShow(false)

  const dispatch = useDispatch();

  const getSubscription = () => {
    request("POST", "subscribe/candidate/", { subscription_id: modalContent.id, course_type: modalContent.course_type, sub_course_type: null })
  }

  const getFunctionMasterySubscription = (data) => {
    console.log("data : ",data);
    
    if (Array.isArray(data.functional_mastery_courses)) {
      request("POST", "subscribe/candidate/", { subscription_id: modalContent.id, course_type: modalContent.course_type, sub_course_type: data.functional_mastery_courses })
    } else if(typeof data.functional_mastery_courses == "string"){
      request("POST", "subscribe/candidate/", { subscription_id: modalContent.id, course_type: modalContent.course_type, sub_course_type: [data.functional_mastery_courses] })
    }
  }

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (response) {
      toast.success("Subscription completed successfully.")
      let finalObj = {
        "career_coaching": (modalContent.course_type == "career_coaching") ? 1 : subscription.career_coaching,
        "standout": (modalContent.course_type == "standout") ? 1 : subscription.standout,
        "functional_mastery": (modalContent.course_type == "functional_mastery") ? [...subscription.functional_mastery, ...getValues("functional_mastery_courses")] : subscription.functional_mastery
      }
      dispatch(updateSubscription(finalObj));
      handleCloseCourseType()
      reset({ "functional_mastery_courses": [] })
      handleSubsDoneOpen();
      setSubspopup(false);
    }
  }, [response])
  return (
    <>
      <JobSeekerAuth data={{ title: "Explore Our Packages" }} />
      <div className="page_container">
        <div className="main_content" id="body_lang_css">

          <div className={styles.subscription_head}>
            <ul className={styles.subscription_tabs}>
              <li className={`${styles.subscription_tabs_items}`}>
                <Link href="/job-seeker/explore-our-packages" className={styles.nav_link}>New</Link>
              </li>
              <li className={`${styles.subscription_tabs_items} ${styles.active}`}>
                <Link href="#" className={styles.nav_link}>Expansion/Renewal – Save 10%</Link>
              </li>
            </ul>
          </div>



          <div className={`${styles.plans_box}`} ref={sliderRef} tabIndex={0} style={{outline: "0"}}>

            {
              subscriptionList.filter(f => f.is_free != "1").map(d => {

                return (
                  <div className={`${styles.plans_items_track}`}>

                    <div className={styles.card_detail_box}>
                      <div className={styles.card_head}>
                        <h3 className={styles.paln_heading}>{d.title}</h3>
                        <div className={styles.price_box}>
                          {
                            d.is_free ? (

                              <h4 className={styles.price_title}>Free</h4>
                            ) : (
                              <h4 className={styles.price_title}>{(d.price - ((d.price * d.renew_discount) / 100)).toLocaleString()} <span className={styles.price_sub_title}>EGP</span></h4>
                            )
                          }

                          {
                            was_subscriber ?
                              d.is_free ? (<button className={styles.price_btn} >Selected</button>) :

                                (d.course_type !== "functional_mastery" && subscription[d.course_type] == "0") ?
                                  (

                                    <button className={styles.price_btn} onClick={() => { handleWelcomeShow(); setModalContent(d) }} >Get started</button>
                                  ) : (d.course_type == "functional_mastery") ?
                                    <button className={styles.price_btn} onClick={() => { setModalContent(d); handleShowCourseType(); }} >Get started</button>
                                    : (<></>)
                              : (<></>)
                          }
                        </div>
                      </div>
                      <div className={styles.card_inner_box}>
                        <p className={styles.card_sub_title}>{d.description.split("\n")[0]}</p>
                        <ul className={styles.plans_name_box}>
                          {
                            d.description.split("\n").map((v, i) => {
                              if (i > 0) {
                                return (
                                  <li className={styles.plans_items}>
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M7.05744 3.65765C6.79227 3.42576 6.38957 3.4529 6.15774 3.71789C5.92616 3.98307 5.95323 4.38576 6.21823 4.61759L9 8.59987L6.21799 12.5825C5.95275 12.8143 5.92592 13.217 6.15751 13.4819C6.38933 13.7472 6.79203 13.7742 7.05727 13.5424L12.1571 9.07988C12.2256 9.02002 12.2804 8.94623 12.318 8.86344C12.3556 8.78065 12.375 8.69079 12.375 8.59987C12.375 8.50896 12.3556 8.41909 12.318 8.33631C12.2804 8.25352 12.2256 8.17973 12.1571 8.11987L7.05744 3.65765Z" fill="#2A3858" />
                                    </svg>
                                    <span className={styles.plans_items_content}>{v}</span>
                                  </li>
                                )
                              }
                            })
                          }
                        </ul>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>


        </div>
      </div>

      <Modal
        className="successfull_popup"
        show={subsPopup}
        onHide={handleWelcomeClose}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <h3>
            {modalContent.title} Subscription ({modalContent.price?.toLocaleString()} EGP)
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.modal_content} style={{ textAlign: "left" }}>
            <h5>
              <ol>
                {modalContent.description?.split("\n").map((d, i) => (
                  <li>{(i > 0) ? <svg xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" viewBox="0 0 32 32" data-name="01-Arrow-direction-pointer" id="_01-Arrow-direction-pointer"><title /><polygon points="4 1 28 16 4 31 14 16 4 1" style={{ "fill": "none", "stroke": "#000000", "strokeLinecap": "round", "strokeLinejoin": "round", "strokeWidth": "2px" }} /></svg> : ""} <span style={(i > 0) ? { fontSize: "15px" } : { paddingBottom: "20px" }}>{d}</span> </li>
                ))}
              </ol>
            </h5>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" onClick={() => getSubscription()} >Subscribe</button>
        </Modal.Footer>
      </Modal>

      <Modal
        className="successfull_popup"
        show={subsDone}
        onHide={handleSubsDoneClose}
        size="lg"
        centered
      >
        <Modal.Header closeButton style={{ borderBottom: "none" }}>
        </Modal.Header>
        <Modal.Body>
          {console.log("modalContent",modalContent)}
          <div className="modal_inner">
            <h2>🎉 Welcome Aboard! 🎉</h2>
            <br />
            <h6>Welcome to our exclusive community! A confirmation email is on its way.</h6>
            <h6>Ready to begin your journey? Let's get <Link href={(modalContent.course_type == "career_coaching") ? "/course?query=true" : (modalContent.course_type == "standout") ? "/standout?query=true" : (modalContent.course_type == "functional_mastery") ? "/functional-mastery?query=true" : ""}> started! </Link></h6>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        className="successfull_popup"
        show={courseTypeModal}
        onHide={handleCloseCourseType}
        size="md"
        centered
      >
        {console.log("err", errors)}
        <Modal.Header className={`modal-header ${styles.modal_header}`}>
          <h1 className={`modal-title ${styles.modal_title}`} id="exampleModalLabel">Choose Courses</h1>
        </Modal.Header>
        {errors?.["functional_mastery_courses"] && (
          <div className="invalid-feedback d-block text-center">
            {errors?.["functional_mastery_courses"].message}
          </div>
        )}
        <Modal.Body className={`modal-body ${styles.modal_box}`}>
          {console.log(packagesList)}
          {Array.isArray(subscription['functional_mastery']) && packagesList.every(r => subscription['functional_mastery'].includes(String(r.id))) ? <p>You have already purchased all Courses.</p> : <div>
            <ul className={styles.course_list_block}>
              {console.log("subscription['functional_mastery']", subscription['functional_mastery'])}
              {Array.isArray(packagesList) && packagesList.slice(0, isShowAllPackages ? packagesList.length : 3).map(p => {
                return !subscription['functional_mastery'].includes(String(p.id)) && <li className={styles.course_list_items}>
                  <div className={`form-check ${styles.form_check}`}>
                    <input className={`form-check-input ${styles.form_check_input}`} name="functional_mastery_courses" type="checkbox" value={p.id} id={p.id} {...register("functional_mastery_courses", {
                      required: {
                        value: true,
                        message: "Please Select at least one course.",
                      }
                    })} />
                    <label className={`form-check-label ${styles.form_check_label}`} for={p.id}>
                      {p.title}
                    </label>
                  </div>
                </li>
              })}
              {Array.isArray(packagesList) && packagesList.length > 3 && <li className={styles.course_list_items}>
                <button className={styles.add_more} onClick={() => setIsShowAllPackages(!isShowAllPackages)}>
                  {isShowAllPackages ? "Show less !" : "And more!"}
                </button>
              </li>}

            </ul>
            <div className={styles.btn_box}>
              <button className={`post_btn ${styles.pay_now}`} onClick={handleSubmit(getFunctionMasterySubscription)}>Pay Now</button>
            </div>
          </div>}
        </Modal.Body>
      </Modal>

      {/* Modal*/}

      <Modal show={alertShow} onHide={setAlertShow}>
        <Modal.Header closeButton style={{ textAlign: "center" }}>
          <h1 className="modal-title fs-5" id="exampleModalLabel">Exclusive Access Alert! 🚀</h1>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p className={styles.modal_content}>This section is exclusive for members with an active subscription. <Link href="/job-seeker/explore-our-packages"><b>Join us</b></Link> now to enjoy all the benefits.</p>

          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
export async function getServerSideProps(context) {
  createAxiosCookies(context);
  const subscriptionList = await getAllSubscriptions()
  const packagesList = await getAllFunctionMasteryPackages()

  return {
    props: {
      subscriptionList: subscriptionList.subscriptions,
      packagesList: packagesList.packages,
      publicHeader: false,
      publicFooter: false,
    },
  };
}

export default ExploreOurPackages;
