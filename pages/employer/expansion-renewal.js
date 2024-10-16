import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { createAxiosCookies, getCookies } from "@/fn";
import FlagLang from "@/components/FlagLang";

import { useSelector } from "react-redux";
import { logout, updateCompanyProfile } from "@/store/authSlice";
import { useDispatch } from "react-redux";
import LogOut from "@/components/logout";
import { IMAGEBASEURL } from "@/api";
import styles from "@/styles/subscriptions.module.css";
import EmployerAuth from "@/components/layout/EmployerAuth";
import { getAllSubscriptions } from "@/services/employer/subscriptions";
import { Modal, ModalFooter } from "react-bootstrap";
import useRequest from "@/hooks/useRequest";
import { toast } from "react-toastify";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from "react-i18next";
import { PopupButton } from "react-calendly";

const getValidity = (months) => {
  let years = months/12;
  let month = months%12;

  return (years >= 1 && month) ? `${years} Years ${month} Months` : (years >= 0 && !month) ? `${years} Year` : `${month} Months`
}

const ExploreOurPackages = ({subscriptionList}) => {
  const sliderRef = useRef();
const { t } = useTranslation('common');
  const { companyProfile, was_subscriber } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const { request, response } = useRequest();

  const [modalContent, setModalContent] = useState({})
  const [isNew, setIsNew] = useState(true);
  const [subsPopup, setSubspopup] = useState(false);
  const handleWelcomeClose = () => {setSubspopup(false);setModalContent({})}
  const handleWelcomeShow = () => setSubspopup(true);

  const [customisedPopup, setCustomisedpopup] = useState(false);
  const handleCustomisedClose = () => {setCustomisedpopup(false);}
  const handleCustomisedShow = () => setCustomisedpopup(true);

  const [subsDone, setSubsDone] = useState(false);
  const handleSubsDoneOpen = () => setSubsDone(true);
  const handleSubsDoneClose = () => setSubsDone(false);

  const [alertShow, setAlertShow] = useState(was_subscriber ? false : true);
  const closeAlertShow = () => setAlertShow(false)

  const getSubscription = () => {
    request("POST", "subscribe/", {subscription_id: modalContent.id})
  }

  useEffect(() => {
    if (response) {
      toast.success("Subscription completed successfully.")
      dispatch(updateCompanyProfile({...companyProfile, unlock_qty: companyProfile.unlock_qty+modalContent.unlock_cv_qty}));
      handleSubsDoneOpen();
      handleWelcomeClose();
    }
  }, [response])

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.focus();
    }
  }, []);


  // let modall = document.getElementById("new_modal");
  // let m = new BootstrapModal(modall)
  // m.show();
  return (
    <>
      <EmployerAuth data={{ title: "Explore Our Packages" }} />
      <div className="page_container">
      <div className="main_content" id="body_lang_css">
        <div className="company_message">
          <div className="company_message_left">
            <h3 className="Dash_subTitle">{t("Renewal Packages")}</h3>
          </div>
        </div>

          <div className={styles.subscription_head}>
            <ul className={styles.subscription_tabs}>
              <li className={`${styles.subscription_tabs_items}`} style={{cursor: "pointer"}}>
                  <Link href="/employer/explore-our-packages" className={styles.nav_link}>New</Link>

                {/* <span className={styles.nav_link} data-bs-toggle="modal" data-bs-target="#new_modal">New</span> */}
              </li>

              <li className={`${styles.subscription_tabs_items} ${styles.active}`} data-bs-toggle="modal" data-bs-target="#expansion_renewal">
                <span className={styles.nav_link}>Expansion/Renewal – {t("Save")} 10%</span>
              </li>
            </ul>
          </div>


          <div className={styles.dash_pricingCardBox}>
            <div className={styles.pricingCard}>
              <h3 className={styles.pricingHeading}>{t("Select Your Plan")}</h3>
              <ul className={styles.plans_name_box}>
                <li className={styles.plans_items}>{t("Unlimited CVs/Candidates Search")}</li>
                <li className={styles.plans_items}>{t("Unlimited Job Posting")}</li>
                <li className={styles.plans_items}>{t("Unlimited Candidates' Invitation")}</li>
                <li className={styles.plans_items}>{t("Number of Unlocked Candidates")}</li>
                <li className={styles.plans_items}>{t("Access to Candidates' Profiles and CVs")}</li>
                <li className={styles.plans_items}>{t("Access to Screening Assessments’ Results")}</li>
                <li className={styles.plans_items}>{t("Access to Screening Questions' Insights")}</li>
                <li className={styles.plans_items}>{t("Validity Period")}</li>
                <li className={styles.plans_items}>{t("Premium Job Postings")}</li>
                <li className={styles.plans_items}>{t("Priority Support")}</li>
                <li className={styles.plans_items}>{t("Advanced Analytics")}</li>
              </ul>
            </div>
            <div className={styles.plans_box} ref={sliderRef} tabIndex={0} style={{outline: "0"}}>

              {
                subscriptionList.filter(f => f.is_free != 1).map(d => {
                  let benis = d.benifiets ? JSON.parse(d.benifiets) : [];
                  console.log(">>>>>>>> ", benis)
                  return (
                    <div className={`${styles.plans_items_track} ${(d.is_recommanded) ? styles.active : {}}`}>

                      <div className={styles.recommended_box}>
                        {
                          (d.is_recommanded ? <span className={styles.recommended_title}>{t("Recommended")}</span> : <></>)
                        }
                      </div>
                      <div className={styles.card_detail_box}>
                        <div className={styles.card_head}>
                          <h3 className={styles.paln_heading}>{d.title}</h3>
                          <div className={styles.price_box}>
                            {(d.save) ? <span className={styles.offer_label}>{t("save")} {d.save}%</span> : ""}
                            <h4 className={styles.price_title}>{d.is_free ? "FREE" : (<>{(d.price - ((d.price * d.renew_discount)/100)).toLocaleString()}<span className={styles.price_sub_title}> EGP</span></>)}</h4>

                            {
                              was_subscriber ?
                              d.is_free ? (<button className={styles.price_btn} >{t("Selected")}</button>) : (
                                <button className={styles.price_btn} onClick={() => { handleWelcomeShow();setModalContent({...d,benis, price: (d.price - ((d.price * d.renew_discount)/100)).toLocaleString()}) }} >{t("Get started")}</button>
                              )
                              : ""
                            }
                          </div>
                        </div>
                        <ul className={styles.plans_name_box}>
                          <li className={styles.plans_items}>
                            {
                              benis.includes("Unlimited CVs/Candidates Search") ?
                                (

                                  <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.74709 22L7.48213 21.5487C5.49475 18.1627 0.208374 10.9698 0.155055 10.8976L0 10.6868L1.98884 8.72215L7.67998 12.6961C11.2469 8.08631 14.5697 4.91375 16.7435 3.05449C19.1448 1.00041 20.6652 0.0812796 20.7285 0.0431514L20.8004 0H24.3045L23.7111 0.528529C16.2173 7.20313 8.08734 21.4026 8.00606 21.5452L7.74709 22Z" fill="#2CC64D" />
                                  </svg>
                                ) : ("-")
                            }
                          </li>
                          <li className={styles.plans_items}>
                            {
                              benis.includes("Unlimited Job Posting") ?
                                (

                                  <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.74709 22L7.48213 21.5487C5.49475 18.1627 0.208374 10.9698 0.155055 10.8976L0 10.6868L1.98884 8.72215L7.67998 12.6961C11.2469 8.08631 14.5697 4.91375 16.7435 3.05449C19.1448 1.00041 20.6652 0.0812796 20.7285 0.0431514L20.8004 0H24.3045L23.7111 0.528529C16.2173 7.20313 8.08734 21.4026 8.00606 21.5452L7.74709 22Z" fill="#2CC64D" />
                                  </svg>
                                ) : ("-")
                            }
                          </li>
                          <li className={styles.plans_items}>
                            {
                              benis.includes("Unlimited Candidates' Invitation") ?
                                (
                                  <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.74709 22L7.48213 21.5487C5.49475 18.1627 0.208374 10.9698 0.155055 10.8976L0 10.6868L1.98884 8.72215L7.67998 12.6961C11.2469 8.08631 14.5697 4.91375 16.7435 3.05449C19.1448 1.00041 20.6652 0.0812796 20.7285 0.0431514L20.8004 0H24.3045L23.7111 0.528529C16.2173 7.20313 8.08734 21.4026 8.00606 21.5452L7.74709 22Z" fill="#2CC64D" />
                                  </svg>
                                ) : ("-")
                            }
                          </li>

                          <li className={styles.plans_items}>
                            {d.unlock_cv_qty || "-"}
                          </li>
                          <li className={styles.plans_items}>
                            {
                              benis.includes("Access to Candidates' Profiles and CVs") ?
                                (<svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M7.74709 22L7.48213 21.5487C5.49475 18.1627 0.208374 10.9698 0.155055 10.8976L0 10.6868L1.98884 8.72215L7.67998 12.6961C11.2469 8.08631 14.5697 4.91375 16.7435 3.05449C19.1448 1.00041 20.6652 0.0812796 20.7285 0.0431514L20.8004 0H24.3045L23.7111 0.528529C16.2173 7.20313 8.08734 21.4026 8.00606 21.5452L7.74709 22Z" fill="#2CC64D" />
                                </svg>
                                ) : ("-")
                            }
                          </li>
                          <li className={styles.plans_items}>
                            {
                              benis.includes("Access to Screening Assessments’ Results") ?
                                (<svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M7.74709 22L7.48213 21.5487C5.49475 18.1627 0.208374 10.9698 0.155055 10.8976L0 10.6868L1.98884 8.72215L7.67998 12.6961C11.2469 8.08631 14.5697 4.91375 16.7435 3.05449C19.1448 1.00041 20.6652 0.0812796 20.7285 0.0431514L20.8004 0H24.3045L23.7111 0.528529C16.2173 7.20313 8.08734 21.4026 8.00606 21.5452L7.74709 22Z" fill="#2CC64D" />
                                </svg>
                                ) : ("-")
                            }
                          </li>
                          <li className={styles.plans_items}>
                            {
                              benis.includes("Access to Screening Questions' Insights") ?
                                (<svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M7.74709 22L7.48213 21.5487C5.49475 18.1627 0.208374 10.9698 0.155055 10.8976L0 10.6868L1.98884 8.72215L7.67998 12.6961C11.2469 8.08631 14.5697 4.91375 16.7435 3.05449C19.1448 1.00041 20.6652 0.0812796 20.7285 0.0431514L20.8004 0H24.3045L23.7111 0.528529C16.2173 7.20313 8.08734 21.4026 8.00606 21.5452L7.74709 22Z" fill="#2CC64D" />
                                </svg>
                                ) : ("-")
                            }
                          </li>
                          <li className={styles.plans_items}>
                            <span>{(d.months) ? getValidity(d.months) : "-"}</span>
                          </li>
                          <li className={styles.plans_items}>
                            {
                              benis.includes("Premium Job Postings") ?
                                (<svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M7.74709 22L7.48213 21.5487C5.49475 18.1627 0.208374 10.9698 0.155055 10.8976L0 10.6868L1.98884 8.72215L7.67998 12.6961C11.2469 8.08631 14.5697 4.91375 16.7435 3.05449C19.1448 1.00041 20.6652 0.0812796 20.7285 0.0431514L20.8004 0H24.3045L23.7111 0.528529C16.2173 7.20313 8.08734 21.4026 8.00606 21.5452L7.74709 22Z" fill="#2CC64D" />
                                </svg>
                                ) : ("-")
                            }
                          </li>
                          <li className={styles.plans_items}>
                            {
                              benis.includes("Priority Support") ?
                                (<svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M7.74709 22L7.48213 21.5487C5.49475 18.1627 0.208374 10.9698 0.155055 10.8976L0 10.6868L1.98884 8.72215L7.67998 12.6961C11.2469 8.08631 14.5697 4.91375 16.7435 3.05449C19.1448 1.00041 20.6652 0.0812796 20.7285 0.0431514L20.8004 0H24.3045L23.7111 0.528529C16.2173 7.20313 8.08734 21.4026 8.00606 21.5452L7.74709 22Z" fill="#2CC64D" />
                                </svg>
                                ) : ("-")
                            }
                          </li>
                          <li className={styles.plans_items}>
                            {
                              benis.includes("Advanced Analytics") ?
                                (<svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M7.74709 22L7.48213 21.5487C5.49475 18.1627 0.208374 10.9698 0.155055 10.8976L0 10.6868L1.98884 8.72215L7.67998 12.6961C11.2469 8.08631 14.5697 4.91375 16.7435 3.05449C19.1448 1.00041 20.6652 0.0812796 20.7285 0.0431514L20.8004 0H24.3045L23.7111 0.528529C16.2173 7.20313 8.08734 21.4026 8.00606 21.5452L7.74709 22Z" fill="#2CC64D" />
                                </svg>
                                ) : ("-")
                            }
                          </li>



                        </ul>
                      </div>
                    </div>
                  )
                })
              }

              <div className={`${styles.plans_items_track}`}>

                <div className={styles.recommended_box}>
                </div>
                <div className={styles.card_detail_box}>
                  <div className={styles.card_head}>
                    <h3 className={styles.paln_heading}>{t("Customized")}</h3>
                    <div className={styles.price_box}>
                      <h4 className={styles.price_title}>{t("Variable Pricing")} </h4>
                      {
                        was_subscriber ? (
                          // <button className={styles.price_btn} onClick={() => { handleWelcomeShow();setModalContent({...d,benis, price: (d.price - ((d.price * d.renew_discount)/100)).toLocaleString()}) }} >{t("Get started")}</button>
                          <button className={styles.price_btn} onClick={()=>handleCustomisedShow(true)}>{t("Get started")}</button>
                        ) : ""
                      }
                    </div>
                  </div>
                  <ul className={styles.plans_name_box}>
                    <li className={styles.plans_items}>
                      <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.74709 22L7.48213 21.5487C5.49475 18.1627 0.208374 10.9698 0.155055 10.8976L0 10.6868L1.98884 8.72215L7.67998 12.6961C11.2469 8.08631 14.5697 4.91375 16.7435 3.05449C19.1448 1.00041 20.6652 0.0812796 20.7285 0.0431514L20.8004 0H24.3045L23.7111 0.528529C16.2173 7.20313 8.08734 21.4026 8.00606 21.5452L7.74709 22Z" fill="#2CC64D" />
                      </svg>
                    </li>
                    <li className={styles.plans_items}>
                      <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.74709 22L7.48213 21.5487C5.49475 18.1627 0.208374 10.9698 0.155055 10.8976L0 10.6868L1.98884 8.72215L7.67998 12.6961C11.2469 8.08631 14.5697 4.91375 16.7435 3.05449C19.1448 1.00041 20.6652 0.0812796 20.7285 0.0431514L20.8004 0H24.3045L23.7111 0.528529C16.2173 7.20313 8.08734 21.4026 8.00606 21.5452L7.74709 22Z" fill="#2CC64D" />
                      </svg>
                    </li>
                    <li className={styles.plans_items}>
                      <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.74709 22L7.48213 21.5487C5.49475 18.1627 0.208374 10.9698 0.155055 10.8976L0 10.6868L1.98884 8.72215L7.67998 12.6961C11.2469 8.08631 14.5697 4.91375 16.7435 3.05449C19.1448 1.00041 20.6652 0.0812796 20.7285 0.0431514L20.8004 0H24.3045L23.7111 0.528529C16.2173 7.20313 8.08734 21.4026 8.00606 21.5452L7.74709 22Z" fill="#2CC64D" />
                      </svg>
                    </li>

                    <li className={styles.plans_items}>
                      <span>{t("Customizable")}</span>
                    </li>
                    <li className={styles.plans_items}>
                      <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.74709 22L7.48213 21.5487C5.49475 18.1627 0.208374 10.9698 0.155055 10.8976L0 10.6868L1.98884 8.72215L7.67998 12.6961C11.2469 8.08631 14.5697 4.91375 16.7435 3.05449C19.1448 1.00041 20.6652 0.0812796 20.7285 0.0431514L20.8004 0H24.3045L23.7111 0.528529C16.2173 7.20313 8.08734 21.4026 8.00606 21.5452L7.74709 22Z" fill="#2CC64D" />
                      </svg>
                    </li>
                    <li className={styles.plans_items}>
                      <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.74709 22L7.48213 21.5487C5.49475 18.1627 0.208374 10.9698 0.155055 10.8976L0 10.6868L1.98884 8.72215L7.67998 12.6961C11.2469 8.08631 14.5697 4.91375 16.7435 3.05449C19.1448 1.00041 20.6652 0.0812796 20.7285 0.0431514L20.8004 0H24.3045L23.7111 0.528529C16.2173 7.20313 8.08734 21.4026 8.00606 21.5452L7.74709 22Z" fill="#2CC64D" />
                      </svg>
                    </li>
                    <li className={styles.plans_items}>
                      <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.74709 22L7.48213 21.5487C5.49475 18.1627 0.208374 10.9698 0.155055 10.8976L0 10.6868L1.98884 8.72215L7.67998 12.6961C11.2469 8.08631 14.5697 4.91375 16.7435 3.05449C19.1448 1.00041 20.6652 0.0812796 20.7285 0.0431514L20.8004 0H24.3045L23.7111 0.528529C16.2173 7.20313 8.08734 21.4026 8.00606 21.5452L7.74709 22Z" fill="#2CC64D" />
                      </svg>
                    </li>

                    <li className={styles.plans_items}>
                      <span>{t("Customizable")}</span>
                    </li>
                    <li className={styles.plans_items}>
                      <span>{t("Available as an Add-on")}</span>
                    </li>
                    <li className={styles.plans_items}>
                      <span>{t("Available as an Add-on")}</span>
                    </li>
                    <li className={styles.plans_items}>
                      <span>{t("Available as an Add-on")}</span>
                    </li>



                  </ul>
                </div>
              </div>
            </div>
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
            <h4>
                {/* {modalContent.title} {t("Subscription")} ({modalContent.price?.toLocaleString()} EGP) */}
                Just One Step Away! 🚀
            </h4>
          </Modal.Header>
          <Modal.Body>
              <div className={styles.modal_content} style={{textAlign: "left"}}>
                    <h5>You’re about to unlock {modalContent.title} {t("Subscription")} packed with all you need to supercharge your journey:</h5>
                  <h5>
                    {console.log("modalContent",modalContent)}
                      <ul style={{listStyle: "disc", listStylePosition: "outside"}}>
                        <li style={{listStyle: "disc", marginLeft: "20px", fontSize: "18px"}}>
                          {modalContent.unlock_cv_qty} Fully Accessible Candidates
                        </li>
                        <li style={{listStyle: "disc", marginLeft: "20px", fontSize: "18px"}}>
                          <b>Validity</b>: ({modalContent.months} months/year)
                        </li>
                        <li style={{listStyle: "disc", marginLeft: "20px", fontSize: "18px"}}>
                          <b>Full Access</b>: {Array.isArray(modalContent.benis) ? modalContent.benis.join(", ") : ""}
                        </li>
                       {/* {modalContent.description?.split("\n").map((d,i) => (
                        <li>{
                          (i > 0) ? <svg xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" viewBox="0 0 32 32" data-name="01-Arrow-direction-pointer" id="_01-Arrow-direction-pointer"><title/><polygon points="4 1 28 16 4 31 14 16 4 1" style={{"fill":"none","stroke":"#000000","strokeLinecap":"round","strokeLinejoin":"round","strokeWidth":"2px"}}/></svg>
                           : ""} <span style={(i > 0) ? {fontSize: "15px"} : {paddingBottom: "20px"}}>{d}</span> </li>
                       ))}  */}
                      </ul>
                  </h5>

                  <h6>Maximize your hiring success—let's get started!</h6>
              </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-primary" onClick={() => getSubscription()} >{t("Continue to Payment")}</button>
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

              <h2>🎉 {t("Welcome Aboard!")} 🎉</h2>
              <br />
              <h6>{t("Welcome to our exclusive community! A confirmation email is on its way.")}</h6>
              <h6>{t("How would you like to start your journey?")}</h6>
            </div>
          </Modal.Body>
          <Modal.Footer>
              <button className="btn btn-primary" onClick={() => getSubscription()} >{t("Continue to Payment")}</button>
          </Modal.Footer>
      </Modal>


      {/* <div className="modal fade" id="new_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{display: "block", opacity: "1"}}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Exclusive Access Alert! 🚀</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div>
                <p className={styles.modal_content}>This section is for new members only. Our valued members with an active subscription can enjoy special packages for expansion and renewal</p>
                <a className={`post_btn ${styles.offers_btn}`} href="#">Explore Exclusive Offers Now</a>
              </div>
            </div>

          </div>
        </div>
      </div> */}

      {/* Modal*/}

      <Modal show={alertShow} onHide={setAlertShow}>
        <Modal.Header closeButton style={{textAlign: "center"}}>
          <h1 className="modal-title fs-5" id="exampleModalLabel">{t("Exclusive Access Alert!")} 🚀</h1>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p className={styles.modal_content}>{t("This section is exclusive for members with an active subscription")}. <Link href="/employer/explore-our-packages"><b>{t("Join us")}</b></Link> {t("now to enjoy all the benefits.")}</p>

          </div>
        </Modal.Body>
      </Modal>

      <Modal show={customisedPopup} onHide={handleCustomisedClose} size="lg" centered>
        <Modal.Header closeButton style={{textAlign: "center"}}>
          <h1 className="modal-title fs-5" id="exampleModalLabel">{t("Tailor Your Perfect Solution!")} 🚀</h1>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p className={styles.modal_content}>You're one step closer to creating a package that fits your unique needs. Let's discuss your goals and craft the perfect offer together.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
            {/* <button className="btn btn-primary" onClick={() => getSubscription()} >{t("Schedule a Call")}</button> */}

            <PopupButton
              url="https://calendly.com/projectonqa-yez"
              rootElement={document.getElementById('__next')}
              text="Schedule a Call"
              textColor="#ffffff"
              color="#00a2ff"
              className="btn btn-primary "
              marginTop="0"
            />
          </Modal.Footer>
      </Modal>

      {/* <div className="modal fade show" id="expansion_renewal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{display: "block", opacity: "1"}}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Exclusive Access Alert! 🚀</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div>
                <p className={styles.modal_content}>This section is exclusive for members with an active subscription. <a href="#"><b>Join us</b></a> now to enjoy all the benefits.</p>

              </div>
            </div>

          </div>
        </div>
      </div> */}
    </>
  );
};

export async function getServerSideProps(context) {
  createAxiosCookies(context);
  const subscriptionList = await getAllSubscriptions();
      const { lang } = getCookies(context);
    let lang_code = "en";
  
    try {
      const language = JSON.parse(lang)
  
      lang_code = String(language.code).toLowerCase()
    } catch (error) {
      lang_code = "en"
    }
  return {
    props: {
      subscriptionList: subscriptionList.subscriptions,
      publicHeader: false,
      publicFooter: false,
            ...(await serverSideTranslations(lang_code, [
                'common',
              ])),
    },
  };
}

export default ExploreOurPackages;
