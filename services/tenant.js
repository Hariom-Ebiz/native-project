import { axiosInstance } from "@/api";

export const getTenantData = async () => {
  let res;
  try {
    res = await axiosInstance.get(`tenant/all`);
  } catch (err) {
    return {};
  }
  return (
    { tenants: res?.data.tenants, totalDocuments: res?.data.totalDocuments } ||
    {}
  );
};

export const getOne = async (id) => {
  let res;
  try {
    res = await axiosInstance.get(`tenant/${id}`);
  } catch (err) {
    return {};
  }
  return { tenant: res?.data.tenant } || {};
};

export const professionalDetails = async () => {
  let res;
  try {
    res = await axiosInstance.get(`tenant/profession`);
  } catch (err) {
    console.log(err, "professions");
    return [];
  }
  return res.data.professions || [];
};

export const tenantGetDetails = async (id) => {
  let res;
  try {
    res = await axiosInstance.get(`tenant/${id}`);
  } catch (err) {
    return {};
  }
  return { tenant: res?.data.tenant } || {};
};
