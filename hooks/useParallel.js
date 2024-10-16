import { login, logout } from "@/store/authSlice";
import { updateSetting } from "@/store/siteSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useRequest from "./useRequest";
import { languageChange } from "@/services/language";

const useParallel = () => {
  const dispatch = useDispatch();
  const { loggedIn, role, token } = useSelector((store) => store.auth);
  const { request: validateAuthReq, response: validateAuthRes } = useRequest();
  const { request: settingReq, response: settingRes } = useRequest();

  const getSettings = () => {
    settingReq("GET", "setting/client-settings");
  };

  useEffect(() => {
    if (settingRes && settingRes.status) {
      dispatch(updateSetting(settingRes.settings));
    }
  }, settingRes);

  const authenticate = () => {
    let authToken = localStorage.getItem("authToken");
    if (!authToken) {
      dispatch(logout());
      return;
    };

    authToken = JSON.parse(authToken);
    validateAuthReq("POST", "user/verify", { token: authToken });
  };

  useEffect(() => {
    if (validateAuthRes) {
      console.log(">>>>>>Aseee", validateAuthRes);
      if (validateAuthRes?.status) {
        dispatch(
          login({
            token: validateAuthRes.token,
            userId: validateAuthRes?.user?.userId,
            email: validateAuthRes?.user?.email,
            firstName: validateAuthRes?.user?.firstName,
            lastName: validateAuthRes?.user?.lastName,
            role: validateAuthRes?.user?.role,
            profilePic: validateAuthRes?.user?.profile_picture,
            cvStep: validateAuthRes?.user?.cvStep || null,
            was_subscriber: validateAuthRes?.was_subscriber || null,
            is_subscriber: validateAuthRes?.is_subscriber || null,
            subscription: validateAuthRes?.subscription
          })
        );
      } else {
        dispatch(logout());
      }
    }
  }, [validateAuthRes]);

  useEffect(() => { 
    const get = localStorage.getItem("lang");
    languageChange(get); 
  },[])
  return {
    authenticate,
    getSettings,
  };
};

export default useParallel;
