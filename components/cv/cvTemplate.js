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
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const Title = ({ children }) => <Text style={styles.title}>{children}</Text>;


const styles = StyleSheet.create({
  body: {
    fontFamily: "EB Garamond, serif",
    paddingLeft: "15px",
    paddingRight: "15px",
    paddingTop: 25, // Adjust as needed
    paddingBottom: 30, // Adjust as needed
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
    // fontWeight: "400",
  },
  dis_text_email: {
    fontSize: 11,
    // fontWeight: "400",
    color: "rgb(61 205 175)",
  },
  dis_text_linkedin: {
    fontSize: 11,
    fontWeight: "400",
    color: "rgb(61 205 175)",
  },
  dis_text_about: {
    fontSize: 11,
    // color: "rgb(108 108 108)",
    // fontWeight: "400",
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
  right_block:  {
    minWidth: 170,
    flex: "0 0 170",
    paddingLeft: 30,
    

    
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
    fontSize: 12,
    color: "#000",
    fontWeight: "900",
    display: "block",
    paddingBottom: 5,
    paddingLeft: 20,
  },
  sub_heading_edu: {
    fontSize: 11,
    color: "#000",
    // fontWeight: "700",
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
  sub_text_experience: {
    fontSize: 10,
    paddingLeft: 40,
    // marginBottom: 10,
  },
  text_size: {
    display: "block",
    paddingLeft: 20,
    fontSize: 10,
    marginTop: 5,
    // marginBottom: 10,
  },
  date_text: {
    fontSize: 10,
    color: "grey",
    fontWeight: "400",
    display: "block",
    paddingLeft: 20,
    marginBottom: 7,
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
   pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
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
  sub_new_bottom: {
    marginBottom: 15,
  },
});


const listStyles = StyleSheet.create({
  item: {
    flexDirection: "row",
    // marginBottom: 5,
  },
  bulletPoint: {
    width: 10,
    fontSize: 8,
  },
  itemContent: {
    flex: 1,
    fontSize: 10,
    // marginBottom: 10,
  },
});

const List = ({ children }) => children;

const Item = ({ children }) => (
  <View style={listStyles.item}>
    <Text style={listStyles.bulletPoint}>•</Text>
    <Text style={listStyles.itemContent}>{children}</Text>
  </View>
);

const Itemrepo = ({ children }) => (
  <View style={listStyles.item}>
    <Text style={listStyles.bulletPoint}>•</Text>
    <Text style={listStyles.itemContent}>{children}</Text>
  </View>
);

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

  const phoneNumber = parsePhoneNumberFromString("+"+generalData?.contact_mobile)
  Font.registerHyphenationCallback(word => {
    // const middle = Math.floor(word.length / 2);
    // const parts = word.length === 1 ? [word] : [word.substr(0, middle), word.substr(middle)];
    // // Check console to see words parts
    // console.log(word, parts);
    return [word];
  });
 
  return (
    <Document>
      <Page wrap size="A4" style={styles.body}>
        <View style={styles.header_block}>
          <View>
            <Image
              src={`${API}/${generalData.profile_pic}`}
              style={styles.profile_img}
            />
          </View>
          <View>
            <Text style={{...styles.tittle_heading_profile, "textTransform": "capitalize"}}>
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
                  let newVal = val?.achievements
                    .split("\n")
                    .filter((val) => val.trim().length > 0);
                  let newAchive = val?.responsibilities
                    .split("\n")
                    .filter((val) => val.trim().length > 0);
                  return (
                    <Fragment key={val.id}>
                      <View style={styles.sub_new_bottom}>
                        <Text style={styles.sub_heading_his}>
                          {val?.job_title} at {val?.company_name},{" "}
                          {val.city_name}, {val?.country_name}
                        </Text>
                        <View style={styles.item_block}>
                          <Text style={styles.sub_text}>
                            {moment(val?.start_date).format("MMMM YYYY")} -{" "}
                            {val?.end_date
                              ? moment(val?.end_date).format("MMMM YYYY")
                              : "Present"}
                          </Text>
                        </View>
                        {
                          newAchive.length > 0 && (
                            <>
                              <Text style={styles.text_size}>Responsibilites :-</Text>
                              <View style={styles.sub_text_experience}>
                                <List>
                                  {newAchive.map((item, idx) => (
                                    <Itemrepo key={idx}>{item}</Itemrepo>
                                  ))}
                                </List>
                              </View>
                            </>
                          )
                        }

                        {
                          newVal.length > 0 && (
                            <>
                              <Text style={styles.text_size}>Achievements :-</Text>
                              <View style={styles.sub_text_experience}>
                                <List>
                                  {newVal.map((item, idx) => (
                                    <Item key={idx}>{item}</Item>
                                  ))}
                                </List>
                              </View>
                            </>
                          )
                        }
                      </View>
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
                        <View style={styles.sub_new_bottom}>
                          {/* <Text style={listStyles.bulletPoint}>•</Text> */}

                          <Text style={{...styles.sub_heading_edu, fontWeight: "bold"}}>
                            {/* •{" "} */}
                            {val.degree_level_name ||
                              val.other_degree_level ||
                              val.degree_level}
                            , {val.field_of_study || val.other_field_of_study},{" "}
                            {val.university_name}, {val.country_name}
                          </Text>
                          <Text style={styles.date_text}>
                            {val.start_year} - {val.end_year}
                          </Text>
                          <Text style={styles.sub_text_education}>
                            • Grade ({val.grade_name || val.other_grade})
                          </Text>
                          {/* <Text style={styles.sub_text_education}>
                    - Degree level (
                    {val.degree_level_name ||
                      val.other_degree_level ||
                      val.degree_level}
                    )
                  </Text> */}
                        </View>
                      </Fragment>
                    );
                  })}

                {universityData &&
                  universityData.length > 0 &&
                  universityData.map((val) => {
                    return (
                      <Fragment key={val.id}>
                        <View style={styles.sub_new_bottom}>
                          {/* <Text style={listStyles.bulletPoint}>•</Text> */}

                          <Text style={{...styles.sub_heading_edu, fontWeight: "bold"}}>
                            {/* •{" "} */}
                            {val.degree_level_name ||
                              val.other_degree_level ||
                              val.degree_level}
                            , {val.field_of_study || val.other_field_of_study},{" "}
                            {val.university_name}, {val.country_name}
                          </Text>
                          <Text style={styles.date_text}>
                            {val.start_year} - {val.end_year}
                          </Text>
                          <Text style={styles.sub_text_education}>
                            • Grade ({val.grade_name || val.other_grade})
                          </Text>
                          {/* <Text style={styles.sub_text_education}>
                    - Degree level (
                    {val.degree_level_name ||
                      val.other_degree_level ||
                      val.degree_level}
                    )
                  </Text> */}
                        </View>
                      </Fragment>
                    );
                  })}

                {educationData && (
                  <>
                    <View style={styles.sub_new_bottom}>
                      {/* <Text style={listStyles.bulletPoint}>•</Text> */}
                      <Text style={{...styles.sub_heading_edu, fontWeight: "bold"}}>
                        {/* •{" "} */}
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
                        • Grade (
                        {educationData?.grade_name ||
                          educationData?.graduation_other_grade ||
                          educationData?.grade}
                        )
                      </Text>
                    </View>
                  </>
                )}
              </>
            )}
            {certificationData && certificationData.length > 0 && (
              <>
                <Text style={styles.tittle_heading}>
                  <Image src="/img/pdficon6.png" style={styles.img_style} />
                  &nbsp;&nbsp;Certifications
                </Text>

                {certificationData?.map((val) => {
                  return (
                    <Fragment key={val.id}>
                      <View style={styles.sub_new_bottom}>
                        <Text style={styles.sub_heading_edu}>
                          {val.field_of_study_name ||
                            val.other_field_of_study ||
                            val.field_of_study}
                          , {(val?.topic) ? `${(val?.topic)}, ` : ""}
                          {val.organisation_name}, {val.country_name}
                        </Text>
                        <Text style={styles.date_text}>
                          {val?.graduation_year}
                        </Text>
                        {/* <Text style={styles.sub_text_education}>Topic ()</Text> */}
                      </View>
                    </Fragment>
                  );
                })}
              </>
            )}

                <Text style={styles.tittle_heading}>
                  <Image src="/img/personal-info-icon.png" style={styles.img_style} />
                  &nbsp;&nbsp;Personal Information
                </Text>
                <View style={styles.sub_new_bottom}>

                  <Text style={styles.sub_heading_edu}>
                    <Text style={{ fontSize: 12, fontWeight:900 }}>
                      Date of Birth : </Text>
                      <Text> {moment(generalData?.dob).format("MMMM DD, YYYY")} </Text>
                  </Text>
                  <Text style={{ ...styles.sub_heading_edu, "textTransform": "capitalize" }}>
                    <Text style={{ fontSize: 12 ,fontWeight:900 }}>Nationality : </Text> 
                    <Text>{generalData?.nationality_name}</Text>
                  </Text>
                  <Text style={{ ...styles.sub_heading_edu, "textTransform": "capitalize" }}>
                    <Text style={{ fontSize: 12,fontWeight:900 }}>Marital status : </Text> 
                    <Text>{generalData?.martial_status}</Text>
                  </Text>
                </View>
          </View>

          <View style={styles.right_block} >

            {/* <Text style={styles.tittle_heading}>Personal Information</Text>
            <Text style={{ ...styles.dis_text, ...styles.aera_location }}>
              {moment(generalData?.dob).format("MMMM DD, YYYY")}
            </Text>
            <Text style={{ ...styles.dis_text, ...styles.aera_location, "textTransform": "capitalize" }}>
             {generalData?.nationality_name}, {generalData?.martial_status}
            </Text> */}


            <Text style={{ ...styles.top_space, ...styles.tittle_heading}}>Contact Details</Text>
            <Text style={{ ...styles.dis_text, ...styles.aera_location }}>
              {generalData?.current_area_name || generalData?.current_other_area},
            </Text>
            <Text style={{ ...styles.dis_text, ...styles.aera_location }}>
              {generalData?.current_city_name},{" "}
              {generalData?.current_country_name}
            </Text>
            {/* <Text style={{ ...styles.dis_text, ...styles.aera_location }}>
              {generalData?.current_country_name}
            </Text> */}

            <Text style={{ ...styles.dis_text, ...styles.aera_location }}>
              {phoneNumber.formatInternational() || "--"}
            </Text>
          <Text style={{ ...styles.dis_text_email, marginTop: "5px", fontSize: 12,wordBreak: 'break-all' }}>
              {generalData?.contact_email || "--"}
            </Text>
          <Text style={{ ...styles.dis_text_email, marginTop: "5px", fontSize: 12, wordBreak: 'break-all' }} numberOfLines={0}>
            {generalData.linked_in.split("").map((s, idx) => {
              return <Text key={idx}>{s}</Text>
            })}

            </Text>

            {
              skillsData.length > 0 && (
                <>
                
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
                
                </>
              )
            }

            {
              languagesData.length > 0 && (
                <>
                  <Text style={{ ...styles.top_space, ...styles.tittle_heading }}>
                    Languages
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
                </>
              )
            }
          </View>
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `${pageNumber} / ${totalPages}`
          )} fixed />
      </Page>
    </Document>
  );
};

export default CvTemplate;