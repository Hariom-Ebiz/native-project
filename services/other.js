import { axiosInstance } from "../api";

export const getCoreValues = async (slug) => {
  let res;
  try {
    res = await axiosInstance.get("core-value/all");
  } catch (err) {
    return [];
  }
  return res.data.values ?? [];
};

export const getCoreValueTitles = async (slug) => {
  let res;
  try {
    res = await axiosInstance.get("core-value-title/all");
  } catch (err) {
    return [];
  }
  return res.data.titles ?? [];
};

export const getCoreInterest = async (slug) => {
  let res;
  try {
    res = await axiosInstance.get("career-interest/all");
  } catch (err) {
    return [];
  }
  return res.data.statements ?? [];
};

export const getCoreInterestCategories = async (slug) => {
  let res;
  try {
    res = await axiosInstance.get("career-interest-category/all");
  } catch (err) {
    return [];
  }
  return res.data.categories ?? [];
};

export const getMotivatedSkills = async (slug) => {
  let res;
  try {
    res = await axiosInstance.get("motivated-skill/all");
  } catch (err) {
    return [];
  }
  return res.data.skills ?? [];
};

export const getPersonalitySkills = async (slug) => {
  let res;
  try {
    res = await axiosInstance.get("personality-type/all");
  } catch (err) {
    return [];
  }
  return res.data.types ?? [];
};

export const getPersonalitySummary = async (slug) => {
  let res;
  try {
    res = await axiosInstance.get("personality-summary/all");
  } catch (err) {
    return [];
  }
  return res.data?.data?.record ?? [];
};

export const getAssessmentResult = async () => {
  let res;
  try {
    res = await axiosInstance.get("user/job-seeker/assessment");    
  } catch (err) {
    return {
      carrerValues: [],
      careerInterests: [],
      personalityType: null,
      motivatedSkills: [],
      lifePurpose: null,
    };
  }

  return res.data.results;
};

export const getCities = async () => {
  let res;
  try {
    res = await axiosInstance.get("master/cities");
  } catch (err) {
    return {
      cities: []
    };
  }

  return res.data.list;
};

export const getCityCountry = async (key) => {
  let res;
  try {
    res = await axiosInstance.get("master/cities-country?key="+key);
  } catch (err) {
    return {
      cities: []
    };
  }

  return res.data.list;
}
