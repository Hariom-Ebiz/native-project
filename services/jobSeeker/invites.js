import { axiosInstance } from "@/api";


export const jobCategory = async () => {
  let res;

  try {
    res = await axiosInstance.get(`employer/invite/candidate/job-invites`);
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
    res = await axiosInstance.get("employer/invite/candidate/job-types");
  } catch (err) {
    return [];
  }

  return res?.data?.list;
};

export const getJobSalaryRange = async () => {
  let res;
  try {
    res = await axiosInstance.get("employer/invite/candidate/salary-range");
  } catch (err) {
    return [];
  }

  return res?.data?.list;
}


export const careerLevelList = async () => {
  let res;

  try {
    res = await axiosInstance.get(`employer/invite/candidate/job-levels`);
  } catch (err) {
    return [];
  }

  return res?.data?.list;
};


export const getJobSeekerJobList = async (id) => {
  let job;

  try {
      job = await axiosInstance.get(`employer/invite/candidate/invites`);
  } catch (err) {
    console.log("error", err);
    return {
        job: []
    };
  }

  return {
      job: job.data?.list || []
  }
}