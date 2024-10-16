import { axiosInstance } from "@/api";

export const getOwnerData = async () => {
  let res;
  try {
    res = await axiosInstance.get(`owner/all`);
  } catch (err) {
    console.log(err);
    console.log("something went wrong");
    return {};
  }
  return (
    { owners: res?.data.owners, totalDocuments: res?.data.totalDocuments } || {}
  );
};
export const getOne = async (id) => {
  let res;
  try {
    res = await axiosInstance.get(`owner/${id}`);
  } catch (err) {
    return {};
  }
  return {owner: res?.data.owner} || {};
};


export const ownerGetDetails = async (id) => {
  let res;
  try {
    res = await axiosInstance.get(`owner/${id}`);
  } catch (err) {
    return {};
  }
  return  res?.data.owner || {};
};
