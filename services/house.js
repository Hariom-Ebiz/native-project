import { axiosInstance } from "@/api";

export const getHouseAmenities = async () => {
  let res;
  try {
    res = await axiosInstance.get(`master/house-amenities`);
  } catch (err) {
    return [];
  }
  return res.data.amenities || [];
};

export const getAllHouse = async () => {
  let res;
  try {
    res = await axiosInstance.get(`house/all`);
  } catch (err) {
    return {};
  }
  return (
    {
      totalDocumentsLength: res.data.totalDocuments,
      housesArray: res.data.houses,
    } || {}
  );
};

export const getOne = async (id) => {
  let res;
  try {
    res = await axiosInstance.get(`house/${id}`);
  } catch (err) {
    return {};
  }
  return res.data.house;
};

export const getUnitAmenities = async () => {
  let res;
  try {
    res = await axiosInstance.get(`master/unit-amenities`);
  } catch (err) {
    return [];
  }
  return res.data.amenities || [];
};

export const getAllNotes = async (id) => {
  let res;
  try {
    res = await axiosInstance.get(
      `property-house-notes/all?page=1&per_page=10&property_house_id=${id}`
    );
  } catch (err) {
    return {};
  }
  return res.data || {};
};
