import { axiosInstance } from "@/api";

export const getTicketCategories = async () => {
  let res;
  try {
    res = await axiosInstance.get(`ticket-category/all`);
  } catch (err) {
    console.log(err);
    return [];
  }
  //   console.log(res.data);
  return res.data.data || [];
};
