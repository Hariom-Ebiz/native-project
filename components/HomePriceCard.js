import Link from "next/link";
import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import 'swiper/css/pagination';
import { Navigation, Pagination } from "swiper";
const HomePriceCard = ({ priceCardsdata }) => {
  return (
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
                      spaceBetween: 30,
                    },
                    }}
                    slidesPerView={3}
                    spaceBetween={30}
                    pagination={{
                      clickable: true,
                    }}
                    modules={[Pagination]}
                    className="pricingswiper"
                  >
                   
                   
      {priceCardsdata.map((data, i) => {
        return (
          <SwiperSlide  key={i}>
            <div className={`pricing_card_box ${i == 1 ? "active" : ""}`}>
              <div className="pricing_category">
                <Link href="/employer/login" className="pricing_most_btn">
                  {data.pricePopular}
                </Link>
                <figure className="pricing_img_box">
                  <img src={data.priceImage} alt="" />
                </figure>
                <h3 className="pricing_someName">{data.priceName}</h3>
                <span className="pricing_price_box">{data.price}</span>
                <span className="pricing_month_text">{data.priceMonth}</span>
              </div>
              <ul className="pricing_item_box">
                {data?.priceListing?.map((list, i) => {
                  return <li key={i}>{list}</li>;
                })}
              </ul>
              <div className="pricing_btn_box">
                <Link href="/employer/login" className="pricing_btn">
                  {data.button}
                </Link>
              </div>
            </div>
          
          </SwiperSlide>
        );
      })}
      </Swiper> 

    </>
  );
};

export default HomePriceCard;
