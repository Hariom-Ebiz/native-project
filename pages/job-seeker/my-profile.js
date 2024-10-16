import React, { useEffect, useState } from "react";
import styles from "@/styles/myprofile.module.css";
import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import { createAxiosCookies, getCookies } from "@/fn";

import { getAssessmentResult } from "@/services/other";
import { useDispatch } from "react-redux";
import { setModal } from "@/store/siteSlice";
import MakeStringShort from "@/components/common/MakeStringShort";
import MakeListShort from "@/components/common/MakeListShort";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { useRouter } from "next/router";
import Link from "next/link";
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

import useRequest from "@/hooks/useRequest";
import moment from "moment";
import { API } from "@/api";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'


const MyProfile = ({
  carrerValues,
  careerInterests,
  personalityType,
  motivatedSkills,
  lifePurpose,
}) => {
  const { t } = useTranslation('common');
  const width = screen.width;
  const router = useRouter();
  let { asPath,query } = router;
  const [backId, setBackId] = useState();
  const [aptitudeList, setAptitudeList] = useState([])
  const [certificateList, setCertificateList] = useState([])

  const { request: requestAllAptitudes, response: responseAllAptitudes } = useRequest()
  const { request: requestAllCertificates, response: responseAllCertificates } = useRequest()

  useEffect(() => {
    requestAllAptitudes("get", "aptitude/user/aptitudes")
    requestAllCertificates("get", "user/certificates")

    let id;
    if (asPath) {
      id = asPath.split("=")?.[1];
      if (id) {
        setBackId(+id);
      }
    }
    if (router.asPath == `/job-seeker/my-profile#careerInterests?id=${id}`) {
      if (width > 550) {
        router.replace("/job-seeker/my-profile#carrerinterestisdesktop");
      } else {
        router.replace("/job-seeker/my-profile#carrerinterestismobile");
      }
    }
    if (router.asPath == `/job-seeker/my-profile#lifePurpose?id=${id}`) {
      if (width > 550) {
        router.replace("/job-seeker/my-profile#lifePurposeisdesktop");
      } else {
        router.replace("/job-seeker/my-profile#lifePurposeismobile");
      }
    }
    if (router.asPath == `/job-seeker/my-profile#motivatedSkills?id=${id}`) {
      router.replace("/job-seeker/my-profile#motivatedSkills");
    }
    if (router.asPath == `/job-seeker/my-profile#personalityType?id=${id}`) {
      router.replace("/job-seeker/my-profile#personalityType");
    }
  }, []);


  useEffect(() => {
    if (responseAllCertificates) {
      const { certificates } = responseAllCertificates;
      setCertificateList(certificates);

      if(query.scrollTill == "aptitudeAnalysis"){
        setTimeout(()=> {
          window.scrollTo(0, document.body.scrollHeight);
        },100)
      }
    }
  }, [responseAllCertificates])

  useEffect(() => {
    if (responseAllAptitudes) {
      const { list, status, message, totalDocuments } = responseAllAptitudes;
      setAptitudeList(list);
    }
  }, [responseAllAptitudes])

  const dispatch = useDispatch();

  const personalityTypeReadmoreHandler = () => {
    dispatch(
      setModal(
        <div className="modal_inner">
          <div className="icon_block">
            <img src="/img/assessment-img.png" alt="" />
          </div>
          <h3>{personalityType.title} Personality Type</h3>
          <div className={styles.value_top_listing}>
            <div className="text-start">
              {personalityType.description &&
                JSON.parse(personalityType.description).map((val, i) => {
                  return <p key={i}>{val}</p>;
                })}
            </div>
          </div>
        </div>
      )
    );
  };
  const lifePurposeReadmoreHandler = () => {
    dispatch(
      setModal(
        <div className="modal_inner">
          <div className="icon_block">
            <img src="/img/assessment-img.png" alt="" />
          </div>
          <h3>My Life Purpose</h3>
          <div className={styles.value_top_listing}>
            <div className="text-start">
              <p>{lifePurpose}</p>
            </div>
          </div>
        </div>
      )
    );
  };

  const popHandler = () => {
    dispatch(
      setModal(
        <>
          <div className="modal_inner">
            <h3>“Stay Tuned, Coming Soon”</h3>
          </div>
        </>
      )
    );
  };

  return (
    <JobSeekerAuth data={{ title: "My Profile" }}>
      <div className="page_container">
        {backId != "" && backId != undefined && (
          <Link
            href={`/course/lesson/${backId}`}
            className="btn-primary backFixedBtn"
          >
            <svg
              width="8"
              height="14"
              viewBox="0 0 8 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.293 7.707C0.105529 7.51947 0.000213623 7.26516 0.000213623 7C0.000213623 6.73484 0.105529 6.48053 0.293 6.293L5.95 0.636C6.04225 0.54049 6.15259 0.464307 6.2746 0.411898C6.3966 0.359489 6.52782 0.331903 6.6606 0.330749C6.79338 0.329595 6.92506 0.354897 7.04795 0.405178C7.17085 0.455459 7.2825 0.529712 7.3764 0.623605C7.47029 0.717498 7.54454 0.829149 7.59482 0.952046C7.6451 1.07494 7.6704 1.20662 7.66925 1.3394C7.6681 1.47218 7.64051 1.6034 7.5881 1.7254C7.53569 1.84741 7.45951 1.95775 7.364 2.05L2.414 7L7.364 11.95C7.54616 12.1386 7.64695 12.3912 7.64467 12.6534C7.6424 12.9156 7.53723 13.1664 7.35182 13.3518C7.16641 13.5372 6.9156 13.6424 6.6534 13.6447C6.3912 13.647 6.1386 13.5462 5.95 13.364L0.293 7.707Z"
                fill="white"
              />
            </svg>
            Back to Journey
          </Link>
        )}
        <div className={`main_content ${backId && "journey-content"} main_bg`} id="body_lang_css">
          <div className={styles.dash_page_heading}>
            <h1>Career Identity</h1>
          </div>
          <div
            id="carrervalues"
            style={{ position: "relative", top: "-100px" }}
          ></div>
          <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-6">
              {carrerValues.length > 0 && (
                <div
                  className={`${styles.dash_card} ${styles.dash_card_blue} pb-0`}
                >
                  <h3 className={`${styles.card_heading} ${styles.text_white}`}>
                    My Top 5 Values
                  </h3>
                  <div className={styles.rank_img_box}>
                    <img src="../../img/identity.png" alt="" />
                  </div>
                  <div className={styles.value_top_listing}>
                    <ul>
                      {carrerValues.map((obj, idx) => (
                        <li key={obj.id}>
                          <div className={styles.value_name}>
                            <div style={{color: "#fff"}}>
                              <span style={{color: "#fff"}}>{idx + 1}.</span>
                              {obj.value}
                            </div>

                            <div>
                              {
                                obj?.description && <OverlayTrigger
                                  delay={{ hide: 450, show: 300 }}
                                  overlay={(props) => (
                                    <Tooltip {...props}>
                                      {obj?.description}
                                    </Tooltip>
                                  )}
                                  placement="top"
                                >
                                  <Button className={styles.info_icon}>
                                    {" "}
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      class="bi bi-info-circle"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                    </svg>
                                  </Button>
                                </OverlayTrigger>
                              }

                            </div>
                          </div>
                          <div className={styles.value_img_box}>
                            {idx < 5 && (
                              <img src={`/img/value${idx + 1}.png`} alt="" />
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              <div
                style={{ position: "relative", top: "-100px" }}
                id="carrerinterestismobile"
              ></div>
              {careerInterests.length > 0 && (
                <div
                  className={`${styles.dash_card} ${styles.dash_card_white} ${styles.mobile_block} ${styles.card_topspace} mb-3`}
                >
                  <h3 className={`${styles.card_heading} ${styles.text_blue}`}>
                    My Interest Profile
                  </h3>

                  <div className={styles.value_top_listing}>
                    <ul>
                      {careerInterests.map((obj, idx) => (
                        <li key={obj.id}>
                          <div className={styles.value_name}>
                            <span>{idx + 1}.</span>
                            {obj.title}
                          </div>
                          <div className={styles.value_img_box}>
                            <img src={`/img/value${idx + 1}.png`} alt="" />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div
                id="motivatedSkills"
                style={{ position: "relative", top: "-80px" }}
              ></div>
              {motivatedSkills.length > 0 && (
                <div
                  className={`${styles.dash_card} ${styles.dash_card_white} ${styles.card_topspace} ${styles.mobile_top_space} pb-0`}
                >
                  <h3 className={`${styles.card_heading} ${styles.text_blue}`}>
                    My Top 5 Motivated Skills
                  </h3>

                  <div className={styles.value_top_listing}>
                    <ul>
                      {motivatedSkills.map((obj, idx) => (
                        <li key={obj.id}>
                          <div className={styles.value_name}>
                            <div>
                              <span>{idx + 1}.</span>
                              {obj.skill}
                            </div>
                            <div>
                              {obj?.description && <OverlayTrigger
                                delay={{ hide: 450, show: 300 }}
                                overlay={(props) => (
                                  <Tooltip {...props}>
                                    {obj?.description}
                                  </Tooltip>
                                )}
                                placement="top"
                              >
                                <Button className={styles.info_icon}>
                                  {" "}
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    class="bi bi-info-circle"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                  </svg>
                                </Button>
                              </OverlayTrigger>}

                            </div>
                          </div>
                          <div className={styles.value_img_box}>
                            {idx < 5 && (
                              <img src={`/img/value${idx + 1}.png`} alt="" />
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              <div
                style={{ position: "relative", top: "-80px" }}
                id="lifePurposeisdesktop"
              ></div>
              <div
                className={`${styles.dash_card} ${styles.dash_card_red} ${styles.card_topspace_right} ${styles.mobile_none}`}
              >
                <h3 className={`${styles.card_heading} ${styles.text_white}`}>
                  My Life Purpose
                </h3>
                <p style={{color: "#fff"}}>
                  {lifePurpose ? (
                    <div
                      style={{color: "#fff"}}
                      dangerouslySetInnerHTML={{
                        __html: lifePurpose.split(".").join(""),
                      }}
                    />
                  ) : (
                    <>&nbsp;</>
                  )}
                </p>
                <img
                  className={styles.quote_img}
                  src="../../img/left-quote.png"
                  alt=""
                />
              </div>
            </div>

            <div className="col-sm-12 col-md-6 col-lg-6">
              <div
                style={{ position: "relative", top: "-100px" }}
                id="carrerinterestismobile"
              ></div>
              
                <div
                  className={`${styles.dash_card} ${styles.dash_card_white} ${styles.mobile_none} mb-3`}
                >
                  <h3 className={`${styles.card_heading} ${styles.text_blue}`}>
                    My Interest Profile
                  </h3>

                  <div className={styles.value_top_listing}>
                    <ul>
                      {(careerInterests.length > 0 ? careerInterests : ['','','']).map((obj, idx) => (
                        <li key={obj.id}>
                          <div className={styles.value_name}>
                            <span>{idx + 1}.</span>
                            {obj.title}
                          </div>
                          <div className={styles.value_img_box}>
                            <img src={`/img/value${idx + 1}.png`} alt="" />
                          </div>
                        </li>
                      ))}

                    </ul>
                  </div>
                </div>
              
              <div className={styles.box_block}>
                <div
                  style={{ position: "relative", top: "-80px" }}
                  id="personalityType"
                ></div>
                {personalityType && (
                  <div
                    className={`${styles.dash_card} ${styles.dash_card_blu_sky} ${styles.card_topspace_right} mt-0`}
                  >
                    <div className={styles.top_bar_box}>
                      <h3
                        className={`${styles.card_heading} ${styles.text_blue}`}
                      >
                        My Personality Type is
                        <span
                          className={`${styles.value_name_second} ${styles.text_style}`}
                        >
                          {/* <span>1.</span> */}
                          {'"' +
                            personalityType.title.split("~")[0].trim() +
                            '"' || <>&nbsp;</>}
                        </span>
                      </h3>
                      <OverlayTrigger
                        delay={{ hide: 450, show: 300 }}
                        overlay={(props) => (
                          <Tooltip {...props}>
                            {"" + personalityType.title + "" || <>&nbsp;</>}
                          </Tooltip>
                        )}
                        placement="top"
                      >
                        <Button
                          className={`${styles.info_icon} ${styles.other_icon_info}`}
                        >
                          {" "}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-info-circle"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                          </svg>
                        </Button>
                      </OverlayTrigger>
                    </div>

                    <div className={styles.value_top_listing}>
                      {/* <ul>
                        <li> */}

                      {/* <div className={styles.value_img_box}>
                          <img src="../../img/value1.png" alt="" />
                        </div> */}
                      {/* </li>
                      </ul> */}
                      <div className={styles.dis_block}>
                        <ol>
                          <MakeListShort
                            content={JSON.parse(personalityType.description)}
                            moreHandler={personalityTypeReadmoreHandler}
                            btnColor="#161d46"
                          />
                        </ol>

                        {/* {JSON.parse(personalityType.description)} */}
                        {/* Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a
                      type specimen book. It has survived not only five
                      centuries, but also the leap into electronic typesetting,
                      remaining essentially unchanged. */}
                      </div>
                    </div>
                  </div>
                )}

                {/* <div
                  style={{ position: "relative", top: "-80px" }}
                  id="lifePurpose"
                ></div>
                <div
                  className={`${styles.dash_card} ${styles.dash_card_red} ${styles.card_topspace_right}`}
                >
                  <h3 className={`${styles.card_heading} ${styles.text_white}`}>
                    My Life Purpose
                  </h3>
                  <p>
                      I’m a product designer + filmmaker currently working
                      remotel -y at Twitter from beautiful Manchester, United
                      Kingdom. I’m passionate about designing digital products
                      that have a positive impact on the world. I’m a product
                      designer + filmmaker currently I’m passionate about
                      designing digital products that have .
                    </p>
                  <p>
                    {lifePurpose ? (
                      <div
                      dangerouslySetInnerHTML={{__html: lifePurpose.replaceAll(".","")}}
                    />
                       
                    
                    ) : (
                      <>&nbsp;</>
                    )}
                  </p>
                    <MakeStringShort
                        content={lifePurpose.replaceAll(".","")}
                        moreHandler={lifePurposeReadmoreHandler}
                        btnColor="#C2E4EF"
                      /> 
                  <img
                    className={styles.quote_img}
                    src="../../img/left-quote.png"
                    alt=""
                  />
                </div> */}
              </div>
              <div
                style={{ position: "relative", top: "-80px" }}
                id="lifePurposeismobile"
              ></div>
              <div
                className={`${styles.dash_card} ${styles.dash_card_red} ${styles.card_topspace_right} ${styles.mobile_block}`}
              >
                <h3 className={`${styles.card_heading} ${styles.text_white}`}>
                  My Life Purpose
                </h3>
                {/* <p>
                      I’m a product designer + filmmaker currently working
                      remotel -y at Twitter from beautiful Manchester, United
                      Kingdom. I’m passionate about designing digital products
                      that have a positive impact on the world. I’m a product
                      designer + filmmaker currently I’m passionate about
                      designing digital products that have .
                    </p> */}
                <p style={{color: "#fff"}}>
                  {lifePurpose ? (
                    <div
                      style={{color: "#fff"}}
                      dangerouslySetInnerHTML={{
                        // __html: lifePurpose.replaceAll(".", ""),
                        __html: lifePurpose.split(".").join(""),
                      }}
                    />
                  ) : (
                    <>&nbsp;</>
                  )}
                </p>
                {/* <MakeStringShort
                        content={lifePurpose.replaceAll(".","")}
                        moreHandler={lifePurposeReadmoreHandler}
                        btnColor="#C2E4EF"
                      />  */}
                <img
                  className={styles.quote_img}
                  src="../../img/left-quote.png"
                  alt=""
                />
              </div>
              {/* {backId != "" && backId != undefined && (
                <Link
                  href={`/course/lesson/${backId}`}
                  className="btn-primary backFixedBtn"
                >
                  Back to Journey
                </Link>
              )} */}
            </div>
          </div>
          <div className={`${styles.top_btn} ${styles.mobile_space}`}>
            <h1
              className={`mb-0 ${styles.page_heading} ${styles.top_bottom_space} `}
            >
              Certification Awards
            </h1>
          </div>
          <div className="row">
            {Array.isArray(certificateList) && certificateList?.map(cert => {
              return <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4 mb-4" key={cert.id}>
                <div className={styles.course_crad}>
                  <div className={styles.styles}>
                    <img src="https://ns.native-career.com/uploads/images/course/Introduction.png" />
                  </div>
                  <div className={styles.main_block}>
                    <div className={styles.course_detais}>
                      <div style={{ width: "80%" }}>
                        <h3 className={styles.card_title}>{cert.title}</h3>
                        <p className={styles.status_title}>
                          Completed  Date  : &nbsp;<span>{moment(cert.created_at).format("DD-MM-YYYY")}</span>
                        </p>
                      </div>
                      <div className={styles.download_certificate}>
                        <div class="dropdown">
                          <button class="btn  dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8.75 4.6875C8.75 4.44027 8.82331 4.1986 8.96066 3.99304C9.09802 3.78748 9.29324 3.62726 9.52165 3.53265C9.75005 3.43804 10.0014 3.41329 10.2439 3.46152C10.4863 3.50975 10.7091 3.6288 10.8839 3.80362C11.0587 3.97843 11.1778 4.20116 11.226 4.44364C11.2742 4.68611 11.2495 4.93745 11.1549 5.16585C11.0602 5.39426 10.9 5.58949 10.6945 5.72684C10.4889 5.86419 10.2472 5.9375 10 5.9375C9.66848 5.9375 9.35054 5.8058 9.11612 5.57138C8.8817 5.33696 8.75 5.01902 8.75 4.6875ZM10 8.75C9.75277 8.75 9.5111 8.82331 9.30554 8.96066C9.09998 9.09802 8.93976 9.29324 8.84515 9.52165C8.75054 9.75005 8.72579 10.0014 8.77402 10.2439C8.82225 10.4863 8.9413 10.7091 9.11612 10.8839C9.29093 11.0587 9.51366 11.1778 9.75614 11.226C9.99861 11.2742 10.2499 11.2495 10.4784 11.1549C10.7068 11.0602 10.902 10.9 11.0393 10.6945C11.1767 10.4889 11.25 10.2472 11.25 10C11.25 9.66848 11.1183 9.35054 10.8839 9.11612C10.6495 8.8817 10.3315 8.75 10 8.75ZM10 14.0625C9.75277 14.0625 9.5111 14.1358 9.30554 14.2732C9.09998 14.4105 8.93976 14.6057 8.84515 14.8341C8.75054 15.0626 8.72579 15.3139 8.77402 15.5564C8.82225 15.7988 8.9413 16.0216 9.11612 16.1964C9.29093 16.3712 9.51366 16.4903 9.75614 16.5385C9.99861 16.5867 10.2499 16.562 10.4784 16.4674C10.7068 16.3727 10.902 16.2125 11.0393 16.007C11.1767 15.8014 11.25 15.5597 11.25 15.3125C11.25 14.981 11.1183 14.663 10.8839 14.4286C10.6495 14.1942 10.3315 14.0625 10 14.0625Z" fill="#161D46" />
                            </svg>

                          </button>
                          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li><Link class="dropdown-item" href={API + "/" + cert.path} target="__blank">View</Link></li>
                            <li><Link class="dropdown-item" href={API + "/" + cert.path} target="__blank" download={true}>Download</Link></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            })}
            {Array.isArray(certificateList) && certificateList.length == 0 && <p>No Certificates</p>}
          </div>
          <div id="aptitudeAnalysis">
            <div className={styles.top_btn}>
              <h1 className={` mb-0 ${styles.page_heading} ${styles.aptitude_section}`}>
                Aptitude Analysis
              </h1>
            </div>
            <div className={styles.manage_job_table_box}>
              {/* <h3 className={styles.table_heading}>Aptitude Analysis</h3> */}
              <div className={`table-responsive ${styles.data_table}`}>
                <table className={`table mb-0 ${styles.table_min_height}`}>
                  <thead>
                    <tr>
                      <th className="text-center">Section</th>
                      <th className="text-center">Completion Date</th>
                      <th className="text-center">Score</th>
                      <th className="text-center">Next Possible Trial Date</th>
                    </tr>
                  </thead>
                  <tbody className={styles.post_job_tbody}>
                    {aptitudeList.map(aptitude => {
                      console.log("aptitude", aptitude)
                      return <tr>
                        <td className="text-center">{aptitude.name}</td>
                        <td className="text-center">{moment(aptitude.created_at).format("DD MMM YYYY")}</td>
                        <td className="text-center">{Math.round((aptitude.right_questions / (aptitude.total_questions || 1)) * 100)}%</td>
                        <td className="text-center">{moment(aptitude.created_at).add(6, 'M').format("DD MMM YYYY")}</td>
                      </tr>
                    })}
                    {aptitudeList.length == 0 && <p className="mt-4" style={{ paddingLeft: "24px" }}>No Data to Show.</p>}
                  </tbody>
                </table>
              </div>
            </div>

          </div>




        </div>
      </div>
    </JobSeekerAuth>
  );
};

export async function getServerSideProps(context) {
  createAxiosCookies(context);
  const { lang } = getCookies(context);
  let lang_code = "en";

  try {
    const language = JSON.parse(lang)
    lang_code = String(language.code).toLowerCase()
  } catch (error) {
    lang_code = "en"
  }


  const {
    query: { id },
    params,
  } = context;
  const result = await getAssessmentResult();

  return {
    props: {
      isProtected: true,
      roles: [1],
      ...result,
      // id,
      ...(await serverSideTranslations(lang_code, [
        'common',
      ])),
    },
  };
}

export default MyProfile;
