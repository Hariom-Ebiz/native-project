import { axiosInstance } from "../api";

export const getCourses = async (packageId) => {
  let res;

  try {
    // res = await axiosInstance.get("course/client");
    res = await axiosInstance.get(`functional-mastery/category/courses/${packageId}`);
    console.log("res : ", res);
    
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
    thirdCompleted: res.data.thirdCompleted,
    course_package_details: res.data.course_package_details
  };
};

export const getLessons = async (id) => {
  let res;

  try {
    res = await axiosInstance.get(`functional-mastery/lesson/all/${id}`);
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
    console.log("here : ");
    res = await axiosInstance.get(`functional-mastery/lesson/${id}`);
    console.log("res" ,res);
    
  } catch (err) {
    return {};
  }
  return res.data.lesson || {};
};

export const getCoursePackages = async () => {
  let res;

  try {
    // res = await axiosInstance.get("course/client");
    res = await axiosInstance.get("functional-mastery/all-courses-front");
    
  } catch (err) {
    return {
      courses: []
    };
  }

  return {
    courses: res?.data?.list,
  };
};