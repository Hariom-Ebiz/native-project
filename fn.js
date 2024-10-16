import nookies from "nookies";
import { axiosInstance } from "./api";

export const createAxiosCookies = (context) => {
  const cookies = nookies.get(context);
  axiosInstance.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${cookies.token} `;
};

export const getCookies = (context) => {
  const cookies = nookies.get(context);
  return cookies;
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
