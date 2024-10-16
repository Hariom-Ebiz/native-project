import React, { useEffect, useState } from "react";
import styles from "@/styles/create_cv_steps.module.css";
import moment from "moment";
import { SelectInput, TextAreaInput, TextInput } from "../cv/inputFields";
import useRequest from "@/hooks/useRequest";

const Job = ({
  register,
  errors,
  unregister,
  uuid,
  index,
  jobIndustry,
  jobCategory,
  jobType,
  setJobArray,
  setValue,
  getValues,
  country,
  cityList,
}) => {
  const [disableField, setDisableField] = useState(false);
  const [cities, setCities] = useState(cityList);

  const [otherIndustryActive, setOtherIndustryActive] = useState(false);
  const [otherJobCategoryActive, setOtherJobCategoryActive] = useState(false);
  const [otherJobTypeActive, setOtherJobTypeActive] = useState(false);

  const { request: requestCity, response: responseCity } = useRequest();

  const months = ["1","2","3","4","5","6","7","8","9","10","11","12"];
  const [years, setYears] = useState([]);

  const deleteHandler = (uuid) => {
    setJobArray((prev) => {
      return prev.filter((elem) => elem !== uuid);
    });
    unregister(`job_type_${uuid}`);
    unregister(`job_title_${uuid}`);
    unregister(`job_category_${uuid}`);
    unregister(`industry_${uuid}`);
    unregister(`company_name_${uuid}`);
    unregister(`job_country_${uuid}`);
    unregister(`job_city_${uuid}`);
    unregister(`start_date_${uuid}`);
    unregister(`end_date_${uuid}`);
    unregister(`start_month_${uuid}`);
    unregister(`start_year_${uuid}`);
    unregister(`end_month_${uuid}`);
    unregister(`end_year_${uuid}`);
    unregister(`is_currently_working_${uuid}`);
    unregister(`responsibilities_${uuid}`);
    unregister(`achievements_${uuid}`);
  };

  const handleCurrentlyWorkHere = (e) => {
    setValue(`end_date_${uuid}`, null);
    setDisableField(!!e.target.checked);
  };

  const activateOtherIndustry = (value) => {
    if (value === "other") {
      setOtherIndustryActive(true);
    } else {
      setOtherIndustryActive(false);
      unregister(`other_industry_${uuid}`);
    }
  };
  const activateOtherJobCategory = (value) => {
    if (value === "other") {
      setOtherJobCategoryActive(true);
    } else {
      setOtherJobCategoryActive(false);
      unregister(`other_job_category_${uuid}`);
    }
  };
  const activateOtherJobType = (value) => {
    if (value === "other") {
      setOtherJobTypeActive(true);
    } else {
      setOtherJobTypeActive(false);
      unregister(`other_job_type_${uuid}`);
    }
  };

  useEffect(() => {
    if (getValues(`industry_${uuid}`) === "other") {
      setOtherIndustryActive(true);
    }
    if (getValues(`job_category_${uuid}`) === "other") {
      setOtherJobCategoryActive(true);
    }
    if (getValues(`job_type_${uuid}`) === "other") {
      setOtherJobTypeActive(true);
    }
    if (getValues(`is_currently_working_${uuid}`) == "1") {
      setDisableField(true);
    }


    //create years
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = 1970; i <= currentYear; i++) {
      years.push(i);
    }
    setYears(years)


    if (getValues(`job_country_${uuid}`)) {
      // countrySelectedHandler(getValues(`job_country_${uuid}`));
      // setTimeout(() => {
      //   setValue(`job_city_${uuid}`, getValues(`job_city_${uuid}`));
      // }, 1000);
    }
  }, []);

  const countrySelectedHandler = (data) => {
    if (data) {
      requestCity("GET", `master/cities?country=${data}`);
    }
  };

  useEffect(() => {
    if (responseCity && responseCity.status) {
      setCities(responseCity?.list);
    }
  }, [responseCity]);

  return (
    <>
      <div
        className="col-sm-12 col-md-12"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div className={styles.location_heading}>
          {index > 0 && <h4>More Experience </h4>}
        </div>
        {index > 0 && (
          <div>
            <a
              href="javascript:void(0);"
              className="btn btn-primary"
              onClick={() => deleteHandler(uuid)}
            >
              <i className="fas fa-minus"></i> Remove
            </a>
          </div>
        )}
      </div>
      <SelectInput
        label="Job Type"
        name={`job_type_${uuid}`}
        registerFields={{
          required: {
            value: true,
            message: "This field is required.",
          },
        }}
        options={
          <>
            <option value="">Select</option>
            {jobType?.map((val) => {
              return (
                <option value={val.id} key={val.id}>
                  {val.name}
                </option>
              );
            })}
            <option value="other">Others</option>
          </>
        }
        register={register}
        errors={errors}
        otherFields={{
          onChange: (e) => {
            activateOtherJobType(e.target.value);
          },
        }}
      />
      {otherJobTypeActive && (
        <TextInput
          label="Please Specify Other"
          placeholder="" 
          name={`other_job_type_${uuid}`}
          registerFields={{
            required: {
              value: true,
              message: "This field is required.",
            },
          }}
          register={register}
          errors={errors}
        />
      )}
      <TextInput
        label="Job Title/Role"
        placeholder="Sales"
        name={`job_title_${uuid}`}
        registerFields={{
          required: {
            value: true,
            message: "This field is required.",
          },
        }}
        register={register}
        errors={errors}
      />
      <SelectInput
        label="Job Category"
        name={`job_category_${uuid}`}
        registerFields={{
          required: {
            value: true,
            message: "This field is required.",
          },
        }}
        options={
          <>
            <option value="">Select</option>
            {jobCategory?.map((val) => {
              return (
                <option value={val.id} key={val.id}>
                  {val.name}
                </option>
              );
            })}
            <option value="other">Others</option>
          </>
        }
        register={register}
        errors={errors}
        otherFields={{
          onChange: (e) => {
            activateOtherJobCategory(e.target.value);
          },
        }}
      />
      {otherJobCategoryActive && (
        <TextInput
          label="Please Specify Other"
          placeholder=""
          name={`other_job_category_${uuid}`}
          registerFields={{
            required: {
              value: true,
              message: "This field is required.",
            },
          }}
          register={register}
          errors={errors}
        />
      )}
      <SelectInput
        label="Industry"
        name={`industry_${uuid}`}
        registerFields={{
          required: {
            value: true,
            message: "This field is required.",
          },
        }}
        options={
          <>
            <option value="">Select</option>
            {jobIndustry?.map((val) => {
              return (
                <option value={val.id} key={val.id}>
                  {val.name}
                </option>
              );
            })}
            <option value="other">Others</option>
          </>
        }
        register={register}
        errors={errors}
        otherFields={{
          onChange: (e) => {
            activateOtherIndustry(e.target.value);
          },
        }}
      />
      {otherIndustryActive && (
        <TextInput
          label="Please Specify Other"
          placeholder=""
          name={`other_industry_${uuid}`}
          registerFields={{
            required: {
              value: true,
              message: "This field is required.",
            },
          }}
          register={register}
          errors={errors}
        />
      )}
      <TextInput
        label="Company Name"
        placeholder="e.g., Google"
        name={`company_name_${uuid}`}
        registerFields={{
          required: {
            value: true,
            message: "This field is required.",
          },
        }}
        register={register}
        errors={errors}
      />

      <SelectInput
        label="Country"
        name={`job_country_${uuid}`}
        register={register}
        errors={errors}
        registerFields={{
          required: {
            value: true,
            message: "This field is required.",
          },
        }}
        options={
          <>
            <option value="">Select</option>
            {country?.map((val) => {
              return (
                <option value={val.id} key={val.id}>
                  {val.name}
                </option>
              );
            })}
          </>
        }
        otherFields={{
          onChange: (e) => countrySelectedHandler(e.target.value),
        }}
        colClass="col-sm-12 col-md-6"
      />

      <SelectInput
        label="City"
        name={`job_city_${uuid}`}
        register={register}
        errors={errors}
        registerFields={{
          required: {
            value: true,
            message: "This field is required.",
          },
        }}
        options={
          <>
            <option value="">Select</option>
            {cities?.map((val) => {
              return (
                <option value={val.id} key={val.id}>
                  {val.name}
                </option>
              );
            })}
          </>
        }
        colClass="col-sm-12 col-md-6"
      />

      {/* <div className="col-sm-12 col-md-12">
        <div className="input_block">
          <label className={styles.form_label}> Start</label>
          <input
            type="date"
            className={`${styles.form_control} ${styles.date_fix} form-control`}
            placeholder="start"
            name={`start_date_${uuid}`}
            {...register(`start_date_${uuid}`, {
              required: {
                value: true,
                message: "This field is required.",
              },
            })}
          />
          {errors?.[`start_date_${uuid}`] && (
            <div className="invalid-feedback d-block">
              {errors?.[`start_date_${uuid}`].message}
            </div>
          )}
        </div>
      </div> */}
      <div className="row mt-4 col-sm-12 col-md-12">
        <div className="col-sm-6 col-md-3">
          <div className="input_block">
            <label className={styles.form_label}> Start Month</label>
            <select
              className={`${styles.form_control} ${styles.date_fix} form-control`}
              id={`start_month_${uuid}`}
              placeholder="start"
              name={`start_month_${uuid}`}
               {...register(`start_month_${uuid}`, {
                required: {
                  value: false,
                  message: "This field is required.",
                },
              })}
            >
              <option>Select Month</option>
              {
                months.map((m) => (
                  <option value={m}>{m}</option> 
                ))
              }
            </select>
            {errors?.[`start_month_${uuid}`] && (
              <div className="invalid-feedback d-block">
                {errors?.[`start_month_${uuid}`].message}
              </div>
            )}
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <div className="input_block">
            <label className={styles.form_label}> Start Year</label>
            <select
              className={`${styles.form_control} ${styles.date_fix} form-control`}
              id={`start_year_${uuid}`}
              placeholder="Start Year"
              name={`start_year_${uuid}`}
              {...register(`start_year_${uuid}`, {
                required: {
                  value: false,
                  message: "This field is required.",
                },
              })}
            >
              <option value={0}>Select Year</option>
              {
                years.map((y) => (
                  <option value={y} selected={getValues(`start_year_${uuid}`) == y}>{y}</option>
                ))
              }
            </select>
            {errors?.[`start_year_${uuid}`] && (
              <div className="invalid-feedback d-block">
                {errors?.[`start_year_${uuid}`].message}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="row mt-4 col-sm-12 col-md-12">
        <div className="col-sm-6 col-md-3">
          <div className="input_block">
            <label className={styles.form_label}> End Month</label>
            <select
              className={`${styles.form_control} ${styles.date_fix} form-control`}
              id={`end_month_${uuid}`}
              placeholder="start"
              name={`end_month_${uuid}`}
              // onChange={() => register(`end_month_${uuid}`, {
              //   required: {
              //     value: false,
              //     message: "This field is required.",
              //   },
              // })}
               {...register(`end_month_${uuid}`, {
                required: {
                  value: false,
                  message: "This field is required.",
                },
              })}
              disabled={disableField}
            >
              <option value={0}>Select Month</option>
              {
                months.map((m) => (
                  <option value={m}>{m}</option> 
                ))
              }
            </select>
            {errors?.[`end_month_${uuid}`] && (
              <div className="invalid-feedback d-block">
                {errors?.[`end_month_${uuid}`].message}
              </div>
            )}
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <div className="input_block">
            <label className={styles.form_label}> End Year</label>
            <select
              className={`${styles.form_control} ${styles.date_fix} form-control`}
              id={`end_year_${uuid}`}
              placeholder="End Year"
              name={`end_year_${uuid}`}
              {...register(`end_year_${uuid}`, {
                required: {
                  value: false,
                  message: "This field is required.",
                },
              })}
              disabled={disableField}
            >
              <option value={0}>Select Year</option>
              {
                years.map((y) => (
                  <option value={y} selected={getValues(`end_year_${uuid}`) == y}>{y}</option>
                ))
              }
            </select>
            {errors?.[`end_date_${uuid}`] && (
              <div className="invalid-feedback d-block">
                {errors?.[`end_date_${uuid}`].message}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="col-sm-12 col-md-12">
        <div className="input_block">
          {/* <label className={styles.form_label}>
            You want to relocate to another country
          </label> */}
          <div className={styles.radio_block}>
            <div className={`${styles.form_check} form-check`}>
              <input
                // className=""
                className={`${styles.form_check_input} form_check_input`}
                type="checkbox"
                id="country1"
                {...register(`is_currently_working_${uuid}`, {
                  required: {
                    value: false,
                    message: "This field is required.",
                  },
                })}
                onChange={handleCurrentlyWorkHere}
              />
              <label className={styles.form_check_label} htmlFor="country1">
                I currently work there
              </label>
              {errors?.[`is_currently_working_${uuid}`] && (
                <div className="invalid-feedback d-block">
                  {errors?.[`is_currently_working_${uuid}`].message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <TextAreaInput
        label="Responsibilities"
        placeholder="Please enter your responsibilities"
        name={`responsibilities_${uuid}`}
        register={register}
        errors={errors}
        registerFields={{
          required: {
            value: true,
            message: "This field is required.",
          },
        }}
        otherFields={{
          rows: "10",
        }}
      />
      <TextAreaInput
        label="Achievements"
        placeholder="Please enter your achievements"
        name={`achievements_${uuid}`}
        register={register}
        errors={errors}
        registerFields={{
          required: {
            value: true,
            message: "This field is required.",
          },
        }}
        otherFields={{
          rows: "10",
        }}
      />
    </>
  );
};

export default Job;
