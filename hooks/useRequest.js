import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { logout } from "@/store/authSlice";
import { updateLoading, setModal } from "@/store/siteSlice";
import { BASEURL } from "../api";

const useRequest = (notShowLoading) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const { token } = useSelector((state) => state.auth);

  const t = (a) => a;

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!notShowLoading) {
      dispatch(updateLoading(loading));
    }
  }, [loading]);

  const startFetching = () => {
    setResponse(null);
    setLoading(true);
    setError(null);
  };

  const clear = () => {
    setResponse(null);
    setError(null);
  };

  const fetchedData = () => {
    setLoading(false);
    dispatch(updateLoading(false));
    setError(null);
  };

  const requestData = (method, url, data) => {
    let config;

    if (token) {
      config = {
        method,
        url: `${BASEURL}/${url}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data,
      };
    } else {
      config = {
        method,
        url: `${BASEURL}/${url}`,
        data,
      };
    }

    startFetching();

    axios(config)
      .then((res) => {
        fetchedData();
        setResponse(res.data);
      })
      .catch((err) => {
        fetchedData();
        if (err.response) {
          if (err.response.status === 401) {
            dispatch(logout());
          } else if (err.response.status === 404) {
            // router.push("/404");
          } else {
            dispatch(updateLoading(false));
            // toast.error(err.response.data.message);
            dispatch(
              setModal(
                <div className="modal_inner">
                  <div className="icon_block">
                    <img src="/img/error.png" alt="" />
                  </div>
                  <h3>{err.response.data.message}</h3>
                </div>
              )
            );
          }
        } else if (err.request) {
          // toast.error(t("Slow Network Speed. Try Again later."));
          dispatch(
            setModal(
              <div className="modal_inner">
                <div className="icon_block">
                  <img src="/img/error.png" alt="" />
                </div>
                <h3>Oops!! Unusual error occurred</h3>
              </div>
            )
          );
        } else {
          console.log(err);
          // toast.error(t("Oops!! Unusual error occurred"));
          dispatch(
            setModal(
              <div className="modal_inner">
                <div className="icon_block">
                  <img src="/img/error.png" alt="" />
                </div>
                <h3>Oops!! Unusual error occurred</h3>
              </div>
            )
          );
        }
      });
  };

  return {
    loading,
    error,
    request: requestData,
    clear,
    response,
    setError,
  };
};

export default useRequest;
