import { axiosInstance } from "@/api";

export const getAgentData = async () => {
  let res;
  try {
    res = await axiosInstance.get(`agent/all`);
  } catch (err) {
    console.log(err);
    console.log("something went wrong");
    return {};
  }
  return (
    { agents: res?.data.users, totalDocuments: res?.data.totalDocuments } || {}
  );
};
export const getOne = async (id) => {
  let res;
  try {
    res = await axiosInstance.get(`agent/${id}`);
  } catch (err) {
    return {};
  }
  return {agent: res?.data.agent} || {};
};