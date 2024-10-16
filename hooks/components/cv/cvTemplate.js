import React, { Fragment } from "react";

import {
  Text,
  Font,
  Page,
  View,
  Image,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";
import { API } from "@/api";
import moment from "moment";
import { getLatestCompany, timeGapYearMonth } from "@/utils/helper";

const Title = ({ children }) => <Text style={styles.title}>{children}</Text>;

const styles = StyleSheet.create({
  page: {
    padding: "15px",
    // flexDirection: "row",
  },
  tittle_heading: {
    fontSize: 14,
    color: "#000",
    fontWeight: "900",
    display: "block",
    marginTop: 20,
    marginBottom: 5,
    // marginLeft : 5
  },

  tittle_heading_profile: {
    fontSize: 18,
    color: "#000",
    fontWeight: "900",
    display: "block",
  },
  dis_text: {
    fontSize: 11,
    // color: "rgb(108 108 108)",
    fontWeight: "400",
  },
  dis_text_email: {
    fontSize: 11,
    fontWeight: "400",
    color: "rgb(61 205 175)",
  },
  dis_text_about: {
    fontSize: 11,
    // color: "rgb(108 108 108)",
    fontWeight: "400",
  },

  text_color: {
    color: "gray",
  },

  inner_wrapper: {
    display: "flex",
    flexDirection: "row",
  },
  left_block: {
    minWidth: 400,
    flex: "0 0 400",
  },
  right_block: {
    minWidth: 170,
    flex: "0 0 170",
    paddingLeft: 30,
    marginLeft: "auto",
  },
  img_style: {
    width: 11,
    height: 11,
    paddingRight: 10,
  },
  sub_heading: {
    fontSize: 13,
    color: "#000",
    fontWeight: "700",
    display: "block",
    paddingBottom: 5,
  },
  sub_heading_his: {
    fontSize: 11,
    color: "#000",
    fontWeight: "700",
    display: "block",
    paddingBottom: 5,
    paddingLeft: 20,
  },
  sub_heading_edu: {
    fontSize: 11,
    color: "#000",
    fontWeight: "700",
    display: "block",
    paddingLeft: 20,
    marginTop: 5,
    paddingBottom: 5,
  },
  sub_heading_skills: {
    fontSize: 11,
    color: "#000",
    fontWeight: "700",
    display: "block",
    paddingBottom: 10,
    paddingTop: 10,
  },
  left_space: {
    paddingLeft: 20,
  },
  item_block: {
    flexDirection: "row",
    gap: 7,
    paddingLeft: 20,
    // marginTop: 5,
  },
  sub_text: {
    fontSize: 10,
    color: "grey",
  },
  sub_text_education: {
    fontSize: 10,
    paddingLeft: 20,
  },
  sub_text_experience :{
    fontSize: 10,
    paddingLeft: 40,
  },
  text_size: {
    display: "block",
    paddingLeft: 20,
    fontSize: 10,
    marginTop: 5,
  },
  date_text: {
    fontSize: 10,
    color: "grey",
    fontWeight: "400",
    display: "block",
    paddingLeft: 20,
    // marginTop: 3,
  },
  top_space: {
    paddingTop: 15,
  },
  progress_container: {
    width: "100%",
    backgroundColor: "#e9ecef",
    display: "block",
  },

  // blue_back: {
  //   width: "60%",
  //   display: "block",
  //   backgroundColor: "#56cdad",
  //   color: "blue",
  //   height: 5,
  // },
  header_block: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  profile_img: {
    width: 50,
    height: 50,
    borderRadius: 7,
  },
  aera_location: {
    marginBottom: 5,
  },
});

const skillLevel = {
  basic: "25%",
  average: "50%",
  good: "75%",
  expert: "100%",
};

const CvTemplate = ({
  data: {
    generalData,
    languagesData,
    careerPrefrenceData,
    certificationData,
    educationData,
    postGraduationData,
    skillsData,
    universityData,
    workExperienceData,
  },
}) => {
  let latestCompany = getLatestCompany(workExperienceData);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header_block}>
          <View>
            <Image
              src={`${API}/${generalData.profile_pic}`}
              style={styles.profile_img}
            />
          </View>
          <View>
            <Text style={styles.tittle_heading_profile}>
              {generalData?.first_name} {generalData?.last_name}
            </Text>
            <Text style={{ ...styles.dis_text, ...styles.text_color }}>
              {latestCompany?.job_title}
            </Text>
          </View>
        </View>
        <View style={styles.inner_wrapper}>
          <View style={styles.left_block}>
            {generalData?.about && (
              <>
                <Text style={styles.tittle_heading}>
                  <Image src="/img/pdfuser.png" style={styles.img_style} />
                  &nbsp;&nbsp;Profile
                </Text>
                <Text
                  style={{ ...styles.dis_text_about, ...styles.left_space }}
                >
                  {generalData?.about}
                </Text>
              </>
            )}

            {workExperienceData.length > 0 && (
              <>
                <Text style={styles.tittle_heading}>
                  <Image src="/img/pdficon.png" style={styles.img_style} />
                  &nbsp;&nbsp;Employment History
                </Text>

                {workExperienceData?.map((val) => {
                  return (
                    <Fragment key={val.id}>
                      <Text style={styles.sub_heading_his}>
                        {val?.job_title} at {val?.company_name}, {val.city_name}
                        , {val?.country_name}
                      </Text>
                      <View style={styles.item_block}>
                        <Text style={styles.sub_text}>
                          {moment(val?.start_date).format("MMMM YYYY")} -{" "}
                          {val?.end_date
                            ? moment(val?.end_date).format("MMMM YYYY")
                            : "Present"}
                        </Text>
                        {/* <Text style={styles.sub_text}>
                      {val?.end_date
                        ? moment(val?.end_date).format("MMMM YYYY")
                        : "Present"}
                    </Text> */}
                      </View>
                      <Text style={styles.text_size}>Achievement :-</Text>
                      <Text style={styles.sub_text_experience}>
                        {val?.achievements}
                      </Text>
                      <Text style={styles.text_size}>Responsibilites :-</Text>
                      <Text style={styles.sub_text_experience}>
                        {val?.responsibilities}
                      </Text>
                    </Fragment>
                  );
                })}
              </>
            )}

            {(postGraduationData.length > 0 ||
              universityData.length > 0 ||
              educationData) && (
              <>
                <Text style={styles.tittle_heading}>
                  <Image src="/img/pdficon5.png" style={styles.img_style} />
                  &nbsp;&nbsp;Education
                </Text>

                {postGraduationData &&
                  postGraduationData.length > 0 &&
                  postGraduationData.map((val) => {
                    return (
                      <Fragment key={val.id}>
                        <Text style={styles.sub_heading_edu}>
                          {val.degree_level_name ||
                            val.other_degree_level ||
                            val.degree_level}
                          , {val.university_name}, {val.country_name}
                        </Text>
                        <Text style={styles.date_text}>
                          {val.start_year} - {val.end_year}
                        </Text>
                        <Text style={styles.sub_text_education}>
                          Grade ({val.grade_name || val.other_grade})
                        </Text>
                        {/* <Text style={styles.sub_text_education}>
                    - Degree level (
                    {val.degree_level_name ||
                      val.other_degree_level ||
                      val.degree_level}
                    )
                  </Text> */}
                      </Fragment>
                    );
                  })}

                {universityData &&
                  universityData.length > 0 &&
                  universityData.map((val) => {
                    return (
                      <Fragment key={val.id}>
                        <Text style={styles.sub_heading_edu}>
                          {val.degree_level_name ||
                            val.other_degree_level ||
                            val.degree_level}
                          , {val.university_name}, {val.country_name}
                        </Text>
                        <Text style={styles.date_text}>
                          {val.start_year} - {val.end_year}
                        </Text>
                        <Text style={styles.sub_text_education}>
                          Grade ({val.grade_name || val.other_grade})
                        </Text>
                        {/* <Text style={styles.sub_text_education}>
                    - Degree level (
                    {val.degree_level_name ||
                      val.other_degree_level ||
                      val.degree_level}
                    )
                  </Text> */}
                      </Fragment>
                    );
                  })}

                {educationData && (
                  <>
                    <Text style={styles.sub_heading_edu}>
                      {educationData?.graduation_certificate_name ||
                        educationData?.graduation_other_certificate ||
                        educationData?.graduation_certificate}
                      , {educationData?.high_school_name},{" "}
                      {educationData?.country_name}
                    </Text>
                    <Text style={styles.date_text}>
                      {educationData?.graduation_year}
                    </Text>
                    <Text style={styles.sub_text_education}>
                      Grade (
                      {educationData?.grade_name ||
                        educationData?.graduation_other_grade ||
                        educationData?.grade}
                      )
                    </Text>
                  </>
                )}
              </>
            )}
            {certificationData && certificationData.length > 0 && (
              <>
                <Text style={styles.tittle_heading}>
                  <Image src="/img/pdficon6.png" style={styles.img_style}/>
                   &nbsp;&nbsp;Certification
                </Text>

                {certificationData?.map((val) => {
                  return (
                    <Fragment key={val.id}>
                      <Text style={styles.sub_heading_edu}>
                        {val.field_of_study_name ||
                          val.other_field_of_study ||
                          val.field_of_study}
                        , {val.organisation_name}, {val.country_name}
                      </Text>
                      <Text style={styles.date_text}>
                        {val?.graduation_year}
                      </Text>
                      <Text style={styles.sub_text_education}>
                        Topic ({val?.topic_name || val?.other_topic})
                      </Text>
                    </Fragment>
                  );
                })}
              </>
            )}
          </View>

          <View style={styles.right_block}>
            <Text style={styles.tittle_heading}>Details</Text>
            <Text style={{ ...styles.dis_text, ...styles.aera_location }}>
              {generalData?.current_area_name || generalData?.current_other_area},
            </Text>
            <Text style={{ ...styles.dis_text, ...styles.aera_location }}>
              {generalData?.current_city_name},
            </Text>
            <Text style={{ ...styles.dis_text, ...styles.aera_location }}>
              {generalData?.current_country_name}
            </Text>

            <Text style={{ ...styles.dis_text, ...styles.aera_location }}>
              (+2) {generalData?.contact_mobile}
            </Text>
            <Text style={styles.dis_text_email}>
              {generalData?.contact_email}
            </Text>

            <Text style={{ ...styles.top_space, ...styles.tittle_heading }}>
              Skills
            </Text>
            {skillsData?.map((val) => {
              return (
                <Fragment key={val.id}>
                  <Text style={styles.sub_heading_skills}>
                    {val.skill_name}
                  </Text>
                  <View style={styles.progress_container}>
                    <View
                      style={{
                        width: [`${skillLevel[val.level]}`],
                        display: "block",
                        backgroundColor: "#56cdad",
                        color: "blue",
                        height: 5,
                      }}
                    ></View>
                  </View>
                </Fragment>
              );
            })}
            <Text style={{ ...styles.top_space, ...styles.tittle_heading }}>
              Language
            </Text>

            {languagesData.map((val) => {
              return (
                <Fragment key={val.id}>
                  <Text style={styles.sub_heading_skills}>
                    {val.language_name}
                  </Text>
                  <View style={styles.progress_container}>
                    <View
                      style={{
                        width: [`${skillLevel[val.level]}`],
                        display: "block",
                        backgroundColor: "#56cdad",
                        color: "blue",
                        height: 5,
                      }}
                    ></View>
                  </View>
                </Fragment>
              );
            })}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CvTemplate;
