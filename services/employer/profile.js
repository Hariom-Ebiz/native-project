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


