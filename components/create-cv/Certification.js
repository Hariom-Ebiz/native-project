import React, { useEffect, useState } from "react";
import styles from "@/styles/create_cv_steps.module.css";
import { YearNumberInput, SelectInput, TextInput } from "../cv/inputFields";
import moment from "moment";
import { useTranslation } from "react-i18next";

const Certification = ({
  register,
  errors,
  unregister,
  country,
  index,
  uuid,
  studyTopic,
  studyField,
  setCertificationArray,
  watch,
  getValues,
}) => {
  const { t } = useTranslation('common');
  const [otherStydyFieldActive, setOtherStudyFieldActive] = useState(false);
  const [otherTopicActive, setOtherTopicActive] = useState(false);
  // const watch1 = watch();
  const deleteHandler = (uuid) => {
    setCertificationArray((prev) => {
      return prev.filter((elem) => elem !== uuid);
    });
    unregister(`certification_institution_name_${uuid}`);
    unregister(`certification_country_${uuid}`);
    unregister(`certification_study_field_${uuid}`);
    unregister(`certification_topic_${uuid}`);
    unregister(`certification_year_${uuid}`);
  };
  // useEffect(() => {
  //   console.log("watch1", watch1)
  // }, [watch1]);

  const activateOtherStudyField = (value) => {
    if (value === "other") {
      setOtherStudyFieldActive(true);
    } else {
      setOtherStudyFieldActive(false);
      unregister(`certification_other_study_field_${uuid}`);
    }
  };

  const activateOtherTopic = (value) => {
    if (value === "other") {
      setOtherTopicActive(true);
    } else {
      setOtherTopicActive(false);
      unregister(`certification_other_topic_${uuid}`);
    }
  };

  useEffect(() => {
    if (getValues(`certification_study_field_${uuid}`) === "other") {
      setOtherStudyFieldActive(true);
    }
    if (getValues(`certification_topic_${uuid}`) === "other") {
      setOtherTopicActive(true);
    }
  }, []);
  return (
    <>
      <div
        className="col-sm-12 col-md-12"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div className={styles.location_heading}>
          <h4>{t("Certification")} </h4>
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
        label={t("Organization/institution Name")}
        placeholder={t("e.g. Ain Shams University")}
        name={`certification_institution_name_${uuid}`}
        registerFields={{
          required: {
            value: false,
            message: t("This field is required."),
          },
        }}
        register={register}
        errors={errors}
      />
      <SelectInput
        label={t("Country")}
        name={`certification_country_${uuid}`}
        registerFields={{
          required: {
            value: false,
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
        label={t("Field of Study")}
        name={`certification_study_field_${uuid}`}
        registerFields={{
          required: {
            value: false,
            message: t("This field is required."),
          },
        }}
        options={
          <>
            <option value="">{t("Select")}</option>
            {studyField?.map((val) => {
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
          activateOtherStudyField(e.target.value);
        }}
      />
      {otherStydyFieldActive && (
        <TextInput
          label={t("Please Specify Other")}
          // placeholder="e.g. Applied Science"
          name={`certification_other_study_field_${uuid}`}
          registerFields={{
            required: {
              value: false,
              message: t("This field is required."),
            },
          }}
          register={register}
          errors={errors}
        />
      )}
      <TextInput
        label={t("Topic")}
        placeholder={t("e.g., Marketing, Project Management")}
        name={`certification_topic_${uuid}`}
        registerFields={{
          required: {
            value: false,
            message: t("This field is required."),
          },
        }}
        register={register}
        errors={errors}
      />
      {/* <SelectInput
        label="Topic"
        name={`certification_topic_${uuid}`}
        registerFields={{
          required: {
            value: true,
            message: "This field is required.",
          },
        }}
        options={
          <>
            <option value="">Select</option>
            {studyTopic?.map((val) => {
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
      {/* {otherTopicActive && (
        <TextInput
          label="Please Specify Other"
          // placeholder="e.g. Applied Science"
          name={`certification_other_topic_${uuid}`}
          registerFields={{
            required: {
              value: true,
              message: "This field is required.",
            },
          }}
          register={register}
          errors={errors}
        />
      )} */}
      <YearNumberInput
        label={t("Certification Year")}
        placeholder="2019"
        name={`certification_year_${uuid}`}
        registerFields={{
          required: {
            value: false,
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
    </>
  );
};

export default Certification;
