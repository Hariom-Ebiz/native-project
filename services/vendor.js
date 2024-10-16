import { axiosInstance } from "@/api";

export const getAllVendors = async () => {
  let res;
  try {
    res = await axiosInstance.get(`vendor/all`);
  } catch (err) {
    console.log(err);
    console.log("something went wrong");
    return {};
  }
  return (
    { vendors: res?.data.vendors, totalDocuments: res?.data.totalDocuments } ||
    {}
  );
};
export const getOne = async (id) => {
  let res;
  try {
    res = await axiosInstance.get(`vendor/${id}`);
  } catch (err) {
    return {};
  }
  return {vendor: res?.data.vendor} || {};
};

export const getAllCategories = async () => {
  let res;
  try {
    res = await axiosInstance.get(`vendor/categories`);
  } catch (err) {
    return [];
  }
  return res?.data.categories || [];
};
