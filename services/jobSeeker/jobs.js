import { axiosInstance } from "../../api";

export const getJobDescription = async (id) => {
    let job;
  
    try {
        job = await axiosInstance.get(`job-seeker/job/get/description/${id}`);
    } catch (err) {
      console.log("error", err);
      return {
          job: {}
      };
    }
  
    return {
        job: job.data?.data || {}
    }
  }


  export const getJobSeekerJobList = async (id) => {
    let job;
  
    try {
        job = await axiosInstance.get(`employer/job-post/get/job-seeker/jobs`);
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

export const getAllAppliedJobs = async (PER_PAGE) =>{
  let alljobs = [];
  let appliedjobs = [];
  let savedjobs = [];
  try {
    alljobs = await axiosInstance.get(`employer/job-post/get/job-seeker/applied-jobs?page=1&per_page=${PER_PAGE}`);
    appliedjobs = await axiosInstance.get(`employer/job-post/get/job-seeker/applied-jobs?page=1&per_page=${PER_PAGE}&isApplied=1`);
    savedjobs = await axiosInstance.get(`employer/job-post/get/job-seeker/applied-jobs?page=1&per_page=${PER_PAGE}&isApplied=0`);
  } catch (error) {
    console.log("error", error);
    return {
      jobs: []
    };
  }

  return {
    allJobs: alljobs?.data?.list,
    appliedJobs: appliedjobs?.data?.list,
    savedJobs: savedjobs?.data?.list,
    totalAllJobs: alljobs.data.totalDocuments,
    totalAppliedJobs: appliedjobs.data.totalDocuments,
    totalSavedJobs: savedjobs.data.totalDocuments
  }
}