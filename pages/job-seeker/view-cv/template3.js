import React, { Fragment } from "react";
import { Document, Font, Page, StyleSheet, Text, View, pdf, Image } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

const TemplateThree = () => {

  Font.register({
    family: "EB Garamond, serif",
    fonts: [
      {
        src: "/font/EBGaramond-VariableFont_wght.ttf"
      }
    ]
  })

  const styles = StyleSheet.create({

    progress: {
      verticalAlign: "baseline",
    },

    "progressBarStripes": {
      "from": {
        "backgroundPosition": "1rem 0",
      },
      "to": {
        "backgroundPosition": "0 0"
      }
    },

    "progressBarStripes": {
      from: {
        backgroundPosition: "1rem 0",
      },
      to: {
        backgroundPosition: "0 0",
      }
    },

    "progress": {
      display: "-webkit-box",
      display: "-ms-flexbox",
      display: "flex",
      height: "10px",
      overflow: "hidden",
      fontSize: "0.75rem",
      backgroundColor: "#e9ecef",
    },

    "progressBarStriped": {
      "backgroundSize": "1rem 1rem",
    },

    "li": {
      fontWeight: "500",
    },

    body: {
      "padding": "0px",
      "backgroundColor": "#eceff7",
      fontFamily: "EB Garamond, serif",
    },

    container: {
      padding: "20px 30px",
      backgroundColor: "#fff",
      "maxWidth": "1000px",
      display: "block",
      "margin": "0px auto",
    },

    section: {
      "padding": "30px 0 15px 0",
      display: "block"
    },
    imgStyle: {
      "width": "25px",
      height: "25px"
    },
    listContainer: {
      flexDirection: 'row',
      width: '80%',
      flexWrap: "wrap",
      right: 0,
      marginLeft: "20px"
    },

    listItem: {
      width: "50%",
      fontSize: 12,
      marginTop: "5px",
    },
    progressBarContainer: {
      width: '50%',
      textAlign: "right",
      marginTop: "5px"
    },
    progressBar: {
      display: "block",
      width: '100%',
      height: "8px",
      backgroundColor: '#e0e0e0',
      marginTop: "5px"
    },
    progressBarFill: {
      height: '100%'
    }
  })

  return (
    <Document>
      <Page size="A4" style={{ ...styles.body }}>
        <View style={styles.container}>
          <View style={{ "paddingBottom": "20px", "display": "block" }}>
            <Text style={{ "letterSpacing": "-0.2pt", "color": "#002d57", "fontWeight": "bold", "fontSize": "18px", "margin": "0" }}>
              {generalData?.first_name} {generalData?.last_name}
            </Text>
            <Text style={{ "letterSpacing": "-0.1pt", "color": "#002d57", "margin": "0", "fontWeight": "bold", "fontSize": "12px", "display": "block" }}>
              Procurement Leader
            </Text>
          </View>

          <View style={{ "display": "block" }}>
            <View style={{ "display": "-webkit-inline-box", "display": "flex", "flexDirection": "row", "width": "100%", "paddingBottom": "5px" }}>
              <View style={{ "width": "50%" }}>
                <Text style={{ "fontSize": "10px", "margin": "0" }}>
                  <Text style={{ "fontWeight": "bold" }}>Address </Text>
                  {generalData?.current_area_name || generalData?.current_other_area}, {generalData?.current_city_name}, {generalData?.current_country_name}
                </Text>
              </View>
              <View style={{ "width": "50%" }}>
                <Text style={{ "fontSize": "10px", "margin": "0" }}>
                  <Text style={{ "fontWeight": "bold" }}>E-Mail </Text>
                  <Text style={{ "color": "#0462c1", "paddingLeft": "10px" }}>{generalData?.contact_email}</Text>
                </Text>
              </View>
            </View>
            <View style={{ "display": "-webkit-inline-box", "display": "flex", "flexDirection": "row", "width": "100%" }}>
              <View style={{ "width": "50%" }}>
                <Text style={{ "fontSize": "10px", "margin": "0" }}>
                  <Text style={{ "fontWeight": "bold" }}>Phone </Text>
                  {generalData?.contact_mobile}
                </Text>
              </View>
              <View style={{ "width": "50%" }}>
                <Text style={{ "fontSize": "10px", "margin": "0" }}>
                  <Text style={{ "fontWeight": "bold" }}>LinkedIn </Text>
                  <Text style={{ "color": "#0462c1", "paddingLeft": "10px" }}>in/shady-m-gabr</Text>
                </Text>
              </View>
            </View>

            <View style={{ "paddingTop": "10px" }}>
              <Text style={{ "fontSize": "10px", "display": "block", "paddingTop": "10px", "margin": "0" }}>
                {generalData?.about}
              </Text>
              {/* <Text style={{ "fontSize": "10px", "paddingTop": "5px", "margin": "0" }}>
                Prior to procurement, a solid experience in presales, business
                development and training; with strong achievements in turning
                around client relationship and leading complex bids and proposals.
                Vast international exposure and high culture awareness;
                established and led multicultural geographically spread teams.
              </Text> */}
            </View>
          </View>


          {
            workExperienceData.length > 0 && (
              <View style={styles.section}>
                <View style={{ "display": "-webkit-inline-box", "display": "flex", "flexDirection": "row", "marginBottom": "10px" }}>
                  <View>
                    <Image src="/img/work-icon.png" style={styles.imgStyle} />
                  </View>
                  <View style={{ "display": "block" }}>
                    <Text style={{ "fontSize": "12px", "fontWeight": "bold", "color": "#002d57", "margin": "5px 0 0 10px" }}>
                      Work History
                    </Text>
                  </View>
                </View>

                {
                  workExperienceData.map((w) => {
                    let newVal = w?.achievements
                      .split("\n")
                      .filter((val) => val.trim().length > 0);
                    let newAchive = w?.responsibilities
                      .split("\n")
                      .filter((val) => val.trim().length > 0);
                    let allResp = newVal.concat(newAchive);
                    return (
                      <View style={{ "display": "-webkit-inline-box", "width": "100%", "display": "flex", "flexDirection": "row" }}>
                        <View style={{ "width": "12%" }}>
                          {moment(w?.start_date).format("MMMM YYYY")} -{" "}
                          {w?.end_date
                            ? moment(w?.end_date).format("MMMM YYYY")
                            : "Present"}
                        </View>
                        <View style={{ "width": "88%)" }}>
                          <View style={{ "display": "block" }}>
                            <Text style={{ "color": "#000", "fontSize": "12px", "fontWeight": "bold", "margin": "0", "display": "block" }}>
                              {w?.job_title}
                            </Text>
                            <Text style={{ "margin": "0", "color": "#44536a", "fontSize": "12px", "paddingTop": "5px" }}>
                              <Text >{w?.company_name}, {w.city_name}, {w.country_name}</Text>
                            </Text>
                          </View>
                          <View style={{ "paddingTop": "10px" }}>
                            <Text style={{ "margin": "0", "color": "#585858", "fontSize": "12px", "fontWeight": "bold" }}>
                              Key Responsibilities:
                            </Text>
                            <View style={{ "marginLeft": "10px" }}>
                              {
                                allResp.map(k => (
                                  <Text style={{ "fontSize": "10px", "marginTop": "5px" }}>
                                    • {k}
                                  </Text>
                                ))
                              }
                            </View>
                          </View>
                        </View>
                      </View>
                    )
                  })
                }

              </View>
            )
          }


          {(postGraduationData.length > 0 ||
            universityData.length > 0 ||
            educationData) && (
              <View style={styles.section}>
                <View style={{ "display": "-webkit-inline-box", "display": "flex", "flexDirection": "row", "marginBottom": "10px" }}>
                  <View>
                    <Image src="/img/education.png" style={styles.imgStyle} />
                  </View>
                  <View style={{ "display": "block" }}>
                    <Text style={{ "fontSize": "12px", "fontWeight": "bold", "color": "#002d57", "margin": "5px 0 0 10px" }}>
                      Education
                    </Text>
                  </View>
                </View>

                {
                  postGraduationData.map((p) => {
                    return (
                      <View style={{ "display": "-webkit-inline-box", "width": "100%", "display": "flex", "flexDirection": "row" }}>
                        <View style={{ "width": "12%" }}>
                          <Text style={{ "margin": "0", "fontSize": "10px", "paddingBottom": "2px", "display": "block" }}>{p.start_year} - {p.end_year}</Text>
                          {/* <Text style={{ "margin": "0", "fontSize": "10px" }}>Current</Text> */}
                        </View>
                        <View style={{ "width": "88%)" }}>
                          <View style={{ "display": "block" }}>
                            <Text style={{ "color": "#000", "fontSize": "12px", "fontWeight": "bold", "margin": "0", "display": "block" }}>
                              {p.degree_level_name || p.other_degree_level || p.degree_level}
                            </Text>
                            <Text style={{ "margin": "0", "fontSize": "12px", "paddingTop": "5px" }}>
                              {p.field_of_study || p.other_field_of_study}, {p.university_name} - {p.country_name}
                            </Text>
                          </View>
                          <Text style={{"fontSize": "12px", "color": "#000"}}>• Grade ({p.grade_name || p.other_grade})</Text>
                        </View>
                      </View>

                    )
                  })
                }

                {
                  universityData.map((u) => { 
                    <View style={{ "display": "-webkit-inline-box", "width": "100%", "display": "flex", "flexDirection": "row" }}>
                        <View style={{ "width": "12%" }}>
                          <Text style={{ "margin": "0", "fontSize": "10px", "paddingBottom": "2px", "display": "block" }}>{u.start_year} - {u.end_year}</Text>
                          {/* <Text style={{ "margin": "0", "fontSize": "10px" }}>Current</Text> */}
                        </View>
                        <View style={{ "width": "88%)" }}>
                          <View style={{ "display": "block" }}>
                            <Text style={{ "color": "#000", "fontSize": "12px", "fontWeight": "bold", "margin": "0", "display": "block" }}>
                              {u.degree_level_name || u.other_degree_level || u.degree_level}
                            </Text>
                            <Text style={{ "margin": "0", "fontSize": "12px", "paddingTop": "5px" }}>
                              {u.field_of_study || u.other_field_of_study}, {u.university_name} - {u.country_name}
                            </Text>
                          </View>
                          <Text style={{"fontSize": "12px", "color": "#000"}}>• Grade ({u.grade_name || u.other_grade})</Text>
                        </View>
                      </View>
                  })
                }

                {
                  educationData && ( 
                    <View style={{ "display": "-webkit-inline-box", "width": "100%", "display": "flex", "flexDirection": "row" }}>
                        <View style={{ "width": "12%" }}>
                          <Text style={{ "margin": "0", "fontSize": "10px", "paddingBottom": "2px", "display": "block" }}>{educationData.graduation_year}</Text>
                          {/* <Text style={{ "margin": "0", "fontSize": "10px" }}>Current</Text> */}
                        </View>
                        <View style={{ "width": "88%)" }}>
                          <View style={{ "display": "block" }}>
                            <Text style={{ "color": "#000", "fontSize": "12px", "fontWeight": "bold", "margin": "0", "display": "block" }}>
                              {educationData?.graduation_certificate_name || educationData?.graduation_other_certificate || educationData?.graduation_certificate}
                            </Text>
                            <Text style={{ "margin": "0", "fontSize": "12px", "paddingTop": "5px" }}>
                              {educationData?.high_school_name} - {educationData.country_name}
                            </Text>
                          </View>
                          <Text style={{"fontSize": "12px", "color": "#000"}}> • Grade (
                          {educationData?.grade_name ||
                            educationData?.graduation_other_grade ||
                            educationData?.grade})</Text>
                        </View>
                      </View>
                  )
                }
              </View>
            )
          }


          <View style={styles.section}>
            <View style={{ "display": "-webkit-inline-box", "display": "flex", "flexDirection": "row", "marginBottom": "10px" }}>
              <View>
                <Image src="/img/skills.png" style={styles.imgStyle} />
              </View>
              <View style={{ "display": "block" }}>
                <Text style={{ "fontSize": "12px", "fontWeight": "bold", "color": "#002d57", "margin": "5px 0 0 10px" }}>
                  Skills
                </Text>
              </View>
            </View>

            <View style={{ "display": "-webkit-inline-box", "width": "100%", "display": "flex", "flexDirection": "row" }}>
              <View style={{ "width": "10%" }}>

              </View>
              <View style={{ "width": "90%" }}>
                <View style={{ "display": "-webkit-inline-box", "display": "flex", "flexDirection": "row", "flexWrap": "wrap", "width": "100%" }}>
                  {
                    skillsData.map((s) => (
                      <View style={{ "width": "50%" }}>
                        <View style={{ "paddingLeft": "0" }}>
                          <Text style={{ "fontSize": "10px", "marginTop": "5px" }}>
                            • {s.skill_name} ({s.skill_name})
                          </Text>
                        </View>
                      </View>
                    ))
                  }
                </View>
              </View>
            </View>
          </View>


          <View style={styles.section}>
            <View style={{ "display": "-webkit-inline-box", "display": "flex", "flexDirection": "row", "marginBottom": "10px" }}>
              <View>
                <Image src="/img/language.png" style={styles.imgStyle} />
              </View>
              <View style={{ "display": "block" }}>
                <Text style={{ "fontSize": "12px", "fontWeight": "bold", "color": "#002d57", "margin": "5px 0 0 10px" }}>
                  Languages
                </Text>
              </View>
            </View>

            <View style={{ "display": "-webkit-inline-box", "width": "100%", "display": "flex", "flexDirection": "row" }}>
              <View style={{ "width": "5%" }}>

              </View>
              <View style={{ "width": "95%" }}>
                <View style={{ "display": "-webkit-inline-box", "width": "100%", "flexDirection": "row", "display": "flex", "flexWrap": "wrap" }}>
                {
                  languagesData.map((language, index) => (
                    <View style={styles.listContainer}>
                      <View style={styles.listItem}>
                        <Text style={{ "fontSize": "10px", "marginTop": "5px" }}>{language.language_name}</Text>
                      </View>
                      <View style={{ ...styles.progressBarContainer, ...styles.listItem }}>
                        <View style={styles.progressBar}>
                          <View
                            style={{
                              ...styles.progressBarFill,
                              ...{ "width": `10%`, "backgroundColor": '#002d57' }
                            }}
                          ></View>
                        </View>
                      </View>
                    </View>
                  ))
                }
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>

  )

}

const DownloadPDFTwo = ({ cvData }) => {

  const downlaod = async () => {
    const blob = await pdf(
      <TemplateThree
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
      <TemplateThree data={cvData} />

      <div style={{ "display": "block", "textAlign": "center" }}>
        <button className="btn btn-primary " onClick={() => downlaod()}>Download PDF</button>
      </div>
    </div>
  )
}

export default DownloadPDFTwo;