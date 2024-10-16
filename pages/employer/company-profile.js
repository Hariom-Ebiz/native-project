import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createAxiosCookies, getCookies } from "@/fn";
import style from "../../styles/company-profile.module.css";
import styles from "@/styles/editProfileTopbar.module.css";
import stylesPosition from "@/styles/job_list.module.css";
import EmployerAuth from "@/components/layout/EmployerAuth";
import { useSelector } from "react-redux";
import { IMAGEBASEURL } from "@/api";
import moment from "moment";
import { useRouter } from "next/router";
import { getCompanyProfile, getMyOpenJobs } from "@/services/employer/profile";
import { parseCookies } from "nookies";
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from "react-i18next";

const CompanyProfile = ({companyProfile, myJobs}) => {
  const route = useRouter();
  const { t } = useTranslation('common');
  // const { companyProfile } = useSelector((store) => store.auth);

  const phoneNumber = parsePhoneNumberFromString(`${companyProfile?.phone}`);

  useEffect(() => {
    if (companyProfile?.is_complete == 0) {
      route.push("/employer/edit-profile/step-1")
    }
  }, [])

  const [expandedTitles, setExpandedTitles] = useState({});

  const toggleTitle = (id) => {
    setExpandedTitles(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  return (
    <>
      <EmployerAuth data={{ data: "My Company" }} />
      <div className="page_container">
        <div className="main_content" id="body_lang_css">

          <div className="row">
            <div className="col-md-8">
              <div className={styles.cv_dashboard}>
                <div className={`${styles.profile_bg_img} ${styles.remove_before_bg}`}>
                  <figure>
                    <img
                      src={(companyProfile?.cover_image) ? `${IMAGEBASEURL}${companyProfile.cover_image}` : "/img/cover-pic2.png"}
                      alt=""
                      className={styles.img_wrapper}
                    />
                  </figure>
                  <Link
                    className={styles.edit_icon}
                    href='/employer/edit-profile/step-1'
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_29464_34860)">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M3.87868 6.87868C4.44129 6.31607 5.20435 6 6 6H9C9.55228 6 10 6.44772 10 7C10 7.55228 9.55228 8 9 8H6C5.73478 8 5.48043 8.10536 5.29289 8.29289C5.10536 8.48043 5 8.73478 5 9V18C5 18.2652 5.10536 18.5196 5.29289 18.7071C5.48043 18.8946 5.73478 19 6 19H15C15.2652 19 15.5196 18.8946 15.7071 18.7071C15.8946 18.5196 16 18.2652 16 18V15C16 14.4477 16.4477 14 17 14C17.5523 14 18 14.4477 18 15V18C18 18.7957 17.6839 19.5587 17.1213 20.1213C16.5587 20.6839 15.7957 21 15 21H6C5.20435 21 4.44129 20.6839 3.87868 20.1213C3.31607 19.5587 3 18.7956 3 18V9C3 8.20435 3.31607 7.44129 3.87868 6.87868Z"
                          fill="#F8F8FD"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M16.7929 2.79312C17.3783 2.20776 18.1722 1.87891 19 1.87891C19.8278 1.87891 20.6217 2.20776 21.2071 2.79312C21.7925 3.37848 22.1213 4.1724 22.1213 5.00023C22.1213 5.82805 21.7925 6.62197 21.2071 7.20733L12.7071 15.7073C12.5196 15.8949 12.2652 16.0002 12 16.0002H9C8.44772 16.0002 8 15.5525 8 15.0002V12.0002C8 11.735 8.10536 11.4807 8.29289 11.2931L16.7929 2.79312ZM19 3.87891C18.7026 3.87891 18.4174 3.99705 18.2071 4.20733L10 12.4144V14.0002H11.5858L19.7929 5.79312C20.0032 5.58283 20.1213 5.29762 20.1213 5.00023C20.1213 4.70283 20.0032 4.41762 19.7929 4.20733C19.5826 3.99705 19.2974 3.87891 19 3.87891Z"
                          fill="#F8F8FD"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M15.2929 4.29289C15.6834 3.90237 16.3166 3.90237 16.7071 4.29289L19.7071 7.29289C20.0976 7.68342 20.0976 8.31658 19.7071 8.70711C19.3166 9.09763 18.6834 9.09763 18.2929 8.70711L15.2929 5.70711C14.9024 5.31658 14.9024 4.68342 15.2929 4.29289Z"
                          fill="#F8F8FD"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_29464_34860">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </Link>
                  <div className={styles.dash_wrapper}>
                    <div className={styles.profile_detail}>
                      <div className={styles.profile_img}>
                        <img
                          src={(companyProfile?.logo) ? `${IMAGEBASEURL}${companyProfile.logo}` : "/img/user-icon2.jpg"}
                          alt=""
                          className={styles.user_profile}
                        />
                      </div>
                      <div className={styles.profile_content}>
                        <div className={styles.profile_description}>
                          <h2 className={styles.user_name}>

                            {companyProfile?.company_name}
                          </h2>
                          { }

                          <div className={styles.companyInfo}>
                            <ul className={styles.companyInfoBlock}>
                              <li className={styles.companyInfoItems}>
                                <div className={styles.IconBox}>
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.4678 8.3947L8.46555 8.39653L8.46341 8.39861L8.4678 8.3947ZM18.4219 8.20817C18.3523 8.14111 18.2751 8.08244 18.1919 8.03336C18.0741 7.96402 17.9433 7.91958 17.8076 7.9028C17.672 7.88601 17.5343 7.89723 17.4031 7.93577C17.272 7.9743 17.1501 8.03933 17.0451 8.12683C16.9401 8.21433 16.8541 8.32245 16.7925 8.4445C16.448 9.12319 15.9729 9.72718 15.3945 10.2218C15.483 9.72344 15.5276 9.21825 15.5278 8.71207C15.5297 7.17217 15.1234 5.65928 14.3505 4.32743C13.5775 2.99558 12.4654 1.89235 11.1274 1.13007C10.98 1.04651 10.8138 1.00178 10.6444 1.00005C10.475 0.998327 10.3079 1.03967 10.1588 1.12021C10.0098 1.20074 9.88362 1.31783 9.7922 1.46048C9.70078 1.60313 9.6471 1.76666 9.6362 1.93574C9.58024 2.88391 9.33236 3.81085 8.90759 4.6604C8.48282 5.50995 7.88999 6.26442 7.16503 6.8781L6.93456 7.0656C6.17648 7.57569 5.50546 8.2045 4.94726 8.9279C4.07958 10.021 3.47851 11.3012 3.19172 12.6671C2.90493 14.0329 2.94031 15.4468 3.29506 16.7966C3.6498 18.1464 4.31415 19.3949 5.23543 20.4433C6.1567 21.4916 7.30956 22.3109 8.60257 22.8361C8.75439 22.8981 8.91914 22.9219 9.08229 22.9052C9.24545 22.8885 9.40198 22.8319 9.5381 22.7404C9.67422 22.6489 9.78573 22.5254 9.8628 22.3806C9.93987 22.2358 9.98013 22.0743 9.98003 21.9103C9.97932 21.8042 9.96252 21.6989 9.93023 21.5978C9.7065 20.7568 9.64208 19.8814 9.74028 19.0168C10.6865 20.8015 12.2054 22.2162 14.0528 23.0334C14.2783 23.1342 14.5332 23.1478 14.7681 23.0715C16.2277 22.6004 17.5425 21.7639 18.5878 20.6415C19.633 19.5191 20.3739 18.1481 20.74 16.6588C21.1061 15.1694 21.0853 13.6112 20.6796 12.1321C20.2739 10.653 19.4967 9.30227 18.4219 8.20817ZM14.5171 21.0392C13.6454 20.5975 12.8765 19.9772 12.2603 19.2187C11.6441 18.4602 11.1944 17.5806 10.9405 16.6369C10.8629 16.3191 10.8029 15.9974 10.7608 15.673C10.7322 15.4665 10.6398 15.274 10.4965 15.1226C10.3532 14.9711 10.1661 14.8682 9.96146 14.8283C9.89841 14.8159 9.8343 14.8096 9.77003 14.8097C9.59427 14.8097 9.42161 14.856 9.26944 14.9439C9.11728 15.0319 8.991 15.1584 8.90333 15.3107C8.0736 16.7419 7.65633 18.3748 7.69776 20.0285C6.968 19.4611 6.35811 18.7545 5.90344 17.9497C5.44876 17.1449 5.15835 16.2578 5.04903 15.3399C4.93971 14.422 5.01366 13.4915 5.26658 12.6024C5.51951 11.7133 5.94639 10.8833 6.52247 10.1603C6.95989 9.59218 7.48756 9.09964 8.08447 8.70235C8.11032 8.68567 8.1351 8.6674 8.15869 8.64766C8.15869 8.64766 8.45538 8.40218 8.46552 8.39656C9.89022 7.19152 10.9035 5.57207 11.3643 3.76387C12.4538 4.7711 13.1804 6.1099 13.431 7.57238C13.6817 9.03485 13.4425 10.5392 12.7505 11.8518C12.6591 12.0269 12.6216 12.2252 12.6427 12.4216C12.6639 12.6181 12.7427 12.8039 12.8693 12.9555C12.9959 13.1072 13.1646 13.218 13.3541 13.2739C13.5436 13.3298 13.7454 13.3284 13.9341 13.2698C15.4659 12.7896 16.8138 11.8517 17.7964 10.5823C18.3869 11.4545 18.773 12.4489 18.9259 13.4911C19.0787 14.5334 18.9944 15.5967 18.6792 16.6018C18.364 17.6069 17.826 18.528 17.1054 19.2963C16.3847 20.0646 15.5 20.6604 14.5171 21.0393L14.5171 21.0392Z" fill="#26A4FF" />
                                  </svg>

                                </div>

                                <div className={styles.companyInfoBox}>
                                  <h4 className={styles.companyInfoTitle}>{t("Founded")}</h4>
                                  <h4 className={`${styles.companyInfoTitle} ${styles.companyInfoDark}`}>{(companyProfile.founded) ? moment(companyProfile.founded).format("MMM DD, YYYY") : "-"}</h4>

                                </div>
                              </li>
                              <li className={styles.companyInfoItems}>
                                <div className={styles.IconBox}>
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 5C11.4696 5 10.9609 5.21071 10.5858 5.58579C10.2107 5.96086 10 6.46957 10 7C10 7.53043 10.2107 8.03914 10.5858 8.41421C10.9609 8.78929 11.4696 9 12 9C12.5304 9 13.0391 8.78929 13.4142 8.41421C13.7893 8.03914 14 7.53043 14 7C14 6.46957 13.7893 5.96086 13.4142 5.58579C13.0391 5.21071 12.5304 5 12 5ZM9.17157 4.17157C9.92172 3.42143 10.9391 3 12 3C13.0609 3 14.0783 3.42143 14.8284 4.17157C15.5786 4.92172 16 5.93913 16 7C16 8.06087 15.5786 9.07828 14.8284 9.82843C14.0783 10.5786 13.0609 11 12 11C10.9391 11 9.92172 10.5786 9.17157 9.82843C8.42143 9.07828 8 8.06087 8 7C8 5.93913 8.42143 4.92172 9.17157 4.17157ZM5 9C4.73478 9 4.48043 9.10536 4.29289 9.29289C4.10536 9.48043 4 9.73478 4 10C4 10.2652 4.10536 10.5196 4.29289 10.7071C4.48043 10.8946 4.73478 11 5 11C5.26522 11 5.51957 10.8946 5.70711 10.7071C5.89464 10.5196 6 10.2652 6 10C6 9.73478 5.89464 9.48043 5.70711 9.29289C5.51957 9.10536 5.26522 9 5 9ZM2.87868 7.87868C3.44129 7.31607 4.20435 7 5 7C5.79565 7 6.55871 7.31607 7.12132 7.87868C7.68393 8.44129 8 9.20435 8 10C8 10.7956 7.68393 11.5587 7.12132 12.1213C6.55871 12.6839 5.79565 13 5 13C4.20435 13 3.44129 12.6839 2.87868 12.1213C2.31607 11.5587 2 10.7956 2 10C2 9.20435 2.31607 8.44129 2.87868 7.87868ZM19 9C18.7348 9 18.4804 9.10536 18.2929 9.29289C18.1054 9.48043 18 9.73478 18 10C18 10.2652 18.1054 10.5196 18.2929 10.7071C18.4804 10.8946 18.7348 11 19 11C19.2652 11 19.5196 10.8946 19.7071 10.7071C19.8946 10.5196 20 10.2652 20 10C20 9.73478 19.8946 9.48043 19.7071 9.29289C19.5196 9.10536 19.2652 9 19 9ZM16.8787 7.87868C17.4413 7.31607 18.2043 7 19 7C19.7957 7 20.5587 7.31607 21.1213 7.87868C21.6839 8.44129 22 9.20435 22 10C22 10.7957 21.6839 11.5587 21.1213 12.1213C20.5587 12.6839 19.7957 13 19 13C18.2043 13 17.4413 12.6839 16.8787 12.1213C16.3161 11.5587 16 10.7957 16 10C16 9.20435 16.3161 8.44129 16.8787 7.87868ZM12 13.9993C11.2003 13.9993 10.4189 14.2389 9.75658 14.6872C9.13228 15.1098 8.64084 15.6996 8.33765 16.3878L8.09655 19H15.9034L15.6623 16.3878C15.3592 15.6996 14.8677 15.1098 14.2434 14.6872C13.5811 14.2389 12.7997 13.9993 12 13.9993ZM18 19H21V18.0001C21 18 21 18.0001 21 18.0001C21 17.5845 20.8704 17.1791 20.6294 16.8405C20.3884 16.5019 20.0479 16.2467 19.6552 16.1106C19.2625 15.9744 18.8371 15.964 18.4382 16.0808C18.2014 16.1501 17.981 16.2621 17.7871 16.41C17.9262 16.9175 18 17.451 18 18V19ZM16.9298 14.5776C16.51 13.9732 15.9804 13.4479 15.3646 13.031C14.3713 12.3587 13.1994 11.9993 12 11.9993C10.8006 11.9993 9.62867 12.3587 8.63543 13.031C8.01963 13.4479 7.49002 13.9732 7.07024 14.5776C6.77575 14.3995 6.45782 14.2591 6.12365 14.1613C5.32584 13.9278 4.47509 13.9486 3.68967 14.2209C2.90425 14.4932 2.22318 15.0035 1.74115 15.6808C1.25911 16.358 1.00006 17.1686 1 17.9999V20C1 20.5523 1.44772 21 2 21H22C22.5523 21 23 20.5523 23 20V18C22.9999 17.1687 22.7409 16.358 22.2589 15.6808C21.7768 15.0035 21.0958 14.4932 20.3103 14.2209C19.5249 13.9486 18.6742 13.9278 17.8763 14.1613C17.5422 14.2591 17.2242 14.3995 16.9298 14.5776ZM6.21295 16.41C6.01904 16.2621 5.79859 16.1501 5.56183 16.0808C5.16292 15.964 4.73754 15.9744 4.34483 16.1106C3.95212 16.2467 3.61159 16.5019 3.37057 16.8405C3.12957 17.1791 3.00005 17.5844 3 18C3 18 3 18 3 18V19H6V18C6 17.451 6.07383 16.9175 6.21295 16.41Z" fill="#26A4FF" />
                                  </svg>


                                </div>

                                <div className={styles.companyInfoBox}>
                                  <h4 className={styles.companyInfoTitle}>{t("Number of Employees")}</h4>
                                  <h4 className={`${styles.companyInfoTitle} ${styles.companyInfoDark}`}>{companyProfile.employee_value ?? "-"}</h4>

                                </div>
                              </li>
                              <li className={styles.companyInfoItems}>
                                <div className={styles.IconBox}>
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_18_20878)">
                                      <path d="M3 21H21" stroke="#26A4FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                      <path d="M5 21V7L13 3V21" stroke="#26A4FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                      <path d="M19 21V11L13 7" stroke="#26A4FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                      <path d="M9 9V9.01" stroke="#26A4FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                      <path d="M9 12V12.01" stroke="#26A4FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                      <path d="M9 15V15.01" stroke="#26A4FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                      <path d="M9 18V18.01" stroke="#26A4FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_18_20878">
                                        <rect width="24" height="24" fill="white" />
                                      </clipPath>
                                    </defs>
                                  </svg>



                                </div>

                                <div className={styles.companyInfoBox}>
                                  <h4 className={styles.companyInfoTitle}>{t("Industry")}</h4>
                                  <h4 className={`${styles.companyInfoTitle} ${styles.companyInfoDark}`}>{companyProfile.industry_value ?? companyProfile.other_industry ?? "-"}</h4>

                                </div>

                              </li>
                              <li className={styles.companyInfoItems}>
                                <div className={styles.IconBox}>
                                  <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M14 2.25C16.5859 2.25 19.0658 3.27723 20.8943 5.10571C22.7228 6.93419 23.75 9.41414 23.75 12C23.75 16.12 20.855 20.61 15.14 25.518C14.8222 25.791 14.4171 25.9409 13.9981 25.9405C13.5792 25.9402 13.1743 25.7895 12.857 25.516L12.479 25.188C7.017 20.408 4.25 16.028 4.25 12C4.25 9.41414 5.27723 6.93419 7.10571 5.10571C8.93419 3.27723 11.4141 2.25 14 2.25ZM14 3.75C11.812 3.75 9.71354 4.61919 8.16637 6.16637C6.61919 7.71354 5.75 9.81196 5.75 12C5.75 15.502 8.298 19.537 13.464 24.057L13.837 24.38C13.8824 24.419 13.9402 24.4404 14 24.4404C14.0598 24.4404 14.1176 24.419 14.163 24.38C19.579 19.728 22.25 15.585 22.25 12C22.25 10.9166 22.0366 9.8438 21.622 8.84286C21.2074 7.84193 20.5997 6.93245 19.8336 6.16637C19.0675 5.40029 18.1581 4.7926 17.1571 4.37799C16.1562 3.96339 15.0834 3.75 14 3.75ZM14 8.25C14.9946 8.25 15.9484 8.64509 16.6517 9.34835C17.3549 10.0516 17.75 11.0054 17.75 12C17.75 12.9946 17.3549 13.9484 16.6517 14.6517C15.9484 15.3549 14.9946 15.75 14 15.75C13.0054 15.75 12.0516 15.3549 11.3483 14.6517C10.6451 13.9484 10.25 12.9946 10.25 12C10.25 11.0054 10.6451 10.0516 11.3483 9.34835C12.0516 8.64509 13.0054 8.25 14 8.25ZM14 9.75C13.4033 9.75 12.831 9.98705 12.409 10.409C11.9871 10.831 11.75 11.4033 11.75 12C11.75 12.5967 11.9871 13.169 12.409 13.591C12.831 14.0129 13.4033 14.25 14 14.25C14.5967 14.25 15.169 14.0129 15.591 13.591C16.0129 13.169 16.25 12.5967 16.25 12C16.25 11.4033 16.0129 10.831 15.591 10.409C15.169 9.98705 14.5967 9.75 14 9.75Z" fill="#26A4FF"/>
                                  </svg>
                                  
                                </div>

                                <div className={styles.companyInfoBox}>
                                  <h4 className={styles.companyInfoTitle}>{t("Location")}</h4>
                                  <h4 className={`${styles.companyInfoTitle} ${styles.companyInfoDark}`} style={{"textTransform": "capitalize"}}>
                                        {companyProfile?.area_name || companyProfile?.other_area || companyProfile?.area}, {companyProfile?.city}, {companyProfile?.country}
                                  </h4>

                                </div>
                              </li>
                              {/* <li className={styles.companyInfoItems}>
                                <div className={styles.IconBox}>
                                  <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M14 2.25C16.5859 2.25 19.0658 3.27723 20.8943 5.10571C22.7228 6.93419 23.75 9.41414 23.75 12C23.75 16.12 20.855 20.61 15.14 25.518C14.8222 25.791 14.4171 25.9409 13.9981 25.9405C13.5792 25.9402 13.1743 25.7895 12.857 25.516L12.479 25.188C7.017 20.408 4.25 16.028 4.25 12C4.25 9.41414 5.27723 6.93419 7.10571 5.10571C8.93419 3.27723 11.4141 2.25 14 2.25ZM14 3.75C11.812 3.75 9.71354 4.61919 8.16637 6.16637C6.61919 7.71354 5.75 9.81196 5.75 12C5.75 15.502 8.298 19.537 13.464 24.057L13.837 24.38C13.8824 24.419 13.9402 24.4404 14 24.4404C14.0598 24.4404 14.1176 24.419 14.163 24.38C19.579 19.728 22.25 15.585 22.25 12C22.25 10.9166 22.0366 9.8438 21.622 8.84286C21.2074 7.84193 20.5997 6.93245 19.8336 6.16637C19.0675 5.40029 18.1581 4.7926 17.1571 4.37799C16.1562 3.96339 15.0834 3.75 14 3.75ZM14 8.25C14.9946 8.25 15.9484 8.64509 16.6517 9.34835C17.3549 10.0516 17.75 11.0054 17.75 12C17.75 12.9946 17.3549 13.9484 16.6517 14.6517C15.9484 15.3549 14.9946 15.75 14 15.75C13.0054 15.75 12.0516 15.3549 11.3483 14.6517C10.6451 13.9484 10.25 12.9946 10.25 12C10.25 11.0054 10.6451 10.0516 11.3483 9.34835C12.0516 8.64509 13.0054 8.25 14 8.25ZM14 9.75C13.4033 9.75 12.831 9.98705 12.409 10.409C11.9871 10.831 11.75 11.4033 11.75 12C11.75 12.5967 11.9871 13.169 12.409 13.591C12.831 14.0129 13.4033 14.25 14 14.25C14.5967 14.25 15.169 14.0129 15.591 13.591C16.0129 13.169 16.25 12.5967 16.25 12C16.25 11.4033 16.0129 10.831 15.591 10.409C15.169 9.98705 14.5967 9.75 14 9.75Z" fill="#26A4FF"/>
                                  </svg>
                                  



                                </div>

                                <div className={styles.companyInfoBox}>
                                  <h4 className={styles.companyInfoTitle}>City</h4>
                                  <h4 className={`${styles.companyInfoTitle} ${styles.companyInfoDark}`} style={{"textTransform": "capitalize"}}>
                                        {companyProfile?.city}
                                  </h4>

                                </div>
                              </li>
                              <li className={styles.companyInfoItems}>
                                <div className={styles.IconBox}>
                                  <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M14 2.25C16.5859 2.25 19.0658 3.27723 20.8943 5.10571C22.7228 6.93419 23.75 9.41414 23.75 12C23.75 16.12 20.855 20.61 15.14 25.518C14.8222 25.791 14.4171 25.9409 13.9981 25.9405C13.5792 25.9402 13.1743 25.7895 12.857 25.516L12.479 25.188C7.017 20.408 4.25 16.028 4.25 12C4.25 9.41414 5.27723 6.93419 7.10571 5.10571C8.93419 3.27723 11.4141 2.25 14 2.25ZM14 3.75C11.812 3.75 9.71354 4.61919 8.16637 6.16637C6.61919 7.71354 5.75 9.81196 5.75 12C5.75 15.502 8.298 19.537 13.464 24.057L13.837 24.38C13.8824 24.419 13.9402 24.4404 14 24.4404C14.0598 24.4404 14.1176 24.419 14.163 24.38C19.579 19.728 22.25 15.585 22.25 12C22.25 10.9166 22.0366 9.8438 21.622 8.84286C21.2074 7.84193 20.5997 6.93245 19.8336 6.16637C19.0675 5.40029 18.1581 4.7926 17.1571 4.37799C16.1562 3.96339 15.0834 3.75 14 3.75ZM14 8.25C14.9946 8.25 15.9484 8.64509 16.6517 9.34835C17.3549 10.0516 17.75 11.0054 17.75 12C17.75 12.9946 17.3549 13.9484 16.6517 14.6517C15.9484 15.3549 14.9946 15.75 14 15.75C13.0054 15.75 12.0516 15.3549 11.3483 14.6517C10.6451 13.9484 10.25 12.9946 10.25 12C10.25 11.0054 10.6451 10.0516 11.3483 9.34835C12.0516 8.64509 13.0054 8.25 14 8.25ZM14 9.75C13.4033 9.75 12.831 9.98705 12.409 10.409C11.9871 10.831 11.75 11.4033 11.75 12C11.75 12.5967 11.9871 13.169 12.409 13.591C12.831 14.0129 13.4033 14.25 14 14.25C14.5967 14.25 15.169 14.0129 15.591 13.591C16.0129 13.169 16.25 12.5967 16.25 12C16.25 11.4033 16.0129 10.831 15.591 10.409C15.169 9.98705 14.5967 9.75 14 9.75Z" fill="#26A4FF"/>
                                  </svg>
                                  



                                </div>

                                <div className={styles.companyInfoBox}>
                                  <h4 className={styles.companyInfoTitle}>Country</h4>
                                  <h4 className={`${styles.companyInfoTitle} ${styles.companyInfoDark}`} style={{"textTransform": "capitalize"}}>
                                      {companyProfile?.country}
                                  </h4>

                                </div>
                              </li> */}
                            </ul>
                          </div>



                        </div>
                        <div className={styles.edit_btn}>
                          <Link
                            href='/employer/edit-profile/step-1'
                            className={styles.add_icon}
                          >
                            {t("Edit Profile")}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`${styles.dash_wrapper} ${styles.about_section}`} style={{"wordWrap": "break-word"}} >
                  <div className={styles.profile_heading}>
                    <h3 className={styles.inner_heading}>{t("About Company")}</h3>
                    <Link
                      href={'/employer/edit-profile/step-3'}
                      className={styles.add_icon}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_960_2897)">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M3.23223 5.73223C3.70107 5.26339 4.33696 5 5 5H7.5C7.96024 5 8.33333 5.3731 8.33333 5.83333C8.33333 6.29357 7.96024 6.66667 7.5 6.66667H5C4.77899 6.66667 4.56702 6.75446 4.41074 6.91074C4.25446 7.06702 4.16667 7.27899 4.16667 7.5V15C4.16667 15.221 4.25446 15.433 4.41074 15.5893C4.56702 15.7455 4.77899 15.8333 5 15.8333H12.5C12.721 15.8333 12.933 15.7455 13.0893 15.5893C13.2455 15.433 13.3333 15.221 13.3333 15V12.5C13.3333 12.0398 13.7064 11.6667 14.1667 11.6667C14.6269 11.6667 15 12.0398 15 12.5V15C15 15.663 14.7366 16.2989 14.2678 16.7678C13.7989 17.2366 13.163 17.5 12.5 17.5H5C4.33696 17.5 3.70107 17.2366 3.23223 16.7678C2.76339 16.2989 2.5 15.663 2.5 15V7.5C2.5 6.83696 2.76339 6.20107 3.23223 5.73223Z" fill="#2A3858" />
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M13.9939 2.32825C14.4817 1.84045 15.1433 1.56641 15.8332 1.56641C16.523 1.56641 17.1846 1.84045 17.6724 2.32825C18.1602 2.81605 18.4343 3.47765 18.4343 4.16751C18.4343 4.85736 18.1602 5.51896 17.6724 6.00676L10.5891 13.0901C10.4328 13.2464 10.2209 13.3342 9.99984 13.3342H7.49984C7.0396 13.3342 6.6665 12.9611 6.6665 12.5008V10.0008C6.6665 9.77983 6.7543 9.56787 6.91058 9.41158L13.9939 2.32825ZM15.8332 3.23307C15.5853 3.23307 15.3477 3.33152 15.1724 3.50676L8.33317 10.346V11.6675H9.65466L16.4939 4.82825C16.6692 4.65301 16.7676 4.41533 16.7676 4.16751C16.7676 3.91968 16.6692 3.682 16.4939 3.50676C16.3187 3.33152 16.081 3.23307 15.8332 3.23307Z" fill="#2A3858" />
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M12.7441 3.57806C13.0695 3.25263 13.5972 3.25263 13.9226 3.57806L16.4226 6.07806C16.748 6.4035 16.748 6.93114 16.4226 7.25657C16.0972 7.58201 15.5695 7.58201 15.2441 7.25657L12.7441 4.75657C12.4186 4.43114 12.4186 3.9035 12.7441 3.57806Z" fill="#2A3858" />
                        </g>
                        <defs>
                          <clipPath id="clip0_960_2897">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>

                    </Link>
                  </div>
                  <div className={styles.inner_content} dangerouslySetInnerHTML={{ __html: companyProfile.description?.replace(/\n/g,"<br />") }} />
                  {/* <div className="text-container" dangerouslySetInnerHTML={{ __html: this.props.text }} />
                      <h1>Hello world</div>
                  </div> */}
                  {/* <p className={styles.inner_content}>{companyProfile.description ?? "-"}</p> */}
                </div>


                  {
                    myJobs.length <= 0 ? (
                      <>
                        <h2 className={styles.box_heading}>{t("Open Positions")}</h2>
                        <div className={stylesPosition.job_relevant_Box}>
                          <div className="row">
                            <div className="col-xl-8 col-md-8 col-lg-12">
                              <span>No Jobs Posted Yet</span>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <h2 className={styles.box_heading}>{t("Open Positions")}</h2>
                        {
                          myJobs.map((d, i) => {
                            return (
                              <div className={stylesPosition.job_relevant_Box}>
                                    <div className="row">
                                      <div className="col-xl-8 col-md-8 col-lg-12">
                                        <div className={stylesPosition.job_relevant_left}>
                                          <figure className={stylesPosition.userImg}>
                                            <img src={(companyProfile.logo) ? `${IMAGEBASEURL}${companyProfile.logo}` : "/img/no-image.jpg"} alt="user" />
                                          </figure>
                                          <div className={stylesPosition.cv_content}>
                                            <div className={stylesPosition.userNameBox} style={{marginBottom: "5px"}}>
                                              {/* <Link
                                                href={`/job-seeker/job-description/${d.id}`}
                                              > */}
                                                <h3 className={stylesPosition.user_name_text} onClick={() => toggleTitle(d.id)} title={`${d.title}`} style={{
                                                  "display": "inline",
                                                  "wordBreak": "break-word"
                                                }} >{(expandedTitles[d.id] || d.title.length < 30) ? d.title : `${d.title.substring(0, 30)}...`}</h3>
                                              {/* </Link> */}
                                            </div>
      
      
                                            {/* <ul className={stylesPosition.userDetailsBox}>
                                              <li className={stylesPosition.userItemsBox}>{companyProfile.company_name.substring(0, 10)}...</li>
                                              <li className={stylesPosition.userItemsBox}>
                                                {d.city_name}, {d.country_name}
                                              </li>
                                            </ul> */}
                                            <div className="mb-2" style={{color: "#7C8493", fontSize: "14px", fontWeight: 400}}> 
                                                {(d.is_posted) ? "Posted on :" : "Saved on :"} {(d.is_posted) ? moment(d.posted_on).format("MMMM DD, YYYY") : moment(d.created_at).format("MMMM DD, YYYY")}
                                            </div>
      
                                            <ul className={stylesPosition.statusBox}>
                                              <li
                                                className={`${stylesPosition.statusItems} ${stylesPosition.LightblueBtn}`}
                                              >
                                                {(d.is_posted) ? "Posted" : "Saved"}
                                              </li>
                                              <li
                                                className={`${stylesPosition.statusItems} ${stylesPosition.greenBtn}`}
                                              >
                                                {d.job_type_name}
                                              </li>
                                              <li
                                                className={`${stylesPosition.statusItems} ${stylesPosition.yellowBtn}`}
                                              >
                                                {d.job_category_id ? d.job_category_name : d.other_job_category}
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-xl-4 col-md-4 col-lg-12">
                                        <div className={stylesPosition.job_relevant_right}>
      
                                          <div className={styles.job_details_progressBar}>
                                            <div className="job_tabs">
                                              <div className="tab-content" id="pills-tabContent">
                                                <div
                                                  className="tab-pane fade show active"
                                                  id="pills-home"
                                                  role="tabpanel"
                                                  aria-labelledby="pills-home-tab"
                                                  tabIndex="0"
                                                >
                                                  <div className="inner_deta">
                                                    <div
                                                      className="progress"
                                                      role="progressbar"
                                                      aria-label="Basic example"
                                                      aria-valuenow="25"
                                                      aria-valuemin="0"
                                                      aria-valuemax="100"
                                                    >
                                                      <div
                                                        className="progress-bar"
                                                        style={{ width: (d.totalApplied < d.vacancies) ? `${Math.round((d.totalApplied / d.vacancies) * 100)}%` : "100%" }}
                                                      ></div>
                                                    </div>
                                                    <div className="apply_count">
                                                      <h5>
                                                      {`${d.totalApplied} applicant${d.totalApplied > 1 ? "s" : ""} | ${d.vacancies} vacant position${d.vacancies > 1 ? "s" : ""}`}
                                                      </h5>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div
                                                  className="tab-pane fade"
                                                  id="pills-profile"
                                                  role="tabpanel"
                                                  aria-labelledby="pills-profile-tab"
                                                  tabIndex="0"
                                                >
                                                  ...
                                                </div>
                                              </div>
                                            </div>
                                            
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                              </div>
                            )
                          })
                        }
                        <br />
                        <center>

                          <Link href={"/employer/manage-jobs"}>
                            <button className="btn btn-primary">{t("View All")}</button>
                          </Link>
                        </center>
                      </>
                    )
                  }
              </div>
            </div>
            <div className="col-md-4">
              <div className={styles.right_section}>

                <div className={`${styles.dash_wrapper} ${styles.contact}`}>
                  <div className={`${styles.profile_heading} mb-0`}>
                    <h3 className={styles.inner_heading}>{t("Social Links")}</h3>
                    <Link

                      href={'/employer/edit-profile/step-4'}
                      className={styles.add_icon}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_960_2897)">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M3.23223 5.73223C3.70107 5.26339 4.33696 5 5 5H7.5C7.96024 5 8.33333 5.3731 8.33333 5.83333C8.33333 6.29357 7.96024 6.66667 7.5 6.66667H5C4.77899 6.66667 4.56702 6.75446 4.41074 6.91074C4.25446 7.06702 4.16667 7.27899 4.16667 7.5V15C4.16667 15.221 4.25446 15.433 4.41074 15.5893C4.56702 15.7455 4.77899 15.8333 5 15.8333H12.5C12.721 15.8333 12.933 15.7455 13.0893 15.5893C13.2455 15.433 13.3333 15.221 13.3333 15V12.5C13.3333 12.0398 13.7064 11.6667 14.1667 11.6667C14.6269 11.6667 15 12.0398 15 12.5V15C15 15.663 14.7366 16.2989 14.2678 16.7678C13.7989 17.2366 13.163 17.5 12.5 17.5H5C4.33696 17.5 3.70107 17.2366 3.23223 16.7678C2.76339 16.2989 2.5 15.663 2.5 15V7.5C2.5 6.83696 2.76339 6.20107 3.23223 5.73223Z" fill="#2A3858" />
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M13.9939 2.32825C14.4817 1.84045 15.1433 1.56641 15.8332 1.56641C16.523 1.56641 17.1846 1.84045 17.6724 2.32825C18.1602 2.81605 18.4343 3.47765 18.4343 4.16751C18.4343 4.85736 18.1602 5.51896 17.6724 6.00676L10.5891 13.0901C10.4328 13.2464 10.2209 13.3342 9.99984 13.3342H7.49984C7.0396 13.3342 6.6665 12.9611 6.6665 12.5008V10.0008C6.6665 9.77983 6.7543 9.56787 6.91058 9.41158L13.9939 2.32825ZM15.8332 3.23307C15.5853 3.23307 15.3477 3.33152 15.1724 3.50676L8.33317 10.346V11.6675H9.65466L16.4939 4.82825C16.6692 4.65301 16.7676 4.41533 16.7676 4.16751C16.7676 3.91968 16.6692 3.682 16.4939 3.50676C16.3187 3.33152 16.081 3.23307 15.8332 3.23307Z" fill="#2A3858" />
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M12.7441 3.57806C13.0695 3.25263 13.5972 3.25263 13.9226 3.57806L16.4226 6.07806C16.748 6.4035 16.748 6.93114 16.4226 7.25657C16.0972 7.58201 15.5695 7.58201 15.2441 7.25657L12.7441 4.75657C12.4186 4.43114 12.4186 3.9035 12.7441 3.57806Z" fill="#2A3858" />
                        </g>
                        <defs>
                          <clipPath id="clip0_960_2897">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>

                    </Link>
                  </div>
                  <div className={styles.contact_detail}>
                    <ul className={styles.contact_box}>
                      <li className={styles.contact_list} style={{ width: "100%" }}>
                        <div className={styles.contact_icon}>
                          <span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <g clip-path="url(#clip0_18_20965)">
                                <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#7C8493" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M3.6001 9H20.4001" stroke="#7C8493" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M3.6001 15H20.4001" stroke="#7C8493" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M11.5002 3C9.8155 5.69961 8.92236 8.81787 8.92236 12C8.92236 15.1821 9.8155 18.3004 11.5002 21" stroke="#7C8493" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M12.5 3C14.1847 5.69961 15.0778 8.81787 15.0778 12C15.0778 15.1821 14.1847 18.3004 12.5 21" stroke="#7C8493" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                              </g>
                              <defs>
                                <clipPath id="clip0_18_20965">
                                  <rect width="24" height="24" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>


                          </span>
                        </div>
                        <div className={styles.contact_content} style={{ width: "calc(100% - 40px)" }}>
                          <span>{t("Website")}</span>
                          <a href={(companyProfile.website) ? (companyProfile.website.includes("https://") ? companyProfile.website : `https://${companyProfile.website}`) : "#!" } target="_blank" rel="noopener noreferrer" style={{ wordWrap: "break-word" }}>
                            {companyProfile.website ?? "-"}
                          </a>
                        </div>
                      </li>
                      <li className={styles.contact_list} style={{ width: "100%" }}>
                        <div className={styles.contact_icon}>
                          <span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <g clip-path="url(#clip0_18_20970)">
                                <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="#7C8493" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M3 7L12 13L21 7" stroke="#7C8493" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                              </g>
                              <defs>
                                <clipPath id="clip0_18_20970">
                                  <rect width="24" height="24" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </span>
                        </div>
                        <div className={styles.contact_content} style={{ width: "calc(100% - 40px)" }}>
                          <span>{t("Email")}</span>
                          <a href={`mailto: ${companyProfile.email}`} target="_blank" style={{ wordWrap: "break-word" }}>
                            {companyProfile.email ?? "-"}
                          </a>
                        </div>
                      </li>
                      <li className={styles.contact_list}>
                        <div className={styles.contact_icon}>
                          <span>
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_528_23115)">
                                <path
                                  d="M16 4H8C7.44772 4 7 4.44772 7 5V19C7 19.5523 7.44772 20 8 20H16C16.5523 20 17 19.5523 17 19V5C17 4.44772 16.5523 4 16 4Z"
                                  stroke="#7C8493"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M11 5H13"
                                  stroke="#7C8493"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M12 17V17.01"
                                  stroke="#25324B"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_528_23115">
                                  <rect width="24" height="24" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </span>
                        </div>
                        <div className={styles.contact_content}>
                          <span>{t("Phone")}</span>
                          <a href={phoneNumber?.getURI()} target="_blank">
                            {phoneNumber?.formatInternational()}
                          </a>
                        </div>
                      </li>
                      <li className={styles.contact_list} style={{ width: "100%" }}>
                        <div className={styles.contact_icon}>
                          <span>
                            <svg width="24" height="24" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <g clip-path="url(#clip0_186_11517)">
                                <rect width="512" height="512" rx="70" fill="rgb(124, 132, 147)" />
                                <path d="M442.182 0H69.8182C51.3013 0 33.5427 7.35582 20.4493 20.4493C7.35582 33.5427 0 51.3013 0 69.8182L0 442.182C0 460.699 7.35582 478.457 20.4493 491.551C33.5427 504.644 51.3013 512 69.8182 512H442.182C460.699 512 478.457 504.644 491.551 491.551C504.644 478.457 512 460.699 512 442.182V69.8182C512 51.3013 504.644 33.5427 491.551 20.4493C478.457 7.35582 460.699 0 442.182 0ZM174.545 405.178C174.549 406.598 174.273 408.005 173.732 409.317C173.192 410.63 172.397 411.823 171.395 412.829C170.392 413.834 169.201 414.632 167.89 415.176C166.578 415.72 165.173 416 163.753 416H117.76C116.338 416.004 114.929 415.727 113.614 415.184C112.299 414.642 111.105 413.845 110.099 412.839C109.094 411.833 108.297 410.639 107.754 409.324C107.212 408.009 106.934 406.6 106.938 405.178V212.364C106.938 209.494 108.078 206.741 110.108 204.711C112.137 202.682 114.89 201.542 117.76 201.542H163.753C166.618 201.55 169.363 202.693 171.386 204.722C173.409 206.75 174.545 209.499 174.545 212.364V405.178ZM140.742 183.273C132.111 183.273 123.675 180.714 116.499 175.919C109.323 171.124 103.73 164.309 100.427 156.335C97.1243 148.362 96.2602 139.588 97.9439 131.123C99.6276 122.659 103.784 114.883 109.886 108.781C115.989 102.678 123.764 98.5222 132.229 96.8385C140.693 95.1547 149.467 96.0189 157.441 99.3216C165.414 102.624 172.229 108.217 177.024 115.393C181.819 122.569 184.378 131.006 184.378 139.636C184.378 151.209 179.781 162.309 171.597 170.492C163.414 178.675 152.315 183.273 140.742 183.273ZM414.953 405.935C414.957 407.242 414.702 408.538 414.203 409.746C413.705 410.955 412.972 412.054 412.047 412.978C411.123 413.903 410.024 414.636 408.816 415.134C407.607 415.633 406.311 415.888 405.004 415.884H355.549C354.241 415.888 352.946 415.633 351.737 415.134C350.528 414.636 349.43 413.903 348.505 412.978C347.581 412.054 346.848 410.955 346.35 409.746C345.851 408.538 345.596 407.242 345.6 405.935V315.607C345.6 302.109 349.556 256.495 310.313 256.495C279.913 256.495 273.716 287.709 272.495 301.731V406.051C272.495 408.665 271.467 411.173 269.632 413.035C267.798 414.897 265.304 415.962 262.691 416H214.924C213.618 416 212.326 415.742 211.121 415.242C209.915 414.742 208.82 414.008 207.899 413.084C206.977 412.16 206.247 411.063 205.75 409.856C205.254 408.649 205 407.356 205.004 406.051V211.52C205 210.215 205.254 208.922 205.75 207.715C206.247 206.508 206.977 205.411 207.899 204.487C208.82 203.562 209.915 202.829 211.121 202.329C212.326 201.828 213.618 201.571 214.924 201.571H262.691C265.33 201.571 267.86 202.619 269.726 204.485C271.592 206.351 272.64 208.881 272.64 211.52V228.335C283.927 211.375 300.655 198.342 336.349 198.342C415.418 198.342 414.895 272.175 414.895 312.727L414.953 405.935Z" fill="white" />
                              </g>
                              <defs>
                                <clipPath id="clip0_186_11517">
                                  <rect width="512" height="512" rx="70" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </span>
                        </div>
                        <div className={styles.contact_content} style={{ width: "calc(100% - 40px)" }}>
                          <span>{t("LinkedIn")}</span>
                          <a href={companyProfile.linkedin ?? "#"} target="_blank" style={{ wordWrap: "break-word" }}>
                            {companyProfile.linkedin ?? "-"}
                          </a>
                        </div>
                      </li>
                      <li className={styles.contact_list} style={{ width: "100%" }}>
                        <div className={styles.contact_icon}>
                          <span>
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <mask id="mask0_538_2078" mask-type="luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="18" height="18">
                                <path d="M18 0H0V18H18V0Z" fill="white" />
                              </mask>
                              <g mask="url(#mask0_538_2078)">
                                <path
                                  d="M9.61504 11.0295V18H12.4208V11.025H14.763L15.114 8.30853H12.4208V6.57528C12.4208 5.78928 12.6398 5.25303 13.7678 5.25303L15.2055 5.25228V2.82228C14.9558 2.78928 14.103 2.71503 13.1093 2.71503C11.0355 2.71503 9.61504 3.98103 9.61504 6.30603V8.31303H7.26904V11.0295H9.61504Z"
                                  stroke="#7C8493"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </g>
                            </svg>

                          </span>
                        </div>
                        <div className={styles.contact_content} style={{ width: "calc(100% - 40px)" }}>
                          <span>{t("Facebook")}</span>
                          <a href={companyProfile.facebook ?? "#!"} target="_blank" style={{ wordWrap: "break-word" }}>
                            {companyProfile.facebook ?? "-"}
                          </a>
                        </div>
                      </li>

                    </ul>
                  </div>
                </div>

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

  const cookies = parseCookies(context);
  const token = cookies['token'];

  const companyProfile = await getCompanyProfile(token);
  const myJobs = await getMyOpenJobs(token);
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
      companyProfile: companyProfile.companyPro,
      myJobs: myJobs.myJobs,
      publicHeader: false,
      publicFooter: false,
      isProtected: true,
      ...(await serverSideTranslations(lang_code, [
        'common',
      ])),
    },
  };
}

export default CompanyProfile;
