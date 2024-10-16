import React, { useEffect, useState } from "react";
import { API, BASEURL } from "@/api";
import { getHomePageData } from "@/services/cms";
import { createAxiosCookies, getCookies } from "@/fn";

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
import { useDispatch,useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import useRequest  from "../hooks/useRequest"

const Index = ({ homePageData, testimonialsData }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const {language_id} = useSelector(store => store.site)
  
  const {request: requestTestimonials, response: responseTestimonials} = useRequest();
  const {request, response} = useRequest();
  
  const [homePageBlocks, setHomePageBlocks] = useState(homePageData)
  const [testimonials, setTestimonials] = useState(testimonialsData)  

  useEffect(()=> {
    if(language_id){      
      request("get",`block/get-block/home-page?lang=${language_id}`)
      requestTestimonials("get",`master/testimonials?lang=${language_id}`)
    }
  },[language_id])

  useEffect(()=> {
    if(responseTestimonials){
      console.log("responseTestimonials",responseTestimonials);
      setTestimonials(responseTestimonials?.list)
    }
  },[responseTestimonials])

  useEffect(()=> {
    if(response){
      console.log("response",response);
      setHomePageBlocks(response?.blocks)
    }
  },[response])

  useEffect(() => {
    dispatch(unsetModal());
    document.getElementsByTagName("body")[0].classList.add("home-header");
    return () => {
      document.getElementsByTagName("body")[0].classList.remove("home-header");
    };
  }, []);


  const GateCards = [
    {...homePageBlocks["our-gates-career-roadway"],button: "Let's Start",
      path: "/login",},
    {...homePageBlocks["our-gates-jobs’-gate"], button: "Let's Start",
      path: "/login"},
    {...homePageBlocks["our-gates-community-gate"],button: "Let's Start",
      path: "/login",},
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
      >
        <div className="container">
          <div className="row">
            <div className="col-sm-12 col-md-5 col-lg-5">
              <div className="hero_head_box hero_block_new">

                <p dangerouslySetInnerHTML={{__html: homePageBlocks["home-page-hero-section"]?.description}}
                />
              </div>  
            </div>

            <div className="col-sm-12 col-md-7 col-lg-7">
              <div className="heri_right_img">
                <img src={API + "/" + homePageBlocks["home-page-hero-section"]?.image} />

              </div>
            </div>
          </div>
        </div>
        <div className="wave_img_block">
          <img src="../img/hero-section-wave.png" />
        </div>
      </section>

      <div
        id="ourstory"
        style={{ position: "relative", bottom: "100px" }}
      ></div>
      <section className="our_story_section">
        <div className="container">
          <h2 className="section_heading">{t("Our Story")}</h2>

          <div className="our_story timeline mobile_none">
            <ul>
              <li>
                <div className="story_inner_block">
                  <img src={API + "/" + homePageBlocks["home-page-our-story-1"]?.image} />
                  <p  dangerouslySetInnerHTML={{__html: homePageBlocks["home-page-our-story-1"]?.description}}
                />             
                </div>
              </li>
              <li>
                <div className="story_inner_block">
                <img src={API + "/" + homePageBlocks["home-page-our-story-2"]?.image} />
                  <p  dangerouslySetInnerHTML={{__html: homePageBlocks["home-page-our-story-2"]?.description}}
                />
                </div>
              </li>

              <li className="last_block">
                <div className="story_inner_block">
                <img src={API + "/" + homePageBlocks["home-page-our-story-3"]?.image} />
                  <p  dangerouslySetInnerHTML={{__html: homePageBlocks["home-page-our-story-3"]?.description}}
                />
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
                    <h2>{t("Our Purpose")}</h2>
                    <p>
                      {t(`Creating a world where every individual embarks on their career journey with confidence and a clear sense of purpose.`)}
                    </p>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="story_inner_block">
                    <img src="../img/how-we-do.png" />
                    <h2>{t("How We Do It ?")}</h2>
                    <p>
                      {t("We empower job seekers to discover their ideal career paths, develop skills, and connect with opportunities that match their strengths while providing employers an easy path to top talent and streamlined onboarding.")}
                    </p>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="story_inner_block">
                    <img src="../img/what-we-do.png" />
                    <h2>{t("What We Do?")}</h2>
                    <p>
                      {t("We offer a comprehensive approach including career coaching journey, insightful assessments, career development programs, vibrant community, a streamlined recruitment and onboarding processes. This holistic approach is channeled through our three primary gates: 'Career Roadway Gate,' 'Jobs' Gate,' 'Community Gate,'")}
                    </p>
                  </div>
                </SwiperSlide>
              </Swiper>
            </>
          </div>
        </div>
      </section>
      <div
        id="ourgates"
        style={{ position: "relative", bottom: "190px" }}
      ></div>
      <section className="our_gates_wrapper position-relative">
        <div className="container">
          <h2 className="section_heading">{t("Our Gates")}</h2>
          <div className="our_gates_block">
            <div className="row inner_card g-4 justify-content-center">
            {GateCards && <HomeGateCards GateCarddata={GateCards} />}
            </div>
          </div>
        </div>
        <div className="gates_bottom_bg">
          <img src="../img/gate-bg2.png" />
        </div>
      </section>

      <section className="testimonials_new_wrapper">
        <div className="container">
          <h3 className="section_heading">{t("Testimonials")}</h3>
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
                    {testimonials.length > 0 &&
                      testimonials.map((val) => {
                        return (
                          <SwiperSlide>
                            <div className="row align-items-center">
                              <div className="col-sm-12 col-md-6 col-lg-5">
                                <div className="testimonials_inner">
                                  <div className="element_first">
                                    <img src="../img/left-topelemnt.png" />
                                  </div>
                                  <div className="user_name_raiting">
                                    <h3>
                                      {val.name}, {val.language_designation || val.designation}
                                    </h3>
                                    <div className="rating_star">
                                      <img src="../img/rating-star.png" />
                                    </div>
                                  </div>
                                  <p>{val.language_comment || val.comment}</p>
                                  <div className="element_second">
                                    <img src="../img/right-bottomelemnt.png" />
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-12 col-md-6 col-lg-7">
                                <div className="right_img_block">
                                  <img src={`${API}/${val.image}`} />
                                </div>
                              </div>
                            </div>
                          </SwiperSlide>
                        );
                      })}
                  </Swiper>
                </>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div
        id="pricingsection"
        style={{ position: "relative", bottom: "250px" }}
      ></div>
      <section className="pricing_wrapper pricing_wrapper_new">
        <div className="prcing_wave">
          <img src="../img/pricing-wave.png" />
        </div>
        <div className="container">
          <div className="pricing_content_block">
            <div className="row g-4 pricing_block"></div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export async function getServerSideProps(context) {
  createAxiosCookies(context);
  const { lang } = getCookies(context);
  let data = await getHomePageData(lang);
    let lang_code = "en";

    try {
        const language = JSON.parse(lang)

        lang_code = String(language.code).toLowerCase()
    } catch (error) {
        lang_code = "en"
    }
  return {
    props: {
      ...data,
      isProtected: null,
      ...(await serverSideTranslations(lang_code, [
        'common',
      ])),
    },
  };
}

export default Index;
