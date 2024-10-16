import React, { useEffect, useState } from "react";
import styles from "@/styles/create_cv_steps.module.css";
import {
  NumberInput,
  SelectInput,
  TextInput,
  YearNumberInput,
} from "../cv/inputFields";
import moment from "moment";
import { useTranslation } from "react-i18next";

const University = ({
  register,
  errors,
  unregister,
  country,
  uuid,
  index,
  grade,
  degreeLevel,
  studyField,
  setUniversityArray,
  getValues,
}) => {
  const { t } = useTranslation('common');
  const [otherStydyFieldActive, setOtherStudyFieldActive] = useState(false);
  const [otherDegreeLevelActive, setOtherDegreeLevelActive] = useState(false);
  const [otherGradeActive, setOtherGradeActive] = useState(false);

  const deleteHandler = (uuid) => {
    setUniversityArray((prev) => {
      return prev.filter((elem) => elem !== uuid);
    });
    unregister(`graduation_university_name_${uuid}`);
    unregister(`university_country_${uuid}`);
    unregister(`graduation_grade_${uuid}`);
    unregister(`graduation_degree_level_${uuid}`);
    unregister(`graduation_study_field_${uuid}`);
    unregister(`graduation_start_year_${uuid}`);
    unregister(`graduation_end_year_${uuid}`);
  };

  const activateOtherStudyField = (value) => {
    if (value === "other") {
      setOtherStudyFieldActive(true);
    } else {
      setOtherStudyFieldActive(false);
      unregister(`graduation_other_study_field_${uuid}`);
    }
  };

  const activateOtherDegreeLevel = (value) => {
    if (value === "other") {
      setOtherDegreeLevelActive(true);
    } else {
      setOtherDegreeLevelActive(false);
      unregister(`graduation_other_degree_level_${uuid}`);
    }
  };

  const activateOtherGrade = (value) => {
    if (value === "other") {
      setOtherGradeActive(true);
    } else {
      setOtherGradeActive(false);
      unregister(`graduation_other_grade_${uuid}`);
    }
  };

  useEffect(() => {
    if (getValues(`graduation_study_field_${uuid}`) === "other") {
      setOtherStudyFieldActive(true);
    }
    if (getValues(`graduation_degree_level_${uuid}`) === "other") {
      setOtherDegreeLevelActive(true);
    }
    if (getValues(`graduation_grade_${uuid}`) === "other") {
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
          <h4>{t("University")} </h4>
        </div>
        {index > 0 && (
          <div>
            <a
              href="javascript:void(0);"
              className="btn btn-primary"
              onClick={() => deleteHandler(uuid)}
            >
              <i className="fas fa-minus"></i> {t("Remove")}
            </a>
          </div>
        )}
      </div>
      <TextInput
        label={t("University Name")}
        placeholder="e.g., Ain Shams University"
        name={`graduation_university_name_${uuid}`}
        registerFields={{
          required: {
            value: true,
            message: t("This field is required."),
          },
        }}
        register={register}
        errors={errors}
      />
      <SelectInput
        label={t("Country")}
        name={`university_country_${uuid}`}
        registerFields={{
          required: {
            value: true,
            message: t("This field is required."),
          },
        }}
        options={
          <>
            <option value="">{t("Select country")}</option>
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
        label={t("Grade")}
        name={`graduation_grade_${uuid}`}
        registerFields={{
          required: {
            value: true,
            message: t("This field is required."),
          },
        }}
        options={
          <>
            <option value="">{t("Select grade")}</option>
            {grade?.map((val) => {
              return (
                <option value={val.id} key={val.id}>
                  {t(val.name)}
                </option>
              );
            })}
            <option value="other">{t("Others")}</option>
          </>
        }
        register={register}
        errors={errors}
        onChangeFunc={(e)=>{
          activateOtherGrade(e.target.value);
        }}
      />
      {otherGradeActive && (
        <TextInput
          label="Please Specify Other"
          // placeholder="e.g. Applied Science"
          name={`graduation_other_grade_${uuid}`}
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
        label={t("Degree Level")}
        name={`graduation_degree_level_${uuid}`}
        registerFields={{
          required: {
            value: true,
            message: t("This field is required."),
          },
        }}
        options={
          <>
            <option value="">{t("Select")}</option>
            {degreeLevel?.map((val) => {
              return (
                <option value={val.id} key={val.id}>
                  {t(val.name)}
                </option>
              );
            })}
            <option value="other">{t("Others")}</option>
          </>
        }
        register={register}
        errors={errors}
        onChangeFunc={(e)=>{
          activateOtherDegreeLevel(e.target.value);
        }}
      />
      {otherDegreeLevelActive && (
        <TextInput
          label={t("Please Specify Other")}
          // placeholder="e.g. Applied Science"
          name={`graduation_other_degree_level_${uuid}`}
          registerFields={{
            required: {
              value: true,
              message: t("This field is required."),
            },
          }}
          register={register}
          errors={errors}
        />
      )}

      <TextInput
        label={t("Field of Study")}
        placeholder={t("e.g., Business, Engineering")}
        name={`graduation_study_field_${uuid}`}
        registerFields={{
          required: {
            value: true,
            message: t("This field is required."),
          },
        }}
        register={register}
        errors={errors}
      />
      {/* <SelectInput
        label="Field of Study"
        name={`graduation_study_field_${uuid}`}
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
            <option value="other">Others</option>
          </>
        }
        register={register}
        errors={errors}
      /> */}

      {otherStydyFieldActive && (
        <TextInput
          label={t("Please Specify Other")}
          // placeholder="e.g. Applied Science"
          name={`graduation_other_study_field_${uuid}`}
          registerFields={{
            required: {
              value: true,
              message: t("This field is required."),
            },
          }}
          register={register}
          errors={errors}
        />
      )}
      <div className="col-sm-12 col-md-12">
        <div className={styles.location_heading}>
          <h4>{t("Dates")}</h4>
        </div>
      </div>
      <YearNumberInput
        label={t("Start Year")}
        placeholder="YYYY"
        name={`graduation_start_year_${uuid}`}
        registerFields={{
          required: {
            value: true,
            message: t("This field is required."),
          },
          min: {
            value: "1950",
            message: t("Cannot be less than 1950"),
          },
          max: {
            value: +moment().format("YYYY") + 1,
            message: t("Cannot be more than current year."),
          },
        }}
        register={register}
        errors={errors}
        colClass="col-sm-4 col-md-4"
      />
      <YearNumberInput
        label={t("End Year")}
        placeholder="2019"
        name={`graduation_end_year_${uuid}`}
        registerFields={{
          required: {
            value: true,
            message: t("This field is required."),
          },
        }}
        register={register}
        errors={errors}
        colClass="col-sm-4 col-md-4"
      />
    </>
  );
};

export default University;
