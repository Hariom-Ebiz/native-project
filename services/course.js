import { axiosInstance } from "../api";

export const getCourses = async () => {
  let res;

  try {
    // res = await axiosInstance.get("course/client");
    res = await axiosInstance.get("course-category/courses");
    // console.log("res ", res);
    
  } catch (err) {
    return {
      categories: [],
      progress: {},
      thirdCompleted: false
    };
  }

  return {
    categories: res.data.categories,
    progress: res.data.progress,
    thirdCompleted: res.data.thirdCompleted
  };
};

export const getLessons = async (id) => {
  let res;

  try {
    res = await axiosInstance.get(`lesson/all/${id}`);
  } catch (err) {
    return {
      lessons: [],
      course: {},
      progress: {}
    };
  }
  return res.data;
};

export const getLessonData = async (id) => {
  let res;

  try {
    res = await axiosInstance.get(`lesson/${id}`);
    
  } catch (err) {
    return {};
  }
  return res.data.lesson || {};
};
