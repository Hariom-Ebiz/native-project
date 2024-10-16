import React, { useState } from "react";

import EmployerAuth from "@/components/layout/EmployerAuth";
// import styles from "@/styles/aptitude_test.module.css"
import styles from "@/styles/subscriptions.module.css"
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Dropdown from 'react-bootstrap/Dropdown';
import Link from 'next/link';
import { createAxiosCookies, getCookies } from "@/fn";
import { getMyMemberships } from "@/services/employer/subscriptions";
import moment from "moment";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";


const getValidity = (months) => {
  let years = months/12;
  let month = months%12;

  return (years >= 1 && month) ? `${years} Years ${month} Months` : (years >= 0 && !month) ? `${years} Year` : `${month} Months`
}

const MyMembership = ({ list }) => {
const { t } = useTranslation('common');
const { companyProfile } = useSelector((store) => store.auth);

let remaningUnlocked = companyProfile.unlock_qty;
  const [activeList, setActiveList] = useState(list.filter(f => f.is_expire == "0") || [])

  const [expireList, setExpireList] = useState(list.filter(f => f.is_expire != "0") || [])

  return (
    <>
      <EmployerAuth data={{ title: "Membership History" }} />
      <div className="page_container">
        <div className="main_content" id="body_lang_css">
          <div className="company_message">
            <div className="company_message_left">
              <h3 className="Dash_subTitle">{t("My Membership")}</h3>
            </div>
          </div>
          <div className={styles.subscription_head}>

            <div className={styles.manage_job_table_box}>
              <h3 className={styles.table_heading}>{t("My Membership List")}</h3>
              <div className={`tabsBlock ps-0 ${styles.data_tableTabs}`}>
                <Tabs className="ps-4" defaultActiveKey="Posted Jobs">
                  <Tab eventKey="Posted Jobs" title={t("Active")}>
                    <div className={`table-responsive ${styles.data_table}`}>
                      <table className={`table mb-0 ${styles.table_min_height}`}>
                        <thead>
                          <tr>
                            <th>{t("Package")}</th>
                            <th style={{ textAlign: "center" }}>{t("Start Date")}</th>
                            <th style={{ textAlign: "center" }}>{t("Expiry Date")}</th>
                            <th style={{ textAlign: "center" }}>{t("Validity(Months)")}</th>
                            <th style={{ textAlign: "center" }}>{t("Granted Unlocked CVs")}</th>
                            <th style={{ textAlign: "center" }}>{t("Remaining CVs to Unlock")}</th>
                          </tr>
                        </thead>
                        <tbody className={styles.post_job_tbody}>
                          {
                            activeList.length <= 0 ?
                            (<tr><td colSpan={5} ><center>{t("No Data")}</center></td></tr>)
                            :
                            activeList.map(d => {
                              let val = 0;
                      
                      if(remaningUnlocked >= d.unlock_cv_qty){
                        val = d.unlock_cv_qty;
                        remaningUnlocked -= d.unlock_cv_qty;
                      } else {
                        val =  remaningUnlocked;
                        remaningUnlocked = 0;
                      }
                              return <tr>
                                <td style={{ textAlign: "left" }}>
                                 {d.title}
                                </td>
                                <td style={{ textAlign: "center" }}>{moment(d.start).format("DD MMMM YYYY")}</td>
                                <td style={{ textAlign: "center" }}>{moment(d.end).format("DD MMMM YYYY")}</td>
                                <td style={{ textAlign: "center" }}>{moment(d.end).diff(moment(d.start), "months")}</td>
                                <td style={{ textAlign: "center" }}>{d.unlock_cv_qty}</td>
                                <td style={{ textAlign: "center" }}>{Math.max(val,0)}</td>
                              </tr>
                            })
                          }
                        </tbody>
                      </table>
                    </div>
                  </Tab>
                  <Tab eventKey="Saved Jobs" title={t("Expired")}>
                    <div className={`table-responsive ${styles.data_table}`}>
                      <table className={`table mb-0 ${styles.table_min_height}`}>
                        <thead>
                          <tr>
                            <th>{t("Package")}</th>
                            <th>{t("Start Date")}</th>
                            <th>{t("Due Date")}</th>
                            <th>{t("Expiry Date")} </th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            expireList.length <= 0 ?
                            (<tr><td colSpan={4} ><center>{t("No Data")}</center></td></tr>)
                            :
                            expireList.map(d => (
                              <tr>
                                <td className="yy">{d.title}</td>
                                <td>{moment(d.start).format("DD MMMM YYYY")}</td>
                                <td>{moment(d.end).format("DD MMMM YYYY")}</td>
                                <td>{moment(d.end).format("DD MMMM YYYY")}</td>
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
        const { lang } = getCookies(context);
    let lang_code = "en";
  
    try {
      const language = JSON.parse(lang)
  
      lang_code = String(language.code).toLowerCase()
    } catch (error) {
      lang_code = "en"
    }
  return {
    props: {
      list: subscriptionList.list,
      publicHeader: false,
      publicFooter: false,
            ...(await serverSideTranslations(lang_code, [
                'common',
              ])),
    },
  };
}

export default MyMembership;
