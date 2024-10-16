import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createAxiosCookies } from "@/fn";
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

const getValidity = (months) => {
  let years = months/12;
  let month = months%12;

  return (years >= 1 && month) ? `${years} Years ${month} Months` : (years >= 0 && !month) ? `${years} Year` : `${month} Months`
}

const Subscription = ({ subscriptionList }) => {
  const { companyProfile } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const { request, response } = useRequest();

  const [modalContent, setModalContent] = useState({})
  const [isNew, setIsNew] = useState(true);
  const [subsPopup, setSubspopup] = useState(false);
  const handleWelcomeClose = () => {setSubspopup(false);setModalContent({})}
  const handleWelcomeShow = () => setSubspopup(true);

  const [subsDone, setSubsDone] = useState(false);
  const handleSubsDoneOpen = () => setSubsDone(true);
  const handleSubsDoneClose = () => setSubsDone(false);

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

  return (
    <>
      <EmployerAuth />
      <div className="page_container">
        <div className="main_content" id="body_lang_css">
          <div className="company_message">
            <div className="company_message_left">
              <h3 className="Dash_subTitle">Subscription</h3>
            </div>
          </div>

          <div className={styles.subscription_head}>
            <ul className={styles.subscription_tabs}>
              <li className={`${styles.subscription_tabs_items} ${(isNew) ? styles.active : {}}`} style={{cursor: "pointer"}}>
                <span onClick={() => setIsNew(true)} className={styles.nav_link}>New</span>
              </li>
              <li className={`${styles.subscription_tabs_items} ${(!isNew) ? styles.active : {}}`} style={{cursor: "pointer"}}>
                <span onClick={() => setIsNew(false)} className={styles.nav_link}>Expansion/Renewal – Save 10%</span>
              </li>
            </ul>
          </div>


            <div className={styles.dash_pricingCardBox}>
              <div className={styles.pricingCard}>
                <h3 className={styles.pricingHeading}>Select Your Plan</h3>
                <ul className={styles.plans_name_box}>
                  <li className={styles.plans_items}>Unlimited CVs/Candidates Search</li>
                  <li className={styles.plans_items}>Unlimited Job Posting</li>
                  <li className={styles.plans_items}>Unlimited Candidates' Invitation</li>
                  <li className={styles.plans_items}>Number of Unlocked Candidates</li>
                  <li className={styles.plans_items}>Access to Candidates' Profiles and CVs</li>
                  <li className={styles.plans_items}>Access to Screening Assessments’ Results</li>
                  <li className={styles.plans_items}>Access to Screening Questions' Insights</li>
                  <li className={styles.plans_items}>Validity Period</li>
                  <li className={styles.plans_items}>Premium Job Postings</li>
                  <li className={styles.plans_items}>Priority Support</li>
                  <li className={styles.plans_items}>Advanced Analytics</li>
                </ul>
              </div>
              <div className={styles.plans_box}>

                {
                  subscriptionList.map(d => {
                    let benis = d.benifiets ? JSON.parse(d.benifiets) : [];
                    return (
                      <div className={`${styles.plans_items_track} ${(d.is_recommanded) ? styles.active : {}}`}>

                        <div className={styles.recommended_box}>
                          {
                            (d.is_recommanded ? <span className={styles.recommended_title}>Recommended</span> : <></>)
                          }
                        </div>
                        <div className={styles.card_detail_box}>
                          <div className={styles.card_head}>
                            <h3 className={styles.paln_heading}>{d.title}</h3>
                            <div className={styles.price_box}>
                              {(d.save) ? <span className={styles.offer_label}>save {d.save}%</span> : ""}
                              <h4 className={styles.price_title}>{d.is_free ? "FREE" : (<>{d.price.toLocaleString()}<span className={styles.price_sub_title}> EGP</span></>)}</h4>

                              {
                                d.is_free ? (<button className={styles.price_btn} >Selected</button>) : (

                                  <button className={styles.price_btn} onClick={() => {handleWelcomeShow(); setModalContent(d) }} >Get started</button>  
                                )
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
                                    ( <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.74709 22L7.48213 21.5487C5.49475 18.1627 0.208374 10.9698 0.155055 10.8976L0 10.6868L1.98884 8.72215L7.67998 12.6961C11.2469 8.08631 14.5697 4.91375 16.7435 3.05449C19.1448 1.00041 20.6652 0.0812796 20.7285 0.0431514L20.8004 0H24.3045L23.7111 0.528529C16.2173 7.20313 8.08734 21.4026 8.00606 21.5452L7.74709 22Z" fill="#2CC64D" />
                                  </svg>
                                ) : ("-")
                              }
                            </li>
                            <li className={styles.plans_items}>
                              {
                                benis.includes("Access to Screening Assessments’ Results") ? 
                                    ( <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.74709 22L7.48213 21.5487C5.49475 18.1627 0.208374 10.9698 0.155055 10.8976L0 10.6868L1.98884 8.72215L7.67998 12.6961C11.2469 8.08631 14.5697 4.91375 16.7435 3.05449C19.1448 1.00041 20.6652 0.0812796 20.7285 0.0431514L20.8004 0H24.3045L23.7111 0.528529C16.2173 7.20313 8.08734 21.4026 8.00606 21.5452L7.74709 22Z" fill="#2CC64D" />
                                  </svg>
                                ) : ("-")
                              }
                            </li>
                            <li className={styles.plans_items}>
                              {
                                benis.includes("Access to Screening Questions' Insights") ? 
                                    ( <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                                    ( <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.74709 22L7.48213 21.5487C5.49475 18.1627 0.208374 10.9698 0.155055 10.8976L0 10.6868L1.98884 8.72215L7.67998 12.6961C11.2469 8.08631 14.5697 4.91375 16.7435 3.05449C19.1448 1.00041 20.6652 0.0812796 20.7285 0.0431514L20.8004 0H24.3045L23.7111 0.528529C16.2173 7.20313 8.08734 21.4026 8.00606 21.5452L7.74709 22Z" fill="#2CC64D" />
                                  </svg>
                                ) : ("-")
                              }
                            </li>
                            <li className={styles.plans_items}>
                              {
                                benis.includes("Priority Support") ? 
                                    ( <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.74709 22L7.48213 21.5487C5.49475 18.1627 0.208374 10.9698 0.155055 10.8976L0 10.6868L1.98884 8.72215L7.67998 12.6961C11.2469 8.08631 14.5697 4.91375 16.7435 3.05449C19.1448 1.00041 20.6652 0.0812796 20.7285 0.0431514L20.8004 0H24.3045L23.7111 0.528529C16.2173 7.20313 8.08734 21.4026 8.00606 21.5452L7.74709 22Z" fill="#2CC64D" />
                                  </svg>
                                ) : ("-")
                              }
                            </li>
                            <li className={styles.plans_items}>
                              {
                                benis.includes("Advanced Analytics") ? 
                                    ( <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                      <h3 className={styles.paln_heading}>Customized</h3>
                      <div className={styles.price_box}>
                        <h4 className={styles.price_title}>Variable Pricing </h4>
                        <a href="#" className={styles.price_btn}>Get started</a>
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
                        <span>Customizable</span>
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
                        <span>Customizable</span>
                      </li>
                      <li className={styles.plans_items}>
                        <span>Available as an Add-on</span>
                      </li>
                      <li className={styles.plans_items}>
                        <span>Available as an Add-on</span>
                      </li>
                      <li className={styles.plans_items}>
                        <span>Available as an Add-on</span>
                      </li>



                    </ul>
                  </div>
                </div>
              </div>
            </div>

          {
            !isNew && 
            <div className={styles.dash_pricingCardBox}>
            <div className={styles.pricingCard}>
              <h3 className={styles.pricingHeading}>Select Your Plan</h3>
              <ul className={styles.plans_name_box}>
                <li className={styles.plans_items}>Unlimited CVs/Candidates Search</li>
                <li className={styles.plans_items}>Unlimited Job Posting</li>
                <li className={styles.plans_items}>Unlimited Candidates' Invitation</li>
                <li className={styles.plans_items}>Number of Unlocked Candidates</li>
                <li className={styles.plans_items}>Access to Candidates' Profiles and CVs</li>
                <li className={styles.plans_items}>Access to Screening Assessments’ Results</li>
                <li className={styles.plans_items}>Access to Screening Questions' Insights</li>
                <li className={styles.plans_items}>Validity Period</li>
                <li className={styles.plans_items}>Premium Job Postings</li>
                <li className={styles.plans_items}>Priority Support</li>
                <li className={styles.plans_items}>Advanced Analytics</li>
              </ul>
            </div>
            <div className={styles.plans_box}>

              {
                subscriptionList.filter(f => f.is_free != 1).map(d => {
                  let benis = d.benifiets ? JSON.parse(d.benifiets) : [];
                  return (
                    <div className={`${styles.plans_items_track} ${(d.is_recommanded) ? styles.active : {}}`}>

                      <div className={styles.recommended_box}>
                        {
                          (d.is_recommanded ? <span className={styles.recommended_title}>Recommended</span> : <></>)
                        }
                      </div>
                      <div className={styles.card_detail_box}>
                        <div className={styles.card_head}>
                          <h3 className={styles.paln_heading}>{d.title}</h3>
                          <div className={styles.price_box}>
                            {(d.save) ? <span className={styles.offer_label}>save {d.save}%</span> : ""}
                            <h4 className={styles.price_title}>{d.is_free ? "FREE" : (<>{(d.price - ((d.price * 10)/100)).toLocaleString()}<span className={styles.price_sub_title}> EGP</span></>)}</h4>

                            {
                              d.is_free ? (<button className={styles.price_btn} >Selected</button>) : (

                                <button className={styles.price_btn} onClick={() => {handleWelcomeShow(); setModalContent(d) }} >Get started</button>  
                              )
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
                                  ( <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M7.74709 22L7.48213 21.5487C5.49475 18.1627 0.208374 10.9698 0.155055 10.8976L0 10.6868L1.98884 8.72215L7.67998 12.6961C11.2469 8.08631 14.5697 4.91375 16.7435 3.05449C19.1448 1.00041 20.6652 0.0812796 20.7285 0.0431514L20.8004 0H24.3045L23.7111 0.528529C16.2173 7.20313 8.08734 21.4026 8.00606 21.5452L7.74709 22Z" fill="#2CC64D" />
                                </svg>
                              ) : ("-")
                            }
                          </li>
                          <li className={styles.plans_items}>
                            {
                              benis.includes("Access to Screening Assessments’ Results") ? 
                                  ( <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M7.74709 22L7.48213 21.5487C5.49475 18.1627 0.208374 10.9698 0.155055 10.8976L0 10.6868L1.98884 8.72215L7.67998 12.6961C11.2469 8.08631 14.5697 4.91375 16.7435 3.05449C19.1448 1.00041 20.6652 0.0812796 20.7285 0.0431514L20.8004 0H24.3045L23.7111 0.528529C16.2173 7.20313 8.08734 21.4026 8.00606 21.5452L7.74709 22Z" fill="#2CC64D" />
                                </svg>
                              ) : ("-")
                            }
                          </li>
                          <li className={styles.plans_items}>
                            {
                              benis.includes("Access to Screening Questions' Insights") ? 
                                  ( <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                                  ( <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M7.74709 22L7.48213 21.5487C5.49475 18.1627 0.208374 10.9698 0.155055 10.8976L0 10.6868L1.98884 8.72215L7.67998 12.6961C11.2469 8.08631 14.5697 4.91375 16.7435 3.05449C19.1448 1.00041 20.6652 0.0812796 20.7285 0.0431514L20.8004 0H24.3045L23.7111 0.528529C16.2173 7.20313 8.08734 21.4026 8.00606 21.5452L7.74709 22Z" fill="#2CC64D" />
                                </svg>
                              ) : ("-")
                            }
                          </li>
                          <li className={styles.plans_items}>
                            {
                              benis.includes("Priority Support") ? 
                                  ( <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M7.74709 22L7.48213 21.5487C5.49475 18.1627 0.208374 10.9698 0.155055 10.8976L0 10.6868L1.98884 8.72215L7.67998 12.6961C11.2469 8.08631 14.5697 4.91375 16.7435 3.05449C19.1448 1.00041 20.6652 0.0812796 20.7285 0.0431514L20.8004 0H24.3045L23.7111 0.528529C16.2173 7.20313 8.08734 21.4026 8.00606 21.5452L7.74709 22Z" fill="#2CC64D" />
                                </svg>
                              ) : ("-")
                            }
                          </li>
                          <li className={styles.plans_items}>
                            {
                              benis.includes("Advanced Analytics") ? 
                                  ( <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                    <h3 className={styles.paln_heading}>Customized</h3>
                    <div className={styles.price_box}>
                      <h4 className={styles.price_title}>Variable Pricing </h4>
                      <a href="#" className={styles.price_btn}>Get started</a>
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
                      <span>Customizable</span>
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
                      <span>Customizable</span>
                    </li>
                    <li className={styles.plans_items}>
                      <span>Available as an Add-on</span>
                    </li>
                    <li className={styles.plans_items}>
                      <span>Available as an Add-on</span>
                    </li>
                    <li className={styles.plans_items}>
                      <span>Available as an Add-on</span>
                    </li>



                  </ul>
                </div>
              </div>
            </div>
            </div>
          }
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
              <div className={styles.modal_content} style={{textAlign: "left"}}>
                  <h5>
                      <ol>
                       {modalContent.description?.split("\n").map((d,i) => (
                        <li>{(i > 0) ? <svg xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" viewBox="0 0 32 32" data-name="01-Arrow-direction-pointer" id="_01-Arrow-direction-pointer"><title/><polygon points="4 1 28 16 4 31 14 16 4 1" style={{"fill":"none","stroke":"#000000","strokeLinecap":"round","strokeLinejoin":"round","strokeWidth":"2px"}}/></svg> : ""} <span style={(i > 0) ? {fontSize: "15px"} : {paddingBottom: "20px"}}>{d}</span> </li>
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
        size="md"
        centered
      >
          <Modal.Header closeButton style={{borderBottom: "none"}}>
          </Modal.Header>
          <Modal.Body>
            <div className="modal_inner">
              <div className="icon_block">
                <img src="/img/icon.png" alt="" />
              </div>

              <h2>Congratulations!</h2>
              <h3>You have successfully subscribed.</h3>
            </div>
          </Modal.Body>
      </Modal>
    </>
  );
};

export async function getServerSideProps(context) {
  createAxiosCookies(context);
  const subscriptionList = await getAllSubscriptions();
  return {
    props: {
      subscriptionList: subscriptionList.subscriptions,
      publicHeader: false,
      publicFooter: false,
    },
  };
}

export default Subscription;
