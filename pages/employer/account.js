import React, { useEffect, useState } from "react";
import styles from "@/styles/profile.module.css";
import useRequest from "@/hooks/useRequest";
import { createAxiosCookies, getCookies } from "@/fn";
import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import { Controller, useForm } from "react-hook-form";
import { API, axiosInstance } from "@/api";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { update } from "@/store/authSlice";
import {
  NumberInput,
  SelectInput,
  TextInput,
} from "@/components/cv/inputFields";
import ChangePassword from "@/components/jobSeeker/ChangePassword";
import EmployerAuth from "@/components/layout/EmployerAuth";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from "react-i18next";

const EditProfile = ({ profileData, statusData, liveInData }) => {
const { t } = useTranslation('common');
  return (
    <EmployerAuth data={{ title:`Account`}} >
      <div className="page_container">
        <div className={` main_content main_bg `} id="body_lang_css">
          <ChangePassword />
        </div>
      </div>
    </EmployerAuth>
  );
};
export async function getServerSideProps(context) {
  createAxiosCookies(context);
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
      isProtected: true,
                  ...(await serverSideTranslations(lang_code, [
                'common',
              ])),
    },
  };
}

export default EditProfile;
