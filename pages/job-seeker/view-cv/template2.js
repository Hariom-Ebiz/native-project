import React, { Fragment } from "react";
import { Document, Font, Page, StyleSheet, Text, View, pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";


const CheckTemplate = () => {

    Font.register({
        family: "EB Garamond, serif",
        fonts: [
            {
                src: "/font/EBGaramond-VariableFont_wght.ttf"
            }
        ]
    }
    )

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

        heading: { "fontWeight": "bold", "fontSize": "12px", "color": "#423e3e", "margin": "0" },

        section: {
            "display": "-webkit-inline-box",
            "paddingBottom": "10px",
            "display": "block",
            "borderBottom": "2px solid #000",
            "marginBottom": "20px"
        },

        profileSection: {
            "display": "-webkit-inline-box",
            "display": "flex",
            flexDirection: "row",
            "borderBottom": "2px solid #000",
            "paddingBottom": "20px",
            "marginBottom": "20px"
        },

        profileName: { "textAlign": "center", "display": "block", "fontSize": "20px", "margin": "0", "fontWeight": "bold" },
        profileBioView: { "margin": "10 0", "fontSize": "10px" },
        profileBio: { "width": "100%", "textAlign": "center", "display": "block" },

        profileSummaryView: { "display": "-webkit-inline-box", "display": "flex", "borderBottom": "2 solid #000", "paddingBottom": "20px", "marginBottom": "20px" },

        flexWidth20: {
            width: "20%"
        },

        flexWidth80: {
            width: "80%"
        },

        profileSummary: { "margin": "0", "fontSize": "10px", "color": "#423e3e" },

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


        employementViewMiddleSecion: { "width": "70%" },
        employmentmiddleCollageName: { "fontWeight": "bold", "fontSize": "12px", "color": "#262424", "margin": "0" },
        employementpointsView: { "paddingTop": "5px" },
        employementPointsText: { "margin": "0", "color": "#423e3e", "fontSize": "10px", "display": "flex" },
        bullets: {},

        employementViewRightSecion: { "width": "10%", "fontSize": "10px", "textAlign": "center" },

        skillSection: {
            "display": "-webkit-inline-box",
            "display": "flex",
            flexDirection: "row",
            "paddingBottom": "10px",
            "marginBottom": "10px",
            "width": "100%"
        },

        skillLeftSection: {
            "width": "20%",
        },

        skillName: {
            "width": "20%",
        },

        skillValue: {
            "width": "20%",
        }
    });


    return (
        <Document>
            <Page size="A4" style={styles.templateBody}>
                <View style={styles.container}>

                    <View style={styles.section}>
                        <Text style={styles.profileName}>{generalData?.first_name} {generalData?.last_name}</Text>
                        <View style={{ ...styles.p, ...styles.profileBioView }}>
                            <Text style={styles.profileBio}>{generalData?.current_area_name || generalData?.current_other_area}, {generalData?.current_city_name}, {generalData?.current_country_name}, {generalData?.contact_email}</Text>
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

                                let newVal = w?.achievements
                                .split("\n")
                                .filter((val) => val.trim().length > 0);
                                let newAchive = w?.responsibilities
                                .split("\n")
                                .filter((val) => val.trim().length > 0);
                                let allResp = newVal.concat(newAchive);

                                return (
                                    <View style={styles.employementView}>
                                        <Text style={styles.employementViewLeftSecion}>
                                            {moment(w?.start_date).format("MMMM YYYY")} -{" "}
                                                        {w?.end_date
                                                        ? moment(w?.end_date).format("MMMM YYYY")
                                                        : "Present"}
                                        </Text>
                                        <View style={styles.employementViewMiddleSecion}>
                                            <Text style={styles.employmentmiddleCollageName}>
                                                {w?.job_title}, {w?.company_name}
                                            </Text>
                                            <View style={styles.employementpointsView}>
                                                {
                                                    allResp.map((v, i) => (
                                                        <Text style={{ ...styles.p, ...styles.employementPointsText }}>
                                                            <Text style={styles.bullets}></Text>
                                                            • {v}
                                                        </Text>
                                                    ))
                                                }
                                            </View>
                                        </View>
                                        <Text style={styles.employementViewRightSecion}>w.city_name</Text>
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
                                <View style={styles.heading}>EDUCATION</View>
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
                                                    {p.degree_level_name || p.other_degree_level ||  p.degree_level}
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
                                                    {u.degree_level_name || u.other_degree_level ||  u.degree_level}
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
                            {/* <View style={styles.employementView}>
                                <Text style={styles.employementViewLeftSecion}>Jul 21 0-Jul 203</Text>
                                <View style={styles.employementViewMiddleSecion}>
                                    <Text style={styles.employmentmiddleCollageName}>Huntington Associates</Text>
                                    <View style={styles.employementpointsView}>
                                        <Text style={{ ...styles.p, ...styles.employementPointsText }}>
                                            <Text style={styles.bullets}></Text>
                                            • Graduate summa cum laude.
                                        </Text>
                                        <Text style={{ ...styles.p, ...styles.employementPointsText }}>
                                            <Text style={styles.bullets}></Text>
                                            • President of Student Counsel
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.employementViewRightSecion}>Philadelphia</Text>
                            </View> */}
                        </View>

                    )}

                    {
                        skillsData.length > 0 && ( 
                            <View style={styles.skillSection}>
                                <View style={styles.skillLeftSection}>
                                    <Text style={{ "fontSize": "10px", "margin": "0" }}>SKILLS</Text>
                                </View>

                                <View style={{"width": "80%"}}>
                                    <View style={{"width": "100%", "display": "flex", "flexDirection": "row", "flexWrap": "wrap"}}>

                                        {
                                            skillsData.map((s) => { 

                                                return (
                                                    <>
                                                        <View style={{"width": "30%"}}>
                                                            <Text style={{"fontSize":"10px", "margin":"0", "display": "block", "color": "#262424"}}>{s.skill_name}</Text>
                                                        </View>
                                                        <View style={{"width": "20%"}}>
                                                            <Text style={{"fontSize":"10px", "margin":"0", "display": "block", "color": "#262424"}}>{s.level}</Text>
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


                </View>
            </Page>
        </Document>
    )
}


const DownloadPDF = ({ cvData }) => {

    const downlaod = async () => {
        const blob = await pdf(
            <CheckTemplate
                data={cvData}
            />
        ).toBlob();
        saveAs(
            blob,
            `yash-resume.pdf`
        );
    }


    return (
        <div>
            <CheckTemplate data={cvData} />

            <div style={{ "display": "block", "textAlign": "center" }}>
                <button className="btn btn-primary " onClick={() => downlaod()}>Download PDF</button>
            </div>
        </div>
    )
}

export default DownloadPDF;