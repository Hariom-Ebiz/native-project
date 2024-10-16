import React, { Fragment } from "react";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";


const TestTemplate = () => {

    const styles = StyleSheet.create({
        templateBody: {
            "fontFamily": "EB Garamond, serif",
            "margin": 0,
            "backgroundColor": "#eceff7", 
            "padding": "0",
            "margin": "0px auto", 
            "maxWidth": "1000px"
        },
        "@page": {
            "size": "A4",
            "margin": 0,
            "padding": 0,
        },
        "p": {
            "width": "100%",
            "display": " -webkit-inline-box"
        },
        "skills": {
            "display": "-webkit-inline-box", 
            "paddingBottom": "5px", 
            "marginBottom": "5px", 
            "width": "100%",
            flexDirection: 'row',
            flexWrap: 'wrap', // Allow wrapping to the next line if content exceeds width
            right: 0
        },
        "skillColumn": {
            width: '25%', // Each column takes 50% width
        },
        "skillRatingColumn": {
            width: '25%', // Each column takes 50% width
        },
        skillText: {
            fontSize: 12,
            marginBottom: 5,
        },
        skillRating: {
            fontSize: 12,
            marginBottom: 5,
            textAlign: 'center',
        },
    });


    return (
        <Document>
            <Page size="A4">
                <View style={styles.templateBody}>

                    <View style={{ "backgroundColor": "#fff", "padding": "0 30px" }}>
                        
                        <View style={{ "paddingBottom": "10px", "display": "block", "marginBottom": "20px", "borderBottom": "2px solid #000" }}>
                            <Text style={{ "textAlign": "center", "display": "block", "fontSize": "26px", "margin": "0", "fontWeight": "bold" }}>Yash Gaur, Accountant</Text>
                            <View style={{...styles.p, "margin": "10px 0", "fontSize": "12px" }}>
                                <Text style={{ "width": "100%", "textAlign": "center", "display": "block" }}>	8 0Gold Street, New York, NY 1 088, United States, (917) 4 (F-2179), tim stewart@gmail.com</Text>
                            </View>
                        </View>

                        <View style={{ "display": "-webkit-inline-box", "display": "flex", "borderBottom": "2px solid #000", "paddingBottom": "20px", "marginBottom": "20px" }}>
                            <View style={{ "width": "20%" }}>
                                <Text style={{ "fontWeight": "bold", "fontSize": "16px", "color": "#423e3e", "margin": "0" }}>PROFILE</Text>
                            </View>
                            <View style={{ "width": "80%" }}>
                                <Text style={{...styles.p,  "margin": "0", "fontSize": "12px", "color": "#423e3e" }}>
                                    Certified Accountant with five years of experience in account reconciliations, streamlining accounts, and financial planning. Highly motivated professional with a proven track record of delivering accurate reports and high quality service. Possess a comprehensive understanding of all aspects of accounting and financial planning A dedicated leader with the ability to lead effective teams in attaining profit improvement.
                                </Text>
                            </View>
                        </View>

                        <View style={{"borderBottom": "2px solid #000", "display": "block", "paddingBottom": "20px", "marginBottom": "20px"}}>
                            <View style={{ "paddingBottom": "10px", "display": "block" }}>
                                <Text style={{ "fontWeight": "bold", "fontSize": "16px", "color": "#423e3e", "margin": "0" }}>EMPLOYMENT HISTORY</Text>
                            </View>

                            <View style={{ "display": "-webkit-inline-box", "display": "flex", "paddingBottom": "10px", "marginBottom": "10px", "width": "100%" }}>
                                <Text style={{ "width": "20%", "fontSize": "12px" }}>Nov 2013-Sep 2019</Text>
                                <View style={{ "width": "70%" }}>
                                    <Text style={{ "fontWeight": "bold", "fontSize": "14px", "color": "#262424", "margin": "0" }}>Staff Accountant, Dubone Partnership</Text>
                                    <Text style={{ "paddingTop": "5px" }}>
                                        <Text style={{...styles.p,  "margin": "0px 0 0px 20px", "color": "#423e3e", "fontSize": "12px" }}>
                                            <Text style={{ "width": "5px", "height": "5px", "background": "#8d8d8d", "borderRadius": "50%", "display": "inline-block", "marginRight": "5px", "marginBottom": "3px" }}></Text>
                                            Managed accounts by analyzing costs and revenues,
                                        </Text>
                                        <Text style={{...styles.p,  "margin": "0px 0 0px 20px", "color": "#423e3e", "fontSize": "12px" }}>
                                            <Text style={{ "width": "5px", "height": "5px", "background": "#8d8d8d", "borderRadius": "50%", "display": "inline-block", "marginRight": "5px", "marginBottom": "3px" }}></Text>
                                            Projected future trends based on analysis work
                                        </Text>
                                        <Text style={{...styles.p,  "margin": "0px 0 0px 20px", "color": "#423e3e", "fontSize": "12px" }}>
                                            <Text style={{ "width": "5px", "height": "5px", "background": "#8d8d8d", "borderRadius": "50%", "display": "inline-block", "marginRight": "5px", "marginBottom": "3px" }}></Text>
                                            Managed complex expense reporting.
                                        </Text>
                                        <Text style={{...styles.p,  "margin": "0px 0 0px 20px", "color": "#423e3e", "fontSize": "12px" }}>
                                            <Text style={{ "width": "5px", "height": "5px", "background": "#8d8d8d", "borderRadius": "50%", "display": "inline-block", "marginRight": "5px", "marginBottom": "3px" }}></Text>
                                            Develop strategies for minimizing tax liability.
                                        </Text>
                                        <Text style={{...styles.p,  "margin": "0px 0 0px 20px", "color": "#423e3e", "fontSize": "12px" }}>
                                            <Text style={{ "width": "5px", "height": "5px", "background": "#8d8d8d", "borderRadius": "50%", "display": "inline-block", "marginRight": "5px", "marginBottom": "3px" }}></Text>
                                            Work closely with auditors during all audit processes,
                                        </Text>
                                        <Text style={{...styles.p,  "margin": "0px 0 0px 20px", "color": "#423e3e", "fontSize": "12px" }}>
                                            <Text style={{ "width": "5px", "height": "5px", "background": "#8d8d8d", "borderRadius": "50%", "display": "inline-block", "marginRight": "5px", "marginBottom": "3px" }}></Text>
                                            Performed financial risk assessments for all future business projects.
                                        </Text>
                                        <Text style={{...styles.p,  "margin": "0px 0 0px 20px", "color": "#423e3e", "fontSize": "12px" }}>
                                            <Text style={{ "width": "5px", "height": "5px", "background": "#8d8d8d", "borderRadius": "50%", "display": "inline-block", "marginRight": "5px", "marginBottom": "3px" }}></Text>
                                            Organized sales and profit reports
                                        </Text>
                                        <Text style={{...styles.p,  "margin": "0px 0 0px 20px", "color": "#423e3e", "fontSize": "12px" }}>
                                            <Text style={{ "width": "5px", "height": "5px", "background": "#8d8d8d", "borderRadius": "50%", "display": "inline-block", "marginRight": "5px", "marginBottom": "3px" }}></Text>
                                            Prepare, review, and submit crucial budget plans for company goals,
                                        </Text>
                                    </Text>
                                </View>
                                <div style={{ "textAlign": "right", "width": "10%", "fontSize": "12px" }}>New York</div>
                            </View>
                        </View>

                        <View style={{ "borderBottom": "2px solid #000", "display": "block", "paddingBottom": "20px", "marginBottom": "10px" }}>
                            <View style={{ "paddingBottom": "10px", "display": "block" }}>
                                <h2 style={{ "fontWeight": "bold", "fontSize": "16px", "color": "#423e3e", "margin": "0" }}>EDUCATION</h2>
                            </View>
                            <View style={{ "display": "-webkit-inline-box", "display": "flex", "paddingBottom": "5px", "marginBottom": "5px", "width": "100%" }}>
                                <Text style={{ "width": "20%", "fontSize": "12px" }}>Jul 2009-Jul 203</Text>
                                <View style={{ "width": "70%" }}>
                                    <Text style={{ "fontWeight": "bold", "fontSize": "14px", "color": "#262424", "margin": "0" }}>Master of Accountancy, St. Joseph's College</Text>
                                    <View style={{ "paddingTop": "5px" }}>
                                        <Text style={{...styles.p,  "margin": "0px 0 0px 20px", "color": "#423e3e", "fontSize": "12px" }}>
                                            <Text style={{ "width": "5px", "height": "5px", "background": "#8d8d8d", "borderRadius": "50%", "display": "inline-block", "marginRight": "5px", "marginBottom": "3px" }}></Text>
                                            Graduated with High Honors
                                        </Text>
                                    </View>
                                </View>
                                <div style={{ "textAlign": "right", "width": "10%", "fontSize": "12px" }}>New York</div>
                            </View>
                            <View style={{ "display": "-webkit-inline-box", "display": "flex", "paddingBottom": "10px", "marginBottom": "10px", "width": "100%" }}>
                                <Text style={{ "width": "20%", "fontSize": "12px" }}>Jul 21 0-Jul 203</Text>
                                <View style={{ "width": "70%" }}>
                                    <Text style={{ "fontWeight": "bold", "fontSize": "14px", "color": "#262424", "margin": "0" }}>Huntington Associates</Text>
                                    <View style={{ "paddingTop": "5px" }}>
                                        <Text style={{...styles.p,  "margin": "0px 0 0px 20px", "color": "#423e3e", "fontSize": "12px" }}>
                                            <Text style={{ "width": "5px", "height": "5px", "background": "#8d8d8d", "borderRadius": "50%", "display": "inline-block", "marginRight": "5px", "marginBottom": "3px" }}></Text>
                                            Graduate summa cum laude.
                                        </Text>
                                        <Text style={{...styles.p,  "margin": "0px 0 0px 20px", "color": "#423e3e", "fontSize": "12px" }}>
                                            <Text style={{ "width": "5px", "height": "5px", "background": "#8d8d8d", "borderRadius": "50%", "display": "inline-block", "marginRight": "5px", "marginBottom": "3px" }}></Text>
                                            President of Student Counsel
                                        </Text>
                                    </View>
                                </View>
                                <View style={{ "textAlign": "right", "width": "10%", "fontSize": "12px" }}>Philadelphia</View>
                            </View>
                        </View>

                        <View style={{"display": "-webkit-inline-box", "display": "flex", "paddingBottom": "5px", "marginBottom": "5px", "width": "100%"}}>
                            <View style={{"width":"20%"}}>
                                <Text style={{"font-size":"12px", "margin":"0"}}>SKILLS</Text>
                            </View>
                            <View style={{"width":"30%"}}>
                                <View>
                                    <Text style={{"font-size":"12px", "margin":"0", "display": "block"}}>Financial Reporting</Text>
                                    <Text style={{"font-size":"12px", "margin":"0", "display": "block"}}>Budgeting & Forecasting</Text>
                                    <Text style={{"font-size":"12px", "margin":"0", "display": "block"}}>Interpersonal Skills</Text>
                                </View>
                            </View>
                            <View style={{"width":"10%"}}>
                                <Text style={{"font-size":"12px", "margin":"0", "display": "block"}}>Expert</Text>
                                <Text style={{"font-size":"12px", "margin":"0", "display": "block"}}>Expert</Text>
                                <Text style={{"font-size":"12px", "margin":"0", "display": "block"}}>Expert</Text>


                            </View>
                            <View style={{"width":"30%"}}>
                                <Text style={{"font-size":"12px", "margin":"0", "display": "block"}}>Advanced Technological Skills</Text>
                                <Text style={{"font-size":"12px", "margin":"0", "display": "block"}}>Effective Time Management</Text>

                            </View>
                            <View style={{"width":"10%", "textAlign": "right"}}>
                                <Text style={{"font-size":"12px", "margin":"0", "display": "block"}}>Expert</Text>
                                <Text style={{"font-size":"12px", "margin":"0", "display": "block"}}>Expert</Text>
                            </View>
                        </View>

                    </View>
                </View>
            </Page>
        </Document>
    )
}

export default TestTemplate;