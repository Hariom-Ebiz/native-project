import React, { useEffect } from "react";
import { BASEURL } from "@/api";
import { getHomePageData } from "@/services/cms";
import { createAxiosCookies } from "@/fn";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper";
import HomeGateCards from "@/components/HomeGateCards";
import HomePriceCard from "@/components/HomePriceCard";
import PublicLayout from "@/components/layout/PublicLayout";
import Link from "next/link";
import { unsetModal } from "@/store/siteSlice";
import { useDispatch } from "react-redux";

// import required modules

const Index = ({ homePageBlocks, testimonials }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(unsetModal());
    document.getElementsByTagName("body")[0].classList.add("home-header");
    return () => {
      document.getElementsByTagName("body")[0].classList.remove("home-header");
    };
  }, []);

  const GateCards = [
    {
      image: "img/career-roadway.png",
      title: "Career Roadway",
      description: `Whether you are just starting your career journey or considering a career change, our Career Roadway
        Gate, featuring Coaching and Standout Programs, paves the path to your ideal career while elevating
        your essential skills for success.`,
      likes: "411K+ items",
      items: "1442 items",
      button: "Lets Start",
      path: "/login",
      isRead: false,
    },
    {
      image: "img/jobs-gate.png",
      title: "Jobs’ Gate",
      description: `The ultimate destination for job seekers and employers alike! Our streamlined search engine simplifies
        hiring with a tailored search engine and holistic candidate selection based on values, interests, skills, and
        personality. Plus, our development programs empower job seekers with standout resumes and
        interview skills, while aiding employers in seamless onboarding.`,
      likes: "211K+ items",
      items: "1662 items",
      button: "Lets Start",
      path: "/login",
      isRead: false,
    },
    {
      image: "img/community-gate.png",
      title: "Community Gate",
      description: `This is our vibrant career development community! Dive into a treasure trove of resources, including
        expert interviews, videos, and articles. Join the conversation, connect with fellow job seekers, and share
        your experiences. Take charge of your career journey with our supportive community, staying informed
        about industry trends and best practices for professional success.`,
      likes: "011K+ items",
      items: "1882 items",
      button: "Lets Start",
      path: "/login",
      isRead: false,
    },
  ];

  const PriceCards = [
    {
      pricePopular: "",
      priceImage: "img/priching01.svg",
      priceName: "Some Name",
      price: "$12",
      priceMonth: "per 6 month",
      button: "GET STARTED",
      priceListing: [
        "Some Item Here Will Be",
        "Some Item Here Will Be",
        "Some Item Here Will Be",
        "Some Item Here Will Be",
      ],
    },
    {
      pricePopular: " Most Popular",
      priceImage: "img/priching02.svg",
      priceName: "Some Name",
      price: "$12",
      priceMonth: "per 6 month",
      button: "GET STARTED",
      priceListing: [
        "Some Item Here Will Be",
        "Some Item Here Will Be",
        "Some Item Here Will Be",
        "Some Item Here Will Be",
      ],
    },
    {
      pricePopular: "",
      priceImage: "img/priching03.svg",
      priceName: "Some Name",
      price: "$12",
      priceMonth: "per 6 month",
      button: "GET STARTED",
      priceListing: [
        "Some Item Here Will Be",
        "Some Item Here Will Be",
        "Some Item Here Will Be",
        "Some Item Here Will Be",
      ],
    },
  ];

  return (
    <PublicLayout>
      <section
        className="hero-banner section-padding position-relative"
        // style={{
        //   backgroundImage: `url(${BASEURL}/${
        //     homePageBlocks?.["home-page-hero-section"]?.image || ""
        //   })`,
        // }}
      >
        <div className="container">
          <div className="row">
            {/* <div
              className="col-lg-8 col-md-7"
              dangerouslySetInnerHTML={{
                __html:
                  homePageBlocks?.["home-page-hero-section"]?.description || "",
              }}
               
            /> */}
            <div className="col-sm-12 col-md-5 col-lg-5">
              <div className="hero_head_box hero_block_new">
                {/* <div className="mobile_img">
                  <img src="../img/hero-banner-3.png" />
                </div> */}
                <h1>Empowering Careers, <br /> Elevating Talents</h1>
                <h2>Career-Seekers & Employers</h2>
                <h3>we've got you covered!</h3>

                <div className="hero-btn-box">
                  <a className="hero_watch_btn hero_button" href="#!">
                    Watch Video
                  </a>
                  <Link className="hero_start_btn hero_button" href="/login">
                    Start Journey
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-md-7 col-lg-7">
              <div className="heri_right_img">
                 <img src="../img/hero-banner-3.png" />
              </div>
            </div>
          </div>
        </div>
        <div className="wave_img_block">
          <img src="../img/hero-section-wave.png" />
        </div>
      </section>

      <div id="ourstory" style={{ position: "relative", bottom: "100px" }}></div>
      <section className="our_story_section">
        <div className="container">
          <h2 className="section_heading">Our Story</h2>

          <div className="our_story timeline mobile_none">
            <ul>
              <li>
                <div className="story_inner_block">
                  <img src="../img/our-purpose.png" />
                  <h2>Our Purpose</h2>
                  <p>
                    Creating a world where every individual embarks on their
                    career journey with confidence and a clear sense of purpose.
                  </p>
                </div>
              </li>
              <li>
                <div className="story_inner_block">
                  <img src="../img/how-we-do.png" />
                  <h2>How We Do It ?</h2>
                  <p>
                    We empower job seekers to discover their ideal career paths,
                    develop key skills, and connect with opportunities that
                    match their strengths while providing employers an easy path
                    to top talent and streamlined onboarding.
                  </p>
                </div>
              </li>

              <li className="last_block">
                <div className="story_inner_block">
                  <img src="../img/what-we-do.png" />
                  <h2>What We Do?</h2>
                  <p>
                    We offer a comprehensive approach including career coaching
                    journey, insightful assessments, career development
                    programs, vibrant community, a streamlined recruitment and
                    onboarding processes. This holistic approach is channeled
                    through our three primary gates: 'Career Roadway Gate,'
                    'Jobs' Gate,' 'Community Gate,'
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="mobile_slider_block">
            {" "}
            <>
              <Swiper
                spaceBetween={30}
                pagination={{
                  clickable: true,
                }}
                modules={[Pagination]}
                className="ourstoryslider"
              >
                <SwiperSlide>
                  <div className="story_inner_block">
                    <img src="../img/our-purpose.png" />
                    <h2>Our Purpose</h2>
                    <p>
                      Creating a world where every individual embarks on their
                      career journey with confidence and a clear sense of
                      purpose.
                    </p>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="story_inner_block">
                    <img src="../img/how-we-do.png" />
                    <h2>How We Do It ?</h2>
                    <p>
                      We empower job seekers to discover their ideal career
                      paths, develop key skills, and connect with opportunities
                      that match their strengths while providing employers an
                      easy path to top talent and streamlined onboarding.
                    </p>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="story_inner_block">
                    <img src="../img/what-we-do.png" />
                    <h2>What We Do?</h2>
                    <p>
                      We offer a comprehensive approach including career
                      coaching journey, insightful assessments, career
                      development programs, vibrant community, a streamlined
                      recruitment and onboarding processes. This holistic
                      approach is channeled through our three primary gates:
                      'Career Roadway Gate,' 'Jobs' Gate,' 'Community Gate,'
                    </p>
                  </div>
                </SwiperSlide>
              </Swiper>
            </>
          </div>
        </div>
      </section>
      <div id="ourgates" style={{ position: "relative", bottom: "190px" }} ></div>
      <section className="our_gates_wrapper position-relative">
        <div className="container">
          <h2 className="section_heading">Our Gates</h2>
          <div className="our_gates_block">
            <div className="row inner_card g-4 justify-content-center">
              <HomeGateCards GateCarddata={GateCards} />
            </div>

            {/* <div className="gates_block_swiper">
                <>
                  <Swiper
                  breakpoints={{
                    0: {
                      slidesPerView: 1,
                      spaceBetween: 20,
                    },
                
                    768: {
                      slidesPerView: 2,
                      spaceBetween: 40,
                    },
                    1024: {
                      slidesPerView: 3,
                      spaceBetween: 50,
                    },
                    }}
                    slidesPerView={3}
                    spaceBetween={30}
                    pagination={{
                      clickable: true,
                    }}
                    modules={[Pagination]}
                    className="getsswiper"
                  >
                    <SwiperSlide>Slide 1</SwiperSlide>
                    <SwiperSlide>Slide 2</SwiperSlide>
                    <SwiperSlide>Slide 3</SwiperSlide>
                   
                  </Swiper>
                </>     
            </div> */}
          </div>
        </div>
        <div className="gates_bottom_bg">
          <img src="../img/gate-bg2.png" />
        </div>
      </section>

      <section className="testimonials_new_wrapper">
        <div className="container">
          <h3 className="section_heading">Testimonials</h3>
          <div className="testimonials_outer_block">
            <div className="col-sm-12 col-md-12 col-lg-12">
              <div className="">
                <>
                  <Swiper
                    spaceBetween={30}
                    pagination={{
                      clickable: true,
                    }}
                    modules={[Pagination]}
                    className="mySwiper"
                  >
                    <SwiperSlide>
                      <div className="row align-items-center">
                         <div className="col-sm-12 col-md-6 col-lg-5">
                              <div className="testimonials_inner">
                              <div className="element_first">
                                <img src="../img/left-topelemnt.png" />
                              </div>
                              <div className="user_name_raiting">
                                <h3>
                                  Ali Darwish, Erasmus University in Netherlands,
                                  Business
                                </h3>
                                <div className="rating_star">
                                  <img src="../img/rating-star.png" />
                                </div>
                              </div>
                              <p>
                                This platform has been a game-changer for me as a
                                university student. It helped me explore various
                                career paths, understand my strengths, and align my
                                interests with potential job opportunities.
                              </p>
                              <div className="element_second">
                                <img src="../img/right-bottomelemnt.png" />
                              </div>
                            </div>
                         </div>
                         <div className="col-sm-12 col-md-6 col-lg-7">
                             <div className="right_img_block">
                              <img src="../img/Ali-Amr.png" />   
                             </div>
                           
                        </div>
                      </div>
                  
                    </SwiperSlide>
                    <SwiperSlide>
                     <div className="row align-items-center">
                         <div className="col-sm-12 col-md-6 col-lg-5">
                                <div className="testimonials_inner">
                                <div className="element_first">
                                  <img src="../img/left-topelemnt.png" />
                                </div>
                                <div className="user_name_raiting">
                                  <h3>
                                    Heba Maamoun, American University in Cairo,
                                    Psychology{" "}
                                  </h3>
                                  <div className="rating_star">
                                    <img src="../img/rating-star.png" />
                                  </div>
                                </div>
                                <p>
                                  I was feeling lost in the maze of career options
                                  during my university years. Thankfully, this platform
                                  helped me embark on a journey of self-discovery. The
                                  insightful assessments and engaging content guided me
                                  to uncover my passions and talents.
                                </p>
                                <div className="element_second">
                                  <img src="../img/right-bottomelemnt.png" />
                                </div>
                              </div>
                          </div>
                          <div className="col-sm-12 col-md-6 col-lg-7">
                             <div className="right_img_block">
                               <img src="../img/Heba-Maamoun.png" />
                             </div>
                            
                          </div>
                     </div>
                     
                    </SwiperSlide>
                    <SwiperSlide>
                      <div className="row align-items-center">
                         <div className="col-sm-12 col-md-6 col-lg-5">
                              <div className="testimonials_inner">
                                  <div className="element_first">
                                    <img src="../img/left-topelemnt.png" />
                                  </div>
                                  <div className="user_name_raiting">
                                    <h3>
                                      Farah Abdo, American University in Cairo, Marketing{" "}
                                    </h3>
                                    <div className="rating_star">
                                      <img src="../img/rating-star.png" />
                                    </div>
                                  </div>
                                  <p>
                                    This platform helped me shape my career. The
                                    insightful coaching and practical tools gave me
                                    clarity on my career direction.
                                  </p>
                                  <div className="element_second">
                                    <img src="../img/right-bottomelemnt.png" />
                                  </div>
                              </div>
                         </div>
                         <div className="col-sm-12 col-md-6 col-lg-7">
                             <div className="right_img_block">
                              <img src="../img/Farah-Abdo.png" />
                             </div>
                           
                         </div>
                      </div>
                   
                    </SwiperSlide>
                    <SwiperSlide>
                       <div className="row align-items-center">
                         <div className="col-sm-12 col-md-6 col-lg-5">
                              <div className="testimonials_inner">
                              <div className="element_first">
                                <img src="../img/left-topelemnt.png" />
                              </div>
                              <div className="user_name_raiting">
                                <h3>
                                  Ganna Emam, German University in Cairo, Applied Arts
                                </h3>
                                <div className="rating_star">
                                  <img src="../img/rating-star.png" />
                                </div>
                              </div>
                              <p>
                                This platform helped me identify the career path that
                                truly resonates with me. It also guided me on how to
                                map out my career journey through multiple tools and
                                eye-opener knowledge.
                              </p>
                              <div className="element_second">
                                <img src="../img/right-bottomelemnt.png" />
                              </div>
                            </div>
                         </div>
                         <div className="col-sm-12 col-md-6 col-lg-7">
                            <div className="right_img_block">
                               <img src="../img/Ganna-Emam.png" />
                             </div>
                        
                         </div>
                       </div>
                    
                    </SwiperSlide>
                    <SwiperSlide>
                      <div className="row align-items-center">
                         <div className="col-sm-12 col-md-6 col-lg-5">
                                <div className="testimonials_inner">
                                <div className="element_first">
                                  <img src="../img/left-topelemnt.png" />
                                </div>
                                <div className="user_name_raiting">
                                  <h3>
                                    Omar El-Ansary, Cairo University, Engineering{" "}
                                  </h3>
                                  <div className="rating_star">
                                    <img src="../img/rating-star.png" />
                                  </div>
                                </div>
                                <p>
                                  This platform helped me identify the career path that
                                  aligns perfectly with my personality and provided the
                                  tools and insights to plot my career journey.
                                </p>
                                <div className="element_second">
                                  <img src="../img/right-bottomelemnt.png" />
                                </div>
                              </div>
                         </div>
                         <div className="col-sm-12 col-md-6 col-lg-7">
                              <div className="right_img_block">
                                 <img src="../img/Omar-El-Ansary.png" />
                             </div>
                         
                         </div>
                      </div>
                   
                    </SwiperSlide>
                    <SwiperSlide>
                    <div className="row align-items-center">
                         <div className="col-sm-12 col-md-6 col-lg-5">
                            <div className="testimonials_inner">
                            <div className="element_first">
                              <img src="../img/left-topelemnt.png" />
                            </div>
                            <div className="user_name_raiting">
                              <h3>Yahia Adly, Pepsico, Human Resources </h3>
                              <div className="rating_star">
                                <img src="../img/rating-star.png" />
                              </div>
                            </div>
                            <p>
                              As a fresh graduate, choosing the right career path
                              felt like an overwhelming task. This platform provided
                              me with invaluable resources to explore various
                              industries and professions. It gave me the confidence
                              to make informed decisions about my future.
                            </p>
                            <div className="element_second">
                              <img src="../img/right-bottomelemnt.png" />
                            </div>
                          </div>
                         </div>
                         <div className="col-sm-12 col-md-6 col-lg-7">
                             <div className="right_img_block">
                              <img src="../img/Yahia-Adly.png" />
                             </div>
                        
                         </div>
                    </div>
           
                    </SwiperSlide>
                    <SwiperSlide>
                       <div className="row align-items-center">
                            <div className="col-sm-12 col-md-6 col-lg-5">
                            <div className="testimonials_inner">
                        <div className="element_first">
                          <img src="../img/left-topelemnt.png" />
                        </div>
                        <div className="user_name_raiting">
                          <h3>
                            Hamdy Abdel-Ghany, Synfiny Advisors, Project
                            Management{" "}
                          </h3>
                          <div className="rating_star">
                            <img src="../img/rating-star.png" />
                          </div>
                        </div>
                        <p>
                          After spending a considerable amount of time in one
                          industry, I felt the need for a change, but I wasn't
                          sure where to start. This platform became my compass.
                          It provided me with a structured approach to assess my
                          skills, passions, and interests. With its expert
                          advice, I found a new career path that excites me
                        </p>
                        <div className="element_second">
                          <img src="../img/right-bottomelemnt.png" />
                        </div>
                      </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-7">
                              <div className="right_img_block">
                                 <img src="../img/Hamdy.png" />
                              </div>
                              
                            </div>
                       </div>
                     
                    </SwiperSlide>
                  </Swiper>
                </>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="pricingsection" style={{ position: "relative", bottom: "250px" }}></div>
      <section className="pricing_wrapper pricing_wrapper_new">
        <div className="prcing_wave">
          <img src="../img/pricing-wave.png" />
        </div>
        <div className="container">
          {/* <h2 className="section_heading">Pricing</h2> */}

          <div className="pricing_content_block">
            <div className="row g-4 pricing_block">
              {/* <HomePriceCard priceCardsdata={PriceCards} />
              <div className="col-lg-4 col-md-6">
                <div className="pricing_card_box">
                  <div className="pricing_category">
                    <figure className="pricing_img_box">
                      <img src="img/priching01.png" alt="" />
                    </figure>
                    <h3 className="pricing_someName">Some Name</h3>
                    <span className="pricing_price_box">Free</span>
                    <span className="pricing_month_text">per month</span>
                  </div>
                  <ul className="pricing_item_box">
                    <li>Some Item Here Will Be</li>
                    <li> Some Item Here Will Be</li>
                    <li> Some Item Here Will Be</li>
                    <li> Some Item Here Will Be</li>
                    <li> Some Item Here Will Be</li>
                  </ul>
                  <div className="pricing_btn_box">
                    <a href="#" className="pricing_btn">
                      GET STARTED
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="pricing_card_box active">
                  <div className="pricing_category">
                    <a href="javascript:void(0);" className="pricing_most_btn">
                      Most Popular
                    </a>
                    <figure className="pricing_img_box">
                      <img src="img/priching02.png" alt="" />
                    </figure>
                    <h3 className="pricing_someName">Some Name</h3>
                    <span className="pricing_price_box">$12</span>
                    <span className="pricing_month_text">per 6 month</span>
                  </div>
                  <ul className="pricing_item_box">
                    <li>Some Item Here Will Be</li>
                    <li> Some Item Here Will Be</li>
                    <li> Some Item Here Will Be</li>
                    <li> Some Item Here Will Be</li>
                    <li> Some Item Here Will Be</li>
                  </ul>
                  <div className="pricing_btn_box">
                    <a href="#" className="pricing_btn">
                      GET STARTED
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="pricing_card_box pricing_red_box">
                  <div className="pricing_category ">
                    <figure className="pricing_img_box">
                      <img src="img/our_gate03.png" alt="" />
                    </figure>
                    <h3 className="pricing_someName">Some Name</h3>
                    <span className="pricing_price_box ">$20</span>
                    <span className="pricing_month_text">per year</span>
                  </div>
                  <ul className="pricing_item_box">
                    <li>Some Item Here Will Be</li>
                    <li> Some Item Here Will Be</li>
                    <li> Some Item Here Will Be</li>
                    <li> Some Item Here Will Be</li>
                    <li> Some Item Here Will Be</li>
                  </ul>
                  <div className="pricing_btn_box">
                    <a href="#" className="pricing_btn">
                      GET STARTED
                    </a>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* <section className="find-great-wrapper">
        <div className="container">
          <div
            className="section_head_box"
            dangerouslySetInnerHTML={{
              __html:
                homePageBlocks?.["home-page-great-work"]?.description || "",
            }}
          />
          <div className="great_work_block">
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="great_work_imgbox">
                  <img
                    src={`${BASEURL}/${homePageBlocks?.["home-page-great-work"]?.image}`}
                    alt=""
                  />
                </div>
              </div>

              <div className="col-lg-4">
                <div
                  className="join_greatWork_block"
                  style={{ height: "348px", width: "100%" }}
                >
                  <div className="slide-greatWork-box">
                    <div
                      className="swiper mySwiper"
                      style={{ height: "170px" }}
                    >
                    
                      <Swiper
                        modules={[Pagination]}
                        pagination={{
                          clickable: true,
                        }}
                        className="job-seeker-swiper"
                      >
                        <SwiperSlide>
                          <div className="swiper-slide">
                            <span className="slide_greatWork_icon">
                              <svg
                                width="40"
                                height="40"
                                viewBox="0 0 40 40"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M20.0003 21.2507C14.717 21.2507 10.417 16.9507 10.417 11.6673C10.417 6.38398 14.717 2.08398 20.0003 2.08398C25.2837 2.08398 29.5837 6.38398 29.5837 11.6673C29.5837 16.9507 25.2837 21.2507 20.0003 21.2507ZM20.0003 4.58398C16.1003 4.58398 12.917 7.76732 12.917 11.6673C12.917 15.5673 16.1003 18.7507 20.0003 18.7507C23.9003 18.7507 27.0837 15.5673 27.0837 11.6673C27.0837 7.76732 23.9003 4.58398 20.0003 4.58398Z"
                                  fill="white"
                                />
                                <path
                                  d="M5.68359 37.9167C5.00026 37.9167 4.43359 37.35 4.43359 36.6667C4.43359 29.55 11.417 23.75 20.0003 23.75C20.6836 23.75 21.2503 24.3167 21.2503 25C21.2503 25.6833 20.6836 26.25 20.0003 26.25C12.8003 26.25 6.93359 30.9167 6.93359 36.6667C6.93359 37.35 6.36693 37.9167 5.68359 37.9167Z"
                                  fill="white"
                                />
                                <path
                                  d="M30.3334 36.9167C26.7 36.9167 23.75 33.9667 23.75 30.3334C23.75 26.7 26.7 23.75 30.3334 23.75C33.9667 23.75 36.9167 26.7 36.9167 30.3334C36.9167 33.9667 33.9667 36.9167 30.3334 36.9167ZM30.3334 26.25C28.0834 26.25 26.25 28.0834 26.25 30.3334C26.25 32.5834 28.0834 34.4167 30.3334 34.4167C32.5834 34.4167 34.4167 32.5834 34.4167 30.3334C34.4167 28.0834 32.5834 26.25 30.3334 26.25Z"
                                  fill="white"
                                />
                                <path
                                  d="M36.6665 37.9165C36.3498 37.9165 36.0331 37.7998 35.7831 37.5498L34.1164 35.8832C33.6331 35.3998 33.6331 34.5997 34.1164 34.1164C34.5997 33.6331 35.3998 33.6331 35.8832 34.1164L37.5498 35.7831C38.0332 36.2664 38.0332 37.0665 37.5498 37.5498C37.2998 37.7998 36.9831 37.9165 36.6665 37.9165Z"
                                  fill="white"
                                />
                              </svg>
                            </span>
                            <p className="slide_greatWork_title">
                              Find opportunities for every stage of your career
                            </p>
                          </div>
                        </SwiperSlide>
                        <SwiperSlide>
                          <div className="swiper-slide">
                            <span className="slide_greatWork_icon">
                              <svg
                                width="40"
                                height="40"
                                viewBox="0 0 40 40"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M20.0003 21.2507C14.717 21.2507 10.417 16.9507 10.417 11.6673C10.417 6.38398 14.717 2.08398 20.0003 2.08398C25.2837 2.08398 29.5837 6.38398 29.5837 11.6673C29.5837 16.9507 25.2837 21.2507 20.0003 21.2507ZM20.0003 4.58398C16.1003 4.58398 12.917 7.76732 12.917 11.6673C12.917 15.5673 16.1003 18.7507 20.0003 18.7507C23.9003 18.7507 27.0837 15.5673 27.0837 11.6673C27.0837 7.76732 23.9003 4.58398 20.0003 4.58398Z"
                                  fill="white"
                                />
                                <path
                                  d="M5.68359 37.9167C5.00026 37.9167 4.43359 37.35 4.43359 36.6667C4.43359 29.55 11.417 23.75 20.0003 23.75C20.6836 23.75 21.2503 24.3167 21.2503 25C21.2503 25.6833 20.6836 26.25 20.0003 26.25C12.8003 26.25 6.93359 30.9167 6.93359 36.6667C6.93359 37.35 6.36693 37.9167 5.68359 37.9167Z"
                                  fill="white"
                                />
                                <path
                                  d="M30.3334 36.9167C26.7 36.9167 23.75 33.9667 23.75 30.3334C23.75 26.7 26.7 23.75 30.3334 23.75C33.9667 23.75 36.9167 26.7 36.9167 30.3334C36.9167 33.9667 33.9667 36.9167 30.3334 36.9167ZM30.3334 26.25C28.0834 26.25 26.25 28.0834 26.25 30.3334C26.25 32.5834 28.0834 34.4167 30.3334 34.4167C32.5834 34.4167 34.4167 32.5834 34.4167 30.3334C34.4167 28.0834 32.5834 26.25 30.3334 26.25Z"
                                  fill="white"
                                />
                                <path
                                  d="M36.6665 37.9165C36.3498 37.9165 36.0331 37.7998 35.7831 37.5498L34.1164 35.8832C33.6331 35.3998 33.6331 34.5997 34.1164 34.1164C34.5997 33.6331 35.3998 33.6331 35.8832 34.1164L37.5498 35.7831C38.0332 36.2664 38.0332 37.0665 37.5498 37.5498C37.2998 37.7998 36.9831 37.9165 36.6665 37.9165Z"
                                  fill="white"
                                />
                              </svg>
                            </span>
                            <p className="slide_greatWork_title">
                              Find opportunities for every stage of your career
                            </p>
                          </div>
                        </SwiperSlide>
                        <SwiperSlide>
                          <div className="swiper-slide">
                            <span className="slide_greatWork_icon">
                              <svg
                                width="40"
                                height="40"
                                viewBox="0 0 40 40"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M20.0003 21.2507C14.717 21.2507 10.417 16.9507 10.417 11.6673C10.417 6.38398 14.717 2.08398 20.0003 2.08398C25.2837 2.08398 29.5837 6.38398 29.5837 11.6673C29.5837 16.9507 25.2837 21.2507 20.0003 21.2507ZM20.0003 4.58398C16.1003 4.58398 12.917 7.76732 12.917 11.6673C12.917 15.5673 16.1003 18.7507 20.0003 18.7507C23.9003 18.7507 27.0837 15.5673 27.0837 11.6673C27.0837 7.76732 23.9003 4.58398 20.0003 4.58398Z"
                                  fill="white"
                                />
                                <path
                                  d="M5.68359 37.9167C5.00026 37.9167 4.43359 37.35 4.43359 36.6667C4.43359 29.55 11.417 23.75 20.0003 23.75C20.6836 23.75 21.2503 24.3167 21.2503 25C21.2503 25.6833 20.6836 26.25 20.0003 26.25C12.8003 26.25 6.93359 30.9167 6.93359 36.6667C6.93359 37.35 6.36693 37.9167 5.68359 37.9167Z"
                                  fill="white"
                                />
                                <path
                                  d="M30.3334 36.9167C26.7 36.9167 23.75 33.9667 23.75 30.3334C23.75 26.7 26.7 23.75 30.3334 23.75C33.9667 23.75 36.9167 26.7 36.9167 30.3334C36.9167 33.9667 33.9667 36.9167 30.3334 36.9167ZM30.3334 26.25C28.0834 26.25 26.25 28.0834 26.25 30.3334C26.25 32.5834 28.0834 34.4167 30.3334 34.4167C32.5834 34.4167 34.4167 32.5834 34.4167 30.3334C34.4167 28.0834 32.5834 26.25 30.3334 26.25Z"
                                  fill="white"
                                />
                                <path
                                  d="M36.6665 37.9165C36.3498 37.9165 36.0331 37.7998 35.7831 37.5498L34.1164 35.8832C33.6331 35.3998 33.6331 34.5997 34.1164 34.1164C34.5997 33.6331 35.3998 33.6331 35.8832 34.1164L37.5498 35.7831C38.0332 36.2664 38.0332 37.0665 37.5498 37.5498C37.2998 37.7998 36.9831 37.9165 36.6665 37.9165Z"
                                  fill="white"
                                />
                              </svg>
                            </span>
                            <p className="slide_greatWork_title">
                              Find opportunities for every stage of your career
                            </p>
                          </div>
                        </SwiperSlide>
                      </Swiper>
               
                    </div>
                  </div>
              

                  <div className="greatWork-joinBox">
                    <div className="great_TopJoin_box"></div>
                    <Link href="/login" className="greatWork_Join_btn">
                      Join Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* <section className="great_opportunity_wrapper">
        <div
          className="container"
          dangerouslySetInnerHTML={{
            __html:
              homePageBlocks?.["home-page-great-opportunity"]?.description ||
              "",
          }}
        />
       
      </section> */}

      {/* <section className="testimonials-wrapper">
        <div className="container">
          <div className="testimonials_head_box">
            <div
              className="row align-items-center"
              dangerouslySetInnerHTML={{
                __html:
                  homePageBlocks?.["home-page-testimonials"]?.description || "",
              }}
            />

            <div className="testimonials_content_box">
              <div className="row g-4">
                <Swiper
                
                  breakpoints={{
                    640: {
                      width: 640,
                      slidesPerView: 1,
                      spaceBetween: 10,
                    },
                    768: {
                      width: 768,
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    1000: {
                      slidesPerView: 3,
                      spaceBetween: 40,
                    },
                  }}                 
                  pagination={{
                    clickable: true,
                  }}                 
                  modules={[Pagination]}
                  className="mySwiper"
                >
                  {testimonials.length > 0 &&
                    testimonials?.map((val) => {
                      return (
                        <SwiperSlide key={val.id}>
                          <div
                            className="col-lg-4 col-md-6"
                            style={{ width: "100%", padding: "10px" }}
                          >
                            <div className="testimonials_card_box">
                              <p className="testimonials_card_desc">
                                {val?.comment}
                              </p>
                              <div className="testimonials_user_box">
                                <div className="testimonials_img_box">
                                  <figure>
                                    <img
                                      src={`${BASEURL}/${val?.image}`}
                                      alt=""
                                    />
                                  </figure>
                                </div>
                                <div className="testimonials_name_box">
                                  <h3 className="testimonials_user_name">
                                    {val?.name}
                                  </h3>
                                  <p className="testimonials_user_banch">
                                    {val?.designation}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </SwiperSlide>
                      );
                    })}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </section> */}
    </PublicLayout>
  );
};

export async function getServerSideProps(context) {
  createAxiosCookies(context);
  let data = await getHomePageData();
  return {
    props: {
      ...data,
      isProtected: null,
    },
  };
}

export default Index;
