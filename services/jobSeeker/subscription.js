import { axiosInstance } from "../../api";

export const getAllSubscriptions = async () => {
  let res;
  try {
    res = await axiosInstance.get("candidate-subscription/users/list");
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

export const getAllFunctionMasteryPackages = async () => {
  let res;
  try {
    res = await axiosInstance.get("functional-mastery/package");
  } catch (err) {
    console.log("something went wrong");
    return {
        packages: [],
    };
  }
  return {
    packages: res?.data?.list || [],
  };
};

export const getMyMemberships = async () => {
  let res;
  try {
    res = await axiosInstance.get("/subscribe/candidate/list");
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


