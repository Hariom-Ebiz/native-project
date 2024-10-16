import moment from "moment";
import { axiosInstance } from "../../api";

export const getPostJobs = async (page, per_page, fromDate, toDate) => {
  let posts;

  const from = moment().startOf('month').format("YYYY/MM/DD");
  const to = moment().endOf('month').format("YYYY/MM/DD");
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
    saved = posts?.data?.posts?.filter((f) => f.is_posted == 0) || [];
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
