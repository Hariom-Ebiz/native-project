import React,{useEffect} from "react";
import styles from "@/styles/myprofile.module.css";
import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import { createAxiosCookies } from "@/fn";

import { getAssessmentResult } from "@/services/other";
import { useDispatch } from "react-redux";
import { setModal } from "@/store/siteSlice";
import MakeStringShort from "@/components/common/MakeStringShort";
import MakeListShort from "@/components/common/MakeListShort";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { useRouter } from "next/router";

const MyProfile = ({
  carrerValues,
  careerInterests,
  personalityType,
  motivatedSkills,
  lifePurpose,
}) => {

    const width = screen.width;
    const router = useRouter();


    useEffect(()=>{
        if(router.asPath == "/job-seeker/my-profile#careerInterests"){
          if(width > 550){
            router.replace("/job-seeker/my-profile#carrerinterestisdesktop")
        }else{
          router.replace("/job-seeker/my-profile#carrerinterestismobile")
        }
        }
        if(router.asPath == "/job-seeker/my-profile#lifePurpose"){
            if(width > 550){
              router.replace("/job-seeker/my-profile#lifePurposeisdesktop")
          }else{
            router.replace("/job-seeker/my-profile#lifePurposeismobile")
          }
          }
        
      },[])

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
            {/* <div className="icon_block">
              <img src="/img/error.png" alt="" />
            </div> */}
            <h3>“Stay Tuned, Coming Soon”</h3>
          </div>
        </>
      )
    );
  }

  return (
    <JobSeekerAuth data={{ title: "My Profile" }}>
      <div className="page_container">
        <div className="main_content main_bg" id="body_lang_css">
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
                              <OverlayTrigger
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
                            </div>
                          </div>
                          <div className={styles.value_img_box}>
                            {idx < 3 && (
                              <img src={`/img/value${idx + 1}.png`} alt="" />
                            )}
                          </div>
                        </li>
                      ))}
                      {/* <li>
                        <div className={styles.value_name}>
                          <span>1.</span>
                          Value 1
                        </div>
                        <div className={styles.value_img_box}>
                          <img src="../../img/value1.png" alt="" />
                        </div>
                      </li>
                      <li>
                        <div className={styles.value_name}>
                          <span>2.</span>
                          Value 2
                        </div>
                        <div className={styles.value_img_box}>
                          <img src="../../img/value2.png" alt="" />
                        </div>
                      </li>
                      <li>
                        <div className={styles.value_name}>
                          <span>3.</span>
                          Value 3
                        </div>
                        <div className={styles.value_img_box}>
                          <img src="../../img/value3.png" alt="" />
                        </div>
                      </li>
                      <li>
                        <div className={styles.value_name}>
                          <span>4.</span>
                          Value 4
                        </div>
                        <div className={styles.value_img_box}></div>
                      </li>
                      <li>
                        <div className={styles.value_name}>
                          <span>5.</span>
                          Value 5
                        </div>
                        <div className={styles.value_img_box}></div>
                      </li> */}
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
                  className={`${styles.dash_card} ${styles.dash_card_white} ${styles.mobile_block} ${styles.card_topspace}`}
                >
                  <h3 className={`${styles.card_heading} ${styles.text_blue}`}>
                    {/* My Top {careerInterests.length}{" "}
                    {careerInterests.length > 1 ? "Interests" : "Interest"} */}
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
                      {/* <li>
                      <div className={styles.value_name}>
                        <span>1.</span>
                        Interest Name
                      </div>
                      <div className={styles.value_img_box}>
                        <img src="../../img/value1.png" alt="" />
                      </div>
                    </li>
                    <li>
                      <div className={styles.value_name}>
                        <span>2.</span>
                        Interest Name
                      </div>
                      <div className={styles.value_img_box}>
                        <img src="../../img/value2.png" alt="" />
                      </div>
                    </li>
                    <li>
                      <div className={styles.value_name}>
                        <span>3.</span>
                        Interest Name
                      </div>
                      <div className={styles.value_img_box}>
                        <img src="../../img/value3.png" alt="" />
                      </div>
                    </li>
                    <li>
                      <div className={styles.value_name}>
                        <span>4.</span>
                        Interest Name
                      </div>
                      <div className={styles.value_img_box}></div>
                    </li>
                    <li>
                      <div className={styles.value_name}>
                        <span>5.</span>
                        Interest Name
                      </div>
                      <div className={styles.value_img_box}></div>
                    </li> */}
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
                              <OverlayTrigger
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
                            </div>
                          </div>
                          <div className={styles.value_img_box}>
                            {idx < 3 && (
                              <img src={`/img/value${idx + 1}.png`} alt="" />
                            )}
                          </div>
                        </li>
                      ))}
                      {/* <li>
                      <div className={styles.value_name}>
                        <span>1.</span>
                        Value 1
                      </div>
                      <div className={styles.value_img_box}>
                        <img src="../../img/value1.png" alt="" />
                      </div>
                    </li>
                    <li>
                      <div className={styles.value_name}>
                        <span>2.</span>
                        Value 2
                      </div>
                      <div className={styles.value_img_box}>
                        <img src="../../img/value2.png" alt="" />
                      </div>
                    </li>
                    <li>
                      <div className={styles.value_name}>
                        <span>3.</span>
                        Value 3
                      </div>
                      <div className={styles.value_img_box}>
                        <img src="../../img/value3.png" alt="" />
                      </div>
                    </li>
                    <li>
                      <div className={styles.value_name}>
                        <span>4.</span>
                        Value 4
                      </div>
                      <div className={styles.value_img_box}></div>
                    </li>
                    <li>
                      <div className={styles.value_name}>
                        <span>5.</span>
                        Value 5
                      </div>
                      <div className={styles.value_img_box}></div>
                    </li> */}
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
                {/* <p>
                      I’m a product designer + filmmaker currently working
                      remotel -y at Twitter from beautiful Manchester, United
                      Kingdom. I’m passionate about designing digital products
                      that have a positive impact on the world. I’m a product
                      designer + filmmaker currently I’m passionate about
                      designing digital products that have .
                    </p> */}
                <p>
                  {lifePurpose ? (
                    <div
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
            </div>

            <div className="col-sm-12 col-md-6 col-lg-6">
              <div
                style={{ position: "relative", top: "-100px" }}
                id="carrerinterestismobile"
              ></div>
              {careerInterests.length > 0 && (
                <div
                  className={`${styles.dash_card} ${styles.dash_card_white} ${styles.mobile_none}`}
                >
                  <h3 className={`${styles.card_heading} ${styles.text_blue}`}>
                    {/* My Top {careerInterests.length}{" "}
                    {careerInterests.length > 1 ? "Interests" : "Interest"} */}
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
              <div className={styles.box_block}>
                <div
                  style={{ position: "relative", top: "-80px" }}
                  id="personalityType"
                ></div>
                {personalityType && (
                  <div
                    className={`${styles.dash_card} ${styles.dash_card_blu_sky} ${styles.card_topspace_right} `}
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
                          {'"' + personalityType.title.split("~")[0].trim()+'"'||<>&nbsp;</>}
                        </span>
                      </h3>
                      <OverlayTrigger
                                delay={{ hide: 450, show: 300 }}
                                overlay={(props) => (
                                  <Tooltip {...props}>
                                   {'' + personalityType.title + '' || <>&nbsp;</>}
                                  </Tooltip>
                                )}
                                placement="top"
                              >
                                <Button className={`${styles.info_icon} ${styles.other_icon_info}`}>
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
                <p>
                  {lifePurpose ? (
                    <div
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
            </div>
          </div>
          <div className={`${styles.toprowspace} row`}>
            <div className="col-sm-12 col-md-12">
              <div className={styles.dash_page_heading}>
                 <h2>Aptitude Assesment</h2> 
              </div>
              <div className={` ${styles.tebal_box} position-relative`}>
               <div className="table_overlay">
                   <h3>“Stay Tuned, Coming Soon”</h3>
               </div>
                <div className="table-responsive">
                  <table
                    className={`${styles.table} ${styles.table_border_spacing} table`}
                  >
                    <thead className={styles.tbl_head}>
                      <tr>
                        <th>Name</th>
                        <th>Pass Date</th>
                        <th>Result</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody className={styles.tbody_space}>
                      <tr className={styles.first_row} onClick={popHandler} style={{cursor:"pointer"}}>
                        <td>
                          <span className={styles.name_label} >
                            IQ Test Name 1
                          </span>
                        </td>
                        <td>
                          {" "}
                          <span className={styles.date_label}>
                            24 July 2023
                          </span>
                        </td>
                        <td>
                          <span className={styles.point_label}>180 points</span>
                        </td>
                        <td>
                          <div className="dropdown">
                            <button
                              className={`btn dropdown-toggle ${styles.dropdown_toggle}`}
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <span className={styles.more_icon_button}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M4.5 10.5C3.675 10.5 3 11.175 3 12C3 12.825 3.675 13.5 4.5 13.5C5.325 13.5 6 12.825 6 12C6 11.175 5.325 10.5 4.5 10.5ZM19.5 10.5C18.675 10.5 18 11.175 18 12C18 12.825 18.675 13.5 19.5 13.5C20.325 13.5 21 12.825 21 12C21 11.175 20.325 10.5 19.5 10.5ZM12 10.5C11.175 10.5 10.5 11.175 10.5 12C10.5 12.825 11.175 13.5 12 13.5C12.825 13.5 13.5 12.825 13.5 12C13.5 11.175 12.825 10.5 12 10.5Z"></path>
                                </svg>
                              </span>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                              <li>
                                <a className="dropdown-item" href="#">
                                  Action
                                </a>
                              </li>
                              <li>
                                <a className="dropdown-item" href="#">
                                  Another action
                                </a>
                              </li>
                              <li>
                                <a className="dropdown-item" href="#">
                                  Something else here
                                </a>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                      <tr className={styles.second_row} onClick={popHandler} style={{cursor:"pointer"}}> 
                        <td>
                          <span className={styles.name_label}>
                            IQ Test Name 1
                          </span>
                        </td>
                        <td>
                          {" "}
                          <span className={styles.date_label}>
                            24 July 2023
                          </span>
                        </td>
                        <td>
                          <span className={styles.point_label}>180 points</span>
                        </td>
                        <td>
                          <div className="dropdown">
                            <button
                              className={`btn dropdown-toggle ${styles.dropdown_toggle}`}
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <span className={styles.more_icon_button}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M4.5 10.5C3.675 10.5 3 11.175 3 12C3 12.825 3.675 13.5 4.5 13.5C5.325 13.5 6 12.825 6 12C6 11.175 5.325 10.5 4.5 10.5ZM19.5 10.5C18.675 10.5 18 11.175 18 12C18 12.825 18.675 13.5 19.5 13.5C20.325 13.5 21 12.825 21 12C21 11.175 20.325 10.5 19.5 10.5ZM12 10.5C11.175 10.5 10.5 11.175 10.5 12C10.5 12.825 11.175 13.5 12 13.5C12.825 13.5 13.5 12.825 13.5 12C13.5 11.175 12.825 10.5 12 10.5Z"></path>
                                </svg>
                              </span>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                              <li>
                                <a className="dropdown-item" href="#">
                                  Action
                                </a>
                              </li>
                              <li>
                                <a className="dropdown-item" href="#">
                                  Another action
                                </a>
                              </li>
                              <li>
                                <a className="dropdown-item" href="#">
                                  Something else here
                                </a>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                      <tr className={styles.first_row} onClick={popHandler} style={{cursor:"pointer"}}>
                        <td>
                          <span className={styles.name_label}>
                            IQ Test Name 1
                          </span>
                        </td>
                        <td>
                          {" "}
                          <span className={styles.date_label}>
                            24 July 2023
                          </span>
                        </td>
                        <td>
                          <span className={styles.point_label}>180 points</span>
                        </td>
                        <td>
                          <div className="dropdown">
                            <button
                              className={`btn dropdown-toggle ${styles.dropdown_toggle}`}
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <span className={styles.more_icon_button}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M4.5 10.5C3.675 10.5 3 11.175 3 12C3 12.825 3.675 13.5 4.5 13.5C5.325 13.5 6 12.825 6 12C6 11.175 5.325 10.5 4.5 10.5ZM19.5 10.5C18.675 10.5 18 11.175 18 12C18 12.825 18.675 13.5 19.5 13.5C20.325 13.5 21 12.825 21 12C21 11.175 20.325 10.5 19.5 10.5ZM12 10.5C11.175 10.5 10.5 11.175 10.5 12C10.5 12.825 11.175 13.5 12 13.5C12.825 13.5 13.5 12.825 13.5 12C13.5 11.175 12.825 10.5 12 10.5Z"></path>
                                </svg>
                              </span>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                              <li>
                                <a className="dropdown-item" href="#">
                                  Action
                                </a>
                              </li>
                              <li>
                                <a className="dropdown-item" href="#">
                                  Another action
                                </a>
                              </li>
                              <li>
                                <a className="dropdown-item" href="#">
                                  Something else here
                                </a>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                      <tr className={styles.second_row} onClick={popHandler} style={{cursor:"pointer"}} >
                        <td>
                          <span className={styles.name_label}>
                            IQ Test Name 1
                          </span>
                        </td>
                        <td>
                          {" "}
                          <span className={styles.date_label}>
                            24 July 2023
                          </span>
                        </td>
                        <td>
                          <span className={styles.point_label}>180 points</span>
                        </td>
                        <td>
                          <div className="dropdown">
                            <button
                              className={`btn dropdown-toggle ${styles.dropdown_toggle}`}
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <span className={styles.more_icon_button}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M4.5 10.5C3.675 10.5 3 11.175 3 12C3 12.825 3.675 13.5 4.5 13.5C5.325 13.5 6 12.825 6 12C6 11.175 5.325 10.5 4.5 10.5ZM19.5 10.5C18.675 10.5 18 11.175 18 12C18 12.825 18.675 13.5 19.5 13.5C20.325 13.5 21 12.825 21 12C21 11.175 20.325 10.5 19.5 10.5ZM12 10.5C11.175 10.5 10.5 11.175 10.5 12C10.5 12.825 11.175 13.5 12 13.5C12.825 13.5 13.5 12.825 13.5 12C13.5 11.175 12.825 10.5 12 10.5Z"></path>
                                </svg>
                              </span>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                              <li>
                                <a className="dropdown-item" href="#">
                                  Action
                                </a>
                              </li>
                              <li>
                                <a className="dropdown-item" href="#">
                                  Another action
                                </a>
                              </li>
                              <li>
                                <a className="dropdown-item" href="#">
                                  Something else here
                                </a>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                 
                 
                </div>
              </div>
              {/* <div className="coming_soon_block">
                    “Stay Tuned! Coming Soon”
                  </div> */}
            </div>
          </div>
        </div>
      </div>
    </JobSeekerAuth>
  );
};

export async function getServerSideProps(context) {
  createAxiosCookies(context);

  const result = await getAssessmentResult();

  return {
    props: {
      isProtected: true,
      roles: [1],
      ...result,
    },
  };
}

export default MyProfile;
