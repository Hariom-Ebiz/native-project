import React, { useEffect, useState } from "react";
import styles from "@/styles/create_cv_steps.module.css";
import { YearNumberInput, SelectInput, TextInput } from "../cv/inputFields";
import moment from "moment";

const PostGraduation = ({
  register,
  errors,
  unregister,
  country,
  uuid,
  index,
  grade,
  postDegreeLevel,
  studyField,
  setPostGraduationArray,
  getValues,
}) => {
  const [otherDegreeLevelActive, setOtherDegreeLevelActive] = useState(false);
  const [otherStydyFieldActive, setOtherStudyFieldActive] = useState(false);
  const [otherGradeActive, setOtherGradeActive] = useState(false);

  const deleteHandler = (uuid) => {
    setPostGraduationArray((prev) => {
      return prev.filter((elem) => elem !== uuid);
    });
    unregister(`post_university_name_${uuid}`);
    unregister(`post_country_${uuid}`);
    unregister(`post_grade_${uuid}`);
    unregister(`post_degree_level_${uuid}`);
    unregister(`post_start_year_${uuid}`);
    unregister(`post_end_year_${uuid}`);
    unregister(`post_study_field_${uuid}`);
  };

  const activateOtherDegreeLevel = (value) => {
    if (value === "other") {
      setOtherDegreeLevelActive(true);
    } else {
      setOtherDegreeLevelActive(false);
      unregister(`post_other_degree_level_${uuid}`);
    }
  };
  const activateOtherStudyField = (value) => {
    if (value === "other") {
      setOtherStudyFieldActive(true);
    } else {
      setOtherStudyFieldActive(false);
      unregister(`post_other_study_field_${uuid}`);
    }
  };

  const activateOtherGrade = (value) => {
    if (value === "other") {
      setOtherGradeActive(true);
    } else {
      setOtherGradeActive(false);
      unregister(`post_other_grade_${uuid}`);
    }
  };

  useEffect(() => {
    if (getValues(`post_study_field_${uuid}`) === "other") {
      setOtherStudyFieldActive(true);
    }
    if (getValues(`post_degree_level_${uuid}`) === "other") {
      setOtherDegreeLevelActive(true);
    }
    if (getValues(`post_grade_${uuid}`) === "other") {
      setOtherGradeActive(true);
    }
  }, []);
  return (
    <>
      <div
        className="col-sm-12 col-md-12"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div className={styles.location_heading}>
          <h4> Post-Graduation </h4>
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

      <TextInput
        label="University Name"
        placeholder="e.g., Ain Shams University"
        name={`post_university_name_${uuid}`}
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
        name={`post_country_${uuid}`}
        registerFields={{
          required: {
            value: true,
            message: "This field is required.",
          },
        }}
        options={
          <>
            <option value="">Select country</option>
            {country?.map((val) => {
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
      />

      <SelectInput
        label="Grade"
        name={`post_grade_${uuid}`}
        registerFields={{
          required: {
            value: true,
            message: "This field is required.",
          },
        }}
        options={
          <>
            <option value="">Select grade</option>
            {grade?.map((val) => {
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
            activateOtherGrade(e.target.value);
          },
        }}
      />

      {otherGradeActive && (
        <TextInput
          label="Please Specify Other"
          // placeholder="e.g. phd level"
          name={`post_other_grade_${uuid}`}
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
        label="Degree Level"
        name={`post_degree_level_${uuid}`}
        registerFields={{
          required: {
            value: true,
            message: "This field is required.",
          },
        }}
        options={
          <>
            <option value="">Select</option>
            {postDegreeLevel?.map((val) => {
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
            activateOtherDegreeLevel(e.target.value);
          },
        }}
      />

      {otherDegreeLevelActive && (
        <TextInput
          label="Please Specify Other"
          // placeholder="e.g. phd level"
          name={`post_other_degree_level_${uuid}`}
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
        label="Field of Study"
        placeholder="e.g., Business, Engineering"
        name={`post_study_field_${uuid}`}
        registerFields={{
          required: {
            value: true,
            message: "This field is required.",
          },
        }}
        register={register}
        errors={errors}
      />
      {/* <SelectInput
        label="Field of Study"
        name={`post_study_field_${uuid}`}
        registerFields={{
          required: {
            value: true,
            message: "This field is required.",
          },
        }}
        options={
          <>
            <option value="">Select</option>
            <option value="Business">Business</option>
            {studyField?.map((val) => {
              return (
                <option value={val.id} key={val.id}>
                  {val.name}
                </option>
              );
            })}
            <option value="other">Other</option>
          </>
        }
        register={register}
        errors={errors}
        otherFields={{
          onChange: (e) => {
            activateOtherStudyField(e.target.value);
          },
        }}
      /> */}

      {otherStydyFieldActive && (
        <TextInput
          label="Please Specify Other"
          // placeholder="e.g. Applied Science"
          name={`post_other_study_field_${uuid}`}
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

      <div className="col-sm-12 col-md-12">
        <div className={styles.location_heading}>
          <h4>Dates</h4>
        </div>
      </div>
      <YearNumberInput
        label="Start Year"
        placeholder="2013"
        name={`post_start_year_${uuid}`}
        registerFields={{
          required: {
            value: true,
            message: "This field is required.",
          },
          min: {
            value: "1950",
            message: "Cannot be less than 1950",
          },
          max: {
            value: +moment().format("YYYY") + 1,
            message: "Cannot be more than current year.",
          },
        }}
        register={register}
        errors={errors}
        colClass="col-sm-4 col-md-4"
      />
      <YearNumberInput
        label="End Year"
        placeholder="2019"
        name={`post_end_year_${uuid}`}
        registerFields={{
          required: {
            value: true,
            message: "This field is required.",
          },
        }}
        register={register}
        errors={errors}
        colClass="col-sm-4 col-md-4"
      />
    </>
  );
};

export default PostGraduation;
