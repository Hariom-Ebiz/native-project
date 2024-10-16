import { getAboutUsPageData } from "@/services/cms";
import React from "react";
import { createAxiosCookies } from "@/fn";
import PublicLayout from "@/components/layout/PublicLayout";

const AboutUs = ({ aboutUsPageBlocks }) => {
  //console.log("aboutUsPageBlocks", aboutUsPageBlocks);
  return (
    <PublicLayout>
      <section className="section-padding">
        <div className="container">
          <div className="page_heading_Box">
            <h1 className="sec_heading">{aboutUsPageBlocks.title}</h1>
          </div>
        </div>
      </section>
      <section className="section-padding pt-0">
        <div
          className="container"
          dangerouslySetInnerHTML={{
            __html: aboutUsPageBlocks?.description,
          }}
        />
        {/* <div className="cmsContent">
                <img src="img/find-great.png" alt="" style={{width:"700px",height:"540px",borderRadius:"20px",float:"left",marginRight:"40px",marginBottom:"20px",objectFit:"cover"}}/>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                    <h2>Lorem Ipsum is simply dummy text </h2>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>                                       
                    <h2>Lorem Ipsum is simply dummy text </h2>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>                           
                    <h3>Lorem Ipsum is simply dummy text </h3>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>                           
                <h4>Lorem Ipsum is simply dummy text </h4>
                <img src="img/find-great.png" alt="" style={{width: "500px",height: "340px",borderRadius:"20px",float: "right",marginLeft:"40px",marginBottom:"20px",objectFit: "cover"}}/>                             
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>                           
                    <h5>Lorem Ipsum is simply dummy text </h5>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>                           
                    <h6>Lorem Ipsum is simply dummy text </h6>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                <h3>Lorem Ipsum is simply dummy text </h3>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                </div> */}
        {/* </div> */}
      </section>
    </PublicLayout>
  );
};

export async function getServerSideProps(context) {
  createAxiosCookies(context);
  let data = await getAboutUsPageData();

  return {
    props: { ...data, isProtected : null, },
  };
}

export default AboutUs;
