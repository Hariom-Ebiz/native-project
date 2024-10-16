import React, { useEffect, useState } from "react";

import styles from "@/styles/create_cv_steps.module.css";

import {
  NumberInput,
  SelectInput,
  TextAreaInput,
  TextInput,
  YearNumberInput,
} from "../cv/inputFields";
import University from "./University";
import PostGraduation from "./PostGraduation";
import Certification from "./Certification";
import Link from "next/link";

const CvStep2 = ({
  register,
  errors,
  country,
  handleSubmit,
  onSubmit,
  graduationCertificate,
  grade,
  universityArray,
  unregister,
  degreeLevel,
  studyField,
  setUniversityArray,
  getValues,
  postGraduationArray,
  postDegreeLevel,
  setPostGraduationArray,
  certificationArray,
  studyTopic,
  setCertificationArray,
  universityAddHandler,
  postGraduationAddHandler,
  certificationAddHandler,
  mode,
}) => {
  const [
    otherGraduationCertificateActive,
    setOtherGraduationCertificateActive,
  ] = useState(false);
  const [otherGraduationGradeActive, setOtherGraduationGradeActive] =
    useState(false);

  const activateOtherGraduationCertificate = (value) => {
    if (value === "other") {
      setOtherGraduationCertificateActive(true);
    } else {
      setOtherGraduationCertificateActive(false);
      unregister(`graduation_other_certificate`);
    }
  };

  const activateOtherGraduationGrade = (value) => {
    if (value === "other") {
      setOtherGraduationGradeActive(true);
    } else {
      setOtherGraduationGradeActive(false);
      unregister(`graduation_other_grade`);
    }
  };

  useEffect(() => {
    if (getValues(`graduation_certificate`) === "other") {
      setOtherGraduationCertificateActive(true);
    }
    if (getValues(`graduation_grade`) === "other") {
      setOtherGraduationGradeActive(true);
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
              d="M8.5786 2.15955L3.43973 5.51433C1.79222 6.58991 1.79222 8.99715 3.43973 10.0727L8.5786 13.4275C9.50052 14.0336 11.02 14.0336 11.9419 13.4275L17.0552 10.0727C18.6941 8.99715 18.6941 6.59844 17.0552 5.52286L11.9419 2.16809C11.02 1.55347 9.50052 1.55347 8.5786 2.15955Z"
              stroke="#FAFBFF"
              strokeWidth="1.28045"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.8059 11.1655L4.79736 15.1691C4.79736 16.2532 5.63392 17.4141 6.65828 17.7556L9.38137 18.6604C9.85087 18.8141 10.6277 18.8141 11.1057 18.6604L13.8288 17.7556C14.8532 17.4141 15.6897 16.2532 15.6897 15.1691V11.2082"
              stroke="#FAFBFF"
              strokeWidth="1.28045"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18.2681 12.8044V7.68262"
              stroke="#FAFBFF"
              strokeWidth="1.28045"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        Education
      </h2>
      <div className={styles.form_wrapper}>
        <form>
          <div className="row g-4">
            <TextInput
              label="High School Name"
              placeholder="Modern Education School"
              name="school_name"
              registerFields={{
                required: {
                  value: true,
                  message: "This field is required.",
                },
              }}
              otherFields={{}}
              register={register}
              errors={errors}
            />
            <SelectInput
              label="Country"
              name="country"
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
              label="Graduation Certificate"
              name="graduation_certificate"
              registerFields={{
                required: {
                  value: true,
                  message: "This field is required.",
                },
              }}
              options={
                <>
                  <option value="">Select</option>

                  {graduationCertificate?.map((val) => {
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
                  activateOtherGraduationCertificate(e.target.value);
                },
              }}
            />

            {otherGraduationCertificateActive && (
              <TextInput
                label="Please Specify Other"
                // placeholder="e.g. phd level"
                name={`graduation_other_certificate`}
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
            <YearNumberInput
              label="Graduation Year"
              placeholder="Graduation Year"
              name="graduation_year"
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
              label="Grade"
              name="graduation_grade"
              registerFields={{
                required: {
                  value: true,
                  message: "This field is required.",
                },
              }}
              options={
                <>
                  <option value="">Select</option>
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
                  activateOtherGraduationGrade(e.target.value);
                },
              }}
            />
            {otherGraduationGradeActive && (
              <TextInput
                label="Please Specify Other"
                // placeholder="e.g. phd level"
                name={`graduation_other_grade`}
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

            {universityArray &&
              universityArray.length > 0 &&
              universityArray.map((uuid, index) => (
                <University
                  key={uuid}
                  index={index}
                  register={register}
                  errors={errors}
                  unregister={unregister}
                  uuid={uuid}
                  grade={grade}
                  degreeLevel={degreeLevel}
                  studyField={studyField}
                  country={country}
                  setUniversityArray={setUniversityArray}
                  getValues={getValues}
                />
              ))}

            <div className="col-sm-12 col-md-12">
              <div className={styles.add_more}>
                <a
                  href="javascript:void(0);"
                  onClick={() => universityAddHandler()}
                >
                  Add One More University
                </a>
              </div>
            </div>

            {postGraduationArray &&
              postGraduationArray.length > 0 &&
              postGraduationArray.map((uuid, index) => (
                <PostGraduation
                  key={uuid}
                  index={index}
                  register={register}
                  errors={errors}
                  unregister={unregister}
                  uuid={uuid}
                  country={country}
                  grade={grade}
                  postDegreeLevel={postDegreeLevel}
                  studyField={studyField}
                  setPostGraduationArray={setPostGraduationArray}
                  getValues={getValues}
                />
              ))}

            <div className="col-sm-12 col-md-12">
              <div className={styles.add_more}>
                <a
                  href="javascript:void(0);"
                  onClick={() => postGraduationAddHandler()}
                >
                  Add Post-Graduation
                </a>
              </div>
            </div>

            {certificationArray &&
              certificationArray.length > 0 &&
              certificationArray.map((uuid, index) => (
                <Certification
                  key={uuid}
                  index={index}
                  register={register}
                  errors={errors}
                  unregister={unregister}
                  uuid={uuid}
                  country={country}
                  studyTopic={studyTopic}
                  studyField={studyField}
                  setCertificationArray={setCertificationArray}
                  getValues={getValues}
                />
              ))}
            <div className="col-sm-12 col-md-12">
              <div className={styles.add_more}>
                <a
                  href="javascript:void(0);"
                  onClick={() => certificationAddHandler()}
                >
                  Add Certification
                </a>
              </div>
            </div>

            <div className="col-sm-12 col-md-12">
              <div className={styles.next_pre_btn}>
                <Link href={`/job-seeker/${mode}-cv/step1`}>
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
                  onClick={handleSubmit(onSubmit)}
                  className={`btn btn-primary ${styles.dash_theem_btn}`}
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

export default CvStep2;
