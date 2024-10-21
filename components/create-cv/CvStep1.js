import React, { useEffect, useRef } from "react";

import styles from "@/styles/create_cv_steps.module.css";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'
import { parsePhoneNumberFromString, isValidPhoneNumber } from 'libphonenumber-js';
import { useTranslation } from "react-i18next";


import {
  NumberInput,
  SelectInput,
  TextAreaInput,
  TextInput,
} from "../cv/inputFields";
import { useForm } from "react-hook-form";

const CvStep1 = ({
  profilePicUrl,
  coverPicUrl,
  setSelectedProfilePic,
  setProfilePicUrl,
  setSelectedCoverPic,
  setCoverPicUrl,
  register,
  errors,
  disableField,
  country,
  nationality,
  cities,
  areas,
  handleSubmit,
  onSubmit,
  countrySelectedHandler,
  areaSelecetHandler,
  mode,
  setToRemoveProfilePic,
  setToRemoveCoverPic,
  watch,
  setValue
}) => {

  console.log("errors : ", errors);

  const { t } = useTranslation('common');

  const removePhotoHandler = () => {
    setSelectedProfilePic(null);
    setProfilePicUrl(null);
    setToRemoveProfilePic(true);
  };

  const removeCoverHandler = () => {
    setSelectedCoverPic(null);
    setCoverPicUrl(null);
    setToRemoveCoverPic(true);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const parsedNumber = parsePhoneNumberFromString(phoneNumber);
    if (parsedNumber && parsedNumber.countryCallingCode == "20") {
      if ((phoneNumber.length - 3) > 10) {
        return false
      } else {
        return true
      }
    } else {
      return parsedNumber && isValidPhoneNumber(phoneNumber);
    }
  };

  // Watch the values of both inputs
  const mobileNumber = watch('contact_mobile');
  const altMobileNumber = watch('contact_alt_mobile');

  const mobileNumberRef = useRef(null);
  const altMobileNumberRef = useRef(null);

  const myhandleSubmit = () => {


    if (errors["contact_mobile"]) {
      if (mobileNumberRef.current) {
        mobileNumberRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return false
    }

    if (errors["contact_alt_mobile"]) {
      if (altMobileNumberRef.current) {
        altMobileNumberRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return false
    }

    handleSubmit(onSubmit)();
  }

  return (
    <div className={` ${styles.land_ar} ${styles.dash_wrapper}`}>
      <h2 className={styles.inner_heading}>{t("Personal Info")}</h2>
      <div className={styles.form_wrapper}>
        <form>
          <div className="row g-4">
            <div className="col-sm-12 col-md-12">
              <label className={styles.form_label}>{t("Upload Photo For CV")}</label>
              <div className={styles.manage_content_box}>
                <div className={styles.upload_img_block}>
                  <div className={styles.avatar_upload}>
                    <div className={styles.avatar_edit}>
                      <input
                        type="file"
                        id="imageUpload"
                        accept=".png, .jpg, .jpeg"
                        name="profile_pic"
                        onChange={(e) => {
                          setSelectedProfilePic(e.target.files[0]);
                          setProfilePicUrl(
                            URL.createObjectURL(e.target.files[0])
                          );
                          setToRemoveProfilePic(false);
                        }}
                      />
                    </div>
                    <div className="mobile_img_block">
                      <div className={styles.avatar_preview}>
                        <div
                          id="imagePreview"
                          style={{
                            backgroundImage: `url('${profilePicUrl
                              ? profilePicUrl
                              : "/img/user-icon2.jpg"
                              }')`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="btn_droup">
                      <div className={styles.upload_btn_label}>
                        <label htmlFor="imageUpload">{t("Upload Photo")}</label>
                      </div>
                      {profilePicUrl && (
                        <div className={styles.upload_btn_label}>
                          <label htmlFor="" onClick={removePhotoHandler}>
                            {t("Remove Photo")}
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-12">
              <div
                className={`${styles.manage_content_box} ${styles.upload_cover}`}
              >
                <div className={styles.upload_img_block}>
                  <div className={styles.avatar_upload}>
                    <div className={styles.avatar_edit}>
                      <input
                        type="file"
                        id="imageUpload2"
                        accept=".png, .jpg, .jpeg"
                        name="cover_pic"
                        onChange={(e) => {
                          setSelectedCoverPic(e.target.files[0]);
                          setCoverPicUrl(
                            URL.createObjectURL(e.target.files[0])
                          );
                          setToRemoveCoverPic(false);
                        }}
                      />
                    </div>
                    <div className={styles.avatar_preview}>
                      <div
                        id="imagePreview2"
                        style={{
                          backgroundImage: `url('${coverPicUrl ? coverPicUrl : "/img/cover-pic2.png"
                            }')`,
                        }}
                      ></div>
                    </div>
                    <div className="btn_droup">
                      <div className={styles.upload_btn_label}>
                        <label htmlFor="imageUpload2">{t("Upload Cover")}</label>
                      </div>
                      {coverPicUrl && (
                        <div className={styles.upload_btn_label}>
                          <label htmlFor="" onClick={removeCoverHandler}>
                            {t("Remove Cover")}
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <TextInput
              label={t("First Name")}
              placeholder={t("First Name")}
              name="first_name"
              register={register}
              errors={errors}
              registerFields={{
                required: {
                  value: true,
                  message: t("This field is required."),
                },
                pattern: {
                  value: /^[a-zA-Z- ]*$/,
                  message: "Please provide a valid first name.",
                },
              }}
              otherFields={{
                disabled: !!disableField,
                id: "first_name",
              }}
            />

            <TextInput
              label={t("Last Name")}
              placeholder={t("Last Name")}
              name="last_name"
              register={register}
              errors={errors}
              registerFields={{
                required: {
                  value: true,
                  message: t("This field is required."),
                },
                pattern: {
                  value: /^[a-zA-Z- ]*$/,
                  message: "Please provide a valid last name.",
                },
              }}
              otherFields={{
                disabled: !!disableField,
                id: "last_name",
              }}
            />

            <TextInput
              label={t("Middle Name")}
              placeholder={t("Middle Name")}
              name="middle_name"
              register={register}
              errors={errors}
              registerFields={{
                required: {
                  value: false
                },
                pattern: {
                  value: /^[a-zA-Z-]+$/,
                  message: t("Please provide a valid middle name.")
                },
              }}
            />

            <div className="col-sm-12 col-md-12">
              <div className="input_block">
                <label className={styles.form_label}> {t("Birthday")}</label>
                <input
                  type="date"
                  className={`${styles.form_control} ${styles.date_fix}  form-control`}
                  // className={`form-control`}
                  max={new Date().toISOString().split("T")[0]}
                  placeholder={t("start")}
                  name="dob"
                  {...register("dob", {
                    required: {
                      value: true,
                      message: t("This field is required."),
                    },
                  })}
                />
                {errors?.["dob"] && (
                  <div className="invalid-feedback d-block">
                    {errors?.["dob"].message}
                  </div>
                )}
              </div>
            </div>

            <SelectInput
              label={t("Nationality")}
              name={t("nationality")}
              register={register}
              errors={errors}
              registerFields={{
                required: {
                  value: true,
                  message: t("This field is required."),
                },
              }}
              options={
                <>
                  <option value="">{t("Select Nationality")} </option>
                  {nationality?.map((val) => {
                    return (
                      <option value={val.id} key={val.id}>
                        {val.name}
                      </option>
                    );
                  })}
                </>
              }
            />

            <div className="col-sm-12 col-md-12">
              <div className="input_block">
                <label className={styles.form_label}>{t("Marital Status")}</label>
                <div className={styles.radio_block}>
                  <div className={`${styles.form_check} form-check`}>
                    <input
                      className={`${styles.form_check_input} form-check-input`}
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault2"
                      value="single"
                      {...register("martial_status", {
                        required: {
                          value: true,
                          message: t("This field is required"),
                        },
                      })}
                    />
                    <label
                      className={`${styles.form_check_label} form-check-label`}
                      htmlFor="flexRadioDefault2"
                    >
                      {t("Single")}
                    </label>
                  </div>
                  <div className={`${styles.form_check} form-check`}>
                    <input
                      className={`${styles.form_check_input} form-check-input`}
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault3"
                      value="married"
                      {...register("martial_status", {
                        required: {
                          value: true,
                          message: t("This field is required"),
                        },
                      })}
                    />
                    <label
                      className={`${styles.form_check_label} form-check-label`}
                      htmlFor="flexRadioDefault3"
                    >
                      {t("Married")}
                    </label>
                  </div>
                  <div className={`${styles.form_check} form-check`}>
                    <input
                      className={`${styles.form_check_input} form-check-input`}
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault1"
                      value="unspecified"
                      {...register("martial_status", {
                        required: {
                          value: true,
                          message: "This field is required",
                        },
                      })}
                    />
                    <label
                      className={`${styles.form_check_label} form-check-label`}
                      htmlFor="flexRadioDefault1"
                    >{t("Unspecified")}
                    </label>
                  </div>
                </div>
                {errors?.["martial_status"] && (
                  <div className="invalid-feedback d-block">
                    {errors?.["martial_status"].message}
                  </div>
                )}
              </div>
            </div>
            <div className="col-sm-12 col-md-12">
              <div className="input_block">
                <label className={styles.form_label}>
                  {t("Do You Have a Driving Lisence?")}
                </label>
                <div className={styles.radio_block}>
                  <div className={`${styles.form_check} form-check`}>
                    <input
                      className={`${styles.form_check_input} form-check-input`}
                      type="radio"
                      name="Lisence"
                      id="Lisence1"
                      value="1"
                      {...register("have_driving_licence", {
                        required: {
                          value: true,
                          message: "This field is required",
                        },
                      })}
                    />
                    <label
                      className={`${styles.form_check_label} form-check-label`}
                      htmlFor="Lisence1"
                    >
                      {t("Yes")}
                    </label>
                  </div>
                  <div className={`${styles.form_check} form-check`}>
                    <input
                      className={`${styles.form_check_input} form-check-input`}
                      type="radio"
                      name="Lisence"
                      id="Lisence2"
                      value="0"
                      {...register("have_driving_licence", {
                        required: {
                          value: true,
                          message: "This field is required",
                        },
                      })}
                    />
                    <label
                      className={`${styles.form_check_label} form-check-label`}
                      htmlFor="Lisence2"
                    >
                      {t("No")}
                    </label>
                  </div>
                </div>
                {errors?.["have_driving_licence"] && (
                  <div className="invalid-feedback d-block">
                    {errors?.["have_driving_licence"].message}
                  </div>
                )}
              </div>
            </div>
            <div className="col-sm-12 col-md-12">
              <div className={styles.location_heading}>
                <h4>{t("Current Location")}</h4>
              </div>
            </div>

            <SelectInput
              label={t("Country")}
              name="current_country"
              register={register}
              errors={errors}
              registerFields={{
                required: {
                  value: true,
                  message: t("This field is required."),
                },
              }}
              options={
                <>
                  <option value="">{t("Select Country")}</option>
                  {country?.map((val) => {
                    return (
                      <option value={val.id} key={val.id}>
                        {val.name}
                      </option>
                    );
                  })}
                </>
              }
              onChangeFunc={(e) => countrySelectedHandler(e.target.value)}
            // otherFields={{
            //   onChange: (e) => countrySelectedHandler(e.target.value),
            // }}
            />

            <SelectInput
              label={t("City")}
              name="current_city"
              register={register}
              errors={errors}
              registerFields={{
                required: {
                  value: true,
                  message: t("This field is required."),
                },
              }}
              options={
                <>
                  <option value="">{t("Select City")}</option>
                  {cities?.map((val) => {
                    return (
                      <option value={val.id} key={val.id}>
                        {val.name}
                      </option>
                    );
                  })}
                </>
              }
              onChangeFunc={(e) => {
                areaSelecetHandler(e.target.value)
                setValue("current_area", "")
              }}
            />


            <SelectInput
              label={t("Area")}
              name="current_area"
              register={register}
              errors={errors}
              registerFields={{
                required: {
                  value: true,
                  message: t("This field is required."),
                },
              }}
              onChangeFunc={(e) => {
                setValue("current_area", e.target.value)
              }}
              options={
                <>
                  <option value="" selected>{t("Select Area")}</option>
                  {
                    areas?.map(d => (

                      <option value={d.id}>{d.name}</option>
                    ))
                  }
                  <option value="other">{t("Others")}</option>

                </>
              }
            />

            {
              watch("current_area") == "other" && (

                <TextInput
                  label={t("Other Area")}
                  name="current_other_area"
                  placeholder={t("Please Enter Area")}
                  register={register}
                  errors={errors}
                  registerFields={{
                    required: {
                      value: true,
                      message: t("This field is required."),
                    },
                  }}
                />
              )
            }

            <div className="col-sm-12 col-md-12">
              <div className="input_block">
                <label className={styles.form_label}>
                  {t("You want to relocate to another country")}
                </label>
                <div className={styles.radio_block}>
                  <div className={`${styles.form_check} form-check`}>
                    <input
                      className={`${styles.form_check_input} form-check-input`}
                      type="radio"
                      name="country"
                      id="country1"
                      value="1"
                      {...register("want_to_relocate", {
                        required: {
                          value: true,
                          message: t("This field is required."),
                        },
                      })}
                    />
                    <label
                      className={`${styles.form_check_label} form-check-label`}
                      htmlFor="country1"
                    >
                      {t("Yes")}
                    </label>
                  </div>
                  <div className={`${styles.form_check} form-check`}>
                    <input
                      className={`${styles.form_check_input} form-check-input`}
                      type="radio"
                      name="country"
                      id="country2"
                      value="0"
                      {...register("want_to_relocate", {
                        required: {
                          value: true,
                          message: "This field is required.",
                        },
                      })}
                    />
                    <label
                      className={`${styles.form_check_label} form-check-label`}
                      htmlFor="country2"
                    >
                      {t("No")}
                    </label>
                  </div>
                </div>
                {errors?.["want_to_relocate"] && (
                  <div className="invalid-feedback d-block">
                    {errors?.["want_to_relocate"].message}
                  </div>
                )}
              </div>
            </div>

            <div className="col-sm-12 col-md-12">
              <div className={styles.location_heading}>
                <h4>{t("Contact Info")}</h4>
              </div>
            </div>

            <div ref={mobileNumberRef}>
              <label htmlFor="contact_mobile" className={styles.form_label}>{t("Mobile Number")}</label>
              <PhoneInput
                // inputClass={`${styles.form_control} form-control`}
                value={mobileNumber}
                countryCodeEditable={true}
                inputStyle={{ width: "100%" }}
                containerStyle={{ width: "100%" }}
                country={"eg"}
                enableSearch={true}
                inputProps={{
                  name: 'contact_mobile',
                  required: true,
                  autoFocus: false
                }}

                {...register("contact_mobile", {
                  required: {
                    value: true,
                    message: t("This field is required."),
                  },
                  validate: {
                    notSameAsAlt: value => value !== altMobileNumber || t("Mobile number and alternative number must not be the same."),
                    isValidPhone: value => {
                      if (value && !validatePhoneNumber(`+${value}`)) {
                        return t("Please enter a valid phone number")
                      }
                    },
                  }
                })}
                onChange={(value) => setValue('contact_mobile', value, { shouldValidate: true })}
              />
              {errors.contact_mobile && <p className="text-danger">{errors.contact_mobile.message}</p>}
            </div>

            {/* <NumberInput
              label="Mobile Number (+2)"
              name="contact_mobile"
              placeholder="07542132659"
              register={register}
              errors={errors}
              registerFields={{
                required: {
                  value: true,
                  message: "This field is required.",
                },
                pattern: {
                  value: /^\d{11}$/,
                  message: "Please provide a valid 11 digit mobile number.",
                },
                validate: {
                  notSameAsAlt: value => value !== altMobileNumber || "Mobile number and alternative number must not be the same."
                }
              }}
            /> */}


            {/* <div ref={altMobileNumberRef}>
              <label htmlFor="contact_alt_mobile" className={styles.form_label}>{t("Alternative Number")}</label>
              <PhoneInput
                // inputClass={`${styles.form_control} form-control`}
                value={altMobileNumber}
                inputStyle={{width: "100%"}}
                containerStyle={{width: "100%"}}
                enableSearch={true}
                inputProps={{
                  name: 'contact_alt_mobile',
                  required: false,
                  autoFocus: false
                }}
                {...register("contact_alt_mobile", {
                  required: {
                    value: false,
                    message: "This field is required.",
                  },
                  validate: {
                    // notSameAsAlt: value =>  value !== mobileNumber || t("Mobile number and alternative number must not be the same."),
                    isValidPhone: value => {       
                      if(value && mobileNumber && value !== mobileNumber)     {
                        return t("Mobile number and alternative number must not be the same.")
                      }          
                      if(value && !validatePhoneNumber(`+${value}`)){
                        return t("Please enter a valid phone number")
                      }
                    }
                  }
                })}
                onChange={(value) => setValue('contact_alt_mobile', value, { shouldValidate: true })}
              />
              {errors.contact_alt_mobile && <p className="text-danger">{errors.contact_alt_mobile.message}</p>}
            </div> */}

            <div ref={altMobileNumberRef}>
              <label htmlFor="contact_alt_mobile" className={styles.form_label}>{t("Alternative Number")}</label>
              <PhoneInput
                // inputClass={`${styles.form_control} form-control`}
                value={altMobileNumber}
                countryCodeEditable={true}
                inputStyle={{ width: "100%" }}
                containerStyle={{ width: "100%" }}
                country={"eg"}
                enableSearch={true}
                inputProps={{
                  name: 'contact_alt_mobile',
                  required: false,
                  autoFocus: false
                }}

                {...register("contact_alt_mobile", {
                  required: {
                    value: false,
                    message: t("This field is required."),
                  },
                  validate: {
                    notSameAsAlt: value => value !== mobileNumber || t("Mobile number and alternative number must not be the same."),
                    isValidPhone: value => {
                      if (value && !validatePhoneNumber(`+${value}`)) {
                        return t("Please enter a valid phone number")
                      }
                    },
                  }
                })}
                onChange={(value) => setValue('contact_alt_mobile', value, { shouldValidate: true })}
              />
              {errors.contact_alt_mobile && <p className="text-danger">{errors.contact_alt_mobile.message}</p>}
            </div>


            {/* <NumberInput
              label="Alternative Number"
              name="contact_alt_mobile"
              placeholder="07542132659"
              register={register}
              errors={errors}
              registerFields={{
                required: {
                  value: false,
                  message: "This field is required.",
                },
                pattern: {
                  value: /^\d{11}$/,
                  message: "Please provide a valid 11 digit mobile number.",
                },
                validate: {
                  notSameAsMobile: value => value !== mobileNumber || "Mobile number and alternative number must not be the same."
                }
              }}
            /> */}

            <TextInput
              label={t("Email")}
              placeholder={t("Email")}
              name="contact_email"
              register={register}
              errors={errors}
              registerFields={{
                required: {
                  value: true,
                  message: t("This field is required."),
                },
                pattern: {
                  value: /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/,
                  message: t("Please provide a valid email."),
                },
              }}
            />

            <TextInput
              label={t("LinkedIn URL")}
              placeholder={t("LinkedIn URL")}
              name="linked_in"
              register={register}
              registerFields={{
                required: { value: false, message: t('LinkedIn URL is required') },
                pattern: {
                  value: !/^https?:\/\/(www\.)?linkedin\.com\/(in|company|school)\/.+\/?$/,
                  message: t('Please enter a valid LinkedIn URL')
                }
              }}
              errors={errors}
            />

            <div className="col-sm-12 col-md-12">
              <div className={styles.location_heading}>
                <h4>{t("About me")}</h4>
              </div>
            </div>

            <TextAreaInput
              label={t("Write info about you")}
              placeholder={t("Write info about you")}
              name="about"
              register={register}
              errors={errors}
              registerFields={{
                required: {
                  value: true,
                  message: t("This field is required."),
                },
              }}
              otherFields={{
                id: "exampleFormControlTextarea1",
                rows: "3",
              }}
            />

            <div className="col-sm-12 col-md-12">
              <div className={styles.next_pre_btn}>
                <div></div>
                <button
                  type="button"
                  className={`btn btn-primary ${styles.dash_theem_btn}`}
                  onClick={myhandleSubmit}
                >
                  {t("Next Step")}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CvStep1;
