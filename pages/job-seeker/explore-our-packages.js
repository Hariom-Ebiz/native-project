import React, { useEffect, useState, useRef} from "react";
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
import { ReactSelectInput, SelectInput } from "@/components/cv/inputFields";
import { useForm } from "react-hook-form";

const ExploreOurPackages = ({ subscriptionList,packagesList }) => {
  const {
    getValues,
    register,
    formState: { errors },
    handleSubmit, reset
  } = useForm()
  const sliderRef = useRef();
  const { companyProfile, subscription, was_subscriber, is_subscriber } = useSelector((store) => store.auth);
  const { request, response } = useRequest();
  const [isShowAllPackages, setIsShowAllPackages] = useState(false);

  const [modalContent, setModalContent] = useState({})
  const [subsPopup, setSubspopup] = useState(false);
  const handleWelcomeClose = () => {setSubspopup(false);setModalContent({})}
  const handleWelcomeShow = () => setSubspopup(true);

  const [subsDone, setSubsDone] = useState(false);
  const handleSubsDoneOpen = () => setSubsDone(true);
  const handleSubsDoneClose = () => {setSubsDone(false); setModalContent({})};

  const [alertShow, setAlertShow] = useState(was_subscriber ? true : false);
  const closeAlertShow = () => setAlertShow(false)

  const [courseTypeModal, setCourseTypeModal] = useState(false);
  const handleShowCourseType = () => setCourseTypeModal(true);
  const handleCloseCourseType = () => setCourseTypeModal(false);

  const dispatch = useDispatch();

  const getSubscription = () => {
    request("POST", "subscribe/candidate/", {subscription_id: modalContent.id, course_type: modalContent.course_type, sub_course_type: null})
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
        "functional_mastery": (modalContent.course_type == "functional_mastery") ? [...subscription.functional_mastery, "2"] : subscription.functional_mastery
      }
      dispatch(updateSubscription(finalObj));
      handleCloseCourseType()
      reset({ "functional_mastery_courses": [] })
      handleSubsDoneOpen();
      setSubspopup(false);
    }
  }, [response])

  const getFunctionMasterySubscription = (data) => {
    console.log("data : ",data);
    
    if (Array.isArray(data.functional_mastery_courses)) {
      request("POST", "subscribe/candidate/", { subscription_id: modalContent.id, course_type: modalContent.course_type, sub_course_type: data.functional_mastery_courses })
    } else if(typeof data.functional_mastery_courses == "string"){
      request("POST", "subscribe/candidate/", { subscription_id: modalContent.id, course_type: modalContent.course_type, sub_course_type: [data.functional_mastery_courses] })
    }
  }

  return (
    <>
      <JobSeekerAuth data={{ title: "Explore Our Packages" }} />
      <div className="page_container">
        <div className="main_content" id="body_lang_css">
          {/* <div className="company_message">
                <div className="company_message_left">
                  <h3 className="Dash_subTitle">Explore Our Packages</h3>
                </div>
          </div> */}

          <div className={styles.subscription_head}>
            <ul className={styles.subscription_tabs}>
              <li className={`${styles.subscription_tabs_items} ${styles.active}`}>
                <a href="#" className={styles.nav_link}>New</a>
              </li>
              <li className={`${styles.subscription_tabs_items}`}>
                <Link href="/job-seeker/expansion-renewal" className={styles.nav_link}>Expansion/Renewal – Save 30%</Link>
              </li>
            </ul>
          </div>



          <div className={`${styles.plans_box}`} ref={sliderRef} tabIndex={0} style={{outline: "0"}}>

            {
              subscriptionList.map(d => {

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
                              <h4 className={styles.price_title}>{d.price.toLocaleString()} <span className={styles.price_sub_title}>EGP</span></h4>
                            )
                          }

                          {
                            !was_subscriber ?
                            d.is_free ? (<button className={styles.price_btn} >Selected</button>) :

                            (d.course_type !== "functional_mastery" && subscription[d.course_type] == "0") ? 
                            (

                              <button className={styles.price_btn} onClick={() => { handleWelcomeShow(); setModalContent(d) }} >Get started</button>
                            ) : (d.course_type == "functional_mastery") ? 
                              <button className={styles.price_btn} onClick={() => { setModalContent(d); handleShowCourseType() }} >Get started</button>
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



      {/* -------------Modal---------------  */}
      <Modal
        className="successfull_popup"
        show={courseTypeModal}
        onHide={handleCloseCourseType}
        size="md"
        centered
      >
        {console.log("err", errors)}
        <Modal.Header className={`modal-header ${styles.modal_header}`}>
          <h1 className={`modal-title ${styles.modal_title}`} id="exampleModalLabel">Let’s Level Up! 🚀
          </h1>
        </Modal.Header>
        
          <Modal.Body>
          <div className={styles.modal_content} style={{ textAlign: "left" }}>
            <h5>Pick one of the Functional Mastery Journeys below to boost your skills and advance your career
            </h5> 
            {/* "{modalContent.title} ({modalContent.price?.toLocaleString()} EGP)" ?*/}
          </div>
        </Modal.Body>

        <Modal.Body className={`modal-body ${styles.modal_box}`}>
          {console.log(packagesList)}
          {Array.isArray(subscription['functional_mastery']) && packagesList.every(r => subscription['functional_mastery'].includes(String(r.id))) ? <p>You have already purchased all Courses.</p> : <div>
            <ul className={styles.course_list_block}>
              {console.log("subscription['functional_mastery']", subscription['functional_mastery'])}
              {Array.isArray(packagesList) && packagesList.length > 0 && 
              <select {...register("functional_mastery_courses", { required: "Please select atleast one course" })}>
                <option disabled value={""} selected>Select a Course</option>

                {Array.isArray(packagesList) && packagesList.map(p => {
                return !subscription['functional_mastery'].includes(String(p.id)) && 
                    <option value={p.id}>{p.title}</option>
                })}
                </select>}
                {errors?.["functional_mastery_courses"] && (
          <div className="invalid-feedback d-block">
            {errors?.["functional_mastery_courses"].message}
          </div>
        )}
              
              {/* {Array.isArray(packagesList) && packagesList.length > 3 && <li className={styles.course_list_items}>
                <button className={styles.add_more} onClick={() => setIsShowAllPackages(!isShowAllPackages)}>
                  {isShowAllPackages ? "Show less !" : "And more!"}
                </button>
              </li>} */}

            </ul>
            <div className={styles.btn_box}>
              <button className={`post_btn ${styles.pay_now}`} onClick={handleSubmit(getFunctionMasterySubscription)}>Continue to Payment</button>
            </div>
          </div>}
        </Modal.Body>
      </Modal>
      
      <Modal
        className="successfull_popup"
        show={subsPopup}
        onHide={handleWelcomeClose}
        size="md"
        centered
      >
        <Modal.Header closeButton>
          <h3>
          Let’s Level Up! 🚀
            {/* {modalContent.title} Subscription ({modalContent.price?.toLocaleString()} EGP) */}
          </h3>
        </Modal.Header>



        <Modal.Body>
          <div className={styles.modal_content} style={{ textAlign: "left" }}>
            <h5>You’re about to unlock {modalContent.title} , your gateway to mastering new skills and advancing your career!</h5> 
            {/* "{modalContent.title} ({modalContent.price?.toLocaleString()} EGP)" ?*/}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" onClick={() => getSubscription()} >Continue to Payment</button>
        </Modal.Footer>
      </Modal>

      <Modal
        className="successfull_popup"
        show={subsDone}
        onHide={handleSubsDoneClose}
        size="lg"
        centered
      >
          <Modal.Header closeButton style={{borderBottom: "none"}}>
          </Modal.Header>
          <Modal.Body>
            <div className="modal_inner">
              {/* <div className="icon_block">
                <img src="/img/icon.png" alt="" />
              </div> */}

              <h2>🎉 Welcome Aboard! 🎉</h2>
              <br />
              <h6>Welcome to our exclusive community! A confirmation email is on its way.</h6>
              <h6>Ready to begin your journey? Let's get <Link href={(modalContent.course_type == "career_coaching") ? "/course?query=true" : (modalContent.course_type == "standout") ? "/standout?query=true" : (modalContent.course_type == "functional_mastery") ? "/functional-mastery?query=true" : ""}> started! </Link></h6>
            </div>
          </Modal.Body>
      </Modal>

      <Modal
        className="successfull_popup"
        show={alertShow}
        onHide={closeAlertShow}
        size="lg"
        centered
      >
          <Modal.Header closeButton style={{textAlign: "center"}}>
          <h1 className="modal-title fs-5" id="exampleModalLabel">Exclusive Access Alert! 🚀</h1>
        </Modal.Header>
        <Modal.Body>
          <p className={styles.modal_content}>This section is for new members only. Our valued members with an active subscription can enjoy special packages for expansion and renewal</p>
          <Link className={`post_btn ${styles.offers_btn}`} href="/job-seeker/expansion-renewal">Explore Exclusive Offers Now</Link>
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
