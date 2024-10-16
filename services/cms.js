import { axiosInstance } from "../api";

export const getHomePageData = async (lang) => {
  let res , res1
  let langId = "";
  if (lang) {
    langId = JSON.parse(lang).id
  }

  try {
    res = await axiosInstance.get(`block/get-block/home-page?lang=${langId}`);
    res1 = await axiosInstance.get(`master/testimonials?lang=${langId}`);
  } catch (err) {
    console.log("error");
    return {
      homePageBlocks: {},
      testimonials: {},
    };
  }
  return {
    homePageBlocks: res?.data?.blocks || {},
    testimonials: res1?.data?.list || {},
  };
};

export const getEmployerPageData = async (lang) => {
  let langId = "";
  if (lang) {
    langId = JSON.parse(lang).id
  }
  let res, res1
  try {
    res = await axiosInstance.get(`block/get-block/employer-page?lang=${langId}`);
    res1 = await axiosInstance.get(`master/employer/testimonials?lang=${langId}`);
  } catch (err) {
    return {
      employerPageBlocks: {},
      testimonials: [],
    };
  }
  return {
    employerPageBlocks: res?.data?.blocks || {},
    testimonials: res1?.data?.list || [],
  };
};

export const getContactUsData = async (slug) => {
  let res;
  try {
    res = await axiosInstance.get("block/get-block/contactus-page");
  } catch (err) {
    return {
      contactPageBlocks: {},
    };
  }
  return {
    contactPageBlocks: res?.data?.blocks || {},
  };
};

export const getAboutUsPageData = async (slug) => {
  let res;
  try {
    res = await axiosInstance.get("cms/slug/about-us");
  } catch (err) {
    return {
      aboutUsPageBlocks: {},
    };
  }
  return {
    aboutUsPageBlocks: res?.data?.cms || {},
  };
};

export const getTermAndConditionsPageData = async (slug) => {
  let res;
  try {
    res = await axiosInstance.get("cms/slug/terms-and-conditions");
  } catch (err) {
    console.log("something went wrong");
    return {
      termAndConditionsPageBlocks: {},
    };
  }
  //console.log("response>>>>", res);
  return {
    termAndConditionsPageBlocks: res?.data?.cms || {},
  };
};

export const getPrivacyPolicyPageData = async (slug) => {
  let res;
  try {
    res = await axiosInstance.get("cms/slug/privacy-policy");
  } catch (err) {
    console.log("something went wrong");
    return {
      privacyPolicyPageBlocks: {},
    };
  }
  //  console.log("response>>>>", res);
  return {
    privacyPolicyPageBlocks: res?.data?.cms || {},
  };
};


