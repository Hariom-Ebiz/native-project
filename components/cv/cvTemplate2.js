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



Font.register({
    family: "EB Garamond, serif",
    fonts: [
        {
            src: "/font/EBGaramond-VariableFont_wght.ttf"
        },
        {
            src: "/font/EBGaramond-ExtraBold.ttf"
        },
        {
            src: "/font/EBGaramond-MediumItalic.ttf",
            fontStyle: "italic"
        }
    ]
});

const styles = StyleSheet.create({
    templateBody: {
        fontFamily: "EB Garamond, serif",
        margin: 0,
        backgroundColor: "#eceff7",
        padding: "0",
        margin: "0 auto",
        display: "block",
        maxWidth: "1000px"
    },
    p: {
        width: "100%",
        display: " -webkit-inline-box"
    },
    container: {
        backgroundColor: "#fff",
        padding: "0 30px",
        display: "block"
    },

    heading: { "fontWeight": "bold", "fontSize": "16px", "color": "#423e3e", "margin": "0" },

    section: {
        "display": "-webkit-inline-box",
        "paddingBottom": "10px",
        "display": "block",
        "borderBottom": "1px solid #000",
        "marginBottom": "20px"
    },

    profileSection: {
        "display": "-webkit-inline-box",
        "display": "flex",
        flexDirection: "row",
        "borderBottom": "1px solid #000",
        "paddingBottom": "20px",
        "marginBottom": "20px"
    },

    profileName: { "textAlign": "center", "display": "block", "fontSize": "28px", "margin": "0", "fontWeight": "bold", "textTransform": "capitalize" },
    profileBioView: { "margin": "10 0", "fontSize": "12px" },
    profileBio: { "width": "100%", "textAlign": "center", "display": "block" },

    profileSummaryView: { "display": "-webkit-inline-box", "display": "flex", "borderBottom": "1px solid #000", "paddingBottom": "20px", "marginBottom": "20px" },

    flexWidth20: {
        width: "20%"
    },

    flexWidth80: {
        width: "80%"
    },

    profileSummary: { "margin": "0", "fontSize": "12px", "color": "#423e3e" },

    employmentHeading: { "paddingBottom": "10", "display": "block" },

    employementView: {
        "display": "-webkit-inline-box",
        "display": "flex",
        flexDirection: "row",
        "paddingBottom": "10px",
        "marginBottom": "10px",
        "width": "100%"
    },

    employementViewLeftSecion: { "width": "20%", "fontSize": "10px" },


    employementViewMiddleSecion: { "width": "70%", "marginTop": "-2px" },
    employmentmiddleCollageName: { "fontWeight": "bold", "fontSize": "14px", "color": "#262424", "margin": "0" },
    employementpointsView: { "paddingTop": "5px" },
    employementPointsText: { "margin": "0", "color": "#423e3e", "fontSize": "10px", "display": "flex" },
    bullets: {},

    employementViewRightSecion: { "width": "10%", "fontSize": "10px", "textAlign": "center" },

    skillSection: {
        "display": "-webkit-inline-box",
        "display": "flex",
        "flexDirection": "row",
        "paddingBottom": "20px",
        "marginBottom": "20px",
        "width": "100%",
        "borderBottom": "1px solid #000",
    },

    skillLeftSection: {
        "width": "20%",
    },

    skillName: {
        "width": "20%",
    },

    skillValue: {
        "width": "20%",
    },

    languageSection: {
        "display": "-webkit-inline-box",
        "display": "flex",
        flexDirection: "row",
        "paddingBottom": "20px",
        "width": "100%",
        "borderBottom": "1px solid #000",
        "marginBottom": "20px"
    },
});


const CvTemplateTwo = ({
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

    return (
        <Document>
            <Page size="A4" style={styles.templateBody}>
                <View style={styles.container}>

                    <View style={styles.section}>
                        <Text style={styles.profileName}>{generalData?.first_name} {generalData?.last_name}</Text>
                        <View style={{ ...styles.p, ...styles.profileBioView }}>
                            <Text style={styles.profileBio}>{generalData?.current_area}, {generalData?.current_city_name}, {generalData?.current_country_name}</Text>
                            <Text style={{ ...styles.profileBio, "display": "block" }}>Email: <Text style={{ "color": "#0462c1" }}>{generalData?.contact_email ?? "-"}</Text></Text>
                            <Text style={{ ...styles.profileBio, "display": "block" }}>Mobile: +{generalData?.contact_mobile ?? "-"}</Text>
                            <Text style={{ ...styles.profileBio, "display": "block" }}>LinkedIn: <Text style={{ "color": "#0462c1" }}>{generalData?.linked_in ?? "-"}</Text></Text>
                        </View>
                    </View>

                    <View style={styles.profileSection}>
                        <View style={styles.flexWidth20}>
                            <Text style={styles.heading}>PROFILE</Text>
                        </View>
                        <View style={styles.flexWidth80}>
                            <Text style={{ ...styles.p, ...styles.profileSummary }}>
                                {generalData?.about}
                            </Text>
                        </View>
                    </View>

                    {workExperienceData.length > 0 && (
                        <View style={styles.section}>
                            <View style={styles.employmentHeading}>
                                <Text style={styles.heading}>EMPLOYMENT HISTORY</Text>
                            </View>

                            {workExperienceData.map((w) => {

                                let newAchive = w?.achievements
                                    .split("\n")
                                    .filter((val) => val.trim().length > 0);
                                let newVal = w?.responsibilities
                                    .split("\n")
                                    .filter((val) => val.trim().length > 0);
                                let allResp = newVal.concat(newAchive);

                                return (
                                    <View style={styles.employementView}>
                                        <Text style={styles.employementViewLeftSecion}>
                                            {moment(w?.start_date).format("MMM YYYY")} -{" "}
                                            {w?.end_date
                                                ? moment(w?.end_date).format("MMM YYYY")
                                                : "Present"}
                                        </Text>
                                        <View style={styles.employementViewMiddleSecion}>
                                            <Text style={styles.employmentmiddleCollageName}>
                                                {w?.job_title}
                                            </Text>
                                            <Text style={{ ...styles.employmentmiddleCollageName, "fontStyle": "italic" }}>
                                                {w?.company_name}
                                            </Text>
                                            <View style={styles.employementpointsView}>
                                                <Text style={{ "margin": "5px 0 2px 0", "color": "#585858", "fontSize": "12px", "fontWeight": "bold" }}>
                                                    Key Responsibilities:
                                                </Text>
                                                {
                                                    newVal.map((v, i) => (
                                                        <Text style={{ ...styles.p, ...styles.employementPointsText }}>
                                                            <Text style={styles.bullets}></Text>
                                                            • {v}
                                                        </Text>
                                                    ))
                                                }
                                                <Text style={{ "margin": "8px 0 2px 0", "color": "#585858", "fontSize": "12px", "fontWeight": "bold" }}>
                                                    Key Achievements:
                                                </Text>
                                                {
                                                    newAchive.map((v, i) => (
                                                        <Text style={{ ...styles.p, ...styles.employementPointsText }}>
                                                            <Text style={styles.bullets}></Text>
                                                            • {v}
                                                        </Text>
                                                    ))
                                                }
                                            </View>
                                        </View>
                                        <Text style={styles.employementViewRightSecion}>{w.city_name}, {w.country_name}</Text>
                                    </View>
                                )
                            })}

                        </View>
                    )}

                    {(postGraduationData.length > 0 ||
                        universityData.length > 0 ||
                        educationData) && (

                            <View style={styles.section}>
                                <View style={styles.employmentHeading}>
                                    <Text style={styles.heading}>EDUCATION</Text>
                                </View>

                                {
                                    postGraduationData &&
                                    postGraduationData.length > 0 &&
                                    postGraduationData.map((p) => {

                                        return (
                                            <View style={styles.employementView}>
                                                <Text style={styles.employementViewLeftSecion}>
                                                    {p.start_year} - {p.end_year}
                                                </Text>
                                                <View style={styles.employementViewMiddleSecion}>
                                                    <Text style={styles.employmentmiddleCollageName}>
                                                        {p.degree_level_name || p.other_degree_level || p.degree_level}
                                                        , {p.field_of_study || p.other_field_of_study}, {p.university_name}
                                                    </Text>
                                                    <View style={styles.employementpointsView}>
                                                        <Text style={{ ...styles.p, ...styles.employementPointsText }}>
                                                            <Text style={styles.bullets}></Text>
                                                            • Grade ({p.grade_name || p.other_grade})
                                                        </Text>
                                                    </View>
                                                </View>
                                                <Text style={styles.employementViewRightSecion}>{p.country_name}</Text>
                                            </View>
                                        )
                                    })
                                }

                                {
                                    universityData &&
                                    universityData.length > 0 &&
                                    universityData.map((u) => {

                                        return (
                                            <View style={styles.employementView}>
                                                <Text style={styles.employementViewLeftSecion}>
                                                    {u.start_year} - {u.end_year}
                                                </Text>
                                                <View style={styles.employementViewMiddleSecion}>
                                                    <Text style={styles.employmentmiddleCollageName}>
                                                        {u.degree_level_name || u.other_degree_level || u.degree_level}
                                                        , {u.field_of_study || u.other_field_of_study}, {u.university_name}
                                                    </Text>
                                                    <View style={styles.employementpointsView}>
                                                        <Text style={{ ...styles.p, ...styles.employementPointsText }}>
                                                            <Text style={styles.bullets}></Text>
                                                            • Grade ({u.grade_name || u.other_grade})
                                                        </Text>
                                                    </View>
                                                </View>
                                                <Text style={styles.employementViewRightSecion}>{u.country_name}</Text>
                                            </View>
                                        )
                                    })
                                }

                                {
                                    educationData && (
                                        <View style={styles.employementView}>
                                            <Text style={styles.employementViewLeftSecion}>
                                                {educationData.graduation_year}
                                            </Text>
                                            <View style={styles.employementViewMiddleSecion}>
                                                <Text style={styles.employmentmiddleCollageName}>
                                                    {educationData?.graduation_certificate_name || educationData?.graduation_other_certificate || educationData?.graduation_certificate}, {educationData?.high_school_name}
                                                </Text>
                                                <View style={styles.employementpointsView}>
                                                    <Text style={{ ...styles.p, ...styles.employementPointsText }}>
                                                        <Text style={styles.bullets}></Text>
                                                        • Grade Grade (
                                                        {educationData?.grade_name ||
                                                            educationData?.graduation_other_grade ||
                                                            educationData?.grade}
                                                        )
                                                    </Text>
                                                </View>
                                            </View>
                                            <Text style={styles.employementViewRightSecion}>{educationData.country_name}</Text>
                                        </View>
                                    )
                                }
                            </View>

                        )}

                    {
                        certificationData.length > 0 && (
                            <View style={styles.section}>
                                <View style={styles.employmentHeading}>
                                    <Text style={styles.heading}>CERTIFICATION</Text>
                                </View>

                                {certificationData.map((val) => {

                                    return (
                                        <View style={styles.employementView}>
                                            <Text style={styles.employementViewLeftSecion}>
                                                {val?.graduation_year}
                                            </Text>
                                            <View style={styles.employementViewMiddleSecion}>
                                                <Text style={styles.employmentmiddleCollageName}>
                                                    {val.field_of_study_name || val.other_field_of_study || val.field_of_study}
                                                    , {(val?.topic_name || val?.other_topic || val?.topic) ? `${(val?.topic_name || val?.other_topic || val?.topic)}, ` : ""}{val?.organisation_name}
                                                </Text>
                                                {/* <View style={styles.employementpointsView}>
                                                    <Text style={{ ...styles.p, ...styles.employementPointsText }}>
                                                        <Text style={styles.bullets}></Text>
                                                        •  {val?.topic_name || val?.other_topic || (val?.topic && ", ")}
                                                    </Text>
                                                </View> */}
                                            </View>
                                            <Text style={styles.employementViewRightSecion}>{val.country_name}</Text>
                                        </View>
                                    )
                                })}

                            </View>
                        )
                    }

                    {
                        skillsData.length > 0 && (
                            <View style={styles.skillSection}>
                                <View style={styles.skillLeftSection}>
                                    <Text style={styles.heading}>SKILLS</Text>
                                </View>

                                <View style={{ "width": "80%" }}>
                                    <View style={{ "width": "100%", "display": "flex", "flexDirection": "row", "flexWrap": "wrap" }}>

                                        {
                                            skillsData.map((s) => {

                                                return (
                                                    <>
                                                        <View style={{ "width": "50%", "flexDirection": "row" }}>
                                                            <Text style={{ "fontSize": "12px", "margin": "0", "color": "#262424", "textTransform": "capitalize" }}>{s.skill_name}&nbsp;&nbsp; - &nbsp;&nbsp;</Text>

                                                            <Text style={{ "fontSize": "12px", "fontStyle": "italic", "margin": "0", "color": "#262424", "textTransform": "capitalize" }}>({s.level})</Text>
                                                        </View>
                                                    </>
                                                )
                                            })
                                        }

                                    </View>
                                </View>
                            </View>

                        )

                    }

                    {
                        languagesData.length > 0 && (
                            <View style={styles.languageSection}>
                                <View style={styles.skillLeftSection}>
                                    <Text style={styles.heading}>LANGUAGE</Text>
                                </View>

                                <View style={{ "width": "80%" }}>
                                    <View style={{ "width": "100%", "display": "flex", "flexDirection": "row", "flexWrap": "wrap" }}>

                                        {
                                            languagesData.map((s) => {

                                                return (
                                                    <>
                                                        <View style={{ "width": "50%", "flexDirection": "row" }}>
                                                            <Text style={{ "fontSize": "12px", "margin": "0", "color": "#262424", "textTransform": "capitalize" }}>{s.language_name}&nbsp;&nbsp; - &nbsp;&nbsp;</Text>

                                                            <Text style={{ "fontSize": "12px", "fontStyle": "italic", "margin": "0", "color": "#262424", "textTransform": "capitalize" }}>({s.level})</Text>
                                                        </View>
                                                    </>
                                                )
                                            })
                                        }

                                    </View>
                                </View>
                            </View>

                        )

                    }

                    <View style={{...styles.section, "borderBottom": "none"}}>
                        <View style={styles.employmentHeading}>
                            <Text style={styles.heading}>PERSONAL INFORMATION</Text>
                        </View>
                        <View style={{...styles.employementView, "paddingBottom": "3px", "marginBottom": "3px"}}>
                            <Text style={styles.employementViewLeftSecion}>
                                Date of Birth 
                            </Text>
                            <View style={styles.employementViewMiddleSecion}>
                                <Text style={{...styles.employmentmiddleCollageName, "fontSize": "12px"}}>
                                    {moment(generalData?.dob).format("MMMM DD, YYYY")}
                                </Text>
                            </View>
                        </View>
                        <View style={{...styles.employementView, "paddingBottom": "3px", "marginBottom": "3px"}}>
                            <Text style={styles.employementViewLeftSecion}>
                                Marital
                            </Text>
                            <View style={styles.employementViewMiddleSecion}>
                                <Text style={{...styles.employmentmiddleCollageName, "textTransform": "capitalize", "fontSize": "12px"}}>
                                    {generalData?.martial_status}
                                </Text>
                            </View>
                        </View>
                        <View style={{...styles.employementView, "paddingBottom": "3px", "marginBottom": "3px"}}>
                            <Text style={styles.employementViewLeftSecion}>
                                Nationality
                            </Text>
                            <View style={styles.employementViewMiddleSecion}>
                                <Text style={{...styles.employmentmiddleCollageName, "textTransform": "capitalize", "fontSize": "12px"}}>
                                    {generalData?.nationality_name}
                                </Text>
                            </View>
                        </View>

                    </View>


                </View>
            </Page>
        </Document>
    );
};

export default CvTemplateTwo;