import Link from "next/link";
import React from "react";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import 'swiper/css/pagination';
import { Navigation, Pagination } from "swiper";
import { API, BASEURL } from "@/api";

const HomeGateCards = ({ GateCarddata }) => {

  const [allCardsData,setAllCardsData] = useState(GateCarddata)

   const showAllReadData = (name) => {
       let newAllCardsData = [...allCardsData]
       let index =  newAllCardsData.findIndex((item)=> item.title == name )
        newAllCardsData[index].isRead = !newAllCardsData[index].isRead
        setAllCardsData(newAllCardsData)
   }
  return (
    <>
     <div
        style={{ position: "relative", bottom: "130px" }}
        id="ourgatessection"
      ></div>
           <Swiper
                  breakpoints={{
                    0: {
                      slidesPerView: 1,
                      spaceBetween: 20,
                    },
                
                    768: {
                      slidesPerView: 2,
                      spaceBetween: 30,
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
                    className="getsswiper"
                  >
      {allCardsData.map((data, i) => {
        console.log("data ",data)
        return (
          <div className="gates_block_swiper" key={i}>
                <>
                    <SwiperSlide>  
                    <div className="inner_card">
                      <div className={`our_gates_card ${i == 1 ? "active" : ""}`}>
                        <div className="our_gates_catego">
                          <figure className="ourGates_img_box">
                            {/* <img src={data.image} alt="" /> */}
                            <img src={API + "/" + data.image} />
                          </figure>
                          {/* <h4 className="ourGates_card_title">{data?.title?.split(" ")[2] ?? ""+" "+data?.title?.split(" ")[3]}</h4> */}
                          <h4 className="ourGates_card_title">{data?.title}</h4>
                          {/* <p className="ourGates_card_desc">{i == 0 ? data.description.substr(0,data.isRead?500:251): data.description.substr(0,data.isRead?500:229)} </p> */}
                          <p className="ourGates_card_desc" dangerouslySetInnerHTML={{__html: i == 0 ? data.description?.substr(0,data.isRead?500:251): data.description?.substr(0,data.isRead?500:229)}}
                />
                        {
                          (data?.description?.length > 230) ? (

                            <button className="read_more_btn" onClick={() =>showAllReadData(data?.title)}>{!data?.isRead ? "Read More":"Read Less"}</button>
                          ) : ""
                        }
                        </div>
                        <div className="ourGates_btn_box">
                          <Link href={data.path} className="ourGates_btn">
                            {data.button}
                          </Link>
                        </div>
                      </div>
                    </div>
                   </SwiperSlide>
                    {/* <SwiperSlide>Slide 2</SwiperSlide>
                    <SwiperSlide>Slide 3</SwiperSlide> */}
                   
                
                </>     
            </div>
       
        );
      })}
      </Swiper>
    </>
  );
};

export default HomeGateCards;
