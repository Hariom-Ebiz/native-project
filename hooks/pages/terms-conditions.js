import { getTermAndConditionsPageData } from "@/services/cms";
import React from "react";
import { createAxiosCookies } from "@/fn";
import PublicLayout from "@/components/layout/PublicLayout";

const TermsConditions = ({ termAndConditionsPageBlocks }) => {
  return (
    <PublicLayout>
      <section className="section-padding">
        <div className="container">
          <div className="page_heading_Box">
            <h1 className="sec_heading">{termAndConditionsPageBlocks.title}</h1>
          </div>
        </div>
      </section>
      <section className="section-padding pt-0">
        <div
          className="container"
          dangerouslySetInnerHTML={{
            __html: termAndConditionsPageBlocks?.description,
          }}
        />
        {/* <div className="cmsContent">
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
                    has been the industry's standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a type specimen book. It has
                    survived not only five centuries, but also the leap into electronic typesetting,
                    remaining essentially unchanged. It was popularised in the 1960s with the release of
                    Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
                    publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

                <h2>Lorem Ipsum is simply dummy text</h2>

                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
                    has been the industry's standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a type specimen book. It has
                    survived not only five centuries, but also the leap into electronic typesetting,
                    remaining essentially unchanged. It was popularised in the 1960s with the release of
                    Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
                    publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

                <h2>Lorem Ipsum is simply dummy text</h2>

                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
                    has been the industry's standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a type specimen book. It has
                    survived not only five centuries, but also the leap into electronic typesetting,
                    remaining essentially unchanged. It was popularised in the 1960s with the release of
                    Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
                    publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

                <h3>Lorem Ipsum is simply dummy text</h3>

                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
                    has been the industry's standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a type specimen book. It has
                    survived not only five centuries, but also the leap into electronic typesetting,
                    remaining essentially unchanged. It was popularised in the 1960s with the release of
                    Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
                    publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

                <h4>Lorem Ipsum is simply dummy text</h4>

                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
                    has been the industry's standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a type specimen book. It has
                    survived not only five centuries, but also the leap into electronic typesetting,
                    remaining essentially unchanged. It was popularised in the 1960s with the release of
                    Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
                    publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

                <h5>Lorem Ipsum is simply dummy text</h5>

                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
                    has been the industry's standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a type specimen book. It has
                    survived not only five centuries, but also the leap into electronic typesetting,
                    remaining essentially unchanged. It was popularised in the 1960s with the release of
                    Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
                    publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

                <h6>Lorem Ipsum is simply dummy text</h6>

                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
                    has been the industry's standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a type specimen book. It has
                    survived not only five centuries, but also the leap into electronic typesetting,
                    remaining essentially unchanged. It was popularised in the 1960s with the release of
                    Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
                    publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

                <ul>
                    <li>Lorem Ipsum is simply dummy text</li>
                    <li>Lorem Ipsum is simply dummy text</li>
                    <li>Lorem Ipsum is simply dummy text</li>
                    <li>Lorem Ipsum is simply dummy text</li>
                    <li>Lorem Ipsum is simply dummy text</li>
                </ul>

                <h3>Lorem Ipsum is simply dummy text</h3>

                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
                    has been the industry's standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a type specimen book. It has
                    survived not only five centuries, but also the leap into electronic typesetting,
                    remaining essentially unchanged. It was popularised in the 1960s with the release of
                    Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
                    publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

                <ol>
                    <li>Lorem Ipsum is simply dummy text</li>
                    <li>Lorem Ipsum is simply dummy text</li>
                    <li>Lorem Ipsum is simply dummy text</li>
                    <li>Lorem Ipsum is simply dummy text</li>
                    <li>Lorem Ipsum is simply dummy text</li>
                </ol>
            </div> */}
        {/* </div> */}
      </section>
    </PublicLayout>
  );
};

export async function getServerSideProps(context) {
    createAxiosCookies(context);
  let data = await getTermAndConditionsPageData();

  return {
    props: { ...data, isProtected : null },
  };
}

export default TermsConditions;
