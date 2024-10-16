import React,{useState} from "react";

import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
// import styles from "@/styles/aptitude_test.module.css"
import styles from "@/styles/subscriptions.module.css"
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Dropdown from 'react-bootstrap/Dropdown';
import Link from 'next/link';
import { getMyMemberships } from "@/services/jobSeeker/subscription";
import { createAxiosCookies } from "@/fn";
import moment, { isMoment } from "moment";

const MyMembership = ({list}) => {

  const [activeList, setActiveList] = useState(list.filter(f => f.is_expire == "0") || [])

  const [expireList, setExpireList] = useState(list.filter(f => f.is_expire != "0") || [])

  return (
    <>
      <JobSeekerAuth data={{ title: "My Membership" }} />
      <div className="page_container">
        <div className="main_content" id="body_lang_css">
        <div className={styles.subscription_head}>
             
              <div className={styles.manage_job_table_box}>
                <h3 className={styles.table_heading}>My Membership List</h3>
                  <div className={`tabsBlock ps-0 ${styles.data_tableTabs}`}>
                  <Tabs className="ps-4" defaultActiveKey="Posted Jobs">
                        <Tab eventKey="Posted Jobs" title="Active">
                          <div className={`table-responsive ${styles.data_table}`}>
                            <table className={`table mb-0 ${styles.table_min_height}`}>
                              <thead>
                                <tr>
                                  <th>Package</th>
                                  <th style={{ textAlign: "center" }}>Start Date</th>
                                  <th style={{ textAlign: "center" }}>Expiry Date</th>
                                  <th style={{ textAlign: "center" }}>Remaining Lessons to Complete </th>
                                
                                </tr>
                              </thead>
                              <tbody className={styles.post_job_tbody}>
                                {
                                  activeList.length <= 0 ?
                                  (
                                    <tr>
                                      <td colSpan={5}><center>No info. to display</center></td>
                                    </tr>
                                  ) : 
                                  activeList.map(d => (
                                    <tr>
                                        <td style={{ textAlign: "left" }}>{d.title} {d.course_type == "functional_mastery" && "(" + d.sub_course_type_name + ")"}</td>
                                        <td style={{ textAlign: "center" }}>{moment(d.start).format("DD MMM YYYY")}</td>
                                        <td style={{ textAlign: "center" }}>{moment(d.end).format("DD MMM YYYY")}</td>
                                        <td style={{ textAlign: "center" }}><span className={styles.job_type}>{d.totalLessons - d.completedLessons}</span></td>
                                    </tr>
                                  ))
                                }
                              </tbody>
                            </table>
                          </div>
                        </Tab>
                        <Tab eventKey="Saved Jobs" title="Expired">
                          <div className={`table-responsive ${styles.data_table}`}>
                            <table className={`table mb-0 ${styles.table_min_height}`}>
                              <thead>
                                <tr>
                                  <th>Package</th>
                                  <th>Start Date</th>
                                  <th>Expiry Date </th>
                                </tr>
                              </thead>
                              <tbody>
                              {
                                  expireList.length <= 0 ?
                                  (
                                    <tr>
                                      <td colSpan={3}><center>No info. to display</center></td>
                                    </tr>
                                  ) : 
                                  expireList.map(d => (
                                    <tr>
                                        <td className="yy">{d.title}</td>
                                        <td>{moment(d.start).format("DD MMM YYYY")}</td>
                                        <td>{moment(d.end).format("DD MMM YYYY")}</td>
                                    </tr>
                                  ))
                                }
                              </tbody>
                            </table>
                          </div>
                        </Tab>
                  </Tabs>
                  </div>
            </div>
       </div>

        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  createAxiosCookies(context);
  const subscriptionList = await getMyMemberships();
  return {
    props: {
      list: subscriptionList.list,
      publicHeader: false,
      publicFooter: false,
    },
  };
}

export default MyMembership;
