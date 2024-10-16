import React, { useEffect, useState } from "react";

import useRequest from "@/hooks/useRequest";
import styles from "@/styles/create_cv_steps.module.css";

const Location = ({
  id,
  country,
  deleteWorkHandler,
  register,
  errors,
  ids,
  oldData,
  setValue,
}) => {
  const [cities, setCities] = useState(oldData?.cityList ?? []);

  const { request: requestCity, response: responseCity } = useRequest();

  useEffect(() => {
    if (responseCity && responseCity.status) {
      setCities(responseCity?.list);
    }
  }, [responseCity]);

  useEffect(() => {
    if (oldData) {
      // countrySelectedHandler(oldData.country);

      setValue(`location[${id}].city`, oldData.city);
      // setTimeout(() => {
      // }, 1000);
    }
  }, [oldData]);

  const countrySelectedHandler = (data) => {
    if (data) {
      requestCity("GET", `master/cities?country=${data}`);
    }
  };

  return (
    <div
      key={id}
      className={styles.like_to_work_input}
      style={{ marginTop: "5px", marginBottom: "5px" }}
    >
      <select
        className={`${styles.form_select} ${styles.form_control} form-select form-control`}
        aria-label="Default select example"
        // name="country"
        {...register(`location[${id}].country`, {
          required: {
            value: true,
            message: "This field is required.",
          },
        })}
        onChange={(e) => countrySelectedHandler(e.target.value)}
      >
        <option value="">Select Country</option>
        {country?.map((val) => {
          return (
            <option value={val.id} key={val.id}>
              {val.name}
            </option>
          );
        })}
      </select>
      {errors?.["location"]?.[id]?.country && (
        <div className="invalid-feedback d-block">
          {errors["location"][id].country.message}
        </div>
      )}
      <select
        className={`${styles.form_select} ${styles.form_control} form-select form-control`}
        aria-label="Default select example"
        // name="city"
        {...register(`location[${id}].city`, {
          required: {
            value: true,
            message: "This field is required.",
          },
        })}
      >
        <option value="">Select City</option>
        {cities?.length > 0 && <option value={0}>All</option>}
        {cities?.map((val) => {
          return (
            <option value={val.id} key={val.id}>
              {val.name}
            </option>
          );
        })}
      </select>

      {errors?.["location"]?.[id]?.city && (
        <div className="invalid-feedback d-block">
          {errors["location"][id].city.message}
        </div>
      )}
      {ids.length > 1 && (
        <button
          type="button"
          onClick={() => deleteWorkHandler(id)}
          className={`btn btn-primary ${styles.dash_theem_btn}`}
        >
          DELETE
        </button>
      )}
    </div>
  );
};

export default Location;
