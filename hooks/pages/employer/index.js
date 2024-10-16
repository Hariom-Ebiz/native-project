import React, { useEffect } from "react";
import { createAxiosCookies } from "@/fn";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper";
import { getEmployerPageData } from "@/services/cms";
import { BASEURL } from "@/api";
import HomePriceCard from "@/components/HomePriceCard";
import PublicLayout from "@/components/layout/PublicLayout";
import { setModal } from "@/store/siteSlice";
import { useDispatch } from "react-redux";

const Index = ({ employerPageBlocks }) => {

  // const dispatch = useDispatch();

  // useEffect(() => {
  //   const employer = localStorage.getItem("isEmployer");
  //   if (employer) {
  //     dispatch(
  //       setModal(
  //         <>
  //           <div className="modal_inner">
  //             {/* <div className="icon_block">
  //             <img src="/img/error.png" alt="" />
  //           </div> */}
  //             <h3>“Stay Tuned! Coming Soon”</h3>
  //           </div>
  //         </>
  //       )
  //     );
  //   }
  // }, []);

  useEffect(() => {

    document.body.classList.add("employer_page");
    
    return () => {
    document.body.classList.remove("employer_page");
    };
    }, []);

  const PriceCards = [
    {
      pricePopular: "",
      priceImage: "img/priching01.png",
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
      priceImage: "img/priching02.png",
      priceName: "Some Name",
      price: "$20",
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
      price: "$25",
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
             <div className="overlay_fix">
               <h3>“Stay Tuned! Coming Soon”</h3>
            </div>
      <section className="hero-section">
        <div className="row align-items-center m-0 g-0">
          <div className="col-lg-6">
            <div className="images-section">
              <img
                src={`${BASEURL}/${employerPageBlocks?.["employer-page-hero-section"]?.image}`}
                className="img-fluid"
                alt=""
              />
            </div>
          </div>
          <div
            className="col-lg-6"
            dangerouslySetInnerHTML={{
              __html:
                employerPageBlocks?.["employer-page-hero-section"]
                  ?.description || "",
            }}
          />
        </div>
      </section>
      <section className="company-logo">
        <div className="container">
          <h4>Trusted by Great Company</h4>
          <div className="logosList">
            <div className="company-logo_div">
              <img src="img/Coveralls.png" className="img-fluid" alt="" />
            </div>
            <div className="company-logo_div">
              <img src="img/Coursera.png" className="img-fluid" alt="" />
            </div>
            <div className="company-logo_div">
              <img src="img/Engage.png" className="img-fluid" alt="" />
            </div>
            <div className="company-logo_div">
              <img src="img/Miro.png" className="img-fluid" alt="" />
            </div>
            <div className="company-logo_div">
              <img src="img/tumblr.png" className="img-fluid" alt="" />
            </div>
          </div>
        </div>
      </section>
      <section className="content-section">
        <div className="container text-center">
          <div className="chart">
            <img src="img/chart.png" className="img-fluid" alt="" />
            <p>Started</p>
          </div>
          <span
            dangerouslySetInnerHTML={{
              __html:
                employerPageBlocks?.["employer-page-started"]?.description ||
                "",
            }}
          />
          <div className="Registration_boxs">
            <div className="row">
              <div className="col-sm-6 col-md-6 col-lg-3">
                <div className="registration-box text-center">
                  <div className="box-image">
                    <div className="images-count">1</div>
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 64 64"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M35.813 14.4797V18.053C28.8263 18.613 24.853 23.093 24.853 30.4797V42.6663H14.4797C8.37301 42.6663 5.33301 39.6263 5.33301 33.5197V14.4797C5.33301 8.37301 8.37301 5.33301 14.4797 5.33301H26.6663C32.773 5.33301 35.813 8.37301 35.813 14.4797Z"
                        fill="#2A3858"
                      />
                      <path
                        d="M49.5199 21.333H37.3332C31.2265 21.333 28.1865 24.373 28.1865 30.4797V49.5197C28.1865 55.6263 31.2265 58.6663 37.3332 58.6663H49.5199C55.6265 58.6663 58.6665 55.6263 58.6665 49.5197V30.4797C58.6665 24.373 55.6265 21.333 49.5199 21.333ZM48.3465 41.9997H45.9999V44.3463C45.9999 45.4397 45.0932 46.3463 43.9999 46.3463C42.9065 46.3463 41.9999 45.4397 41.9999 44.3463V41.9997H39.6532C38.5599 41.9997 37.6532 41.093 37.6532 39.9997C37.6532 38.9063 38.5599 37.9997 39.6532 37.9997H41.9999V35.653C41.9999 34.5597 42.9065 33.653 43.9999 33.653C45.0932 33.653 45.9999 34.5597 45.9999 35.653V37.9997H48.3465C49.4399 37.9997 50.3465 38.9063 50.3465 39.9997C50.3465 41.093 49.4399 41.9997 48.3465 41.9997Z"
                        fill="#2A3858"
                      />
                    </svg>
                  </div>
                  <h4>Registration</h4>
                  <p>
                    First, build your team by creating a new account on the
                    jofind platform.
                  </p>
                </div>
              </div>
              <div className="col-sm-6 col-md-6 col-lg-3">
                <div className="registration-box text-center">
                  <div className="box-image">
                    <div className="images-count">2</div>
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 64 64"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M42.6668 11.333C42.6668 14.6397 39.9735 17.333 36.6668 17.333H27.3335C25.6802 17.333 24.1868 16.6663 23.0935 15.573C22.0002 14.4797 21.3335 12.9863 21.3335 11.333C21.3335 8.02634 24.0268 5.33301 27.3335 5.33301H36.6668C38.3202 5.33301 39.8135 5.99967 40.9068 7.09301C42.0002 8.18634 42.6668 9.67967 42.6668 11.333Z"
                        fill="#2A3858"
                      />
                      <path
                        d="M50.2132 13.4132C49.5998 12.9066 48.9065 12.5066 48.1598 12.2132C47.3865 11.9199 46.6132 12.5332 46.4532 13.3332C45.5465 17.8932 41.5198 21.3332 36.6665 21.3332H27.3332C24.6665 21.3332 22.1598 20.2932 20.2665 18.3999C18.8798 17.0132 17.9198 15.2532 17.5465 13.3599C17.3865 12.5599 16.5865 11.9199 15.8132 12.2399C12.7198 13.4932 10.6665 16.3199 10.6665 21.9999V47.9999C10.6665 55.9999 15.4398 58.6666 21.3332 58.6666H42.6665C48.5598 58.6666 53.3332 55.9999 53.3332 47.9999V21.9999C53.3332 17.6532 52.1332 14.9866 50.2132 13.4132ZM21.3332 32.6666H31.9998C33.0932 32.6666 33.9998 33.5732 33.9998 34.6666C33.9998 35.7599 33.0932 36.6666 31.9998 36.6666H21.3332C20.2398 36.6666 19.3332 35.7599 19.3332 34.6666C19.3332 33.5732 20.2398 32.6666 21.3332 32.6666ZM42.6665 47.3332H21.3332C20.2398 47.3332 19.3332 46.4266 19.3332 45.3332C19.3332 44.2399 20.2398 43.3332 21.3332 43.3332H42.6665C43.7598 43.3332 44.6665 44.2399 44.6665 45.3332C44.6665 46.4266 43.7598 47.3332 42.6665 47.3332Z"
                        fill="#2A3858"
                      />
                    </svg>
                  </div>
                  <h4>Create Profile</h4>
                  <p>
                    Second, Make announcements explaining your work and about
                    your brand.
                  </p>
                </div>
              </div>
              <div className="col-sm-6 col-md-6 col-lg-3">
                <div className="registration-box text-center">
                  <div className="box-image">
                    <div className="images-count">3</div>
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 64 64"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M44.6666 9.49301V5.33301C44.6666 4.23967 43.76 3.33301 42.6666 3.33301C41.5733 3.33301 40.6666 4.23967 40.6666 5.33301V9.33301H23.3333V5.33301C23.3333 4.23967 22.4266 3.33301 21.3333 3.33301C20.24 3.33301 19.3333 4.23967 19.3333 5.33301V9.49301C12.1333 10.1597 8.63996 14.453 8.10663 20.8263C8.05329 21.5997 8.69329 22.2397 9.43996 22.2397H54.56C55.3333 22.2397 55.9733 21.573 55.8933 20.8263C55.36 14.453 51.8666 10.1597 44.6666 9.49301Z"
                        fill="#2A3858"
                      />
                      <path
                        d="M50.6667 40C44.7733 40 40 44.7733 40 50.6667C40 52.6667 40.56 54.56 41.5467 56.16C43.3867 59.2533 46.7733 61.3333 50.6667 61.3333C54.56 61.3333 57.9467 59.2533 59.7867 56.16C60.7733 54.56 61.3333 52.6667 61.3333 50.6667C61.3333 44.7733 56.56 40 50.6667 40ZM56.1867 49.52L50.5067 54.7733C50.1333 55.12 49.6267 55.3067 49.1467 55.3067C48.64 55.3067 48.1333 55.12 47.7333 54.72L45.0933 52.08C44.32 51.3067 44.32 50.0267 45.0933 49.2533C45.8667 48.48 47.1467 48.48 47.92 49.2533L49.2 50.5333L53.4667 46.5867C54.2667 45.84 55.5467 45.8933 56.2933 46.6933C57.04 47.4933 56.9867 48.7467 56.1867 49.52Z"
                        fill="#2A3858"
                      />
                      <path
                        d="M53.3333 26.2402H10.6667C9.2 26.2402 8 27.4402 8 28.9069V45.3336C8 53.3336 12 58.6669 21.3333 58.6669H34.48C36.32 58.6669 37.6 56.8802 37.0133 55.1469C36.48 53.6002 36.0267 51.8936 36.0267 50.6669C36.0267 42.5869 42.6133 36.0002 50.6933 36.0002C51.4667 36.0002 52.24 36.0536 52.9867 36.1869C54.5867 36.4269 56.0267 35.1736 56.0267 33.5736V28.9336C56 27.4402 54.8 26.2402 53.3333 26.2402ZM24.56 48.5602C24.0533 49.0402 23.36 49.3336 22.6667 49.3336C21.9733 49.3336 21.28 49.0402 20.7733 48.5602C20.2933 48.0536 20 47.3602 20 46.6669C20 45.9736 20.2933 45.2802 20.7733 44.7736C21.04 44.5336 21.3067 44.3469 21.6533 44.2136C22.64 43.7869 23.8133 44.0269 24.56 44.7736C25.04 45.2802 25.3333 45.9736 25.3333 46.6669C25.3333 47.3602 25.04 48.0536 24.56 48.5602ZM24.56 39.2269C24.4267 39.3336 24.2933 39.4402 24.16 39.5469C24 39.6536 23.84 39.7336 23.68 39.7869C23.52 39.8669 23.36 39.9202 23.2 39.9469C23.0133 39.9736 22.8267 40.0002 22.6667 40.0002C21.9733 40.0002 21.28 39.7069 20.7733 39.2269C20.2933 38.7202 20 38.0269 20 37.3336C20 36.6402 20.2933 35.9469 20.7733 35.4402C21.3867 34.8269 22.32 34.5336 23.2 34.7202C23.36 34.7469 23.52 34.8002 23.68 34.8802C23.84 34.9336 24 35.0136 24.16 35.1202C24.2933 35.2269 24.4267 35.3336 24.56 35.4402C25.04 35.9469 25.3333 36.6402 25.3333 37.3336C25.3333 38.0269 25.04 38.7202 24.56 39.2269ZM33.8933 39.2269C33.3867 39.7069 32.6933 40.0002 32 40.0002C31.3067 40.0002 30.6133 39.7069 30.1067 39.2269C29.6267 38.7202 29.3333 38.0269 29.3333 37.3336C29.3333 36.6402 29.6267 35.9469 30.1067 35.4402C31.12 34.4536 32.9067 34.4536 33.8933 35.4402C34.3733 35.9469 34.6667 36.6402 34.6667 37.3336C34.6667 38.0269 34.3733 38.7202 33.8933 39.2269Z"
                        fill="#2A3858"
                      />
                    </svg>
                  </div>
                  <h4>Candidate selection</h4>
                  <p>
                    Screen potential talent with our unique algorithm and find
                    the best choice for your team.
                  </p>
                </div>
              </div>
              <div className="col-sm-6 col-md-6 col-lg-3">
                <div className="registration-box text-center">
                  <div className="box-image">
                    <div className="images-count">4</div>
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 64 64"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M47.4935 14.6397V16.613L38.0535 11.1463C34.4802 9.09301 29.4935 9.09301 25.9468 11.1463L16.5068 16.6397V14.6397C16.5068 8.63967 19.7868 5.33301 25.7868 5.33301H38.2135C44.2135 5.33301 47.4935 8.63967 47.4935 14.6397Z"
                        fill="#2A3858"
                      />
                      <path
                        d="M47.5735 21.253L47.2002 21.0663L43.5735 18.9863L36.0535 14.6396C33.7602 13.3063 30.2402 13.3063 27.9468 14.6396L20.4268 18.9596L16.8002 21.093L16.3202 21.333C11.6535 24.4796 11.3335 25.0663 11.3335 30.1063V42.1597C11.3335 47.1996 11.6535 47.7863 16.4268 51.013L27.9468 57.653C29.0935 58.3463 30.5335 58.6396 32.0002 58.6396C33.4402 58.6396 34.9068 58.3197 36.0535 57.653L47.6802 50.933C52.3735 47.7863 52.6668 47.2263 52.6668 42.1597V30.1063C52.6668 25.0663 52.3468 24.4796 47.5735 21.253ZM39.4402 35.9996L37.8135 37.9996C37.5468 38.293 37.3602 38.853 37.3868 39.253L37.5468 41.813C37.6535 43.3863 36.5335 44.1863 35.0668 43.6263L32.6935 42.6663C32.3202 42.533 31.7068 42.533 31.3335 42.6663L28.9602 43.5997C27.4935 44.1863 26.3735 43.3596 26.4802 41.7863L26.6402 39.2263C26.6668 38.8263 26.4802 38.2663 26.2135 37.973L24.5602 35.9996C23.5468 34.7997 24.0002 33.4663 25.5202 33.0663L28.0002 32.4263C28.4002 32.3196 28.8535 31.9463 29.0668 31.6263L30.4535 29.493C31.3068 28.1597 32.6668 28.1597 33.5468 29.493L34.9335 31.6263C35.1468 31.973 35.6268 32.3196 36.0002 32.4263L38.4802 33.0663C40.0002 33.4663 40.4535 34.7997 39.4402 35.9996Z"
                        fill="#2A3858"
                      />
                    </svg>
                  </div>
                  <h4>Congratulations</h4>
                  <p>
                    You have completed step by step, Time to welcome your new
                    team member
                  </p>
                </div>
              </div>
            </div>
          </div>
          <button className="main-button ms-auto me-auto">Lets Start</button>
        </div>
      </section>
      <section
        className="business-section"
        style={{
          background: `#021638 url(${BASEURL}/${
            employerPageBlocks?.["employer-page-companies"]?.image || ""
          })  no-repeat`,
          backgroundSize: "contain",
          backgroundPosition: "right",
        }}
      >
        <div className="container">
          <div className="business-section-content">
            <span
              dangerouslySetInnerHTML={{
                __html:
                  employerPageBlocks?.["employer-page-companies"]
                    ?.description || "",
              }}
            />
            {/* <p className="subSmallTitle">For Companies</p>
            <h2 className="WhyTitle">Why businesses turn to Native</h2> */}

            <div className="business_box d-flex">
              <div className="img-box">
                <img src="img/star.png" className="img-fluid" alt="" />
              </div>
              <div className="box-content">
                <h6 className="business_box_listTitle">Benefit 1</h6>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                  ut purus in nulla
                </p>
              </div>
            </div>
            <div className="business_box d-flex">
              <div className="img-box">
                <img src="img/star.png" className="img-fluid" alt="" />
              </div>
              <div className="box-content">
                <h6 className="business_box_listTitle">Benefit 1</h6>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                  ut purus in nulla{" "}
                </p>
              </div>
            </div>
            <div className="business_box d-flex">
              <div className="img-box">
                <img src="img/star.png" className="img-fluid" alt="" />
              </div>
              <div className="box-content">
                <h6 className="business_box_listTitle">Benefit 1</h6>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                  ut purus in nulla{" "}
                </p>
              </div>
            </div>
            <button className="secondary-btn">Lets Start</button>
          </div>
        </div>
      </section>
      {/* pricing section */}
      <section className="pricing_wrapper pricing_block_02">
        <div className="container">
          <div className="section_head_box">
            <h3 className="section-heading">Pricing</h3>
          </div>
          <div className="pricing_content_block">
            <div className="row g-4">
              <HomePriceCard priceCardsdata={PriceCards} />
            </div>
          </div>
        </div>
      </section>

      <section className="featuresCall-section">
        <img className="features_img" src="img/features-img.png" alt="" />
        <div className="container">
          <div className="row">
            <div
              className="col-sm-12 col-md-12 col-lg-7 ms-auto"
              dangerouslySetInnerHTML={{
                __html:
                  employerPageBlocks?.["employer-page-features"]?.description ||
                  "",
              }}
            />
          </div>
        </div>
      </section>

      <section className="testimonials_section">
        <div className="container">
          <div className="row g-5">
            <div className="col-sm-12 col-md-12 col-lg-5">
              <div className="testimonials_left_box">
                <div className="section_type">
                  <svg
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.91429 13.4251L3.9121 13.4245C3.89965 13.4211 3.89362 13.4163 3.88937 13.4118C3.88397 13.406 3.87797 13.3964 3.87457 13.383C3.87117 13.3696 3.87143 13.3564 3.87422 13.3455C3.87665 13.336 3.88159 13.3254 3.89344 13.3136L10.9792 6.2278C10.9812 6.22664 10.9867 6.22417 10.9974 6.22181C11.02 6.21688 11.0572 6.21499 11.1049 6.22422L11.1049 6.22423L11.1077 6.22477C11.4696 6.29261 11.8691 6.1928 12.1595 5.91402L12.1596 5.91411L12.1675 5.9062L13.8801 4.18688C13.8802 4.18678 13.8803 4.18668 13.8804 4.18657C13.9875 4.07956 14.0717 4.02212 14.1279 3.99382C14.1475 4.05361 14.1666 4.15418 14.1666 4.30666V10.6933C14.1666 12.2572 12.8971 13.5267 11.3332 13.5267H4.66655C4.40443 13.5267 4.15636 13.4926 3.91429 13.4251Z"
                      fill="#5FA9C0"
                      stroke="#5FA9C0"
                    />
                    <path
                      d="M2.15418 11.9914L2.1542 11.9914L2.1522 11.9877C1.94705 11.6107 1.83301 11.1666 1.83301 10.6933V4.30668C1.83301 4.15419 1.85202 4.05362 1.87168 3.99384C1.92783 4.02214 2.01207 4.07957 2.11912 4.18656C2.11923 4.18667 2.11934 4.18679 2.11945 4.1869L3.83877 5.91288L3.83873 5.91292L3.84408 5.91813C4.29823 6.36064 5.03445 6.36064 5.48861 5.91813L5.48864 5.91816L5.49372 5.91307L7.87989 3.52023C7.87994 3.52019 7.87998 3.52015 7.88002 3.52011C7.94477 3.4555 8.05476 3.45554 8.11945 3.52023L9.4097 4.81048C9.47168 4.87585 9.47106 4.98819 9.40612 5.05313L2.42612 12.0331C2.34447 12.1148 2.21013 12.0963 2.15418 11.9914ZM1.81407 3.97166C1.81344 3.9716 1.81311 3.97155 1.8131 3.97154C1.81309 3.97152 1.81341 3.97155 1.81407 3.97166Z"
                      fill="#5FA9C0"
                      stroke="#5FA9C0"
                    />
                  </svg>
                  Testimonials
                </div>
                <span
                  dangerouslySetInnerHTML={{
                    __html:
                      employerPageBlocks?.["employer-page-testimonials"]
                        ?.description || "",
                  }}
                />
              </div>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-7">
              <div className="testimonials_right_box">
                <div className="swiper testimonials-slider">
                  <div className="swiper-wrapper">
                    <Swiper
                      modules={[Pagination]}
                      pagination={{
                        clickable: true,
                      }}
                      spaceBetween={50}
                    >
                      <SwiperSlide>
                        <div className="swiper-slide">
                          <div className="slide_inner_box">
                            <div className="user_img_box">
                              <img src="img/slider-user.png" alt="" />
                            </div>
                            <div className="slider_user_details">
                              <h3>Amazing!</h3>
                              <p>
                                “Native is a great platform for us, with Native
                                we can do recruitment easily and quickly so that
                                we can get qualified candidates. thanks Native.”
                              </p>
                              <div className="name_rating">
                                <h4>Kevin Gerraghty</h4>
                                <div className="star_rating">
                                  <i className="fas fa-star"></i>
                                  <i className="fas fa-star"></i>
                                  <i className="fas fa-star"></i>
                                  <i className="fas fa-star"></i>
                                  <i className="fas fa-star"></i>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                      <SwiperSlide>
                        <div className="swiper-slide">
                          <div className="slide_inner_box">
                            <div className="user_img_box">
                              <img src="img/slider-user.png" alt="" />
                            </div>
                            <div className="slider_user_details">
                              <h3>Amazing!</h3>
                              <p>
                                “Native is a great platform for us, with Native
                                we can do recruitment easily and quickly so that
                                we can get qualified candidates. thanks Native.”
                              </p>
                              <div className="name_rating">
                                <h4>Kevin Gerraghty</h4>
                                <div className="star_rating">
                                  <i className="fas fa-star"></i>
                                  <i className="fas fa-star"></i>
                                  <i className="fas fa-star"></i>
                                  <i className="fas fa-star"></i>
                                  <i className="fas fa-star"></i>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                      <SwiperSlide>
                        <div className="swiper-slide">
                          <div className="slide_inner_box">
                            <div className="user_img_box">
                              <img src="img/slider-user.png" alt="" />
                            </div>
                            <div className="slider_user_details">
                              <h3>Amazing!</h3>
                              <p>
                                “Native is a great platform for us, with Native
                                we can do recruitment easily and quickly so that
                                we can get qualified candidates. thanks Native.”
                              </p>
                              <div className="name_rating">
                                <h4>Kevin Gerraghty</h4>
                                <div className="star_rating">
                                  <i className="fas fa-star"></i>
                                  <i className="fas fa-star"></i>
                                  <i className="fas fa-star"></i>
                                  <i className="fas fa-star"></i>
                                  <i className="fas fa-star"></i>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                      <SwiperSlide>
                        <div className="swiper-slide">
                          <div className="slide_inner_box">
                            <div className="user_img_box">
                              <img src="img/slider-user.png" alt="" />
                            </div>
                            <div className="slider_user_details">
                              <h3>Amazing!</h3>
                              <p>
                                “Native is a great platform for us, with Native
                                we can do recruitment easily and quickly so that
                                we can get qualified candidates. thanks Native.”
                              </p>
                              <div className="name_rating">
                                <h4>Kevin Gerraghty</h4>
                                <div className="star_rating">
                                  <i className="fas fa-star"></i>
                                  <i className="fas fa-star"></i>
                                  <i className="fas fa-star"></i>
                                  <i className="fas fa-star"></i>
                                  <i className="fas fa-star"></i>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    </Swiper>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Index;

export async function getServerSideProps(context) {
  createAxiosCookies(context);
  let data = await getEmployerPageData();

  return {
    props: {
      ...data,
      isProtected: null,
    },
  };
}
