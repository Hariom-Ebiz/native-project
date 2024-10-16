import moment from "moment";
import { axiosInstance } from "../../api";

export const getPostJobs = async (page, per_page, fromDate, toDate) => {
  let posts;

  const from = moment().subtract(6, "months").format("YYYY/MM/DD");
  const to = moment().add(1,"day").format("YYYY/MM/DD");
  try {
    posts = await axiosInstance.get(`employer/job-post/all?from=${from}&to=${to}&page=${page}&per_page=${per_page}`);
  } catch (err) {
    console.log("error", err);
    return {
        posts: []
    };
  }

  let posted = []; 
  let saved = []; 

  if (posts?.data?.posts) {
    posted = posts?.data?.posts?.filter((f) => f.is_posted == 1) || [];
    saved = posts?.data?.savedPosts;
  }

  return {
    posted,
    saved,
    totalDocuments: posts?.data?.totalDocuments ?? 0
  }
}

export const getJob = async (id) => {
    let job;
  
    try {
        job = await axiosInstance.get(`employer/job-post/${id}`);
    } catch (err) {
      return {
          job: {}
      };
    }
  
    return {
        job: job.data?.job || {}
    }
  }

export const getCompleteProfile = async (id) => {
  let profile;
  
  try {
      profile = await axiosInstance.get(`job-seeker-cv/employer/get-complete/${id}`);
  } catch (err) {
    return {
      profile: {}
    };
  }

  return {
      profile: profile.data.data || {}
  }
}

export const getSavedProfiles = async () => {
  let profile;
  
  try {
      profile = await axiosInstance.get(`employer/applicant/saved/list`);
  } catch (err) {
    return {
      profiles: []
    };
  }

  return {
      profiles: profile.data.applicants || []
  }
}
