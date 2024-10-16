import { axiosInstance } from "@/api";
export const getStaffData = async () => {
  let res;
  try {
    res = await axiosInstance.get(`staff/all`);
  } catch (err) {
    // console.log(err,"err")
    return {};
  }
  return { staffs: res?.data.staffs, totalDocuments: res?.data.totalDocuments };
};
export const getOne = async (id) => {
  let res;
  try {
    res = await axiosInstance.get(`staff/${id}`);
  } catch (err) {
    return {};
  }
  return { staff: res?.data.staff } || {};
};

export const getAnimitiesData = async (id) => {
  let res;
  try {
    res = await axiosInstance.get(`property/amenities`);
  } catch (err) {
    return [];
  }
  return res?.data.amenities || {};
};

export const getPropertiesData = async (id) => {
  let res;
  try {
    res = await axiosInstance.get(`property/property-type`);
  } catch (err) {
    return [];
  }
  return res?.data.propertyTypes || [];
};

export const getPropertiesDetails = async (id) => {
  let res;
  try {
    res = await axiosInstance.get(`property/${id}`);
  } catch (err) {
    return {};
  }
  {
    console.log(res, "res");
  }
  return { staff: res?.data.staff } || {};
};
