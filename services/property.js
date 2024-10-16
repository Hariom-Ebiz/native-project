import { axiosInstance } from "@/api";

export const getAllSelect = async () => {
  let res;
  try {
    res = await axiosInstance.get(`property/all-select`);
  } catch (err) {
    // console.log(err,"err")
    return [];
  }
  return res?.data.properties ?? [];
};
