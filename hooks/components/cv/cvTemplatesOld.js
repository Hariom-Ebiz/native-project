import React from "react";

import {
  Text,
  Font,
  Page,
  View,
  Image,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

const Title = ({ children }) => <Text style={styles.title}>{children}</Text>;

const styles = StyleSheet.create({
  page: {
    padding: "50px",
    // flexDirection: "row",
  },
  container: {
    flexDirection: "row",
    "@media max-width: 400": {
      flexDirection: "column",
    },
  },
  image: {
    marginBottom: 50,
  },
  leftColumn: {
    flexDirection: "column",
    width: "100%",
    paddingTop: 30,
    paddingRight: 15,
    "@media max-width: 400": {
      width: "100%",
      paddingRight: 0,
    },
    "@media orientation: landscape": {
      width: 200,
    },
  },
  footer: {
    fontSize: 12,
    fontFamily: "Lato Bold",
    textAlign: "center",
    marginTop: 15,
    paddingTop: 5,
    borderWidth: 3,
    borderColor: "gray",
    borderStyle: "dashed",
    "@media orientation: landscape": {
      marginTop: 10,
    },
  },
  body: {
    flexGrow: 1,
  },
  row: {
    flexGrow: 1,
    flexDirection: "row",
  },
  block: {
    flexGrow: 1,
  },

  title: {
    fontSize: 22,
    color: "#000",
    fontWeight: "700",
    display: "block",
  },

  tittle_heading: {
    fontSize: 22,
    color: "#000",
    fontWeight: "700",
    display: "block",
  },

  dis_text: {
    fontSize: 16,
    color: "rgb(108 108 108)",
    fontWeight: "400",
  },

  container: {
    flex: 1,
    "@media max-width: 400": {
      paddingTop: 10,
      paddingLeft: 0,
    },
  },

  image: {
    marginBottom: 10,
  },
  leftColumn: {
    flexDirection: "column",
    paddingRight: 15,
    "@media max-width: 400": {
      width: "100%",
      paddingRight: 0,
    },
  },
  rightColumn: {
    flexDirection: "column",
    minWidth: 250,
    flex: "0 0 250",
    alignItems: "flex-end",
    justifySelf: "flex-end",
  },

  rowcustom: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 15,
  },
  left_space: {
    paddingLeft: 40,
    display: "block",
  },
  svg_size: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  top_space: {
    paddingTop: 15,
  },
  sub_heading: {
    fontSize: 16,
    color: "#000",
    fontWeight: "700",
    display: "block",
    paddingLeft: 40,
  },
  sub_heading_skills: {
    fontSize: 16,
    color: "#000",
    fontWeight: "700",
    display: "block",
    paddingBottom: 10,
    paddingTop: 10,
  },
  item_block: {
    display: "flex",
    gap: 15,
    paddingLeft: 40,
  },
  text_size: {
    display: "block",
    paddingLeft: 40,
  },
  sub_text: {
    fontSize: 16,
    color: "#686868",
    fontWeight: "500",
    display: "block",
    paddingLeft: 40,
  },
  date_text: {
    fontSize: 14,
    color: "#adadad",
    fontWeight: "400",
    display: "block",
    paddingLeft: 40,
  },
  progress_container: {
    width: "100%",
    backgroundColor: "#e9ecef",
    display: "block",
  },

  blue_back: {
    width: "60%",
    display: "block",
    backgroundColor: "#56cdad",
    color: "blue",
    height: 5,
  },
  main_wrapper: {
    maxWidth: 1140,
    margin: "auto",
    display: "block",
  },
  img_style : {
    width : 20,
    height : 20,
    marginVertical: 15,
    marginHorizontal: 100,
  }
});

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
  console.log("generalData", generalData);
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.main_wrapper}>
          <View>
            <View style={styles.container}>
              <View style={styles.detailColumn}>
                <Title style={styles.tittle_heading}>
                  {generalData.first_name} {generalData.last_name}
                </Title>
                <Text style={styles.dis_text}>commodo sit neque pe</Text>
              </View>
            </View>
          </View>
          <View style={{ ...styles.container, ...styles.rowcustom }}>
            <View style={styles.leftColumn}>
              <Title style={styles.tittle_heading}>
              <Image
                src="/img/logo.png"
                style={styles.img_style}
              />
                {/* <svg
                  style={styles.svg_size}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-person-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                </svg> */}
                Profile
              </Title>

              <Text style={{ ...styles.dis_text, ...styles.left_space }}>
                {generalData?.about}
              </Text>

              <Text style={{ ...styles.top_space, ...styles.tittle_heading }}>
                <svg
                  style={styles.svg_size}
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.5625 2.40625V4.125H14.4375V2.40625C14.4375 2.21719 14.2828 2.0625 14.0938 2.0625H7.90625C7.71719 2.0625 7.5625 2.21719 7.5625 2.40625ZM5.5 4.125V2.40625C5.5 1.07852 6.57852 0 7.90625 0H14.0938C15.4215 0 16.5 1.07852 16.5 2.40625V20.625H5.5V4.125ZM2.75 4.125H4.125V20.625H2.75C1.2332 20.625 0 19.3918 0 17.875V6.875C0 5.3582 1.2332 4.125 2.75 4.125ZM19.25 20.625H17.875V4.125H19.25C20.7668 4.125 22 5.3582 22 6.875V17.875C22 19.3918 20.7668 20.625 19.25 20.625Z"
                    fill="black"
                  />
                </svg>
                Employment History
              </Text>
              <Text style={styles.sub_heading}>Commodo sit neque pe</Text>
              <View style={styles.item_block}>
                <Text>Vinson Jenking Trading </Text>
                <Text>. Freelance / Project</Text>
                <Text>. Sep-95-invalid</Text>
              </View>
              <Text style={styles.text_size}>
                . Achievement : Optio accusantium h
              </Text>
              <Text style={styles.text_size}>
                . Responsibilites : lusto eveniet aute
              </Text>
              <Text style={{ ...styles.top_space, ...styles.tittle_heading }}>
                <svg
                  style={styles.svg_size}
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.5625 2.40625V4.125H14.4375V2.40625C14.4375 2.21719 14.2828 2.0625 14.0938 2.0625H7.90625C7.71719 2.0625 7.5625 2.21719 7.5625 2.40625ZM5.5 4.125V2.40625C5.5 1.07852 6.57852 0 7.90625 0H14.0938C15.4215 0 16.5 1.07852 16.5 2.40625V20.625H5.5V4.125ZM2.75 4.125H4.125V20.625H2.75C1.2332 20.625 0 19.3918 0 17.875V6.875C0 5.3582 1.2332 4.125 2.75 4.125ZM19.25 20.625H17.875V4.125H19.25C20.7668 4.125 22 5.3582 22 6.875V17.875C22 19.3918 20.7668 20.625 19.25 20.625Z"
                    fill="black"
                  />
                </svg>
                Education
              </Text>
              <Text style={styles.sub_heading}>RPS</Text>
              <Text style={styles.sub_text}>Postgraduate degree</Text>
              <Text style={styles.date_text}>2021-2022</Text>

              <Text style={styles.sub_heading}>RPS</Text>
              <Text style={styles.sub_text}>
                Postgraduate degree, Collage Diploma
              </Text>
              <Text style={styles.date_text}>2021-2022</Text>

              <Text style={styles.sub_heading}>RPS</Text>
              <Text style={styles.sub_text}>
                Postgraduate degree, Collage Diploma
              </Text>
              <Text style={styles.date_text}>2021-2022</Text>

              <Text style={styles.sub_heading}>Lewis Dodson</Text>
              <Text style={styles.sub_text}>
                High School, International Baccalaureate
              </Text>
              <Text style={styles.date_text}>2021-2022</Text>

              <Text style={{ ...styles.top_space, ...styles.tittle_heading }}>
                <svg
                  style={styles.svg_size}
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.5625 2.40625V4.125H14.4375V2.40625C14.4375 2.21719 14.2828 2.0625 14.0938 2.0625H7.90625C7.71719 2.0625 7.5625 2.21719 7.5625 2.40625ZM5.5 4.125V2.40625C5.5 1.07852 6.57852 0 7.90625 0H14.0938C15.4215 0 16.5 1.07852 16.5 2.40625V20.625H5.5V4.125ZM2.75 4.125H4.125V20.625H2.75C1.2332 20.625 0 19.3918 0 17.875V6.875C0 5.3582 1.2332 4.125 2.75 4.125ZM19.25 20.625H17.875V4.125H19.25C20.7668 4.125 22 5.3582 22 6.875V17.875C22 19.3918 20.7668 20.625 19.25 20.625Z"
                    fill="black"
                  />
                </svg>
                Certification
              </Text>
              <Text style={styles.sub_heading}>RPS</Text>
              <Text style={styles.date_text}>2021-2022</Text>

              <Text style={styles.sub_heading}>RPS</Text>
              <Text style={styles.sub_text}>Interpersonal</Text>
              <Text style={styles.date_text}>2021</Text>
            </View>
            <View style={styles.rightColumn}>
              <Title style={styles.tittle_heading}>Details</Title>
              <Text style={styles.dis_text}>aera 51, Faizabad,Afghanistan</Text>

              <Text style={{ ...styles.top_space, ...styles.tittle_heading }}>
                Skills
              </Text>
              <Text style={styles.sub_heading_skills}>abc</Text>
              <View style={styles.progress_container}>
                <View style={styles.blue_back}></View>
              </View>
              <Text style={styles.sub_heading_skills}>coding</Text>
              <View style={styles.progress_container}>
                <View style={styles.blue_back}></View>
              </View>
              <Text style={styles.sub_heading_skills}>Skills 3</Text>
              <View style={styles.progress_container}>
                <View style={styles.blue_back}></View>
              </View>
              {/* <Select value={10} /> */}

              <Text style={{ ...styles.top_space, ...styles.tittle_heading }}>
                Language
              </Text>
              <Text style={styles.sub_heading_skills}>Hindi</Text>
              <View style={styles.progress_container}>
                <View style={styles.blue_back}></View>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CvTemplate;
