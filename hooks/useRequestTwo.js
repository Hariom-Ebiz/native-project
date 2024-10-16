import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { BASEURL } from "../api";
// import { updateToken } from "../store/auth/action";

const BACKEND_URL = BASEURL;

const useRequestTwo = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const requestData = async (method, url, data) => {
    let config;
    if (token) {
      config = {
        method,
        url: `${BACKEND_URL}/${url}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data,
      };
    } else {
      config = {
        method,
        url: `${BACKEND_URL}/${url}`,
        data,
      };
    }

    try {
      const response = await axios(config);

      return {
        status: true,
        data: response.data,
      };
    } catch (err) {
      return {
        status: false,
        data: [],
      };
    }
  };

  return {
    request: requestData,
  };
};

export default useRequestTwo;
