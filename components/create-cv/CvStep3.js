import React, { useEffect, useState } from "react";

import styles from "@/styles/create_cv_steps.module.css";

import {
  NumberInput,
  SelectInput,
  TextAreaInput,
  TextInput,
  ReactSelectInput,
} from "../cv/inputFields";
import Job from "./Job";
import Location from "./Location";
import Link from "next/link";

const CvStep3 = ({
  register,
  errors,
  country,
  handleSubmit,
  onSubmit,
  unregister,
  jobArray,
  jobIndustry,
  jobCategory,
  jobType,
  setJobArray,
  careerLevel,
  jobAddHandler,
  setValue,
  control,
  careerPrefrence,
  getValues,
  mode,
  workExpCities,
}) => {
  // const [ids, setIds] = useState([{ id: 0, oldData: null }]);
  // const [nextId, setNextId] = useState(1);

  const [ids, setIds] = useState(
    careerPrefrence?.locations.map((_, idx) => ({ id: idx, oldData: _ })) ?? [
      { id: 0, oldData: null },
    ]
  );

  const [nextId, setNextId] = useState(careerPrefrence?.locations.length ?? 1);

  const [otherCareerLevelActive, setOtherCareerLevelActive] = useState(false);

  // useEffect(() => {
  //   if (careerPrefrence) {
  //     setIds(
  //       careerPrefrence.locations.map((_, idx) => ({ id: idx, oldData: _ }))
  //     );
  //     setNextId(careerPrefrence.locations.length);
  //   }
  // }, [careerPrefrence]);

  const validateSelection = (values, changedData) => {
    if (["remove-value", "clear", "pop-value"].includes(changedData.action)) {
      return true;
    }

    if (changedData.action === "select-option") {
      return values.length > 3 ? false : true;
    }
  };

  const addWorkHandler = () => {
    setIds((prev) => [...prev, { id: nextId, oldData: null }]);
    setNextId((prev) => prev + 1);
  };

  const deleteWorkHandler = (id) => {
    setIds((prev) => prev.filter((p) => p.id !== id));
    unregister(`location[${id}].country`);
    unregister(`location[${id}].city`);
  };

  const activateOtherCareerLevel = (value) => {
    if (value === "other") {
      setOtherCareerLevelActive(true);
    } else {
      setOtherCareerLevelActive(false);
      unregister(`other_career_level`);
    }
  };

  useEffect(() => {
    if (getValues(`career_level`) === "other") {
      setOtherCareerLevelActive(true);
    }
  }, []);

  return (
    <div className={styles.dash_wrapper}>
      <h2 className={styles.inner_heading}>
        <span className={styles.icon_box}>
          <svg
            width="21"
            height="21"
            viewBox="0 0 21 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.829 19.0365H13.6581C17.0897 19.0365 17.7043 17.6622 17.8835 15.9891L18.5238 9.16001C18.7542 7.07715 18.1567 5.37842 14.5117 5.37842H5.97536C2.33035 5.37842 1.73281 7.07715 1.96329 9.16001L2.60351 15.9891C2.78278 17.6622 3.39739 19.0365 6.829 19.0365Z"
              stroke="white"
              strokeWidth="1.28045"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.8291 5.3784V4.69549C6.8291 3.18456 6.8291 1.96387 9.56073 1.96387H10.9265C13.6582 1.96387 13.6582 3.18456 13.6582 4.69549V5.3784"
              stroke="white"
              strokeWidth="1.28045"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.9507 11.3541V12.2078C11.9507 12.2163 11.9507 12.2163 11.9507 12.2248C11.9507 13.1553 11.9421 13.915 10.2434 13.915C8.55321 13.915 8.53613 13.1638 8.53613 12.2334V11.3541C8.53613 10.5005 8.53613 10.5005 9.38977 10.5005H11.097C11.9507 10.5005 11.9507 10.5005 11.9507 11.3541Z"
              stroke="white"
              strokeWidth="1.28045"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18.481 9.64697C16.5091 11.0811 14.2555 11.9347 11.9507 12.2249"
              stroke="white"
              strokeWidth="1.28045"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2.23682 9.87744C4.15749 11.192 6.32572 11.9859 8.53662 12.2335"
              stroke="white"
              strokeWidth="1.28045"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        Career Insights
      </h2>
      <div className={styles.form_wrapper}>
        <form>
          <div className="row g-4">
            {jobArray &&
              jobArray.length > 0 &&
              jobArray.map((uuid, index) => (
                <Job
                  key={uuid}
                  index={index}
                  register={register}
                  errors={errors}
                  unregister={unregister}
                  uuid={uuid}
                  jobIndustry={jobIndustry}
                  jobCategory={jobCategory}
                  jobType={jobType}
                  setJobArray={setJobArray}
                  setValue={setValue}
                  getValues={getValues}
                  country={country}
                  cityList={workExpCities[uuid] ?? []}
                />
              ))}

            <div className="col-sm-12 col-md-12">
              <div className={styles.add_more}>
                <a href="javascript:void(0);" onClick={() => jobAddHandler()}>
                  Add One More Job
                </a>
              </div>
            </div>

            <div className="col-sm-12 col-md-12">
              <div className={styles.location_heading}>
                <span className={styles.icon_box}>
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 21 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.829 19.0365H13.6581C17.0897 19.0365 17.7043 17.6622 17.8835 15.9891L18.5238 9.16001C18.7542 7.07715 18.1567 5.37842 14.5117 5.37842H5.97536C2.33035 5.37842 1.73281 7.07715 1.96329 9.16001L2.60351 15.9891C2.78278 17.6622 3.39739 19.0365 6.829 19.0365Z"
                      stroke="white"
                      strokeWidth="1.28045"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.8291 5.3784V4.69549C6.8291 3.18456 6.8291 1.96387 9.56073 1.96387H10.9265C13.6582 1.96387 13.6582 3.18456 13.6582 4.69549V5.3784"
                      stroke="white"
                      strokeWidth="1.28045"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.9507 11.3541V12.2078C11.9507 12.2163 11.9507 12.2163 11.9507 12.2248C11.9507 13.1553 11.9421 13.915 10.2434 13.915C8.55321 13.915 8.53613 13.1638 8.53613 12.2334V11.3541C8.53613 10.5005 8.53613 10.5005 9.38977 10.5005H11.097C11.9507 10.5005 11.9507 10.5005 11.9507 11.3541Z"
                      stroke="white"
                      strokeWidth="1.28045"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18.481 9.64697C16.5091 11.0811 14.2555 11.9347 11.9507 12.2249"
                      stroke="white"
                      strokeWidth="1.28045"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2.23682 9.87744C4.15749 11.192 6.32572 11.9859 8.53662 12.2335"
                      stroke="white"
                      strokeWidth="1.28045"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <h4>Career Info & Preference</h4>
              </div>
            </div>
            <SelectInput
              label="What is your current career level?"
              name="career_level"
              registerFields={{
                required: {
                  value: true,
                  message: "This field is required.",
                },
              }}
              options={
                <>
                  <option value="">Select</option>
                  {careerLevel?.map((val) => {
                    return (
                      <option value={val.id} key={val.id}>
                        {val.name}
                      </option>
                    );
                  })}
                </>
              }
              register={register}
              errors={errors}
              onChangeFunc={(e)=>{
                activateOtherCareerLevel(e.target.value);
              }}
            />
            {otherCareerLevelActive && (
              <TextInput
                label="Please Specify Other"
                // placeholder="e.g. phd level"
                name={`other_career_level`}
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
            <ReactSelectInput
              label="What type of jobs are you open to (you can select more than one option)"
              name="job_type"
              registerFields={{
                required: {
                  value: true,
                  message: "This field is required.",
                },
              }}
              options={jobType.map((val) => ({
                label: val.name,
                value: val.id,
              }))}
              register={register}
              errors={errors}
              control={control}
              isMultiple={true}
            />

            <ReactSelectInput
              label="What job categories/functions are you interested in? (you can add up to 3)"
              name="job_category"
              registerFields={{
                required: {
                  value: true,
                  message: "This field is required.",
                },
              }}
              options={jobCategory.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
              register={register}
              errors={errors}
              control={control}
              isMultiple={true}
              validateSelection={(values, changedData) =>
                validateSelection(values, changedData)
              }
            />

            <div className="col-sm-12 col-md-12">
              <div className="input_block">
                <label className={styles.form_label}>
                  Where would you like to work?
                </label>
                {ids.length < 3 && (
                  <button
                    type="button"
                    onClick={addWorkHandler}
                    className={`btn btn-primary ${styles.dash_theem_btn}`}
                    style={{ marginLeft: "10px" }}
                  >
                    ADD
                  </button>
                )}
                
                {ids.map((obj) => (
                  <Location
                    key={obj.id}
                    deleteWorkHandler={deleteWorkHandler}
                    country={country}
                    id={obj.id}
                    register={register}
                    errors={errors}
                    ids={ids}
                    oldData={obj.oldData}
                    setValue={setValue}
                  />
                ))}
              </div>
            </div>

            <TextInput
              label="What is the minimum salary you would accept (EGP/month)?"
              placeholder="1000 EGP/month"
              name="min_expected_salary"
              registerFields={{
                required: {
                  value: true,
                  message: "This field is required.",
                },
                validate: {
                  matchPattern: value => /^[0-9]+$/.test(value) || "Only numbers are allowed."
                }
              }}
              register={register}
              errors={errors}
            />
            <div className="col-sm-12 col-md-12">
              <div className={`${styles.nav_switch_box} ${styles.switch_btn}`}>
                <div
                  className={`${styles.form_check} ${styles.form_switch} form-check form-switch`}
                >
                  <label
                    className={`${styles.form_check_label} form-check-label`}
                    htmlFor="flexSwitchCheckChecked"
                  >
                    Make Profile Public
                  </label>
                  <input
                    className={`${styles.form_check_input} form-check-input`}
                    type="checkbox"
                    id="flexSwitchCheckChecked"
                    name="make_profile_public"
                    value="1"
                    {...register("make_profile_public", {
                      required: {
                        value: false,
                        message: "This field is required.",
                      },
                    })}
                  />
                  {errors?.["make_profile_public"] && (
                    <div className="invalid-feedback d-block">
                      {errors?.["make_profile_public"].message}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-md-12">
              <div className={styles.next_pre_btn}>
                <Link href={`/job-seeker/${mode}-cv/step2`}>
                  <button
                    type="button"
                    className={`btn btn-primary ${styles.dash_theem_btn}`}
                    // onClick={() => router.back()}
                  >
                    Prev
                  </button>
                </Link>
                <button
                  type="button"
                  className={`btn btn-primary ${styles.dash_theem_btn}`}
                  onClick={handleSubmit(onSubmit)}
                >
                  Next Step
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CvStep3;
