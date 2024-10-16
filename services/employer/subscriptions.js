import { axiosInstance } from "../../api";

export const getAllSubscriptions = async () => {
  let res;
  try {
    res = await axiosInstance.get("subscription/users/list");
  } catch (err) {
    console.log("something went wrong");
    return {
        subscriptions: [],
    };
  }
  return {
    subscriptions: res?.data?.subscriptions || [],
  };
};

export const getMyMemberships = async () => {
  let res;
  try {
    res = await axiosInstance.get("subscribe/list");
  } catch (err) {
    console.log("something went wrong", err);
    return {
        list: [],
    };
  }
  return {
    list: res?.data?.memershipList || [],
  };
};


