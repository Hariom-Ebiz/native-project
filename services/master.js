import { axiosInstance } from "@/api";

export const getMasters = async (type) => {
  let res;
  try {
    res = await axiosInstance.get(`master/all?type=${type}`);
  } catch (err) {
    return {
      masters: [],
      totalDocuments: 0,
    };
  }
  return { masters: res.data.records, totalDocuments: res.data.totalRecords };
};

export const getOne = async (id) => {
  let res;

  try {
    res = await axiosInstance.get(`master/${id}`);
  } catch (err) {
    return {};
  }

  return res.data.master;
};

export const jobCategory = async () => {
  let res;

  try {
    res = await axiosInstance.get(`master/job-category-list`);
  } catch (err) {
    return [];
  }

  return res?.data?.list;
};

export const jobIndustry = async () => {
  let res;

  try {
    res = await axiosInstance.get(`master/job-industry-list`);
  } catch (err) {
    return [];
  }

  return res?.data?.list;
};


export const jobTypeList = async () => {
  let res;

  try {
    res = await axiosInstance.get("master/job-type-list");
  } catch (err) {
    return [];
  }

  return res?.data?.list;
};

export const careerLevelList = async () => {
  let res;

  try {
    res = await axiosInstance.get("master/carrier-level-list");
  } catch (err) {
    return [];
  }

  return res?.data?.list;
};

export const employeeNumbers = async () => {
  let res;

  try {
    res = await axiosInstance.get(`master/employee-number-list`);
  } catch (err) {
    return [];
  }

  return res?.data?.list;
};

export const getSkills = async () => {
  let res;

  try {
    res = await axiosInstance.get(`master/skill-list`);
  } catch (err) {
    return [];
  }

  return res?.data?.list;
};


export const getJobSalaryRange = async () => {
  let res;
  try {
    res = await axiosInstance.get("employer/job-post/salary-range-filter");
  } catch (err) {
    return [];
  }

  return res?.data?.list;
}

export const getPsycometricWeigths = async () => {
  let res;
  try {
    res = await axiosInstance.get("master/psycometric-list");
  } catch (err) {
    return [];
  }

  return res?.data?.list;
}