import { axiosInstance } from "../../api";

export const getCompanyProfile = async (token) => {
  let res;
  try {
    res = await axiosInstance.get("company/profile/user/get", {headers: {"Authorization": `Bearer ${token}`}});
  } catch (err) {
    console.log("something went wrong");
    return {
        companyPro: {},
    };
  }
  return {
    companyPro: res?.data?.profile || {},
  };
};

export const getMyOpenJobs = async (token) => {
  let res;
  try {
    res = await axiosInstance.get("company/profile/my/jobs", {headers: {"Authorization": `Bearer ${token}`}});
  } catch (err) {
    console.log("something went wrong");
    return {
        myJobs: {},
    };
  }
  return {
    myJobs: res?.data?.jobs || {},
  };
};


