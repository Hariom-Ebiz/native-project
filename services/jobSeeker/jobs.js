import { axiosInstance } from "../../api";

export const getJobDescription = async (id) => {
    let job;
  
    try {
        job = await axiosInstance.get(`job-seeker/job/get/description/${id}`);
        console.log("job", job);
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