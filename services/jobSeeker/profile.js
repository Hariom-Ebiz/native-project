import { axiosInstance } from "../../api";

export const getJobSeekerProfile = async () => {
  let res;

  try {
    res = await axiosInstance.get(`user/job-seeker/profile`);
  } catch (err) {
    // console.log(err.response?.data?.message);
    return {};
  }
  return res.data?.data || {};
};

export const graduationCertificate = async () => {
  let res;

  try {
    res = await axiosInstance.get(`master/graduation-certificate-list`);
  } catch (err) {
    // console.log(err.response?.data?.message);
    return {};
  }
  return res.data?.data || {};
};

export const countriesData = async () => {
  let res;

  try {
    res = await axiosInstance.get(`master/countries`);
  } catch (err) {
    // console.log(err.response?.data?.message);
    return [];
  }
  return res?.data?.list?.record || [];
};

export const editCVData = async () => {
  let res;

  try {
    res = await axiosInstance.get(`job-seeker-cv/get-step-1`);
  } catch (err) {
    return {};
  }
  return res?.data?.data || {};
};

export const editCv2Data = async () => {
  let res;

  try {
    res = await axiosInstance.get(`job-seeker-cv/get-step-2`);
  } catch (err) {
    return {};
  }
  return res?.data?.data || {};
};

export const editCv3Data = async () => {
  let res;

  try {
    res = await axiosInstance.get(`job-seeker-cv/get-step-3`);
  } catch (err) {
    return {};
  }
  return res?.data?.data || {};
};
